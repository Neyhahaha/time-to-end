import { useCountdownStore } from '@/store/countdownStore';
import { useTheme } from '@/hooks/useTheme';
import { X, Moon, Sun, Bell, BellOff } from 'lucide-react';

export default function SettingsPanel() {
  const { showSettings, setShowSettings, settings, updateSettings } = useCountdownStore();
  const { isDark, toggleTheme } = useTheme();

  if (!showSettings) return null;

  const handleClose = () => setShowSettings(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:justify-center p-0 sm:p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-sm glass rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <X size={18} className="sm:size-[20px]" style={{ color: 'var(--text-secondary)' }} />
        </button>

        <h2 className="font-display text-lg sm:text-xl font-bold mb-5 sm:mb-8 pr-8">设置</h2>

        <div className="space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              {isDark ? <Moon size={18} className="sm:size-[20px] text-coral-500" /> : <Sun size={18} className="sm:size-[20px] text-amber-500" />}
              <span className="font-body text-sm font-medium">外观主题</span>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors duration-300"
              style={{
                background: isDark ? '#334155' : '#E2E8F0',
              }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-300 flex items-center justify-center text-[10px] sm:text-xs"
                style={{
                  left: isDark ? '26px' : '2px',
                  background: isDark ? '#FF6B6B' : '#F59E0B',
                }}
              >
                {isDark ? '🌙' : '☀️'}
              </div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              {settings.notificationEnabled ? (
                <Bell size={18} className="sm:size-[20px] text-mint-500" />
              ) : (
                <BellOff size={18} className="sm:size-[20px]" style={{ color: 'var(--text-secondary)' }} />
              )}
              <span className="font-body text-sm font-medium">到期通知</span>
            </div>
            <button
              onClick={() => updateSettings({ notificationEnabled: !settings.notificationEnabled })}
              className="relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors duration-300"
              style={{
                background: settings.notificationEnabled ? '#334155' : '#475569',
              }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-300"
                style={{
                  left: settings.notificationEnabled ? '26px' : '2px',
                  background: settings.notificationEnabled ? '#4ECDC4' : '#94A3B8',
                }}
              />
            </button>
          </div>

          {settings.notificationEnabled && (
            <div className="animate-slide-up">
              <label className="font-body text-sm font-medium block mb-1.5 sm:mb-2" style={{ color: 'var(--text-secondary)' }}>
                提前提醒时间
              </label>
              <select
                value={settings.notifyBeforeMinutes}
                onChange={(e) => updateSettings({ notifyBeforeMinutes: Number(e.target.value) })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-body text-sm outline-none"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <option value={1}>1 分钟前</option>
                <option value={5}>5 分钟前</option>
                <option value={15}>15 分钟前</option>
                <option value={30}>30 分钟前</option>
                <option value={60}>1 小时前</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
