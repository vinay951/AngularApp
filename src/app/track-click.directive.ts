import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[trackClick]',
  standalone: true
})
export class TrackClickDirective {
  @Input() trackClick: string = 'button_click';

  constructor(private el: ElementRef) {
    console.log('🔥 DIRECTIVE CREATED on:', el.nativeElement); // ← Check this fires
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    console.log('🎯 CLICK FIRED! Event:', this.trackClick);
    console.log('Button:', this.el.nativeElement);
    
    // Your tracking here
    alert('TRACKING WORKS!'); // Visual confirmation
  }
}
