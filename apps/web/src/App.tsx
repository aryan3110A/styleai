import React from "react";
import { useState, useEffect } from "react";
import { WelcomePage } from "./components/WelcomePage";
import { PersonalInfoSetup } from "./components/PersonalInfoSetup";
import { Dashboard } from "./components/Dashboard";
import { Wardrobe } from "./components/Wardrobe";
import { WardrobeAssist } from "./components/WardrobeAssist";
import { AIChatbot, ChatSession, Message } from "./components/AIChatbot";
import { ShopperAI } from "./components/ShopperAI";
import { MakeupAI } from "./components/MakeupAI";
import { FashionTips } from "./components/FashionTips";
import { Profile } from "./components/Profile";
import { Subscription } from "./components/Subscription";
import { BottomNav } from "./components/BottomNav";
import {
  ensureUserId,
  getProfile,
  saveProfile,
  getWardrobe,
  addWardrobeItem,
  deleteWardrobeItem,
  uploadWardrobeImage,
  fetchChatHistory,
} from "./services/api";
import { Auth } from "./components/Auth";
import { onAuthUserChanged } from "./services/auth";

export type UserProfile = {
  age: string;
  height: string;
  gender: string;
  bodyType: string;
  skinTone: string;
  photo?: string;
};

export type WardrobeItem = {
  id: string;
  category: string;
  image: string;
  name: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("welcome");
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [dailyPicks, setDailyPicks] = useState(2);
  const [showThankYou, setShowThankYou] = useState(false);

  // Chat sessions state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatSessionId, setCurrentChatSessionId] = useState<
    string | null
  >(null);

  // Reset daily picks at midnight
  // Watch auth and keep token persisted (service handles localStorage)
  useEffect(() => {
    const unsub = onAuthUserChanged((u) => setIsAuthed(!!u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      if (!isPro) {
        setDailyPicks(2);
      }
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, [isPro]);

  const handleSignup = () => {
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      setCurrentPage("setup");
    }, 2000);
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentPage("dashboard");
  };

  const handleEditProfile = () => {
    setCurrentPage("edit-profile");
  };

  const handleUpdateProfile = async (profile: UserProfile) => {
    const userId = ensureUserId();
    try {
      await saveProfile({
        userId,
        gender: profile.gender,
        heightRange: profile.height,
        bodyType: profile.bodyType,
        skinTone: profile.skinTone,
      });
    } catch {}
    setUserProfile(profile);
    setCurrentPage("profile");
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      setUserProfile(null);
      setIsPro(false);
      setWardrobeItems([]);
      setDailyPicks(2);
      setChatSessions([]);
      setCurrentChatSessionId(null);
      setCurrentPage("welcome");
    }
  };

  // Chat session handlers
  const createNewChatSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [
        {
          id: "1",
          text: "Hello! I'm your personal AI fashion stylist. How can I help you look amazing today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Keep only the 2 most recent sessions (so with the new one, we have 3 total)
    const updatedSessions = [newSession, ...chatSessions].slice(0, 3);
    setChatSessions(updatedSessions);
    setCurrentChatSessionId(newSession.id);
  };

  const switchChatSession = (sessionId: string) => {
    setCurrentChatSessionId(sessionId);
  };

  const deleteChatSession = (sessionId: string) => {
    const updatedSessions = chatSessions.filter((s) => s.id !== sessionId);
    setChatSessions(updatedSessions);

    // If we deleted the current session, switch to the first available or create new
    if (sessionId === currentChatSessionId) {
      if (updatedSessions.length > 0) {
        setCurrentChatSessionId(updatedSessions[0].id);
      } else {
        setCurrentChatSessionId(null);
      }
    }
  };

  const updateChatSession = (sessionId: string, messages: Message[]) => {
    setChatSessions((prevSessions) => {
      const updated = prevSessions.map((session) => {
        if (session.id === sessionId) {
          // Generate title from first user message if still "New Chat"
          let title = session.title;
          if (title === "New Chat" && messages.length > 1) {
            const firstUserMsg = messages.find((m) => m.sender === "user");
            if (firstUserMsg) {
              title =
                firstUserMsg.text.length > 40
                  ? firstUserMsg.text.substring(0, 40) + "..."
                  : firstUserMsg.text;
            }
          }

          return {
            ...session,
            title,
            messages,
            updatedAt: new Date(),
          };
        }
        return session;
      });

      // Sort by most recent update and keep only the 3 most recent
      return updated
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 3);
    });
  };

  // Initialize chat session when user navigates to chat page
  useEffect(() => {
    if (currentPage === "chat" && isPro && chatSessions.length === 0) {
      createNewChatSession();
    }
  }, [currentPage, isPro]);

  const handleAddWardrobeItem = async (item: WardrobeItem) => {
    const userId = ensureUserId();
    let imageUrl: string | undefined = undefined;
    if (item.image && item.image.startsWith("data:")) {
      try {
        const up = await uploadWardrobeImage(userId, item.image);
        imageUrl = up.url;
      } catch {}
    }
    try {
      await addWardrobeItem(userId, {
        name: item.name,
        category: item.category,
        imageUrl,
      });
    } catch {}
    setWardrobeItems([
      ...wardrobeItems,
      { ...item, image: imageUrl || item.image },
    ]);
  };

  const handleDeleteWardrobeItem = async (id: string) => {
    const userId = ensureUserId();
    try {
      await deleteWardrobeItem(userId, id);
    } catch {}
    setWardrobeItems(wardrobeItems.filter((item) => item.id !== id));
  };

  const handleUpgradeToPro = () => {
    setIsPro(true);
    setCurrentPage("dashboard");
  };
  // Initial fetch of profile and wardrobe
  useEffect(() => {
    const userId = ensureUserId();
    (async () => {
      try {
        const p = await getProfile(userId);
        if (p && typeof p === "object" && !("error" in p)) {
          const mapped: UserProfile = {
            age: (p.age || "").toString(),
            height: p.heightRange || "",
            gender: p.gender || "",
            bodyType: p.bodyType || "",
            skinTone: p.skinTone || "",
            photo: p.imageUrl,
          };
          setUserProfile(mapped);
        }
      } catch {}
      try {
        const w = await getWardrobe(userId);
        const items = (w.items || []).map((it) => ({
          id: it.id,
          category: it.category,
          image: it.imageUrl || "",
          name: it.name,
        })) as WardrobeItem[];
        setWardrobeItems(items);
      } catch {}
    })();
  }, []);

  // Load chat history when entering chat and no sessions
  useEffect(() => {
    if (currentPage === "chat" && chatSessions.length === 0) {
      const userId = ensureUserId();
      (async () => {
        try {
          const hist = await fetchChatHistory(userId);
          const messages: Message[] = [];
          (hist.chats || [])
            .slice()
            .reverse()
            .forEach((entry: any) => {
              if (entry.message)
                messages.push({
                  id: `${entry.timestamp?.seconds || Date.now()}-u`,
                  text: entry.message,
                  sender: "user",
                  timestamp: new Date(),
                });
              if (entry.response?.reply)
                messages.push({
                  id: `${entry.timestamp?.seconds || Date.now()}-a`,
                  text: entry.response.reply,
                  sender: "ai",
                  timestamp: new Date(),
                });
            });
          if (messages.length > 0) {
            const session: ChatSession = {
              id: Date.now().toString(),
              title: "History",
              messages,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            setChatSessions([session]);
            setCurrentChatSessionId(session.id);
          } else {
            createNewChatSession();
          }
        } catch {
          createNewChatSession();
        }
      })();
    }
  }, [currentPage]);

  const handleGenerateOutfit = () => {
    if (!isPro && dailyPicks <= 0) {
      return false;
    }
    if (!isPro) {
      setDailyPicks(dailyPicks - 1);
    }
    return true;
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-900 to-amber-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-bounce mb-4">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <p className="text-amber-100 opacity-90">Welcome to StylieAI</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return <Auth onAuthenticated={() => setCurrentPage("dashboard")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === "welcome" && <WelcomePage onSignup={handleSignup} />}

      {currentPage === "setup" && (
        <PersonalInfoSetup onComplete={handleProfileComplete} />
      )}

      {currentPage === "edit-profile" && userProfile && (
        <PersonalInfoSetup
          onComplete={handleUpdateProfile}
          initialProfile={userProfile}
        />
      )}

      {currentPage !== "welcome" &&
        currentPage !== "setup" &&
        currentPage !== "edit-profile" && (
          <>
            {currentPage === "dashboard" && (
              <Dashboard
                userProfile={userProfile!}
                isPro={isPro}
                wardrobeCount={wardrobeItems.length}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === "wardrobe" && (
              <Wardrobe
                items={wardrobeItems}
                isPro={isPro}
                onAddItem={handleAddWardrobeItem}
                onDeleteItem={handleDeleteWardrobeItem}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === "assist" && (
              <WardrobeAssist
                wardrobeItems={wardrobeItems}
                isPro={isPro}
                dailyPicks={dailyPicks}
                onGenerate={handleGenerateOutfit}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === "chat" && (
              <AIChatbot
                isPro={isPro}
                onNavigate={setCurrentPage}
                chatSessions={chatSessions}
                currentSessionId={currentChatSessionId}
                onCreateSession={createNewChatSession}
                onSwitchSession={switchChatSession}
                onDeleteSession={deleteChatSession}
                onUpdateSession={updateChatSession}
              />
            )}

            {currentPage === "shopper" && (
              <ShopperAI onNavigate={setCurrentPage} />
            )}

            {currentPage === "makeup" && (
              <MakeupAI onNavigate={setCurrentPage} />
            )}

            {currentPage === "tips" && (
              <FashionTips onNavigate={setCurrentPage} />
            )}

            {currentPage === "profile" && (
              <Profile
                userProfile={userProfile!}
                isPro={isPro}
                onNavigate={setCurrentPage}
                onEditProfile={handleEditProfile}
                onLogout={handleLogout}
              />
            )}

            {currentPage === "subscription" && (
              <Subscription
                isPro={isPro}
                onUpgrade={handleUpgradeToPro}
                onNavigate={setCurrentPage}
              />
            )}

            <BottomNav
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              isPro={isPro}
            />
          </>
        )}
    </div>
  );
}
