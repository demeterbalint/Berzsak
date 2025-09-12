import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
      state('open', style({transform: 'translateX(500px)'})), // same width as sidebar
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

  dragging = false;
  moved = false;
  startX = 0;
  startY = 0;
  scrollLeft = 0;
  scrollTop = 0;

  view = {
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

    // Scroll to the center
    gridEl.scrollLeft = (gridEl.scrollWidth - gridEl.clientWidth) / 2;
    gridEl.scrollTop = (gridEl.scrollHeight - gridEl.clientHeight) / 2;
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

  get gridState() {
    return this.selectedProject ? 'open' : 'closed';
  }

  handleGridInteraction(event: MouseEvent) {
    // If sidebar is open, close it immediately
    if (this.selectedProject) {
      this.closeSidebar();
    }

    // Start drag as usual
    this.startDrag(event);
  }

  startDrag(event: MouseEvent) {
    if (!this.canDrag) return;
    this.dragging = true;
    this.moved = false;
    const el = event.currentTarget as HTMLElement;

    // Save both X and Y starting points
    this.startX = event.pageX - el.offsetLeft;
    this.startY = event.pageY - el.offsetTop;

    this.scrollLeft = el.scrollLeft;
    this.scrollTop = el.scrollTop;

    el.style.cursor = 'grabbing';
  }

  endDrag(event: MouseEvent) {
    this.dragging = false;
    (event.currentTarget as HTMLElement).style.cursor = 'grab';
  }

  onDrag(event: MouseEvent) {
    if (!this.dragging) return;

    event.preventDefault(); // prevent text/image selection

    const el = event.currentTarget as HTMLElement;
    const x = event.pageX - el.offsetLeft;
    const y = event.pageY - el.offsetTop;

    const walkX = this.startX - x; // horizontal distance moved
    const walkY = this.startY - y; // vertical distance moved

    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
      this.moved = true; // mark as actual drag
    }

    el.scrollLeft = this.scrollLeft + walkX;
    el.scrollTop = this.scrollTop + walkY;
  }

  get canDrag(): boolean {
    return !this.selectedProject; // draggable only when sidebar is closed
  }

  showContact() {
    return;
  }
}
