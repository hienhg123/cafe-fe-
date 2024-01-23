import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstatns } from '../../shared/global-constants';
import { filter } from 'rxjs';
import { CategoryComponent } from '../dialog/category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrl: './manage-category.component.scss'
})
export class ManageCategoryComponent implements OnInit {


  displayColumn: string[] = ['name', 'edit']
  dataSource: any;
  responseMessage: any;

  constructor(private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private router: Router) { }
  ngOnInit(): void {
    this.ngxService.start();
    this.tableData()
  }

  tableData() {
    this.categoryService.getCategory().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    }, (error: any)=>{
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
    console.log(filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data ={
      action: 'Add'
    };
    dialogConfig.width = "850px"
    const dialogRef = this.dialog.open(CategoryComponent,dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close()
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response)=>{
      this.tableData();
    })
  }

  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data:values
    };
    dialogConfig.width = "850px"
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig)
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe((response) => {
      this.tableData();
    })

  }

}
