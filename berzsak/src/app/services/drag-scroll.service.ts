// src/app/services/drag-scroll.service.ts
import { Injectable } from '@angular/core';
import { Scrollable } from '../interfaces/scrollable';

@Injectable({
  providedIn: 'root'
})
export class DragScrollService {

  scrollables: Scrollable[] = [];

  private dragging = false;
  private _moved = false;
  private startX = 0;
  private startY = 0;
  private scrollLeft = 0;
  private scrollTop = 0;

  // per-element listeners so we can remove them reliably
  private listeners = new Map<HTMLElement, { move?: (e: MouseEvent | PointerEvent | TouchEvent) => void; up?: (e: MouseEvent | PointerEvent | TouchEvent) => void }>();

  // per-element RAF ids so we can cancel/track animations
  private rafMap = new Map<HTMLElement, number>();

  private globalListenersAdded = false;

  // global abort handlers (bound once)
  private onWindowMouseOutBound = (event: MouseEvent) => {
    if (!event.relatedTarget && !(event as any).toElement) {
      this.endDrag();
    }
  };
  private onWindowBlurBound = () => this.endDrag();
  private onVisibilityChangeBound = () => { if (document.hidden) this.endDrag(); };
  private onPointerCancelBound = () => this.endDrag();

  constructor() { }

  /* ----------------------- START Drag (experience) ----------------------- */
  startDrag(event: MouseEvent | PointerEvent | TouchEvent, el: HTMLElement, selectedProject: any) {
    if (!this.canDrag(selectedProject)) return;
    // Ensure no previous drag remains active (prevents multiple elements from responding)
    this.endDrag();

    this.dragging = true;
    this._moved = false;

    const point = this.getPoint(event);
    this.startX = point.x - el.offsetLeft;
    this.startY = point.y - el.offsetTop;

    this.scrollLeft = el.scrollLeft;
    this.scrollTop = el.scrollTop;

    el.style.cursor = 'grabbing';

    // create listeners and store them so we can remove them later
    const move = (e: MouseEvent | PointerEvent | TouchEvent) => this.onDrag(e, el);
    const up = (e: MouseEvent | PointerEvent | TouchEvent) => this.endDrag(e, el);

    window.addEventListener('mousemove', move as any, { passive: false });
    window.addEventListener('mouseup', up as any, { passive: true });
    window.addEventListener('pointermove', move as any, { passive: false });
    window.addEventListener('pointerup', up as any, { passive: true });
    window.addEventListener('touchmove', move as any, { passive: false });
    window.addEventListener('touchend', up as any, { passive: true });

    // keep track so we can remove these specific handlers later
    this.listeners.set(el, { move, up });

    // add "global" abort listeners once
    if (!this.globalListenersAdded) {
      window.addEventListener('mouseout', this.onWindowMouseOutBound);
      window.addEventListener('blur', this.onWindowBlurBound);
      document.addEventListener('visibilitychange', this.onVisibilityChangeBound);
      window.addEventListener('pointercancel', this.onPointerCancelBound);
      this.globalListenersAdded = true;
    }

    this.registerScrollable(el);
  }

  onDrag(event: MouseEvent | PointerEvent | TouchEvent, el: HTMLElement) {
    if (!this.dragging) return;

    if ('preventDefault' in event) event.preventDefault();

    const point = this.getPoint(event);
    const x = point.x - el.offsetLeft;
    const y = point.y - el.offsetTop;

    const walkX = this.startX - x; // horizontal
    const walkY = this.startY - y; // vertical

    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
      this._moved = true;
    }

