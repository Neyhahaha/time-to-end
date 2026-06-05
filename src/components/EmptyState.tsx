import { Plus, Settings, Timer } from 'lucide-react';

interface EmptyStateProps {
  onCreateClick: () => void;
  onSettingsClick: () => void;
}

export default function EmptyState({ onCreateClick, onSettingsClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      <div className="relative mb-6 sm:mb-8">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl neu flex items-center justify-center">
          <Timer size={40} className="sm:size-[48px] text-coral-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-coral-500 flex items-center justify-center animate-float">
          <Plus size={16} className="sm:size-[18px] text-white" />
        </div>
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-center">开始你的倒计时</h1>
      <p className="font-body text-sm sm:text-base mb-6 sm:mb-8 text-center max-w-sm" style={{ color: 'var(--text-secondary)' }}>
        追踪每一个重要时刻，让时间可视化
      </p>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={onCreateClick}
          className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-display text-sm sm:text-base font-semibold text-white bg-coral-500 hover:bg-coral-400 transition-all duration-200 hover:scale-105 glow-coral flex items-center gap-1.5 sm:gap-2"
        >
          <Plus size={16} className="sm:size-[18px]" />
          新建倒计时
        </button>
        <button
          onClick={onSettingsClick}
          className="p-2.5 sm:p-3 rounded-2xl neu hover:scale-105 transition-all duration-200"
        >
          <Settings size={18} className="sm:size-[20px]" style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>
    </div>
  );
}
