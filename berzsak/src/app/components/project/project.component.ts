import { Component } from '@angular/core';
import {ProjectDetails} from '../../models/project-details';

@Component({
  selector: 'app-project',
  imports: [],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {

    projectList: ProjectDetails[] = [];



}
