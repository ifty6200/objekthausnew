import { useEffect, useRef } from "react";

type Props = { src: string; label: string; className?: string };

/**
 * Autoplaying background video.
 * iOS/Android only allow silent inline autoplay, and React does not always emit
 * the `muted` attribute into the SSR markup — so we force it on the element and
 * retry playback on load and on the first user gesture.
 */
export function HeroVideo({ src, label, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;

    const tryPlay = () => {
      void el.play().catch(() => {});
    };

    tryPlay();
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);
    document.addEventListener("touchstart", tryPlay, { passive: true });
    document.addEventListener("click", tryPlay);
    document.addEventListener("visibilitychange", tryPlay);

    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      document.removeEventListener("touchstart", tryPlay);
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("visibilitychange", tryPlay);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      // eslint-disable-next-line react/no-unknown-property
      x5-playsinline=""
      webkit-playsinline="true"
      preload="auto"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      aria-label={label}
      className={className}
    />
  );
}
