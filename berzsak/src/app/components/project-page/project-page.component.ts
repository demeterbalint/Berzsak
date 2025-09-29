import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {ProjectDetails} from '../../models/project-details';
import {NgForOf, NgIf, SlicePipe} from '@angular/common';

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
  private hidden: boolean = false;
  private targetScrollTop = 0;
  private currentScrollTop = 0;
  private speed = 0.1;
  private animationFrameId: number | null = null;

  @ViewChild('seeMoreBtn') seeMoreButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLButtonElement>;

  constructor(private activatedRoute: ActivatedRoute,
              private projectService: ProjectService) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const slug = paramMap.get('slug');
      if (slug) {
        this.project = this.projectService.getProject(slug);
      }
      const button = document.querySelector('.see-more-btn') as HTMLElement;
        const validSlugs = ['resq-avalanche-transmitter', 'flying-shark', 'clock', 'lumen', 'tartáska'];
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

  ngAfterViewInit() {
    const container = this.containerRef.nativeElement;

    // Natív wheel esemény kezelő passzív false-szal, preventDefault engedélyezéssel
    container.addEventListener('wheel', (event: WheelEvent) => {
      if (!this.hidden && this.seeMoreButton) {
        this.seeMoreButton.nativeElement.style.transition = 'opacity 0.3s linear';
        this.seeMoreButton.nativeElement.style.opacity = '0';
        this.hidden = true;
      }

      event.preventDefault();

      this.targetScrollTop += event.deltaY;
      this.targetScrollTop = Math.max(0, Math.min(this.targetScrollTop, container.scrollHeight - container.clientHeight));
    }, { passive: false });

    this.animateScroll();
  }

  private animateScroll = () => {
    const container = this.containerRef.nativeElement;
    this.currentScrollTop += (this.targetScrollTop - this.currentScrollTop) * this.speed;
    container.scrollTop = this.currentScrollTop;

    this.animationFrameId = requestAnimationFrame(this.animateScroll);
  }

  protected readonly window = window;

  scrollDown() {
    const container = this.containerRef.nativeElement;
    this.targetScrollTop = window.innerWidth * 0.6666;

    this.targetScrollTop = Math.min(this.targetScrollTop, container.scrollHeight - container.clientHeight);

    if (!this.hidden && this.seeMoreButton) {
      this.seeMoreButton.nativeElement.style.transition = 'opacity 0.3s linear';
      this.seeMoreButton.nativeElement.style.opacity = '0';
      this.hidden = true;
    }
  }
}
