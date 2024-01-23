import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../services/snackbar.service';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstatns } from '../../../shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm:any = FormGroup;
  dialogAction: any = "Add"
  action:any = "Add"
  responseMessage : any
  categorys:any = []

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductComponent>,
    private categorySerivce: CategoryService,
    private snackBarService: SnackbarService,
    private ngxService:NgxUiLoaderService){}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name :[null,[Validators.required]],
      categoryId: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
    if(this.dialogData.action === "Edit"){
      this.dialogAction = "Edit";
      this.action = "Update";
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategorys();
  }

  getCategorys(){
    this.categorySerivce.getCategory().subscribe((response:any)=>{
      this.categorys = response
    },(error:any)=>{
      console.log(error)
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstatns.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstatns.error)
    })
  }
  handelSubmit(){
    if(this.dialogAction === "Edit"){
      this.edit()
    } else {
      this.add()
    }
  }
add(){
  var formData = this.productForm.value;
  var data = {
    name: formData.name,
    categoryId : formData.categoryId,
    price : formData.price,
    description: formData.description
  }
  this.productService.add(data).subscribe((response: any) => {
    this.dialogRef.close();

    //emit cho thang manage category
    this.onAddProduct.emit()
    this.responseMessage = response.message
    this.snackBarService.openSnackBar(this.responseMessage, "Success")
  }, (error:any) => {
    this.dialogRef.close();
    console.log(error);
    if (error.error?.message) {
      this.responseMessage = error.error?.message
    } else {
      this.responseMessage = GlobalConstatns.genericError
    }
    this.snackBarService.openSnackBar(this.responseMessage, GlobalConstatns.error)
  });

}
edit(){
  var formData = this.productForm.value;
  var data = {
    id: this.dialogData.data.id,
    name: formData.name,
    categoryId: formData.categoryId,
    price: formData.price,
    description: formData.description
  }
  this.productService.update(data).subscribe((response: any) => {
    this.dialogRef.close();

    //emit cho thang manage category
    this.onEditProduct.emit()
    this.responseMessage = response.message
    this.snackBarService.openSnackBar(this.responseMessage, "Success")
  }, (error: any) => {
    this.dialogRef.close();
    console.log(error);
    if (error.error?.message) {
      this.responseMessage = error.error?.message
    } else {
      this.responseMessage = GlobalConstatns.genericError
    }
    this.snackBarService.openSnackBar(this.responseMessage, GlobalConstatns.error)
  });
}
}
