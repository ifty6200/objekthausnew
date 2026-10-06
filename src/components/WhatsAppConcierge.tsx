import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { defaultContact, useSetting, whatsappHref, type ContactSettings } from "@/lib/site";

const PRESETS = [
  "I'd like to book a studio visit.",
  "What is the delivery timeline for my area?",
  "Do you take bespoke commissions?",
  "Can you help me track my order?",
];

/** Floating WhatsApp button with preset questions. */
export function WhatsAppConcierge() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const contact = useSetting<ContactSettings>("contact", defaultContact).data ?? defaultContact;
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/admin")) return null;
  const base = whatsappHref(contact.whatsapp || defaultContact.whatsapp);
  const send = (text: string) =>
    window.open(`${base}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  const presets = path.startsWith("/flower/")
    ? [`I have a question about this object: ${window.location.href}`, ...PRESETS]
    : PRESETS;

  return (
    <div className="fixed right-4 bottom-20 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <div className="w-72 border border-current/20 bg-bone p-5 text-bone-foreground shadow-2xl">
          <p className="caps opacity-55">Studio concierge</p>
          <ul className="mt-3 space-y-2">
            {presets.map((p) => (
              <li key={p}>
                <button type="button" onClick={() => send(p)} className="text-left text-sm hover:opacity-60">
                  → {p}
                </button>
              </li>
            ))}
          </ul>
          <form
            className="mt-4 flex gap-2 border-t border-current/20 pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (msg.trim()) send(msg.trim());
            }}
          >
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              maxLength={500}
              placeholder="Write your own…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <button type="submit" className="caps">Send</button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Chat with the studio on WhatsApp"
        className="caps rounded-full bg-ink px-5 py-3 text-bone shadow-xl transition-opacity hover:opacity-85"
      >
        {open ? "Close" : "WhatsApp"}
      </button>
    </div>
  );
}
