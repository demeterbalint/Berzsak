import { Component, OnInit } from '@angular/core';
import { ProjectDetails } from '../../models/project-details';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate, state } from '@angular/animations';

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
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('1s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('1s ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ]),
    // Grid slide right when sidebar is open
    trigger('gridSlide', [
      state('open', style({ transform: 'translateX(300px)' })), // same width as sidebar
      state('closed', style({ transform: 'translateX(0)' })),
      transition('closed => open', [animate('1s ease-out')]),
      transition('open => closed', [animate('1s ease-in')])
    ])
  ]
})
export class ProjectComponent implements OnInit {
  projects: ProjectDetails[] = [];
  selectedProject?: ProjectDetails;
  dragging = false;
  startX = 0;
  startY = 0;
  scrollLeft = 0;
  scrollTop = 0;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projects = this.projectService.getAllProjects();

    window.addEventListener('mouseup', () => {
      this.dragging = false;
    });
  }

  viewProject(project: ProjectDetails) {
    this.selectedProject = project;
  }

  closeSidebar() {
    this.selectedProject = undefined;
  }

  get gridState() {
    return this.selectedProject ? 'open' : 'closed';
  }

  startDrag(event: MouseEvent) {
    this.dragging = true;
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

    el.scrollLeft = this.scrollLeft + walkX;
    el.scrollTop = this.scrollTop + walkY;
  }
}
