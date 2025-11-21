import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {ProjectDetails} from '../../models/project-details';
import {NgForOf, NgIf, SlicePipe} from '@angular/common';
import {DragScrollService} from '../../services/drag-scroll.service';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-project-page',
  imports: [
    RouterLink,
    NgForOf,
    SlicePipe,
    NgIf,
  ],
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit, AfterViewInit{

  protected project!: ProjectDetails;
  private imageWidths = [5846, 2400, 1800, 1200, 600, 300];
  protected windowWidth: number = window.innerWidth;
  protected scrollY = 0;
  protected cameFromView: 'grid' | 'experience' = 'experience';
  protected showGallery: boolean = false;
  protected galleryIndex: number = 0;

  isDarkMode: boolean = false;
  private suppressScrollFade = false;

  @ViewChild('seeMoreBtn') seeMoreButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('galleryImages') galleryImagesRef?: ElementRef<HTMLDivElement>;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private projectService: ProjectService,
              private dragScrollService: DragScrollService,
              private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const slug = paramMap.get('slug');
      if (slug) {
        this.project = this.projectService.getProject(slug);
        setTimeout(() => {
          const projectPageWrapper = this.wrapperRef.nativeElement;
          this.resetPage(projectPageWrapper)
        });
      }
      const button = document.querySelector('.see-more-btn') as HTMLElement;
      const validSlugs = ['avalanche transmitter', 'flying shark', 'clock', 'solar panel', 'posture corrector backpack', 'chess'];
      if (slug === 'shoe insole') {
        button.style.color = '#FF6900';
      } else if (validSlugs.includes(slug!)) {
        button.style.color = '#ffffff';
      } else {
        button.style.color = '#000000';
      }
    },
      error => {
        console.log(error);
      }
    )

    this.activatedRoute.queryParamMap.subscribe(params => {
      const view = params.get('view') as 'grid' | 'experience' | null;
      if (view) {
        this.cameFromView = view;
      }
    },
      error => {
        console.log(error);
      }
    );
  }

  ngAfterViewInit() {
    const projectPageWrapper = this.wrapperRef.nativeElement;
    this.dragScrollService.register(projectPageWrapper, 'project-page-wrapper');

    projectPageWrapper.addEventListener('scroll', () => {
      if (this.suppressScrollFade) return;

      this.seeMoreButton.nativeElement.style.transition = 'opacity 0.3s linear';
      this.seeMoreButton.nativeElement.style.opacity = '0';

      this.scrollY = projectPageWrapper.scrollTop;

      const scrollable = this.dragScrollService.getScrollable('project-page-wrapper');
      if (!scrollable) return;

      if (!scrollable.isAnimating) {
        scrollable.currentTop = projectPageWrapper.scrollTop;
        scrollable.targetTop = projectPageWrapper.scrollTop;
      }
    });
  }

  // ---- Gallery zoom/pan state ----
  protected galleryScale = 1;
  private galleryMinScale = 1;
  private galleryMaxScale = 10; // increased to allow deeper zoom
  // Tunable zoom intensities
  private wheelZoomIntensity = 0.002; // mouse wheel without pinch
  private trackpadZoomIntensity = 0.02; // touchpad pinch (wheel event with ctrlKey)
  // Heuristic threshold (in pixels) to detect trackpad two-finger slide vs mouse wheel
  // When deltaMode==0 and |deltaY| is small (< threshold) or there is horizontal delta, we treat as trackpad pan.
  private trackpadPanThreshold = 40;
  protected translateX = 0;
  protected translateY = 0;
  protected imgTransition = '';
  protected get galleryTransform(): string {
    return `translate(${this.translateX}px, ${this.translateY}px) scale(${this.galleryScale})`;
  }
  protected get cursorStyle(): string {
    if (this.galleryScale <= 1) return 'default';
    return this.isPanning ? 'grabbing' : 'grab';
  }
  protected isHighResLoaded = false;

  private activePointers = new Map<number, {x: number, y: number}>();
  private lastPan?: {x: number, y: number};
  private initialPinch?: {distance: number, midX: number, midY: number, startScale: number, startTX: number, startTY: number};
  private isPanning = false;

  // Clamp translate so the scaled image always fills the container (no empty gaps)
  private clampTransforms() {
    const container = this.galleryImagesRef?.nativeElement;
    if (!container) return;
    if (this.galleryScale <= 1) {
      // When not zoomed, keep centered
      this.galleryScale = 1;
      this.translateX = 0;
      this.translateY = 0;
      return;
    }
    const rect = container.getBoundingClientRect();
    const maxX = (rect.width * (this.galleryScale - 1)) / 2;
    const maxY = (rect.height * (this.galleryScale - 1)) / 2;
    if (this.translateX > maxX) this.translateX = maxX;
    if (this.translateX < -maxX) this.translateX = -maxX;
    if (this.translateY > maxY) this.translateY = maxY;
    if (this.translateY < -maxY) this.translateY = -maxY;
  }

  private resetPage(projectPageWrapper: HTMLElement) {
    this.suppressScrollFade = true;

    projectPageWrapper.scrollTop = 0;
    const scrollable = this.dragScrollService.getScrollable('project-page-wrapper');
    if (scrollable) {
      scrollable.currentTop = 0;
      scrollable.targetTop = 0;
    }
    this.scrollY = 0;
    this.seeMoreButton.nativeElement.style.opacity = '1';
    setTimeout(() => this.suppressScrollFade = false, 100);
  }

  getSrcset(imageArray: string[]): string {
    return imageArray
      .map((url, i) => `${url} ${this.imageWidths[i]}w`)
      .join(', ');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
  }

  protected readonly window = window;

  scrollDown() {
    this.dragScrollService.scrollDown('project-page-wrapper', window.innerWidth * 0.6666);
    this.seeMoreButton.nativeElement.style.transition = 'opacity 0.3s linear';
    this.seeMoreButton.nativeElement.style.opacity = '0';
  }

  onBrandClick() {
    this.dragScrollService.fromView = '';
    this.router.navigate(['/berzsak']);
  }

  openMail() {
    this.projectService.openMail();
  }

  anotherProject() {
    this.router.navigate(['/berzsak/projects', this.projectService.randomProjectSlug()]);
  }

  protected openGallery(number: number) {
    this.galleryIndex = number;
    this.showGallery = true;
    this.resetZoom();
  }

  // ---- Gallery navigation with zoom reset ----
  protected prevImage() {
    if (this.galleryIndex > 0) {
      this.galleryIndex = this.galleryIndex - 1;
      this.resetZoom();
    }
  }

  protected nextImage() {
    if (this.galleryIndex < this.project.imageUrls.length - 1) {
      this.galleryIndex = this.galleryIndex + 1;
      this.resetZoom();
    }
  }

  private resetZoom() {
    this.galleryScale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.imgTransition = 'transform 0.15s ease-out';
    setTimeout(() => this.imgTransition = '', 160);
  }

  // ---- Wheel zoom ----
  protected onGalleryWheel(event: WheelEvent) {
    const container = this.galleryImagesRef?.nativeElement;
    if (!container) return;

    // Normalize delta across devices for both axes
    let deltaX = event.deltaX;
    let deltaY = event.deltaY;
    // Normalize deltaMode: 0=pixel, 1=line, 2=page
    if (event.deltaMode === 1) {
      deltaX *= 33; // approximate pixels per line
      deltaY *= 33;
    } else if (event.deltaMode === 2) {
      deltaX *= 800; // rough page height in pixels
      deltaY *= 800;
    }

    // If ctrlKey is pressed, this is a trackpad pinch gesture → perform zoom.
    if (event.ctrlKey) {
      event.preventDefault();
      const rect = container.getBoundingClientRect();
      const mouseX = event.clientX - rect.left - rect.width / 2;
      const mouseY = event.clientY - rect.top - rect.height / 2;

      const intensity = this.trackpadZoomIntensity;
      const delta = -deltaY; // wheel up -> zoom in
      const zoomFactor = Math.exp(delta * intensity); // smooth exponential scaling
      const oldScale = this.galleryScale;
      let newScale = oldScale * zoomFactor;
      newScale = Math.max(this.galleryMinScale, Math.min(this.galleryMaxScale, newScale));
      const scaleChange = newScale / oldScale;

      // Adjust translate so zoom focuses on cursor point
      this.translateX = this.translateX * scaleChange + mouseX * (1 - scaleChange);
      this.translateY = this.translateY * scaleChange + mouseY * (1 - scaleChange);

      this.galleryScale = newScale;
      this.clampTransforms();
      this.imgTransition = 'transform 0.06s linear';
      setTimeout(() => this.imgTransition = '', 70);
      return;
    }

    // Decide between trackpad two-finger slide (pan) and mouse wheel (zoom) when ctrlKey is not pressed
    const isLikelyTrackpadSlide = event.deltaMode === 0 && (Math.abs(deltaX) > 0 || Math.abs(deltaY) < this.trackpadPanThreshold);

    if (isLikelyTrackpadSlide) {
      // Trackpad two-finger slide → pan only when zoomed in; otherwise allow default scrolling
      if (this.galleryScale > 1) {
        event.preventDefault();
        this.translateX -= deltaX;
        this.translateY -= deltaY;
        this.clampTransforms();
        this.imgTransition = 'transform 0.04s linear';
        setTimeout(() => this.imgTransition = '', 60);
      }
      return;
    }

    // Otherwise treat as mouse wheel → perform zoom with wheelZoomIntensity
    {
      const rect = container.getBoundingClientRect();
      const mouseX = event.clientX - rect.left - rect.width / 2;
      const mouseY = event.clientY - rect.top - rect.height / 2;
      event.preventDefault();
      const intensity = this.wheelZoomIntensity;
      const delta = -deltaY; // wheel up -> zoom in
      const zoomFactor = Math.exp(delta * intensity);
      const oldScale = this.galleryScale;
      let newScale = oldScale * zoomFactor;
      newScale = Math.max(this.galleryMinScale, Math.min(this.galleryMaxScale, newScale));
      const scaleChange = newScale / oldScale;

      this.translateX = this.translateX * scaleChange + mouseX * (1 - scaleChange);
      this.translateY = this.translateY * scaleChange + mouseY * (1 - scaleChange);
      this.galleryScale = newScale;
      this.clampTransforms();
      this.imgTransition = 'transform 0.06s linear';
      setTimeout(() => this.imgTransition = '', 70);
      return;
    }
  }

  // ---- Pointer-based pan and pinch zoom ----
  protected onPointerDown(ev: PointerEvent) {
    const target = ev.currentTarget as HTMLElement | null;
    if (target && target.setPointerCapture) {
      try { target.setPointerCapture(ev.pointerId); } catch {}
    }
    this.activePointers.set(ev.pointerId, {x: ev.clientX, y: ev.clientY});
    if (this.activePointers.size === 1) {
      this.lastPan = {x: ev.clientX, y: ev.clientY};
      this.isPanning = true;
    } else if (this.activePointers.size === 2) {
      const pts = Array.from(this.activePointers.values());
      const dx = pts[1].x - pts[0].x;
      const dy = pts[1].y - pts[0].y;
      const distance = Math.hypot(dx, dy);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const container = this.galleryImagesRef?.nativeElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      this.initialPinch = {
        distance,
        midX: midX - rect.left - rect.width / 2,
        midY: midY - rect.top - rect.height / 2,
        startScale: this.galleryScale,
        startTX: this.translateX,
        startTY: this.translateY,
      };
    }
  }

  protected onPointerMove(ev: PointerEvent) {
    if (!this.activePointers.has(ev.pointerId)) return;
    this.activePointers.set(ev.pointerId, {x: ev.clientX, y: ev.clientY});

    if (this.activePointers.size === 1 && this.galleryScale > 1 && this.lastPan) {
      this.imgTransition = '';
      const dx = ev.clientX - this.lastPan.x;
      const dy = ev.clientY - this.lastPan.y;
      this.translateX += dx;
      this.translateY += dy;
      this.lastPan = {x: ev.clientX, y: ev.clientY};
      this.clampTransforms();
    }

    if (this.activePointers.size === 2 && this.initialPinch) {
      const pts = Array.from(this.activePointers.values());
      const dx = pts[1].x - pts[0].x;
      const dy = pts[1].y - pts[0].y;
      const distance = Math.hypot(dx, dy);
      const scale = this.initialPinch.startScale * (distance / this.initialPinch.distance);
      const newScale = Math.max(this.galleryMinScale, Math.min(this.galleryMaxScale, scale));
      const scaleChange = newScale / this.galleryScale;

      // Update translate relative to pinch midpoint
      this.translateX = this.translateX * scaleChange + this.initialPinch.midX * (1 - scaleChange);
      this.translateY = this.translateY * scaleChange + this.initialPinch.midY * (1 - scaleChange);
      this.galleryScale = newScale;
      this.clampTransforms();
    }
  }

  protected onPointerUp(ev: PointerEvent) {
    const target = ev.currentTarget as HTMLElement | null;
    if (target && target.releasePointerCapture) {
      try { target.releasePointerCapture(ev.pointerId); } catch {}
    }
    this.activePointers.delete(ev.pointerId);
    if (this.activePointers.size < 2) {
      this.initialPinch = undefined;
    }
    if (this.activePointers.size === 0) {
      this.lastPan = undefined;
      this.isPanning = false;
    }
  }
}