    const scrollable = this.scrollables.find(s => s.el === el);
    if (scrollable) {
      scrollable.targetScrollLeft = this.scrollLeft + walkX;
      scrollable.targetScrollTop = this.scrollTop + walkY;

      // Track velocity
      const now = Date.now();
      if (scrollable.lastTimestamp > 0) {
        const deltaTime = now - scrollable.lastTimestamp;
        if (deltaTime > 0) {
          // Calculate velocity (pixels per millisecond)
          const deltaX = x - scrollable.lastX;
          const deltaY = y - scrollable.lastY;
          scrollable.velocityX = deltaX / deltaTime;
          scrollable.velocityY = deltaY / deltaTime;
        }
      }

      // Update last position and timestamp
      scrollable.lastX = x;
      scrollable.lastY = y;
      scrollable.lastTimestamp = now;

      this.animateScrollable(scrollable);
    }
  }

  /* -------------------- START Drag (col3 horizontal only) -------------------- */
  startDragOnCol3(event: MouseEvent | PointerEvent | TouchEvent, el: HTMLElement, selectedProject: any) {
    if (!this.canDrag(selectedProject)) return;
    // Ensure no previous drag remains active (prevents multiple galleries from responding)
    this.endDrag();

    this.dragging = true;
    this._moved = false;

    const point = this.getPoint(event);
    this.startX = point.x - el.offsetLeft;
    this.startY = point.y - el.offsetTop; // Track vertical position too
    this.scrollLeft = el.scrollLeft;

    el.style.cursor = 'grabbing';

    const move = (e: MouseEvent | PointerEvent | TouchEvent) => this.onDragCol3(e, el);
    const up = (e: MouseEvent | PointerEvent | TouchEvent) => this.endDrag(e, el);

    window.addEventListener('mousemove', move as any, { passive: false });
    window.addEventListener('mouseup', up as any, { passive: true });
    window.addEventListener('pointermove', move as any, { passive: false });
    window.addEventListener('pointerup', up as any, { passive: true });
    window.addEventListener('touchmove', move as any, { passive: false });
    window.addEventListener('touchend', up as any, { passive: true });

    this.listeners.set(el, { move, up });

    if (!this.globalListenersAdded) {
      window.addEventListener('mouseout', this.onWindowMouseOutBound);
      window.addEventListener('blur', this.onWindowBlurBound);
      document.addEventListener('visibilitychange', this.onVisibilityChangeBound);
      window.addEventListener('pointercancel', this.onPointerCancelBound);
      this.globalListenersAdded = true;
    }

    this.registerScrollable(el);
  }

  onDragCol3(event: MouseEvent | PointerEvent | TouchEvent, el: HTMLElement) {
    if (!this.dragging) return;

    const point = this.getPoint(event);
    const x = point.x - el.offsetLeft;
    const y = point.y - el.offsetTop;
    const walkX = this.startX - x;
    const walkY = this.startY - y;

    // Determine if the drag is predominantly horizontal
    // We consider a drag "quiet horizontal" if the horizontal movement is greater than
    // the vertical movement by a certain ratio (e.g., 1.5 times)
    const isHorizontalDrag = Math.abs(walkX) > Math.abs(walkY) * 1.5;

    if (isHorizontalDrag) {
      // Only prevent default and handle horizontal scrolling if the drag is predominantly horizontal
      if ('preventDefault' in event) event.preventDefault();

      if (Math.abs(walkX) > 5) {
        this._moved = true;
      }

      const scrollable = this.scrollables.find(s => s.el === el);
      if (scrollable) {
        // horizontal only
        scrollable.targetScrollLeft = this.scrollLeft + walkX;

        // Track velocity (horizontal only)
        const now = Date.now();
        if (scrollable.lastTimestamp > 0) {
          const deltaTime = now - scrollable.lastTimestamp;
          if (deltaTime > 0) {
            // Calculate velocity (pixels per millisecond)
            const deltaX = x - scrollable.lastX;
            scrollable.velocityX = deltaX / deltaTime;
          }
        }

        // Update last position and timestamp
        scrollable.lastX = x;
        scrollable.lastY = y;
        scrollable.lastTimestamp = now;

        this.animateScrollable(scrollable);
      }
    } else {
      // For predominantly vertical drags, don't prevent default
      // This allows the page to scroll vertically as normal
      if (Math.abs(walkY) > 5) {
        this._moved = true;
      }
    }
  }

  /* ----------------------------- END Drag ----------------------------- */
  endDrag(_event?: MouseEvent | PointerEvent | TouchEvent, el?: HTMLElement) {
    // turning dragging off
    this.dragging = false;

    // Apply momentum if we have a valid element
    if (el) {
      const scrollable = this.scrollables.find(s => s.el === el);
      if (scrollable && (Math.abs(scrollable.velocityX) > 0.05 || Math.abs(scrollable.velocityY) > 0.05)) {
        // Calculate momentum based on velocity
        // The multiplier is dynamic based on velocity - faster swipes result in more momentum
        // This creates a more natural feeling where quick swipes scroll further
        const baseMultiplier = 150;
        const velocityFactor = Math.max(1, Math.sqrt(
          Math.abs(scrollable.velocityX) * 10 +
          Math.abs(scrollable.velocityY) * 10
        ));
        const momentumMultiplier = baseMultiplier * velocityFactor;

        // Apply momentum to target scroll positions
        // The negative sign is because the velocity is calculated as (current - previous)
        // but scrolling direction is opposite to drag direction
        scrollable.targetScrollLeft += -scrollable.velocityX * momentumMultiplier;
        scrollable.targetScrollTop += -scrollable.velocityY * momentumMultiplier;

        // Ensure we don't scroll past boundaries (if possible to detect)
        if (scrollable.el.scrollLeft === 0 && scrollable.targetScrollLeft < 0) {
          scrollable.targetScrollLeft = 0;
        }
        if (scrollable.el.scrollTop === 0 && scrollable.targetScrollTop < 0) {
          scrollable.targetScrollTop = 0;
        }

        // Set decelerating flag to true to enable deceleration in the animation
        scrollable.decelerating = true;

        // Start the animation with momentum
        this.animateScrollable(scrollable);
      }
    }

    // restore cursor for given element
    if (el) {
      try { el.style.cursor = 'grab'; } catch (_) { /* ignore */ }
    }

    // remove per-element listeners (if present)
    if (el) {
      const stored = this.listeners.get(el);
      if (stored) {
        if (stored.move) {
          window.removeEventListener('mousemove', stored.move as any);
          window.removeEventListener('pointermove', stored.move as any);
          window.removeEventListener('touchmove', stored.move as any);
        }
        if (stored.up) {
          window.removeEventListener('mouseup', stored.up as any);
          window.removeEventListener('pointerup', stored.up as any);
          window.removeEventListener('touchend', stored.up as any);
        }
        this.listeners.delete(el);
      }
    } else {
      // no el specified: remove all stored listeners
      for (const [element, stored] of this.listeners.entries()) {
        if (stored.move) {
          window.removeEventListener('mousemove', stored.move as any);
          window.removeEventListener('pointermove', stored.move as any);
          window.removeEventListener('touchmove', stored.move as any);
        }
        if (stored.up) {
          window.removeEventListener('mouseup', stored.up as any);
          window.removeEventListener('pointerup', stored.up as any);
          window.removeEventListener('touchend', stored.up as any);
        }
      }
      this.listeners.clear();
    }

    // remove global listeners only when we have no tracked per-element listeners left
    if (this.listeners.size === 0 && this.globalListenersAdded) {
      window.removeEventListener('mouseout', this.onWindowMouseOutBound);
      window.removeEventListener('blur', this.onWindowBlurBound);
      document.removeEventListener('visibilitychange', this.onVisibilityChangeBound);
      window.removeEventListener('pointercancel', this.onPointerCancelBound);
      this.globalListenersAdded = false;
    }
  }

  private getPoint(event: MouseEvent | PointerEvent | TouchEvent): { x: number; y: number } {
    if ((event as TouchEvent).touches && (event as TouchEvent).touches.length) {
      const t = (event as TouchEvent).touches[0];
      return { x: t.pageX, y: t.pageY };
    }
    const e = event as MouseEvent | PointerEvent;
    return { x: e.pageX, y: e.pageY };
  }

  /* -------------------------- animateScrollable -------------------------- */
  animateScrollable(scrollable: Scrollable) {
    // Base lag factor for normal scrolling
    const baseLag = 0.12;

    // If an animation is already running for this element, keep using it (it will pick up new targets)
    if (scrollable.animating && this.rafMap.has(scrollable.el)) {
      // nothing else to do — existing RAF loop will chase the updated targets
      return;
    }

    scrollable.animating = true;

    const step = () => {
      const el = scrollable.el;

      // Use a different lag factor for deceleration (slower, more gradual)
      // This creates a more natural feeling deceleration
      const lag = scrollable.decelerating ? 0.08 : baseLag;

      // Apply the lag factor to move towards the target
      el.scrollTop += (scrollable.targetScrollTop - el.scrollTop) * lag;
      el.scrollLeft += (scrollable.targetScrollLeft - el.scrollLeft) * lag;

      // Determine if we need to continue animating
      const needMore = Math.abs(el.scrollTop - scrollable.targetScrollTop) > 0.5 ||
        Math.abs(el.scrollLeft - scrollable.targetScrollLeft) > 0.5;

      if (needMore) {
        const id = requestAnimationFrame(step);
        this.rafMap.set(el, id);
      } else {
        // Animation finished
        scrollable.animating = false;
        scrollable.decelerating = false; // Reset deceleration flag
        scrollable.velocityX = 0; // Reset velocity
        scrollable.velocityY = 0;

        const id = this.rafMap.get(el);
        if (id !== undefined) cancelAnimationFrame(id);
        this.rafMap.delete(el);
      }
    };

    const id0 = requestAnimationFrame(step);
    this.rafMap.set(scrollable.el, id0);
  }

  registerScrollable(el: HTMLElement) {
    if (!this.scrollables.find(s => s.el === el)) {
      this.scrollables.push({
        el,
        targetScrollTop: el.scrollTop,
        targetScrollLeft: el.scrollLeft,
        animating: false,
        velocityX: 0,
        velocityY: 0,
        lastX: 0,
        lastY: 0,
        lastTimestamp: 0,
        decelerating: false
      });
    }
  }

  canDrag(selectedProject: any): boolean {
    return !selectedProject;
  }

  get moved(): boolean {
    return this._moved;
  }
}
