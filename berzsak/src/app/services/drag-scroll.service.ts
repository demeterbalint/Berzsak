import {Injectable} from '@angular/core';
import {Scrollable} from '../models/scrollable';

@Injectable({ providedIn: 'root' })
export class DragScrollService {

  private scrollables: Map<HTMLElement, Scrollable> = new Map();
  private ease: number = 0.1;

  register(el: HTMLElement) {
    if (this.scrollables.has(el)) return;

    const scrollable: Scrollable = {
      el,
      target: el.scrollTop,
      current: el.scrollTop,
      isAnimating: false,
      onWheel: (e: WheelEvent) => this.handleWheel(e, el),
    };

    el.addEventListener("wheel", scrollable.onWheel, { passive: false });
    this.scrollables.set(el, scrollable);
  }

  private handleWheel(e: WheelEvent, el: HTMLElement) {
    e.preventDefault();

    const scrollable = this.scrollables.get(el);
    if (!scrollable) return;
    if (scrollable.el.className.includes('grid-experience-wrapper') && scrollable.el.classList.contains('sidebar-open')) {
      const sidebar = Array.from(this.scrollables.keys())
        .find(el => el.classList.contains('sidebar-main-wrapper'));
      if (sidebar) {
        this.handleWheel(e, sidebar);
      }
      return;
    }

    if (!scrollable.isAnimating) {
      scrollable.current = scrollable.el.scrollTop;
    }

    scrollable.target += e.deltaY;
    scrollable.target = Math.max(
      0,
      Math.min(scrollable.target, el.scrollHeight - el.clientHeight)
    );

    if (!scrollable.isAnimating) {
      scrollable.isAnimating = true;
      this.animate(el);
    }
  }

  private animate(el: HTMLElement) {
    const scrollable = this.scrollables.get(el);
    if (!scrollable) return;

    scrollable.current += (scrollable.target - scrollable.current) * this.ease;
    scrollable.el.scrollTop = scrollable.current;

    if (Math.abs(scrollable.target - scrollable.current) > 0.5) {
      requestAnimationFrame(() => this.animate(el));
    } else {
      scrollable.el.scrollTop = scrollable.target;
      scrollable.isAnimating = false;
    }
  }

  scrollDown(el: HTMLElement, offset: number) {
    const scrollable = this.scrollables.get(el);
    if (!scrollable) return;

    scrollable.target = Math.min(
      scrollable.el.scrollHeight - scrollable.el.clientHeight,
      scrollable.current + offset
    );

    if (!scrollable.isAnimating) {
      scrollable.isAnimating = true;
      this.animate(el);
    }
  }

  getScrollable(el: HTMLElement) {
    return this.scrollables.get(el);
  }

  dragExperienceView(el: HTMLElement) {
    let isDown = false;
    let lastX = 0;
    let lastY = 0;
    let targetLeft = el.scrollLeft;
    let targetTop = el.scrollTop;
    let currentLeft = el.scrollLeft;
    let currentTop = el.scrollTop;
    let frameId: number | undefined;
    let lastFrameTime = performance.now();
    let totalMove = 0;
    const clickMoveThreshold = 6; // px

    const tauMs = 150; // smoothing time constant (~0.15s delay)

    const maxLeft = () => Math.max(0, el.scrollWidth - el.clientWidth);
    const maxTop = () => Math.max(0, el.scrollHeight - el.clientHeight);

    const animate = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastFrameTime);
      lastFrameTime = now;
      // exponential smoothing factor for time delta
      const alpha = 1 - Math.exp(-dt / tauMs);

      currentLeft += (targetLeft - currentLeft) * alpha;
      currentTop += (targetTop - currentTop) * alpha;

      el.scrollLeft = currentLeft;
      el.scrollTop = currentTop;

