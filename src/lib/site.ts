import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HeroSettings = { videoUrl: string; eyebrow: string; caption: string };
export type Panel5Settings = {
  eyebrow: string;
  title: string;
  body: string;
  videoUrl: string;
  caption: string;
};
export type ContactSettings = {
  facebook: string;
  instagram: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
};
export type DeliverySettings = {
  insidePerKg: number;
  outsidePerKg: number;
  insideBase: number;
  outsideBase: number;
  freeAbove: number;
};

export const defaultDelivery: DeliverySettings = {
  insidePerKg: 60,
  outsidePerKg: 120,
  insideBase: 60,
  outsideBase: 120,
  freeAbove: 0,
};

export const defaultContact: ContactSettings = {
  facebook: "https://www.facebook.com/profile.php?id=61577360109655",
  instagram: "https://www.instagram.com/objekthaus_studio_",
  whatsapp: "+8801635592323",
  email: "objekthaus.studio@gmail.com",
  address: "Mirpur-12, Block-D, Road-09, Dhaka-1216, Bangladesh",
  hours: "Thursday – Saturday, by appointment",
};

export const defaultHero: HeroSettings = { videoUrl: "", eyebrow: "", caption: "" };
export const defaultPanel5: Panel5Settings = {
  eyebrow: "",
  title: "",
  body: "",
  videoUrl: "",
  caption: "",
};

async function fetchSetting<T>(key: string, fallback: T): Promise<T> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error || !data) return fallback;
  return { ...fallback, ...((data.value ?? {}) as Partial<T>) };
}

export function useSetting<T>(key: string, fallback: T) {
  return useQuery({
    queryKey: ["site_settings", key],
    queryFn: () => fetchSetting<T>(key, fallback),
    initialData: fallback,
    staleTime: 30_000,
  });
}

export const useHero = (): HeroSettings => useSetting<HeroSettings>("hero", defaultHero).data ?? defaultHero;
export const usePanel5 = (): Panel5Settings =>
  useSetting<Panel5Settings>("panel5", defaultPanel5).data ?? defaultPanel5;
export const useContactInfo = (): ContactSettings =>
  useSetting<ContactSettings>("contact", defaultContact).data ?? defaultContact;
export const useDelivery = (): DeliverySettings =>
  useSetting<DeliverySettings>("delivery", defaultDelivery).data ?? defaultDelivery;

export type DeliveryZone = "inside" | "outside";

/** Universal weight-based delivery charge. */
export function deliveryCharge(
  d: DeliverySettings,
  zone: DeliveryZone,
  weightKg: number,
  subtotal: number,
): number {
  if (weightKg <= 0) return 0;
  if (Number(d.freeAbove) > 0 && subtotal >= Number(d.freeAbove)) return 0;
  const base = zone === "inside" ? Number(d.insideBase) : Number(d.outsideBase);
  const perKg = zone === "inside" ? Number(d.insidePerKg) : Number(d.outsidePerKg);
  return Math.round((base || 0) + (perKg || 0) * weightKg);
}

export const whatsappHref = (phone: string) => `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
