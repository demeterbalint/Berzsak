import {Routes} from '@angular/router';
import {ProjectComponent} from './components/project/project.component';
import {ProjectPageComponent} from './components/project-page/project-page.component';

export const routes: Routes = [
  {path: '', redirectTo: '/main', pathMatch: 'full'},
  {path: 'main', component: ProjectComponent},
  {path: 'main/:slug', component: ProjectPageComponent}
];
