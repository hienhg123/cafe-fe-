import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = environment.apiUrl;
  constructor(private http:HttpClient) { }

  addCategory(data:any){
    return this.http.post(this.url + 
      "/category/add",data,{
      headers: new HttpHeaders().set('Content-type', 'application/json')
      })
  }

  updateCategory(data: any) {
    return this.http.post(this.url +
      "/category/update", data, {
      headers: new HttpHeaders().set('Content-type', 'application/json')
    })
  }
  getCategory(){
    return this.http.get(this.url + "/category/get")
  }

  getFilteredCategorys(){
    return this.http.get(this.url + "/category/get?filterValue=true")
  }
}
