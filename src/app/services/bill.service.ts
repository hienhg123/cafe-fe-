import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  url = environment.apiUrl

  constructor(private http : HttpClient) { }

  generateReport(data:any){
    return this.http.post(this.url + "/bill/generateReport",data,{
      headers: new HttpHeaders().set('Content-type', 'application/json')
    })
  }

  getPdf(data:any):Observable<Blob>{
    return this.http.post(this.url + "/bill/getPdf", data,{responseType:'blob'})
  }

  getBills(){
    return this.http.get(this.url + "/bill/getBill")
  }
}
