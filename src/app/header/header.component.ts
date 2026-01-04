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
import { Subscription } from 'rxjs';
import { CartService } from '../service/cart.service';
import { CartDialogComponent } from '../cart-dialog/cart-dialog.component';

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
  cartCount = 0;
  private sub: Subscription;
  // Menu items for search suggestions
  menuItems = [
    { label: 'Home', route: '/home' },
    { label: 'Register Test Case', route: '/register-test', userOnly: true, action: 'openRegisterForm' },
    { label: 'ChatGPT', route: '/chatgpt' },
    { label: 'Profile', route: '/profile' },
    { label: 'Online Compiler', route: '/compiler' },
    {label: 'Change Password', route: '/changePassword' },
    { label: 'Game', route: '/game' },
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
    { label: 'shop-Beta', route: '/shop' },
    { label: 'My Orders', route: '/my-orders', userOnly: true },
    { label: 'Add Product', route: '/admin/add-product', userOnly: true },
    { label: 'Delete Face‑ID', route: null, userOnly: true, action: 'deleteFaceID', faceId: true }
  ];

  filteredMenuItems: any[] = [];
  showSuggestions: boolean = false;
  pinnedItems: any[] = [];
  selectedId: string | null = null;   // <-- add this

  submenuOpen: {[key:string]: boolean} = { tests: false, account: false, compiler: false };

  // Define which labels belong to each submenu so we can render them dynamically
  submenuLabels: {[key:string]: string[]} = {
    account: ['Profile','Change Password','Logout','Delete My Account','Register','Login','Delete Face‑ID'],
    tests: ['Register Test Case','Test Case','Test Reports'],
    compiler: ['Online Compiler','Random Questions'],
    shop: ['shop-Beta','My Orders','Add Product'],
    others: ['ChatGPT','Unblur Image','Current Location','Bike Buyer Prediction','Game','Dynamic elements']
  };

  constructor(private router: Router,private userService:UserService,private toastr:ToastrService,private dialog:MatDialog,
    private session:SessionService,private cart: CartService
  ){
    this.sub = this.cart.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }
  openCart(): void {
      this.dialog.open(CartDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      height: '520px',
      maxHeight: '90vh',
      panelClass: 'big-cart-dialog'
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
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
    this.loadUserPreferences();
  }

  toggleSubmenu(name: string, ev?: MouseEvent){
    if(ev){ ev.stopPropagation(); ev.preventDefault(); }
    // Close others
    Object.keys(this.submenuOpen).forEach(k => { if(k!==name) this.submenuOpen[k]=false; });
    this.submenuOpen[name] = !this.submenuOpen[name];
  }

  // Return submenu items ordered with pinned items first
  orderedSubmenuItems(key: string){
    const labels = this.submenuLabels[key] || [];
    // Filter base menu items by these labels and visibility rules
    let items = this.menuItems.filter(item => labels.includes(item.label)).filter(item => {
      if (item.userOnly === true && !this.startingWithUser()) return false;
      if (item.userOnly === false && this.startingWithUser()) return false;
      if (item.faceId && this.faceIdLoading) return false;
      if (item.faceId && !this.checkFaceID()) return false;
      return true;
    });

    // Compute pinned index for stable ordering of pinned items
    const pinnedOrder = this.pinnedItems.map((p: any) => p.label);
    items.sort((a: any, b: any) => {
      const ai = pinnedOrder.indexOf(a.label);
      const bi = pinnedOrder.indexOf(b.label);
      const aIndex = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
      const bIndex = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
      if (aIndex !== bIndex) return aIndex - bIndex; // pinned ones first in user-specified order
      return labels.indexOf(a.label) - labels.indexOf(b.label); // otherwise original submenu order
    });
    return items;
  }

  // Handle clicks for items that are actions instead of routes
  onItemClick(item: any){
    this.selectedId = item.id;      
    if (item.action){
      const action = item.action as keyof HeaderComponent;
      if (typeof this[action] === 'function'){
        (this[action] as Function).call(this);
      }
    } else if (item.route){
      this.router.navigate([item.route]);
    }
  }
  
  loadUserPreferences(){
    const email = localStorage.getItem("user")??"";
    if(!email) return;
    this.userService.getUserPreferences(email).subscribe({
      next: (resp: any) => {
        console.log("User preferences", resp);
        if(resp && resp.preferences){
          // getting inthis format "Home,Test Case" need to convert to array of objects
          const items = resp.preferences.split(',');
          this.pinnedItems = this.menuItems.filter(mi => items.includes(mi.label));
          console.log("Loaded user preferences", this.pinnedItems);
        }
      },
      error: (err: any) => {
        console.log('Could not load user preferences', err);
      }
    });
  }

  isPinned(item:any){
    return this.pinnedItems.some(pi => pi.label === item.label);
  }

  // Toggle pin for an item and save user preferences
  togglePin(item:any, ev?:MouseEvent){
    if(ev){ ev.stopPropagation(); ev.preventDefault(); }
    const idx = this.pinnedItems.findIndex(pi => pi.label === item.label);
    if(idx >= 0){
      this.pinnedItems.splice(idx,1);
    } else {
      if(this.pinnedItems.length >2){
        this.toastr.error('You can pin up to 3 items only');
        return;
      }
      this.pinnedItems.push(item);
    }
    const email = localStorage.getItem("user")??"";
    // Call backend to save preferences (simple payload)
    this.userService.saveUserPreferences(email, { pinned: this.pinnedItems.map(i=>i.label) }).subscribe({
      next: (resp:any) => {
        this.toastr.success('Preferences saved');
      },
      error: (err:any) => {
        console.log('Error saving preferences', err);
        this.toastr.error('Could not save preferences');
      }
    });
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
