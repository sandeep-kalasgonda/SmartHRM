import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client,Candidate,Requirement } from './candidate.model'; // Import necessary models

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private apiUrl = 'http://localhost:8004'; // Change this to your backend API URL

  constructor(private http: HttpClient) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`);
  }

  getRequirements(clientId: string): Observable<Requirement[]> {
    return this.http.get<Requirement[]>(`${this.apiUrl}/requirements/${clientId}`);
  }

  createCandidate(rq_id: string, candidate: Candidate): Observable<any> {
    return this.http.post(`${this.apiUrl}/candidates/${rq_id}`, candidate);
  }

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.apiUrl}/candidates`);
  }

  getCandidate(cd_id: string): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/candidates/${cd_id}`);
  }

  updateCandidate(cd_id: string, candidate: Candidate): Observable<any> {
    return this.http.put(`${this.apiUrl}/candidates/${cd_id}`, candidate);
  }

  deleteCandidate(cd_id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/candidates/${cd_id}`);
  }
}
