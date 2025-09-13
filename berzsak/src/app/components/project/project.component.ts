import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ProjectDetails} from '../../models/project-details';
import {ProjectService} from '../../services/project.service';
import {CommonModule} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ViewStatus} from '../../enum/view-status';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  animations: [
    // Sidebar slide in/out
    trigger('sidebarSlide', [
      transition(':enter', [
        style({transform: 'translateX(-100%)', opacity: 0}),
        animate('1s ease-out', style({transform: 'translateX(0)', opacity: 1}))
      ]),
      transition(':leave', [
        animate('1s ease-in', style({transform: 'translateX(-100%)', opacity: 0}))
      ])
    ]),
    // Grid slide right when sidebar is open
    trigger('gridSlide', [
      state('open', style({transform: 'translateX(40%)'})), // same width as sidebar
      state('closed', style({transform: 'translateX(0)'})),
      transition('closed => open', [animate('1s ease-out')]),
      transition('open => closed', [animate('1s ease-in')])
    ])
  ]
})
export class ProjectComponent implements OnInit, AfterViewInit {
  @ViewChild('grid') gridRef!: ElementRef<HTMLDivElement>;

  projects: ProjectDetails[] = [];
  selectedProject?: ProjectDetails;

  private dragging = false;
  private moved = false;
  private startX = 0;
  private startY = 0;
  private scrollLeft = 0;
  private scrollTop = 0;

  private onDragBound = (event: MouseEvent) => this.onDrag(event);
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

  private scrollables: {
    el: HTMLElement;
    targetScrollTop: number;
    targetScrollLeft: number;
    animating: boolean;
  }[] = [];

