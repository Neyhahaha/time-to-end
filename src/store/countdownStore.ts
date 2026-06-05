import { create } from 'zustand';

export interface Countdown {
  id: string;
  title: string;
  targetDate: string;
  color: string;
  icon: string;
  pinned: boolean;
  createdAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  notificationEnabled: boolean;
  notifyBeforeMinutes: number;
}

interface CountdownState {
  countdowns: Countdown[];
  settings: AppSettings;
  activeCountdownId: string | null;
  editingCountdownId: string | null;
  showForm: boolean;
  showSettings: boolean;
  addCountdown: (countdown: Omit<Countdown, 'id' | 'createdAt'>) => void;
  removeCountdown: (id: string) => void;
  updateCountdown: (id: string, updates: Partial<Countdown>) => void;
  togglePin: (id: string) => void;
  setActiveCountdown: (id: string | null) => void;
  setEditingCountdown: (id: string | null) => void;
  setShowForm: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const STORAGE_KEY = 'countdown-app-data';

function loadFromStorage(): { countdowns: Countdown[]; settings: AppSettings } {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return {
    countdowns: [],
    settings: {
      theme: 'dark',
      notificationEnabled: true,
      notifyBeforeMinutes: 5,
    },
  };
}

function saveToStorage(countdowns: Countdown[], settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ countdowns, settings }));
  } catch {
    // ignore
  }
}

const initial = loadFromStorage();

export const useCountdownStore = create<CountdownState>((set) => ({
  countdowns: initial.countdowns,
  settings: initial.settings,
  activeCountdownId: initial.countdowns.length > 0
    ? (initial.countdowns.find((c) => c.pinned)?.id ?? initial.countdowns[0]?.id ?? null)
    : null,
  editingCountdownId: null,
  showForm: false,
  showSettings: false,

  addCountdown: (countdown) =>
    set((state) => {
      const newCountdown: Countdown = {
        ...countdown,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      const countdowns = [...state.countdowns, newCountdown];
      saveToStorage(countdowns, state.settings);
      return {
        countdowns,
        activeCountdownId: state.activeCountdownId ?? newCountdown.id,
      };
    }),

  removeCountdown: (id) =>
    set((state) => {
      const countdowns = state.countdowns.filter((c) => c.id !== id);
      saveToStorage(countdowns, state.settings);
      const activeCountdownId = state.activeCountdownId === id
        ? (countdowns[0]?.id ?? null)
        : state.activeCountdownId;
      return { countdowns, activeCountdownId };
    }),

  updateCountdown: (id, updates) =>
    set((state) => {
      const countdowns = state.countdowns.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      saveToStorage(countdowns, state.settings);
      return { countdowns };
    }),

  togglePin: (id) =>
    set((state) => {
      const countdowns = state.countdowns.map((c) =>
        c.id === id ? { ...c, pinned: !c.pinned } : c
      );
      saveToStorage(countdowns, state.settings);
      return { countdowns };
    }),

  setActiveCountdown: (id) => set({ activeCountdownId: id }),
  setEditingCountdown: (id) => set({ editingCountdownId: id }),
  setShowForm: (show) => set({ showForm: show }),
  setShowSettings: (show) => set({ showSettings: show }),

  updateSettings: (updates) =>
    set((state) => {
      const settings = { ...state.settings, ...updates };
      saveToStorage(state.countdowns, settings);
      return { settings };
    }),
}));
