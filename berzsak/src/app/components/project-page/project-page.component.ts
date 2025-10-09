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

  isDarkMode: boolean = false;
  themeIcon: string = '/light-bulb/bulb-off.png';

  @ViewChild('seeMoreBtn') seeMoreButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('mainImage') projectImageRef!: ElementRef<HTMLDivElement>;
  @ViewChild('navigateBackArrow') navigateArrowRef!: ElementRef<HTMLElement>;
  arrowTop: number = 0;
  private scrolling = false;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private projectService: ProjectService,
              private dragScrollService: DragScrollService,
              private themeService: ThemeService) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      this.themeIcon = this.themeService.themeIcon;
    });

    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const slug = paramMap.get('slug');
      if (slug) {
        this.project = this.projectService.getProject(slug);
      }
      const button = document.querySelector('.see-more-btn') as HTMLElement;
        const validSlugs = ['resq-avalanche-transmitter', 'flying-shark', 'clock', 'lumen', 'tartáska', 'chess'];
        if (slug === 'archproject-shoe-insole-system') {
        button.style.color = '#FF6900';
      } else if (validSlugs.includes(slug!)) {
        button.style.color = 'white';
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
      this.seeMoreButton.nativeElement.style.transition = 'opacity 0.3s linear';
      this.seeMoreButton.nativeElement.style.opacity = '0';

      this.scrollY = projectPageWrapper.scrollTop;

      if (!this.scrolling) {
        this.scrolling = true;
        requestAnimationFrame(() => {
          this.updateArrowPosition();
          this.scrolling = false;
        });
      }

      const scrollable = this.dragScrollService.getScrollable('project-page-wrapper');
      if (!scrollable) return;

      if (!scrollable.isAnimating) {
        scrollable.currentTop = projectPageWrapper.scrollTop;
        scrollable.targetTop = projectPageWrapper.scrollTop;
      }
    });
    setTimeout(() => this.updateArrowPosition(), 0);
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

  updateArrowPosition() {
    const arrow = this.navigateArrowRef?.nativeElement;
    const mainImage = this.projectImageRef?.nativeElement;

    if (!arrow || !mainImage) return;

    // Choose the greater of (50vh) or (image bottom + 20px)
    const preferredTop = Math.max(window.innerHeight / 2, window.innerWidth * 0.6666 + 20);

    // How far we've scrolled
    const scrollY = this.wrapperRef.nativeElement.scrollTop;

    // Arrow should move up until it reaches 50vh
    const targetTop = Math.max(window.innerHeight / 2, Math.max(preferredTop - scrollY, window.innerHeight / 2));

    arrow.style.top = `${targetTop}px`;
  }

  openMail() {
    const email = 'berzsak.bulcsu@gmail.com';
    const mailtoLink = `mailto:${email}`;
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

    let opened = false;

    // Detect if page becomes hidden (user switched to mail app)
    const handleVisibilityChange = () => {
      opened = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Try to open default mail app
    window.location.href = mailtoLink;

    // Dynamically calculate fallback delay (50-500ms depending on device)
    const delay = Math.min(Math.max(50, 300), 500);

    setTimeout(() => {
      if (!opened) {
        window.open(gmailLink, '_blank');
      }
    }, delay);
  }
}
