import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaUpload } from "@/components/MediaUpload";
import {
  defaultContact,
  defaultHero,
  defaultPanel5,
  useSetting,
  type ContactSettings,
  type HeroSettings,
  type Panel5Settings,
} from "@/lib/site";

export const Route = createFileRoute("/admin/site")({
  component: AdminSite,
});

function useEditor<T extends object>(key: string, fallback: T) {
  const { data } = useSetting<T>(key, fallback);
  const [draft, setDraft] = useState<T>(data);
  const [saved, setSaved] = useState(false);
  const qc = useQueryClient();

  useEffect(() => setDraft(data), [data]);

  const save = async () => {
    await supabase.from("site_settings").upsert({ key, value: draft as never });
    await qc.invalidateQueries({ queryKey: ["site_settings", key] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return { draft, set: (p: Partial<T>) => setDraft({ ...draft, ...p }), save, saved };
}

function Text({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="caps opacity-55">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full resize-none border-b border-current/30 bg-transparent py-2 text-sm outline-none focus:border-current"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full border-b border-current/30 bg-transparent py-2 text-sm outline-none focus:border-current"
        />
      )}
    </label>
  );
}

function SaveRow({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="mt-6 flex items-center gap-5">
      <button type="button" onClick={onSave} className="caps link-underline">
        Save
      </button>
      {saved && <span className="caps opacity-55">Saved</span>}
    </div>
  );
}

function AdminSite() {
  const hero = useEditor<HeroSettings>("hero", defaultHero);
  const panel5 = useEditor<Panel5Settings>("panel5", defaultPanel5);
  const contact = useEditor<ContactSettings>("contact", defaultContact);

  return (
    <div className="space-y-16">
      <section className="border border-current/20 p-6">
        <h2 className="font-display text-3xl font-light">Hero video</h2>
        <p className="mt-2 text-sm opacity-60">
          Replaces the entrance video. Leave empty to keep the original meadow film.
        </p>
        <div className="mt-6 space-y-6">
          <MediaUpload
            label="Hero video"
            accept="video/*"
            value={hero.draft.videoUrl}
            onChange={(v) => hero.set({ videoUrl: v })}
          />
          <Text label="Eyebrow (optional)" value={hero.draft.eyebrow} onChange={(v) => hero.set({ eyebrow: v })} />
          <Text label="Scroll caption" value={hero.draft.caption} onChange={(v) => hero.set({ caption: v })} />
        </div>
        <SaveRow onSave={hero.save} saved={hero.saved} />
      </section>

      <section className="border border-current/20 p-6">
        <h2 className="font-display text-3xl font-light">Fifth panel — Materials</h2>
        <div className="mt-6 space-y-6">
          <Text label="Eyebrow" value={panel5.draft.eyebrow} onChange={(v) => panel5.set({ eyebrow: v })} />
          <Text label="Headline" textarea value={panel5.draft.title} onChange={(v) => panel5.set({ title: v })} />
          <Text
            label="Materials list (one per line)"
            textarea
            value={panel5.draft.body}
            onChange={(v) => panel5.set({ body: v })}
          />
          <MediaUpload
            label="Panel video"
            accept="video/*"
            value={panel5.draft.videoUrl}
            onChange={(v) => panel5.set({ videoUrl: v })}
          />
          <Text label="Caption" value={panel5.draft.caption} onChange={(v) => panel5.set({ caption: v })} />
        </div>
        <SaveRow onSave={panel5.save} saved={panel5.saved} />
      </section>

      <section className="border border-current/20 p-6">
        <h2 className="font-display text-3xl font-light">Contact details</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Text label="Facebook link" value={contact.draft.facebook} onChange={(v) => contact.set({ facebook: v })} />
          <Text label="Instagram link" value={contact.draft.instagram} onChange={(v) => contact.set({ instagram: v })} />
          <Text label="WhatsApp number" value={contact.draft.whatsapp} onChange={(v) => contact.set({ whatsapp: v })} />
          <Text label="Email" value={contact.draft.email} onChange={(v) => contact.set({ email: v })} />
          <Text label="Opening hours" value={contact.draft.hours} onChange={(v) => contact.set({ hours: v })} />
        </div>
        <div className="mt-6">
          <Text label="Address" textarea value={contact.draft.address} onChange={(v) => contact.set({ address: v })} />
        </div>
        <SaveRow onSave={contact.save} saved={contact.saved} />
      </section>
    </div>
  );
}
