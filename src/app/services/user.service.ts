import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl

  constructor(private http : HttpClient) { }

  signUp(data : any){
    return this.http.post(this.url + "/user/signup",data,{
      headers : new HttpHeaders().set('Content-type','application/json')
    })
  }

  forgotPassword(data: any) {
    return this.http.post(this.url + "/user/forgotPassword", data, {
      headers: new HttpHeaders().set('Content-type', 'application/json')
    })
  }

  login(data: any) {
    return this.http.post(this.url + "/user/login", data, {
      headers: new HttpHeaders().set('Content-type', 'application/json')
    })
  }
  checkToken(){
    return this.http.get(this.url + "/user/checkToken")
  }

  changePassword(data:any){
    return this.http.post(this.url + "/user/changePassword", data, {
      headers: new HttpHeaders().set('Content-type', 'application/json')
    })
  }
}
