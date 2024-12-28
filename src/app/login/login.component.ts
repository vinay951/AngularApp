import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../service/user.service';
import { Login } from '../model';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isDataLoading = false;

  constructor(private fb: FormBuilder,private userService:UserService, private router: Router,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.isDataLoading = true;
    if(this.loginForm.valid) {
      const login:Login = new Login(this.loginForm.value.username,this.loginForm.value.password);
      this.userService.login(login).subscribe({
        next: (response: any) => {
          console.log(response);
          if(response.responseMessage==="Success"){
            localStorage.setItem("user",this.loginForm.value.username);
            this.isDataLoading = false;
            this.router.navigateByUrl("/home")
          } else{
            this.toastr.error(response.responseMessage,"Try Again");
            this.isDataLoading = false;
          }
        },
        error: (err: any) => {
          console.log(err);
          this.isDataLoading = false;
          this.toastr.error(err.error.responseMessage,"Try Again");
        }
      });
    }
  }
}
