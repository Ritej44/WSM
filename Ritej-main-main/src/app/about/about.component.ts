import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Facture } from '../Facture.model';
import { Fournisseur } from '../Fournisseur.model';
import { FactureService } from '../facture.service';
import { FournisseurService } from '../fournisseur.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Paiement } from '../paiement.model';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {


  soldeDT: number = 0;
  soldeEURO: number = 0;
factures: any[] = [];
  fournisseurs: any[] = [];
  selectedFacture: any = null;
  notePaiement: string = '';
  showAddPopup: boolean = false;
  showAddFournisseurPopup: boolean = false;
  showPaiementModal: boolean = false;
  showEditPopup: boolean = false;
  showupdatePopup: boolean = false;
  currentFactureID: string = '';
    fournisseurNames: { [id: string]: string } = {};
    service:string='';
    updateAmount: number = 0;
  selectedSoldeType: string = '';
    today: Date = new Date(); 
updateDT: number = 0;
updateEURO: number = 0;
 @Input() showPopup: boolean = false;
  @Output() close = new EventEmitter<void>();
  paiement: any = { soldeDT: 0, soldeEURO: 0 }; 

  constructor(private http: HttpClient,    private fb: FormBuilder,
    private route: ActivatedRoute
,private cdRef:ChangeDetectorRef, private toastr :ToastrService
, private factureService: FactureService) { 
  
  }

  ngOnInit(): void {
    this.getAllFactures();
    this.getSoldes();
   this.getAllFournisseurs();

  }
 openUpdatePopup(currentPaiement: any): void {
  this.getSoldes();
  this.soldeDT = this.soldeDT ;
  this.soldeEURO = currentPaiement.soldeEURO;
  this.paiement = { ...currentPaiement }; // Copier les données actuelles du paiement
  this.showupdatePopup = true;
  }

// Fermer le popup
closeUpdatePopup(): void {
  this.showupdatePopup = false;

  
  
}

// Mettre à jour les deux soldes
updateSoldes(): void {
    const fixedId = "68b20504dfdcac865c03f0a9";
    // Mettre à jour this.paiement avec les valeurs actuelles du popup
    this.paiement.soldeDT = this.soldeDT;
    this.paiement.soldeEURO = this.soldeEURO;

    this.factureService.updatePaiement(fixedId, this.paiement)
        .subscribe(
            (response) => {
                console.log('Mise à jour réussie', response);
                this.toastr.success('Soldes mis à jour avec succès');
                this.getSoldes(); // Rafraîchir les soldes affichés
                this.closeUpdatePopup();
            },
            (error) => {
                console.error('Erreur lors de la mise à jour', error);
                this.toastr.error('Erreur lors de la mise à jour des soldes');
            }
        );
}



  selectedDevise: string = 'DT'; // Par défaut : DT
openPaiementModal(facture: any) { 
   this.currentFactureID = facture.id; 
  this.showPaiementModal = true;
}
confirmPaiement() {
  const url = `http://localhost:8080/api/factures/${this.currentFactureID}/payer`;
  const body = {
    notePaiement: this.notePaiement,
    devise: this.selectedDevise
  };

  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  this.http.post(url, body, { headers })
    .subscribe(
      (response) => {
        console.log("Paiement réussi :", response);
        this.closePopup();
        this.toastr.success("Paiement effectué avec succès");
        this.getAllFactures();
        this.getSoldes();
        this.resetForm();
        this.notePaiement = '';
        this.selectedDevise = 'DT';
        // Rafraîchir la liste des factures si nécessaire
      },
      (error) => {
        console.error("Erreur lors du paiement :", error);
        // Gérer l'erreur (ex: afficher un message à l'utilisateur)
      }
    );
}

getAllFournisseurs() {
  this.http.get<Fournisseur[]>('http://localhost:8080/api/fournisseurs')
    .subscribe(fournisseurs => {
      this.fournisseurs = fournisseurs;
      console.log('Fournisseurs chargés :', this.fournisseurs); // Debug
    });
}

