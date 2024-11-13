import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ClientsService } from './client.service';
import { ClientWithContacts } from './client.model';
import { ClientFormComponent } from '../client-form/client-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients-master',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './clients-master.component.html',
  styleUrls: ['./clients-master.component.css'],
})
export class ClientsMasterComponent implements OnInit {
  clients: ClientWithContacts[] = [];
  searchQuery: string = '';
  successMessage: string | null = null; // For success messages
  errorMessage: string | null = null; // For error messages

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientsService.getClients().subscribe(
      (clients: ClientWithContacts[]) => {
        this.clients = clients;
      },
      (error) => {
        this.errorMessage = 'Failed to load clients. Please try again.';
        console.error('Failed to load clients:', error);
        this.clearMessages(); // Clear messages after a few seconds
      }
    );
  }

  openAddClientForm(): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      height: '600px',
      width: '700px',
      data: {
        cl_name: '',
        cl_email: '',
        cl_phno: '',
        cl_addr: '',
        cl_map_url: '',
        cl_type: '',
        cl_notes: '',
        contacts: [],
        primaryContact: {
          co_name: '',
          co_position_hr: '',
          co_email: '',
          co_phno: ''
        },
        formType: 'add' // Set formType to 'add' when creating a new client
      },
    });

    dialogRef.afterClosed().subscribe((result: ClientWithContacts | undefined) => {
      if (result) {
        this.clientsService.createClient(result).subscribe(
          () => {
            this.loadClients();
            this.successMessage = 'Client created successfully!';
            this.errorMessage = null; // Clear any previous errors
            this.clearMessages(); // Clear messages after a few seconds
          },
          (error) => {
            this.errorMessage = 'Failed to create client. Please try again.';
            console.error('Failed to create client:', error);
            this.clearMessages(); // Clear messages after a few seconds
          }
        );
      }
    });
  }

  openEditClientForm(client: ClientWithContacts): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      height: '600px',
      width: '700px',
      data: {
        ...client,
        formType: 'update' // Set formType to 'update' for editing
      },
    });

    dialogRef.afterClosed().subscribe((result: ClientWithContacts | undefined) => {
      if (result && result.cl_id) {
        this.clientsService.updateClient(result.cl_id, result).subscribe(
          () => {
            this.loadClients();
            this.successMessage = 'Client updated successfully!';
            this.errorMessage = null; // Clear any previous errors
            this.clearMessages(); // Clear messages after a few seconds
          },
          (error) => {
            this.errorMessage = 'Failed to update client. Please try again.';
            console.error('Failed to update client:', error);
            this.clearMessages(); // Clear messages after a few seconds
          }
        );
      }
    });
  }

  openViewClientForm(client: ClientWithContacts): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      height: '600px',
      width: '700px',
      data: {
        ...client,
        formType: 'view' // Set formType to 'view' for viewing
      },
    });

    dialogRef.afterClosed().subscribe(); // No need to handle result for view
  }

  deleteClient(client: ClientWithContacts): void {
    if (client.cl_id) {
      this.clientsService.deleteClient(client.cl_id).subscribe(
        () => {
          this.loadClients();
          this.successMessage = 'Client deleted successfully!';
          this.errorMessage = null; // Clear any previous errors
          this.clearMessages(); // Clear messages after a few seconds
        },
        (error) => {
          this.errorMessage = 'Failed to delete client. Please try again.';
          console.error('Failed to delete client:', error);
          this.clearMessages(); // Clear messages after a few seconds
        }
      );
    } else {
      console.error('Client ID is undefined, cannot delete client.');
    }
  }

  filterClients(): ClientWithContacts[] {
    return this.clients.filter(client =>
      client.cl_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000); // Messages will disappear after 3 seconds
  }
}
