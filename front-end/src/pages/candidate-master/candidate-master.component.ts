import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CandidateFormComponent } from '../candidate-form/candidate-form.component'; // Adjust the import path
import { CandidateService } from '../candidate-master/client.service'; // Import the service
import { Candidate, Client, Requirement } from '../candidate-master/candidate.model';

@Component({
  selector: 'app-candidate-master',
  templateUrl: './candidate-master.component.html',
  styleUrls: ['./candidate-master.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CandidateMasterComponent implements OnInit {
  candidates: Candidate[] = [];
  clients: Client[] = [];
  requirements: Requirement[] = [];
  
  searchQuery: string = '';
  filteredCandidates: Candidate[] = [];
  selectedClientId: string | null = null; // Holds the selected client ID
  selectedRequirementId: string | null = null; // Holds the selected requirement ID

  constructor(private router: Router, private dialog: MatDialog, private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadCandidates();
  }

  loadClients(): void {
    this.candidateService.getClients().subscribe(clients => {
      this.clients = clients;
    });
  }

  loadCandidates(): void {
    this.candidateService.getCandidates().subscribe(candidates => {
      this.candidates = candidates;
      this.filteredCandidates = this.candidates; // Initialize filtered list
    });
  }

  filterCandidates() {
    this.filteredCandidates = this.candidates.filter(candidate =>
      candidate.cd_first_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  openCandidateForm(): void {
    const dialogRef = this.dialog.open(CandidateFormComponent, {
      height: '600px',
      width: '700px',
      data: {} // You can pass data if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.candidateService.createCandidate(result.rq_id, result).subscribe(response => {
          console.log('New Candidate Data:', response);
          this.loadCandidates(); // Refresh the candidates list
        });
      }
    });
  }

  viewCandidate(candidate: Candidate) {
    this.router.navigate(['/candidate-form', candidate.cd_id]);
  }

  editCandidate(candidate: Candidate) {
    this.router.navigate(['/candidate-form', candidate.cd_id]);
  }

  deleteCandidate(candidate: Candidate) {
    this.candidateService.deleteCandidate(candidate.cd_id).subscribe(response => {
      console.log('Deleted candidate:', response);
      this.loadCandidates(); // Refresh the candidates list
    });
  }

  onClientChange(): void {
    // Fetch requirements based on selected client
    if (this.selectedClientId) {
      this.candidateService.getRequirements(this.selectedClientId).subscribe((requirements: Requirement[]) => {
        this.requirements = requirements;
      });
    }
  }
}
