import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '../../../material-component/dialog/change-password/change-password.component';
import { ViewBillProductsComponent } from '../../../material-component/dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../../../material-component/dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  role:any

  constructor(private router:Router,
    private dialog: MatDialog) {
  }

  changePassword(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px"
    this.dialog.open(ChangePasswordComponent,dialogConfig)
  }
  logOut(){
    const dialoaConfig = new MatDialogConfig();
    dialoaConfig.data = {
      message: "Logout",
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationComponent,dialoaConfig)
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/'])
    })
  }
}
