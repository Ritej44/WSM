export interface Facture {
_id: { $oid: string };
  DATA: string;
  LIBELLE: string;
  debit: number;
  credit: number ;
  NOTE: string ;
  Id_fournisseur: string;
  payee?: boolean;
   fournisseurNom?: string;
}