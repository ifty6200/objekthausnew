-- 1. Customer profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Admins read profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Design suggestions from customers
CREATE TABLE public.design_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  reference_url text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.design_submissions TO authenticated;
GRANT ALL ON public.design_submissions TO service_role;
ALTER TABLE public.design_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own submissions" ON public.design_submissions FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users create own submissions" ON public.design_submissions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins read submissions" ON public.design_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update submissions" ON public.design_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete submissions" ON public.design_submissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER design_submissions_updated BEFORE UPDATE ON public.design_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Product attributes
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS stock_out boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS weight_kg numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS specs jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 4. Order attributes
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS delivery_zone text NOT NULL DEFAULT 'inside',
  ADD COLUMN IF NOT EXISTS total_weight numeric NOT NULL DEFAULT 0;
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 5. Universal delivery settings
INSERT INTO public.site_settings (key, value)
VALUES ('delivery', '{"insidePerKg": 60, "outsidePerKg": 120, "insideBase": 60, "outsideBase": 120, "freeAbove": 0}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 6. Lock studio access to the studio email only
CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  uid uuid := auth.uid();
  uemail text := lower(coalesce(auth.jwt() ->> 'email', ''));
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF uemail <> 'objekthaus.studio@gmail.com' THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END; $function$;