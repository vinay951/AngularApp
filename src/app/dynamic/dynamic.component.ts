import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../service/chat.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-dynamic',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, CommonModule, LoadingComponent],
  templateUrl: './dynamic.component.html',
  styleUrl: './dynamic.component.css'
})
export class DynamicComponent {
    selectedElement: string = '';
    selectedColor: string = '';
    selectedSize: string = '';
    selectedBgColor: string = '';
    selectedPadding: string = '';
    selectedMargin: string = '';
    selectedBorderRadius: string = '';
    dynamicOrAi:boolean=false;
    aiInput:string='';
    htmlContent:SafeHtml='';
    isDataLoading=false;
    elements: Array<{ type: string, id: number, styles: { [key: string]: string } }> = [];
    nextId: number = 1;
    constructor(private chatService:ChatService,private sanitizer: DomSanitizer) {}
  
    // Add element with dynamic styles
    addElement() {
      if (this.selectedElement) {
        const styles = {
          color: this.selectedColor || 'black', // Default color
          fontSize: this.selectedSize ? `${this.selectedSize}px` : '16px', // Default size
          backgroundColor: this.selectedBgColor || 'transparent',
          padding: this.selectedPadding || '10px',
          margin: this.selectedMargin || '10px',
          borderRadius: this.selectedBorderRadius || '5px',
        };
  
        this.elements.push({
          type: this.selectedElement,
          id: this.nextId++,
          styles: styles
        });
  
        // Reset styles after adding element
        this.resetStyles();
      }
    }
  
    // Reset style inputs
    resetStyles() {
      this.selectedColor = '';
      this.selectedSize = '';
      this.selectedBgColor = '';
      this.selectedPadding = '';
      this.selectedMargin = '';
      this.selectedBorderRadius = '';
    }
  
    // Dynamically create element based on type
    getElementMarkup(type: string) {
      switch (type) {
        case 'button':
          return `<button class="dynamic-element" (click)="handleClick()">Click Me</button>`;
        case 'textbox':
          return `<input type="text" placeholder="Enter text" class="dynamic-element" />`;
        case 'checkbox':
          return `<input type="checkbox" class="dynamic-element" /> Check me`;
        case 'radio':
          return `<input type="radio" name="radio-group" class="dynamic-element" /> Radio Option`;
        case 'div':
          return `<div class="custom-div dynamic-element">This is a custom div</div>`;
        case 'select':
          return `<select class="dynamic-element">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                  </select>`;
        case 'paragraph':
          return `<p class="dynamic-element">This is a dynamic paragraph!</p>`;
        case 'image':
          return `<img class="dynamic-element" src="https://via.placeholder.com/150" alt="Image" />`;
        default:
          return '';
      }
    }
  
    // Button click handler (for demonstration)
    handleClick() {
      alert('Button clicked!');
    }
    downloadCreatedHtml(){
      // Select the div element you want to download
      var divContent = document.querySelector('.elements-container'); // Modify this selector if necessary

      // Create the complete HTML structure with <html> and <body> tags
      var fullHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Downloaded Div</title>
          </head>
          <body>
            ${divContent ? divContent.outerHTML : ''}
          </body>
        </html>
      `;

      // Create a Blob with the HTML content
      var blob = new Blob([fullHTML], { type: 'text/html' });

      // Create an anchor element to trigger the download
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'created.html'; // Name of the file to download

      // Trigger the download
      link.click();
    }
    dynamicOrAI(){
      this.dynamicOrAi=!this.dynamicOrAi;
    }
    generateElementWithAI(){
      this.isDataLoading=true;
      this.htmlContent='';
      // Placeholder for AI integration logic
      this.chatService.getHtmlContentFromAI(this.aiInput).then((response:string)=>{
        console.log("AI Response:",response);
        this.htmlContent=this.sanitizer.bypassSecurityTrustHtml(response);
        this.isDataLoading=false;
      }).catch((error)=>{
        console.error("Error fetching AI content:",error);
        this.isDataLoading=false;
      });
    }
  }
  