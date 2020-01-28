import { Component, OnInit } from '@angular/core';
import { SentenceType } from '../shared/models/enums/sentence-type.enum';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dekline-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // an instance of the SentenceType enum to use in the html template
  _SentenceType = SentenceType;
  // a poperty to change SentenceType is passed into the sentence component in the html template
  sentenceType: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // capture the query parameters from the current route to find the sentenceType
    this.route.queryParamMap.subscribe(params => {
        // extract the sentenceType parameter from the route
        const sentenceType_param = params['params']['sentenceType'] ? parseInt(params['params']['sentenceType'], 10) : null;
        // get the sentenceType param from the query string and ensure it matches a value in the enum
        if (Object.values(SentenceType).includes(sentenceType_param)) {
          // if the value is legitimate, pass it to the local value
          this.sentenceType = sentenceType_param;
        } else {
          // else, pass the default value
          this.sentenceType = SentenceType.VerbsOfMotion;
        }
      });
  }
}
