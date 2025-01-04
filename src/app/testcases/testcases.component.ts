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
    { name: 'Profile Test Case', url: 'https://www.example.com/home' },
    { name: '# Test Case', url: '#' },
    { name: '# Test Case', url: '#' },
    { name: '# Test Case', url: '#' },
    { name: '# Test Case', url: '#' },
  ];

}
