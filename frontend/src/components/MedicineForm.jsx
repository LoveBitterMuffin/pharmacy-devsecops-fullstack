import React, { useState, useEffect } from 'react';
import { Save, X, PlusCircle, AlertCircle } from 'lucide-react';

const INITIAL_STATE = {
  name: '',
  active_substance: '',
  category: '',
  manufacturer: '',
  dosage: '',
  release_form: 'Таблетки',
  price: '',
  stock: '',
  is_prescription: false,
  expiration_date: '',
};

export default function MedicineForm({
  initialData,
  onSubmit,
  onCancel,
  categories,
  manufacturers,
}) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        price: initialData.price.toString(),
        stock: initialData.stock.toString(),
        expiration_date: initialData.expiration_date || '',
      });
    } else {
      setFormData(INITIAL_STATE);
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Укажите торговое наименование';
    if (!formData.active_substance.trim()) errs.active_substance = 'Укажите действующее вещество';
    if (!formData.category.trim()) errs.category = 'Выберите или введите категорию';
    if (!formData.manufacturer.trim()) errs.manufacturer = 'Укажите производителя';
    if (!formData.dosage.trim()) errs.dosage = 'Укажите дозировку (напр. 500 мг)';
    if (!formData.release_form.trim()) errs.release_form = 'Укажите форму выпуска';

    const p = parseFloat(formData.price);
    if (isNaN(p) || p <= 0) errs.price = 'Цена должна быть больше 0 ₽';

    const s = parseInt(formData.stock, 10);
    if (isNaN(s) || s < 0) errs.stock = 'Остаток не может быть отрицательным';

    if (!formData.expiration_date) errs.expiration_date = 'Укажите срок годности';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    };

    onSubmit(payload);
  };

  const isEdit = Boolean(initialData && initialData.id);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEdit ? `Редактирование препарата #${initialData.id}` : 'Добавление нового медикамента'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEdit ? 'Обновление параметров существующей записи в БД' : 'Заполните карточку препарата для добавления в каталог'}
            </p>
          </div>
        </div>

        {onCancel && (
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Торговое наименование *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="напр. Амоксиклав"
              className={`w-full text-sm px-3.5 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                errors.name ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-200'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Действующее вещество (МНН) *
            </label>
            <input
              type="text"
              value={formData.active_substance}
              onChange={(e) => setFormData({ ...formData, active_substance: e.target.value })}
              placeholder="напр. Амоксициллин + Клавулановая к-та"
              className={`w-full text-sm px-3.5 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                errors.active_substance ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-200'
              }`}
            />
            {errors.active_substance && <p className="text-xs text-rose-500 mt-1">{errors.active_substance}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Фармацевтическая категория *
            </label>
            <input
              type="text"
              list="categories-list"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="напр. Антибиотики"
              className={`w-full text-sm px-3.5 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                errors.category ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-200'
              }`}
            />
            <datalist id="categories-list">
              {categories.map((c, i) => (
                <option key={i} value={c} />
              ))}
            </datalist>
            {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Производитель и страна *
            </label>
            <input
              type="text"
              list="manufacturers-list"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              placeholder="напр. Lek (Словения)"
              className={`w-full text-sm px-3.5 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                errors.manufacturer ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-300 focus:ring-emerald-200'
              }`}
            />
            <datalist id="manufacturers-list">
              {manufacturers.map((m, i) => (
                <option key={i} value={m} />
              ))}
            </datalist>
            {errors.manufacturer && <p className="text-xs text-rose-500 mt-1">{errors.manufacturer}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Дозировка *</label>
            <input
              type="text"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              placeholder="500 мг"
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-200"
            />
            {errors.dosage && <p className="text-xs text-rose-500 mt-1">{errors.dosage}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Форма выпуска</label>
            <select
              value={formData.release_form}
              onChange={(e) => setFormData({ ...formData, release_form: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-200"
            >
              <option value="Таблетки">Таблетки</option>
              <option value="Капсулы">Капсулы</option>
              <option value="Раствор">Раствор</option>
              <option value="Гель / Мазь">Гель / Мазь</option>
              <option value="Капли">Капли</option>
              <option value="Спрей">Спрей</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Цена (₽) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-200"
            />
            {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Остаток (шт.) *</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="0"
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-200"
            />
            {errors.stock && <p className="text-xs text-rose-500 mt-1">{errors.stock}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Срок годности *</label>
            <input
              type="date"
              value={formData.expiration_date}
              onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-200"
            />
            {errors.expiration_date && <p className="text-xs text-rose-500 mt-1">{errors.expiration_date}</p>}
          </div>

          <div className="flex items-center space-x-3 pt-5">
            <input
              type="checkbox"
              id="is_prescription"
              checked={formData.is_prescription}
              onChange={(e) => setFormData({ ...formData, is_prescription: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="is_prescription" className="text-sm font-medium text-slate-700 select-none">
              Требуется рецепт врача (Отпуск Rx)
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Отмена
            </button>
          )}
          <button
            type="submit"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isEdit ? 'Сохранить изменения' : 'Создать препарат'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
