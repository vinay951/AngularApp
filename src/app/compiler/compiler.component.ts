import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from "../loading/loading.component";
import { CompileService } from '../service/compile.service';
import { NotificationSendMessageService } from '../service/notification-send-message.service';
import { ChatService } from '../service/chat.service';

@Component({
  selector: 'app-compiler',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingComponent],
  templateUrl: './compiler.component.html',
  styleUrl: './compiler.component.css'
})
export class CompilerComponent {

  code: string = '';  // Variable to hold user input code
  selectedLanguage: string = 'java';  // Default language is Java
  output: string = '';  // Variable to hold output or error

  defaultCode: { [key: string]: string } = {
    java: `public class TempCode {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    python: `print("Hello, World!")`,
    cpp: `#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`
  };
  isDataLoading = false;
  aiInput:string='';
  mode:string='dynamic';

  constructor(private codeExecutionService: CompileService,private notificationService:NotificationSendMessageService,private chatService:ChatService) {
    this.code = this.defaultCode[this.selectedLanguage];
  }

  executeCode() {
    this.isDataLoading = true;
    this.codeExecutionService.executeCode(this.code,this.selectedLanguage).subscribe(
      (response:any) => {
        this.output = response.output;
        this.notificationService.showNotification("Code executed successfully",localStorage.getItem("user")!);
        this.isDataLoading = false;
      },
      (error:any) => {
        this.isDataLoading = false;
        this.output = error.error.message;
      }
    );    
  }
  changeLanguage(language: string) {
    this.selectedLanguage = language;
    this.code = this.defaultCode[language];  // Reset to default code for the selected language
  }

  modeChange(mode:string){
    this.mode=mode;
  }
  generateCodeWithAI(){
    if(this.aiInput.trim()===''){
      this.notificationService.showNotification("Please provide a description for AI code generation",localStorage.getItem("user")!);
      return;
    }
    this.isDataLoading = true;
    this.chatService.getCodeFromAI(this.aiInput,this.selectedLanguage).then(
      (generatedCode:string) => {
        this.code = generatedCode;
        this.notificationService.showNotification("Code generated successfully",localStorage.getItem("user")!);
        this.isDataLoading = false;
      }
    ).catch(
      (error:any) => {
        this.isDataLoading = false;
        this.output = error.message;
      }
    );
  }

}
