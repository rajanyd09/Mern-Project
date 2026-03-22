import { GoogleGenerativeAI } from '@google/generative-ai';
import Interaction from '../models/Interaction.js';

// Lazy initializer for Gemini AI to ensure environment variables are loaded
let genAI;
const getGenAI = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
  }
  return genAI;
};


export const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ error: 'Gemini API Key is missing. Please add it to your .env file.' });
    }
    
    const genAI = getGenAI();
    const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('--- Gemini API Error (Controller) ---');
    console.error('Message:', error.message);
    console.error('-------------------------------------');
    
    res.status(500).json({ 
      error: 'Failed to generate AI response',
      details: error.message || 'Unknown error'
    });
  }
};


export const saveInteraction = async (req, res) => {
  try {
    const { prompt, response } = req.body;

    if (!prompt || !response) {
      return res.status(400).json({ error: 'Prompt and response are required' });
    }

    const newInteraction = new Interaction({ prompt, response });
    await newInteraction.save();

    res.status(201).json({ message: 'Interaction saved successfully', interaction: newInteraction });
  } catch (error) {
    console.error('Error saving to DB (Controller):', error);
    res.status(500).json({ error: 'Failed to save interaction' });
  }
};
