import type { Infrastructure } from '@/types/map';

export const infrastructure: Infrastructure[] = [
  {
    id: 'power',
    name: 'Електростанція',
    description: 'Пошкоджено об\'єкт енергетичної інфраструктури',
    icon: '⚡',
    impact: 'Можливі тимчасові відключення світла у регіоні'
  },
  {
    id: 'water',
    name: 'Водопостачання',
    description: 'Пошкоджено об\'єкт водопостачання',
    icon: '💧',
    impact: 'Можливі перебої з постачанням води'
  },
  {
    id: 'communication',
    name: 'Телекомунікації',
    description: 'Пошкоджено комунікаційну вежу',
    icon: '📡',
    impact: 'Можливі перебої зі зв\'язком та інтернетом'
  },
  {
    id: 'hospital',
    name: 'Лікарня',
    description: 'Пошкоджено медичний заклад',
    icon: '🏥',
    impact: 'Скорочено можливості медичної допомоги'
  },
  {
    id: 'transport',
    name: 'Транспортний вузол',
    description: 'Пошкоджено транспортну інфраструктуру',
    icon: '🚂',
    impact: 'Ускладнено логістику та транспортне сполучення'
  },
  {
    id: 'fuel',
    name: 'Паливний склад',
    description: 'Пошкоджено сховище палива',
    icon: '⛽',
    impact: 'Можливий дефіцит пального в регіоні'
  }
];