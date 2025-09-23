import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ProjectDetails} from '../../models/project-details';
import {ProjectService} from '../../services/project.service';
import {CommonModule} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ViewStatus} from '../../enum/view-status';
import {DragScrollService} from '../../services/drag-scroll.service';
import {SidebarAnimationService} from '../../services/sidebar-animation.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  animations: [
    // Sidebar slide in/out
    trigger('sidebarSlide', [
      transition(':enter', [
        style({transform: 'translateX(-100%)', opacity: 0}),
        animate('600ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
      ]),
      transition(':leave', [
        animate('600ms ease-in', style({transform: 'translateX(-100%)', opacity: 0}))
      ])
    ]),
    // Grid slide right when sidebar is open
    trigger('gridSlide', [
      state('open', style({transform: 'translateX(40%)'})), // same width as sidebar
      state('closed', style({transform: 'translateX(0)'})),
      transition('closed => open', [animate('600ms ease-out')]),
      transition('open => closed', [animate('600ms ease-in')])
    ])
  ]
})
export class ProjectComponent implements OnInit, AfterViewInit {
  @ViewChild('gridExp') gridExpRef!: ElementRef<HTMLDivElement>;
  @ViewChild('gridCol3') gridCol3Ref!: ElementRef<HTMLDivElement>;

  protected projects: ProjectDetails[] = [];
  protected selectedProject?: ProjectDetails;
  protected selectedImageIndex: number = 0;

  protected view = {
    status: ViewStatus.EXPERIENCE,
    value: 'Experience view'
  };

  private sidebarBusy = false;
  private pendingSidebarAnimRes?: () => void;
  private pendingGridAnimRes?: () => void;

  imageWidths = [5846, 2400, 1800, 1200, 600, 300];

  windowWidth: number = window.innerWidth;
  sidebarDisabled: boolean = false;

  constructor(private projectService: ProjectService,
              private dragScrollService: DragScrollService,
              private sidebarAnimation: SidebarAnimationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.projects = this.projectService.getAllProjects();
    this.checkSidebar();
  }

