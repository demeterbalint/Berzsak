import {ElementRef, Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DragScrollService {
  private activeElement: HTMLElement | null = null;
  private direction: 'vertical' | 'horizontal' | 'both' = 'vertical';

  private targetScrollTop = 0;
  private currentScrollTop = 0;
  private targetScrollLeft = 0;
  private currentScrollLeft = 0;
  private seeMoreHidden = false;

  private animationFrameId: number | null = null;

  private speed = 0.1;
  private pointerSpeed = 0.1; // higher than wheel speed (0.1)
  private isPointerDragging = false;
  private dragThreshold = 5;
  private moved = false;

  private wheelListeners = new WeakMap<HTMLElement, (e: WheelEvent) => void>();
  private pointerListeners = new WeakMap<HTMLElement, { down: any; move: any; up: any }>();

  init(element: HTMLElement, direction: 'vertical' | 'horizontal' | 'both' = 'vertical', seeMoreButton?: ElementRef) {
    this.setActive(element, direction, seeMoreButton);

    if (!this.wheelListeners.has(element)) {
      const listener = (event: WheelEvent) => this.handleScroll(event, seeMoreButton);
      element.addEventListener('wheel', listener, { passive: false });
      this.wheelListeners.set(element, listener);
    }

    /// Pointer / touch drag
    if (!this.pointerListeners.has(element)) {
      let startX = 0, startY = 0, startScrollLeft = 0, startScrollTop = 0, lastX = 0, lastY = 0;

      const down = (e: PointerEvent) => {
        this.isPointerDragging = true;
        this.moved = false;
        element.style.cursor = 'grabbing';

        startX = lastX = e.clientX;
        startY = lastY = e.clientY;
        startScrollLeft = element.scrollLeft;
        startScrollTop = element.scrollTop;
      };

      const move = (e: PointerEvent) => {
        if (!this.isPointerDragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        if (!this.moved && Math.sqrt((e.clientX - startX) ** 2 + (e.clientY - startY) ** 2) > this.dragThreshold) {
          this.moved = true;
          element.setPointerCapture(e.pointerId);
        }

        if (this.moved) {
          e.preventDefault();
          if (this.direction === 'horizontal' || this.direction === 'both') {
            this.targetScrollLeft -= dx;
          }
          if (this.direction === 'vertical' || this.direction === 'both') {
            this.targetScrollTop -= dy;
          }
          this.clampScroll();

          // Fade out See More button if visible
          if (seeMoreButton && !this.seeMoreHidden) {
            seeMoreButton.nativeElement.style.transition = 'opacity 0.3s linear';
            seeMoreButton.nativeElement.style.opacity = '0';
            this.seeMoreHidden = true;
          }
        }
        lastX = e.clientX;
        lastY = e.clientY;
      };

      const up = (e: PointerEvent) => {
        this.isPointerDragging = false;
        element.style.cursor = 'grab';
        element.releasePointerCapture(e.pointerId);
        if (this.moved) {
          e.preventDefault();
          e.stopPropagation();
        } else {
          const target = e.target as HTMLElement;
          target.click();
        }
      }

      element.addEventListener('pointerdown', down, { passive: false });
      element.addEventListener('pointermove', move, { passive: false });
      element.addEventListener('pointerup', up, { passive: false });
      element.addEventListener('pointercancel', up, { passive: false });

      this.pointerListeners.set(element, { down, move, up });
    }

    if (!this.animationFrameId) this.animate();
  }

  setActive(element: HTMLElement, direction: 'vertical' | 'horizontal' | 'both', seeMoreButton?: ElementRef<HTMLButtonElement>) {
    this.activeElement = element;
    this.direction = direction;

    this.targetScrollTop = element.scrollTop;
    this.currentScrollTop = element.scrollTop;

    this.targetScrollLeft = element.scrollLeft;
    this.currentScrollLeft = element.scrollLeft;

    // Remove old listener if present
    const prevListener = this.wheelListeners.get(element);
    if (prevListener) {
      element.removeEventListener('wheel', prevListener);
      this.wheelListeners.delete(element);
    }

    // Add new listener
    const listener = (event: WheelEvent) => this.handleScroll(event, seeMoreButton);
    element.addEventListener('wheel', listener, { passive: false });
    this.wheelListeners.set(element, listener);
  }

  disable() {
    this.activeElement = null;
  }

  private animate() {
    const step = () => {
      if (this.activeElement) {

        // Smooth vertical scrolling
        if (this.direction === 'vertical' || this.direction === 'both') {
          const diffY = this.targetScrollTop - this.currentScrollTop;
          if (Math.abs(diffY) > 0.5) {
            this.currentScrollTop += diffY * (this.isPointerDragging ? this.pointerSpeed : this.speed);
            this.activeElement.scrollTop = this.currentScrollTop;
          } else {
            this.currentScrollTop = this.targetScrollTop;
            this.activeElement.scrollTop = this.currentScrollTop;
          }
        }

        // Smooth horizontal scrolling
        if (this.direction === 'horizontal' || this.direction === 'both') {
          const diffX = this.targetScrollLeft - this.currentScrollLeft;
          if (Math.abs(diffX) > 0.5) {
            this.currentScrollLeft += diffX * (this.isPointerDragging ? this.pointerSpeed : this.speed);
            this.activeElement.scrollLeft = this.currentScrollLeft;
          } else {
            this.currentScrollLeft = this.targetScrollLeft;
            this.activeElement.scrollLeft = this.currentScrollLeft;
          }
        }
      }

      this.animationFrameId = requestAnimationFrame(step);
    };

    step();
  }


  handleScroll(event: WheelEvent, seeMoreButton?: ElementRef<HTMLButtonElement>) {
    if (!this.activeElement) return;

    if (!this.seeMoreHidden && seeMoreButton) {
      seeMoreButton.nativeElement.style.transition = 'opacity 0.3s linear';
      seeMoreButton.nativeElement.style.opacity = '0';
      this.seeMoreHidden = true;
    }

    event.preventDefault();

    if (event instanceof WheelEvent) {
      event.preventDefault();
      if (this.direction === 'vertical' || this.direction === 'both') this.targetScrollTop += event.deltaY;
      if (this.direction === 'horizontal' || this.direction === 'both') this.targetScrollLeft += event.deltaX;
      this.clampScroll();
    }
  }

  private clampScroll() {
    if (!this.activeElement) return;
    this.targetScrollTop = Math.max(0, Math.min(this.targetScrollTop, this.activeElement.scrollHeight - this.activeElement.clientHeight));
    this.targetScrollLeft = Math.max(0, Math.min(this.targetScrollLeft, this.activeElement.scrollWidth - this.activeElement.clientWidth));
  }

  scrollDown(container: HTMLElement, seeMoreButton: ElementRef<HTMLButtonElement>) {
    this.targetScrollTop = window.innerWidth * 0.6666;

    this.targetScrollTop = Math.min(this.targetScrollTop, container.scrollHeight - container.clientHeight);

    if (!this.seeMoreHidden && seeMoreButton) {
      seeMoreButton.nativeElement.style.transition = 'opacity 0.3s linear';
      seeMoreButton.nativeElement.style.opacity = '0';
      this.seeMoreHidden = true;
    }
  }
}
