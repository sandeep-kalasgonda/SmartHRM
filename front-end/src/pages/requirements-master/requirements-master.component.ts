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
          this.errorMessage = 'No Requirements for this client.';
          console.error('Failed to load requirements:', error);
          this.clearMessages();
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
        this.clearMessages();
      }
    );
  }

  filterRequirements(): void {
    this.loadRequirements(this.selectedClient);
  }

  addRequirement(): void {
    const dialogRef = this.dialog.open(RequirementsFormComponent, {
      height: '600px',
      width: '1000px',
      data: { clients: this.clients },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.cl_id) {
        this.requirementService.createRequirement(result.cl_id, result).subscribe(
          (response) => {
            const newRequirement: Requirement = {
              rq_id: response.requirement_id,
              cl_id: result.cl_id,
              rq_name: result.rq_name,
              rq_loc: result.rq_loc,
              rq_map_url: result.rq_map_url,
              rq_no_pos: result.rq_no_pos,
              rq_qual: result.rq_qual,
              rq_skills: result.rq_skills,
              rq_exp: result.rq_exp,
              rq_budget: result.rq_budget,
              rq_work_mode: result.rq_work_mode,
              rq_start_date: result.rq_start_date,
              rq_no_of_days: result.rq_no_of_days,
              rq_notes: result.rq_notes,
              created_by: result.created_by,
            };
            this.requirements.push(newRequirement);
            this.filteredRequirements = [...this.requirements]; 
            this.successMessage = 'Requirement added successfully!';
            this.errorMessage = null;
            this.clearMessages();
          },
          (error) => {
            this.errorMessage = 'Failed to create requirement. Please try again.';
            console.error('Failed to create requirement:', error);
            this.clearMessages();
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
    console.log('Editing requirement:', requirement);
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
        this.requirementService.updateRequirement(result.rq_id, result).subscribe(
          (response) => {
            const updatedRequirement: Requirement = {
              ...requirement,
              ...result,
            };
            const index = this.requirements.findIndex(r => r.rq_id === updatedRequirement.rq_id);
            if (index !== -1) {
              this.requirements[index] = updatedRequirement;
            }
            this.filteredRequirements = [...this.requirements];
            this.successMessage = 'Requirement updated successfully!';
            this.errorMessage = null;
            this.clearMessages();
          },
          (error) => {
            console.error('Failed to update requirement:', error);
            this.errorMessage = 'Failed to update requirement. Please try again.';
            this.clearMessages();
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
          this.successMessage = 'Requirement deleted successfully!';
          this.errorMessage = null;
          this.clearMessages();
        },
        (error) => {
          this.errorMessage = 'Failed to delete requirement. Please try again.';
          console.error('Failed to delete requirement:', error);
          this.clearMessages();
        }
      );
    }
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000); // Messages will disappear after 3 seconds
  }
}