  ngAfterViewInit() {
    const gridEl = this.gridExpRef?.nativeElement;
    const gridCol3 = this.gridCol3Ref?.nativeElement;

    // Register both scrollables so animateScrollable can find them
    // Don't enable momentum for the experience view grid
    if (gridEl) this.dragScrollService.registerScrollable(gridEl, false);
    if (gridCol3) this.dragScrollService.registerScrollable(gridCol3, false);

    // center experience grid
    if (gridEl) {
      gridEl.scrollLeft = (gridEl.scrollWidth - gridEl.clientWidth) / 2;
      gridEl.scrollTop = (gridEl.scrollHeight - gridEl.clientHeight) / 2;
    }

    // Keep observing for sidebar additions
    const observer = new MutationObserver(() => {
      const sidebarEl = document.querySelector('.sidebar');
      if (sidebarEl) {
        // Remove any previous sidebar scrollable
        this.dragScrollService.scrollables = this.dragScrollService.scrollables.filter(
          s => !(s.el.classList && s.el.classList.contains('sidebar'))
        );
        // Register the new sidebar element
        this.dragScrollService.registerScrollable(sidebarEl as HTMLElement, true);
      }
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
  }

  getSrcset(imageArray: string[]): string {
    return imageArray
      .map((url, i) => `${url} ${this.imageWidths[i]}w`)
      .join(', ');
  }

  getGallerySizes(numImages: number): string {
    // sidebar = 40% of viewport, gallery = 85% of sidebar
    const galleryWidthVW = 0.85 * 40; // 34vw
    const imageWidthVW = galleryWidthVW / numImages;
    return `${imageWidthVW}vw`;
  }

  gridImageSizes(): string {
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (w < h) {
      // portrait
      return "40vw";
    } else if (h <= 900) {
      // small landscape
      return "20vw";
    } else {
      // normal landscape
      return "26vw";
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
    // After view toggles, the other grid is created by *ngIf on next tick
    setTimeout(() => {
      const gridEl = this.gridExpRef?.nativeElement;
      const gridCol3 = this.gridCol3Ref?.nativeElement;
      if (gridEl) {
        // Don't enable momentum for the experience view grid
        this.dragScrollService.registerScrollable(gridEl, false);
        gridEl.scrollLeft = (gridEl.scrollWidth - gridEl.clientWidth) / 2;
        gridEl.scrollTop = (gridEl.scrollHeight - gridEl.clientHeight) / 2;
      }
      if (gridCol3) this.dragScrollService.registerScrollable(gridCol3, false);
    }, 0);
  }

  checkSidebar() {
    if (this.windowWidth < 800) {
      this.sidebarDisabled = true;
      this.closeSidebar() // close sidebar if open
    } else {
      this.sidebarDisabled = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = event.target.innerWidth;
    this.checkSidebar();
  }

  @HostListener('window:mouseup', ['$event'])
  @HostListener('window:pointerup', ['$event'])
  @HostListener('window:touchend', ['$event'])
  onMouseUp(event: MouseEvent | PointerEvent | TouchEvent) {
    const gridEl = this.gridExpRef?.nativeElement;
    if (gridEl) this.dragScrollService.endDrag(event, gridEl);
  }

  @HostListener('window:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    const gridEl = this.gridExpRef?.nativeElement;
    if (gridEl) this.dragScrollService.endDrag(event, gridEl);
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    // find registered scrollables
    const expScrollable = this.dragScrollService.scrollables.find(s => s.el === this.gridExpRef?.nativeElement);
    const col3Scrollable = this.dragScrollService.scrollables.find(s => s.el === this.gridCol3Ref?.nativeElement);
    const sidebarScrollable = this.dragScrollService.scrollables.find(s => s.el.classList && s.el.classList.contains('sidebar'));

    // Sidebar scroll (when open)
    if (this.selectedProject && sidebarScrollable) {
      // Ensure the sidebar has momentum enabled
      if (!sidebarScrollable.enableMomentum) {
        sidebarScrollable.enableMomentum = true;
      }

      event.preventDefault();
      sidebarScrollable.targetScrollTop = Math.max(0, Math.min(sidebarScrollable.el.scrollTop + event.deltaY, sidebarScrollable.el.scrollHeight - sidebarScrollable.el.clientHeight));
      this.dragScrollService.animateScrollable(sidebarScrollable);
      return;
    }

    // Experience view: intercept and animate scrolling
    if (!this.selectedProject && this.view.status === ViewStatus.EXPERIENCE && expScrollable) {
      event.preventDefault();
      expScrollable.targetScrollTop = expScrollable.el.scrollTop + event.deltaY;
      expScrollable.targetScrollLeft = expScrollable.el.scrollLeft + event.deltaX;
      this.dragScrollService.animateScrollable(expScrollable);
      return;
    }

    // Grid-Col3 view: animate scrolling
    if (!this.selectedProject && this.view.status === ViewStatus.GRID && col3Scrollable) {
      event.preventDefault();
      col3Scrollable.targetScrollTop = col3Scrollable.el.scrollTop + event.deltaY;
      col3Scrollable.targetScrollLeft = col3Scrollable.el.scrollLeft + event.deltaX;
      this.dragScrollService.animateScrollable(col3Scrollable);
      return;
    }
  }

  get gridState() {
    return this.selectedProject ? 'open' : 'closed';
  }

  handleExperienceInteraction(event: MouseEvent | PointerEvent | TouchEvent) {
    if (!this.sidebarBusy && this.selectedProject) {
      this.closeSidebar();
    }
    const gridEl = this.gridExpRef?.nativeElement;
    if (gridEl) this.dragScrollService.startDrag(event, gridEl, this.selectedProject);
  }

  onExperienceDrag(event: MouseEvent | PointerEvent | TouchEvent) {
    const gridEl = this.gridExpRef?.nativeElement;
    if (gridEl) this.dragScrollService.onDrag(event, gridEl);
  }

  async onImageClick(event: MouseEvent, project: ProjectDetails) {
    if (this.sidebarBusy || this.dragScrollService.moved || this.selectedProject ) return;
    if (this.sidebarDisabled) {
      this.router.navigate(['/main', project.slug]);
      return;
    }

    this.sidebarBusy = true;

    // Reset the selected image index when opening a new project
    this.selectedImageIndex = 0;

    // set selected project so the sidebar renders, then run the animation
    this.selectedProject = project;
    await this.sidebarAnimation.flyToSidebar(event.currentTarget as HTMLElement, project);

    this.sidebarBusy = false;
  }


  async closeSidebar() {
    if (!this.selectedProject || this.sidebarBusy) return;

    this.sidebarBusy = true;

    const gridImg = document.querySelector(`.grid-item img[data-project-name="${this.selectedProject.name}"]`) as HTMLElement;
    if (!gridImg) {
      this.selectedProject = undefined;
      this.sidebarBusy = false;
      return;
    }

    await this.sidebarAnimation.closeSidebar(gridImg, this.selectedProject);
    // trigger Angular remove which starts ':leave' for sidebar and 'open => closed' for grid
    this.selectedProject = undefined;

    // wait for both Angular animations to finish before clearing busy
    await Promise.all([
      new Promise<void>(res => this.pendingSidebarAnimRes = res),
      new Promise<void>(res => this.pendingGridAnimRes = res)
    ]);

    this.sidebarBusy = false;
  }

  onSidebarAnimDone(event: any) {
    if (event.toState === 'void' && this.pendingSidebarAnimRes) {
      this.pendingSidebarAnimRes();
      this.pendingSidebarAnimRes = undefined;
    }
  }

  onGridAnimDone(event: any) {
    if (event.toState === 'closed' && this.pendingGridAnimRes) {
      this.pendingGridAnimRes();
      this.pendingGridAnimRes = undefined;
    }
  }

  handleCol3Interaction(event: MouseEvent | PointerEvent | TouchEvent) {
    const gridCol3 = event.currentTarget as HTMLElement;
    this.dragScrollService.startDragOnCol3(event, gridCol3, this.selectedProject);
  }

  onCol3Drag(event: MouseEvent | PointerEvent | TouchEvent) {
    const gridCol3 = event.currentTarget as HTMLElement;
    this.dragScrollService.onDragCol3(event, gridCol3);
  }

  updateSelectedImage(index: number): void {
    if (index < 0 || index > this.selectedProject!.imageUrls.length-1) return;
    this.selectedImageIndex = index;
  }

  handleSidebarInteraction(event: MouseEvent | PointerEvent | TouchEvent) {
    const sidebarEl = event.currentTarget as HTMLElement;
    // Register the sidebar with momentum enabled
    this.dragScrollService.registerScrollable(sidebarEl, true);
    this.dragScrollService.startDrag(event, sidebarEl, null);
  }

  onSidebarDrag(event: MouseEvent | PointerEvent | TouchEvent) {
    const sidebarEl = event.currentTarget as HTMLElement;
    this.dragScrollService.onDrag(event, sidebarEl);
  }

  onSidebarDragEnd(event: MouseEvent | PointerEvent | TouchEvent) {
    const sidebarEl = event.currentTarget as HTMLElement;
    this.dragScrollService.endDrag(event, sidebarEl);
  }

  protected readonly ViewStatus = ViewStatus;
  protected readonly window = window;
}
