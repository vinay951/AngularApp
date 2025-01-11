import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from "../loading/loading.component";
import { MatDialog } from '@angular/material/dialog';
import { TestRegisterComponent } from '../test-register/test-register.component';

@Component({
  selector: 'app-header',
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  showTooltip: boolean = false;  // Control visibility of tooltip
  username:string = localStorage.getItem("user")??'';
  isDataLoading = false;
  constructor(private router: Router,private userService:UserService,private toastr:ToastrService,private dialog:MatDialog){

  }
  ngOnInit(): void {
  }
  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  delete(){
    if(window.confirm('Are you sure you want to proceed?')) {
      this.isDataLoading = true;
      this.userService.deleteUser(localStorage.getItem("user")??"").subscribe({
        next: (response: any) => {
          console.log(response);
          if(response.responseMessage==="Success"){
            this.isDataLoading = false;
            localStorage.clear();
            this.router.navigateByUrl("/login")
          } else{
            this.toastr.error(response.responseMessage,"Try Again");
            this.isDataLoading = false;
          }
        },
        error: (err: any) => {
          console.log(err);
          this.isDataLoading = false;
          this.toastr.error(err.message,"Try Again");
        }
      });
    }
  }
  startingWithUser():boolean{
    const user = localStorage.getItem("user")??"";
    if (user.startsWith('User-')) {
      return false;
    } else {
      return true;
    }
  }
  register(){
    localStorage.clear();
    this.router.navigate(['/register']); 
  }
  login(){
    localStorage.clear();
    this.router.navigate(['/login']); 
  }
  openRegisterForm() {
    const dialogRef = this.dialog.open(TestRegisterComponent, {
      width: '400px',  // You can set the width or any other modal options
    });

    // Optionally, you can listen to the result of the dialog (when it's closed)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed with result:', result);
      } else {
        console.log('Dialog was closed');
      }
    });
}

}
