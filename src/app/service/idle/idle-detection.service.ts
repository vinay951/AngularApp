import { Injectable, NgZone } from '@angular/core';
import {  Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdleDetectionService {
  private idleTimeout:any;
  private idleTime = 5*60*1000;

  constructor(private router:Router,private ngZone:NgZone) { }

  strartTracking(){
    this.resetIdleTimer();
    ['mousemove','keydown','click','touchstart'].forEach((event)=>{
      window.addEventListener(event,()=>this.resetIdleTimer());
    });
  }
  private resetIdleTimer(){
    clearTimeout(this.idleTimeout);
    this.ngZone.runOutsideAngular(()=>{
      this.idleTimeout = setTimeout(()=>{
        this.ngZone.run(()=>{
          this.handleIdleTimeout();
        });
      }, this.idleTime);
    });
  }

  private handleIdleTimeout(){
    this.router.navigateByUrl('/profile');
    this.router.navigateByUrl('/home');
  }
}
