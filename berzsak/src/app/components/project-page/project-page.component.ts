import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {ProjectDetails} from '../../models/project-details';
import {NgForOf, NgIf, SlicePipe} from '@angular/common';
import {DragScrollService} from '../../services/drag-scroll.service';

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

  @ViewChild('seeMoreBtn') seeMoreButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;

  constructor(private activatedRoute: ActivatedRoute,
              private projectService: ProjectService,
              private dragScrollService: DragScrollService,) {}

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

  ngAfterViewInit() {
    const projectPageWrapper = this.wrapperRef.nativeElement;
    this.dragScrollService.register(projectPageWrapper);

    projectPageWrapper.addEventListener('scroll', () => {
      this.seeMoreButton.nativeElement.style.transition = 'opacity 0.3s linear';
      this.seeMoreButton.nativeElement.style.opacity = '0';

      const scrollable = this.dragScrollService.getScrollable(projectPageWrapper);
      if (!scrollable) return;

      if (!scrollable.isAnimating) {
        scrollable.current = projectPageWrapper.scrollTop;
        scrollable.target = projectPageWrapper.scrollTop;
      }
    });
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
    const wrapper = this.wrapperRef.nativeElement;
    this.dragScrollService.scrollDown(wrapper, window.innerWidth * 0.6666);
    this.seeMoreButton.nativeElement.style.transition = 'opacity 0.3s linear';
    this.seeMoreButton.nativeElement.style.opacity = '0';
  }
}
