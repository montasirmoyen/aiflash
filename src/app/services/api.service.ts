import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlashcardResponse } from '../models/flashcard.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '';

  constructor(private http: HttpClient) { }

  generateFlashcards(notes: string): Observable<FlashcardResponse> {
    return this.http.post<FlashcardResponse>(this.apiUrl, { notes });
  }
}