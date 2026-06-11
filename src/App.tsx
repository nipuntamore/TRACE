import React, { useState, useEffect } from 'react';
import { QuizProfile, CarbonLog, Challenge, Achievement, LeaderboardUser } from './types';
import { 
  INITIAL_CHALLENGES, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_LEADERBOARD, 
  calculateDailyCO2 
} from './utils';

// Import our modular subcomponents
import Quiz from './components/Quiz';
import Dashboard from './components/Dashboard';
import ActionHub from './components/ActionHub';
import Insights from './components/Insights';
import EcoCoach from './components/EcoCoach';
import NotificationDrawer from './components/NotificationDrawer';
import TraceLogo from './components/TraceLogo';

import { 
  Leaf, 
  Flame, 
  Sparkles, 
  Tractor, 
  TrendingDown, 
  PlayCircle, 
  LogOut,
  Sparkle,
  Layers,
  HeartHandshake,
  Award,
  BellRing,
  Info,
  CalendarCheck,
  CheckCircle,
  HelpCircle,
  BrainCircuit,
  MessageSquareShare,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Navigation View: 'onboarding' is governed by layout
  const [activeTab, setActiveTab] = useState<'dashboard' | 'actions' | 'insights' | 'coach'>('dashboard');
  
  // Local persistent states
  const [profile, setProfile] = useState<QuizProfile | null>(null);
  const [carbonLogs, setCarbonLogs] = useState<CarbonLog[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  
  const [communityTotalSaved, setCommunityTotalSaved] = useState(245.5);
  const [streak, setStreak] = useState(1);
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'achievement' | 'social' | 'success' }[]>([]);
  const [confirmAction, setConfirmAction] = useState<'reset_logs' | 'reset_profile' | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<{ id: string; msg: string; type: string; timestamp: string }[]>([]);
  
  // Notification Drawer status tracking
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 1. Initial State Hydration from local localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('trace_profile_info');
      const savedLogs = localStorage.getItem('trace_carbon_logs');
      const savedChallenges = localStorage.getItem('trace_user_challenges');
      const savedAchievements = localStorage.getItem('trace_user_badges');
      const savedStreak = localStorage.getItem('trace_user_streak');
      const savedLeaderboard = localStorage.getItem('trace_leaderboard_standings');
      const savedCommunityTotal = localStorage.getItem('trace_community_co2_saved');
      const savedHistory = localStorage.getItem('trace_notification_history');

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      
      if (savedLogs) {
        setCarbonLogs(JSON.parse(savedLogs));
      } else {
        // Prepopulate with mock historic logging data so Insights graph looks beautiful out of the box!
        const initialMockLogs: CarbonLog[] = [
          { id: 'm1', date: '2026-06-05', commuteKm: 24, meatMeals: 2, energyRating: 5, wasteRecycled: true, co2Total: 12.5 },
          { id: 'm2', date: '2026-06-06', commuteKm: 29, meatMeals: 3, energyRating: 6, wasteRecycled: false, co2Total: 14.2 },
          { id: 'm3', date: '2026-06-07', commuteKm: 19, meatMeals: 1, energyRating: 4, wasteRecycled: true, co2Total: 8.5 },
          { id: 'm4', date: '2026-06-08', commuteKm: 8, meatMeals: 0, energyRating: 3, wasteRecycled: true, co2Total: 5.8 },
          { id: 'm5', date: '2026-06-09', commuteKm: 16, meatMeals: 1, energyRating: 5, wasteRecycled: true, co2Total: 9.0 },
          { id: 'm6', date: '2026-06-10', commuteKm: 13, meatMeals: 0, energyRating: 3, wasteRecycled: true, co2Total: 6.2 },
        ];
        setCarbonLogs(initialMockLogs);
        localStorage.setItem('trace_carbon_logs', JSON.stringify(initialMockLogs));
      }

      if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
      if (savedAchievements) {
        const parsed: Achievement[] = JSON.parse(savedAchievements);
        const merged = INITIAL_ACHIEVEMENTS.map(staticAch => {
          const match = parsed.find(pa => pa.id === staticAch.id);
          return match ? { ...staticAch, unlocked: match.unlocked, unlockedAt: match.unlockedAt } : staticAch;
        });
        setAchievements(merged);
        localStorage.setItem('trace_user_badges', JSON.stringify(merged));
      }
      if (savedStreak) setStreak(parseInt(savedStreak));
      if (savedLeaderboard) setLeaderboard(JSON.parse(savedLeaderboard));
      if (savedCommunityTotal) setCommunityTotalSaved(parseFloat(savedCommunityTotal));
      if (savedHistory) setNotificationHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.warn("Storage restore error:", e);
    }
  }, []);

  // 2. Local State synchronization triggers
  const triggerToast = (msg: string, type: 'achievement' | 'social' | 'success' = 'success') => {
    // Prevent double notifications on the exact same message within 400ms (avoids strict mode double calls)
    const now = Date.now();
    const lastTrigger = (window as any)._lastToastTrigger || { msg: '', time: 0 };
    if (lastTrigger.msg === msg && now - lastTrigger.time < 400) {
      return;
    }
    (window as any)._lastToastTrigger = { msg, time: now };

    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, msg, type }]);
    
    const newNotice = {
      id,
      msg,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setNotificationHistory(prev => {
      // De-duplicate if last element in history was identical to avoid multiple copies
      if (prev.length > 0 && prev[0].msg === msg) {
        return prev;
      }
      const updated = [newNotice, ...prev].slice(0, 15);
      localStorage.setItem('trace_notification_history', JSON.stringify(updated));
      return updated;
    });

    // Increment unread count if the alert panel drawer is not currently open
    setUnreadCount(prev => prev + 1);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // 3. User completing Quiz Onboarding
  const handleOnboardingComplete = (quizAnswers: QuizProfile) => {
    setProfile(quizAnswers);
    localStorage.setItem('trace_profile_info', JSON.stringify(quizAnswers));
    
    // Clear prepopulated mock logs so Trends & Impact start new after onboarding
    setCarbonLogs([]);
    localStorage.setItem('trace_carbon_logs', JSON.stringify([]));
    
    // Unlock eco-pioneer achievement
    unlockAward('pioneer', "Pioneer Badge Unlocked: Created your personalized climate profile!");
    
    // Save streak starts at 1
    setStreak(1);
    localStorage.setItem('trace_user_streak', "1");

    triggerToast("Lifestyle diagnostic successfully calibrated! Welcome to TRACE.", "success");
    setActiveTab('dashboard');
  };

  // 4. Submit Carbon logs
  const handleCarbonLogSubmit = (logInfo: Omit<CarbonLog, 'id' | 'co2Total'>) => {
    if (!profile) return;
    
    // Calculate total emissions matching profile and log factors
    const co2Total = calculateDailyCO2(
      logInfo.commuteKm,
      logInfo.meatMeals,
      logInfo.energyRating,
      logInfo.wasteRecycled,
      profile
    );

    const newLog: CarbonLog = {
      id: Math.random().toString(36).substr(2, 9),
      ...logInfo,
      co2Total
    };

    // Filter existing logs of the same date
    const updatedLogs = [...carbonLogs.filter(l => l.date !== logInfo.date), newLog];
    setCarbonLogs(updatedLogs);
    localStorage.setItem('trace_carbon_logs', JSON.stringify(updatedLogs));

    // Handle habit streak dynamics
    const oldStreak = streak;
    let newStreak = oldStreak;
    if (carbonLogs.filter(l => l.date === logInfo.date).length === 0) {
      newStreak = oldStreak + 1;
      setStreak(newStreak);
      localStorage.setItem('trace_user_streak', newStreak.toString());
      
      // Upgrade leaderboards streak as well
      setLeaderboard(prev => prev.map(u => u.isCurrentUser ? { ...u, streak: newStreak } : u));
    }

    // Badge diagnostics evaluations
    unlockAward('habit-builder', "Footprint Scout unlocked: Logged your daily activities!");
    
    if (newStreak >= 3) {
      unlockAward('streak-champion', "Streak Champion unlocked: Logged footprint for 3 consecutive days!");
    }

    triggerToast("Your daily carbon report is logged and offsets updated!", "success");
  };

  // 5. Challenges accept/decline action
  const handleToggleChallengeActive = (id: string) => {
    const updated = challenges.map(c => {
      if (c.id === id) {
        const nextState = !c.active;
        if (nextState) {
          triggerToast(`Accepted Challenge: ${c.title}. Go get it!`, 'success');
        } else {
          triggerToast(`Abandoned Challenge: ${c.title}`, 'success');
        }
        return { ...c, active: nextState };
      }
      return c;
    });
    setChallenges(updated);
    localStorage.setItem('trace_user_challenges', JSON.stringify(updated));
  };

  // 6. Complete a Challenge card
  const handleCompleteChallenge = (id: string) => {
    const current = challenges.find(c => c.id === id);
    if (!current) return;

    // Complete challenge state
    const updatedChallenges = challenges.map(c => c.id === id ? { ...c, completed: true, active: false } : c);
    setChallenges(updatedChallenges);
    localStorage.setItem('trace_user_challenges', JSON.stringify(updatedChallenges));

    // Accumulate total offset avoided to user score on leaderboard
    const userOffsetIncrement = current.co2Saved;
    let newTotalSaved = 0;

    const updatedLeaderboard = leaderboard.map(u => {
      if (u.isCurrentUser) {
        newTotalSaved = u.totalSavedCo2 + userOffsetIncrement;
        // Map user levels: level raises by 1 for every 10kg saved
        const newLevel = 1 + Math.floor(newTotalSaved / 10);
        
        if (newLevel > u.level) {
          triggerToast(`🎉 Level Up! You reached Level ${newLevel} eco climber!`, 'success');
        }

        return { 
          ...u, 
          totalSavedCo2: parseFloat(newTotalSaved.toFixed(1)),
          level: newLevel
        };
      }
      return u;
    });

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('trace_leaderboard_standings', JSON.stringify(updatedLeaderboard));

    // Badge diagnostics evaluations
    unlockAward('action-hero', "First Carbon Cut Unlocked: Completed your first challenge!");
    
    if (newTotalSaved >= 20.0) {
      unlockAward('earth-guardian', "Planet Custodian Unlocked: Saved more than 20kg of CO2 offsets!");
    }

    // New Achievements for challenge counts and categories
    const completedChallenges = updatedChallenges.filter(c => c.completed);
    const completedCount = completedChallenges.length;
    
    const completedTransport = completedChallenges.filter(c => c.category === 'transport').length;
    const completedEnergy = completedChallenges.filter(c => c.category === 'energy').length;
    const completedWaste = completedChallenges.filter(c => c.category === 'waste').length;
    const completedFood = completedChallenges.filter(c => c.category === 'food').length;

    if (completedTransport >= 2) {
      unlockAward('transit-trailblazer', "Transit Trailblazer Unlocked: Mastered low-emission transport!");
    }
    if (completedEnergy >= 2) {
      unlockAward('vampire-slayer', "Vampire Slayer Unlocked: Cut power grid phantom load!");
    }
    if (completedWaste >= 2) {
      unlockAward('zero-waste-champion', "Zero-Waste Champion Unlocked: Prevented landfill waste!");
    }
    if (completedFood >= 1) {
      unlockAward('green-gourmand', "Green Gourmand Unlocked: Completed a food emission cut!");
    }
    if (completedCount >= 3) {
      unlockAward('triple-threat', "Triple Threat Eco Warrior Unlocked: Finished 3 distinct challenges!");
    }
    if (completedCount >= 5) {
      unlockAward('decarbon-titan', "Decarbonization Titan Unlocked: Completed 5 solid action challenges!");
    }

    // Update community offsets metrics
    setCommunityTotalSaved(prev => {
      const nextCommTotal = prev + userOffsetIncrement;
      localStorage.setItem('trace_community_co2_saved', nextCommTotal.toString());
      return nextCommTotal;
    });

    triggerToast(`Completed ${current.title}! Saved ${current.co2Saved}kg CO2!`, 'success');
  };

  // 7. General helper to unlock Achievements
  const unlockAward = (id: string, message: string) => {
    // Check upper achievements state to see if already unlocked – prevents double-invoking triggerToast
    const isAlreadyUnlocked = achievements.find(a => a.id === id)?.unlocked;
    if (isAlreadyUnlocked) return;

    triggerToast(message, 'achievement');

    setAchievements(prev => {
      const next = prev.map(a => a.id === id 
        ? { ...a, unlocked: true, unlockedAt: new Date().toLocaleDateString() } 
        : a
      );
      localStorage.setItem('trace_user_badges', JSON.stringify(next));
      return next;
    });
  };

  const handleClearNotifications = () => {
    setNotificationHistory([]);
    localStorage.removeItem('trace_notification_history');
    triggerToast("Notification feed history cleared.", "success");
  };

  const handleDeleteLog = (id: string) => {
    const updated = carbonLogs.filter(l => l.id !== id);
    setCarbonLogs(updated);
    localStorage.setItem('trace_carbon_logs', JSON.stringify(updated));
    triggerToast("Logged carbon footprint entry removed.", "success");
  };

  // Reset sandbox configuration helpers
  const handleResetLogsOnly = () => {
    const emptyLogs: CarbonLog[] = [];
    setCarbonLogs(emptyLogs);
    localStorage.setItem('trace_carbon_logs', JSON.stringify(emptyLogs));
    setStreak(1);
    localStorage.setItem('trace_user_streak', '1');
    
    // Revert achievements: keep pioneer unlocked if user has profile, lock everything else
    const resetAchievements = INITIAL_ACHIEVEMENTS.map(a => {
      if (a.id === 'pioneer' && profile) {
        return { ...a, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
      }
      return { ...a, unlocked: false, unlockedAt: undefined };
    });
    setAchievements(resetAchievements);
    localStorage.setItem('trace_user_badges', JSON.stringify(resetAchievements));
    
    // Update leaderboard user streak
    setLeaderboard(prev => prev.map(u => u.isCurrentUser ? { ...u, streak: 1 } : u));
    
    // Set single reset notification in history
    const resetNotice = {
      id: Math.random().toString(36).substr(2, 9),
      msg: "Carbon footprint logs reset successfully. Feel free to start fresh logs!",
      type: "success",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotificationHistory([resetNotice]);
    localStorage.setItem('trace_notification_history', JSON.stringify([resetNotice]));

    triggerToast("Carbon footprint logs cleared successfully. Start fresh logging of actions!", "success");
    setConfirmAction(null);
  };

  const handleResetApplicationState = () => {
    localStorage.clear();
    setProfile(null);
    setCarbonLogs([]);
    setChallenges(INITIAL_CHALLENGES);
    setAchievements(INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false, unlockedAt: undefined })));
    setStreak(1);
    setLeaderboard(INITIAL_LEADERBOARD);
    setCommunityTotalSaved(245.5);
    setNotificationHistory([]);
    setActiveTab('dashboard');
    triggerToast("Application metrics successfully reset to fresh sandbox state.", "success");
    setConfirmAction(null);
  };

  return (
    <div className="min-h-screen bg-[#F2F5F0] flex flex-col font-sans relative" id="trace-applet-root">
      
      {/* Toast notifications drawer container */}
      <div className="fixed top-5 right-5 space-y-3 z-50 pointer-events-none max-w-sm w-full" id="toasts-drawer">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-[1.5rem] shadow-xl border flex items-start gap-3 transform translate-y-0 transition-transform duration-350 pointer-events-auto bg-white ${
              toast.type === 'achievement' 
                ? 'border-amber-200 bg-amber-50/95 text-amber-900 shadow-amber-200/10' 
                : toast.type === 'social'
                ? 'border-emerald-250 bg-[#D8F3DC] text-[#1B4332]'
                : 'border-[#B7E4C7] bg-[#F2F5F0] text-[#1B4332]'
            }`}
          >
            {toast.type === 'achievement' ? (
              <Award className="w-5 h-5 text-amber-500 fill-amber-500/25 shrink-0 animate-bounce" />
            ) : toast.type === 'social' ? (
              <HeartHandshake className="w-5 h-5 text-[#2D6A4F] shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-[#2D6A4F] shrink-0" />
            )}
            <div className="space-y-0.5">
              <span className="text-xs font-black font-mono tracking-wider opacity-80 block uppercase">
                {toast.type === 'achievement' ? 'ACHIEVEMENT UNLOCKED' : toast.type === 'social' ? 'CHEERLEADER UPDATE' : 'TRACE NOTIFICATION'}
              </span>
              <p className="text-xs font-semibold leading-relaxed font-sans">{toast.msg}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Global Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-[#D8E2D1] shadow-sm" id="global-header">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Logo element */}
          <TraceLogo />

          {/* Collectives Passive statistics row metrics */}
          <div className="flex items-center gap-4 justify-between sm:justify-end">
            
            {/* Interactive Notification Bell Button */}
            {profile && (
              <button
                onClick={() => {
                  setIsNotificationOpen(true);
                  setUnreadCount(0);
                }}
                className="relative p-2 rounded-xl bg-white hover:bg-[#F2F5F0] border border-[#D8E2D1] text-[#2D6A4F] hover:text-[#1B4332] transition-all cursor-pointer shadow-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#52B788]/30"
                aria-label="View notifications and alert feed"
                id="header-notification-bell"
              >
                <BellRing className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-600 text-[9px] font-black text-white ring-2 ring-white shadow-sm animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Profile Level metrics */}
            {profile && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] border border-[#B7E4C7] text-[#1B4332] flex items-center justify-center text-sm">
                  🏆
                </div>
                <div>
                  <span className="text-xs font-bold text-[#40916C] uppercase tracking-wider block leading-none">Level {leaderboard.find(u => u.isCurrentUser)?.level || 1}</span>
                  <span className="text-xs font-bold text-[#1B4332] font-display leading-none">Eco Climber</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
        {!profile ? (
          /* Forces Onboarding first if profile does not exist */
          <Quiz onComplete={handleOnboardingComplete} />
        ) : (
          <div className="space-y-6 animate-fade-in">
            
            {/* Primary Tab selector Row inline */}
            <div className="bg-white/60 border border-[#D8E2D1] p-2 rounded-[1.5rem] shadow-sm backdrop-blur-md flex flex-wrap gap-1.5" id="navigation-toolbar">
              {[
                { id: 'dashboard', title: 'Carbon Pulse', icon: <Leaf className="w-4 h-4" /> },
                { id: 'actions', title: 'Action Cards', icon: <CalendarCheck className="w-4 h-4" /> },
                { id: 'insights', title: 'Trends & Impact', icon: <TrendingDown className="w-4 h-4" /> },
                { id: 'coach', title: 'Gemini Coach', icon: <BrainCircuit className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                    activeTab === tab.id
                      ? 'bg-[#1B4332] border-[#1B4332] text-white'
                      : 'bg-transparent border-transparent text-[#40916C] hover:text-[#1B4332] hover:bg-[#D8F3DC]/40'
                  }`}
                >
                  {tab.icon} {tab.title}
                </button>
              ))}
            </div>

            {/* PRIMARY TAB CONTROLS VIEW CONTROLLER */}
            <div className="w-full" id="tab-holder-panel">
              {activeTab === 'dashboard' && (
                <Dashboard 
                  profile={profile} 
                  streak={streak} 
                  onLogSubmit={handleCarbonLogSubmit} 
                  lastLog={carbonLogs[carbonLogs.length - 1]}
                  achievements={achievements}
                  confirmAction={confirmAction}
                  setConfirmAction={setConfirmAction}
                  handleResetLogsOnly={handleResetLogsOnly}
                  handleResetApplicationState={handleResetApplicationState}
                  notificationHistory={notificationHistory}
                  onClearNotifications={handleClearNotifications}
                />
              )}
              
              {activeTab === 'actions' && (
                <ActionHub 
                  challenges={challenges} 
                  onToggleActive={handleToggleChallengeActive}
                  onCompleteChallenge={handleCompleteChallenge}
                />
              )}

              {activeTab === 'insights' && (
                <Insights 
                  profile={profile} 
                  historicalLogs={carbonLogs}
                  onDeleteLog={handleDeleteLog}
                />
              )}

              {activeTab === 'coach' && (
                <EcoCoach 
                  profile={profile} 
                  challenges={challenges} 
                  logs={carbonLogs}
                  onCoachInteraction={() => {
                    unlockAward('social-allstar', "AI Climate Apprentice Unlocked: Welcomed by the TRACE Gemini Eco-Coach!");
                  }}
                />
              )}
            </div>

          </div>
        )}
      </main>

      {/* Footer credits lines */}
      <footer className="bg-white/40 border-t border-[#D8E2D1] py-6 mt-12 text-center text-[11px] text-[#40916C]" id="global-footer">
        <p className="max-w-xl mx-auto leading-relaxed font-semibold">
          <strong>TRACE:</strong> Visualize your impact, master your footprint, and turn daily choices into a greener future.
        </p>
        <p className="mt-1 opacity-75 font-medium">
          Powered by Gemini Flash and zero-emission carbon-calculus diagnostics algorithms.
        </p>
      </footer>

      {/* Slide-over notifications drawer component */}
      <NotificationDrawer 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notificationHistory}
        onClearAll={handleClearNotifications}
      />

    </div>
  );
}
