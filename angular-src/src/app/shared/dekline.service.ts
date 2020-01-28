import { Injectable } from '@angular/core';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class DeklineService {

  constructor(private cookieService: CookieService) { }

    // Get the deklineUserID from the cookie for the current user. If none exists, create one
    getDeklineUserID() {
        // attempt to get an existing cookie
        const cookieExists: boolean = this.cookieService.check('deklineUserID');
        // there is no cookie
        if (!cookieExists) {
            // create a UUID v4
            const UUID = this.createUUID();
            // create the cookie, using the newly created UUID
            this.cookieService.set('deklineUserID', UUID);
        }
        // whether it already existed or we created one, return the current cookie
        return this.cookieService.get('deklineUserID');
    }

    // Returns a UUID v4 based on (https://gist.github.com/LeverOne/1308368)
    createUUID(a?, b?) {
        // tslint:disable-next-line
        for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b
    }
}
