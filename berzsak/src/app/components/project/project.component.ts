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
  moved = false;
  startX = 0;
  startY = 0;
  scrollLeft = 0;
  scrollTop = 0;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projects = this.projectService.getAllProjects();
  }

  flyToSidebar(event: MouseEvent, project: ProjectDetails) {

    if (!this.moved) {
      const img = event.currentTarget as HTMLElement;

      // 1️⃣ Hide the clicked image in the grid
      img.style.visibility = 'hidden';

      // 2️⃣ Temporarily set selectedProject so sidebar exists
      this.selectedProject = project;

      // 3️⃣ Wait for sidebar to render
      setTimeout(() => {
        const sidebarImg = document.querySelector('.sidebar img') as HTMLElement;
        if (!sidebarImg) return;

        // Hide the sidebar image initially
        sidebarImg.style.visibility = 'hidden';

        // 4️⃣ Get first position of the grid image
        const firstRect = img.getBoundingClientRect();

        // 5️⃣ Create a clone to animate
        const clone = img.cloneNode(true) as HTMLElement;
        clone.style.position = 'fixed';
        clone.style.top = firstRect.top + 'px';
        clone.style.left = firstRect.left + 'px';
        clone.style.width = firstRect.width + 'px';
        clone.style.height = firstRect.height + 'px';
        clone.style.transition = 'all 0.6s ease-in-out';
        clone.style.zIndex = '1000';
        clone.style.pointerEvents = 'none';
        clone.style.visibility = 'visible';
        document.body.appendChild(clone);

        // 6️⃣ Force reflow
        clone.getBoundingClientRect();

        // 7️⃣ Animate to sidebar position
        const lastRect = sidebarImg.getBoundingClientRect();
        clone.style.top = lastRect.top + 'px';
        clone.style.left = lastRect.left + 'px';
        clone.style.width = lastRect.width + 'px';
        clone.style.height = lastRect.height + 'px';

        // 8️⃣ After animation ends
        clone.addEventListener('transitionend', () => {
          document.body.removeChild(clone);
          // Show the image in the sidebar
          sidebarImg.style.visibility = 'visible';
        });
      }, 0);
    }
  }



  closeSidebar() {
    this.selectedProject = undefined;
  }

  get gridState() {
    return this.selectedProject ? 'open' : 'closed';
  }

  startDrag(event: MouseEvent) {
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
}
