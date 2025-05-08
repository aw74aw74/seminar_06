import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteProduct, toggleAvailability } from '../store/productsSlice';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Chip, 
  Box, 
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

/**
 * Компонент для отображения отдельного продукта
 * @param {Object} props - Свойства компонента
 * @param {Object} props.product - Информация о продукте
 * @param {Function} props.onEdit - Функция для редактирования продукта
 */
const ProductItem = ({ product, onEdit }) => {
  const dispatch = useDispatch();

  // Обработчик удаления продукта
  const handleDelete = () => {
    dispatch(deleteProduct(product.id));
  };

  // Обработчик изменения доступности продукта
  const handleToggleAvailability = () => {
    dispatch(toggleAvailability(product.id));
  };

  // Проверка наличия изображения
  const hasImage = product.imageUrl && product.imageUrl.trim() !== '';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexGrow: 1 }}>
        {/* Блок с изображением (слева) */}
        <Box
          sx={{
            width: { xs: '100%', sm: '40%' },
            height: { xs: 200, sm: 'auto' },
            minHeight: { sm: 220 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderTopLeftRadius: 4,
            borderTopRightRadius: { xs: 4, sm: 0 },
            borderBottomLeftRadius: { xs: 0, sm: 4 },
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {hasImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                padding: '8px'
              }}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ImageNotSupportedIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Нет фото
              </Typography>
            </Box>
          )}
          
          {/* Чип доступности */}
          <Chip 
            label={product.available ? "В наличии" : "Нет в наличии"} 
            color={product.available ? "success" : "error"} 
            size="small" 
            sx={{ position: 'absolute', top: 8, left: 8 }} 
          />
        </Box>

        {/* Информация о продукте (справа) */}
        <CardContent sx={{ width: { xs: '100%', sm: '60%' }, p: 2, pb: 1 }}>
          <Typography variant="h6" component="div">
            {product.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2, height: { xs: 60, sm: 80 }, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.description}
          </Typography>
          
          <Typography variant="h6" color="primary">
            {product.price.toLocaleString()} ₽
          </Typography>
        </CardContent>
      </Box>
      
      <Divider />
      
      {/* Кнопки управления (внизу) */}
      <CardActions sx={{ p: 1, pt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          startIcon={<EditIcon />} 
          onClick={() => onEdit(product)}
          size="small"
        >
          Редактировать
        </Button>
        
        <Button 
          variant="outlined" 
          color={product.available ? "warning" : "success"}
          startIcon={product.available ? <ToggleOffIcon /> : <ToggleOnIcon />}
          onClick={handleToggleAvailability}
          size="small"
        >
          {product.available ? "Снять с продажи" : "Вернуть в продажу"}
        </Button>
        
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<DeleteIcon />} 
          onClick={handleDelete}
          size="small"
        >
          Удалить
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductItem;