getSoldes(): void {
  this.isLoading = true;
  this.http.get<any>('http://localhost:8080/api/paiement/getAll')
    .subscribe(
      (response) => {
        console.log("Soldes récupérés :", response);
        
        // Vérifier si la réponse est un tableau avec au moins un élément
        if (Array.isArray(response) && response.length > 0) {
          const soldes = response[0]; // Premier élément du tableau
          
          // Vérification de l'existence des propriétés
          if (soldes.soldeDT !== undefined && soldes.soldeEURO !== undefined) {
            this.soldeDT = soldes.soldeDT;
            this.soldeEURO = soldes.soldeEURO;
          } else {
            console.error("Propriétés manquantes dans la réponse:", soldes);
            this.toastr.error("Format de données inattendu: propriétés manquantes");
          }
        } else {
          console.error("Format de réponse inattendu:", response);
          this.toastr.error("Format de données inattendu");
        }
        
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error("Erreur lors de la récupération des soldes :", error);
        this.toastr.error("Erreur lors de la récupération des soldes");
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    );
}
isLoading: boolean = false;


  getAllFactures() {
  console.log("Début de la récupération des factures");

  this.http.get("http://localhost:8080/api/factures/getAll")
    .subscribe((resultData: any) => {
      console.log("Factures reçues:", resultData);

      this.factures = resultData.filter((facture: any) => {
        const id = facture.Id_fournisseur || facture.id_fournisseur || facture.fournisseurId || facture.idFournisseur || facture.ID_FOURNISSEUR;
        
        if (id) {
          console.log(`Facture avec fournisseur ID: ${id}`);
          return true;
        } else {
          console.warn("Facture sans ID fournisseur:", facture);
          return false;
        }
      });

      const requests = this.factures.map(facture => {
        const fournisseurId = facture.Id_fournisseur || facture.id_fournisseur || facture.fournisseurId || facture.idFournisseur || facture.ID_FOURNISSEUR;

        console.log(`Requête pour fournisseur ID: ${fournisseurId}`);
        
        // Utiliser responseType: 'json' et extraire le nom
        return this.http.get<any>(`http://localhost:8080/api/fournisseurs/nom/${fournisseurId}`)
          .pipe(
            map(response => response.nom), // Extraire seulement le nom
            catchError(error => {
              console.error(`Erreur pour ${fournisseurId}:`, error);
              return of('Inconnu');
            })
          );
      });

      forkJoin(requests).subscribe((noms: string[]) => {
        console.log("Noms des fournisseurs:", noms);

        noms.forEach((nom, index) => {
          const facture = this.factures[index];
          const fournisseurId = facture.Id_fournisseur || facture.id_fournisseur || facture.fournisseurId || facture.idFournisseur || facture.ID_FOURNISSEUR;

          this.fournisseurNames[fournisseurId] = nom;
          console.log(`Mapping ${fournisseurId} -> ${nom}`);
        });
        
        // Forcer la mise à jour de la vue
        this.cdRef.detectChanges();
      });
    });
}
  
exportToExcel() {
  const headers = new HttpHeaders({
    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  this.http.get('http://localhost:8080/api/factures/export/excel', {
    headers: headers,
    responseType: 'blob',
    observe: 'response'
  }).subscribe(
    (response) => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'export.xlsx';
      if (contentDisposition && contentDisposition.includes('filename=')) {
        filename = contentDisposition.split('filename=')[1];
      }
      if (response.body) {
        const blob = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    
} else {
        this.toastr.error('Le fichier reçu est vide ou invalide.');
        console.error('Response body is null, cannot create Blob.');
      }
    },
    (error) => {
      console.error('Erreur lors du téléchargement du fichier :', error);
    }
  );

}
    loadNonPayees() {
     this.factureService.getFacturesNonPayees().subscribe(
      data => this.factures = data,
      error => console.error('Erreur lors du chargement des factures non payées', error));}
   
      LoadPayees() {
     this.factureService.getFacturesPayees().subscribe( 
      data => this.factures = data,
      error => console.error('Erreur lors du chargement des factures payées', error));}

   facture: Facture = {
     _id: { $oid: '' },
     DATA: '',
     LIBELLE: '',
     debit: 0,
     credit: 0,
     NOTE: '',
     Id_fournisseur: '',
      fournisseurNom: '' 
   };
    fournisseurNom?: string;
 onSubmit() {
   console.log('Liste des fournisseurs :', this.fournisseurs); // Debug
  const fournisseurNom = this.facture.fournisseurNom?.trim();
  if (!fournisseurNom) {
    this.toastr.error("Veuillez sélectionner un fournisseur");
    return;
  }
  const fournisseurId = this.findFournisseurIdByName(fournisseurNom);
  if (!fournisseurId) {
    this.toastr.error("Fournisseur non trouvé : " + fournisseurNom);
    return;
  }

  const factureData = {
    data: this.facture.DATA,
    libelle: this.facture.LIBELLE,
    debit: this.facture.debit,
    credit: this.facture.credit,
    note: this.facture.NOTE,
    idFournisseur: fournisseurId,
   };

  this.http.post("http://localhost:8080/api/factures/create", factureData)
    .subscribe(
      (resultData: any) => {
        console.log(resultData);
        this.toastr.success("Facture ajoutée avec succès");
        this.getAllFactures();
      },
      error => {
        console.error('Erreur lors de la création de la facture:', error);
        this.toastr.error("Erreur lors de l'ajout de la facture");
      }
    );
}

findFournisseurIdByName(nom: string): string | null {
  if (!nom) return null;
  const fournisseur = this.fournisseurs.find(f =>
    f.nom.toLowerCase().trim() === nom.toLowerCase().trim()
  );
  return fournisseur ? fournisseur.id : null;
}


  fournisseur: Fournisseur = {
    _id: { $oid: '' },
    nom: '',
    Service: ''
  };
Register() {
  const dataToSend = {
    nom: this.fournisseur.nom,
    service: this.fournisseur.Service // Map Service -> service
  };

  console.log('Données mappées envoyées:', dataToSend);
  
  this.http.post("http://localhost:8080/api/fournisseurs/create", dataToSend, { 
    responseType: 'text' 
  })
  .subscribe(
    (resultData: any) => {
      console.log(resultData);
      this.toastr.success("Fournisseur ajouté avec succès");
      this.getAllFactures();
      this.resetFormulaire();
    },
    error => {
      console.error('Erreur:', error);
      this.toastr.error("Erreur lors de l'ajout du fournisseur");
    }
  );
}
getFournisseurName(id: string): void {
    this.http.get(`http://localhost:8080/api/fournisseurs/nom/${id}`, { responseType: 'text' })
      .subscribe((resultData: string) => {
        this.fournisseurNames[id] = resultData;
      });
  }





  openAjouterfournisseurPopup(){
    this.resetFormulaire(); 
    this.showAddFournisseurPopup=true;
  }
    openAjoutPopup(){
    this.resetForm();
    this.showAddPopup=true;
  }
  openEditPopup(facture: any){
    this.setUpdate(facture); 
    this.showEditPopup=true;
  }


 
  resetFormulaire(): void {
    this.fournisseur = {
      _id: { $oid: '' },
      nom: '',
      Service: ''
    };
  }

  closePopup(): void {
    this.showAddPopup=false;
    this.showEditPopup=false;
    this.showAddFournisseurPopup=false;
    this.showPaiementModal=false;
    this.showupdatePopup=false;
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
      Id_fournisseur: ''
        };
  }

private extractFactureId(facture: any): string | null {
  if (!facture) return null;
  
  // Cas 1: ID direct
  if (facture._id) {
    if (typeof facture._id === 'string') return facture._id;
    if (facture._id.$oid) return facture._id.$oid; // Format MongoDB
  }
  
  // Cas 2: Autres propriétés possibles
  if (facture.id) {
    if (typeof facture.id === 'string') return facture.id;
    if (facture.id.$oid) return facture.id.$oid;
  }
  
  // Cas 3: Propriété personnalisée
  if (facture.currentFactureID) return facture.currentFactureID;
  
  console.warn('Aucun ID trouvé dans l\'objet:', facture);
  return null;
}

setDelete(data: any) { 
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) { 
    this.http.delete(`http://localhost:8080/api/factures/${data.id}`, 
      { responseType: 'text' }).subscribe((resultData: any) => {
        console.log(resultData);
        this.toastr.warning("Facture supprimée avec succès");
         
        this.getAllFactures(); 
      
      
      });
    }   
  }
  validateFields(): boolean {
    if (!this.facture.DATA || !this.facture.LIBELLE) {
      this.toastr.error("Veuillez remplir tous les champs obligatoires.");
      return false;
    }
    return true;
  }