      const done = !isDown && Math.abs(targetLeft - currentLeft) < 0.5 && Math.abs(targetTop - currentTop) < 0.5;
      if (!done) {
        frameId = requestAnimationFrame(animate);
      } else {
        frameId = undefined;
      }
    };

    const startAnimIfNeeded = () => {
      if (frameId == null) {
        lastFrameTime = performance.now();
        frameId = requestAnimationFrame(animate);
      }
    };

    const onDown = (e: PointerEvent) => {
      isDown = true;
      lastX = e.clientX;
      lastY = e.clientY;
      targetLeft = el.scrollLeft;
      targetTop = el.scrollTop;
      currentLeft = el.scrollLeft;
      currentTop = el.scrollTop;
      totalMove = 0;
      el.setPointerCapture(e.pointerId);
      startAnimIfNeeded();
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      totalMove += Math.abs(dx) + Math.abs(dy);
      targetLeft = Math.max(0, Math.min(maxLeft(), targetLeft - dx));
      targetTop = Math.max(0, Math.min(maxTop(), targetTop - dy));
    };

    const onUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      el.releasePointerCapture(e.pointerId);
      // If movement was minimal, synthesize a click under the pointer for reliability
      if (totalMove < clickMoveThreshold) {
        const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        if (target) target.click();
        return;
      }
      startAnimIfNeeded();
    };

    el.addEventListener('pointerdown', onDown, { passive: false });
    el.addEventListener('pointermove', onMove, { passive: false });
    el.addEventListener('pointerup', onUp, { passive: false });
    el.addEventListener('pointercancel', onUp, { passive: false });
    el.addEventListener('pointerleave', onUp, { passive: false });
  }

  dragItemGallery(gallery: HTMLElement) {
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0; // px per frame approximation
    let frameId: number | undefined;
    let isSnapping = false;
    const maxFrameVelocity = 60; // clamp per-frame velocity

    const maxScroll = () => Math.max(0, gallery.scrollWidth - gallery.clientWidth);

    const originalSnapType = getComputedStyle(gallery).scrollSnapType;
    const originalBehavior = getComputedStyle(gallery).scrollBehavior;

    const disableCssSnap = () => {
      gallery.style.scrollSnapType = "none";
      gallery.style.scrollBehavior = "auto";
    };
    const restoreCssSnap = () => {
      gallery.style.scrollSnapType = originalSnapType || "x mandatory";
      gallery.style.scrollBehavior = originalBehavior || "smooth";
    };

    const getClosestSnapLeft = (left: number) => {
      const children = Array.from(gallery.children) as HTMLElement[];
      if (children.length === 0) return 0;
      // current gallery center in content coordinates
      const galleryCenter = left + gallery.clientWidth / 2;
      let bestChildCenter = (children[0].offsetLeft + children[0].offsetWidth / 2);
      let minDist = Math.abs(bestChildCenter - galleryCenter);
      for (let i = 1; i < children.length; i++) {
        const childCenter = children[i].offsetLeft + children[i].offsetWidth / 2;
        const d = Math.abs(childCenter - galleryCenter);
        if (d < minDist) {
          minDist = d;
          bestChildCenter = childCenter;
        }
      }
      // target left so that child center aligns with gallery center
      const targetLeft = bestChildCenter - gallery.clientWidth / 2;
      return Math.max(0, Math.min(targetLeft, maxScroll()));
    };

    const animateTo = (targetLeft: number, durationMs = 400) => {
      if (frameId) cancelAnimationFrame(frameId);
      isSnapping = true;
      const startLeft = gallery.scrollLeft;
      const delta = targetLeft - startLeft;
      const startT = performance.now();
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const tick = () => {
        const now = performance.now();
        const t = Math.min(1, (now - startT) / durationMs);
        const eased = easeOutCubic(t);
        gallery.scrollLeft = startLeft + delta * eased;
        if (t < 1) {
          frameId = requestAnimationFrame(tick);
        } else {
          isSnapping = false;
          restoreCssSnap();
        }
      };
      frameId = requestAnimationFrame(tick);
    };

    // choose an appropriate duration using distance and release velocity
    const computeDurationMs = (distance: number, vPerFrame: number) => {
      const base = 350; // ms
      const distanceFactor = Math.min(700, 140 + distance * 0.45);
      const velocityBoost = Math.max(0, Math.min(200, Math.abs(vPerFrame) * 6));
      const duration = Math.min(750, Math.max(220, base + distanceFactor - velocityBoost));
      return duration;
    };

    const onDown = (e: PointerEvent) => {
      if (!["mouse", "pen"].includes(e.pointerType)) return;
      isDown = true;
      startX = e.clientX;
      scrollStart = gallery.scrollLeft;
      lastX = startX;
      lastTime = performance.now();
      velocity = 0;
      if (frameId) cancelAnimationFrame(frameId);
      isSnapping = false;
      gallery.setPointerCapture(e.pointerId);
      gallery.style.cursor = "grabbing";
      disableCssSnap();
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dt = Math.max(1, now - lastTime);
      // update position
      let next = gallery.scrollLeft - dx;
      if (next < 0) next = 0;
      if (next > maxScroll()) next = maxScroll();
      gallery.scrollLeft = next;
      // estimate velocity as per-frame px (clamped)
      const vPerFrame = (dx / dt) * 16; // 16ms ~ 60fps frame
      // simple low-pass filter to smooth velocity readings
      velocity = velocity * 0.6 + vPerFrame * 0.4;
      // clamp velocity to avoid excessive fling
      if (velocity > maxFrameVelocity) velocity = maxFrameVelocity;
      if (velocity < -maxFrameVelocity) velocity = -maxFrameVelocity;
      lastX = e.clientX;
      lastTime = now;
    };

    const onUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      try { gallery.releasePointerCapture(e.pointerId); } catch {}
      gallery.style.cursor = "grab";
      // Compute a single snap target and animate directly to it with deceleration.
      // Bias the target by a short projection along the release velocity to respect fling direction.
      const projectionFrames = 14; // ~230ms worth at 60fps
      const projectedLeft = Math.max(0, Math.min(maxScroll(), gallery.scrollLeft - velocity * projectionFrames));
      const target = getClosestSnapLeft(projectedLeft);
      const distance = Math.abs(target - gallery.scrollLeft);
      const duration = computeDurationMs(distance, velocity);
      animateTo(target, duration);
    };

    gallery.addEventListener("pointerdown", onDown);
    gallery.addEventListener("pointermove", onMove);
    gallery.addEventListener("pointerup", onUp);
    gallery.addEventListener("pointerleave", onUp);
  }
}
