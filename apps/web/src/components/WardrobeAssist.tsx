import { useState } from 'react';
import { ArrowLeft, Wand2, Sparkles, Crown, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { WardrobeItem } from '../App';

interface WardrobeAssistProps {
  wardrobeItems: WardrobeItem[];
  onNavigate: (page: string) => void;
}

export function WardrobeAssist({ wardrobeItems, onNavigate }: WardrobeAssistProps) {
  const [generatedOutfit, setGeneratedOutfit] = useState<WardrobeItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOutfit = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Randomly select 3-4 items from wardrobe
      const shuffled = [...wardrobeItems].sort(() => Math.random() - 0.5);
      const outfit = shuffled.slice(0, Math.min(3, wardrobeItems.length));
      setGeneratedOutfit(outfit);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-600 to-purple-600 text-white px-6 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-white">Wardrobe Assist</h1>
            <p className="text-white/80 text-sm">AI-powered outfit suggestions</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {wardrobeItems.length < 3 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="mb-2">Not Enough Items</h2>
            <p className="text-gray-600 mb-6">
              Add at least 3 items to your wardrobe to generate outfit suggestions
            </p>
            <Button
              onClick={() => onNavigate('wardrobe')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Add Items to Wardrobe
            </Button>
          </div>
        ) : (
          <>
            {/* Generate Button */}
            {generatedOutfit.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="mb-2">Ready to Create Magic?</h2>
                <p className="text-gray-600 mb-8">
                  Let our AI analyze your wardrobe and suggest the perfect outfit for you
                </p>
                <Button
                  onClick={generateOutfit}
                  disabled={isGenerating}
                  size="lg"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Outfit
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Generated Outfit */}
            {generatedOutfit.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="mb-1">Your AI-Generated Outfit</h2>
                    <p className="text-gray-600">Here's what we recommend for you today</p>
                  </div>
                  <Button
                    onClick={generateOutfit}
                    disabled={isGenerating}
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                </div>

                <div className="space-y-4 mb-8">
                  {generatedOutfit.map((item, index) => (
                    <Card key={item.id} className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-purple-600">{index + 1}</span>
                      </div>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="mb-1">{item.name}</p>
                        <p className="text-gray-600 text-sm">{item.category}</p>
                      </div>
                    </Card>
                  ))}
                </div>

                <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="flex gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-1" />
                    <div>
                      <h3 className="mb-2">Styling Tips</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="text-sm">Layer your outfit for a more sophisticated look</li>
                        <li className="text-sm">Add accessories to complete the ensemble</li>
                        <li className="text-sm">Consider the occasion and weather when wearing this outfit</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
