import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.apiUrl

  constructor(private http: HttpClient) { }

  add(data:any){
    return this.http.post(this.url + "/product/add", data, {
      headers: new HttpHeaders().set('Content-type', 'application/json')
    })
  }
  update(data: any) {
    return this.http.post(this.url + "/product/update", data, {
      headers: new HttpHeaders().set('Content-type', 'application/json')
    })
  }
  getProduct(){
    return this.http.get(this.url + "/product/get")
  }
  updateStatus(data: any) {
    return this.http.post(this.url + "/product/updateStatus", data, {
      headers: new HttpHeaders().set('Content-type', 'application/json')
    })
  }
  delete(id:any){
    return this.http.post(this.url + "/product/delete/"+id, {
      headers: new HttpHeaders().set('Content-type', 'application/json')
    })
  }

  getProductByCategory(id:any){
    return this.http.get(this.url + "/product/getByCategory/" + id)
  }
  getById(id:any){
    return this.http.get(this.url + "/product/getById/" + id)
  }
  }

