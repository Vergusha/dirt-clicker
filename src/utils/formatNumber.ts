const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

export function formatNumber(num: number): string {
  // Округляем до целых чисел
  num = Math.floor(num);
  
  // Для маленьких чисел просто возвращаем форматированную строку
  if (num < 1000) {
    return num.toString();
  }

  // Находим подходящий суффикс
  const magnitude = Math.min(Math.floor(Math.log10(num) / 3), suffixes.length - 1);
  const suffix = suffixes[magnitude];

  // Нормализуем число
  const normalized = num / Math.pow(1000, magnitude);
  
  // Форматируем с одной цифрой после запятой, если число меньше 10
  // и без цифр после запятой, если число 10 или больше
  const formatted = normalized >= 10 ? 
    Math.floor(normalized).toString() : 
    normalized.toFixed(1).replace(/\.0$/, '');

  return `${formatted}${suffix}`;
}
