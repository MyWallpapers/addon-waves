import type { CanvasAddonMountContext } from "../generated/mywallpaper-runtime";
import { drawing } from "./drawing";
import "./style.css";

export function mount(context: CanvasAddonMountContext) {
  let values = context.layer.settings.get();
  const view = drawing(
    context,
    "Une surface d’eau abstraite, composée de courbes superposées et de reflets contenus.",
    (g, w, h, t) => {
      g.fillStyle = String(values.water ?? "#122b32");
      g.fillRect(0, 0, w, h);
      const amplitude = Number(values.amplitude ?? 30),
        speed = Number(values.speed ?? 1);
      for (let band = 0; band < 26; band++) {
        const depth = band / 26,
          y0 = h * (0.28 + depth * 0.7);
        g.globalAlpha = 0.08 + depth * 0.28;
        g.strokeStyle = String(values.light ?? "#6e979d");
        g.lineWidth = 0.5 + depth * 1.1;
        g.beginPath();
        for (let x = 0; x <= w; x += w / 110) {
          const s = x / w,
            y =
              y0 +
              Math.sin(s * 9 + t * speed * 0.35 - band * 0.32) *
                amplitude *
                (0.15 + depth) +
              Math.cos(s * 4 - t * speed * 0.25 + band * 0.2) * amplitude * 0.4;
          if (x === 0) g.moveTo(x, y);
          else g.lineTo(x, y);
        }
        g.stroke();
      }
    },
  );
  const update = (next: typeof values) => {
    values = next;
    view.invalidate(next.motion !== false);
  };
  update(values);
  const stop = context.layer.settings.subscribe(update);
  return () => {
    stop();
    view.dispose();
  };
}
