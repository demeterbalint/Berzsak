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
  themeIcon: string = '/light-bulb/bulb-off.jpg';
  private suppressScrollFade = false;

  @ViewChild('seeMoreBtn') seeMoreButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private projectService: ProjectService,
              private dragScrollService: DragScrollService,
              private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      this.themeIcon = this.themeService.themeIcon;
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
      const validSlugs = ['resq-avalanche-transmitter', 'flying-shark', 'clock', 'lumen', 'tartáska', 'chess'];
      if (slug === 'archproject-shoe-insole-system') {
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

  anotherProject() {
    this.router.navigate(['/berzsak', this.projectService.randomProjectSlug()]);
  }
}
