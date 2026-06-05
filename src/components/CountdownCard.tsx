import { useCountdown } from '@/hooks/useCountdown';
import type { Countdown } from '@/store/countdownStore';
import { useCountdownStore } from '@/store/countdownStore';
import { Pin, PinOff, Pencil, Trash2 } from 'lucide-react';

interface CountdownCardProps {
  countdown: Countdown;
  isActive: boolean;
  onClick: () => void;
}

export default function CountdownCard({ countdown, isActive, onClick }: CountdownCardProps) {
  const { removeCountdown, togglePin, setActiveCountdown, setEditingCountdown, setShowForm } = useCountdownStore();
  const timeLeft = useCountdown(countdown.targetDate);
  const { days, hours, minutes, seconds, isExpired } = timeLeft;

  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    coral: { bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.3)', text: '#FF6B6B', glow: '0 0 20px rgba(255,107,107,0.15)' },
    mint: { bg: 'rgba(78,205,196,0.1)', border: 'rgba(78,205,196,0.3)', text: '#4ECDC4', glow: '0 0 20px rgba(78,205,196,0.15)' },
    amber: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#F59E0B', glow: '0 0 20px rgba(245,158,11,0.15)' },
    violet: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)', text: '#8B5CF6', glow: '0 0 20px rgba(139,92,246,0.15)' },
    sky: { bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.3)', text: '#0EA5E9', glow: '0 0 20px rgba(14,165,233,0.15)' },
    rose: { bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.3)', text: '#F43F5E', glow: '0 0 20px rgba(244,63,94,0.15)' },
  };
  const colors = colorMap[countdown.color] || colorMap.coral;
  const pad = (n: number) => String(n).padStart(2, '0');

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCountdown(countdown.id);
    setShowForm(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeCountdown(countdown.id);
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(countdown.id);
    if (!countdown.pinned) {
      setActiveCountdown(countdown.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        group relative rounded-2xl p-3 sm:p-4 cursor-pointer
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:-translate-y-0.5
        active:scale-[0.98]
        animate-slide-up
        ${isActive ? 'ring-2' : ''}
      `}
      style={{
        background: colors.bg,
        borderColor: isActive ? colors.border : 'transparent',
        boxShadow: isActive ? colors.glow : 'none',
        border: `1px solid ${isActive ? colors.border : 'var(--border-color)'}`,
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl" style={{ background: colors.text }} />

      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xs sm:text-sm font-semibold truncate pr-2">
            {countdown.title}
          </h3>
          <p className="font-body text-[10px] sm:text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {new Date(countdown.targetDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={handlePin}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            title={countdown.pinned ? '取消置顶' : '置顶'}
          >
            {countdown.pinned ? (
              <PinOff size={12} className="sm:size-[14px]" style={{ color: colors.text }} />
            ) : (
              <Pin size={12} className="sm:size-[14px]" style={{ color: 'var(--text-secondary)' }} />
            )}
          </button>
          <button
            onClick={handleEdit}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="编辑"
          >
            <Pencil size={12} className="sm:size-[14px]" style={{ color: 'var(--text-secondary)' }} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded-lg hover:bg-red-500/20 transition-colors"
            title="删除"
          >
            <Trash2 size={12} className="sm:size-[14px] text-red-400" />
          </button>
        </div>
      </div>

      {isExpired ? (
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold" style={{ color: colors.text }}>
            已到达 ✦
          </span>
        </div>
      ) : (
        <div className="flex items-baseline gap-0.5 sm:gap-1">
          {days > 0 && (
            <>
              <span className="digit-font text-base sm:text-xl font-bold" style={{ color: colors.text }}>
                {days}
              </span>
              <span className="font-body text-[10px] sm:text-xs" style={{ color: 'var(--text-secondary)' }}>天</span>
            </>
          )}
          <span className="digit-font text-base sm:text-xl font-bold" style={{ color: colors.text }}>
            {pad(hours)}
          </span>
          <span className="digit-font text-sm sm:text-lg" style={{ color: colors.text }}>:</span>
          <span className="digit-font text-base sm:text-xl font-bold" style={{ color: colors.text }}>
            {pad(minutes)}
          </span>
          <span className="digit-font text-sm sm:text-lg" style={{ color: colors.text }}>:</span>
          <span className="digit-font text-base sm:text-xl font-bold" style={{ color: colors.text }}>
            {pad(seconds)}
          </span>
        </div>
      )}
    </div>
  );
}
