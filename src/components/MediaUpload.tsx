import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
};

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Upload a file to the studio media store and hand back a long-lived URL. */
export function MediaUpload({ label, value, onChange, accept = "image/*,video/*" }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement | null>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
    });
    if (upErr) {
      setError(upErr.message);
      setBusy(false);
      return;
    }
    const { data, error: signErr } = await supabase.storage
      .from("media")
      .createSignedUrl(path, TEN_YEARS);
    if (signErr || !data) setError(signErr?.message ?? "Could not create a link");
    else onChange(data.signedUrl);
    setBusy(false);
  };

  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(value);

  return (
    <div className="space-y-2">
      <span className="caps opacity-55">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a URL or upload a file"
          className="min-w-0 flex-1 border-b border-current/30 bg-transparent py-2 text-sm outline-none focus:border-current"
        />
        <input
          ref={input}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="caps link-underline disabled:opacity-40"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="caps opacity-50 hover:opacity-90">
            Clear
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {value &&
        (isVideo ? (
          <video src={value} muted loop playsInline autoPlay className="h-28 rounded object-cover" />
        ) : (
          <img src={value} alt="" className="h-28 rounded object-cover" />
        ))}
    </div>
  );
}
