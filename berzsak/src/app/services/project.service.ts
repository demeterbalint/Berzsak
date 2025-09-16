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
      mainImgUrl: ['/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
      imageUrls: [['/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
        ['/1-gyogytea/2400/1_qt_2400.webp', '/1-gyogytea/1800/1_qt_1800.webp', '/1-gyogytea/1200/1_qt_1200.webp', "/1-gyogytea/600/1_qt_600.webp", '/1-gyogytea/300/1_qt_300.webp'],
        ['/1-gyogytea/2400/2_qt_2400.webp', '/1-gyogytea/1800/2_qt_1800.webp', '/1-gyogytea/1200/2_qt_1200.webp', "/1-gyogytea/600/2_qt_600.webp", '/1-gyogytea/300/2_qt_300.webp'],
        ['/1-gyogytea/2400/3_qt_2400.webp', '/1-gyogytea/1800/3_qt_1800.webp', '/1-gyogytea/1200/3_qt_1200.webp', "/1-gyogytea/600/3_qt_600.webp", '/1-gyogytea/300/3_qt_300.webp'],
        ['/1-gyogytea/2400/4_qt_2400.webp', '/1-gyogytea/1800/4_qt_1800.webp', '/1-gyogytea/1200/4_qt_1200.webp', "/1-gyogytea/600/4_qt_600.webp", '/1-gyogytea/300/4_qt_300.webp'],
        ['/1-gyogytea/2400/5_qt_2400.webp', '/1-gyogytea/1800/5_qt_1800.webp', '/1-gyogytea/1200/5_qt_1200.webp', "/1-gyogytea/600/5_qt_600.webp", '/1-gyogytea/300/5_qt_300.webp']]
    },
    {
      name: 'BMW e46',
      description: 'This is bmw e46',
      mainImgUrl: ['/bmw-e46/main.jfif'],
      imageUrls: [['/bmw-e46/main.jfif'], ['/bmw-e46/download.jfif'], ['/bmw-e46/images.jfif']]
    },
    {
      name: 'BMW i3',
      description: 'This is bmw i3',
      mainImgUrl: ['/bmw-i3/main.jfif'],
      imageUrls: [['/bmw-i3/main.jfif', '/bmw-i3/download (1).jfif', '/bmw-i3/download (2).jfif', '/bmw-i3/download (3).jfif']]
    },
    {
      name: 'BMW i8',
      description: 'This is bmw i8',
      mainImgUrl: ['/bmw-i8/main.jfif'],
      imageUrls: [['/bmw-i8/main.jfif', '/bmw-i8/download (1).jfif', '/bmw-i8/download.jfif', '/bmw-i8/images.jfif']]
    },
    {
      name: 'BMW m1 hommage',
      description: 'This is bmw m1 hommage',
      mainImgUrl: ['/bmw-m1-hommage/main.jfif'],
      imageUrls: [['/bmw-m1-hommage/main.jfif', '/bmw-m1-hommage/download (1).jfif', '/bmw-m1-hommage/download (2).jfif', '/bmw-m1-hommage/download.jfif']]
    },
    {
      name: 'BMW m3',
      description: 'This is bmw m3',
      mainImgUrl: ['/bmw-m3/main.jfif'],
      imageUrls: [['/bmw-m3/main.jfif', '/bmw-m3/download (1).jfif', '/bmw-m3/download.jfif']]
    },
    {
      name: 'BMW x5',
      description: 'This is bmw x5',
      mainImgUrl: ['/bmw-x5/main.jfif'],
      imageUrls: [['/bmw-x5/main.jfif', '/bmw-x5/download (1).jfif', '/bmw-x5/download.jfif']]
    },
    {
      name: 'BMW ix6',
      description: 'This is bmw ix6',
      mainImgUrl: ['/bmw-ix6/main.jfif'],
      imageUrls: [['/bmw-ix6/main.jfif', '/bmw-ix6/download.jfif', '/bmw-ix6/download (1).jfif']]
    },
    {
      name: 'BMW s1000 rr',
      description: 'This is bmw s1000 rr',
      mainImgUrl: ['/bmw-s1000-rr/main.jfif'],
      imageUrls: [['/bmw-s1000-rr/main.jfif', '/bmw-s1000-rr/download.jfif', '/bmw-s1000-rr/download (1).jfif']]
    },
    {
      name: 'BMW old m5',
      description: 'This is bmw old m5',
      mainImgUrl: ['/bmw-old-m5/main.jfif'],
      imageUrls: [['/bmw-old-m5/main.jfif', '/bmw-old-m5/download.jfif', '/bmw-old-m5/download (1).jfif']]
    },
    {
      name: 'Lada',
      description: 'This is lada',
      mainImgUrl: ['/lada/main.jfif'],
      imageUrls: [['/lada/main.jfif', 'lada/download.jfif']]
    },
    {
      name: 'BMW m8',
      description: 'This is bmw m8',
      mainImgUrl: ['/bmw-m8/main.jfif'],
      imageUrls: [['/bmw-m8/main.jfif', '/bmw-m8/download.jfif', '/bmw-m8/download (1).jfif']]
    },
    {
      name: 'BMW x6',
      description: 'This is bmw x6',
      mainImgUrl: ['/bmw-x6/main.jfif'],
      imageUrls: [['/bmw-x6/main.jfif', '/bmw-x6/download.jfif', '/bmw-x6/download (1).jfif', '/bmw-x6/download (2).jfif']]
    },
    {
      name: 'BMW x1',
      description: 'This is bmw x1',
      mainImgUrl: ['/bmw-x1/main.jfif'],
      imageUrls: [['/bmw-x1/main.jfif', '/bmw-x1/download.jfif']]
    },
    {
      name: 'BMW vision m next',
      description: 'This is bmw vision m next',
      mainImgUrl: ['/bmw-vision-m-next/main.jfif'],
      imageUrls: [['/bmw-vision-m-next/main.jfif', '/bmw-vision-m-next/download.jfif', '/bmw-vision-m-next/download (1).jfif']]
    },
    {
      name: 'BMW skytop',
      description: 'This is bmw skytop',
      mainImgUrl: ['/bmw-skytop/main.jfif'],
      imageUrls: [['/bmw-skytop/main.jfif', '/bmw-skytop/download.jfif', '/bmw-skytop/download (1).jfif', '/bmw-skytop/download (2).jfif']]
    }

  ];

  getAllProjects(): ProjectDetails[] {
    return this.projectList;
  }

  constructor() {
  }
}
