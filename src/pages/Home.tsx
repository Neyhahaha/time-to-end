import { useEffect, useCallback } from 'react';
import { useCountdownStore } from '@/store/countdownStore';
import { useCountdown, useNotifiedCountdowns } from '@/hooks/useCountdown';
import { useTheme } from '@/hooks/useTheme';
import CountdownDisplay from '@/components/CountdownDisplay';
import CountdownCard from '@/components/CountdownCard';
import CountdownForm from '@/components/CountdownForm';
import SettingsPanel from '@/components/SettingsPanel';
import CelebrationEffect from '@/components/CelebrationEffect';
import EmptyState from '@/components/EmptyState';
import { Plus, Settings, ChevronLeft, ChevronRight, List } from 'lucide-react';

export default function Home() {
  const {
    countdowns,
    activeCountdownId,
    setActiveCountdown,
    setShowForm,
    setShowSettings,
    settings,
  } = useCountdownStore();
  const { isDark } = useTheme();
  const { isNotified, markNotified } = useNotifiedCountdowns();

  const activeCountdown = countdowns.find((c) => c.id === activeCountdownId);
  const activeTimeLeft = useCountdown(activeCountdown?.targetDate ?? '', activeCountdown?.createdAt);

  useEffect(() => {
    if (settings.theme === 'dark' && !isDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light' && isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [settings.theme, isDark]);

  const sendNotification = useCallback((title: string) => {
    if (!settings.notificationEnabled) return;
    if (Notification.permission === 'granted') {
      new Notification('倒计时到期', { body: `"${title}" 已到达目标时间！`, icon: '⏰' });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification('倒计时到期', { body: `"${title}" 已到达目标时间！`, icon: '⏰' });
        }
      });
    }
  }, [settings.notificationEnabled]);

  useEffect(() => {
    countdowns.forEach((c) => {
      const remaining = new Date(c.targetDate).getTime() - Date.now();
      if (remaining <= 0 && !isNotified(c.id)) {
        markNotified(c.id);
        sendNotification(c.title);
      }
    });
  }, [countdowns, isNotified, markNotified, sendNotification]);

  useEffect(() => {
    if (settings.notificationEnabled && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [settings.notificationEnabled]);

  const sortedCountdowns = [...countdowns].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
  });

  const activeIndex = sortedCountdowns.findIndex((c) => c.id === activeCountdownId);

  const navigateCountdown = (direction: 'prev' | 'next') => {
    if (sortedCountdowns.length === 0) return;
    let newIndex: number;
    if (direction === 'prev') {
      newIndex = activeIndex <= 0 ? sortedCountdowns.length - 1 : activeIndex - 1;
    } else {
      newIndex = activeIndex >= sortedCountdowns.length - 1 ? 0 : activeIndex + 1;
    }
    setActiveCountdown(sortedCountdowns[newIndex].id);
  };

  if (countdowns.length === 0) {
    return (
      <>
        <EmptyState
          onCreateClick={() => setShowForm(true)}
          onSettingsClick={() => setShowSettings(true)}
        />
        <CountdownForm />
        <SettingsPanel />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-coral-500 flex items-center justify-center">
            <span className="text-white text-base sm:text-lg">⏱</span>
          </div>
          <h1 className="font-display text-base sm:text-lg font-bold">倒计时</h1>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-body text-xs sm:text-sm font-medium bg-coral-500 text-white hover:bg-coral-400 transition-all duration-200 hover:scale-105 glow-coral flex items-center gap-1 sm:gap-1.5"
          >
            <Plus size={14} className="sm:size-[16px]" />
            <span className="hidden xs:inline">新建</span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 sm:p-2.5 rounded-xl neu hover:scale-105 transition-all duration-200"
          >
            <Settings size={16} className="sm:size-[18px]" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8">
        <section className="flex-1 flex flex-col items-center justify-center relative min-h-[50vh] lg:min-h-0">
          {activeCountdown && (
            <>
              <div className="relative">
                <CountdownDisplay countdown={activeCountdown} />
                <CelebrationEffect show={activeCountdown ? activeTimeLeft.isExpired : false} />
              </div>

              {countdowns.length > 1 && (
                <div className="flex items-center gap-4 mt-4 sm:mt-6">
                  <button
                    onClick={() => navigateCountdown('prev')}
                    className="p-2 rounded-xl neu hover:scale-110 transition-all duration-200"
                  >
                    <ChevronLeft size={18} className="sm:size-[20px]" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                  <span className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {activeIndex + 1} / {sortedCountdowns.length}
                  </span>
                  <button
                    onClick={() => navigateCountdown('next')}
                    className="p-2 rounded-xl neu hover:scale-110 transition-all duration-200"
                  >
                    <ChevronRight size={18} className="sm:size-[20px]" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <aside className="w-full lg:w-80 flex flex-col gap-2.5 lg:gap-3 overflow-y-auto max-h-[45vh] lg:max-h-[calc(100vh-100px)] pr-0 lg:pr-1 pb-safe">
          <h3 className="flex items-center gap-2 font-display text-sm font-semibold px-1 mb-0.5 lg:mb-1 sticky top-0 z-10 py-2 bg-[var(--bg-primary)]" style={{ color: 'var(--text-secondary)' }}>
            <List size={15} />
            全部倒计时 ({countdowns.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 lg:gap-3">
            {sortedCountdowns.map((countdown) => (
              <CountdownCard
                key={countdown.id}
                countdown={countdown}
                isActive={countdown.id === activeCountdownId}
                onClick={() => setActiveCountdown(countdown.id)}
              />
            ))}
          </div>
        </aside>
      </main>

      <CountdownForm />
      <SettingsPanel />
    </div>
  );
}
