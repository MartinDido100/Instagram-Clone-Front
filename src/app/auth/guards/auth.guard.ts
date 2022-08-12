import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router} from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private aS: AuthService,private router: Router){}

  canActivate(): Observable<boolean> | boolean {
    return this.aS.verify().pipe(
      tap(ok => {
        if(!ok){
          this.router.navigateByUrl('/login');
        }
      }),
    )
  }
  canLoad(): Observable<boolean> | boolean  {
    return this.aS.verify().pipe(
      tap(ok => {
        if(!ok){
          this.router.navigateByUrl('/login');
        }
      }),
    )
  }
}
