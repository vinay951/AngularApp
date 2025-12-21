import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../service/user.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from "../loading/loading.component";
import { MatDialog } from '@angular/material/dialog';
import { TestRegisterComponent } from '../test-register/test-register.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { SessionService } from '../session/session.service';

@Component({
  selector: 'app-header',
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit{
  showTooltip: boolean = false;  // Control visibility of tooltip
  username:string = localStorage.getItem("user")??'';
  isDataLoading = false;
  faceIdLoading = true;
  isMenuOpen = false;  // Menu state
  searchQuery: string = '';
  darkMode: boolean = false;
  liked: boolean = false;
  kept: boolean = false;
  // Menu items for search suggestions
  menuItems = [
    { label: 'Home', route: '/home' },
    { label: 'Register Test Case', route: '/register-test', userOnly: true, action: 'openRegisterForm' },
    { label: 'ChatGPT', route: '/chatgpt' },
    { label: 'Profile', route: '/profile' },
    { label: 'Online Compiler', route: '/compiler' },
    { label: 'Bike Buyer Prediction', route: '/predict' },
    { label: 'Test Case', route: '/test' },
    { label: 'Unblur Image', route: '/unblur' },
    { label: 'Current Location', route: '/maps' },
    { label: 'Test Reports', route: '/reports' },
    { label: 'Random Questions', route: '/questions' },
    { label: 'Dynamic elements', route: '/dynamic', userOnly: true },
    { label: 'Logout', route: null, userOnly: true, action: 'logout' },
    { label: 'Register', route: null, userOnly: false, action: 'register' },
    { label: 'Login', route: null, userOnly: false, action: 'login' },
    { label: 'Delete My Account', route: null, userOnly: true, action: 'delete' },
    { label: 'Delete Face‑ID', route: null, userOnly: true, action: 'deleteFaceID', faceId: true }
  ];

  filteredMenuItems: any[] = [];
  showSuggestions: boolean = false;

  constructor(private router: Router,private userService:UserService,private toastr:ToastrService,private dialog:MatDialog,
    private session:SessionService
  ){}
  // Search functionality
  onSearch(event: Event) {
    event.preventDefault();
    if (this.searchQuery && this.searchQuery.trim().length > 0 && this.filteredMenuItems.length > 0) {
      // If suggestions exist, navigate to the first one
      this.onSuggestionClick(this.filteredMenuItems[0]);
    } else if (this.searchQuery && this.searchQuery.trim().length > 0) {
      // Otherwise, navigate to a search results page
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
    this.showSuggestions = false;
  }

  // Update suggestions as user types
  onSearchInput() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query.length === 0) {
      this.filteredMenuItems = [];
      this.showSuggestions = false;
      return;
    }
    this.filteredMenuItems = this.menuItems.filter(item => {
      // Only show items user is allowed to see
      if (item.userOnly === true && !this.startingWithUser()) return false;
      if (item.userOnly === false && this.startingWithUser()) return false;
      if (item.faceId && this.faceIdLoading) return false;
      if (item.faceId && !this.checkFaceID()) return false;
      return item.label.toLowerCase().includes(query);
    });
    this.showSuggestions = this.filteredMenuItems.length > 0;
  }

  // Handle suggestion click
  onSuggestionClick(item: any) {
    this.showSuggestions = false;
    this.searchQuery = '';
    if (item.action) {
      const action = item.action as keyof HeaderComponent;
      if (typeof this[action] === 'function') {
        (this[action] as Function).call(this);
      }
    } else if (item.route) {
      this.router.navigate([item.route]);
    }
  }

    // Dark mode toggle
    toggleDarkMode() {
      if(this.darkMode){
        this.darkMode = false;
        document.body.classList.remove('dark-mode');
      } else{
        this.darkMode = true;
        document.body.classList.add('dark-mode');
      }
      this.userService.toggleMode(this.username).subscribe({
        next: (response: any) => {
          console.log(response);
          if(response.theme==="dark"){
            this.darkMode = true;
            document.body.classList.add('dark-mode');
          } else{
            this.darkMode = false;
            document.body.classList.remove('dark-mode');
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }

    // Like button logic
    toggleLike() {
      this.liked = !this.liked;
    }

    // Keep button logic
    toggleKeep() {
      this.kept = !this.kept;
    }
  ngOnInit(): void {
    this.checkFaceID();
    this.getMode();
  }
  getMode(){
    const email = localStorage.getItem("user")??"";
    this.isDataLoading = true;
    this.userService.getMode(email).subscribe({
      next: (response: any) => {
        console.log(response);
        if(response.theme==="dark"){
          this.darkMode = true;
          document.body.classList.add('dark-mode');
        } else{
          this.darkMode = false;
          document.body.classList.remove('dark-mode');
        }
        this.isDataLoading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.isDataLoading = false;
      }
    });
  }
  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login');
    this.session.clearSessionData();
  }
  // Function to toggle the menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Function to close the menu
  closeMenu() {
    this.isMenuOpen = false;
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
    this.session.clearSessionData(); 
  }
  login(){
    localStorage.clear();
    this.router.navigate(['/login']);
    this.session.clearSessionData(); 
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
  deleteFaceID(){
    this.isDataLoading = true;
    const email = localStorage.getItem("user")??"";
    this.userService.deleteFaceId(email).subscribe({
      next: (response: any) => {
        console.log(response);
        if(response.message==="Face ID user deleted successfully"){
          this.isDataLoading = false;
          console.log("Face ID Deleted Successfully");
          this.toastr.success("Face ID Deleted Successfully");
          this.session.setSessionData("faceId","false");
        } else{
          this.toastr.error(response.message,"Try Again");
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
  checkFaceID(): boolean {
    this.faceIdLoading = false;
    return this.session.getSessionData("faceId") === "true";
  }

}
