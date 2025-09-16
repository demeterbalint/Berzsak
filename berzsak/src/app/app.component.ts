import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgForOf} from '@angular/common';
import {ProjectComponent} from './components/project/project.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'berzsak';
}
