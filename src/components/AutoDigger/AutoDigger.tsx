import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import shovelImage from '../../assets/wood_shovel.webp';
import { BlockPosition } from '../../types';
import { useEffect, useState, useCallback } from 'react';

interface AutoDiggerProps {
  blockPosition: { x: number, y: number, width: number, height: number } | null;
}

/**
 * Компонент AutoDigger для анимации автоматического копания
 * Лопаты размещаются вокруг блока земли и анимированно "копают" его
 */
export const AutoDigger: React.FC<AutoDiggerProps> = ({ blockPosition }) => {
  const { autoClickerCount } = useGameStore();
  // Радиус круга для размещения лопат
  const [radius, setRadius] = useState(100); 
  // Вертикальное смещение для визуального баланса
  const [yOffset, setYOffset] = useState(0);
  // Длительность анимации копания
  const [animationDuration, setAnimationDuration] = useState(1);
  // Базовый поворот изображения лопаты (в градусах)
  const baseImageRotation = 50; // Добавляем 15 градусов к повороту самого изображения

  // Функция обновления размеров в зависимости от размера экрана
  const updateResponsiveValues = useCallback(() => {
    // Адаптация для различных размеров экрана
    if (window.innerWidth <= 480) {
      // Мобильные устройства
      setRadius(80);
      setYOffset(0);
      setAnimationDuration(1.2);
    } else if (window.innerWidth <= 768) {
      // Планшеты
      setRadius(120);
      setYOffset(0);
      setAnimationDuration(1.1);
    } else {
      // Десктопы
      setRadius(150);
      setYOffset(0);
      setAnimationDuration(1);
    }
  }, []);

  // Подписываемся на изменение размера окна и обновляем значения
  useEffect(() => {
    updateResponsiveValues();
    
    const handleResize = () => {
      updateResponsiveValues();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateResponsiveValues]);

  // Если нет автокликеров или отсутствует позиция блока - не рендерим ничего
  if (autoClickerCount <= 0 || !blockPosition) return null;

  // Создаем массив лопат в соответствии с количеством автокликеров
  const shovels = Array.from({ length: Math.min(autoClickerCount, 12) }, (_, index) => {
    // Максимально отображаем 12 лопат, чтобы не перегружать экран
    // Вычисляем позицию лопаты вокруг блока земли (равномерно по кругу)
    const angle = (index / Math.min(autoClickerCount, 12)) * Math.PI * 2;

    // Вычисляем координаты на окружности
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

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

  return (
    <div className="shovels-container">
      {shovels.map(shovel => {
        // Вычисляем направление движения к центру блока для анимации "копания"
        const moveX = Math.cos(shovel.angle) * -35; // Более выраженное движение
        const moveY = Math.sin(shovel.angle) * -35;
        
        // Итоговый поворот = базовая ориентация + базовый поворот изображения + индивидуальная вариация
        const finalRotation = shovel.rotation + baseImageRotation + shovel.individualRotation;

        return (
          <motion.div
            key={`digger-${shovel.id}`}
            className="auto-digger"
            style={{
              position: 'absolute',
              left: `50%`,
              top: `50%`,
              transform: `translate(calc(-50% + ${shovel.position.x}px), calc(-50% + ${shovel.position.y + yOffset}px))`,
              pointerEvents: 'none',
            }}
          >
            <motion.img
              src={shovelImage}
              alt="Wooden Shovel"
              className="shovel-image"
              style={{
                width: window.innerWidth <= 480 ? '34px' : '40px',
                height: 'auto',
                transformOrigin: '50% 75%', // Точка вращения ближе к нижней части лопаты
                transform: `rotate(${finalRotation}deg)` // Поворачиваем лопату с учетом всех углов
              }}
              animate={{
                // Анимация "копания" - движение к центру и обратно
                x: [0, moveX, 0],
                y: [0, moveY, 0],
                // Добавляем небольшое вращение для реалистичности
                rotate: [finalRotation, finalRotation - 20, finalRotation]
              }}
              transition={{
                duration: animationDuration,
                repeat: Infinity,
                repeatDelay: 0.8, // Пауза между копаниями
                delay: shovel.delay, // Индивидуальная задержка для каждой лопаты
                ease: "easeInOut" // Более плавная анимация
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};