import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstatns } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgetPasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private ngXService: NgxUiLoaderService,
    private snackBarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.forgetPasswordForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  handleSubmit() {
    this.ngXService.start();
    var formData = this.forgetPasswordForm.value;
    console.log(formData)
    var data = {
      email: formData.email
    }
    console.log("day laf data:", data)
    this.userService.forgotPassword(data).subscribe((response: any) => {
      this.ngXService.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackBarService.openSnackBar(this.responseMessage, "");
    }, (error) => {
      this.ngXService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstatns.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstatns.genericError)
    })
  }

}
