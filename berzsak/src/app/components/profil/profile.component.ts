import {Component, OnInit} from '@angular/core';
import {DragScrollService} from '../../services/drag-scroll.service';
import {Router, RouterLink} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {ThemeService} from '../../services/theme.service';
import {ProjectDetails} from '../../models/project-details';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  isDarkMode: boolean = false;
  project!: ProjectDetails;
  imageWidths = [5846, 2400, 1800, 1200, 600, 300];

  constructor(private dragScrollService: DragScrollService,
              private router: Router,
              private projectService: ProjectService,
              private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    })
    this.project = this.projectService.getProject('profile');
  }

  onBrandClick() {
    this.dragScrollService.fromView = '';
    this.router.navigate(['/berzsak']);
  }

  openMail() {
    this.projectService.openMail();
  }

  protected aboutMe: string ='I’m <span class="bold">Bulcsú</span>, a 24-year-old industrial and product designer with a Master’s degree from <span class="bold">Moholy-Nagy University of Art and Design</span>. I’ve gained experience working with startups, architecture studios, and industrial design studios in Belgium and Hungary.\n' +
    '\n' +
    'My passion lies in creating <span class="bold">timeless, refined designs</span> — where <span class="bold">clarity, functionality, and manufacturability</span> come together seamlessly. I believe that <span class="bold">the soul of design lives in the details</span>, and that the ultimate goal is to create objects that bring quiet satisfaction and joy to their users.\n' +
    '\n' +
    'To discover something truly original, I like to <span class="bold">see the world from unexpected angles</span> — and sometimes <span class="bold">turn it upside down</span>.\n' +
    '\n' +
    'Beyond my professional work, I also create <span class="bold">limited-edition design objects</span> that reveal their stories through use and interaction. <span class="bold">Let’s collaborate</span> to bring something new to life.'

  getSrcset(imageArray: string[]): string {
    return imageArray
      .map((url, i) => `${url} ${this.imageWidths[i]}w`)
      .join(', ');
  }
}
