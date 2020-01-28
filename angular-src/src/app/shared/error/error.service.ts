import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ErrorService {
  // a locla variable to hold the status - to be used on the error page
  public status = 500;
  // a local variable to hold the error message - to be used on the error page
  public errorMessage = 'An error has occurred';

  constructor(private router: Router) { }

  // a local method to store an error message in the service - eg. used to pass an error message from a component
  public redirectToErrorPage(status: number, msg: string) {
    // pass the status parameter to the service
    this.errorMessage = msg ? msg : 'An error has occurred';
    // pass the msg parameter to the service
    this.status = status ? status : 500;
    // actually route to the error page
    this.router.navigate(['/error']);
  }
}
