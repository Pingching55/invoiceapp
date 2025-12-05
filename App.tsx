import React, { useState, useEffect } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { INITIAL_DATA } from './constants';
import { InvoiceData } from './types';
import { Printer, Briefcase } from 'lucide-react';

const STORAGE_KEY = 'tradequest_company_data';

const App: React.FC = () => {
  // Initialize state with saved company data if available
  const [data, setData] = useState<InvoiceData>(() => {
    try {
      const savedCompany = localStorage.getItem(STORAGE_KEY);
      if (savedCompany) {
        return {
          ...INITIAL_DATA,
          company: JSON.parse(savedCompany)
        };
      }
    } catch (error) {
      console.error("Failed to load saved data", error);
    }
    return INITIAL_DATA;
  });

  // Auto-save company details (including signature) whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.company));
    } catch (error) {
      console.error("Failed to save company data", error);
    }
  }, [data.company]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900 text-white">
      {/* Navigation - Hidden on Print */}
      <nav className="h-16 border-b border-gray-700 bg-gray-900 flex items-center justify-between px-6 no-print z-50">
        <div className="flex items-center gap-3 text-gold-500">
          <Briefcase size={28} />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">TradeQuest</h1>
            <span className="text-xs text-gray-400 uppercase tracking-widest">Invoices & Quotations</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-white px-4 py-2 rounded-md font-medium transition-all shadow-lg hover:shadow-gold-500/20"
          >
            <Printer size={18} />
            Print / Save PDF
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Editor Sidebar - Hidden on Print */}
        <div className="w-1/3 min-w-[400px] h-full overflow-hidden no-print border-r border-gray-700 bg-gray-800">
          <InvoiceForm data={data} onChange={setData} />
        </div>

        {/* Preview Area - Full screen on Print */}
        <div className="flex-1 h-full bg-gray-600 overflow-y-auto p-8 flex justify-center print:p-0 print:bg-white print:block print:w-full print:h-full print:absolute print:top-0 print:left-0 print:z-[9999]">
          <div className="print:w-full">
            <InvoicePreview data={data} />
          </div>
        </div>
      </div>

      {/* Floating API Key Warning if needed, or just standard UI */}
      {!process.env.API_KEY && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 text-white p-4 rounded shadow-lg border border-red-500 max-w-sm no-print z-50">
          <p className="text-sm font-bold">API Key Missing</p>
          <p className="text-xs">AI features for polishing legal text will not work. Please ensure API_KEY is set in environment.</p>
        </div>
      )}
    </div>
  );
};

export default App;