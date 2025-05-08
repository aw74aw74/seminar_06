import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Slider, 
  Typography, 
  FormControlLabel, 
  Checkbox,
  Button,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

/**
 * Компонент для фильтрации и поиска продуктов
 * @param {Object} props - Свойства компонента
 * @param {Array} props.products - Массив всех продуктов для определения диапазона цен
 * @param {Function} props.onFilterChange - Функция обратного вызова при изменении фильтров
 */
const ProductFilters = ({ products, onFilterChange }) => {
  // Используем useMemo для вычисления минимальной и максимальной цены
  const { minPrice, maxPrice } = useMemo(() => {
    // Проверка на пустой массив продуктов
    if (products.length === 0) {
      return { minPrice: 0, maxPrice: 100000 };
    }
    return {
      minPrice: Math.min(...products.map(product => product.price)),
      maxPrice: Math.max(...products.map(product => product.price))
    };
  }, [products]); // Пересчитываем при изменении списка продуктов
  
  // Состояния для фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [showAvailable, setShowAvailable] = useState(true);
  const [showUnavailable, setShowUnavailable] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  
  // Обновляем диапазон цен при изменении списка продуктов
  useEffect(() => {
    // Всегда обновляем диапазон цен при изменении списка продуктов
    // Это гарантирует, что при удалении самого дешевого или самого дорогого товара диапазон будет обновлен
    const newRange = [minPrice, maxPrice];
    
    // Проверяем, изменился ли диапазон цен
    const minChanged = priceRange[0] !== minPrice;
    const maxChanged = priceRange[1] !== maxPrice;
    
    // Если минимальная или максимальная цена изменилась, обновляем диапазон
    if (minChanged || maxChanged) {
      console.log('Обновляем диапазон цен:', newRange);
      setPriceRange(newRange);
      applyFilters(searchQuery, newRange, showAvailable, showUnavailable, sortBy);
    }
  }, [products]); // Зависимость от списка продуктов
  
  // Обработчик изменения поискового запроса
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    applyFilters(event.target.value, priceRange, showAvailable, showUnavailable, sortBy);
  };
  
  // Обработчик изменения диапазона цен
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    applyFilters(searchQuery, newValue, showAvailable, showUnavailable, sortBy);
  };
  
  // Обработчик изменения фильтра наличия
  const handleAvailabilityChange = (event) => {
    const { name, checked } = event.target;
    
    if (name === 'available') {
      setShowAvailable(checked);
      applyFilters(searchQuery, priceRange, checked, showUnavailable, sortBy);
    } else {
      setShowUnavailable(checked);
      applyFilters(searchQuery, priceRange, showAvailable, checked, sortBy);
    }
  };
  
  // Обработчик изменения сортировки
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    applyFilters(searchQuery, priceRange, showAvailable, showUnavailable, event.target.value);
  };
  
  // Сброс всех фильтров
  const handleReset = () => {
    setSearchQuery('');
    setPriceRange([minPrice, maxPrice]);
    setShowAvailable(true);
    setShowUnavailable(true);
    setSortBy('default');
    applyFilters('', [minPrice, maxPrice], true, true, 'default');
  };
  
  // Применение фильтров и вызов функции обратного вызова
  const applyFilters = (search, price, available, unavailable, sort) => {
    onFilterChange({
      searchQuery: search,
      priceRange: price,
      availability: { available, unavailable },
      sortBy: sort
    });
  };
  
  return (
    <Box 
      sx={{ 
        position: 'sticky',
        top: 0,
        zIndex: 10,
        mb: 3, 
        p: 2, 
        bgcolor: 'background.paper', 
        borderRadius: 1, 
        boxShadow: 1,
      }}
    >
      {/* Поиск и фильтры в одну строку */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
        {/* Поиск */}
        <TextField
          label="Поиск товаров"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        {/* Сортировка */}
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="sort-select-label">Сортировка</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortBy}
            label="Сортировка"
            onChange={handleSortChange}
          >
            <MenuItem value="default">По умолчанию</MenuItem>
            <MenuItem value="price_asc">По возрастанию цены</MenuItem>
            <MenuItem value="price_desc">По убыванию цены</MenuItem>
            <MenuItem value="name_asc">По названию (А-Я)</MenuItem>
          </Select>
        </FormControl>
        
        {/* Кнопка сброса */}
        <Button 
          variant="outlined" 
          onClick={handleReset} 
          size="small"
        >
          Сбросить
        </Button>
      </Box>
      
      {/* Дополнительные фильтры */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Фильтр по цене */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" gutterBottom>
            Цена:
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Ползунок цены */}
            <Box sx={{ flexGrow: 1 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={minPrice}
                max={maxPrice}
                step={100}
                size="small"
              />
            </Box>
            
            {/* Поля ввода цены */}
            <TextField
              label="От"
              type="number"
              size="small"
              value={priceRange[0]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0 && value <= priceRange[1]) {
                  const newRange = [value, priceRange[1]];
                  setPriceRange(newRange);
                  applyFilters(searchQuery, newRange, showAvailable, showUnavailable, sortBy);
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">₽</InputAdornment>,
              }}
              sx={{ width: 120 }}
            />
            
            <TextField
              label="До"
              type="number"
              size="small"
              value={priceRange[1]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= priceRange[0] && value <= maxPrice) {
                  const newRange = [priceRange[0], value];
                  setPriceRange(newRange);
                  applyFilters(searchQuery, newRange, showAvailable, showUnavailable, sortBy);
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">₽</InputAdornment>,
              }}
              sx={{ width: 120 }}
            />
          </Box>
        </Box>
        
        {/* Фильтр по наличию */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Наличие:</Typography>
          <FormControlLabel
            control={
              <Checkbox 
                checked={showAvailable} 
                onChange={handleAvailabilityChange} 
                name="available" 
                size="small"
              />
            }
            label="В наличии"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={showUnavailable} 
                onChange={handleAvailabilityChange} 
                name="unavailable" 
                size="small"
              />
            }
            label="Нет в наличии"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProductFilters;
