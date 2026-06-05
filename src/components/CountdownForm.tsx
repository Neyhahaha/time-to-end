import { useState, useEffect } from 'react';
import { useCountdownStore } from '@/store/countdownStore';
import { X } from 'lucide-react';

const COLOR_OPTIONS = [
  { id: 'coral', label: '珊瑚橙', hex: '#FF6B6B' },
  { id: 'mint', label: '薄荷绿', hex: '#4ECDC4' },
  { id: 'amber', label: '琥珀黄', hex: '#F59E0B' },
  { id: 'violet', label: '紫罗兰', hex: '#8B5CF6' },
  { id: 'sky', label: '天空蓝', hex: '#0EA5E9' },
  { id: 'rose', label: '玫瑰红', hex: '#F43F5E' },
];

const ICON_OPTIONS = ['⏰', '🎯', '🎂', '🎓', '💼', '✈️', '🏠', '💍', '🏆', '🎉', '📅', '🌟'];

export default function CountdownForm() {
  const { showForm, setShowForm, addCountdown, updateCountdown, editingCountdownId, countdowns, setEditingCountdown } = useCountdownStore();

  const editingCountdown = editingCountdownId
    ? countdowns.find((c) => c.id === editingCountdownId)
    : null;

  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [color, setColor] = useState('coral');
  const [icon, setIcon] = useState('⏰');

  useEffect(() => {
    if (editingCountdown) {
      setTitle(editingCountdown.title);
      const oneMinuteLater = new Date(Date.now() + 60 * 1000);
      oneMinuteLater.setSeconds(0, 0);
      const pad = (n: number) => String(n).padStart(2, '0');
      setTargetDate(`${oneMinuteLater.getFullYear()}-${pad(oneMinuteLater.getMonth() + 1)}-${pad(oneMinuteLater.getDate())}T${pad(oneMinuteLater.getHours())}:${pad(oneMinuteLater.getMinutes())}`);
      setColor(editingCountdown.color);
      setIcon(editingCountdown.icon);
    } else {
      setTitle('');
      setTargetDate('');
      setColor('coral');
      setIcon('⏰');
    }
  }, [editingCountdown, showForm]);

  if (!showForm) return null;

  const handleClose = () => {
    setShowForm(false);
    setEditingCountdown(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;

    if (editingCountdownId) {
      updateCountdown(editingCountdownId, {
        title: title.trim(),
        targetDate: new Date(targetDate).toISOString(),
        color,
        icon,
      });
    } else {
      addCountdown({
        title: title.trim(),
        targetDate: new Date(targetDate).toISOString(),
        color,
        icon,
        pinned: false,
      });
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:justify-center p-0 sm:p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-md glass rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <X size={18} className="sm:size-[20px]" style={{ color: 'var(--text-secondary)' }} />
        </button>

        <h2 className="font-display text-lg sm:text-xl font-bold mb-4 sm:mb-6 pr-8">
          {editingCountdown ? '编辑倒计时' : '新建倒计时'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="font-body text-xs sm:text-sm font-medium block mb-1.5 sm:mb-2" style={{ color: 'var(--text-secondary)' }}>
              事件名称
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：项目上线"
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-body text-sm outline-none transition-all focus:ring-2 focus:ring-coral-500/50"
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              }}
              autoFocus
            />
          </div>

          <div>
            <label className="font-body text-xs sm:text-sm font-medium block mb-1.5 sm:mb-2" style={{ color: 'var(--text-secondary)' }}>
              目标日期时间
            </label>
            <input
              type="datetime-local"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl font-body text-sm outline-none transition-all focus:ring-2 focus:ring-coral-500/50"
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              }}
            />
          </div>

          <div>
            <label className="font-body text-xs sm:text-sm font-medium block mb-1.5 sm:mb-2" style={{ color: 'var(--text-secondary)' }}>
              颜色标签
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    background: c.hex,
                    opacity: color === c.id ? 1 : 0.4,
                    transform: color === c.id ? 'scale(1.15)' : undefined,
                    boxShadow: color === c.id ? `0 0 16px ${c.hex}66` : 'none',
                  }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="font-body text-xs sm:text-sm font-medium block mb-1.5 sm:mb-2" style={{ color: 'var(--text-secondary)' }}>
              图标
            </label>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              {ICON_OPTIONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base sm:text-lg transition-all duration-200 hover:scale-110"
                  style={{
                    background: icon === ic ? 'var(--bg-secondary)' : 'transparent',
                    border: icon === ic ? '2px solid var(--text-secondary)' : '2px solid transparent',
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim() || !targetDate}
            className="w-full py-2.5 sm:py-3 rounded-xl font-display text-sm sm:text-base font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed pb-safe"
            style={{
              background: COLOR_OPTIONS.find((c) => c.id === color)?.hex || '#FF6B6B',
            }}
          >
            {editingCountdown ? '保存修改' : '创建倒计时'}
          </button>
        </form>
      </div>
    </div>
  );
}