  protected view = {
    status: ViewStatus.EXPERIENCE,
    value: 'Experience view'
  };

  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.projects = this.projectService.getAllProjects();
  }

  ngAfterViewInit() {
    const gridEl = this.gridRef.nativeElement;

    if (gridEl) {
      this.scrollables.push({ el: gridEl, targetScrollTop: gridEl.scrollTop, targetScrollLeft: gridEl.scrollLeft, animating: false });
      // Optional: center grid initially
      gridEl.scrollLeft = (gridEl.scrollWidth - gridEl.clientWidth) / 2;
      gridEl.scrollTop = (gridEl.scrollHeight - gridEl.clientHeight) / 2;
    }
  }

  viewChange() {
    if (this.view.status === ViewStatus.EXPERIENCE) {
      this.view.status = ViewStatus.GRID;
      this.view.value = 'Grid view';
    } else {
      this.view.status = ViewStatus.EXPERIENCE;
      this.view.value = 'Experience view';
    }
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    const grid = this.scrollables.find(s => s.el === this.gridRef.nativeElement);
    const sidebar = this.scrollables.find(s => s.el.matches('.sidebar'));

    if (this.selectedProject && sidebar) {
      event.preventDefault();
      sidebar.targetScrollTop = sidebar.el.scrollTop;
      sidebar.targetScrollTop += event.deltaY;
      sidebar.targetScrollTop = Math.max(0, Math.min(sidebar.targetScrollTop, sidebar.el.scrollHeight - sidebar.el.clientHeight));
      this.animateScrollable(sidebar);
    } else if (!this.selectedProject && grid) {
      event.preventDefault();
      grid.targetScrollTop = grid.el.scrollTop;
      grid.targetScrollLeft = grid.el.scrollLeft;
      grid.targetScrollTop += event.deltaY;
      grid.targetScrollLeft += event.deltaX;
      this.animateScrollable(grid);
    }
  }

  private registerSidebar() {
    const sidebarEl = document.querySelector('.sidebar') as HTMLElement;
    if (!sidebarEl) return;

    // only add once
    if (!this.scrollables.find(s => s.el === sidebarEl)) {
      this.scrollables.push({
        el: sidebarEl,
        targetScrollTop: sidebarEl.scrollTop,
        targetScrollLeft: sidebarEl.scrollLeft,
        animating: false
      });
    }
  }

  get gridState() {
    return this.selectedProject ? 'open' : 'closed';
  }

  get canDrag(): boolean {
    return !this.selectedProject; // draggable only when sidebar is closed
  }

  handleGridInteraction(event: MouseEvent) {
    // If sidebar is open, close it immediately
    if (this.selectedProject) {
      this.closeSidebar();
    }
    this.startDrag(event);
  }

  startDrag(event: MouseEvent) {
    if (!this.canDrag) return;
    this.dragging = true;
    this.moved = false;
    const el = this.gridRef.nativeElement;

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

  onDrag(event: MouseEvent) {
    if (!this.dragging) return;

    event.preventDefault(); // prevent text/image selection

    const el = this.gridRef.nativeElement;
    const x = event.pageX - el.offsetLeft;
    const y = event.pageY - el.offsetTop;

    const walkX = this.startX - x; // horizontal distance moved
    const walkY = this.startY - y; // vertical distance moved

    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
      this.moved = true; // mark as actual drag
    }
    const grid = this.scrollables.find(s => s.el === el);
    if (grid) {
      grid.targetScrollLeft = this.scrollLeft + walkX;
      grid.targetScrollTop = this.scrollTop + walkY;
      this.animateScrollable(grid);
    }
  }

  endDrag(_event?: MouseEvent) {
    this.dragging = false;
    // Restore cursor
    if (this.gridRef && this.gridRef.nativeElement) {
      this.gridRef.nativeElement.style.cursor = 'grab';
    }

    // Remove global listeners
    window.removeEventListener('mousemove', this.onDragBound);
    window.removeEventListener('mouseup', this.endDragBound);
    window.removeEventListener('mouseout', this.onWindowMouseOutBound);
    window.removeEventListener('blur', this.onWindowBlurBound);
    document.removeEventListener('visibilitychange', this.onVisibilityChangeBound);
    window.removeEventListener('pointercancel', this.onPointerCancelBound);
  }

  private animateScrollable(scrollable: { el: HTMLElement; targetScrollTop: number; targetScrollLeft: number; animating: boolean }) {
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

  onImageClick(event: MouseEvent, project: ProjectDetails) {
    if (this.selectedProject) {
      this.closeSidebar();
      return;
    }
    if (!this.moved) {
      this.flyToSidebar(event, project);
    }
  }

  flyToSidebar(event: MouseEvent, project: ProjectDetails) {
    const gridImg = event.currentTarget as HTMLElement;
    gridImg.style.visibility = 'hidden';

    this.selectedProject = project;
    setTimeout(() => {
      this.registerSidebar();
    }, 0);

    // Wait for Angular to render the sidebar
    setTimeout(() => {
      const sidebarImg = document.querySelector(
        '.sidebar img[data-project-name="' + project.name + '"]'
      ) as HTMLElement;
      if (!sidebarImg) return;
      sidebarImg.style.visibility = 'hidden';

      const clone = gridImg.cloneNode(true) as HTMLElement;
      const startRect = gridImg.getBoundingClientRect();

      clone.style.position = 'fixed';
      clone.style.top = `${startRect.top}px`;
      clone.style.left = `${startRect.left}px`;
      clone.style.width = `${startRect.width}px`;
      clone.style.height = `${startRect.height}px`;
      clone.style.transition = 'all 1000ms ease-out';
      clone.style.zIndex = '9999';
      clone.style.pointerEvents = 'none';
      clone.style.visibility = 'visible';
      document.body.appendChild(clone);

      const sidebarWidth = 500; // must match your CSS
      const sidebarRect = sidebarImg.getBoundingClientRect();
      const finalTop = sidebarRect.top;
      const finalLeft = sidebarRect.left + sidebarWidth; // move clone horizontally along with sidebar

      // Animate the clone in sync with the sidebar slide
      requestAnimationFrame(() => {
        clone.style.top = `${finalTop}px`;
        clone.style.left = `${finalLeft}px`;
        clone.style.width = `${sidebarRect.width}px`;
        clone.style.height = `${sidebarRect.height}px`;
      });

      clone.addEventListener('transitionend', () => {
        clone.remove();
        sidebarImg.style.visibility = 'visible';
      });
    }, 0); // next tick

    const sidebarDuration = 1000; // 1s

    setTimeout(() => {
      const name = document.querySelector('.sidebar-name') as HTMLElement;
      if (name) name.style.opacity = '1';
    }, sidebarDuration + 300);

    setTimeout(() => {
      const description = document.querySelector('.sidebar-description') as HTMLElement;
      if (description) description.style.opacity = '1';
    }, sidebarDuration + 800);

    setTimeout(() => {
      const gallery = document.querySelector('.gallery') as HTMLElement;
      if (gallery) gallery.style.opacity = '1';
    }, sidebarDuration + 1300);
  }


  closeSidebar() {
    if (!this.selectedProject) return;

    const sidebarImg = document.querySelector('.sidebar img[data-project-name="' + this.selectedProject.name + '"]') as HTMLElement;
    const gridImg = document.querySelector('.grid-item img[data-project-name="' + this.selectedProject.name + '"]') as HTMLElement;
    if (!sidebarImg || !gridImg) {
      this.selectedProject = undefined;
      return;
    }

    // Clone the sidebar image
    const clone = sidebarImg.cloneNode(true) as HTMLElement;
    const sidebarRect = sidebarImg.getBoundingClientRect();
    clone.style.position = 'fixed';
    clone.style.top = sidebarRect.top + 'px';
    clone.style.left = sidebarRect.left + 'px';
    clone.style.width = sidebarRect.width + 'px';
    clone.style.height = sidebarRect.height + 'px';
    clone.style.transition = 'all 1000ms ease-in';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    document.body.appendChild(clone);

    // Hide sidebar and grid images during animation
    sidebarImg.style.visibility = 'hidden';
    gridImg.style.visibility = 'hidden';

    // Force reflow
    clone.getBoundingClientRect();

    // Animate clone back to grid
    const gridRect = gridImg.getBoundingClientRect();
    requestAnimationFrame(() => {
      clone.style.top = gridRect.top + 'px';
      clone.style.left = gridRect.left + 'px';
      clone.style.width = gridRect.width + 'px';
      clone.style.height = gridRect.height + 'px';
    });

    clone.addEventListener('transitionend', () => {
      clone.remove();
      gridImg.style.visibility = 'visible';
      this.selectedProject = undefined;
    });
  }

  showContact() {
    return;
  }

  /*private animateScroll(el: HTMLElement) {
    const lag = 0.1; // adjust 0.1–0.25 for how much lag (≈0.2 sec)

    const step = () => {
      // Interpolate current -> target
      el.scrollLeft += (this.targetScrollLeft - el.scrollLeft) * lag;
      el.scrollTop += (this.targetScrollTop - el.scrollTop) * lag;

      // Keep animating while dragging
      if (this.dragging || Math.abs(this.targetScrollLeft - el.scrollLeft) > 0.5 || Math.abs(this.targetScrollTop - el.scrollTop) > 0.5) {
        requestAnimationFrame(step);
      } else {
        this.animating = false;
      }
    };

    requestAnimationFrame(step);
  }*/
}
