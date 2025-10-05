import {Routes} from '@angular/router';
import {ProjectComponent} from './components/project/project.component';
import {ProjectPageComponent} from './components/project-page/project-page.component';

export const routes: Routes = [
  {path: '', redirectTo: '/berzsak', pathMatch: 'full'},
  {path: 'berzsak', component: ProjectComponent},
  {path: 'berzsak/:slug', component: ProjectPageComponent}
];
