import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-testcases',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './testcases.component.html',
  styleUrl: './testcases.component.css'
})
export class TestcasesComponent {
  links = [
    { name: 'Home', url: 'https://www.example.com/home' },
    { name: 'About Us', url: 'https://www.example.com/about' },
    { name: 'Services', url: 'https://www.example.com/services' },
    { name: 'Contact', url: 'https://www.example.com/contact' },
    { name: 'Blog', url: 'https://www.example.com/blog' },
  ];

}
