/**
 * Генерирует список суффиксов для больших чисел
 * Начинает с '', K, M, B, T, затем продолжает aa, ab, ..., az, ba, ..., zz, zza и т.д.
 */
function generateSuffixes(): string[] {
  const basicSuffixes = ['', 'K', 'M', 'B', 'T'];
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  
  // Добавляем двухбуквенные суффиксы (aa-zz)
  const letterSuffixes: string[] = [];
  
  for (let i = 0; i < alphabet.length; i++) {
    for (let j = 0; j < alphabet.length; j++) {
      letterSuffixes.push(alphabet[i] + alphabet[j]);
    }
  }
  
  // Если нужно больше, можно добавить трехбуквенные суффиксы, начиная с zza
  // Пример для демонстрации
  letterSuffixes.push('zza');
  
  return [...basicSuffixes, ...letterSuffixes];
}

// Генерируем суффиксы один раз при загрузке модуля
const suffixes = generateSuffixes();

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

/**
 * Возвращает полную строку числа с разделителями разрядов для отображения при наведении
 * @param num Число для форматирования
 * @returns Полная строка числа с разделителями
 */
export function getFullNumberString(num: number): string {
  // Исправляем неточности плавающей запятой
  num = fixFloatingPoint(num);
  
  // Округляем до целого
  const wholeNumber = Math.floor(num);
  
  // Преобразуем в строку и добавляем разделители разрядов (пробелы)
  return wholeNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Вычисляет числовое значение для заданного суффикса
 * @param suffix Суффикс (например, 'zzz')
 * @returns Числовое значение, соответствующее суффиксу
 */
export function getValueForSuffix(suffix: string): number {
  const basicSuffixes = ['', 'K', 'M', 'B', 'T'];
  
  // Ищем индекс суффикса в нашем массиве
  const suffixIndex = suffixes.indexOf(suffix);
  
  if (suffixIndex === -1) {
    console.error(`Суффикс ${suffix} не найден в списке суффиксов`);
    return 0;
  }
  
  // Вычисляем значение: 1000^индекс
  return Math.pow(1000, suffixIndex);
}

// Для тестирования
export function getAllSuffixes(): string[] {
  return suffixes;
}
