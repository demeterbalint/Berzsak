import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
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
import {Router, RouterLink} from '@angular/router';
import {ThemeService} from '../../services/theme.service';

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
  @ViewChild('sidebar') sidebarRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('itemGallery') itemGalleryRefs!: QueryList<ElementRef<HTMLDivElement>>;

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

  // Theme properties
  isDarkMode: boolean = false;
  themeIcon: string = '/light-bulb/bulb-off.png';

  constructor(private projectService: ProjectService,
              private dragScrollService: DragScrollService,
              private sidebarAnimation: SidebarAnimationService,
              private router: Router,
              private themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.projects = this.projectService.getAllProjects();
    this.checkSidebar();
    
    // Subscribe to theme changes
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      this.themeIcon = this.themeService.themeIcon;
    });
  }

  ngAfterViewInit() {
    const gridEl = this.gridExpRef.nativeElement;

    if (gridEl) {
      gridEl.scrollLeft = (gridEl.scrollWidth - gridEl.clientWidth) / 2;
      gridEl.scrollTop = (gridEl.scrollHeight - gridEl.clientHeight) / 2;
    }
    this.dragScrollService.register(gridEl, 'experience-grid');
    this.dragScrollService.dragExperienceView(gridEl);
    this.syncGridScroll(gridEl);
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

      setTimeout(() => {
        const gridCol3El = this.gridCol3Ref?.nativeElement;
        if (gridCol3El) {
          this.dragScrollService.register(gridCol3El, 'grid-col-3');
        }
        gridCol3El.addEventListener('scroll', () => {
          const scrollable = this.dragScrollService.getScrollable('grid-col-3');
          if (!scrollable) return;

          if (!scrollable.isAnimating) {
            scrollable.current = gridCol3El.scrollTop;
            scrollable.target = gridCol3El.scrollTop;
          }
        });
        this.itemGalleryRefs.forEach(galleryRef => {
          const galleryEl = galleryRef.nativeElement;
          this.dragScrollService.dragItemGallery(galleryEl);
        });
      })

    } else {
      this.view.status = ViewStatus.EXPERIENCE;
      this.view.value = 'Experience view';

      setTimeout(() => {const gridEl = this.gridExpRef?.nativeElement;
        if (gridEl) {
          gridEl.scrollLeft = (gridEl.scrollWidth - gridEl.clientWidth) / 2;
          gridEl.scrollTop = (gridEl.scrollHeight - gridEl.clientHeight) / 2;
          this.dragScrollService.dragExperienceView(gridEl);
          gridEl.style.touchAction = 'none';
          gridEl.style.cursor = 'grab';
          this.dragScrollService.register(gridEl, 'experience-grid');
          this.syncGridScroll(gridEl);
        }
      });
    }
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
    if (this.sidebarBusy || /*this.dragScrollService.moved ||*/ this.selectedProject ) return;
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

    const sidebarEl = this.sidebarRef?.nativeElement;
    if (sidebarEl) {
      this.dragScrollService.register(sidebarEl, 'sidebar');
    }
    sidebarEl.addEventListener('scroll', () => {
      const scrollable = this.dragScrollService.getScrollable('sidebar');
      if (!scrollable) return;

      if (!scrollable.isAnimating) {
        scrollable.current = sidebarEl.scrollTop;
        scrollable.target = sidebarEl.scrollTop;
      }
    });

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

    window.removeEventListener('pointerdown', this.globalPointerDownHandler, { capture: true });

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

  updateSelectedImage(index: number): void {
    if (index < 0 || index > this.selectedProject!.imageUrls.length-1) return;
    this.selectedImageIndex = index;
  }

  protected readonly ViewStatus = ViewStatus;
  protected readonly window = window;

  syncGridScroll(gridEl: HTMLElement) {
    gridEl.addEventListener('scroll', () => {
      const scrollable = this.dragScrollService.getScrollable('experience-grid');
      if (!scrollable) return;

      if (!scrollable.isAnimating) {
        scrollable.current = gridEl.scrollTop;
        scrollable.target = gridEl.scrollTop;
      }
    });
  }
}
