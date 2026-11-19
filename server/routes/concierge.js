/**
 * The Aurelia Grand & Suites — Concierge AI Router
 * POST /api/concierge
 */

const express = require('express');
const router = express.Router();

let ai = null;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (geminiApiKey) {
  try {
    const { GoogleGenAI } = require('@google/genai');
    ai = new GoogleGenAI({ apiKey: geminiApiKey });
  } catch (err) {
    console.warn('[Concierge] Failed to initialize GoogleGenAI client:', err.message);
    ai = null;
  }
}

const CONCIERGE_SYSTEM_PROMPT = `
You are the Head of Guest Experience and Chief Concierge at The Aurelia Grand & Suites, an ultra-exclusive 5-star oceanfront hotel in Victoria Island, Lagos, Nigeria.
Your tone is opulent, warm, discreet, and exceptionally attentive.
You are well-versed in the hotel's amenities, suites, Lagos' high society, and curated luxury experiences.

Property Highlights:
- Suites:
  1. Presidential Ocean Penthouse (Floor 4, Room 401, $1,250/night, 2,800 sq ft, 270° Atlantic ocean view, private infinity pool, dedicated butler, helipad access, wine cellar).
  2. Royal Lagoon Villa (Floor 4, Room 402, $950/night, 2,200 sq ft, private garden, outdoor rain shower, heated jacuzzi, kitchenette).
  3. Executive Diplomatic Suite (Floor 3, Room 301, $650/night, 1,600 sq ft, private boardroom, smart home automation, city views).
  4. Signature Deluxe King (Floor 3, Room 302, $420/night, 1,100 sq ft, harbor view, Italian marble rain shower, pillow menu).
  5. Garden Terrace Loft (Floor 2, Room 201, $310/night, 900 sq ft, split-level, private botanical terrace, daybed).
  6. Classic Club Studio (Floor 2, Room 202, $220/night, 650 sq ft, pool view, Club Lounge access, rainfall shower).
- Dining & Wellness:
  - Aurelia Sky Lounge & Wagyu Grill
  - Lagoon Thermal Spa & Hydrotherapy Circuit
  - Helipad transfers to Murtala Muhammed International Airport (LOS)
  - Private Atlantic yacht charters from Victoria Island Marina

Answer guest questions with polished hospitality phrasing (e.g., "It is our absolute pleasure to assist you", "Permit me to recommend...").
`;

