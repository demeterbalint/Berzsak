import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {ProjectDetails} from '../../models/project-details';

@Component({
  selector: 'app-project-page',
  imports: [],
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {

  protected project!: ProjectDetails;

  constructor(private activatedRoute: ActivatedRoute,
              private projectService: ProjectService) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const slug = paramMap.get('slug');
      if (slug) {
        this.project = this.projectService.getProject(slug);
      }
    },
      error => {
        console.log(error);
      }
    )
  }

}
