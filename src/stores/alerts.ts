import type { Alert } from '@/types';

export const alerts: Alert[] = [
  {
    id: 'missile',
    name: 'Ракетний обстріл',
    description: 'Загроза ракетного обстрілу',
    severity: 'high',
    image_path: '@/assets/images/missile.webp',
    color: '#ff3b30',
  },
  {
    id: 'drone',
    name: 'Дрони',
    description: 'Виявлено безпілотники',
    severity: 'medium',
    image_path: '@/assets/images/drone.webp',
    color: '#ff9500',
  },
  {
    id: 'aircraft',
    name: 'Авіація',
    description: 'Загроза повітряного нападу',
    severity: 'high',
    image_path: '@/assets/images/aircraft.webp',
    color: '#ff2d55',
  },
  {
    id: 'artillery',
    name: 'Артилерія',
    description: 'Загроза артилерійського обстрілу',
    severity: 'medium',
    image_path: '@/assets/images/artillery.webp',
    color: '#ff5000',
  },
  {
    id: 'chemical',
    name: 'Хімічна загроза',
    description: 'Загроза хімічної зброї',
    severity: 'high',
    image_path: '@/assets/images/chemical.webp',
    color: '#af52de',
  },
  {
    id: 'nuclear',
    name: 'Ядерна атака',
    description: 'Загроза ядерної атаки',
    severity: 'high',
    image_path: '@/assets/images/nuclear.webp',
    color: '#ff0000',
  },
];
