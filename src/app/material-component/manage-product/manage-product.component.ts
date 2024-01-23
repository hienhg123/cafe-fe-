import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstatns } from '../../shared/global-constants';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss'
})
export class ManageProductComponent implements OnInit{
  displayColumn: string[] = ['name','categoryName','description','price','edit']
  dataSource:any
  length:any
  responseMessage:any

  constructor(private productService:ProductService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackBarService:SnackbarService,
    private router : Router){}
  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
     this.productService.getProduct().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response)
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message)
      if (error.error?.message){
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstatns.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstatns.error)
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "850px"
    const dialogRef = this.dialog.open(ProductComponent,dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response)=>{
      this.tableData()
    })

  }
  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig
    dialogConfig.data = {
      action: 'Edit',
      data : values
    }
    dialogConfig.width = "850px"
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig)
    this.router.events.subscribe(() => {
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response) => {
      this.tableData()
    })

  }
  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig
    dialogConfig.data = {
      message: 'delete' + values.name + 'product',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig)
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start()
      this.deleteProduct(values.id)
      dialogRef.close()
    })
  }

 deleteProduct(id:any){
  this.productService.delete(id).subscribe((repsonse:any)=>{
    this.ngxService,stop();
    this.tableData();
    this.responseMessage = repsonse?.message
    this.snackBarService.openSnackBar(this.responseMessage, "delete success")
  },(error)=>{
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

  onChange(status:any, id : any){
    this.ngxService.start();
    var data = {
      status : status.toString(),
      id: id
    }
    this.productService.updateStatus(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message
      this.snackBarService.openSnackBar(this.responseMessage,"Status update")
    },(error)=>{
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
}
