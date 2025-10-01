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
}
