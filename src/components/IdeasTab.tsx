import React, { useState } from 'react';
import {
  Sparkles,
  Wine,
  Music,
  Mail,
  Gift,
  Copy,
  Check,
  Palette,
  Send,
  Loader2,
} from 'lucide-react';
import { EventPlan, Contributor } from '../types';
import { requestBespokeIdeas } from '../services/geminiService';

interface IdeasTabProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
  onOpenAIConcierge: (prompt?: string) => void;
  activeContributor: Contributor;
}

export const IdeasTab: React.FC<IdeasTabProps> = ({
  event,
  onUpdateEvent,
  onOpenAIConcierge,
  activeContributor,
}) => {
  const [copiedWording, setCopiedWording] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [customIdeaCategory, setCustomIdeaCategory] = useState<'cocktails' | 'invitations' | 'decor'>('cocktails');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<Array<{ title: string; description: string; subtext: string }>>([]);

  const copyWording = () => {
    navigator.clipboard.writeText(event.personalizedIdeas.invitationWording);
    setCopiedWording(true);
    setTimeout(() => setCopiedWording(false), 2000);
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleGenerateCustomIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingIdeas(true);
    try {
      const ideas = await requestBespokeIdeas(
        customIdeaCategory,
        customPrompt || event.vibe,
        event.eventType
      );
      setGeneratedIdeas(ideas);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DFD0] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#9A8257] font-heading">
            Bespoke Inspiration Atelier
          </div>
          <h1 className="text-3xl font-heading text-[#1F1C18]">Personalised Ideas & Aesthetics</h1>
          <p className="text-xs font-editorial text-[#786E60] mt-1">
            Poetic invitation scripts, heirloom touches, signature libations, and acoustic soundscapes.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onOpenAIConcierge(
              `Curate 3 heirloom-quality touches for our "${event.eventType}" celebration (${event.vibe}) that will make guests feel profoundly welcomed and cherished.`
            )
          }
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25221F] hover:bg-[#38332E] text-[#FAF8F5] text-xs font-editorial transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D1B685]" />
          <span>Curate with Atelier AI</span>
        </button>
      </div>

      {/* Invitation Wording Card (Opulent calligraphic paper styling) */}
      <div className="paper-card-elevated p-8 sm:p-12 border border-[#DFD5C4] relative overflow-hidden bg-[#FDFBF7]">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="text-xs uppercase tracking-widest text-[#9A8257] font-heading">
            Formal Stationery Suite Wording
          </div>

          <div className="py-2">
            <h2 className="font-heading text-2xl sm:text-3xl text-[#1E1C19] mb-3">
              The Honour of Your Company
            </h2>
            <p className="font-script text-2xl sm:text-3xl text-[#5A4F41] leading-relaxed italic">
              {event.personalizedIdeas.invitationWording}
            </p>
          </div>

          <div className="text-xs font-editorial text-[#7E7364] flex items-center justify-center gap-2">
            <span>Inscribed on 600gsm Deckled Cotton Rag</span>
            <span>•</span>
            <span>Engraved Charcoal Slate Ink</span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={copyWording}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#CDBFA9] bg-[#FFFFFF] hover:bg-[#F5EFE5] text-[#3D352B] text-xs font-editorial transition-colors shadow-xs"
            >
              {copiedWording ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Wording Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#9A8257]" />
                  <span>Copy Calligraphy Wording</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Color Palette Swatches */}
      <div className="paper-card p-6 border border-[#E6DFD2] space-y-4">
        <div className="flex items-center justify-between border-b border-[#EFE8DD] pb-3">
          <div>
            <h2 className="font-heading text-xl text-[#201D1A]">Bespoke Chromatic Harmony</h2>
            <p className="text-xs font-editorial text-[#7A7062]">
              Understated natural tones inspired by heritage stone, old linen, and aged brass
            </p>
          </div>
          <span className="text-xs font-editorial text-[#9A8257]">
            Click any swatch to copy HEX
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {event.palette.map((swatch) => (
            <button
              key={swatch.name}
              type="button"
              onClick={() => copyHex(swatch.hex)}
              className="group p-4 border border-[#E6DFD2] bg-white hover:border-[#9A8257] transition-all text-left space-y-3"
            >
              <div
                className="w-full h-16 rounded-none border border-black/5 shadow-inner"
                style={{ backgroundColor: swatch.hex }}
              />
              <div>
                <div className="font-editorial text-xs font-bold text-[#201D1A]">
                  {swatch.name}
                </div>
                <div className="text-[10px] text-[#7E7466] font-sans flex items-center justify-between mt-0.5">
                  <span>{swatch.hex}</span>
                  <span className="text-[9px] uppercase tracking-wider text-[#9A8257]">
                    {swatch.role}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Signature Libations & Acoustic Playlist (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Signature Libations */}
        <div className="paper-card p-6 border border-[#E6DFD2] space-y-5">
          <div className="flex items-center gap-2 border-b border-[#EFE8DD] pb-3">
            <Wine className="w-4 h-4 text-[#9A8257]" />
            <h2 className="font-heading text-xl text-[#201D1A]">Signature Libations & Aperitifs</h2>
          </div>

          <div className="space-y-4">
            {event.personalizedIdeas.signatureDrinks.map((drink, i) => (
              <div
                key={i}
                className="p-4 bg-[#FAF7F2] border border-[#EAE2D4] space-y-1.5"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-editorial text-base font-bold text-[#2A251F]">
                    {drink.name}
                  </h3>
                  <span className="font-script text-base text-[#9A8257]">
                    Glassware: Cut Crystal
                  </span>
                </div>
                <div className="text-xs text-[#5E5446] font-editorial italic">
                  Ingredients: {drink.ingredients}
                </div>
                <p className="text-xs text-[#7A7061] font-sans leading-relaxed pt-1">
                  {drink.story}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Acoustic & Chamber Soundscape */}
        <div className="paper-card p-6 border border-[#E6DFD2] space-y-5">
          <div className="flex items-center gap-2 border-b border-[#EFE8DD] pb-3">
            <Music className="w-4 h-4 text-[#9A8257]" />
            <h2 className="font-heading text-xl text-[#201D1A]">Curated Acoustic Soundscape</h2>
          </div>

          <div className="space-y-2.5">
            {event.personalizedIdeas.acousticPlaylist.map((track, i) => (
              <div
                key={i}
                className="p-3 bg-white border border-[#EFEAE0] flex items-center justify-between text-xs font-editorial"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-right font-mono text-[#9A8257] text-[11px]">
                    0{i + 1}
                  </span>
                  <span className="text-[#2C2721] font-medium">{track}</span>
                </div>
                <span className="text-[10px] text-[#867B6E] font-sans">Acoustic / Vinyl</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#E8DEC9] text-xs font-editorial text-[#6F6455] flex items-center justify-between">
            <span>Heirloom Favors: {event.personalizedIdeas.guestFavors}</span>
            <Gift className="w-4 h-4 text-[#9A8257] flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* GenAI Bespoke Studio Prompt Box */}
      <div className="paper-card-elevated p-8 border border-[#DFD6C7] bg-[#FCFAF7] space-y-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#9A8257] font-heading">
            Atelier AI Generator
          </div>
          <h2 className="font-heading text-2xl text-[#1E1C19]">Generate Custom Aesthetic Concepts</h2>
          <p className="text-xs font-editorial text-[#786E60] mt-1">
            Prompt Gemini to craft bespoke cocktail recipes, invitation wording variations, or botanical styling cues.
          </p>
        </div>

        <form onSubmit={handleGenerateCustomIdeas} className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-editorial text-[#5E5346]">Concept Category:</label>
            <div className="flex gap-2">
              {(['cocktails', 'invitations', 'decor'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCustomIdeaCategory(cat)}
                  className={`px-3 py-1 text-xs font-editorial capitalize transition-colors ${
                    customIdeaCategory === cat
                      ? 'bg-[#9A8257] text-white'
                      : 'bg-[#F4EEE4] text-[#4E4437] hover:bg-[#EAE0D1]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Describe your specific nuance (e.g. "Tuscan late-harvest vineyard mood with figs and aged port")...`}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white border border-[#DDD3C2] text-xs font-sans focus:outline-hidden focus:border-[#9A8257]"
            />
            <button
              type="submit"
              disabled={isGeneratingIdeas}
              className="px-5 py-2.5 bg-[#25221F] hover:bg-[#3A342E] text-[#FAF8F5] text-xs font-editorial flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isGeneratingIdeas ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D1B685]" />
                  <span>Curating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#D1B685]" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Render Generated Custom Ideas */}
        {generatedIdeas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EFEAE0]">
            {generatedIdeas.map((idea, i) => (
              <div
                key={i}
                className="p-4 bg-white border border-[#E9DFCF] space-y-2 shadow-xs"
              >
                <div className="font-editorial text-base font-bold text-[#221F1B]">
                  {idea.title}
                </div>
                <p className="text-xs text-[#6E6456] font-sans leading-relaxed">
                  {idea.description}
                </p>
                <div className="text-[10px] text-[#9A8257] font-editorial pt-1 border-t border-[#F5EFE5]">
                  {idea.subtext}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
