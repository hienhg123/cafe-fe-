import { Component, OnInit } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstatns } from '../../shared/global-constants';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrl: './view-bill.component.scss'
})
export class ViewBillComponent implements OnInit{

  displayColumn: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view']
  dataSource : any
  responseMessage :any

constructor(private billService: BillService,
  private ngxService: NgxUiLoaderService,
  private dialog : MatDialog,
  private snackBarService : SnackbarService,
  private router : Router){}

  ngOnInit(): void {
   this.ngxService.start()
   this.tableData();
  }
  tableData(){
    this.billService.getBills().subscribe((response:any)=>{
      this.ngxService.stop()
      this.dataSource = new MatTableDataSource(response)
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message)
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstatns.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstatns.error)
    })
  }

  applyFilter(event:Event){
    const fitlerValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = fitlerValue.trim().toLowerCase();
  }

  handleViewAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data : values
    }
    dialogConfig.width = "100%"
    const dialogRef = this.dialog.open(ViewBillProductsComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close()
    })
  }
  downloadReportAction(values:any){
    this.ngxService.start()
    var data = {
      name : values.name,
      email : values.email,
      uuid : values.uuid,
      contactNumber : values.contactNumber,
      paymentMethod : values.paymentMethod,
      total : values.total.toString(),
      productDetails: values.productDetails
    }
    this.downloadFile(values.uuid,data)

  }

  downloadFile(fileName : string,data:any){
    this.billService.getPdf(data).subscribe((response:any)=>{
      saveAs(response,fileName + '.pdf');
      this.ngxService.stop()
    })
  }

}
