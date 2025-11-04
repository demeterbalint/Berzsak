import {Injectable} from '@angular/core';
import {Scrollable} from '../models/scrollable';

@Injectable({ providedIn: 'root' })
export class DragScrollService {

  private scrollables: Map<string, Scrollable> = new Map();
  private ease: number = 0.1;
  private _fromView: string = ''; //from where was the project-page reached?

  private zoomLevels: Map<string, number> = new Map();
  private readonly zoomStep = 0.1;
  private readonly minZoom = 0.5;
  private readonly maxZoom = 2;

  get fromView() {
    return this._fromView;
  }

  set fromView(value: string) {
    this._fromView = value;
  }

  register(el: HTMLElement, key: string) {
    const existing = this.scrollables.get(key);
    if (existing) {
      existing.el.removeEventListener("wheel", existing.onWheel as any);
      this.scrollables.delete(key);
    }

    const scrollable: Scrollable = {
      el,
      targetTop: el.scrollTop,
      currentTop: el.scrollTop,
      targetLeft: el.scrollLeft,
      currentLeft: el.scrollLeft,
      isAnimating: false,
      onWheel: (e: WheelEvent) => this.handleWheel(e, key),
    };

    el.addEventListener("wheel", scrollable.onWheel, { passive: false });
    this.scrollables.set(key, scrollable);

    this.zoomLevels.set(key, 1);
  }

  private handleWheel(e: WheelEvent, key: string) {
    const scrollable = this.scrollables.get(key);
    if (!scrollable) return;

    const gallery = (e.target as HTMLElement).closest('.item-gallery');
    if (gallery) {
      // Let the browser handle horizontal scroll naturally
      return;
    }

    e.preventDefault();

    if (key === 'experience-grid' && scrollable.el.classList.contains('sidebar-open')) {
      const sidebar = this.scrollables.get('sidebar');
      if (sidebar) {
        this.handleWheel(e, 'sidebar');
      }
      return;
    } else if (key === 'experience-grid') {
      let zoomTarget: HTMLElement;

      if (key === 'experience-grid') {
        zoomTarget = scrollable.el.querySelector('.grid-experience') as HTMLElement;
      }/* else if (key === 'grid-col-3') {
        zoomTarget = scrollable.el.querySelector('.grid-col3') as HTMLElement;
      }*/ else return;

      let zoom = this.zoomLevels.get(key) ?? 1;

      if (e.deltaY < 0) zoom = Math.min(zoom + this.zoomStep, this.maxZoom);
      else zoom = Math.max(zoom - this.zoomStep, this.minZoom);

      this.zoomLevels.set(key, zoom);

      // Apply zoom using CSS transform
      zoomTarget.style.transformOrigin = 'center center';
      zoomTarget.style.transform = `scale(${zoom})`;
      zoomTarget.style.transition = 'transform 0.2s ease-out';
      return;
    }

    if (!scrollable.isAnimating) {
      scrollable.currentTop = scrollable.el.scrollTop;
      scrollable.currentLeft = scrollable.el.scrollLeft;
    }

    scrollable.targetTop += e.deltaY;
    scrollable.targetTop = Math.max(
      0,
      Math.min(scrollable.targetTop, scrollable.el.scrollHeight - scrollable.el.clientHeight)
    );
    scrollable.targetLeft += e.deltaX;
    scrollable.targetLeft = Math.max(
      0,
      Math.min(scrollable.targetLeft, scrollable.el.scrollWidth - scrollable.el.clientWidth)
    )

    if (!scrollable.isAnimating) {
      scrollable.isAnimating = true;
      this.animate(key);
    }
  }

  private animate(key: string) {
    const scrollable = this.scrollables.get(key);
    if (!scrollable) return;

    scrollable.currentTop += (scrollable.targetTop - scrollable.currentTop) * this.ease;
    scrollable.el.scrollTop = scrollable.currentTop;
    scrollable.currentLeft += (scrollable.targetLeft - scrollable.currentLeft) * this.ease;
    scrollable.el.scrollLeft = scrollable.currentLeft;

    if (Math.abs(scrollable.targetTop - scrollable.currentTop) > 0.5 || Math.abs(scrollable.targetLeft - scrollable.currentLeft) > 0.5) {
      requestAnimationFrame(() => this.animate(key));
    } else {
      scrollable.el.scrollTop = scrollable.targetTop;
      scrollable.el.scrollLeft = scrollable.targetLeft;
      scrollable.isAnimating = false;
    }
  }

