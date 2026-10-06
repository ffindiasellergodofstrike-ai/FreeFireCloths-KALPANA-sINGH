import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

interface Props { src: string; webm?: string; poster: string; label: string; priority?: boolean }

// Media-only behavior: no video requests until visible or explicitly played.
export default function StoreFilm({ src, webm, poster, label, priority = false }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const sourceFor = (element: HTMLVideoElement) =>
    element.canPlayType('video/mp4; codecs="avc1.42E01E"') || !webm ? src : webm;

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || motion.matches || connection?.saveData || userPaused.current) {
        element.pause();
        return;
      }
      if (!element.getAttribute("src")) element.src = sourceFor(element);
      element.play().catch(() => {});
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.15 });
    observer?.observe(element);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener?.("change", sync);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener?.("change", sync);
      element.pause();
    };
  }, [src, webm]);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      userPaused.current = false;
      if (!element.getAttribute("src")) element.src = sourceFor(element);
      element.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      element.pause();
    }
  };

  return (
    <div className="studio-film">
      <img src={poster} alt="" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} />
      <video ref={video} poster={poster} muted loop playsInline preload="none" aria-label={label}
        hidden={failed} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onError={() => { setFailed(true); setPlaying(false); }} />
      {!failed && <button type="button" className="studio-film-toggle" onClick={toggle}
        aria-label={`${playing ? "Pause" : "Play"} ${label}`}>
        {playing ? <Pause size={15} /> : <Play size={15} />}<span>{playing ? "Pause film" : "Play film"}</span>
      </button>}
    </div>
  );
}
