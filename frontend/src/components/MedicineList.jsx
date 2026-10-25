import React, { useState } from 'react';
import {
  Table,
  LayoutGrid,
  ArrowUpDown,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export default function MedicineList({
  medicines,
  total,
  page,
  limit,
  setPage,
  sortBy,
  order,
  handleSort,
  onEdit,
  onDelete,
  onViewDetails,
  loading,
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const totalPages = Math.ceil(total / limit) || 1;

  const renderPrescriptionBadge = (isPrescription) => {
    if (isPrescription) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Rx Рецепт
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
        <ShieldCheck className="w-3 h-3 mr-1" />
        Без рецепта
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Номенклатура аптечных препаратов</h2>
          <p className="text-xs text-slate-500">
            Отображено {medicines.length} из {total} записей базы данных
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-slate-100 p-1 rounded-lg flex space-x-1 border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center space-x-1 transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Табличный вид"
            >
              <Table className="w-4 h-4" />
              <span className="hidden sm:inline">Таблица</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center space-x-1 transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Карточный вид"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Карточки</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-medium">Загрузка данных из API...</div>
      ) : medicines.length === 0 ? (
        <div className="p-12 text-center text-slate-500 font-medium">Препараты не найдены</div>
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('id')}>
                  <div className="flex items-center space-x-1">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>Наименование</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">Категория</th>
                <th scope="col" className="px-4 py-3">Производитель</th>
                <th scope="col" className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('price')}>
                  <div className="flex items-center space-x-1">
                    <span>Цена</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('stock')}>
                  <div className="flex items-center space-x-1">
                    <span>Остаток</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">Отпуск</th>
                <th scope="col" className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">#{m.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.active_substance} • {m.dosage} ({m.release_form})</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{m.category}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{m.manufacturer}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{m.price.toFixed(2)} ₽</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      m.stock < 30 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {m.stock} шт.
                    </span>
                  </td>
                  <td className="px-4 py-3">{renderPrescriptionBadge(m.is_prescription)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onViewDetails(m)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Подробнее"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(m)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(m.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
          {medicines.map((m) => (
            <div
              key={m.id}
              className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all flex flex-col justify-between bg-white"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-slate-400">ID #{m.id}</span>
                  {renderPrescriptionBadge(m.is_prescription)}
                </div>
                <h3 className="font-bold text-base text-slate-900">{m.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{m.active_substance}</p>
                <div className="text-xs space-y-1 text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div><span className="text-slate-400">Форма:</span> {m.dosage}, {m.release_form}</div>
                  <div><span className="text-slate-400">Категория:</span> {m.category}</div>
                  <div><span className="text-slate-400">Производитель:</span> {m.manufacturer}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-slate-900">{m.price.toFixed(2)} ₽</div>
                  <div className="text-[11px] text-slate-500">Остаток: {m.stock} шт.</div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onViewDetails(m)}
                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    title="Подробнее"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(m)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Редактировать"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(m.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Страница {page} из {totalPages}
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
