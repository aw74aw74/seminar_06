import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, updateProduct } from '../store/productsSlice';
import { 
  Box, 
  TextField, 
  Button, 
  FormControlLabel, 
  Switch, 
  Paper, 
  Stack 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 * Компонент формы для добавления и редактирования продуктов
 * @param {Object} props - Свойства компонента
 * @param {Object} props.editingProduct - Продукт для редактирования (null при создании нового)
 * @param {Function} props.onCancelEdit - Функция для отмены редактирования
 */
const ProductForm = ({ editingProduct, onCancelEdit }) => {
  const dispatch = useDispatch();
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    available: true
  });
  
  // Состояние для отслеживания ошибок валидации
  const [errors, setErrors] = useState({});

  // Обновление формы при изменении редактируемого продукта
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        available: editingProduct.available
      });
    } else {
      // Сброс формы при отмене редактирования
      setFormData({
        name: '',
        description: '',
        price: '',
        available: true
      });
    }
    // Сброс ошибок при изменении редактируемого продукта
    setErrors({});
  }, [editingProduct]);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Сброс ошибки для поля при его изменении
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Название продукта обязательно';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Описание продукта обязательно';
    }
    
    if (!formData.price) {
      newErrors.price = 'Цена продукта обязательна';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Цена должна быть положительным числом';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const productData = {
      ...formData,
      price: Number(formData.price)
    };
    
    if (editingProduct) {
      // Обновление существующего продукта
      dispatch(updateProduct({
        ...productData,
        id: editingProduct.id
      }));
      onCancelEdit(); // Сброс режима редактирования
    } else {
      // Добавление нового продукта
      dispatch(addProduct(productData));
      // Сброс формы после добавления
      setFormData({
        name: '',
        description: '',
        price: '',
        available: true
      });
    }
  };

  // Обработчик отмены редактирования
  const handleCancel = () => {
    onCancelEdit();
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Название продукта"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          label="Описание продукта"
          name="description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="price"
          label="Цена (₽)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          error={!!errors.price}
          helperText={errors.price}
          InputProps={{
            endAdornment: <Box component="span">₽</Box>
          }}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={formData.available}
              onChange={handleChange}
              name="available"
              color="primary"
            />
          }
          label="Доступен для продажи"
          sx={{ my: 2 }}
        />
        
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color={editingProduct ? "success" : "primary"}
            startIcon={editingProduct ? <SaveIcon /> : <AddIcon />}
          >
            {editingProduct ? 'Сохранить изменения' : 'Добавить продукт'}
          </Button>
          
          {editingProduct && (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              Отменить редактирование
            </Button>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default ProductForm;
