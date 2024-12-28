const currentDate = new Date();

export const formatDate = (dateString: string) => {
  const utcDate = new Date(dateString);
  const clientOffset = currentDate.getTimezoneOffset();
  const localDate = new Date(utcDate.getTime() - clientOffset);

  const enUSFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const ruFormatter = new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return {
    en: enUSFormatter.format(localDate),
    ru: ruFormatter.format(localDate),
  };
};

export const formatDateNoTime = (dateString: string) => {
  const utcDate = new Date(dateString);
  const clientOffset = currentDate.getTimezoneOffset();
  const localDate = new Date(utcDate.getTime() - clientOffset);

  const enNoTimeFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const enMonthNameFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  const ruNoTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const ruMonthNameFormatter = new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  return {
    en: {
      noTime: enNoTimeFormatter.format(localDate),
      monthName: enMonthNameFormatter.format(localDate),
    },
    ru: {
      noTime: ruNoTimeFormatter.format(localDate).replace(/г./g, '').trim(),
      monthName: ruMonthNameFormatter.format(localDate).replace(/г./g, '').trim(),
    },
  };
};

