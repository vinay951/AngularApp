import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from "./header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor( private router: Router){

  }
  ngOnInit(): void {
    
  }
  title = 'angularApp';
  checkmethod():boolean{
    if(this.router.url==='/login' || this.router.url==='/register' ||  this.router.url==='/otp' || this.router.url==='/forgot'){
      return false;
    } return true;
  }
}
