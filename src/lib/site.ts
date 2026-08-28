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

export const whatsappHref = (phone: string) => `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
