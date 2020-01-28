import { Component, OnInit } from '@angular/core';
import { group, animate, query, transition, style, trigger, state } from '@angular/animations';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'dekline-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
  animations: [
    trigger('hideInstructions', [
      state('true, void', style({ height: '0px', opacity: 0, margin: 0 })),
      state('false', style({ height: '*', opacity: 1 })),
      transition('false <=> true', animate('200ms 0s ease-in-out'))
    ]),
  ]
})
export class InstructionsComponent implements OnInit {

  // a flag to hide the instructions
  hideInstructions = true;
  // a flag to override showing the instructions (this is used if the local storage value is trying to hide the instructions on page load)
  overrideShow = true;

  constructor(protected localStorage: LocalStorage) { }

  ngOnInit() {
    setTimeout(() => { this.hideInstructions = false; }, 1000);
    // check if there is a value in the local storage for hiding the instructions
    this.localStorage.getItem<Boolean>('hideSentenceInstructions').subscribe((_hideSentenceInstructions) => {
      this.overrideShow = _hideSentenceInstructions ? true : false;
    });
  }

  // when the "x" in the instructions is clicked
  onCloseLink() {
    // hide the instructions
    this.hideInstructions = true;
  }

  // when the "Don't show again" link for is clicked
  onDontShowAgain() {
    // hide the instructions
    this.hideInstructions = true;
    // add a value to the local storage to not show the instructions again
    this.localStorage.setItem('hideSentenceInstructions', true).subscribe(() => {});
  }

}