function getSmartFallbackResponse(query) {
  const q = (query || '').toLowerCase();

  // Suite recommendations
  if (q.includes('recommend') || q.includes('suite') || q.includes('room') || q.includes('stay')) {
    return `It is an honor to assist with your suite selection at The Aurelia Grand & Suites. 

For the pinnacle of luxury, permit me to recommend our **Presidential Ocean Penthouse** ($1,250/night, 2,800 sq ft) on Floor 4, featuring 270° panoramic views of the Atlantic, a private infinity pool, dedicated 24-hour butler, and direct helipad access. 

If tranquility and lush surroundings appeal to you, our **Royal Lagoon Villa** ($950/night, 2,200 sq ft) offers a secluded sanctuary with a private botanical garden, outdoor rain shower, and heated jacuzzi.

For executive visits, our **Executive Diplomatic Suite** ($650/night) features a private boardroom and smart home controls.

May I arrange a private tour or reserve one of these havens for your upcoming dates?`;
  }

  // 3-Day Lagos VI Luxury Itinerary
  if (q.includes('itinerary') || q.includes('lagos') || q.includes('victoria island') || q.includes('vi') || q.includes('trip')) {
    return `Allow me to present an exquisite **3-Day Curated Lagos & Victoria Island Itinerary** prepared exclusively for your stay:

**Day 1: Arrival & Coastal Serenity**
- Morning: Chauffeur pickup from Murtala Muhammed International Airport in our signature Rolls-Royce Phantom or Mercedes Maybach.
- Afternoon: Unwind with our signature Couples Thermal Spa ritual and hydrotherapy circuit.
- Evening: Sunset craft cocktails at the Aurelia Sky Lounge followed by an intimate chef's tasting table featuring fresh Atlantic seafood.

**Day 2: Private Yachting & Contemporary Culture**
- Morning: Private chartered catamaran cruise departing from Victoria Island Marina toward Tarkwa Bay and Ilashe private beach residences.
- Afternoon: Private VIP preview at Terra Kulture Gallery and the contemporary art sanctum of Nike Art Centre.
- Evening: Dinner at NOK by Alara, Lagos' premiere African-fusion destination, followed by live Afro-jazz in our Obsidian Salon.

**Day 3: Coastal Elegance & Sunset Soirée**
- Morning: Floating champagne breakfast served in your private pool or terrace.
- Afternoon: High-fashion bespoke fitting experience in Victoria Island's luxury boutique quarter.
- Evening: Sunset helicopter tour of Eko Atlantic coastline returning to The Aurelia Penthouse for a private Wagyu dinner.

Our concierge team is at your command to customize every facet of this journey.`;
  }

  // Dining recommendations
  if (q.includes('restaurant') || q.includes('dining') || q.includes('food') || q.includes('dinner') || q.includes('breakfast') || q.includes('lunch') || q.includes('chef')) {
    return `Dining at The Aurelia Grand and within Victoria Island is an exceptional gastronomic voyage. Here are our premier recommendations:

**On-Property:**
1. **The Aurelia Wagyu Grill & Cellar**: Masterfully aged prime cuts, Atlantic lobster, and rare Grand Cru vintages curated by our Master Sommelier.
2. **The Lagoon Pavilion**: Elevated contemporary West African gastronomy paired with delicate French pastry traditions.

**Curated Victoria Island Hotspots:**
1. **NOK by Alara**: A sensory masterpiece showcasing inventive African cuisine in an architectural marvel.
2. **RSVP Lagos**: Discreet, sophisticated dining with an ambient poolside terrace and New American haute cuisine.
3. **Talindo Steak House**: An intimate Lagos institution celebrated for prime beef tenderloins and discreet table service.
4. **The Grill by Delis**: Refined Mediterranean steaks and gourmet market dining.

Would you like me to secure a premier table or arrange a private dining experience in your suite?`;
  }

  // Rate optimization & pricing
  if (q.includes('rate') || q.includes('price') || q.includes('optimize') || q.includes('revenue') || q.includes('discount') || q.includes('promo')) {
    return `Our dynamic hospitality management insights indicate strong performance across our 16 luxury keys:

- **Current Average Daily Rate (ADR)**: $706.67
- **RevPAR (Revenue Per Available Room)**: $132.50
- **Direct Booking Privileges**: Guests reserving directly with code **DEV20** enjoy a 20% courtesy reduction on suites, alongside complimentary airport chauffeur transfers and flexible check-in.
- **Yield Optimization**: Weekend demand in Victoria Island trends towards our Presidential Penthouse and Lagoon Villas. We recommend locking in rates 7 to 14 days in advance to optimize both occupancy and yield.

Should you wish to review corporate agreements or extended stay tariffs, our reservations desk is immediately available.`;
  }

  // Default general luxury response
  return `Good day and welcome to The Aurelia Grand & Suites. I am delighted to be at your service.

Whether you wish to explore our Presidential Ocean Penthouse, reserve an exclusive table for dinner, coordinate helicopter transfers from Murtala Muhammed Airport, or tailor a private Victoria Island itinerary, I am entirely at your disposal.

How may I elevate your stay with us today?`;
}

// POST /api/concierge - AI Concierge Assistant
router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A message string is required in the request body' });
    }

    // If Gemini client is active, attempt generative response
    if (ai) {
      try {
        const fullPrompt = context
          ? `Context: ${JSON.stringify(context)}\n\nGuest Inquiry: ${message}`
          : message;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
          config: {
            systemInstruction: CONCIERGE_SYSTEM_PROMPT,
            temperature: 0.7
          }
        });

        const reply = response.text;
        if (reply) {
          return res.json({
            reply,
            response: reply,
            message: reply,
            provider: 'gemini'
          });
        }
      } catch (geminiErr) {
        console.warn('[Concierge] Gemini API call was unsuccessful, falling back to smart concierge engine:', geminiErr.message);
      }
    }

    // Smart Keyword Fallback
    const fallbackReply = getSmartFallbackResponse(message);
    res.json({
      reply: fallbackReply,
      response: fallbackReply,
      message: fallbackReply,
      provider: 'in-memory-smart-concierge'
    });
  } catch (err) {
    console.error('Error handling concierge request:', err);
    res.status(500).json({ error: 'Failed to process concierge request' });
  }
});

module.exports = router;