  scrollDown(key: string, offset: number) {
    const scrollable = this.scrollables.get(key);
    if (!scrollable) return;

    scrollable.targetTop = Math.min(
      scrollable.el.scrollHeight - scrollable.el.clientHeight,
      scrollable.currentTop + offset
    );

    if (!scrollable.isAnimating) {
      scrollable.isAnimating = true;
      this.animate(key);
    }
  }

  getScrollable(key: string) {
    return this.scrollables.get(key);
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
      if (!["mouse", "pen"].includes(e.pointerType)) return;
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
      let dx = e.clientX - lastX;
      let dy = e.clientY - lastY;
      if (e.pointerType === 'pen') {
        dx *= 1.5;
        dy *= 1.5;
      }

      lastX = e.clientX;
      lastY = e.clientY;
      totalMove += Math.abs(dx) + Math.abs(dy);
      targetLeft = Math.max(0, Math.min(maxLeft(), targetLeft - dx));
      targetTop = Math.max(0, Math.min(maxTop(), targetTop - dy));
      // start animation loop if not already running, so move updates take effect
      startAnimIfNeeded();
    };

    const onUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      el.releasePointerCapture(e.pointerId);
      // If movement was minimal, synthesize a click under the pointer for reliability
      if (totalMove < clickMoveThreshold) {
        const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        if (target && !target.classList.contains('dark-mode-project')) {
          target.click();
        } else if (target && target.classList.contains('dark-mode-project') && e.pointerType === 'mouse') {
          target.click();
        }
        return;
      }
      startAnimIfNeeded();
    };

    // Bind in capture phase to intercept even if children stop propagation
    // Ensure correct interaction styles
    try {
      el.style.touchAction = 'auto';
      el.style.cursor = 'grab';
      el.style.pointerEvents = 'auto';
    } catch {}

    // Listen on element for pointerdown; attach move/up on window to guarantee delivery during capture
    el.addEventListener('pointerdown', onDown, { passive: false, capture: true });
    window.addEventListener('pointermove', onMove, { passive: false, capture: true });
    window.addEventListener('pointerup', onUp, { passive: false, capture: true });
    window.addEventListener('pointercancel', onUp, { passive: false, capture: true });
    window.addEventListener('pointerleave', onUp, { passive: false, capture: true });
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
    let totalMove = 0;
    const clickMoveThreshold = 6; // px
    let scrollTimeout: number | undefined;

    const dots = gallery.parentElement?.querySelectorAll<HTMLParagraphElement>('.col3-dot') ?? [];
    const images = Array.from(gallery.querySelectorAll('img')) as HTMLImageElement[];

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

    const updateDots = () => {
      if (images.length === 0) return;
      const imageWidth = images[0].offsetWidth + parseFloat(getComputedStyle(gallery).gap || '0');
      const index = Math.round(gallery.scrollLeft / imageWidth);
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
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
        updateDots();
        if (t < 1) {
          frameId = requestAnimationFrame(tick);
        } else {
          isSnapping = false;
          restoreCssSnap();
          updateDots();
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
      // if (!["mouse", "pen"].includes(e.pointerType)) return;
      isDown = true;
      totalMove = 0;
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
      totalMove += Math.abs(dx);
      const dt = Math.max(1, now - lastTime);
      // update position
      let next = gallery.scrollLeft - dx;
      if (next < 0) next = 0;
      if (next > maxScroll()) next = maxScroll();
      gallery.scrollLeft = next;

      updateDots();

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

    gallery.addEventListener(
      "click",
      (e) => {
        if (totalMove > clickMoveThreshold) {
          // Dragged far enough → cancel navigation
          e.preventDefault();
          e.stopImmediatePropagation();
        }
        // reset for next interaction
        totalMove = 0;
      },
      { capture: true }
    );

    gallery.addEventListener("scroll", () => {
      updateDots();

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        updateDots();
      } ,100);
    })

    gallery.addEventListener("pointerdown", onDown);
    gallery.addEventListener("pointermove", onMove);
    gallery.addEventListener("pointerup", onUp);
    gallery.addEventListener("pointerleave", onUp);

    const onAllImagesReady = () => {
      gallery.scrollLeft = 0;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === 0));
    };

    let remaining = images.length;

    images.forEach(img => {
      if (img.complete && img.offsetWidth > 0) {
        remaining--;
      } else {
        img.onload = img.onerror = () => {
          if (--remaining <= 0) {
            onAllImagesReady();
          }
        };
      }
    });

    if (remaining <= 0) {
      onAllImagesReady();
    }
  }
}
