export enum DocumentType {
  INVOICE = 'INVOICE',
  QUOTATION = 'QUOTATION'
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface ClientDetails {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface CompanyDetails {
  name: string;
  ownerName: string;
  address: string;
  email: string;
  website: string;
  logoUrl?: string;
  signatureUrl?: string;
}

export interface InvoiceData {
  documentType: DocumentType;
  documentNumber: string;
  date: string;
  dueDate: string;
  client: ClientDetails;
  company: CompanyDetails;
  items: LineItem[];
  notes: string;
  terms: string;
  currencySymbol: string;
}