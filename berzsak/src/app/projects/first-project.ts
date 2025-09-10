import {ProjectDetails} from '../models/project-details';

export class FirstProject implements ProjectDetails {

  constructor(private name: string, private description: string, private mainImgUrl: string, private imageUrls: string[]) {
    this.name = name;
    this.description = description;
    this.mainImgUrl = this.mainImgUrl;
    this.imageUrls = this.imageUrls;
  }

}
