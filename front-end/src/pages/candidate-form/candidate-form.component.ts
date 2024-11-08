import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog'; // Import MatDialogRef for dialog control
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class CandidateFormComponent implements OnInit {
  candidateForm: FormGroup;

  // Inject MatDialogRef to close the dialog and FormBuilder
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CandidateFormComponent>) {
    this.candidateForm = this.fb.group({
      companyName: ['', Validators.required],
      requirementName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Email validator
      phoneNo: ['', Validators.required],
      location: ['', Validators.required],
      qualification: ['', Validators.required],
      skills: ['', Validators.required],
      experience: ['', Validators.required],
      relevantExperience: ['', Validators.required],
      currentCTC: ['', Validators.required],
      expectedCTC: ['', Validators.required],
      noticePeriod: ['', Validators.required],
      workMode: ['', Validators.required],
      validPassport: [false, Validators.required] // Default to false, assuming it's a checkbox
    });
  }

  ngOnInit() {}

  // Submit function to handle form submission
  onSubmit() {
    if (this.candidateForm.valid) {
      console.log(this.candidateForm.value); // Log form values for testing
      // Close the dialog and pass the form data to the parent component
      this.dialogRef.close(this.candidateForm.value);
    } else {
      this.candidateForm.markAllAsTouched(); // Mark all controls as touched to trigger validation messages
    }
  }

  // Function to close the dialog without submitting
  closeDialog(): void {
    this.dialogRef.close();
  }
}
