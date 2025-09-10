import {Routes} from '@angular/router';
import {ProjectComponent} from './components/project/project.component';

export const routes: Routes = [
  {path: '', redirectTo: '/main', pathMatch: 'full'},
  {path: 'main', component: ProjectComponent},
];
