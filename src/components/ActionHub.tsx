import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Challenge } from '../types';
import { 
  Zap, 
  Utensils, 
  Car, 
  Trash2, 
  Leaf, 
  CheckCircle, 
  Circle,
  TrendingDown,
  Info
} from 'lucide-react';

const getChallengeEquivalentDescription = (item: Challenge) => {
  switch (item.category) {
    case 'transport':
      const km = (item.co2Saved * 4.0).toFixed(1);
      return {
        text: `Roughly ${km} km driven in an average gas car`,
        label: "Auto Distance Displaced",
        color: "text-blue-700 bg-blue-50/50 border-blue-100",
        icon: "🚗"
      };
    case 'food':
      const charges = Math.round(item.co2Saved * 122);
      return {
        text: `Energy equivalent to charging ${charges} smartphones`,
        label: "Phone Power Offset",
        color: "text-amber-700 bg-amber-50/50 border-amber-100",
        icon: "📱"
      };
    case 'energy':
      const hours = Math.round(item.co2Saved * 10.5);
      return {
        text: `Saves energy of ${hours} hours of continuous video streaming`,
        label: "Streaming Power Cut",
        color: "text-rose-700 bg-rose-50/50 border-rose-100",
        icon: "🎬"
      };
    case 'waste':
      const days = Math.round(item.co2Saved * 18);
      return {
        text: `Saves enough soil damage for a tree seedling to grow ${days} days`,
        label: "Reforestation Impact",
        color: "text-emerald-700 bg-emerald-50/50 border-emerald-100",
        icon: "🌱"
      };
    default:
      return {
        text: `Avoids ${item.co2Saved} kg of greenhouse gaseous emissions`,
        label: "Eco Offset Saved",
        color: "text-emerald-700 bg-[#D8F3DC]/20 border-[#B7E4C7]",
        icon: "🌲"
      };
  }
};

interface ActionHubProps {
  challenges: Challenge[];
  onToggleActive: (id: string) => void;
  onCompleteChallenge: (id: string) => void;
}

