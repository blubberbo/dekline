import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './shared/error/error.component';

const routes: Routes = [
{
   path: 'sentence',
   component: HomeComponent
 },
 {
  path: '',
  redirectTo: '/sentence',
  pathMatch: 'full'
 },
 { path: '**', component: ErrorComponent, data : { statusCode: 404} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
