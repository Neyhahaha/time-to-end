import { useState, useEffect } from 'react';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isExpired: boolean;
  progress: number;
}

const EMPTY_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true, progress: 0 };

export function useCountdown(targetDate: string, createdAt?: string): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    if (!targetDate) return EMPTY_TIME;
    const target = new Date(targetDate).getTime();
    if (isNaN(target)) return EMPTY_TIME;
    return calc(target, Date.now(), createdAt ? new Date(createdAt).getTime() : undefined);
  });

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(EMPTY_TIME);
      return;
    }

    const target = new Date(targetDate).getTime();
    if (isNaN(target)) {
      setTimeLeft(EMPTY_TIME);
      return;
    }

    const created = createdAt ? new Date(createdAt).getTime() : undefined;

    setTimeLeft(calc(target, Date.now(), isNaN(created as number) ? undefined : created));

    const timer = setInterval(() => {
      setTimeLeft(calc(target, Date.now(), isNaN(created as number) ? undefined : created));
    }, 200);

    return () => clearInterval(timer);
  }, [targetDate, createdAt]);

  return timeLeft;
}

function calc(target: number, now: number, created?: number): TimeLeft {
  const remaining = target - now;

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true, progress: 1 };
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  let progress: number;
  if (created && !isNaN(created) && target > created) {
    progress = Math.min(1, Math.max(0, (now - created) / (target - created)));
  } else {
    progress = 0;
  }

  return { days, hours, minutes, seconds, totalMs: remaining, isExpired: false, progress };
}

export function useNotifiedCountdowns() {
  const [notified, setNotified] = useState<Set<string>>(new Set());

  const markNotified = (id: string) => setNotified((prev) => new Set(prev).add(id));
  const isNotified = (id: string) => notified.has(id);

  return { isNotified, markNotified };
}
