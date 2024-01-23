import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstatns } from '../shared/global-constants';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMessage:any;
	data:any

	ngAfterViewInit() { }

	constructor(private dashboardService:DashboardService,
		private ngxService:NgxUiLoaderService,
		private snackbarService:SnackbarService) {
			this.ngxService.start();
			this.dashboardData()
	}

	dashboardData(){
		this.dashboardService.getDetails().subscribe((resposne:any)=>{
			this.ngxService.stop();
			this.data = resposne;
			console.log("day la response",resposne)	
			console.log(this.data["bill: "])
		},(error:any)=>{
			this.ngxService.stop();
			console.log(error)
			if(error.error?.message){
				this.responseMessage = error.error?.message
			} else {
				this.responseMessage = GlobalConstatns.genericError
			}
			this.snackbarService.openSnackBar(this.responseMessage,GlobalConstatns.error)
		})
  
	}

}
