import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { SnackbarService } from '../../services/snackbar.service';
import { BillService } from '../../services/bill.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstatns } from '../../shared/global-constants';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss'
})
export class ManageOrderComponent implements OnInit {

  displayColumn: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit']
  dataSource: any = []
  manageOrderForm: any = FormGroup;
  categorys: any = []
  products: any = []
  price: any;
  totalAmount: number = 0
  responseMessage: any
  constructor(private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackBarService: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstatns.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]]
    })
  }
  getCategorys() {
    this.categoryService.getFilteredCategorys().subscribe((response: any) => {
      this.ngxService.stop()
      this.categorys = response
    }, (error: any) => {
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
  getProductByCategory(value: any) {
    this.productService.getProductByCategory(value.id).subscribe((response: any) => {
      this.products = response
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0)
    }, (error: any) => {
      console.log(error.error?.message)
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstatns.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstatns.error)
    })
  }
  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe((repsonse: any) => {
      this.price = repsonse.price;
      this.manageOrderForm.controls['price'].setValue(repsonse.price)
      this.manageOrderForm.controls['quantity'].setValue('1')
      this.manageOrderForm.controls['total'].setValue(this.price * 1)

    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstatns.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstatns.error)
    })
  }
  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value)
    } else if (temp != ''){
      this.manageOrderForm.controls['quantity'].setValue('1')
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value)
    }
  }
  validateProduct(){
    if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null ||
      this.manageOrderForm.controls['quantity'].value <=0){
        return true
      } else {
        return false
      }
  }

  validateSubmit(){
    if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null || this.manageOrderForm.controls['email'].value === null
      || this.manageOrderForm.controls['contactNumber'].value === null || this.manageOrderForm.controls['paymentMethod'].value === null){
        return true;
      } else {
        return false
      }
  }

  add(){
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e:{id:number})=>e.id === formData.product.id)
    if(productName === undefined){
      this.totalAmount = this.totalAmount + formData.total
      this.dataSource.push({id:formData.product.id,name:formData.product.name,category:formData.category.name,quantity:formData.quantity,price:formData.price,total:formData.total})
      this.dataSource = [...this.dataSource]
      this.snackBarService.openSnackBar(GlobalConstatns.productAdded,"success")
    } else {
      this.snackBarService.openSnackBar(GlobalConstatns.productExistError,GlobalConstatns.error)
    }
  }
  handleDeleteAction(value:any,element:any){
    this.totalAmount = this.totalAmount - element.total
    this.dataSource.splice(value,1)
    this.dataSource = [...this.dataSource];
  }

  submitAction(){
    var formData = this.manageOrderForm.value
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      total: this.totalAmount.toString(),
      productDetails: JSON.stringify(this.dataSource)
    }
    this.ngxService.start();
    this.billService.generateReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid);
      this.manageOrderForm.reset();
      this.dataSource =[]
      this.totalAmount = 0
    },(error:any)=>{
      this.ngxService.stop()
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstatns.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstatns.error)
    })
  }
  
  downloadFile(fileName:string){
    var data = {
      uuid: fileName
    }
    this.billService.getPdf(data).subscribe((response:any)=>{
      saveAs(response, fileName + ".pdf");
      this.ngxService.stop()
    })
  }
}
