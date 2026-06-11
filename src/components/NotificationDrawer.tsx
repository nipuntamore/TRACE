import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, BellRing, Award, HeartHandshake, CheckCircle2, AlertCircle } from 'lucide-react';

interface NotificationItem {
  id: string;
  msg: string;
  type: string;
  timestamp: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClearAll: () => void;
}

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onClearAll,
}: NotificationDrawerProps) {
  // Determine relevant icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-amber-600 fill-amber-600/10" />
          </div>
        );
      case 'social':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] border border-[#B7E4C7] flex items-center justify-center shrink-0">
            <HeartHandshake className="w-4 h-4 text-[#1B4332]" />
          </div>
        );
      case 'success':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-[#F2F5F0] border border-[#D8E2D1] flex items-center justify-center shrink-0">
            <BellRing className="w-4 h-4 text-[#2D6A4F]" />
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
            id="notification-backdrop"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-[#D8E2D1] shadow-2xl z-50 flex flex-col"
            id="notification-drawer-panel"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E1EAD8] flex items-center justify-between bg-gradient-to-r from-white to-[#FAFCF9]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#E8F5E9] border border-[#D8E2D1] rounded-xl flex items-center justify-center">
                  <BellRing className="w-5 h-5 text-[#2D6A4F]" />
                </div>
                <div>
                  <h2 className="text-base font-black font-display text-[#1B4332] tracking-tight uppercase">
                    Activity & Alert Feed
                  </h2>
                  <p className="text-[11px] text-[#40916C] font-semibold">
                    Real-time diagnostics & carbon logs
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl hover:bg-[#F2F5F0] text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer border border-transparent hover:border-[#D8E2D1]"
                aria-label="Close panel"
                id="close-notification-drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#FAFCF9] border border-[#D8E2D1] flex items-center justify-center animate-pulse">
                    <BellRing className="w-8 h-8 text-[#40916C]/45" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1B4332]">
                      Your notification feed is clear
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      Calibration logs, challenge updates, and milestone achievements will trace in real-time here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-[#E1EAD8] bg-[#FAFCF9] hover:bg-[#F2F5F0]/60 transition-all flex items-start gap-3.5 shadow-xs"
                    >
                      {getNotificationIcon(item.type)}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <p className="text-xs text-[#1B4332] font-semibold leading-relaxed break-words">
                          {item.msg}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-black tracking-wider text-[#40916C] uppercase bg-[#E8F5E9] px-1.5 py-0.5 rounded-sm">
                            {item.timestamp}
                          </span>
                          <span className="text-[9px] text-[#40916C] font-mono font-medium capitalize">
                            {item.type} log
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-[#E1EAD8] bg-[#FAFCF9] flex gap-3">
              {notifications.length > 0 ? (
                <button
                  onClick={() => {
                    onClearAll();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 hover:text-rose-800 font-bold rounded-xl text-xs transition-all tracking-wider uppercase cursor-pointer shadow-sm"
                  id="drawer-clear-all-btn"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Activity History
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 text-slate-400 font-bold rounded-xl text-xs tracking-wider uppercase text-center"
                >
                  No History Logs
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
