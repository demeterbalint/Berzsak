import { Injectable } from '@angular/core';
import {ProjectDetails} from '../models/project-details';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectList: ProjectDetails[] = [
    {
      name: 'BMW e46',
      description: 'This is bmw e46',
      mainImgUrl: '/bmw-e46/main.jfif',
      imageUrls: ['/bmw-e46/main.jfif', '/bmw-e46/download.jfif', '/bmw-e46/images.jfif']
    },
    {
      name: 'BMW i3',
      description: 'This is bmw i3',
      mainImgUrl: '/bmw-i3/main.jfif',
      imageUrls: ['/bmw-i3/main.jfif', '/bmw-i3/download (1).jfif', '/bmw-i3/download (2).jfif', '/bmw-i3/download (3).jfif']
    },
    {
      name: 'BMW i8',
      description: 'This is bmw i8',
      mainImgUrl: '/bmw-i8/main.jfif',
      imageUrls: ['/bmw-i8/main.jfif', '/bmw-i8/download (1).jfif', '/bmw-i8/download.jfif', '/bmw-i8/images.jfif']
    },
    {
      name: 'BMW m1 hommage',
      description: 'This is bmw m1 hommage',
      mainImgUrl: '/bmw-m1-hommage/main.jfif',
      imageUrls: ['/bmw-m1-hommage/main.jfif', '/bmw-m1-hommage/download (1).jfif', '/bmw-m1-hommage/download (2).jfif', '/bmw-m1-hommage/download.jfif']
    },
    {
      name: 'BMW m3',
      description: 'This is bmw m3',
      mainImgUrl: '/bmw-m3/main.jfif',
      imageUrls: ['/bmw-m3/main.jfif', '/bmw-m3/download (1).jfif', '/bmw-m3/download.jfif']
    },
    {
      name: 'BMW x5',
      description: 'This is bmw x5',
      mainImgUrl: '/bmw-x5/main.jfif',
      imageUrls: ['/bmw-x5/main.jfif', '/bmw-x5/download (1).jfif', '/bmw-x5/download.jfif']
    }

  ];

  getProject(name: string): ProjectDetails {
    return <ProjectDetails>this.projectList.find(p => p.name === name);
  }

  getAllProjects(): ProjectDetails[] {
    return this.projectList;
  }

  constructor() { }
}
