import React from 'react';
import { Package, Boxes, CreditCard, ShieldAlert } from 'lucide-react';

export default function StatsHeader({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Всего препаратов',
      value: stats.total_items,
      sub: `${stats.categories_count} категорий`,
      icon: Package,
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Запас на складе',
      value: `${stats.total_stock.toLocaleString()} шт.`,
      sub: `${stats.manufacturers_count} производителей`,
      icon: Boxes,
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Средняя цена',
      value: `${stats.avg_price} ₽`,
      sub: 'по всей номенклатуре',
      icon: CreditCard,
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Рецептурные (Rx)',
      value: stats.prescription_count,
      sub: `Без рецепта: ${stats.non_prescription_count}`,
      icon: ShieldAlert,
      color: 'from-rose-500 to-red-600',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-start justify-between transition-all hover:shadow-md"
          >
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h3>
              <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
            </div>
            <div className={`p-2.5 rounded-xl border ${card.bg}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
