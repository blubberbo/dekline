import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { ErrorService } from './error/error.service';
import { DeklineService } from './dekline.service';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
  ],
  declarations: [ErrorComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
  ],
  providers: [ErrorService, DeklineService, CookieService]
})
export class SharedModule { }
