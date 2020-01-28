import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { ClickOutsideModule } from 'ng-click-outside';

import { AppRoutingModule } from './app-routing.module';

import { HomeModule } from './home/home.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent, FooterComponent, SharedModule } from './shared';
import { SentenceModule } from './sentence/sentence.module';
import { FormsModule } from '@angular/forms';
import { CustomErrorHandler } from './custom-error.handler';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HomeModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    SentenceModule,
    ClickOutsideModule
  ],
  exports: [
    SharedModule,
    SentenceModule
  ],
  providers: [{ provide: ErrorHandler, useClass: CustomErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule { }
