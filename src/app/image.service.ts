import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:8081/deblur';

  constructor(private http: HttpClient) {}

  deblurImage(image: FormData): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'image/jpeg');
    return this.http.post(this.apiUrl, image, {
      headers,
      responseType: 'blob'
    });
  }
}
