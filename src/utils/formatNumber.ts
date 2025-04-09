const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

/**
 * Исправляет число с плавающей запятой, удаляя неточности представления
 * @param num Число для фиксации
 * @returns Число без неточностей представления
 */
export function fixFloatingPoint(num: number): number {
  // Округляем до одного знака после запятой
  return Number(num.toFixed(1));
}

export function formatNumber(num: number): string {
  // Сначала исправляем возможные неточности плавающей запятой
  num = fixFloatingPoint(num);
  
  // Для отрицательных чисел
  const isNegative = num < 0;
  num = Math.abs(num);
  
  // Для чисел меньше 1000 просто возвращаем целое число
  if (num < 1000) {
    const result = Math.floor(num).toString();
    return isNegative ? `-${result}` : result;
  }

  // Находим подходящий суффикс
  const magnitude = Math.min(Math.floor(Math.log10(num) / 3), suffixes.length - 1);
  const suffix = suffixes[magnitude];

  // Нормализуем число
  const normalized = num / Math.pow(1000, magnitude);
  
  // Форматируем число
  let formatted: string;
  if (normalized >= 10) {
    // Для больших чисел убираем десятичную часть
    formatted = Math.floor(normalized).toString();
  } else {
    // Для чисел меньше 10 оставляем один знак после запятой
    formatted = normalized.toFixed(1).replace(/\.0$/, '');
  }

  // Добавляем знак минус обратно, если число было отрицательным
  return `${isNegative ? '-' : ''}${formatted}${suffix}`;
}
