import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Contact {
  co_id?: string;
  co_name: string;
  co_position_hr?: string;
  co_email: string;
  co_phno: string;
}

interface ClientWithContacts {
  cl_id?: string;
  cl_name: string;
  cl_email?: string;
  cl_phno?: string;
  cl_addr?: string;
  cl_map_url?: string;
  cl_type?: string;
  cl_notes?: string;
  contacts: Contact[];
  formType?: 'add' | 'update' | 'view'; // Use specific string literals for formType
}

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ClientFormComponent implements OnInit {
  client: ClientWithContacts = {
    cl_name: '',
    cl_email: '',
    cl_phno: '',
    cl_addr: '',
    cl_map_url: '',
    cl_type: '',
    cl_notes: '',
    contacts: [],
    formType: 'add' // Initialize formType
  };

  submitted: boolean = false; // Track if the form has been submitted
  formHeading: string = ''; // Variable to hold the form heading
  isSubmitDisabled: boolean = false; 
  isAddContactDisabled: boolean = false; // Add Contact Person

  constructor(
    private dialogRef: MatDialogRef<ClientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClientWithContacts
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.client = {
        ...this.data
      };

      // Set the form heading based on formType
      switch (this.client.formType) {
        case 'view':
          this.formHeading = 'View Client';
          this.isSubmitDisabled = true; // Disable submission in view mode
          this.isAddContactDisabled = true; // Disable adding contacts in view mode
          break;
        case 'update':
          this.formHeading = 'Edit Client';
          this.isSubmitDisabled = false; // Enable submission in edit mode
          this.isAddContactDisabled = false; // Enable adding contacts in edit mode
          break;
        case 'add':
        default:
          this.formHeading = 'Add Client';
          this.isSubmitDisabled = false; // Enable submission in add mode
          this.isAddContactDisabled = false; // Enable adding contacts in add mode
          break;
      }
    }
  }

  isEmailValid(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  isFormValid(): boolean {
    const isContactValid = this.client.contacts.every(contact => 
      contact.co_name && 
      contact.co_phno && 
      contact.co_email && 
      this.isEmailValid(contact.co_email)
    );

    return !!this.client.cl_name && 
           !!this.client.cl_addr && 
           !!this.client.cl_map_url && 
           isContactValid;
  }

  onSubmit() {
    this.submitted = true;
    if (this.isFormValid()) {
      this.dialogRef.close(this.client);
    }
  }

  addContactPerson() {
    const newContactPerson: Contact = {
      co_name: '',
      co_position_hr: '',
      co_email: '',
      co_phno: ''
    };
    this.client.contacts.push(newContactPerson);
  }

  removeContactPerson(index: number): void {
    this.client.contacts.splice(index, 1);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
