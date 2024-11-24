// @ts-ignore
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  // @ts-ignore
  const formattedDate = date.toLocaleDateString('ru-RU', options);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const age = calculateAge(dateString);
  return `${formattedDate} в ${hours}:${minutes} (${age})`;
};

// @ts-ignore
export const formatDate2 = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  // @ts-ignore
  const formattedDate = date.toLocaleDateString('ru-RU', options);

  const age = calculateAge(dateString);
  return `${formattedDate} (${age})`;
};

// @ts-ignore
// @ts-ignore
export const calculateAge = (dateString: string): string => {
  const birthDate = new Date(dateString);
  const today = new Date();

  const years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();

  let ageInYears = years;
  let ageInMonths = months;

  if (months < 0) {
    ageInYears--;
    ageInMonths = 12 + months;
  }

  const yearLabel = ageInYears === 1 ? 'год' : ageInYears >= 5 || ageInYears === 0 ? 'лет' : 'года';
  const monthLabel =
    ageInMonths === 1 ? 'месяц' : ageInMonths >= 5 || ageInMonths === 0 ? 'месяцев' : 'месяца';

  return `${ageInYears} ${yearLabel} и ${ageInMonths} ${monthLabel}`;
};

export const formatDateDMYDT = (
  dateString: string,
  isNeedTime: boolean = false,
  isMonthTranslate: boolean = false,
) => {
  const date = new Date(dateString);

  // Получение деталей даты
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  // Названия месяцев на русском
  const monthsInRussian = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  // Если нужно перевести месяц на русский
  const month = isMonthTranslate
    ? monthsInRussian[date.getMonth()]
    : (date.getMonth() + 1).toString().padStart(2, '0');

  // Форматирование даты
  const formattedDate = isMonthTranslate ? `${day} ${month} ${year}` : `${day}.${month}.${year}`;

  // Получение времени
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Если нужно только дату
  if (!isNeedTime) {
    return formattedDate;
  }

  // Если нужно время в формате [дата, время]
  return [formattedDate, ` ${hours}:${minutes}`];
};
