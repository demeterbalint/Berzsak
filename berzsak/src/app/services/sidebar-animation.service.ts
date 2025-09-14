import {Injectable} from '@angular/core';
import {ProjectDetails} from '../models/project-details';

@Injectable({
  providedIn: 'root'
})
export class SidebarAnimationService {

  private sidebarDuration = 1000; // 1s

  constructor() {
  }

  async flyToSidebar(gridImg: HTMLElement, project: ProjectDetails): Promise<void> {
    gridImg.style.visibility = 'hidden';

    // Wait for Angular to render the sidebar
    setTimeout(() => {
      const sidebarEl = document.querySelector('.sidebar') as HTMLElement;
      const container = document.querySelector('.container') as HTMLElement;
      if (!sidebarEl || !container) return;

      const sidebarImg = sidebarEl.querySelector(`img[data-project-name="${project.name}"]`) as HTMLElement;
      if (!sidebarImg) return;
      sidebarImg.style.visibility = 'hidden';

      // Clone the grid image
      const clone = gridImg.cloneNode(true) as HTMLElement;
      const startRect = gridImg.getBoundingClientRect();

      clone.style.position = 'fixed';
      clone.style.top = `${startRect.top}px`;
      clone.style.left = `${startRect.left}px`;
      clone.style.width = `${startRect.width}px`;
      clone.style.height = `${startRect.height}px`;
      clone.style.transition = `all ${this.sidebarDuration}ms ease-out`;
      clone.style.zIndex = '9999';
      clone.style.pointerEvents = 'none';
      clone.style.visibility = 'visible';
      document.body.appendChild(clone);

      // Compute final position after sidebar slides 40%
      const sidebarFinalRect = sidebarImg.getBoundingClientRect();
      const finalLeft = container.getBoundingClientRect().width*0.4*0.075; // sidebar slide

      // Animate clone to sidebar
      requestAnimationFrame(() => {
        clone.style.top = `${sidebarFinalRect.top}px`;
        clone.style.left = `${finalLeft}px`;
        clone.style.width = `${sidebarFinalRect.width}px`;
        clone.style.height = `${sidebarFinalRect.height}px`;
      });

      // When clone animation ends, remove it and show sidebar image
      clone.addEventListener('transitionend', () => {
        clone.remove();
        sidebarImg.style.visibility = 'visible';
      });
      const fadeElements: { selector: string, delay: number }[] = [
        {selector: '.sidebar-name', delay: 300},
        {selector: '.sidebar-description', delay: 800},
        {selector: '.gallery', delay: 1300},
        {selector: '.close-btn', delay: 0}
      ];

      fadeElements.forEach(item => {
        setTimeout(() => {
          const el = document.querySelector(item.selector) as HTMLElement;
          if (el) el.style.opacity = '1';
        }, this.sidebarDuration + item.delay);
      });
    }, 0); // Next tick
  }

  async closeSidebar(gridImg: HTMLElement, project: ProjectDetails): Promise<void> {
    const sidebarImg = document.querySelector(`.sidebar img[data-project-name="${project.name}"]`) as HTMLElement;
    if (!sidebarImg || !gridImg) return;

    // Clone the sidebar image
    const clone = sidebarImg.cloneNode(true) as HTMLElement;
    const sidebarRect = sidebarImg.getBoundingClientRect();

    clone.style.position = 'fixed';
    clone.style.top = `${sidebarRect.top}px`;
    clone.style.left = `${sidebarRect.left}px`;
    clone.style.width = `${sidebarRect.width}px`;
    clone.style.height = `${sidebarRect.height}px`;
    clone.style.transition = 'all 1000ms ease-in';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.visibility = 'visible';
    document.body.appendChild(clone);

    // Hide originals
    sidebarImg.style.visibility = 'hidden';
    gridImg.style.visibility = 'hidden';

    // Force reflow
    clone.getBoundingClientRect();

    // Animate clone back to grid
    const gridRect = gridImg.getBoundingClientRect();
    requestAnimationFrame(() => {
      clone.style.top = `${gridRect.top}px`;
      clone.style.left = `${gridRect.left}px`;
      clone.style.width = `${gridRect.width}px`;
      clone.style.height = `${gridRect.height}px`;
    });

    // Wait for transition to finish
    await new Promise<void>(resolve => {
      clone.addEventListener('transitionend', () => {
        clone.remove();
        gridImg.style.visibility = 'visible';
        resolve();
      });
    });
  }
}
