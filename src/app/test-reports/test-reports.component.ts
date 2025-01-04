import { Component, OnInit } from '@angular/core';
import { ReportService } from '../service/report/report.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-test-reports',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './test-reports.component.html',
  styleUrl: './test-reports.component.css'
})
export class TestReportsComponent implements OnInit {

  reports: any[] = [];

  constructor(private reportService: ReportService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.fetchTop5Reports();
  }

  fetchTop5Reports(): void {
    this.reportService.getTop5Reports().subscribe(
      (data) => {
        this.reports = data.map(report => {
          // Parse the content to remove extra escape sequences
          report.content = this.cleanHtmlContent(report.content);
          return report;
        });
        console.log(this.reports.length)
      },
      (error) => {
        console.error('Error fetching reports:', error);
      }
    );
  }

  cleanHtmlContent(content: string): string {
    // Step 1: Parse the JSON string to access the raw HTML
    const parsedContent = JSON.parse(content);

    // Step 2: Clean up the HTML content (remove \n, \r, extra spaces)
    let cleanedContent = parsedContent.htmlContent.replace(/\n/g, ' ').replace(/\r/g, ' ');  // Remove newlines and carriage returns
    cleanedContent = cleanedContent.replace(/\s{2,}/g, ' ');  // Replace multiple spaces with a single space

    // Step 3: Clean up base64 image data (remove spaces and newlines)
    cleanedContent = cleanedContent.replace(/data:image\/[^;]+;base64,[^"]+/g, (match:string) => {
      // Remove spaces and newlines from the base64 string
      return match.replace(/\s+/g, '');  // Clean the base64 string (remove spaces/newlines)
    });

    return cleanedContent;
  }

  // Use DomSanitizer to ensure HTML is safe to render
  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

}
