import { DocumentType, InvoiceData } from './types';

export const GUARANTEE_TEXT = `PAYMENT TERMS:
Full payment is due prior to the start of services.

REFUND & GURU GUARANTEE:
"I do refund if student follow what I did and no personal issue but still not pass within 3 prop firm challenges."

ADDITIONAL CONDITIONS:
1. The student must provide proof of adherence to the specific strategy taught.
2. "No personal issue" is defined as zero violations of risk management rules or emotional trading errors.
3. The refund applies only after the failure of the 3rd challenge attempt under these strict conditions.`;

export const INITIAL_DATA: InvoiceData = {
  documentType: DocumentType.QUOTATION,
  documentNumber: `TQ-${new Date().getFullYear()}-001`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currencySymbol: '$',
  company: {
    name: 'TradeQuest',
    ownerName: 'Head Mentor',
    address: 'Global Financial District',
    email: 'support@tradequest.com',
    website: '',
    signatureUrl: '',
  },
  client: {
    name: 'Aspiring Trader',
    email: 'student@example.com',
    address: '123 Market Lane',
    phone: '+1 555-0123',
  },
  items: [
    {
      id: '1',
      description: 'VIP Forex Mentorship (Lifetime Access)',
      quantity: 1,
      unitPrice: 1500,
    },
    {
      id: '2',
      description: 'Prop Firm Funding Service',
      quantity: 1,
      unitPrice: 997,
    },
  ],
  notes: 'Welcome to TradeQuest. Success is the only option.',
  terms: GUARANTEE_TEXT,
};