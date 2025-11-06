import {
  Sparkles,
  Shirt,
  Wand2,
  MessageCircle,
  ShoppingBag,
  Palette,
  BookOpen,
  Crown,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { UserProfile } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DashboardProps {
  userProfile: UserProfile;
  isPro: boolean;
  wardrobeCount: number;
  onNavigate: (page: string) => void;
}

export function Dashboard({
  userProfile,
  isPro,
  wardrobeCount,
  onNavigate,
}: DashboardProps) {
  const greeting = () => {
    return "Welcome Back";
  };

  const features = [
    {
      icon: Shirt,
      title: "Digital Wardrobe",
      description: `${wardrobeCount} items uploaded`,
      color: "bg-slate-100 text-slate-700",
      page: "wardrobe",
    },
    {
      icon: Wand2,
      title: "Wardrobe Assist",
      description: "AI outfit generator",
      color: "bg-rose-100 text-rose-800",
      page: "assist",
    },
    {
      icon: MessageCircle,
      title: "AI Fashion Chat",
      description: isPro ? "Unlimited access" : "Pro feature",
      color: "bg-amber-100 text-amber-800",
      page: "chat",
      requiresPro: true,
    },
    {
      icon: ShoppingBag,
      title: "ShopperAI",
      description: "Coming soon",
      color: "bg-blue-100 text-blue-700",
      page: "shopper",
    },
    {
      icon: Palette,
      title: "MakeupAI",
      description: "Coming soon",
      color: "bg-rose-100 text-rose-700",
      page: "makeup",
    },
  ];

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-900 to-amber-900 text-white px-6 pt-12 pb-32 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1707161540228-4a0b48c54cfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduZXIlMjBzdHVkaW98ZW58MXx8fHwxNzYwNjc5MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20"
        />

        <div className="relative z-10 flex items-start justify-between mb-8">
          <div>
            <p className="text-white/80 mb-1">Hello there!</p>
            <h1 className="text-white">{greeting()}</h1>
          </div>

          {isPro ? (
            <Badge className="bg-amber-500 text-slate-900 border-0 px-3 py-1.5">
              <Crown className="w-4 h-4 mr-1" />
              Pro
            </Badge>
          ) : (
            <Button
              onClick={() => onNavigate("subscription")}
              size="sm"
              variant="secondary"
              className="bg-amber-100/20 hover:bg-amber-100/30 text-white border-0"
            >
              Upgrade to Pro
            </Button>
          )}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-white/90">
              AI Styling Tip
            </span>
          </div>
          <p className="text-white text-lg">
            "Confidence is the best outfit. Rock it and own it."
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 -mt-20 relative z-10 mb-8">
        <Card className="p-6 bg-white shadow-lg">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-slate-900 mb-1">
                {wardrobeCount}
              </div>
              <p className="text-slate-600 text-sm">
                Wardrobe Items
              </p>
            </div>
            <div className="text-center border-x border-slate-200">
              <div className="text-rose-800 mb-1">
                {isPro ? "∞" : "2"}
              </div>
              <p className="text-slate-600 text-sm">
                Daily Picks
              </p>
            </div>
            <div className="text-center">
              <div className="text-amber-800 mb-1">
                {isPro ? "Pro" : "Free"}
              </div>
              <p className="text-slate-600 text-sm">Plan</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="px-6">
        <h2 className="mb-6 text-slate-900">
          Explore Features
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-5 hover:shadow-lg transition-shadow cursor-pointer relative"
              onClick={() => {
                if (feature.requiresPro && !isPro) {
                  onNavigate("subscription");
                } else {
                  onNavigate(feature.page);
                }
              }}
            >
              {feature.requiresPro && !isPro && (
                <div className="absolute top-2 right-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}
              >
                <feature.icon className="w-6 h-6" />
              </div>

              <h3 className="mb-1 text-slate-900">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Fashion Tips Banner */}
      <div className="px-6 mt-8">
        <div
          className="bg-gradient-to-br from-slate-900 via-rose-900 to-amber-900 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => onNavigate("tips")}
        >
          <div className="relative h-48">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758900727878-f7c5e90ed171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGluZyUyMHRpcHN8ZW58MXx8fHwxNzYwNjk1NzAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Fashion Tips"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          </div>
          <div className="relative -mt-24 px-6 pb-6 z-10">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-6 h-6 text-amber-300" />
              <h3 className="text-white">
                Fashion Tips & Guides
              </h3>
            </div>
            <p className="text-white/90 text-sm mb-4">
              Discover expert styling advice, trend insights,
              and fashion inspiration to elevate your wardrobe
            </p>
            <Button
              size="sm"
              className="bg-amber-100 text-slate-900 hover:bg-amber-200"
            >
              Explore Articles
            </Button>
          </div>
        </div>
      </div>

      {/* Upgrade Banner */}
      {!isPro && (
        <div className="px-6 mt-8">
          <div
            className="bg-gradient-to-r from-slate-900 to-amber-900 rounded-2xl p-6 text-white cursor-pointer shadow-lg"
            onClick={() => onNavigate("subscription")}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white mb-2">
                  Upgrade to Pro
                </h3>
                <p className="text-white/90 text-sm mb-3">
                  Unlock unlimited AI features, wardrobe
                  storage, and personalized styling
                </p>
              </div>
              <Crown className="w-8 h-8 text-amber-300" />
            </div>
            <Button
              size="sm"
              className="bg-amber-100 text-slate-900 hover:bg-amber-200"
            >
              Get Pro for ₹149/month
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}