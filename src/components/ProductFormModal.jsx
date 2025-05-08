import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, updateProduct } from '../store/productsSlice';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ImageIcon from '@mui/icons-material/Image';

/**
 * Модальное окно формы для добавления и редактирования продуктов
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.open - Флаг открытия модального окна
 * @param {Function} props.onClose - Функция закрытия модального окна
 * @param {Object} props.editingProduct - Продукт для редактирования (null при создании нового)
 */
const ProductFormModal = ({ open, onClose, editingProduct }) => {
  const dispatch = useDispatch();
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
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
        imageUrl: editingProduct.imageUrl || '',
        available: editingProduct.available
      });
    } else {
      // Сброс формы при отмене редактирования
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        available: true
      });
    }
    // Сброс ошибок при изменении редактируемого продукта
    setErrors({});
  }, [editingProduct, open]);

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
    
    // Валидация URL изображения, если он указан
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Введите корректный URL изображения';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Проверка валидности URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
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
    } else {
      // Добавление нового продукта
      dispatch(addProduct(productData));
    }
    
    // Закрытие модального окна после успешного сохранения
    onClose();
  };

  // Предпросмотр изображения
  const ImagePreview = () => {
    if (!formData.imageUrl) return null;
    
    return (
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="subtitle2" gutterBottom>
          Предпросмотр изображения:
        </Typography>
        <Box 
          component="img" 
          src={formData.imageUrl} 
          alt="Предпросмотр" 
          sx={{ 
            maxWidth: '100%', 
            maxHeight: 150, 
            objectFit: 'contain',
            border: '1px solid #ddd',
            borderRadius: 1,
            p: 1
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x150?text=Ошибка+загрузки+изображения';
          }}
        />
      </Box>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        {editingProduct ? 'Редактирование продукта' : 'Добавление нового продукта'}
      </DialogTitle>
      
      <DialogContent dividers>
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
          
          {/* Поле для URL изображения */}
          <TextField
            margin="normal"
            fullWidth
            id="imageUrl"
            label="URL изображения"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl || 'Укажите URL изображения или загрузите файл ниже'}
            InputProps={{
              startAdornment: <ImageIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          
          {/* Загрузка изображения с компьютера */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Или загрузите изображение с компьютера:
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Рекомендуется использовать изображения из папки <Box component="span" sx={{ fontWeight: 'bold' }}>public/img</Box>
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-file"
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // Создаем локальный URL для файла
                  const localUrl = URL.createObjectURL(file);
                  setFormData(prev => ({
                    ...prev,
                    imageUrl: localUrl
                  }));
                  
                  // Сбрасываем ошибку, если она была
                  if (errors.imageUrl) {
                    setErrors(prev => ({
                      ...prev,
                      imageUrl: ''
                    }));
                  }
                }
              }}
            />
            <label htmlFor="image-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<ImageIcon />}
              >
                Выбрать файл
              </Button>
            </label>
          </Box>
          
          <ImagePreview />
          
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
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<CancelIcon />}
          onClick={onClose}
        >
          Отмена
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          color={editingProduct ? "success" : "primary"}
          startIcon={editingProduct ? <SaveIcon /> : <AddIcon />}
          onClick={handleSubmit}
        >
          {editingProduct ? 'Сохранить изменения' : 'Добавить продукт'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormModal;
