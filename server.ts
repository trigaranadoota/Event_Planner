import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client using server-side key
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Generate full event plan structure
app.post('/api/gemini/generate-plan', async (req: Request, res: Response) => {
  try {
    const { eventType, title, guestCount, budget, vibe, location, notes } = req.body;

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'Running in offline bespoke atelier mode.',
        plan: generateFallbackPlan(eventType, title, guestCount, budget, vibe, location),
      });
    }

    const prompt = `You are the lead master planner for Céleste Atelier, a premier luxury event atelier specializing in old-money elegance, understated quiet luxury, and timeless refinement.
Design an exquisite, complete event plan for:
Event Type: ${eventType || 'Event'}
Title: ${title || 'Bespoke Celebration'}
Guest Count: ${guestCount || 80} guests
Target Budget: $${budget || 45000}
Aesthetic / Vibe: ${vibe || 'Old-money heritage, neutral tones, candlelit garden salon'}
Location: ${location || 'Estate Grounds'}
Special Notes: ${notes || 'Focus on timeless guest experience and relaxed sophistication'}

Return a JSON object adhering to this schema:
{
  "tagline": "A poetic 1-line summary in quiet luxury tone",
  "themeDescription": "2-3 sentences evoking the sensory and aesthetic atmosphere",
  "palette": [
    {"name": "Color name", "hex": "#HEX", "role": "Primary / Accent / Linen / Contrast"}
  ],
  "budgetBreakdown": [
    {"category": "Venue & Facilities", "percentage": 28, "allocated": number, "description": "Specific rationale"},
    {"category": "Catering & Fine Wines", "percentage": 30, "allocated": number, "description": "Specific rationale"},
    {"category": "Floral & Botanical Design", "percentage": 14, "allocated": number, "description": "Specific rationale"},
    {"category": "Photography & Film", "percentage": 10, "allocated": number, "description": "Specific rationale"},
    {"category": "Music & Entertainment", "percentage": 7, "allocated": number, "description": "Specific rationale"},
    {"category": "Attire & Styling", "percentage": 4, "allocated": number, "description": "Specific rationale"},
    {"category": "Stationery & Calligraphy", "percentage": 3, "allocated": number, "description": "Specific rationale"},
    {"category": "Contingency Reserve", "percentage": 4, "allocated": number, "description": "Specific rationale"}
  ],
  "timelineMilestones": [
    {"timeframe": "6-9 Months Out", "title": "Milestone title", "description": "Actionable detail", "category": "Booking"},
    {"timeframe": "3-5 Months Out", "title": "Milestone title", "description": "Actionable detail", "category": "Design"},
    {"timeframe": "1-2 Months Out", "title": "Milestone title", "description": "Actionable detail", "category": "Coordination"},
    {"timeframe": "2 Weeks Out", "title": "Milestone title", "description": "Actionable detail", "category": "Final Checks"}
  ],
  "dayOfSchedule": [
    {"time": "10:00 AM", "title": "Arrival & Setup", "notes": "Florals and staging begin", "assignedTo": "Coordinator"},
    {"time": "02:00 PM", "title": "Photography & First Looks", "notes": "Soft daylight portraits in the garden", "assignedTo": "Photographer"},
    {"time": "04:30 PM", "title": "Guest Gathering & Welcome Refreshments", "notes": "Linen water and sparkling cider", "assignedTo": "Hospitality"},
    {"time": "05:00 PM", "title": "Main Ceremony or Formal Welcome", "notes": "Acoustic strings prelude", "assignedTo": "Host"},
    {"time": "06:00 PM", "title": "Cocktail Hour & Passed Hors d'oeuvres", "notes": "Vintage jazz quintet", "assignedTo": "Caterer"},
    {"time": "07:30 PM", "title": "Seated Dinner & Heartfelt Toasts", "notes": "Multi-course heirloom tasting", "assignedTo": "All"},
    {"time": "09:30 PM", "title": "Dessert, Digestifs & Dancing", "notes": "Late harvest port and live music", "assignedTo": "Host"}
  ],
  "vendorChecklist": [
    {"category": "Venue", "name": "Historic Villa or Manor", "priority": "High", "estimatedCost": number, "keyQuestions": ["Curfew rules", "Sound restrictions"]},
    {"category": "Caterer", "name": "Seasonal Farm-to-Table Caterer", "priority": "High", "estimatedCost": number, "keyQuestions": ["Staffing ratio", "Tasting schedule"]},
    {"category": "Florist", "name": "Organic Garden & Botanical Florist", "priority": "Medium", "estimatedCost": number, "keyQuestions": ["Sourcing native blooms", "Vessel rentals"]},
    {"category": "Photographer", "name": "Editorial Film & Digital Photographer", "priority": "High", "estimatedCost": number, "keyQuestions": ["Full day coverage", "Second shooter"]},
    {"category": "Music", "name": "Acoustic Ensemble or Chamber Trio", "priority": "Medium", "estimatedCost": number, "keyQuestions": ["Repertoire customization", "Sound equipment"]}
  ],
  "personalizedIdeas": {
    "signatureDrinks": [
      {"name": "Drink Title", "ingredients": "Ingredients", "story": "Why it fits the old-money vibe"}
    ],
    "invitationWording": "Full draft of elegant invitation copy formatted for calligraphy stationery",
    "acousticPlaylist": ["Artist - Track", "Artist - Track", "Artist - Track"],
    "guestFavors": "An heirloom-quality, tasteful favor idea (e.g. hand-poured beeswax candles, antique botanical prints)"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.status(200).json({ plan: parsed });
  } catch (err: any) {
    console.error('Gemini plan error:', err);
    const { eventType, title, guestCount, budget, vibe, location } = req.body;
    return res.status(200).json({
      fallback: true,
      plan: generateFallbackPlan(eventType, title, guestCount, budget, vibe, location),
      error: err.message,
    });
  }
});

// 2. Interactive Atelier AI Chat
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, context, history } = req.body;

    if (!ai) {
      return res.status(200).json({
        reply: `Here is our bespoke atelier guidance regarding "${message}": For an understated, old-money aesthetic, prioritize authentic natural materials like raw Belgian linen, hand-calligraphed cotton paper, and unlacquered brass candlesticks. Keep floral arrangements architectural and organic rather than stiff.`,
      });
    }

    const systemInstruction = `You are Céleste Atelier's Senior Event Concierge. Your tone is understated, warm, refined, erudite, and steeped in timeless "old-money" luxury aesthetics (think Ralph Lauren, English country estates, historic Italian villas, Hamptons heritage). 
