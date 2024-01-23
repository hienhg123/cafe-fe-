import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstatns } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  password = true;
  confirmPassword = true;

  signupForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService) { }
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstatns.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstatns.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstatns.contactNumberRegex)]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    })
  }

validateSubmit(){
  if(this.signupForm.controls['password'].value != this.signupForm.controls['confirmPassword'].value){
    return true;
  } else {
    return false;
  }
}
handelSubmit(){
  this.ngxService.start();
  var formData = this.signupForm.value;
  var data = {
    name: formData.name,
    email : formData.email,
    contactNumber : formData.contactNumber,
    password : formData.password
  }
  console.log(data)
  this.userService.signUp(data).subscribe((response:any)=>{
    this.ngxService.stop();
    this.dialogRef.close;
    this.responseMessage = response?.message;
    this.snackBarService.openSnackBar(this.responseMessage,"");
    this.router.navigate(['/'])
  },(error)=>{
    this.ngxService.stop();
    if (error.error?.message) {
      this.responseMessage = error.error?.message
    } else {
      this.responseMessage = GlobalConstatns.genericError
    }
    this.snackBarService.openSnackBar(this.responseMessage, GlobalConstatns.error)
  })
}
}
