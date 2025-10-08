import {RouterModule, Routes} from '@angular/router';
import {ProjectComponent} from './components/project/project.component';
import {ProjectPageComponent} from './components/project-page/project-page.component';
import {NgModule} from '@angular/core';

export const routes: Routes = [
  {path: '', redirectTo: '/berzsak', pathMatch: 'full'},
  {path: 'berzsak', component: ProjectComponent},
  {path: 'berzsak/:slug', component: ProjectPageComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
