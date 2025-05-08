import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  Typography, 
  Box, 
  Button, 
  Fab, 
  Alert
} from '@mui/material';
import ProductItem from './ProductItem';
import ProductFormModal from './ProductFormModal';
import ProductFilters from './ProductFilters';
import AddIcon from '@mui/icons-material/Add';
import { resetProductData } from '../store/productsSlice';

/**
 * Компонент для отображения списка продуктов
 */
const ProductList = () => {
  // Получаем список продуктов из Redux store
  const allProducts = useSelector(state => state.products.products);
  
  // Состояние для хранения продукта для редактирования
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Состояние для открытия/закрытия модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Состояние для фильтров
  const [filters, setFilters] = useState({
    searchQuery: '',
    priceRange: [0, 100000],
    availability: { available: true, unavailable: true },
    sortBy: 'default'
  });

  // Функция для начала редактирования продукта
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Функция для открытия модального окна добавления продукта
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Функция для закрытия модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Функция для обработки изменения фильтров
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Функция для сброса данных
  const handleResetData = () => {
    resetProductData();
  };

  // Фильтрация и сортировка продуктов
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Фильтр по поисковому запросу
      const matchesSearch = filters.searchQuery === '' || 
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
        product.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      // Фильтр по цене
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      
      // Фильтр по наличию
      const matchesAvailability = 
        (product.available && filters.availability.available) || 
        (!product.available && filters.availability.unavailable);
      
      return matchesSearch && matchesPrice && matchesAvailability;
    }).sort((a, b) => {
      // Сортировка
      switch (filters.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        default:
          return a.id - b.id; // По умолчанию сортируем по ID
      }
    });
  }, [allProducts, filters]);

  // Проверка наличия отфильтрованных продуктов
  const hasFilteredProducts = filteredProducts.length > 0;

  return (
    <>
      {/* Заголовок и кнопки */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Каталог продуктов
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined" 
            color="error" 
            onClick={handleResetData}
            sx={{ height: 40 }}
          >
            Сбросить данные
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
          >
            Добавить продукт
          </Button>
        </Box>
      </Box>
      
      {/* Фильтры и поиск */}
      <ProductFilters 
        products={allProducts} 
        onFilterChange={handleFilterChange} 
      />
      
      {/* Основной контейнер с товарами */}
      <Box sx={{ mt: 8 }}> {/* Добавляем отступ сверху для фиксированной панели фильтров */}
        {allProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Каталог пуст
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Добавьте новый продукт, нажав на кнопку "Добавить продукт"
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddProduct}
              sx={{ mt: 2 }}
            >
              Добавить продукт
            </Button>
          </Box>
        ) : !hasFilteredProducts ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            По вашему запросу ничего не найдено. Попробуйте изменить параметры фильтра.
          </Alert>
        ) : (
          <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Найдено товаров: {filteredProducts.length}
              </Typography>
              {filters.searchQuery && (
                <Typography variant="body2" color="primary">
                  Поиск: "{filters.searchQuery}"
                </Typography>
              )}
            </Box>
            
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                {filteredProducts.map(product => (
                  <Box key={product.id}>
                    <ProductItem 
                      product={product} 
                      onEdit={handleEdit} 
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}
      </Box>
      
      {/* Плавающая кнопка добавления (для мобильных устройств) */}
      <Fab 
        color="primary" 
        aria-label="Добавить продукт"
        onClick={handleAddProduct}
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          display: { xs: 'flex', md: 'none' } // Отображается только на мобильных устройствах
        }}
      >
        <AddIcon />
      </Fab>
      
      {/* Модальное окно для добавления/редактирования продукта */}
      <ProductFormModal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        editingProduct={editingProduct} 
      />
    </>
  );
};

export default ProductList;