You offer crisp, actionable advice on budgets, timelines, etiquette, vendor negotiation, color harmony, and personalized guest experiences. 
Never sound robotic or like a generic chatbot. Keep answers structured, elegant, concise (2-4 punchy paragraphs or bullet points).
Event context: ${JSON.stringify(context || {})}`;

    const contents = [
      ...(Array.isArray(history) ? history.map((h: any) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })) : []),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents as any,
      config: {
        systemInstruction,
      },
    });

    return res.status(200).json({ reply: response.text });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    return res.status(200).json({
      reply: 'Regarding your planning inquiry: True timeless luxury lies in restraint. Focus your budget on the tactile guest touchpoints—exceptional seasonal cuisine, comfortable heirloom seating, and seamless musical transitions.',
    });
  }
});

// 3. Generate Specific Bespoke Ideas (Drinks, Menu, Wording, Decor)
app.post('/api/gemini/ideas', async (req: Request, res: Response) => {
  try {
    const { type, theme, eventType } = req.body;

    if (!ai) {
      return res.status(200).json({
        ideas: getFallbackIdeas(type, theme),
      });
    }

    const prompt = `Generate 4 sophisticated, unique ${type || 'personalized touches'} for a luxury ${eventType || 'event'} themed around "${theme || 'Old-World Heritage & Timeless Neutral Elegance'}".
Return a JSON array of objects:
[
  {
    "title": "Evocative Name",
    "description": "2 sentences describing the luxury concept and tactile presentation",
    "subtext": "Styling tip or ingredient details"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.status(200).json({ ideas: parsed });
  } catch (err: any) {
    console.error('Gemini ideas error:', err);
    return res.status(200).json({ ideas: getFallbackIdeas(req.body.type, req.body.theme) });
  }
});

