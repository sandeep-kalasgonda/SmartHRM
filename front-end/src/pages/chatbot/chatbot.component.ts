import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog'; // Import MatDialogRef
import { Router } from '@angular/router';

interface Message {
  sender: string;
  text: string;
  editable: boolean;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  messages: Message[] = [
    {
      sender: 'bot',
      text: 'Hello! I am AI Assistant, your assistant. How can I help you today?',
      editable: false
    }
  ];
  userInputForm = new FormControl('');

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<ChatbotComponent> // Inject MatDialogRef
  ) {}

  ngOnInit() {
    // Any initialization logic
  }

  sendMessage() {
    const userMessage: Message = {
      sender: 'user',
      text: this.userInputForm.value ?? '',
      editable: true
    };
    this.messages.push(userMessage);

    // Optional: Send the message to a language model API and handle the response
    // ... (your API call logic)

    this.userInputForm.setValue('');
  }

  editMessage(index: number) {
    const editedMessage = prompt('Edit your message:');
    if (editedMessage) {
      this.messages[index].text = editedMessage;

      // Optionally, re-send the edited message to the language model
      // ... (your API call logic)
    }
  }

  closeChatbot() {
    this.dialogRef.close(); // Use MatDialogRef to close the dialog
  }
}
