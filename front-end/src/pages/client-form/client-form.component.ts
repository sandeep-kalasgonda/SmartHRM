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
  formType?: string; // Add formType to indicate the form mode
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
    formType: '' // Initialize formType
  };

  submitted: boolean = false; // Track if the form has been submitted
  formHeading: string = ''; // Variable to hold the form heading
  isSubmitDisabled: boolean = false; // 버튼 비활성화 상태 변수 추가
  isAddContactDisabled: boolean = false; // Add Contact Person 버튼 비활성화 상태 변수 추가

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
      this.formHeading = this.client.formType === 'view' ? 'View Client' : 'Add Client';

      // View 모드일 경우 제출 버튼과 Add Contact Person 버튼 비활성화
      this.isSubmitDisabled = this.client.formType === 'view';
      this.isAddContactDisabled = this.client.formType === 'view';
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