// Helper for fallback plans
function generateFallbackPlan(
  eventType = 'Wedding',
  title = 'The Oakridge Estate Celebration',
  guestCount = 80,
  targetBudget = 45000,
  vibe = 'Old-money heritage, neutral tones, garden salon',
  location = 'Cotswolds Manor'
) {
  const b = Number(targetBudget) || 45000;
  return {
    tagline: `An understated gathering celebrating heritage, intimacy, and candlelit conversation.`,
    themeDescription: `Rooted in classic European manor aesthetics, ${title} weaves soft ecru linens, burnished brass accents, and seasonal garden florals into a timeless tapestry.`,
    palette: [
      { name: 'Warm Alabaster', hex: '#FDFBF7', role: 'Foundation Canvas' },
      { name: 'Vintage Ecru', hex: '#EFE7DA', role: 'Linen & Drapery' },
      { name: 'Burnished Bronze', hex: '#9E8555', role: 'Metal & Candlelight' },
      { name: 'Laurel Sage', hex: '#6C7565', role: 'Botanical Accent' },
      { name: 'Deep Charcoal Slate', hex: '#262422', role: 'Calligraphy & Contrast' }
    ],
    budgetBreakdown: [
      { category: 'Venue & Facilities', percentage: 28, allocated: Math.round(b * 0.28), description: 'Private manor hire, courtyard and salon access' },
      { category: 'Catering & Fine Wines', percentage: 30, allocated: Math.round(b * 0.30), description: 'Four-course seasonal tasting, reserve cellar pairing' },
      { category: 'Floral & Botanical Design', percentage: 14, allocated: Math.round(b * 0.14), description: 'Architectural urns, foraged greens, alabaster taper candles' },
      { category: 'Photography & Film', percentage: 11, allocated: Math.round(b * 0.11), description: 'Medium format film photographer & archival album' },
      { category: 'Music & Entertainment', percentage: 7, allocated: Math.round(b * 0.07), description: 'Chamber string trio for ceremony and jazz quartet for evening' },
      { category: 'Attire & Styling', percentage: 4, allocated: Math.round(b * 0.04), description: 'Bespoke tailoring and heirloom accessory curation' },
      { category: 'Stationery & Calligraphy', percentage: 3, allocated: Math.round(b * 0.03), description: 'Handmade deckled cotton paper, custom wax crest' },
      { category: 'Contingency Reserve', percentage: 3, allocated: Math.round(b * 0.03), description: 'Weather flexibility and last-minute enhancements' }
    ],
    timelineMilestones: [
      { timeframe: '9 Months Out', title: 'Estate Exclusivity & Master Date', description: 'Lock in venue contract and send bespoke save-the-dates', category: 'Booking' },
      { timeframe: '6 Months Out', title: 'Private Tasting & Cellar Selection', description: 'Curate four-course harvest menu with head sommelier', category: 'Catering' },
      { timeframe: '3 Months Out', title: 'Calligraphy Stationery Suite', description: 'Dispatch embossed invitations on deckled edge cotton', category: 'Stationery' },
      { timeframe: '1 Month Out', title: 'Final Walkthrough & Acoustic Check', description: 'Run sound check with chamber trio and confirm table layouts', category: 'Coordination' },
      { timeframe: '1 Week Out', title: 'Rehearsal & Welcome Aperitif', description: 'Intimate dinner for close family and key contributors', category: 'Final Checks' }
    ],
    dayOfSchedule: [
      { time: '09:00 AM', title: 'Vendor Load-In & Botanical Installation', notes: 'Urns positioned in courtyard; lighting strung', assignedTo: 'Coordinator' },
      { time: '01:30 PM', title: 'Editorial Portrait Session', notes: 'Natural daylight portraits in the library and conservatory', assignedTo: 'Photographer' },
      { time: '04:00 PM', title: 'Guest Arrival & Chilled Herbal Aperitif', notes: 'Rosemary-infused white port and lavender shortbread', assignedTo: 'Hospitality' },
      { time: '04:45 PM', title: 'The Main Ceremony / Welcome Address', notes: 'Chamber strings perform Bach prelude', assignedTo: 'Host' },
      { time: '05:30 PM', title: 'Courtyard Champagne & Raw Bar', notes: 'Oysters on crushed ice, vintage blanc de blancs', assignedTo: 'Caterer' },
      { time: '07:00 PM', title: 'Seated Banquet by Candlelight', notes: 'Family-style heirloom tables, heartfelt toasts', assignedTo: 'All' },
      { time: '09:00 PM', title: 'Dessert Salon & Jazz Quintet', notes: 'Espresso bar, flourless dark chocolate gateau', assignedTo: 'Entertainment' }
    ],
    vendorChecklist: [
      { category: 'Venue', name: 'Heritage Estate or Private Manor', priority: 'High', estimatedCost: Math.round(b * 0.28), keyQuestions: ['Load-in hours', 'Noise limits', 'Candle policies'] },
      { category: 'Caterer', name: 'Bespoke Culinary Collective', priority: 'High', estimatedCost: Math.round(b * 0.30), keyQuestions: ['Allergy substitutions', 'China & crystal rental', 'Staff ratio'] },
      { category: 'Florist', name: 'Atelier Botanical', priority: 'Medium', estimatedCost: Math.round(b * 0.14), keyQuestions: ['Seasonal provenance', 'Breakdown logistics', 'Vase provision'] },
      { category: 'Photographer', name: 'Film & Archival Photographer', priority: 'High', estimatedCost: Math.round(b * 0.11), keyQuestions: ['Film stock used', 'Delivery turnaround', 'Print rights'] },
      { category: 'Music', name: 'St. James Chamber Strings', priority: 'Medium', estimatedCost: Math.round(b * 0.07), keyQuestions: ['Custom song arrangements', 'Acoustic mic setup'] }
    ],
    personalizedIdeas: {
      signatureDrinks: [
        { name: 'The Old Manor French 75', ingredients: 'London Dry Gin, Champagne, fresh Meyer lemon, smoked lavender syrup', story: 'A crisp, effervescent classic elevated with garden-grown botanicals.' },
        { name: 'Burnished Rosemary Negroni', ingredients: 'Botanical Gin, Carpano Antica, Campari, torched rosemary sprig', story: 'Served over hand-cut crystal clear ice blocks for pre-dinner aperitifs.' }
      ],
      invitationWording: `Request the honour of your presence at the celebration of union and heritage. An evening of quiet elegance, candlelight, and shared vintage awaits under the ancient oaks of the estate.`,
      acousticPlaylist: [
        'Maxence Cyrin - Where Is My Mind (Piano Classical)',
        'Bill Evans Trio - Waltz for Debby',
        'Erik Satie - Gymnopédie No. 1',
        'Stan Getz & João Gilberto - Corcovado'
      ],
      guestFavors: 'Individually wrapped hand-poured wild thyme and beeswax taper candles paired with personalized linen matchboxes.'
    }
  };
}

