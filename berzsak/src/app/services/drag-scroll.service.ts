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
  private listeners = new Map<HTMLElement, { move?: (e: MouseEvent) => void; up?: (e: MouseEvent) => void }>();

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
  startDrag(event: MouseEvent, el: HTMLElement, selectedProject: any) {
    if (!this.canDrag(selectedProject)) return;

    this.dragging = true;
    this._moved = false;

    this.startX = event.pageX - el.offsetLeft;
    this.startY = event.pageY - el.offsetTop;

    this.scrollLeft = el.scrollLeft;
    this.scrollTop = el.scrollTop;

    el.style.cursor = 'grabbing';

    // create listeners and store them so we can remove them later
    const move = (e: MouseEvent) => this.onDrag(e, el);
    const up = (e: MouseEvent) => this.endDrag(e, el);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);

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

  onDrag(event: MouseEvent, el: HTMLElement) {
    if (!this.dragging) return;

    event.preventDefault();

    const x = event.pageX - el.offsetLeft;
    const y = event.pageY - el.offsetTop;

    const walkX = this.startX - x; // horizontal
    const walkY = this.startY - y; // vertical

    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
      this._moved = true;
    }

    const scrollable = this.scrollables.find(s => s.el === el);
    if (scrollable) {
      scrollable.targetScrollLeft = this.scrollLeft + walkX;
      scrollable.targetScrollTop = this.scrollTop + walkY;
      this.animateScrollable(scrollable);
    }
  }

  /* -------------------- START Drag (col3 horizontal only) -------------------- */
  startDragOnCol3(event: MouseEvent, el: HTMLElement, selectedProject: any) {
    if (!this.canDrag(selectedProject)) return;

    this.dragging = true;
    this._moved = false;

    this.startX = event.pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;

    el.style.cursor = 'grabbing';

    const move = (e: MouseEvent) => this.onDragCol3(e, el);
    const up = (e: MouseEvent) => this.endDrag(e, el);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);

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

  onDragCol3(event: MouseEvent, el: HTMLElement) {
    if (!this.dragging) return;

    event.preventDefault();

    const x = event.pageX - el.offsetLeft;
    const walkX = this.startX - x;

    if (Math.abs(walkX) > 5) {
      this._moved = true;
    }

    const scrollable = this.scrollables.find(s => s.el === el);
    if (scrollable) {
      // horizontal only
      scrollable.targetScrollLeft = this.scrollLeft + walkX;
      this.animateScrollable(scrollable);
    }
  }

  /* ----------------------------- END Drag ----------------------------- */
  endDrag(_event?: MouseEvent, el?: HTMLElement) {
    // turning dragging off
    this.dragging = false;

    // restore cursor for given element
    if (el) {
      try { el.style.cursor = 'grab'; } catch (_) { /* ignore */ }
    }

    // remove per-element listeners (if present)
    if (el) {
      const stored = this.listeners.get(el);
      if (stored) {
        if (stored.move) window.removeEventListener('mousemove', stored.move);
        if (stored.up) window.removeEventListener('mouseup', stored.up);
        this.listeners.delete(el);
      }
    } else {
      // no el specified: remove all stored listeners
      for (const [element, stored] of this.listeners.entries()) {
        if (stored.move) window.removeEventListener('mousemove', stored.move);
        if (stored.up) window.removeEventListener('mouseup', stored.up);
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

  /* -------------------------- animateScrollable -------------------------- */
  animateScrollable(scrollable: { el: HTMLElement; targetScrollTop: number; targetScrollLeft: number; animating: boolean }) {
    const lag = 0.12; // smoothing factor

    // If an animation is already running for this element, keep using it (it will pick up new targets)
    if (scrollable.animating && this.rafMap.has(scrollable.el)) {
      // nothing else to do — existing RAF loop will chase the updated targets
      return;
    }

    scrollable.animating = true;

    const step = () => {
      const el = scrollable.el;

      el.scrollTop += (scrollable.targetScrollTop - el.scrollTop) * lag;
      el.scrollLeft += (scrollable.targetScrollLeft - el.scrollLeft) * lag;

      const needMore = Math.abs(el.scrollTop - scrollable.targetScrollTop) > 0.5 ||
        Math.abs(el.scrollLeft - scrollable.targetScrollLeft) > 0.5;

      if (needMore) {
        const id = requestAnimationFrame(step);
        this.rafMap.set(el, id);
      } else {
        // finished
        scrollable.animating = false;
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
