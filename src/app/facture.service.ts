import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture } from './Facture.model';
import { Fournisseur } from './Fournisseur.model';

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

  createFournisseur(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.apiUrl, fournisseur);
  }

  // Factures NON PAYÉES
  getFacturesNonPayees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/non-payees`);
  }

  // Factures PAYÉES
  getFacturesPayees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paye`);
  }

  // Par statut
  getFacturesByStatut(statut: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/statut/${statut}`);
  }

  

  getFacturesByFournisseur(idFournisseur: string): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/fournisseur/${idFournisseur}`);
  }

  //payerFacture(id: string, notePaiement: string): Observable<Facture> {
    //return this.http.post<Facture>(`${this.apiUrl}/paiement/${id}`, notePaiement);
  //}
  payerFacture(id: string, notePaiement: string, devise: string): Observable<Facture> {
  return this.http.post<Facture>(`${this.apiUrl}/factures/${id}/payer`, { notePaiement, devise });
}

  private apiurl = 'http://localhost:8080/api/paiement';
updatePaiement(id: string, paiement: any): Observable<any> {
    return this.http.put(`${this.apiurl}/${id}`, paiement);
  }

  updateFacture(id: string, facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.apiUrl}/${id}`, facture);
  }

  deleteFacture(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}