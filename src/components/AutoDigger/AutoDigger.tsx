import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import woodenShovelImage from '../../assets/wood_shovel.webp';
import stoneShovelImage from '../../assets/stone_shovel.webp';
import ironShovelImage from '../../assets/iron_shovel.webp';
import goldenShovelImage from '../../assets/golden_shovel.webp';
import diamondShovelImage from '../../assets/diamond_shovel.webp';
import netheriteShovelImage from '../../assets/netherite_shovel.webp';
import { useEffect, useState, useCallback } from 'react';

interface AutoDiggerProps {
  blockPosition: { x: number, y: number, width: number, height: number } | null;
}

/**
 * Компонент AutoDigger для анимации автоматического копания
 * Лопаты (Wood Shovels) размещаются вокруг блока земли и анимированно "копают" его
 */
export const AutoDigger: React.FC<AutoDiggerProps> = ({ blockPosition }) => {
  const { autoClickerCount } = useGameStore();
  // Радиус круга для размещения лопат
  const [radius, setRadius] = useState(100); 
  // Вертикальное смещение для визуального баланса
  const [yOffset, setYOffset] = useState(0);
  // Длительность анимации копания
  const [animationDuration, setAnimationDuration] = useState(0.8); // Уменьшили с 1 до 0.8 для более легкой анимации
  // Базовый поворот изображения лопаты (в градусах)
  const baseImageRotation = 50; // Добавляем 15 градусов к повороту самого изображения

  // Функция обновления размеров в зависимости от размера экрана
  const updateResponsiveValues = useCallback(() => {
    if (window.innerWidth <= 480) {
      // Мобильные устройства
      setRadius(80);
      setYOffset(-10);
      setAnimationDuration(1.0);
    } else if (window.innerWidth <= 768) {
      // Планшеты
      setRadius(90);
      setYOffset(-10);
      setAnimationDuration(0.9);
    } else {
      // Десктопы
      setRadius(120);
      setYOffset(0);
      setAnimationDuration(0.8);
    }
  }, []);

  // Подписываемся на изменение размера окна и обновляем значения
  useEffect(() => {
    updateResponsiveValues();
    
    window.addEventListener('resize', updateResponsiveValues);
    
    return () => {
      window.removeEventListener('resize', updateResponsiveValues);
    };
  }, [updateResponsiveValues]);

  // Если нет деревянных лопат - не рендерим ничего
  if (autoClickerCount <= 0) return null;

  // Если мы не на вкладке game, не отображаем анимацию, но продолжаем добычу
  if (!blockPosition) return null;

  // Создаем массив лопат в соответствии с количеством деревянных лопат
  const shovels = Array.from({ length: Math.min(autoClickerCount, 12) }, (_, index) => {
    // Максимально отображаем 12 лопат, чтобы не перегружать экран
    // Вычисляем позицию лопаты вокруг блока земли (равномерно по кругу)
    const angle = (index / Math.min(autoClickerCount, 12)) * Math.PI * 2;

    // Вычисляем координаты на окружности
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius + yOffset;

    // Вычисляем угол поворота лопаты, чтобы она смотрела на блок земли
    // +90 градусов чтобы острие лопаты смотрело на блок
    const rotation = (angle * (180 / Math.PI)) + 90;
    
    // Добавляем индивидуальный небольшой случайный поворот для каждой лопаты
    // чтобы они выглядели менее одинаково
    const individualRotation = Math.random() * 10 - 5; // от -5 до 5 градусов

    return {
      id: index,
      position: { x, y },
      angle, 
      rotation,
      individualRotation,
      delay: index * (0.8 / Math.min(autoClickerCount, 12)) // Распределяем задержки равномерно
    };
  });

  const getShovelImage = () => {
    if (autoClickerCount >= 1000) return netheriteShovelImage;
    if (autoClickerCount >= 500) return diamondShovelImage;
    if (autoClickerCount >= 300) return goldenShovelImage;
    if (autoClickerCount >= 200) return ironShovelImage;
    if (autoClickerCount >= 100) return stoneShovelImage;
    return woodenShovelImage;
  };

  // Получаем дополнительный угол поворота в зависимости от типа лопаты
  const getAdditionalRotation = () => {
    if (autoClickerCount >= 1000) return 90; // Незеритовая
    if (autoClickerCount >= 500) return 90; // Алмазная
    if (autoClickerCount >= 300) return 90; // Золотая
    if (autoClickerCount >= 200) return 90; // Железная
    if (autoClickerCount >= 100) return 90; // Каменная
    return 0; // Деревянная
  };

  return (
    <div className="global-shovels-container">
      <div className="shovels-container">
        {shovels.map(shovel => {
          const moveX = Math.cos(shovel.angle) * -15;
          const moveY = Math.sin(shovel.angle) * -15;
          
          const finalRotation = shovel.rotation + baseImageRotation + shovel.individualRotation + getAdditionalRotation();

          return (
            <motion.div
              key={`digger-${shovel.id}`}
              className="auto-digger"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${shovel.position.x}px), calc(-50% + ${shovel.position.y}px))`,
                pointerEvents: 'none',
              }}
            >
              <motion.img
                src={getShovelImage()}
                alt="Shovel"
                className="shovel-image"
                style={{
                  width: window.innerWidth <= 480 ? '28px' : '34px',
                  height: 'auto',
                  transformOrigin: '50% 75%',
                  transform: `rotate(${finalRotation}deg)`
                }}
                animate={{
                  // Анимация "копания" - движение к центру и обратно с меньшей глубиной
                  x: [0, moveX, 0],
                  y: [0, moveY, 0],
                  // Уменьшаем амплитуду поворота с 20 до 12 градусов
                  rotate: [finalRotation, finalRotation - 12, finalRotation]
                }}
                transition={{
                  duration: animationDuration,
                  repeat: Infinity,
                  repeatDelay: 0.6, // Уменьшили с 0.8 до 0.6 для более частого копания
                  delay: shovel.delay, // Индивидуальная задержка для каждой лопаты
                  ease: "easeInOut", // Более плавная анимация
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};