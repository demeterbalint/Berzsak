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
  private speed = 0.1;

  @ViewChild('seeMoreBtn') seeMoreButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLButtonElement>;

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
    this.dragScrollService.projectPageScrollInit(container, this.seeMoreButton, this.speed);
  }


  protected readonly window = window;

  scrollDown() {
    const container = this.containerRef.nativeElement;
    this.dragScrollService.scrollDown(container, this.seeMoreButton);
  }
}
