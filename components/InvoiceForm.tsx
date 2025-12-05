import React, { useState, useRef, useEffect } from 'react';
import { InvoiceData, DocumentType, LineItem } from '../types';
import { Plus, Trash2, Wand2, Loader2, RefreshCw, Upload, X, PenTool, Eraser } from 'lucide-react';
import { polishLegalText, generateThankYouNote } from '../services/geminiService';
import { GUARANTEE_TEXT } from '../constants';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange }) => {
  const [isPolishing, setIsPolishing] = useState(false);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  
  // Signature State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Load signature into canvas on mount OR when signatureUrl changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (data.company.signatureUrl) {
          const img = new Image();
          img.onload = () => {
            // Draw image centered and contained (aspect fit)
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            const x = (canvas.width - w) / 2;
            const y = (canvas.height - h) / 2;
            ctx.drawImage(img, x, y, w, h);
          };
          img.src = data.company.signatureUrl;
        }
      }
    }
  }, [data.company.signatureUrl]);

  const handleInputChange = (section: keyof InvoiceData, field: string, value: string) => {
    onChange({
      ...data,
      [section]: {
        ...(data[section] as any),
        [field]: value,
      },
    });
  };

  const handleRootChange = (field: keyof InvoiceData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    const newItems = data.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: 'New Service',
      quantity: 1,
      unitPrice: 0,
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeLineItem = (id: string) => {
    onChange({ ...data, items: data.items.filter((item) => item.id !== id) });
  };

  const handlePolishTerms = async () => {
    setIsPolishing(true);
    try {
      const polished = await polishLegalText(data.terms);
      onChange({ ...data, terms: polished });
    } catch (e) {
      alert("Failed to polish text. Check API Key.");
    } finally {
      setIsPolishing(false);
    }
  };

  const handleResetTerms = () => {
    onChange({ ...data, terms: GUARANTEE_TEXT });
  };

  const handleGenerateNote = async () => {
    setIsGeneratingNote(true);
    try {
      const note = await generateThankYouNote(data.client.name, data.company.name);
      onChange({ ...data, notes: note });
    } catch (e) {
      alert("Failed to generate note.");
    } finally {
      setIsGeneratingNote(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('company', 'logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    handleInputChange('company', 'logoUrl', '');
  }

  // --- Signature Logic ---
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('company', 'signatureUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // If starting a new drawing, we might want to keep the existing background image or clear it?
    // For now, we assume drawing adds to whatever is there (including uploaded image)
    
    setIsDrawing(true);
    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000'; // Draw in black
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if ('touches' in e) {
      e.preventDefault(); // Stop page scroll while drawing signature
    }

    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      handleInputChange('company', 'signatureUrl', canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      handleInputChange('company', 'signatureUrl', '');
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gray-800 rounded-lg shadow-xl text-gray-200 border border-gray-700 h-full overflow-y-auto">
      {/* Header Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gold-500 border-b border-gray-700 pb-2">Document Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Type</label>
            <select
              value={data.documentType}
              onChange={(e) => handleRootChange('documentType', e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:border-gold-500 focus:outline-none"
            >
              <option value={DocumentType.INVOICE}>Invoice</option>
              <option value={DocumentType.QUOTATION}>Quotation</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Currency</label>
            <input
              type="text"
              value={data.currencySymbol}
              onChange={(e) => handleRootChange('currencySymbol', e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:border-gold-500 focus:outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Document Number</label>
            <input
              type="text"
              value={data.documentNumber}
              onChange={(e) => handleRootChange('documentNumber', e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gold-500 border-b border-gray-700 pb-2">Your Company</h3>
        
        {/* Logo Upload */}
        <div className="bg-gray-700/50 p-3 rounded border border-gray-600 border-dashed">
          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Company Logo</label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded text-sm transition-colors">
              <Upload size={14} />
              Upload Image
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            {data.company.logoUrl && (
              <button onClick={clearLogo} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1">
                <X size={14} /> Remove
              </button>
            )}
          </div>
          {data.company.logoUrl && (
             <p className="text-xs text-green-400 mt-2">✓ Logo uploaded</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
           <input
            placeholder="Company Name"
            value={data.company.name}
            onChange={(e) => handleInputChange('company', 'name', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:border-gold-500 focus:outline-none"
          />
           <input
            placeholder="Owner Name"
            value={data.company.ownerName}
            onChange={(e) => handleInputChange('company', 'ownerName', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:border-gold-500 focus:outline-none"
          />
           <input
            placeholder="Address"
            value={data.company.address}
            onChange={(e) => handleInputChange('company', 'address', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:border-gold-500 focus:outline-none"
          />
           <input
            placeholder="Email / Contact"
            value={data.company.email}
            onChange={(e) => handleInputChange('company', 'email', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:border-gold-500 focus:outline-none"
          />
           <input
            placeholder="Website"
            value={data.company.website}
            onChange={(e) => handleInputChange('company', 'website', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:border-gold-500 focus:outline-none"
          />
        </div>

        {/* Digital Signature */}
        <div className="bg-gray-700/50 p-3 rounded border border-gray-600">
           <div className="flex justify-between items-center mb-2">
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400">
                <PenTool size={14} /> Digital Signature
              </label>
              <div className="flex gap-2">
                <label className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 cursor-pointer" title="Select existing signature file">
                  <Upload size={12} /> Upload
                  <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                </label>
                <button 
                  onClick={clearSignature}
                  className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300"
                >
                  <Eraser size={12} /> Clear
                </button>
              </div>
           </div>
           <div className="bg-white rounded overflow-hidden cursor-crosshair border-2 border-dashed border-gray-500 hover:border-gold-500 transition-colors">
              <canvas
                ref={canvasRef}
                width={300}
                height={100}
                className="w-full touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
           </div>
           <p className="text-[10px] text-gray-500 mt-1">Draw or upload your signature. It auto-saves.</p>
        </div>
      </div>

      {/* Client Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gold-500 border-b border-gray-700 pb-2">Client Details</h3>
        <div className="grid grid-cols-1 gap-4">
           <input
            placeholder="Client Name"
            value={data.client.name}
            onChange={(e) => handleInputChange('client', 'name', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:border-gold-500 focus:outline-none"
          />
           <input
            placeholder="Client Email"
            value={data.client.email}
            onChange={(e) => handleInputChange('client', 'email', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:border-gold-500 focus:outline-none"
          />
           <input
            placeholder="Client Address"
            value={data.client.address}
            onChange={(e) => handleInputChange('client', 'address', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:border-gold-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gold-500 border-b border-gray-700 pb-2">Line Items</h3>
        {data.items.map((item) => (
          <div key={item.id} className="flex gap-2 items-start bg-gray-700/30 p-2 rounded">
            <div className="flex-1 space-y-2">
              <input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm focus:border-gold-500 focus:outline-none"
              />
              <div className="flex gap-2">
                 <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-20 bg-gray-900 border border-gray-600 rounded p-2 text-sm focus:border-gold-500 focus:outline-none"
                />
                 <input
                  type="number"
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-32 bg-gray-900 border border-gray-600 rounded p-2 text-sm focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={() => removeLineItem(item.id)}
              className="p-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        <button
          onClick={addLineItem}
          className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-600 font-medium"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

       {/* Terms & AI */}
       <div className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-between items-center border-b border-gray-700 pb-2">
          <h3 className="text-xl font-semibold text-gold-500">Terms & Disclaimer</h3>
          <div className="flex gap-2">
            <button
              onClick={handleResetTerms}
              className="flex items-center gap-1 text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded transition-colors"
              title="Reset to Guru Guarantee"
            >
              <RefreshCw size={10} /> Reset Default
            </button>
            <button
              onClick={handlePolishTerms}
              disabled={isPolishing}
              className="flex items-center gap-2 text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
            >
              {isPolishing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
              AI Polish
            </button>
          </div>
        </div>
        <textarea
          rows={6}
          value={data.terms}
          onChange={(e) => handleRootChange('terms', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm focus:border-gold-500 focus:outline-none"
        />
        <p className="text-xs text-gray-500">
          Includes standard refund guarantee for prop firm challenges.
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <h3 className="text-xl font-semibold text-gold-500">Footer Note</h3>
           <button
            onClick={handleGenerateNote}
            disabled={isGeneratingNote}
            className="flex items-center gap-2 text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
          >
            {isGeneratingNote ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
            Generate
          </button>
        </div>
        <textarea
          rows={2}
          value={data.notes}
          onChange={(e) => handleRootChange('notes', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm focus:border-gold-500 focus:outline-none"
        />
      </div>

    </div>
  );
};