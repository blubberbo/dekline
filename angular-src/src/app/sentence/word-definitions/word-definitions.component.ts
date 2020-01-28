import { Component, OnInit, Input } from '@angular/core';
import { Definitions } from '../models/definitions.model';

@Component({
  selector: 'dekline-word-definitions',
  templateUrl: './word-definitions.component.html',
  styleUrls: ['./word-definitions.component.scss']
})
export class WordDefinitionsComponent implements OnInit {
  // the main definitions input
  @Input() definitions: Definitions = new Definitions();

  constructor() { }

  ngOnInit() {
    // console.log(this.definitions)
  }

  // a method to convert Russian case names (eg "ВИН") to English (eg "Accusative")
  russianCaseToEnglish(russianCase: string) {
    // based on the russianCase provided
    switch (russianCase.toLowerCase()) {
      case 'вин':
        // accusative
        return 'accusative';
      case 'дат':
        // dative
        return 'dative';
      case 'твор':
        // instrumental
        return 'instrumental';
      case 'род':
        // genitive
        return 'genitive';
      case 'пред':
        // prepositional
        return 'prepositional';
    }
  }
}
