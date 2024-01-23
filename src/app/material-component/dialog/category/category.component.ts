import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { GlobalConstatns } from '../../../shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {

  onAddCategory = new EventEmitter()
  onEditCategory = new EventEmitter()

  categoryForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";

  responseMessage: any



  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryComponent>,
    private snackBarService: SnackbarService) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required])
    })
    console.log(this.dialogAction)
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update"
      this.categoryForm.patchValue(this.dialogData.data)
    }
  }

  handleSubmit(){

    if(this.dialogAction === "Edit"){
      this.edit()
    } else {
      this.add()
    }
  }

  add(){
    var formData = this.categoryForm.value;
    var data ={
      name: formData.name
    }
    this.categoryService.addCategory(data).subscribe((response:any)=>{
      this.dialogRef.close();

      //emit cho thang manage category
      this.onAddCategory.emit()
      this.responseMessage = response.message
      this.snackBarService.openSnackBar(this.responseMessage,"Success")
    },(error)=>{
      this.dialogRef.close();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstatns.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstatns.error)
    });

  }
  edit(){
    var formData = this.categoryForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name
    }
    this.categoryService.updateCategory(data).subscribe((response: any) => {
      this.dialogRef.close();

      //emit cho thang manage category
      this.onEditCategory.emit()
      this.responseMessage = response.message
      this.snackBarService.openSnackBar(this.responseMessage, "Success")
    }, (error) => {
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

