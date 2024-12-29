import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from "../loading/loading.component";
import { CompileService } from '../service/compile.service';

@Component({
  selector: 'app-compiler',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingComponent],
  templateUrl: './compiler.component.html',
  styleUrl: './compiler.component.css'
})
export class CompilerComponent {

  userCode: string = '';
  selectedLanguage: string = 'python';
  output: string = '';
  isDataLoading = false;

  constructor(private codeExecutionService: CompileService) {}

  executeCode() {
    this.isDataLoading = true;
    this.codeExecutionService.executeCode(this.userCode,this.selectedLanguage).subscribe(
      (response:any) => {
        this.output = response.output;
        this.isDataLoading = false;
      },
      (error:any) => {
        this.isDataLoading = false;
        this.output = error.error.message;
      }
    );    
  }

}
