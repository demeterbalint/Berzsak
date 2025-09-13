import { Injectable } from '@angular/core';
import {Scrollable} from '../interfaces/scrollable';

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

  private onDragBound = (event: MouseEvent) => this.onDrag(event, this.scrollables[0].el);
  private endDragBound = (event: MouseEvent) => this.endDrag(event);
  private onWindowMouseOutBound = (event: MouseEvent) => {
    // relatedTarget/toElement null => pointer left the document (window)
    if (!event.relatedTarget && !(event as any).toElement) {
      this.endDrag();
    }
  };
  private onWindowBlurBound = () => this.endDrag();
  private onVisibilityChangeBound = () => {
    if (document.hidden) this.endDrag();
  };
  private onPointerCancelBound = () => this.endDrag();

  constructor() { }

  startDrag(event: MouseEvent, el: HTMLElement, selectedProject: any) {
    if (!this.canDrag(selectedProject)) return;
    this.dragging = true;
    this._moved = false;

    // Save both X and Y starting points
    this.startX = event.pageX - el.offsetLeft;
    this.startY = event.pageY - el.offsetTop;

    this.scrollLeft = el.scrollLeft;
    this.scrollTop = el.scrollTop;

    el.style.cursor = 'grabbing';

    // Global listeners so drag ends even if pointer leaves the element or window
    window.addEventListener('mousemove', this.onDragBound);
    window.addEventListener('mouseup', this.endDragBound);

    // Robustly catch "pointer left the window" and other aborts:
    window.addEventListener('mouseout', this.onWindowMouseOutBound); // relatedTarget == null when leaving window
    window.addEventListener('blur', this.onWindowBlurBound);         // window lost focus (alt-tab)
    document.addEventListener('visibilitychange', this.onVisibilityChangeBound); // tab hidden
    window.addEventListener('pointercancel', this.onPointerCancelBound); // pointer aborted (touch)
  }

  onDrag(event: MouseEvent, el: HTMLElement) {
    if (!this.dragging) return;

    event.preventDefault(); // prevent text/image selection

    const x = event.pageX - el.offsetLeft;
    const y = event.pageY - el.offsetTop;

    const walkX = this.startX - x; // horizontal distance moved
    const walkY = this.startY - y; // vertical distance moved

    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
      this._moved = true; // mark as actual drag
    }
    const grid = this.scrollables.find(s => s.el === el);
    if (grid) {
      grid.targetScrollLeft = this.scrollLeft + walkX;
      grid.targetScrollTop = this.scrollTop + walkY;
      this.animateScrollable(grid);
    }
  }

  endDrag(_event?: MouseEvent, el?: HTMLElement) {
    this.dragging = false;
    // Restore cursor
    if (el) {
      el.style.cursor = 'grab';
    }

    // Remove global listeners
    window.removeEventListener('mousemove', this.onDragBound);
    window.removeEventListener('mouseup', this.endDragBound);
    window.removeEventListener('mouseout', this.onWindowMouseOutBound);
    window.removeEventListener('blur', this.onWindowBlurBound);
    document.removeEventListener('visibilitychange', this.onVisibilityChangeBound);
    window.removeEventListener('pointercancel', this.onPointerCancelBound);
  }

  animateScrollable(scrollable: { el: HTMLElement; targetScrollTop: number; targetScrollLeft: number; animating: boolean }) {
    const lag = 0.1;

    const step = () => {
      scrollable.el.scrollTop += (scrollable.targetScrollTop - scrollable.el.scrollTop) * lag;
      scrollable.el.scrollLeft += (scrollable.targetScrollLeft - scrollable.el.scrollLeft) * lag;

      if (Math.abs(scrollable.el.scrollTop - scrollable.targetScrollTop) > 0.5 ||
        Math.abs(scrollable.el.scrollLeft - scrollable.targetScrollLeft) > 0.5) {
        requestAnimationFrame(step);
      } else {
        scrollable.animating = false;
      }
    };

    if (!scrollable.animating) {
      scrollable.animating = true;
      requestAnimationFrame(step);
    }
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
