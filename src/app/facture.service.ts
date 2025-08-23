import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture } from './Facture.model';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:8080/api/factures';

  constructor(private http: HttpClient) { }

  getFactures(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createFacture(facture: Facture): Observable<Facture> {
    return this.http.post<Facture>(this.apiUrl, facture);
  }

  // Factures NON PAYÉES
  getFacturesNonPayees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/non-payees`);
  }

  // Factures PAYÉES
  getFacturesPayees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payees`);
  }

  // Par statut
  getFacturesByStatut(statut: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/statut/${statut}`);
  }

  

  getFacturesByFournisseur(idFournisseur: string): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/fournisseur/${idFournisseur}`);
  }

  payerFacture(id: string, notePaiement: string): Observable<Facture> {
    return this.http.post<Facture>(`${this.apiUrl}/paiement/${id}`, notePaiement);
  }


  updateFacture(id: string, facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.apiUrl}/${id}`, facture);
  }

  deleteFacture(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}