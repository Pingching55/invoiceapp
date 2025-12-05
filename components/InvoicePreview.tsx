import React from 'react';
import { InvoiceData } from '../types';
import { DefaultLogo } from '../assets/DefaultLogo';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const total = subtotal;

  return (
    <div id="invoice-preview" className="bg-white text-gray-900 w-full max-w-[210mm] min-h-[297mm] p-12 mx-auto shadow-2xl relative flex flex-col">
      {/* Header with Logo */}
      <div className="flex justify-between items-start border-b-2 border-navy-900 pb-8 mb-8">
        <div className="flex flex-col items-start gap-4">
           <div className="flex items-center gap-4">
             {data.company.logoUrl ? (
                <img 
                  src={data.company.logoUrl} 
                  alt="Company Logo" 
                  className="w-24 h-24 object-contain"
                />
             ) : (
                <DefaultLogo />
             )}
             <div>
                <h1 className="text-4xl font-sans font-extrabold text-navy-900 tracking-tighter">TRADE QUEST</h1>
                <p className="text-xs text-gold-600 font-bold uppercase tracking-[0.3em] mt-1">Funding & Mentorship</p>
             </div>
           </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-light text-gray-400 uppercase tracking-widest">{data.documentType}</h2>
          <p className="text-lg font-bold text-navy-900 mt-1">#{data.documentNumber}</p>
        </div>
      </div>

      {/* Addresses */}
      <div className="flex justify-between mb-12">
        <div className="w-5/12">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">From</h3>
          <div className="text-sm font-medium text-gray-700 leading-relaxed border-l-2 border-gold-500 pl-4">
            <p className="font-bold text-navy-900 text-lg">{data.company.name}</p>
            <p>{data.company.ownerName}</p>
            <p>{data.company.address}</p>
            <p>{data.company.email}</p>
            <p>{data.company.website}</p>
          </div>
        </div>
        <div className="w-5/12 text-right">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">To</h3>
          <div className="text-sm font-medium text-gray-700 leading-relaxed border-r-2 border-gray-300 pr-4">
            <p className="font-bold text-navy-900 text-lg">{data.client.name}</p>
            <p>{data.client.address}</p>
            <p>{data.client.email}</p>
            <p>{data.client.phone}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full mb-12">
        <thead>
          <tr className="border-b-2 border-navy-900 text-navy-900 text-xs uppercase tracking-wider font-bold">
            <th className="py-3 text-left w-1/2">Description</th>
            <th className="py-3 text-center">Qty</th>
            <th className="py-3 text-right">Unit Price</th>
            <th className="py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-4 text-left font-medium">{item.description}</td>
              <td className="py-4 text-center">{item.quantity}</td>
              <td className="py-4 text-right">{data.currencySymbol}{item.unitPrice.toFixed(2)}</td>
              <td className="py-4 text-right font-bold">{data.currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
          {/* Subtotal Section */}
          <tr>
             <td colSpan={2}></td>
             <td className="py-4 text-right text-sm font-bold uppercase tracking-wider pt-8">Subtotal</td>
             <td className="py-4 text-right font-bold pt-8">{data.currencySymbol}{subtotal.toFixed(2)}</td>
          </tr>
          <tr>
             <td colSpan={2}></td>
             <td className="py-2 text-right text-sm font-bold uppercase tracking-wider text-navy-900">Total Due</td>
             <td className="py-2 text-right font-extrabold text-2xl text-navy-900">{data.currencySymbol}{total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Terms & Conditions - Special Focus on Guarantee */}
      <div className="mt-auto">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gold-600 mb-3 border-b border-gray-200 pb-2">
          Terms & Guarantee
        </h3>
        <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
          {data.terms}
        </div>
      </div>

      {/* Signature Section - Bottom Right */}
      <div className="flex justify-end mt-12 mb-4 px-4">
        <div className="flex flex-col items-center">
            {data.company.signatureUrl ? (
                <img src={data.company.signatureUrl} alt="Signature" className="h-16 object-contain mb-2" />
            ) : (
                <div className="h-16 w-32"></div> // Spacer if no signature
            )}
            <div className="w-56 border-t border-navy-900 pt-2 text-center">
                 <p className="font-bold text-navy-900 text-sm">{data.company.ownerName}</p>
                 <p className="text-[10px] uppercase text-gray-500 tracking-wider">Authorized Signature</p>
            </div>
        </div>
      </div>

      {/* Footer Notes */}
      {data.notes && (
        <div className="pt-6 border-t border-dashed border-gray-300 text-center">
          <p className="text-navy-900 italic font-serif text-lg">"{data.notes}"</p>
        </div>
      )}
      
      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-navy-900"></div>
    </div>
  );
};