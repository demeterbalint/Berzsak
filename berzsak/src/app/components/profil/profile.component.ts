import { Component } from '@angular/core';
import {DragScrollService} from '../../services/drag-scroll.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private dragScrollService: DragScrollService, private router: Router) {}

  onBrandClick() {
    this.dragScrollService.fromView = '';
    this.router.navigate(['/berzsak']);
  }
}
