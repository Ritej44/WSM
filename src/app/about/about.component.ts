import { Component } from '@angular/core';
import { Facture } from '../Facture.model';
import { Fournisseur } from '../Fournisseur.model';
import { FactureService } from '../facture.service';
import { FournisseurService } from '../fournisseur.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
confirmerPaiement() {
throw new Error('Method not implemented.');
}
onFournisseurChange($event: Event) {
throw new Error('Method not implemented.');
}
loadNonPayees() {
throw new Error('Method not implemented.');
}

factures: any[] = [];
  fournisseurs: any[] = [];
  selectedFacture: any = null;
  modePaiement: string = 'VIREMENT';
  notePaiement: string = '';
  showAddPopup: boolean = false;

  constructor(private http: HttpClient,private toastr :ToastrService, private factureService: FactureService) { }

  ngOnInit(): void {
    this.getAllFactures();
  }

  getAllFactures() {
    this.http.get("http://localhost:8080/api/factures/getAll")
      .subscribe((resultData: any) => {
        console.log(resultData);
        this.factures = resultData;
        
        
      });
  }
   
   facture: Facture = {
     _id: { $oid: '' },
     DATA: '',
     LIBELLE: '',
     debit: 0,
     credit: 0,
     NOTE: '',
     Id_fournisseur: '',
     Date: '',
     modeDePayement: ''
   };
  onSubmit() {
    this.factureService.createFacture(this.facture).subscribe(
      response => {
        console.log('Facture créée:', response);
        // Réinitialiser le formulaire ou afficher un message de succès
      },
      error => {
        console.error('Erreur lors de la création de la facture:', error);
        // Afficher un message d'erreur
      }
    );
  }

  getFournisseurName(id: string): string {
    const fournisseur = this.fournisseurs.find(f => f._id.$oid === id);
    return fournisseur ? fournisseur.nom :  'Inconnu';
  }

  isPayee(facture: any): boolean {
    if (!facture.NOTE) return false;
    
    const note = facture.NOTE.toUpperCase();
    
    return note.includes('PAYE') || 
           note.includes('PAYÉ') ||
           note.includes('PAID') ||
           note.includes('REGLE') ||
           note.includes('SETTLE') ||
           note.includes('VIREMENT EFFECTUE') ||
           note.includes('CHEQUE ENCAISSE');
  }


  

  // Méthode pour obtenir le statut textuel
  getStatut(facture: any): string {
    return this.isPayee(facture) ? 'Payée' : 'Non payée';
  }

  // Méthode pour obtenir la classe CSS du badge
  getStatutClass(facture: any): string {
    return this.isPayee(facture) ? 'bg-success' : 'bg-danger';
  }

  // Méthode pour extraire le mode de paiement
  getModePaiement(facture: any): string {
    if (!facture.NOTE) return 'Non spécifié';
    
    const note = facture.NOTE.toUpperCase();
    
    if (note.includes('VIREMENT')) return 'Virement';
    if (note.includes('CHEQUE')) return 'Chèque';
    if (note.includes('CARTE')) return 'Carte';
    if (note.includes('ESPECE') || note.includes('CASH')) return 'Espèces';
    if (note.includes('CAISSE')) return 'Caisse';
    if (note.includes('COMPENSATION')) return 'Compensation';
    
    return 'Autre';
  }

    /*getAllFactures() {
    this.http.get("http://localhost:8080/api/factures/getAll")
      .subscribe((resultData: any) => {
        console.log(resultData);
        this.factures = resultData;
        console.log('Données reçues :', resultData);
        
        this.factures.forEach(facture => {
          facture.Date = new Date(facture.Date).toLocaleDateString();
          facture.Id_fournisseur = this.getFournisseurName(facture.Id_fournisseur);
          facture.payee = this.isPayee(facture);
        });
      });
  }
  
  loadAllFactures(): void {
    this.factureService.getFactures().subscribe(
      data => this.factures = data,
      error => console.error('Erreur lors du chargement des factures', error)
    );
  } 

  loadNonPayees(): void {
    this.factureService.getFacturesNonPayees().subscribe(
      data => this.factures = data,
      error => console.error('Erreur lors du chargement des factures non payées', error)
    );
  }

  loadFournisseurs(): void {
    this.fournisseurService.getFournisseurs().subscribe(
      data => this.fournisseurs = data,
      error => console.error('Erreur lors du chargement des fournisseurs', error)
    );
  }

  onFournisseurChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const fournisseurId = selectElement.value;
    
    if (fournisseurId) {
      this.factureService.getFacturesByFournisseur(fournisseurId).subscribe(
        data => this.factures = data,
        error => console.error('Erreur lors du filtrage par fournisseur', error)
      );
    } else {
      this.loadAllFactures();
    }
  }

  getFournisseurName(id: string): string {
    const fournisseur = this.fournisseurs.find(f => f._id.$oid === id);
    return fournisseur ? fournisseur.nom : 'Inconnu';
  }

  isPayee(facture: Facture): boolean {
    return facture.note?.toUpperCase().includes('PAYE') || false;
  }

  openPaiementModal(facture: Facture): void {
    this.selectedFacture = facture;
    this.notePaiement = `PAYE LE ${new Date().toLocaleDateString()} ${this.modePaiement}`;
    
    if (!this.paiementModal) {
      this.paiementModal = new bootstrap.Modal(document.getElementById('paiementModal')!);
    }
    this.paiementModal.show();
  }

  confirmerPaiement(): void {
    if (this.selectedFacture) {
      const note = `PAYE LE ${new Date().toLocaleDateString()} ${this.modePaiement}. ${this.notePaiement}`;
      
      this.factureService.payerFacture(this.selectedFacture._id.$oid, note).subscribe(
        (        updatedFacture: Facture) => {
          const index = this.factures.findIndex(f => f._id.$oid === updatedFacture._id.$oid);
          if (index !== -1) {
            this.factures[index] = updatedFacture;
          }
          this.paiementModal.hide();
        },
        (        error: any) => console.error('Erreur lors du paiement', error)
      );
    }
  }

  viewDetails(facture: Facture): void {
    // Implémentez la navigation vers la page de détails
    console.log('Voir détails:', facture);
  }*/

    openAjoutPopup(){
    this.resetForm();
    this.showAddPopup=true;
  }
 

  closePopup(): void {
    this.showAddPopup=false;
    this.resetForm();
  }

  resetForm(): void {
    this.facture = {
      _id: { $oid: '' },
      DATA: '',
      LIBELLE: '',
      debit: 0,
      credit: 0,
      NOTE: '',
      Id_fournisseur: '',
      Date: '',
      modeDePayement: ''
    };
  }

 
}
