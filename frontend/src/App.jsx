import React, { useState, useEffect, useCallback } from 'react';
import api from './api';
import Navbar from './components/Navbar';
import StatsHeader from './components/StatsHeader';
import MedicineList from './components/MedicineList';
import MedicineForm from './components/MedicineForm';
import MedicineFilterDetails from './components/MedicineFilterDetails';
import Notification from './components/Notification';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'create' | 'search'
  const [medicines, setMedicines] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [filterResults, setFilterResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchStats = async () => {
    try {
      const res = await api.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    }
  };

  const fetchLookups = async () => {
    try {
      const [catsRes, mansRes] = await Promise.all([
        api.getCategories(),
        api.getManufacturers(),
      ]);
      setCategories(catsRes.data);
      setManufacturers(mansRes.data);
    } catch (err) {
      console.error('Ошибка загрузки справочников:', err);
    }
  };

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getMedicines({
        page,
        limit,
        sort_by: sortBy,
        order,
      });
      setMedicines(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      showNotification('Не удалось загрузить список препаратов', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, order]);

  useEffect(() => {
    fetchMedicines();
    fetchStats();
    fetchLookups();
  }, [fetchMedicines]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setOrder('asc');
    }
  };

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editingMedicine && editingMedicine.id) {
        await api.updateMedicine(editingMedicine.id, data);
        showNotification(`Препарат «${data.name}» успешно обновлен`);
      } else {
        await api.createMedicine(data);
        showNotification(`Препарат «${data.name}» успешно добавлен в базу`);
      }
      setEditingMedicine(null);
      setActiveTab('catalog');
      fetchMedicines();
      fetchStats();
      fetchLookups();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Ошибка при сохранении препарата';
      showNotification(typeof msg === 'string' ? msg : JSON.stringify(msg), 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Вы уверены, что хотите удалить препарат #${id}?`)) return;
    try {
      await api.deleteMedicine(id);
      showNotification(`Препарат #${id} успешно удален`);
      if (selectedMedicine?.id === id) setSelectedMedicine(null);
      fetchMedicines();
      fetchStats();
      fetchLookups();
    } catch (err) {
      showNotification('Ошибка удаления препарата', 'error');
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setActiveTab('create');
  };

  const handleViewDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setActiveTab('search');
  };

  const handleApplyFilters = async (filters) => {
    setLoading(true);
    try {
      if (filters.q) {
        const res = await api.searchMedicines(filters.q);
        setFilterResults(res.data);
      } else {
        const res = await api.getMedicines({
          ...filters,
          page: 1,
          limit: 50,
        });
        setFilterResults(res.data.items);
      }
    } catch (err) {
      showNotification('Ошибка при выполнении поиска', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilterResults([]);
    setSelectedMedicine(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={(tab) => {
        if (tab !== 'create') setEditingMedicine(null);
        setActiveTab(tab);
      }} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StatsHeader stats={stats} />

        {activeTab === 'catalog' && (
          <MedicineList
            medicines={medicines}
            total={total}
            page={page}
            limit={limit}
            setPage={setPage}
            sortBy={sortBy}
            order={order}
            handleSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            loading={loading}
          />
        )}

        {activeTab === 'create' && (
          <MedicineForm
            initialData={editingMedicine}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => {
              setEditingMedicine(null);
              setActiveTab('catalog');
            }}
            categories={categories}
            manufacturers={manufacturers}
          />
        )}

        {activeTab === 'search' && (
          <MedicineFilterDetails
            categories={categories}
            manufacturers={manufacturers}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            selectedMedicine={selectedMedicine}
            onSelectMedicine={setSelectedMedicine}
            onEditMedicine={handleEdit}
            filterResults={filterResults.length > 0 ? filterResults : medicines}
            loading={loading}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          PharmaSystem DevSecOps • Комплексная система аптечного учёта и аналитики • 2026
        </div>
      </footer>

      <Notification notification={notification} onClose={() => setNotification(null)} />
    </div>
  );
}
