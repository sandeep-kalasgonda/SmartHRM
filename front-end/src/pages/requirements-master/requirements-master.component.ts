import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RequirementsFormComponent } from '../requirements-form/requirements-form.component'; 
import { Requirement, Client } from './requirement.model'; 
import { RequirementService } from './client.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-requirements-master',
  templateUrl: './requirements-master.component.html',
  styleUrls: ['./requirements-master.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RequirementsMasterComponent implements OnInit {
  requirements: Requirement[] = [];
  filteredRequirements: Requirement[] = [];
  clients: Client[] = []; 
  searchQuery: string = '';
  selectedClient: string | null = null; 
  errorMessage: string | null = null; // For error messages
  successMessage: string | null = null; // For success messages

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private requirementService: RequirementService
  ) {}

  ngOnInit(): void {
    this.loadClients(); 
  }

  loadRequirements(clientId: string | null): void {
    if (clientId) {
      this.requirementService.getRequirementsByClient(clientId).subscribe(
        (requirements) => {
          this.requirements = requirements;
          this.filteredRequirements = requirements; 
        },
        (error) => {
          this.errorMessage = 'No Requirements For this client.';
          console.error('Failed to load requirements:', error);
        }
      );
    } else {
      this.requirements = [];
      this.filteredRequirements = [];
    }
  }

  loadClients(): void {
    this.requirementService.getClients().subscribe(
      (clients) => {
        this.clients = clients; 
      },
      (error) => {
        this.errorMessage = 'Failed to load clients. Please try again later.';
        console.error('Failed to load clients:', error);
      }
    );
  }

  filterRequirements(): void {
    this.loadRequirements(this.selectedClient);
  }

  addRequirement(): void {
    const clientId = this.selectedClient || ''; // Use an empty string if selectedClient is null
  
    const dialogRef = this.dialog.open(RequirementsFormComponent, {
      height: '600px',
      width: '1000px',
      data: { clients: this.clients },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.requirementService.createRequirement(clientId, result).subscribe(
          (newRequirement) => {
            this.requirements.push(newRequirement);
            this.filteredRequirements = [...this.requirements]; 
            this.successMessage = 'Requirement added successfully!';
            this.errorMessage = null; // Clear any previous errors
          },
          (error) => {
            this.errorMessage = 'Failed to create requirement. Please try again.';
            console.error('Failed to create requirement:', error);
          }
        );
      }
    });
  }

  viewRequirement(requirement: Requirement): void {
    const dialogRef = this.dialog.open(RequirementsFormComponent, {
      height: '600px',
      width: '1000px',
      data: { 
        requirement: requirement, 
        readonly: true,
        clients: this.clients,
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  editRequirement(requirement: Requirement): void {
    console.log('Editing requirement:', requirement); // Log to verify the requirement object
    const dialogRef = this.dialog.open(RequirementsFormComponent, {
      height: '600px',
      width: '1000px',
      data: { 
        requirement: requirement, 
        clients: this.clients,
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
  
      if (result) {
        // Directly call the update service method without checking rq_id
        this.requirementService.updateRequirement(result.rq_id, result).subscribe(
          (updatedRequirement) => {
            const index = this.requirements.findIndex(r => r.rq_id === updatedRequirement.rq_id);
            if (index !== -1) {
              this.requirements[index] = updatedRequirement;
            }
            this.filteredRequirements = [...this.requirements];
            this.successMessage = 'Requirement updated successfully!';
            this.errorMessage = null; // Clear any previous errors
          },
          (error) => {
            console.error('Failed to update requirement:', error);
            this.errorMessage = 'Failed to update requirement. Please try again.';
          }
        );
      } else {
        console.log('Dialog was closed without saving.');
      }
    });
  }
  
  
  
  deleteRequirement(requirement: Requirement): void {
    if (requirement.rq_id) {
      this.requirementService.deleteRequirement(requirement.rq_id).subscribe(
        () => {
          this.requirements = this.requirements.filter(r => r.rq_id !== requirement.rq_id);
          this.filteredRequirements = [...this.requirements];
          this.successMessage = null ;
          this.errorMessage ='Requirement deleted successfully!'; // Clear any previous errors
        },
        (error) => {
          this.errorMessage = 'Failed to delete requirement. Please try again.';
          console.error('Failed to delete requirement:', error);
        }
      );
    }
  }

  private getClientName(clientId: string): string | undefined {
    const client = this.clients.find(client => client.cl_id === clientId);
    return client ? client.cl_name : undefined; 
  }
}
