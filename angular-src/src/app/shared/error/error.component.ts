import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ErrorService } from './error.service';

@Component({
  selector: 'dekline-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {
  // a variable for the subscription to the page data
  protected pageDataSub: any;
  // a local variable for the status code
  public statusCode: number;
  // a local variable for the error message
  public errorMsg: string;

  constructor(private route: ActivatedRoute, private _errorService: ErrorService) { }

  ngOnInit() {
    this.errorMsg = this._errorService.errorMessage;
    // this.pageDataSub = this.route
    //   .data
    //   .subscribe(x => {
    //     if (x.statusCode) {
    //       this.statusCode = x.statusCode;
    //     }
    //     if (x.msg) {
    //       // this.errorMsg = x.msg;
    //     }
    //   });
    this.pageDataSub = this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('statusCode')) {
        this.statusCode = parseInt(params.get('statusCode'), 10);
      }
      if (params.get('msg')) {
        // this.errorMsg = params.get('msg');
      }
    });
  }

  ngOnDestroy() {
    this.pageDataSub.unsubscribe();
  }

}
