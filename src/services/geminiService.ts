export interface GeneratePlanParams {
  eventType: string;
  title: string;
  guestCount: number;
  budget: number;
  vibe: string;
  location: string;
  notes?: string;
}

export async function requestAIPerplan(params: GeneratePlanParams) {
  try {
    const res = await fetch('/api/gemini/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    return data.plan;
  } catch (error) {
    console.warn('Using client-side fallback atelier generator due to network issue:', error);
    // Returns structured fallback so user is never blocked
    return null;
  }
}

export async function sendConciergeMessage(message: string, context: any, history: { role: string; content: string }[]) {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, history }),
    });
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    return data.reply;
  } catch (error) {
    console.error('Concierge chat error:', error);
    return 'For an understated, old-money aesthetic: prioritize natural textures, unvarnished linen, warm candlelight, and seamless guest transitions rather than ostentatious displays.';
  }
}

export async function requestBespokeIdeas(type: string, theme: string, eventType: string) {
  try {
    const res = await fetch('/api/gemini/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, theme, eventType }),
    });
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    return data.ideas || [];
  } catch (error) {
    console.error('Bespoke ideas error:', error);
    return [];
  }
}
