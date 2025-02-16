import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Assuming you have a UserService to handle API calls
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../service/user.service';
import { Login, ProfilePic, User } from '../model';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user: any = {
    firstName: '',
    lastName: '',
    email: '',
  };
  isPasswordChangeVisible: boolean = false;
  isDataLoading = false;
  profilePicturePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserData();
  }

  // Initialize the form
  initializeForm() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      newPassword: ['', Validators.minLength(8)],
      confirmPassword: ['']
    });
  }

  // Load user data (this can be an API call to your backend)
  loadUserData() {
    this.isDataLoading = true;
    this.getProfilePic();
    this.userService.getUserProfile(localStorage.getItem("user")).subscribe(
      (data:any) => {
        this.user = data;
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.emailId
        });
        this.isDataLoading = false;
      },
      (error:any) => {
        console.error('Error loading user data', error);
        this.isDataLoading = false;
      }
    );
  }

  // Toggle visibility of the password change section
  togglePasswordChange() {
    this.isPasswordChangeVisible = !this.isPasswordChangeVisible;
  }

  // Submit the profile form (to update user info)
  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    // Handle profile update logic
    this.isDataLoading = true;
    const email = localStorage.getItem("user");
    const updatedUser:User = new User(this.profileForm.value.firstName,this.profileForm.value.lastName,"1",email==undefined?"":email,"");
    this.userService.updateUserProfile(updatedUser).subscribe(
      (response:any) => {
        if(response.responseMessage === "User Updated"){
          this.toastr.success(response.responseMessage);
          if (this.profilePicturePreview) {
            this.isDataLoading = true;
            let profile:ProfilePic = new ProfilePic(localStorage.getItem("user")??"",this.profilePicturePreview);
            this.userService.uploadProfilePic(profile).subscribe(
              (response:any) => {
                if(response.responseMessage === "Success"){
                  this.toastr.success('Profile picture uploaded successfully');
                }
                this.isDataLoading = false;
              },
              (error:any) => {
                this.toastr.error(error.message,"Try Again");
                console.error('Error changing password:', error);
                this.isDataLoading = false;
              }
            );
          }
        } else{
          this.toastr.error(response.responseMessage,"Try AGain");
          this.isDataLoading = false;
        }
      },
      (error) => {
        this.toastr.error(error.error.responseMessage,"Try AGain");
        console.error('Error updating profile:', error);
        this.isDataLoading = false;
      }
    );
  }
  getProfilePic(){
    const email = localStorage.getItem("user")??"";
    this.userService.getProfile(email).subscribe(
      (response:any) => {
        this.profilePicturePreview = response.picture;
      },
      (error) => {
        console.error('Error getting profile pic:', error);
      }
    );
  }

  // Submit the password change form
  changePassword() {
    if (this.profileForm.value.newPassword !== this.profileForm.value.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    this.isDataLoading = true;
    const email = localStorage.getItem("user");
    const login:Login = new Login(email==undefined?"":email,this.profileForm.value.newPassword)
    this.userService.changePassword(login).subscribe(
      (response:any) => {
        if(response.responseMessage === "Success"){
          this.toastr.success('Password changed successfully');
          localStorage.clear();
          this.router.navigateByUrl('/login');
        }
        this.isDataLoading = false;
      },
      (error:any) => {
        this.toastr.error(error.message,"Try Again");
        console.error('Error changing password:', error);
        this.isDataLoading = false;
      }
    );
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicturePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
    
}
