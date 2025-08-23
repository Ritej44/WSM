export interface Facture {
  Date: string;
  _id: { $oid: string };
  DATA: string;
  LIBELLE: string;
  debit: number;
  credit: number | null;
  NOTE: string | null;
  Id_fournisseur: string;
  modeDePayement: string;
  payee?: boolean;
}