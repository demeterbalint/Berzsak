import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ProjectDetails} from '../../models/project-details';
import {ProjectService} from '../../services/project.service';
import {CommonModule} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ViewStatus} from '../../enum/view-status';
import {DragScrollService} from '../../services/drag-scroll.service';
import {SidebarAnimationService} from '../../services/sidebar-animation.service';
import {Router} from '@angular/router';
import {ThemeService} from '../../services/theme.service';

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
export class ProjectComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('gridExp') gridExpRef!: ElementRef<HTMLDivElement>;
  @ViewChild('gridCol3') gridCol3Ref!: ElementRef<HTMLDivElement>;
  @ViewChild('sidebar') sidebarRef!: ElementRef<HTMLDivElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('itemGallery') itemGalleryRefs!: QueryList<ElementRef<HTMLDivElement>>;

  protected projects: ProjectDetails[] = [];
  protected gridProjects: ProjectDetails[] = [];
  protected selectedProject?: ProjectDetails;
  protected selectedImageIndex: number = 0;

  protected view = {
    status: ViewStatus.EXPERIENCE,
    valueExp: 'experience view',
    valueGrid: 'grid view'
  };

  private sidebarBusy = false;
  private pendingSidebarAnimRes?: () => void;
  private pendingGridAnimRes?: () => void;

  imageWidths = [5846, 2400, 1800, 1200, 600, 300];

  windowWidth: number = window.screen.width;
  sidebarDisabled: boolean = false;

  // Theme properties
  isDarkMode: boolean = false;
  themeIcon: number = 0;

  constructor(private projectService: ProjectService,
              private dragScrollService: DragScrollService,
              private sidebarAnimation: SidebarAnimationService,
              private router: Router,
              private themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.projects = this.projectService.getAllProjects();
    this.gridProjects = this.projectService.getAllProjects().filter(project => project.name !== 'dark-mode' && project.name !== 'profile');
    this.checkSidebar();

    // Subscribe to theme changes
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      this.themeIcon = this.themeService.themeIcon;
    });
  }

  ngAfterViewInit() {
    const fromView = this.dragScrollService.fromView;

    if (fromView === 'grid') {
      setTimeout(() => this.initializeGridView());
    } else {
      setTimeout(() => this.initializeExperienceView('zoom'));
    }
    this.dragScrollService.fromView = '';
  }

  ngOnDestroy() {
    // Ensure global listeners are cleaned up even if sidebar wasn't closed explicitly
    try {
      window.removeEventListener('pointerdown', this.globalPointerDownHandler as any, { capture: true } as any);
    } catch {}
  }

  toggleTheme() {
    this.themeService.toggleTheme();
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
    const w = window.screen.width;
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

  checkSidebar() {
    if (this.windowWidth < 800 || window.screen.orientation.type.startsWith('portrait')) {
      this.sidebarDisabled = true;
      this.closeSidebar() // close sidebar if open
    } else {
      this.sidebarDisabled = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = event.target.screen.width;
    this.checkSidebar();
  }

  get gridState() {
    return this.selectedProject ? 'open' : 'closed';
  }

  private globalPointerDownHandler = (e: PointerEvent) => {
    const sidebarEl = this.sidebarRef?.nativeElement;
    const closeBtn = document.querySelector('.close-btn') as HTMLElement;
    const contactDiv = document.querySelector('.contact-div-experience') as HTMLElement;

    if (!sidebarEl) return;

    // If the click is outside sidebar AND outside the close button
    if (!sidebarEl.contains(e.target as Node) && !(closeBtn?.contains(e.target as Node)) && !(contactDiv?.contains(e.target as Node))) {
      e.preventDefault();
      e.stopPropagation();
      this.closeSidebar();
    }
  };

  async onImageClick(event: MouseEvent, project: ProjectDetails) {
    if (this.sidebarBusy || this.selectedProject ) return;
    if (project.name === 'profile') {
      await this.router.navigate(['/berzsak/profile']);
      return;
    }
    if (this.sidebarDisabled) {
      this.dragScrollService.fromView = 'experience';
      await this.router.navigate(['/berzsak/projects', project.slug]);
      return;
    }

    this.sidebarBusy = true;

    // Reset the selected image index when opening a new project
    this.selectedImageIndex = 0;

    // set selected project so the sidebar renders, then run the animation
    this.selectedProject = project;
    await this.sidebarAnimation.flyToSidebar(event.currentTarget as HTMLElement, project);

    const sidebarEl = this.sidebarRef?.nativeElement;
    if (sidebarEl) {
      this.dragScrollService.register(sidebarEl, 'sidebar');
    }
    sidebarEl.addEventListener('scroll', () => {
      const scrollable = this.dragScrollService.getScrollable('sidebar');
      if (!scrollable) return;

      if (!scrollable.isAnimating) {
        scrollable.currentTop = sidebarEl.scrollTop;
        scrollable.targetTop = sidebarEl.scrollTop;
      }
    });

    window.addEventListener('pointerdown', this.globalPointerDownHandler, { capture: true });
    // Ensure no duplicated handlers
    this.removeGlobalPointerHandlerIfAny();
    window.addEventListener('pointerdown', this.globalPointerDownHandler, { capture: true });

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

    this.removeGlobalPointerHandlerIfAny();

    // wait for both Angular animations to finish before clearing busy
    await Promise.all([
      new Promise<void>(res => this.pendingSidebarAnimRes = res),
      new Promise<void>(res => this.pendingGridAnimRes = res)
    ]);

    this.sidebarBusy = false;
  }

  private removeGlobalPointerHandlerIfAny() {
    try {
      window.removeEventListener('pointerdown', this.globalPointerDownHandler as any, { capture: true } as any);
    } catch {}
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

  updateSelectedImage(index: number): void {
    if (!this.selectedProject) return;
    if (index < 0 ) {
      this.selectedImageIndex = this.selectedProject?.imageUrls.length-1;
    } else if (index === this.selectedProject?.imageUrls.length) {
      this.selectedImageIndex = 0;
    } else {
      this.selectedImageIndex = index;
    }
  }

  protected readonly ViewStatus = ViewStatus;
  protected readonly window = window;

  syncGridScroll(gridEl: HTMLElement) {
    gridEl.addEventListener('scroll', () => {
      const scrollable = this.dragScrollService.getScrollable('experience-grid');
      if (!scrollable) return;

      if (!scrollable.isAnimating) {
        scrollable.currentTop = gridEl.scrollTop;
        scrollable.targetTop = gridEl.scrollTop;
      }
    });
  }

  viewChange() {
    if (this.view.status === ViewStatus.GRID) {
      this.view.status = ViewStatus.EXPERIENCE;
      setTimeout(() => this.initializeExperienceView());
    } else {
      this.view.status = ViewStatus.GRID;
      setTimeout(() => this.initializeGridView());
    }
  }

  private initializeGridView() {
    if (this.view.status !== ViewStatus.GRID) {
      this.view.status = ViewStatus.GRID;
      setTimeout(() => this.finishGridInit());
      return;
    }
    this.finishGridInit();
  }

  private finishGridInit() {
    const gridCol3El = this.gridCol3Ref?.nativeElement;
    if (!gridCol3El) return;
    this.dragScrollService.register(gridCol3El, 'grid-col-3');
    gridCol3El.addEventListener('scroll', () => {
      const scrollable = this.dragScrollService.getScrollable('grid-col-3');
      if (!scrollable) return;
      if (!scrollable.isAnimating) {
        scrollable.currentTop = gridCol3El.scrollTop;
        scrollable.targetTop = gridCol3El.scrollTop;
      }
    });
    if (this.itemGalleryRefs && this.itemGalleryRefs.length > 0) {
      this.itemGalleryRefs.forEach(galleryRef => {
        const galleryEl = galleryRef.nativeElement;
        this.dragScrollService.dragItemGallery(galleryEl);
      });
    } else if (this.itemGalleryRefs) {
      const sub = this.itemGalleryRefs.changes.subscribe(() => {
        this.itemGalleryRefs.forEach(galleryRef => {
          const galleryEl = galleryRef.nativeElement;
          this.dragScrollService.dragItemGallery(galleryEl);
        });
        sub.unsubscribe();
      });
    }
  }

  private initializeExperienceView(zoom?: string) {
    this.view.status = ViewStatus.EXPERIENCE;
    const wrapper = this.gridExpRef?.nativeElement;
    const container = this.containerRef?.nativeElement as HTMLElement | undefined;
    const grid = wrapper.querySelector('.grid-experience') as HTMLElement | null;
    if (!wrapper || !container || !grid) return;

    const contentWidth = grid.scrollWidth;
    const contentHeight = grid.scrollHeight;
    const viewportWidth = wrapper.clientWidth;
    const viewportHeight = wrapper.clientHeight;

    const scaleX = viewportWidth / contentWidth;
    const scaleY = viewportHeight / contentHeight;
    const initialScale = Math.min(scaleX, scaleY, 1);

    grid.style.transformOrigin = 'center center';
    grid.style.transition = 'none';

    wrapper.scrollLeft = (contentWidth - viewportWidth) / 2;
    wrapper.scrollTop = (contentHeight - viewportHeight) / 2;

    if (zoom) {
      grid.style.transform = `scale(${initialScale})`;
      container.style.pointerEvents = 'none';
      wrapper.style.pointerEvents = 'none';
      grid.style.pointerEvents = 'none';

      setTimeout(() => {
        grid.style.transition = `transform 1s ease-in-out`;
        grid.style.transform = 'scale(1)';
        setTimeout(() => {
          container.style.pointerEvents = 'auto';
          wrapper.style.pointerEvents = 'auto';
          grid.style.pointerEvents = 'auto';
          this.dragScrollService.register(wrapper, 'experience-grid');
          this.dragScrollService.dragExperienceView(wrapper);
        }, 1000);
      }, 1000);
    } else {
      container.style.pointerEvents = 'auto';
      wrapper.style.pointerEvents = 'auto';
      grid.style.pointerEvents = 'auto';
      this.dragScrollService.register(wrapper, 'experience-grid');
      this.dragScrollService.dragExperienceView(wrapper);
    }

    wrapper.style.cursor = 'grab';
    this.syncGridScroll(wrapper);
  }

  onBrandClick() {
    this.dragScrollService.fromView = '';
    this.selectedProject = undefined;
    this.view.status = ViewStatus.EXPERIENCE;
    setTimeout(() => {
      this.initializeExperienceView('zoom');
    });
  }

  onProjectClick(slug: string, view: string) {
    this.dragScrollService.fromView = view;
    this.router.navigate(['/berzsak/projects', slug]);
  }

  openMail() {
    this.projectService.openMail();
  }
}
