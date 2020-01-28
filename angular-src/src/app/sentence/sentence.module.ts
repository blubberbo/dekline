import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentenceComponent } from './sentence.component';
import { SentenceService } from './sentence.service';
import { FormsModule } from '@angular/forms';
import { WordDefinitionsComponent } from './word-definitions/word-definitions.component';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  imports: [
    CommonModule, FormsModule, ClickOutsideModule
  ],
  declarations: [SentenceComponent, WordDefinitionsComponent],
  exports: [SentenceComponent],
  providers: [SentenceService],
})
export class SentenceModule { }