function getFallbackIdeas(type: string, theme: string) {
  if (type === 'cocktails') {
    return [
      { title: 'The Fig & Bourbon Heritage Sour', description: 'Charred mission fig reduction, small-batch bourbon, fresh lemon, dash of walnut bitters.', subtext: 'Garnished with a dehydrated fig wheel on unbleached linen cocktail napkins.' },
      { title: 'Elderflower & Pear Bellini', description: 'Poached winter pear puree, St-Germain, vintage prosecco, micro thyme sprig.', subtext: 'Served in delicate vintage coupe glasses.' },
      { title: 'Smoked Sage Paloma', description: 'Blanco tequila, pink grapefruit juice, smoked sage syrup, flaked Murray River salt rim.', subtext: 'Infuses subtle warmth into early evening receptions.' }
    ];
  }
  if (type === 'invitations') {
    return [
      { title: 'The Timeless Formal Heirloom', description: 'Understated wording emphasizing the honor of company, engraved in slate charcoal on 600gsm cotton deckled paper.', subtext: 'Paired with antique bronze wax seal and handwritten calligraphy addresses.' },
      { title: 'The Intimate Country Manor Invitation', description: 'Warm yet aristocratic tone inviting guests to a weekend of restorative celebration, garden strolls, and candlelit dinners.', subtext: 'Accompanied by a bespoke architectural sketch of the estate pavilion.' },
      { title: 'The Golden Jubilee Monogrammed Suite', description: 'Celebrates milestone achievements with understated dignity and warmth, honoring lifelong friendships and shared memories.', subtext: 'Finished with blind letterpress debossing and silk ribbon tie.' }
    ];
  }
  return [
    { title: 'Architectural Urns with Foraged Olive Branches', description: 'Oversized stone urns filled with tall leafy branches, wild garden roses, and trailing ivy.', subtext: 'Creates dramatic height without obstructing guest eye contact across banquet tables.' },
    { title: 'Tallow & Beeswax Taper Candlescapes', description: 'Clusters of varying height ivory candles set in unlacquered antique brass holders.', subtext: 'Casts a warm, flickering amber glow reminiscent of 19th-century salon gatherings.' },
    { title: 'Hand-Lettered Vintage Escort Tiles', description: 'Honed travertine or raw linen cards hand-inscribed by a master calligrapher with guest names and table numbers.', subtext: 'Doubles as an intimate personalized keepsake for each attendee.' }
  ];
}

// Dev and Prod serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Céleste Atelier server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
