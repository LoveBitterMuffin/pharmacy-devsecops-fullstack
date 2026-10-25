import React, { useState } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  Pill,
  Building2,
  Tag,
  Calendar,
  AlertCircle,
  ShieldCheck,
  CheckCircle,
  Eye,
  Edit2,
  DollarSign,
  Package,
} from 'lucide-react';

export default function MedicineFilterDetails({
  categories,
  manufacturers,
  onApplyFilters,
  onResetFilters,
  selectedMedicine,
  onSelectMedicine,
  onEditMedicine,
  filterResults,
  loading,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [prescriptionFilter, setPrescriptionFilter] = useState('all'); // all, rx, non_rx
  const [inStockOnly, setInStockOnly] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onApplyFilters({
      q: searchQuery.trim(),
      category: category || undefined,
      manufacturer: manufacturer || undefined,
      min_price: minPrice ? parseFloat(minPrice) : undefined,
      max_price: maxPrice ? parseFloat(maxPrice) : undefined,
      is_prescription:
        prescriptionFilter === 'rx' ? true : prescriptionFilter === 'non_rx' ? false : undefined,
      in_stock_only: inStockOnly || undefined,
    });
  };

  const handleReset = () => {
    setSearchQuery('');
    setCategory('');
    setManufacturer('');
    setMinPrice('');
    setMaxPrice('');
    setPrescriptionFilter('all');
    setInStockOnly(false);
    onResetFilters();
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters Control Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">
            Параметры поиска и многокритериальной фильтрации
          </h2>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-4">
          {/* Main search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или действующему веществу (напр. Аспирин, Ибупрофен)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Категория</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">Все категории</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Производитель</label>
              <select
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">Все производители</option>
                {manufacturers.map((m, i) => (
                  <option key={i} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Диапазон цены (₽)</label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  placeholder="От"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 text-xs sm:text-sm px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
                <span className="text-slate-400 text-xs">—</span>
                <input
                  type="number"
                  placeholder="До"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 text-xs sm:text-sm px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Статус отпуска</label>
              <select
                value={prescriptionFilter}
                onChange={(e) => setPrescriptionFilter(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="all">Все препараты</option>
                <option value="non_rx">Только без рецепта</option>
                <option value="rx">Только по рецепту (Rx)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="filter-in-stock"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="filter-in-stock" className="text-xs font-medium text-slate-700 select-none">
                Только имеющиеся на складе (stock &gt; 0)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Сбросить</span>
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Применить фильтры</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results & Selected Medicine Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Results Column */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900">
              Найдено результатов: {filterResults.length}
            </h3>
            <span className="text-xs text-slate-500">Кликните на запись для детального просмотра</span>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
              Поиск и фильтрация данных...
            </div>
          ) : filterResults.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
              По заданным критериям препаратов не найдено
            </div>
          ) : (
            <div className="space-y-2">
              {filterResults.map((m) => {
                const isSelected = selectedMedicine?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMedicine(m)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{m.name}</span>
                        <span className="text-xs text-slate-400 font-mono">#{m.id}</span>
                        {m.is_prescription && (
                          <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                            Rx
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {m.active_substance} • {m.category}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {m.manufacturer} • {m.dosage}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-sm text-slate-900">{m.price.toFixed(2)} ₽</div>
                      <div className="text-xs text-slate-500">В наличии: {m.stock} шт.</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="lg:col-span-5">
          {selectedMedicine ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-20">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono text-slate-400">Карточка препарата #{selectedMedicine.id}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedMedicine.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedMedicine.active_substance}</p>
                </div>
                <button
                  onClick={() => onEditMedicine(selectedMedicine)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Редактировать</span>
                </button>
              </div>

              <div className="py-4 space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                  <span className="flex items-center space-x-1.5 text-slate-500">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Категория:</span>
                  </span>
                  <span className="font-semibold text-slate-900">{selectedMedicine.category}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                  <span className="flex items-center space-x-1.5 text-slate-500">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Производитель:</span>
                  </span>
                  <span className="font-semibold text-slate-900">{selectedMedicine.manufacturer}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                  <span className="flex items-center space-x-1.5 text-slate-500">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    <span>Дозировка и форма:</span>
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedMedicine.dosage}, {selectedMedicine.release_form}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                  <span className="flex items-center space-x-1.5 text-slate-500">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Срок годности:</span>
                  </span>
                  <span className="font-semibold text-slate-900">{selectedMedicine.expiration_date}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                  <span className="flex items-center space-x-1.5 text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Отпуск из аптеки:</span>
                  </span>
                  <span className="font-bold">
                    {selectedMedicine.is_prescription ? (
                      <span className="text-rose-600">Строго по рецепту (Rx)</span>
                    ) : (
                      <span className="text-emerald-600">Без рецепта</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="text-[11px] font-medium text-emerald-700">Розничная цена</div>
                  <div className="text-xl font-black text-emerald-900 mt-0.5">
                    {selectedMedicine.price.toFixed(2)} ₽
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <div className="text-[11px] font-medium text-slate-600">Сумма запаса склада</div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {(selectedMedicine.price * selectedMedicine.stock).toLocaleString('ru-RU', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    ₽
                  </div>
                  <div className="text-[10px] text-slate-500">({selectedMedicine.stock} уп.)</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 sticky top-20">
              <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Выберите препарат из списка слева</p>
              <p className="text-xs mt-1">Здесь отобразятся полные характеристики и расчет запасов</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
