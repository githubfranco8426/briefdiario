import { useState, useEffect } from 'react';

export function useLiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = now.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const rawDate = now.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  // Capitalize first letter: "lunes, 7 de septiembre" -> "Lunes, 7 de septiembre"
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const hour = now.getHours();
  let greeting = 'Buenos días';
  if (hour >= 12 && hour < 20) {
    greeting = 'Buenas tardes';
  } else if (hour >= 20 || hour < 6) {
    greeting = 'Buenas noches';
  }

  return {
    timeString,
    formattedDate,
    greeting,
    dateObj: now,
  };
}
