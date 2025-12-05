import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const polishLegalText = async (rawText: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are a professional legal consultant for a high-end financial education and funding company.
      Reword the following text to sound professional, legally robust, and authoritative, suitable for a formal invoice or quotation contract.
      Keep the core meaning exactly the same, especially regarding the refund conditions (3 failed challenges despite following rules).
      Do not add markdown formatting like bolding or headers unless appropriate for a contract clause.
      
      Raw Text: "${rawText}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || rawText;
  } catch (error) {
    console.error("Error polishing text:", error);
    throw error;
  }
};

export const generateThankYouNote = async (clientName: string, companyName: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Write a short, professional, and motivating thank you note for a trading student named ${clientName} from the company ${companyName}.
      It should appear at the bottom of an invoice. Max 2 sentences.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error generating note:", error);
    return "Thank you for your business.";
  }
};
