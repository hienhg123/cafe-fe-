import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { GlobalConstatns } from '../shared/global-constants';
import * as jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(public auth: AuthService,
    public router: Router,
    private snackBarService: SnackbarService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray['expectedRole']
    const token: any = localStorage.getItem('token')
    var tokenPayload: any
    try {
      tokenPayload = jwt_decode.jwtDecode(token);
      console.log(tokenPayload)
    } catch (err) {
      console.log(err)
      localStorage.clear();
      this.router.navigate(['/']);
    }

    let expectedRole = '';

    for(let i = 0;i<expectedRoleArray['length'];i++){
      if(expectedRoleArray[i]===tokenPayload.role){
        expectedRole = tokenPayload.role
      }
    }


    //check xem token co role hay khong
    if(tokenPayload.role == 'USER' || tokenPayload.role == 'ADMIN'){

      //check xem da dang nhap chua va kiem tra role xem dung khoing
      if(this.auth.isAuthenticate() && expectedRole === tokenPayload.role){
        return true;
      }
      this.snackBarService.openSnackBar(GlobalConstatns.unauthorize,GlobalConstatns.error);
      this.router.navigate(['/cafe/dashboard'])
      return false;
    } else {
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}