setUpdate(data: any) {
  console.log('Données reçues pour modification:', data);

  // Extraire l'ID
  this.currentFactureID = data._id?.$oid || data._id || data.id;
  if (!this.currentFactureID) {
    this.toastr.error('Impossible de récupérer l\'ID de la facture');
    return;
  }

  // Assigner les données
  this.facture = {
    _id: { $oid: data._id?.$oid || data._id || data.id || '' },
    DATA: data.DATA || data.data || '',
    LIBELLE: data.LIBELLE || data.libelle || '',
    debit: data.debit || data.Debit || 0,
    credit: data.credit || data.Credit || 0,
    NOTE: data.NOTE || data.note || data.Note || '',
    Id_fournisseur: data.Id_fournisseur || data.idFournisseur || data.id_fournisseur || '',
    fournisseurNom: data.fournisseurNom || ''
  };

  console.log('Facture chargée pour édition:', this.facture);
}


UpdateRecords() {
  if (!this.currentFactureID) {
    this.toastr.error('ID de facture manquant. Veuillez sélectionner une facture.');
    return;
  }

  // Validation des champs
  if (!this.validateFields()) {
    return;
  }

  // Préparer les données pour l'API
  let bodyData = {
    data: this.facture.DATA, // Assure-toi que le nom du champ correspond au backend
    libelle: this.facture.LIBELLE,
    debit: Number(this.facture.debit),
    credit: Number(this.facture.credit),
    note: this.facture.NOTE,
    idFournisseur: this.facture.Id_fournisseur, // Vérifie le nom du champ attendu par le backend
  };

  console.log('Données envoyées au serveur:', bodyData);

  this.http.put(`http://localhost:8080/api/factures/update/${this.currentFactureID}`, bodyData)
    .subscribe({
      next: (resultData: any) => {
        this.toastr.success('Facture mise à jour avec succès');
        this.getAllFactures();
        this.closePopup();
        this.resetForm();
      },
      error: (error) => {
        console.error('Erreur complète:', error);
        this.toastr.error('Erreur lors de la mise à jour de la facture');
      }
    });
}

}
