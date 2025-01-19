import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from "../loading/loading.component";
import { QuestionService } from '../service/question/question.service';
import { NotificationSendMessageService } from '../service/notification-send-message.service';

@Component({
  selector: 'app-coding',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './coding.component.html',
  styleUrl: './coding.component.css'
})
export class CodingComponent {
  question: any;
  userCode: string = '';
  selectedLanguage: string = 'java';
  result: string | null = null;
  isDataLoading = false;

  constructor(private questionService:QuestionService,private notification:NotificationSendMessageService) {}

  ngOnInit() {
    this.getRandomQuestion();
  }

  getRandomQuestion() {
    this.isDataLoading = true;
    this.questionService.getRandomQuestion().subscribe({
      next: (response: any) => {
        this.question = response;
        this.isDataLoading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.isDataLoading = false;
      }
    });
  }

  submitSolution() {
    this.isDataLoading = true;
    const payload = {
      code: this.userCode,
      language: this.selectedLanguage
    };
    this.questionService.submitSolution(payload,this.question).subscribe({
      next: (response: any) => {
        this.notification.showNotification(response.result);
        this.result = response.result+"\n\nYour Output is:\n\n"+response.output;
        this.isDataLoading = false;
        if(response.result === "Test Case Failed"){
          this.result = this.result+"\n\nExpected Output is:\n"+response.expectedOutput;
        }
      },
      error: (err: any) => {
        console.log(err);
        this.isDataLoading = false;
      }
    });
  }

}
