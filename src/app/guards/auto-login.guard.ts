import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@capacitor/storage';
import { AuthenticationServiceService } from '../api/authentication-service.service';
import { filter, take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor(private router: Router, 
    
      private authService: AuthenticationServiceService) {}

      canLoad(): Observable<boolean> {    
        return this.authService.isAuthenticated.pipe(
          filter(val => val !== null), // Filter out initial Behaviour subject value
          take(1), // Otherwise the Observable doesn't complete!
          map(isAuthenticated => {
            debugger;
            console.log('Found previous token, automatic login');
            if (isAuthenticated) {
              // Directly open inside area       
              this.router.navigateByUrl('/tabs', { replaceUrl: true });
            } else {          
              // Simply allow access to the login
              return true;
            }
          })
        );
      }
}
