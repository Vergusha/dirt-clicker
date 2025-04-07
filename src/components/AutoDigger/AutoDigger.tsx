import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import shovelImage from '../../assets/wood_shovel.webp';
import { BlockPosition } from '../../types';

interface AutoDiggerProps {
  centerPosition: BlockPosition;
}

/**
 * Компонент AutoDigger для анимации автоматического копания
 */
export const AutoDigger: React.FC<AutoDiggerProps> = ({ centerPosition }) => {
  const { autoClickerCount } = useGameStore();

  // Если нет автокликеров, не рендерим ничего
  if (autoClickerCount <= 0) return null;

  // Создаем массив лопат в соответствии с количеством автокликеров
  const shovels = Array.from({ length: autoClickerCount }, (_, index) => {
    // Вычисляем позицию лопаты вокруг блока земли
    // Угол в радианах, равномерно распределяем лопаты по кругу
    const angle = (index / autoClickerCount) * Math.PI * 2;

    // Радиус круга, по которому распределяем лопаты
    const radius = 100; 

    // Вычисляем координаты на окружности
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // Вычисляем угол поворота лопаты, чтобы она была направлена к блоку
    const rotation = (angle * (180 / Math.PI)) + 230;

    return {
      id: index,
      position: { x, y },
      angle, 
      rotation,
      delay: index * 0.2 // Последовательная задержка для каждой лопаты
    };
  });

  return (
    <div className="shovels-container">
      {shovels.map(shovel => {
        // Вычисляем направление движения к центру блока
        const moveX = Math.cos(shovel.angle) * -20; // Движение к центру по X
        const moveY = Math.sin(shovel.angle) * -20; // Движение к центру по Y

        return (
          <motion.div
            key={`digger-${shovel.id}`}
            className="auto-digger"
            style={{
              position: 'absolute',
              left: `50%`,
              top: `50%`,
              transform: `translate(calc(-50% + ${shovel.position.x + 0}px), calc(-50% + ${shovel.position.y - 75}px))`, // Сдвиг на 10px вправо и 20px вниз
              pointerEvents: 'none',
            }}
          >
            <motion.img
              src={shovelImage}
              alt="Wooden Shovel"
              className="shovel-image"
              style={{
                width: '40px',
                height: 'auto',
                transformOrigin: '50% 75%', // Точка вращения ближе к нижней части лопаты
                transform: `rotate(${shovel.rotation}deg)` // Поворачиваем лопату чтобы она смотрела на блок земли
              }}
              animate={{
                // Анимация "копания" - движение к центру и обратно по вычисленному направлению
                x: [0, moveX, 0],
                y: [0, moveY, 0],
                // Анимация небольшого поворота при копании
                rotate: [shovel.rotation, shovel.rotation - 15, shovel.rotation]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 1.5, // Пауза между копаниями
                delay: shovel.delay // Индивидуальная задержка для каждой лопаты
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};