
import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  constructor(private http: HttpClient) { }

  handleError(error) {
     // log the error using the api endpoint
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    const body = JSON.stringify({message: error.message, stack: error.stack });
    this.http.post('/api/error/', body, httpOptions).subscribe(
      data => {
        console.log('The error was logged to the database');
      },
      // tslint:disable-next-line: no-shadowed-variable
      error => {
        console.error('An error occurred while logging the error!');
      }
      );

     // IMPORTANT: Rethrow the error otherwise it gets swallowed
     throw error;
  }
}
