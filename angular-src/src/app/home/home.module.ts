import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SentenceModule } from '../sentence/sentence.module';
import { InstructionsComponent } from '../instructions/instructions.component';



@NgModule({
  imports: [
    SharedModule,
    SentenceModule
  ],
  declarations: [HomeComponent, InstructionsComponent]
})
export class HomeModule { }
