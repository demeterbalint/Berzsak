import {Injectable} from '@angular/core';
import {ProjectDetails} from '../models/project-details';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectList: ProjectDetails[] = [
    {
      name: 'Gyógyteás készlet',
      description: 'Ép testben ép lélek',
      slug: 'gyogyteas-keszlet',
      mainImgUrl: ['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
      imageUrls: [['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
        ['/1-gyogytea/5846/1_qt_5846.webp', '/1-gyogytea/2400/1_qt_2400.webp', '/1-gyogytea/1800/1_qt_1800.webp', '/1-gyogytea/1200/1_qt_1200.webp', "/1-gyogytea/600/1_qt_600.webp", '/1-gyogytea/300/1_qt_300.webp'],
        ['/1-gyogytea/5846/2_qt_5846.webp', '/1-gyogytea/2400/2_qt_2400.webp', '/1-gyogytea/1800/2_qt_1800.webp', '/1-gyogytea/1200/2_qt_1200.webp', "/1-gyogytea/600/2_qt_600.webp", '/1-gyogytea/300/2_qt_300.webp'],
        ['/1-gyogytea/5846/3_qt_5846.webp', '/1-gyogytea/2400/3_qt_2400.webp', '/1-gyogytea/1800/3_qt_1800.webp', '/1-gyogytea/1200/3_qt_1200.webp', "/1-gyogytea/600/3_qt_600.webp", '/1-gyogytea/300/3_qt_300.webp'],
        ['/1-gyogytea/5846/4_qt_5846.webp', '/1-gyogytea/2400/4_qt_2400.webp', '/1-gyogytea/1800/4_qt_1800.webp', '/1-gyogytea/1200/4_qt_1200.webp', "/1-gyogytea/600/4_qt_600.webp", '/1-gyogytea/300/4_qt_300.webp'],
        ['/1-gyogytea/5846/5_qt_5846.webp', '/1-gyogytea/2400/5_qt_2400.webp', '/1-gyogytea/1800/5_qt_1800.webp', '/1-gyogytea/1200/5_qt_1200.webp', "/1-gyogytea/600/5_qt_600.webp", '/1-gyogytea/300/5_qt_300.webp']]
    },
    {
      name: 'Gyógyteás készlet 2',
      description: 'Ép testben ép lélek',
      slug: 'gyogyteas-keszlet-2',
      mainImgUrl: ['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
      imageUrls: [['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
        ['/1-gyogytea/5846/1_qt_5846.webp', '/1-gyogytea/2400/1_qt_2400.webp', '/1-gyogytea/1800/1_qt_1800.webp', '/1-gyogytea/1200/1_qt_1200.webp', "/1-gyogytea/600/1_qt_600.webp", '/1-gyogytea/300/1_qt_300.webp'],
        ['/1-gyogytea/5846/2_qt_5846.webp', '/1-gyogytea/2400/2_qt_2400.webp', '/1-gyogytea/1800/2_qt_1800.webp', '/1-gyogytea/1200/2_qt_1200.webp', "/1-gyogytea/600/2_qt_600.webp", '/1-gyogytea/300/2_qt_300.webp'],
        ['/1-gyogytea/5846/3_qt_5846.webp', '/1-gyogytea/2400/3_qt_2400.webp', '/1-gyogytea/1800/3_qt_1800.webp', '/1-gyogytea/1200/3_qt_1200.webp', "/1-gyogytea/600/3_qt_600.webp", '/1-gyogytea/300/3_qt_300.webp'],
        ['/1-gyogytea/5846/4_qt_5846.webp', '/1-gyogytea/2400/4_qt_2400.webp', '/1-gyogytea/1800/4_qt_1800.webp', '/1-gyogytea/1200/4_qt_1200.webp', "/1-gyogytea/600/4_qt_600.webp", '/1-gyogytea/300/4_qt_300.webp']]
    },
    {
      name: 'Gyógyteás készlet 3',
      description: 'Ép testben ép lélek',
      slug: 'gyogyteas-keszlet-3',
      mainImgUrl: ['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
      imageUrls: [['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
        ['/1-gyogytea/5846/1_qt_5846.webp', '/1-gyogytea/2400/1_qt_2400.webp', '/1-gyogytea/1800/1_qt_1800.webp', '/1-gyogytea/1200/1_qt_1200.webp', "/1-gyogytea/600/1_qt_600.webp", '/1-gyogytea/300/1_qt_300.webp'],
        ['/1-gyogytea/5846/2_qt_5846.webp', '/1-gyogytea/2400/2_qt_2400.webp', '/1-gyogytea/1800/2_qt_1800.webp', '/1-gyogytea/1200/2_qt_1200.webp', "/1-gyogytea/600/2_qt_600.webp", '/1-gyogytea/300/2_qt_300.webp'],
        ['/1-gyogytea/5846/3_qt_5846.webp', '/1-gyogytea/2400/3_qt_2400.webp', '/1-gyogytea/1800/3_qt_1800.webp', '/1-gyogytea/1200/3_qt_1200.webp', "/1-gyogytea/600/3_qt_600.webp", '/1-gyogytea/300/3_qt_300.webp']]
    },
    {
      name: 'Gyógyteás készlet 4',
      description: 'Ép testben ép lélek',
      slug: 'gyogyteas-keszlet-4',
      mainImgUrl: ['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
      imageUrls: [['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
        ['/1-gyogytea/5846/1_qt_5846.webp', '/1-gyogytea/2400/1_qt_2400.webp', '/1-gyogytea/1800/1_qt_1800.webp', '/1-gyogytea/1200/1_qt_1200.webp', "/1-gyogytea/600/1_qt_600.webp", '/1-gyogytea/300/1_qt_300.webp'],
        ['/1-gyogytea/5846/2_qt_5846.webp', '/1-gyogytea/2400/2_qt_2400.webp', '/1-gyogytea/1800/2_qt_1800.webp', '/1-gyogytea/1200/2_qt_1200.webp', "/1-gyogytea/600/2_qt_600.webp", '/1-gyogytea/300/2_qt_300.webp']]
    },
    {
      name: 'Gyógyteás készlet 5',
      description: 'Ép testben ép lélek',
      slug: 'gyogyteas-keszlet-5',
      mainImgUrl: ['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
      imageUrls: [['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
        ['/1-gyogytea/5846/1_qt_5846.webp', '/1-gyogytea/2400/1_qt_2400.webp', '/1-gyogytea/1800/1_qt_1800.webp', '/1-gyogytea/1200/1_qt_1200.webp', "/1-gyogytea/600/1_qt_600.webp", '/1-gyogytea/300/1_qt_300.webp'],
        ['/1-gyogytea/5846/2_qt_5846.webp', '/1-gyogytea/2400/2_qt_2400.webp', '/1-gyogytea/1800/2_qt_1800.webp', '/1-gyogytea/1200/2_qt_1200.webp', "/1-gyogytea/600/2_qt_600.webp", '/1-gyogytea/300/2_qt_300.webp'],
        ['/1-gyogytea/5846/3_qt_5846.webp', '/1-gyogytea/2400/3_qt_2400.webp', '/1-gyogytea/1800/3_qt_1800.webp', '/1-gyogytea/1200/3_qt_1200.webp', "/1-gyogytea/600/3_qt_600.webp", '/1-gyogytea/300/3_qt_300.webp'],
        ['/1-gyogytea/5846/4_qt_5846.webp', '/1-gyogytea/2400/4_qt_2400.webp', '/1-gyogytea/1800/4_qt_1800.webp', '/1-gyogytea/1200/4_qt_1200.webp', "/1-gyogytea/600/4_qt_600.webp", '/1-gyogytea/300/4_qt_300.webp'],
        ['/1-gyogytea/5846/5_qt_5846.webp', '/1-gyogytea/2400/5_qt_2400.webp', '/1-gyogytea/1800/5_qt_1800.webp', '/1-gyogytea/1200/5_qt_1200.webp', "/1-gyogytea/600/5_qt_600.webp", '/1-gyogytea/300/5_qt_300.webp']]
    },
    {
      name: 'Gyógyteás készlet 6',
      description: 'Ép testben ép lélek',
      slug: 'gyogyteas-keszlet-6',
      mainImgUrl: ['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
      imageUrls: [['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
        ['/1-gyogytea/5846/1_qt_5846.webp', '/1-gyogytea/2400/1_qt_2400.webp', '/1-gyogytea/1800/1_qt_1800.webp', '/1-gyogytea/1200/1_qt_1200.webp', "/1-gyogytea/600/1_qt_600.webp", '/1-gyogytea/300/1_qt_300.webp'],
        ['/1-gyogytea/5846/2_qt_5846.webp', '/1-gyogytea/2400/2_qt_2400.webp', '/1-gyogytea/1800/2_qt_1800.webp', '/1-gyogytea/1200/2_qt_1200.webp', "/1-gyogytea/600/2_qt_600.webp", '/1-gyogytea/300/2_qt_300.webp'],
        ['/1-gyogytea/5846/3_qt_5846.webp', '/1-gyogytea/2400/3_qt_2400.webp', '/1-gyogytea/1800/3_qt_1800.webp', '/1-gyogytea/1200/3_qt_1200.webp', "/1-gyogytea/600/3_qt_600.webp", '/1-gyogytea/300/3_qt_300.webp'],
        ['/1-gyogytea/5846/4_qt_5846.webp', '/1-gyogytea/2400/4_qt_2400.webp', '/1-gyogytea/1800/4_qt_1800.webp', '/1-gyogytea/1200/4_qt_1200.webp', "/1-gyogytea/600/4_qt_600.webp", '/1-gyogytea/300/4_qt_300.webp'],
        ['/1-gyogytea/5846/5_qt_5846.webp', '/1-gyogytea/2400/5_qt_2400.webp', '/1-gyogytea/1800/5_qt_1800.webp', '/1-gyogytea/1200/5_qt_1200.webp', "/1-gyogytea/600/5_qt_600.webp", '/1-gyogytea/300/5_qt_300.webp']]
    }
  ];

  getAllProjects(): ProjectDetails[] {
    return this.projectList;
  }

  getProject(slug: string): ProjectDetails {
    return <ProjectDetails>this.projectList.find((p) => p.slug === slug);
  }

  constructor() {
  }
}