export default function ActionHub({ challenges, onToggleActive, onCompleteChallenge }: ActionHubProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'transport' | 'food' | 'energy' | 'waste'>('all');

  // Categorize challenges
  const filtered = challenges.filter(c => {
    if (activeCategory === 'all') return true;
    return c.category === activeCategory;
  });

  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Utensils className="w-4 h-4 text-rose-500" />;
      case 'transport':
        return <Car className="w-4 h-4 text-blue-500" />;
      case 'energy':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'waste':
        return <Trash2 className="w-4 h-4 text-purple-500" />;
      default:
        return <Leaf className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6" id="action-center">
      {/* Visual Hub Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E1EAD8] rounded-[2rem] p-6 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D8F3DC] text-[#1B4332] text-xs font-extrabold rounded-full">
            <CheckCircle className="w-3 h-3 text-[#2D6A4F]" /> Action Center
          </div>
          <h2 className="text-xl font-black font-display text-[#1B4332]">Carbon Reduction Challenge Cards</h2>
          <p className="text-xs text-[#40916C] font-semibold">Pick carbon reduction strategies as challenges. Track effort, reduce daily emissions, and earn offsets.</p>
        </div>
        
        {/* Rapid Impact stats widget */}
        <div className="flex gap-4 items-center px-4 py-2.5 bg-[#D8F3DC]/50 rounded-2xl border border-[#B7E4C7] self-start md:self-auto">
          <TrendingDown className="w-6 h-6 text-[#2D6A4F]" />
          <div>
            <span className="block text-xs font-bold text-[#40916C] uppercase tracking-wider leading-none">Total Cards Active</span>
            <span className="text-lg font-black font-display text-[#1B4332]">{challenges.filter(c => c.active && !c.completed).length} challenges</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', title: 'All Challenges' },
          { id: 'transport', title: '🚘 Transport' },
          { id: 'food', title: '🥩 Food/Diet' },
          { id: 'energy', title: '⚡ Energy' },
          { id: 'waste', title: '♻️ Waste Sort' },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`tab-category-${tab.id}`}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border duration-300 cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-[#1B4332] border-[#1B4332] text-white shadow-sm'
                : 'bg-white border-[#E1EAD8] text-[#40916C] hover:border-[#B7E4C7] hover:text-[#1B4332]'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Challenge Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="challenges-grid">
        <AnimatePresence mode="popLayout animate">
          {filtered.map((item) => {
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                key={item.id}
                id={`card-challenge-${item.id}`}
                className={`bg-white rounded-[2rem] border p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative ${
                  item.completed 
                    ? 'border-[#B7E4C7] bg-[#D8F3DC]/20 opacity-80' 
                    : item.active 
                    ? 'border-[#2D6A4F] ring-1 ring-[#2D6A4F]/20' 
                    : 'border-[#E1EAD8]'
                }`}
              >
                {/* Header Row */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 bg-[#F2F5F0] rounded-xl block border border-[#E1EAD8]">
                      {renderCategoryIcon(item.category)}
                    </span>
                    <span className={`text-xs uppercase font-extrabold font-mono px-2 py-0.5 rounded-lg ${
                      item.completed 
                        ? 'bg-[#2D6A4F] text-white' 
                        : item.active 
                        ? 'bg-[#D8F3DC] text-[#1B4332]'
                        : 'bg-[#F2F5F0] text-[#40916C]'
                    }`}>
                      {item.completed ? 'COMPLETED' : item.active ? 'ACTIVE' : 'AVAILABLE'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="font-display font-black text-[#1B4332] leading-tight text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#40916C] font-sans font-medium leading-relaxed min-h-[50px]">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Effort / Impact Scales & Footprint metrics */}
                <div className="mt-5 pt-4 border-t border-[#E1EAD8] space-y-4">
                  
                  {/* Effort vs Impact Scales */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Effort Panel */}
                    <div className="p-2 bg-[#F2F5F0] rounded-xl text-center space-y-0.5 border border-[#E1EAD8]">
                      <span className="block text-[10px] font-extrabold font-mono text-[#40916C] uppercase leading-none">EFFORT</span>
                      <span className={`text-xs font-extrabold uppercase ${
                        item.effort === 'low' ? 'text-[#2D6A4F]' :
                        item.effort === 'medium' ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {item.effort}
                      </span>
                    </div>

                    {/* Impact Panel */}
                    <div className="p-2 bg-[#F2F5F0] rounded-xl text-center space-y-1.5 border border-[#E1EAD8]">
                      <span className="block text-[10px] font-extrabold font-mono text-[#40916C] uppercase leading-none">IMPACT</span>
                      <div className="flex justify-center items-center gap-0.5 flex-wrap min-h-[16px]">
                        {(() => {
                          // Map each unique co2Saved rating to a distinct number of trees (from 1 to 8)
                          // so that no two challenges show the exact same visual footprint
                          let treeCount = 1;
                          if (item.co2Saved <= 0.6) treeCount = 1;
                          else if (item.co2Saved <= 0.8) treeCount = 2;
                          else if (item.co2Saved <= 1.2) treeCount = 3;
                          else if (item.co2Saved <= 1.8) treeCount = 4;
                          else if (item.co2Saved <= 2.1) treeCount = 5;
                          else if (item.co2Saved <= 3.0) treeCount = 6;
                          else if (item.co2Saved <= 3.2) treeCount = 7;
                          else treeCount = 8;

                          return Array.from({ length: treeCount }).map((_, i) => (
                            <span 
                              key={i} 
                              className="block text-xs leading-none text-emerald-600 animate-fade-in"
                              title={`${item.co2Saved} kg offset rating`}
                            >
                              🌲
                            </span>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Offset Benefit metrics readout with highly diversified relative comparisons */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-[#D8F3DC]/30 border border-[#B7E4C7] py-2 px-3 rounded-xl">
                      <div className="flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-[#2D6A4F]" />
                        <span className="text-[11px] font-bold text-[#40916C] uppercase font-mono">Emissions Avoided</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#2D6A4F] shrink-0">
                        -{item.co2Saved.toFixed(1)} kg CO2
                      </span>
                    </div>

                    {(() => {
                      const equiv = getChallengeEquivalentDescription(item);
                      return (
                        <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-[11px] font-sans font-medium leading-normal ${equiv.color}`}>
                          <span className="text-sm shrink-0 select-none">{equiv.icon}</span>
                          <div className="space-y-0.5">
                            <span className="block text-[9px] font-extrabold uppercase tracking-wide opacity-80">{equiv.label}</span>
                            <p className="font-semibold leading-snug">{equiv.text}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Active Toggle / Complete buttons */}
                  {item.completed ? (
                    <div className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#D8F3DC]/40 text-[#1B4332] rounded-xl text-xs font-bold border border-[#B7E4C7]">
                      <CheckCircle className="w-4 h-4 text-[#2D6A4F] fill-[#D8F3DC]" /> Complete & Offset logged!
                    </div>
                  ) : item.active ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id={`btn-cancel-challenge-${item.id}`}
                        onClick={() => onToggleActive(item.id)}
                        className="py-2.5 px-2 rounded-xl text-xs font-bold border border-[#E1EAD8] text-[#40916C] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-100 focus:outline-none transition-colors cursor-pointer"
                      >
                        Abandon
                      </button>
                      <button
                        id={`btn-complete-challenge-${item.id}`}
                        onClick={() => onCompleteChallenge(item.id)}
                        className="py-2.5 px-2 rounded-xl text-xs font-extrabold bg-[#2D6A4F] hover:bg-[#1B4332] text-white shadow-sm hover:shadow focus:outline-none transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4 text-white" /> Complete
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`btn-activate-challenge-${item.id}`}
                      onClick={() => onToggleActive(item.id)}
                      className="w-full py-2.5 bg-[#1B4332] text-white rounded-xl text-xs font-extrabold hover:bg-[#2D6A4F] hover:shadow-sm focus:outline-none transition-all cursor-pointer"
                    >
                      Accept Challenge
                    </button>
                  )}

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 space-y-2">
            <Info className="w-10 h-10 text-slate-300 mx-auto" />
            <span className="block font-medium font-display text-slate-600">No challenges found</span>
            <span className="block text-xs max-w-xs mx-auto">Try selecting a different categorical filter to find available carbon reducing actions.</span>
          </div>
        )}
      </div>
    </div>
  );
}
