-- 1. has_role no longer needs elevated rights: every call checks the caller's own role row,
--    which the "Users read own roles" policy already allows.
ALTER FUNCTION public.has_role(uuid, app_role) SECURITY INVOKER;

-- 2. claim_admin is an unused self-elevation path; remove it entirely.
DROP FUNCTION IF EXISTS public.claim_admin();

-- 3. Server-side order pricing: totals are recomputed from the products table and
--    the studio delivery settings, never trusted from the client.
CREATE OR REPLACE FUNCTION public.enforce_order_integrity()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  item jsonb;
  norm jsonb := '[]'::jsonb;
  p RECORD;
  q int;
  sub numeric := 0;
  wt numeric := 0;
  d jsonb;
  base numeric;
  per_kg numeric;
  free_above numeric;
  ship numeric := 0;
BEGIN
  NEW.user_id := auth.uid();
  NEW.status := 'new';

  NEW.customer_name := btrim(coalesce(NEW.customer_name, ''));
  NEW.phone := btrim(coalesce(NEW.phone, ''));
  NEW.address := btrim(coalesce(NEW.address, ''));
  NEW.email := nullif(btrim(coalesce(NEW.email, '')), '');
  NEW.note := nullif(btrim(coalesce(NEW.note, '')), '');

  IF length(NEW.customer_name) < 2 OR length(NEW.customer_name) > 120 THEN
    RAISE EXCEPTION 'invalid customer name';
  END IF;
  IF length(NEW.phone) < 6 OR length(NEW.phone) > 40 THEN
    RAISE EXCEPTION 'invalid phone';
  END IF;
  IF length(NEW.address) < 5 OR length(NEW.address) > 500 THEN
    RAISE EXCEPTION 'invalid address';
  END IF;
  IF NEW.email IS NOT NULL AND (length(NEW.email) > 200 OR NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') THEN
    RAISE EXCEPTION 'invalid email';
  END IF;
  IF NEW.note IS NOT NULL AND length(NEW.note) > 1000 THEN
    RAISE EXCEPTION 'note too long';
  END IF;
  IF NEW.delivery_zone NOT IN ('inside', 'outside') THEN
    NEW.delivery_zone := 'inside';
  END IF;

  IF jsonb_typeof(NEW.items) <> 'array' OR jsonb_array_length(NEW.items) = 0
     OR jsonb_array_length(NEW.items) > 50 THEN
    RAISE EXCEPTION 'invalid order items';
  END IF;

  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
    q := floor(coalesce((item->>'qty')::numeric, 0))::int;
    IF q < 1 OR q > 99 THEN
      RAISE EXCEPTION 'invalid quantity';
    END IF;

    SELECT slug, name, product, price, weight_kg INTO p
    FROM public.products
    WHERE slug = (item->>'slug') AND published = true AND stock_out = false;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'unknown or unavailable object: %', coalesce(item->>'slug', '');
    END IF;

    sub := sub + p.price * q;
    wt := wt + p.weight_kg * q;
    norm := norm || jsonb_build_object(
      'slug', p.slug, 'name', p.name, 'product', p.product,
      'qty', q, 'price', p.price, 'weight_kg', p.weight_kg
    );
  END LOOP;

  SELECT value INTO d FROM public.site_settings WHERE key = 'delivery';
  base := coalesce((d->>'base')::numeric, 60);
  per_kg := coalesce((d->>'perKg')::numeric, 80);
  free_above := coalesce((d->>'freeAbove')::numeric, 0);

  IF wt > 0 AND NOT (free_above > 0 AND sub >= free_above) THEN
    ship := round(base + per_kg * ceil(wt));
  END IF;

  NEW.items := norm;
  NEW.subtotal := sub;
  NEW.total_weight := wt;
  NEW.shipping := ship;
  NEW.total := sub + ship;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_integrity ON public.orders;
CREATE TRIGGER orders_integrity
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.enforce_order_integrity();