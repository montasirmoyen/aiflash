import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Flashcard } from '../../models/flashcard.model';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [FormsModule, NgIf, NgFor],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  userNotes: string = '';
  flashcards: Flashcard[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  onGenerate() {
    if (!this.userNotes.trim()) return;

    this.isLoading = true;
    this.error = null;

    this.apiService.generateFlashcards(this.userNotes).subscribe({
      next: (response) => {
        // Initialize isFlipped to false for each card
        this.flashcards = response.flashcards.map(card => ({ ...card, isFlipped: false }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = "Failed to generate cards. Please check your AWS connection.";
        this.isLoading = false;
      }
    });
  }

  toggleCard(card: Flashcard) {
    card.isFlipped = !card.isFlipped;
  }
}