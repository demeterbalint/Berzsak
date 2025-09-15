import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ProjectDetails} from '../../models/project-details';
import {ProjectService} from '../../services/project.service';
import {CommonModule} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ViewStatus} from '../../enum/view-status';
import {DragScrollService} from '../../services/drag-scroll.service';
import {SidebarAnimationService} from '../../services/sidebar-animation.service';

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
      state('open', style({transform: 'translateX(40%)'})), // same width as sidebar
      state('closed', style({transform: 'translateX(0)'})),
      transition('closed => open', [animate('1s ease-out')]),
      transition('open => closed', [animate('1s ease-in')])
    ])
  ]
})
export class ProjectComponent implements OnInit, AfterViewInit {
  @ViewChild('gridExp') gridExpRef!: ElementRef<HTMLDivElement>;
  @ViewChild('gridCol3') gridCol3Ref!: ElementRef<HTMLDivElement>;

  protected projects: ProjectDetails[] = [];
  protected selectedProject?: ProjectDetails;

  protected view = {
    status: ViewStatus.EXPERIENCE,
    value: 'Experience view'
  };

  private sidebarBusy = false;
  private pendingSidebarAnimRes?: () => void;
  private pendingGridAnimRes?: () => void;

  constructor(private projectService: ProjectService, private dragScrollService: DragScrollService, private sidebarAnimation: SidebarAnimationService) {
  }

  ngOnInit(): void {
    this.projects = this.projectService.getAllProjects();
  }

  ngAfterViewInit() {
    const gridEl = this.gridExpRef?.nativeElement;
    const gridCol3 = this.gridCol3Ref?.nativeElement;

    // Register both scrollables so animateScrollable can find them
    if (gridEl) this.dragScrollService.registerScrollable(gridEl);
    if (gridCol3) this.dragScrollService.registerScrollable(gridCol3);

    console.log(gridEl);

    // center experience grid
    if (gridEl) {
      console.log('Scroll width: ', gridEl.scrollWidth,'client width: ' , gridEl.clientWidth);
      console.log('Scroll height: ', gridEl.scrollHeight,'client height: ' , gridEl.clientHeight);
      gridEl.scrollLeft = (gridEl.scrollWidth - gridEl.clientWidth) / 2;
      gridEl.scrollTop = (gridEl.scrollHeight - gridEl.clientHeight) / 2;
    } else {
      console.log('hello')
    }
  }

  viewChange() {
    if (this.view.status === ViewStatus.EXPERIENCE) {
      this.view.status = ViewStatus.GRID;
      this.view.value = 'Grid view';
    } else {
      this.view.status = ViewStatus.EXPERIENCE;
      this.view.value = 'Experience view';
    }
    // After view toggles, the other grid is created by *ngIf on next tick
    setTimeout(() => {
      const gridEl = this.gridExpRef?.nativeElement;
      const gridCol3 = this.gridCol3Ref?.nativeElement;
      if (gridEl) {
        this.dragScrollService.registerScrollable(gridEl);
        gridEl.scrollLeft = (gridEl.scrollWidth - gridEl.clientWidth) / 2;
        gridEl.scrollTop = (gridEl.scrollHeight - gridEl.clientHeight) / 2;
      }
      if (gridCol3) this.dragScrollService.registerScrollable(gridCol3);
    }, 0);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    const gridEl = this.gridExpRef?.nativeElement;
    if (gridEl) this.dragScrollService.endDrag(event, gridEl);
  }

  @HostListener('window:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    const gridEl = this.gridExpRef?.nativeElement;
    if (gridEl) this.dragScrollService.endDrag(event, gridEl);
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    // find registered scrollables
    const expScrollable = this.dragScrollService.scrollables.find(s => s.el === this.gridExpRef?.nativeElement);
    const sidebarScrollable = this.dragScrollService.scrollables.find(s => s.el.classList && s.el.classList.contains('sidebar'));

    // Sidebar scroll (when open)
    if (this.selectedProject && sidebarScrollable) {
      event.preventDefault();
      sidebarScrollable.targetScrollTop = Math.max(0, Math.min(sidebarScrollable.el.scrollTop + event.deltaY, sidebarScrollable.el.scrollHeight - sidebarScrollable.el.clientHeight));
      this.dragScrollService.animateScrollable(sidebarScrollable);
      return;
    }

    // Experience view: intercept and animate scrolling
    if (!this.selectedProject && this.view.status === ViewStatus.EXPERIENCE && expScrollable) {
      event.preventDefault();
      expScrollable.targetScrollTop = expScrollable.el.scrollTop + event.deltaY;
      expScrollable.targetScrollLeft = expScrollable.el.scrollLeft + event.deltaX;
      this.dragScrollService.animateScrollable(expScrollable);
      return;
    }
  }

  get gridState() {
    return this.selectedProject ? 'open' : 'closed';
  }

  handleExperienceInteraction(event: MouseEvent) {
    if (!this.sidebarBusy && this.selectedProject) {
      this.closeSidebar();
    }
    const gridEl = this.gridExpRef?.nativeElement;
    if (gridEl) this.dragScrollService.startDrag(event, gridEl, this.selectedProject);
  }

  onExperienceDrag(event: MouseEvent) {
    const gridEl = this.gridExpRef?.nativeElement;
    if (gridEl) this.dragScrollService.onDrag(event, gridEl);
  }

  async onImageClick(event: MouseEvent, project: ProjectDetails) {
    if (this.sidebarBusy || this.dragScrollService.moved || this.selectedProject) return;

    this.sidebarBusy = true;

    // set selected project so the sidebar renders, then run the animation
    this.selectedProject = project;
    await this.sidebarAnimation.flyToSidebar(event.currentTarget as HTMLElement, project);

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

  handleCol3Interaction(event: MouseEvent) {
    const gridCol3 = event.currentTarget as HTMLElement;
    this.dragScrollService.startDragOnCol3(event, gridCol3, this.selectedProject);
  }

  onCol3Drag(event: MouseEvent) {
    const gridCol3 = event.currentTarget as HTMLElement;
    this.dragScrollService.onDragCol3(event, gridCol3);
  }

  showContact() {
    return;
  }

  protected readonly ViewStatus = ViewStatus;
}
