import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type PointerEvent,
} from "react";
import type { ZoomPhotoHandle, ZoomPhotoProps } from "./zoom-photo";
import { photoBounds } from "./photo-geometry";
import { Photo } from "../../components/primitives";

/** Pointer frames update compositor transforms directly, without React renders. */
export const ZoomPhoto = forwardRef<ZoomPhotoHandle, ZoomPhotoProps>(
  function ZoomPhoto(
    { dishes, initialIndex, onIndexChange, onDismiss, dragY },
    ref,
  ) {
    const root = useRef<HTMLDivElement>(null),
      strip = useRef<HTMLDivElement>(null);
    const pages = useRef(new Map<number, HTMLDivElement>());
    const state = useRef({
      index: initialIndex,
      zoom: 1,
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    });
    const pointers = useRef(new Map<number, { x: number; y: number }>());
    const gesture = useRef({
      x: 0,
      y: 0,
      time: 0,
      axis: 0,
      pinched: false,
      distance: 0,
      zoom: 1,
      savedX: 0,
      savedY: 0,
    });
    const closing = useRef(false),
      timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const transition = () =>
      reduced() ? "none" : "transform 260ms cubic-bezier(0.23,1,0.32,1)";
    const bounds = () => {
      const s = state.current,
        img = pages.current.get(s.index)?.querySelector("img");
      return photoBounds(
        s.width,
        s.height,
        img?.naturalWidth || s.width,
        img?.naturalHeight || s.height,
        s.zoom,
      );
    };
    const paintZoom = () => {
      const s = state.current,
        node = pages.current.get(s.index);
      if (node)
        node.style.transform = `translate3d(${s.x}px,${s.y}px,0) scale(${s.zoom})`;
      if (root.current)
        root.current.style.cursor = s.zoom > 1 ? "grab" : "zoom-in";
    };
    const goTo = (target: number, animate = true) => {
      const s = state.current;
      pages.current.forEach((node) => {
        node.style.transform = "none";
      });
      s.index = Math.max(0, Math.min(dishes.length - 1, target));
      s.zoom = 1;
      s.x = 0;
      s.y = 0;
      if (strip.current) {
        strip.current.style.transition = animate ? transition() : "none";
        strip.current.style.transform = `translate3d(${-s.index * s.width}px,0,0)`;
      }
      onIndexChange(s.index);
      paintZoom();
    };
    const toggleZoom = () => {
      const s = state.current;
      s.zoom = s.zoom > 1 ? 1 : 2.5;
      s.x = 0;
      s.y = 0;
      const node = pages.current.get(s.index);
      if (node) node.style.transition = transition();
      paintZoom();
    };
    useImperativeHandle(ref, () => ({ goTo, toggleZoom }));
    useEffect(() => {
      const node = root.current;
      if (!node) return;
      const resize = new ResizeObserver(() => {
        const box = node.getBoundingClientRect();
        state.current.width = box.width;
        state.current.height = box.height;
        if (strip.current) {
          strip.current.style.transition = "none";
          strip.current.style.transform = `translate3d(${-state.current.index * box.width}px,0,0)`;
        }
      });
      resize.observe(node);
      return () => {
        resize.disconnect();
        if (timer.current) clearTimeout(timer.current);
      };
    }, []);
    const resetDrag = () => {
      dragY.set(0);
      if (root.current) {
        root.current.style.transition = transition();
        root.current.style.transform = "none";
      }
    };
    const end = (e: PointerEvent<HTMLDivElement>, cancel = false) => {
      if (!pointers.current.has(e.pointerId)) return;
      const s = state.current,
        g = gesture.current,
        dx = e.clientX - g.x,
        dy = e.clientY - g.y;
      pointers.current.delete(e.pointerId);
      if (pointers.current.size) return;
      if (!cancel && !g.pinched && s.zoom === 1) {
        const elapsed = Math.max(1, performance.now() - g.time);
        if (
          g.axis === 2 &&
          (Math.abs(dy) > 90 ||
            (Math.abs(dy) > 16 && Math.abs(dy) / elapsed > 0.75))
        ) {
          closing.current = true;
          if (root.current) {
            root.current.style.transition = transition();
            root.current.style.transform = `translate3d(0,${Math.sign(dy) * s.height}px,0)`;
          }
          dragY.set(Math.sign(dy) * s.height);
          timer.current = setTimeout(onDismiss, reduced() ? 0 : 220);
          return;
        }
        if (g.axis === 1) {
          const move =
            Math.abs(dx) > s.width * 0.18 ||
            (Math.abs(dx) > 16 && Math.abs(dx) / elapsed > 0.65);
          goTo(s.index + (move ? (dx < 0 ? 1 : -1) : 0));
        }
      }
      if (cancel || g.axis === 1) goTo(s.index);
      resetDrag();
    };
    return (
      <div
        ref={root}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Fotos da avaliação"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(state.current.index + 1, false);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(state.current.index - 1, false);
          }
          if (e.key === "Escape") onDismiss();
        }}
        onDoubleClick={toggleZoom}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={(e) => {
          if (closing.current || e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          const pts = [...pointers.current.values()],
            s = state.current;
          gesture.current = {
            x: e.clientX,
            y: e.clientY,
            time: performance.now(),
            axis: 0,
            pinched: pts.length > 1,
            distance:
              pts.length > 1
                ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
                : 0,
            zoom: s.zoom,
            savedX: s.x,
            savedY: s.y,
          };
          e.currentTarget.style.transition = "none";
          if (strip.current) strip.current.style.transition = "none";
          const page = pages.current.get(s.index);
          if (page) page.style.transition = "none";
        }}
        onPointerMove={(e) => {
          if (!pointers.current.has(e.pointerId) || closing.current) return;
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          const pts = [...pointers.current.values()],
            g = gesture.current,
            s = state.current;
          if (pts.length > 1 && g.distance) {
            s.zoom = Math.max(
              1,
              Math.min(
                4,
                (g.zoom *
                  Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)) /
                  g.distance,
              ),
            );
            paintZoom();
            return;
          }
          const dx = e.clientX - g.x,
            dy = e.clientY - g.y;
          if (s.zoom > 1) {
            s.x = Math.max(-bounds().x, Math.min(bounds().x, g.savedX + dx));
            s.y = Math.max(-bounds().y, Math.min(bounds().y, g.savedY + dy));
            paintZoom();
            return;
          }
          if (!g.axis && Math.hypot(dx, dy) > 8)
            g.axis = Math.abs(dy) > Math.abs(dx) * 1.15 ? 2 : 1;
          if (g.axis === 2) {
            e.currentTarget.style.transform = `translate3d(0,${dy}px,0) scale(${1 - Math.min(Math.abs(dy) / s.height, 1) * 0.12})`;
            dragY.set(dy);
          } else if (g.axis === 1 && strip.current) {
            const edge =
              (s.index === 0 && dx > 0) ||
              (s.index === dishes.length - 1 && dx < 0);
            strip.current.style.transform = `translate3d(${-s.index * s.width + dx * (edge ? 0.22 : 1)}px,0,0)`;
          }
        }}
        onPointerUp={(e) => end(e)}
        onPointerCancel={(e) => end(e, true)}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          touchAction: "none",
          userSelect: "none",
          cursor: "zoom-in",
          outlineOffset: -4,
        }}
      >
        <div
          ref={strip}
          style={{ display: "flex", width: "100%", height: "100%" }}
        >
          {dishes.map((dish, i) => (
            <div
              key={dish.id}
              style={{ flex: "0 0 100%", height: "100%", overflow: "hidden" }}
            >
              <div
                ref={(node) => {
                  if (node) pages.current.set(i, node);
                  else pages.current.delete(i);
                }}
                style={{ width: "100%", height: "100%" }}
              >
                <Photo
                  uri={dish.imageUrl}
                  label={dish.name}
                  fit="contain"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
