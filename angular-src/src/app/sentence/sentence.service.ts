import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { retryWhen } from 'rxjs/operators';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { DeklineService } from '../shared/dekline.service';

@Injectable()
export class SentenceService {

  constructor(private http: HttpClient, private deklineService: DeklineService) { }

  // get a sentence from the local api
  getSentence(sentenceType: number): Observable<any> {
    // create the params
    let params = new HttpParams();
    params = params.append('sentenceType', sentenceType.toString());

    // call the get method, passing in the params
    return this.http.get('/api/scrape/litmir', {params: params}).pipe(
      // use the retryWhen operator to retry when a 404 is returned
      retryWhen(attempts => {
        // create a count object to keep track of how many retries we have done
        let count = 0;
        // margeMap the attemps object to find the status
        return attempts.mergeMap(error => {
          // if the status was a 404 and there have been less than 5 attempts so far
          if (error.status === 404 && ++count <= 5) {
              // return the 404 error and retry
              return Observable.of(error);
          } else {
              // else, it either wasn't a 404 or there have been more than 5 attemps, so throw an error and stop retrying
              return Observable.throw(error);
          }
      });
      })
    );
  }

  // get the definitions for a word
  getDefinitions(word: string): Observable<any> {
    return this.http.get(`/api/dictionary/lookup?word=${word}`);
  }

  // log a submission of a sentence
  // Note: the logging is async, so the application will continue running after initiating this call (and won't stop on error)
  logSubmission(sentence: string) {
    // post the submission to log it the db, passing in the sentence and the deklineUserID from the cookie
    // create the http headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    // get the deklineUserID from the cookies
    const deklineUserID = this.deklineService.getDeklineUserID();
    // make the post call to the api endpoint
    this.http.post('/api/submission/', JSON.stringify({ deklineUserID: deklineUserID, sentence: sentence}), httpOptions).subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      data => {
        console.log(data);
      },
      error => {
        console.error('An error occurred while logging the submission!');
        throw error;
      }
    );
  }
}
