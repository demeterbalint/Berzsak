import { Component } from '@angular/core';
import {DragScrollService} from '../../services/drag-scroll.service';
import {Router, RouterLink} from '@angular/router';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private dragScrollService: DragScrollService, private router: Router, private projectService: ProjectService) {}

  onBrandClick() {
    this.dragScrollService.fromView = '';
    this.router.navigate(['/berzsak']);
  }

  openMail() {
    this.projectService.openMail();
  }

  protected aboutMe: string ='I’m Bulcsú, a 24-year-old industrial and product designer with a Master’s degree from Moholy-Nagy University of Art and Design. I’ve gained experience working with startups, architecture studios, and industrial design studios in Belgium and Hungary.\n' +
    '\n' +
    'My passion lies in creating timeless, refined designs — where clarity, functionality, and manufacturability come together seamlessly. I believe that the soul of design lives in the details, and that the ultimate goal is to create objects that bring quiet satisfaction and joy to their users.\n' +
    '\n' +
    'To discover something truly original, I like to see the world from unexpected angles — and sometimes turn it upside down.\n' +
    '\n' +
    'Beyond my professional work, I also create limited-edition design objects that reveal their stories through use and interaction.\n' +
    'If you’d like to explore these, feel free to visit my shop — or let’s collaborate to bring something new to life.'
}
