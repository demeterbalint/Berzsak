import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragScrollService {
  private seeMoreHidden = false;
  private projectPageTargetScrollTop = 0;
  private projectPageCurrentScrollTop = 0;
  private animationFrameId: number | null = null;

  moved: boolean = false;

  constructor() {}

  projectPageScrollInit(
    container: HTMLElement,
    seeMoreButton: ElementRef<HTMLButtonElement>,
    speed: number
  ) {
    container.addEventListener('wheel', (event: WheelEvent) => {
      if (!this.seeMoreHidden && seeMoreButton) {
        seeMoreButton.nativeElement.style.transition = 'opacity 0.3s linear';
        seeMoreButton.nativeElement.style.opacity = '0';
        this.seeMoreHidden = true;
      }

      event.preventDefault();

      this.projectPageTargetScrollTop += event.deltaY;
      this.projectPageTargetScrollTop = Math.max(
        0,
        Math.min(this.projectPageTargetScrollTop, container.scrollHeight - container.clientHeight)
      );
    }, { passive: false });

    this.animateScroll(container, speed);
  }

  private animateScroll(container: HTMLElement, speed: number) {
    const step = () => {
      this.projectPageCurrentScrollTop += (this.projectPageTargetScrollTop - this.projectPageCurrentScrollTop) * speed;
      container.scrollTop = this.projectPageCurrentScrollTop;

      this.animationFrameId = requestAnimationFrame(step);
    };

    step();
  }

  scrollDown(container: HTMLElement, seeMoreButton: ElementRef<HTMLButtonElement>) {
    this.projectPageTargetScrollTop = window.innerWidth * 0.6666;

    this.projectPageTargetScrollTop = Math.min(this.projectPageTargetScrollTop, container.scrollHeight - container.clientHeight);

    if (!this.seeMoreHidden && seeMoreButton) {
      seeMoreButton.nativeElement.style.transition = 'opacity 0.3s linear';
      seeMoreButton.nativeElement.style.opacity = '0';
      this.seeMoreHidden = true;
    }
  }
}
