import { createSlice } from '@reduxjs/toolkit';

// Ключи для хранения данных
const STORAGE_KEY = 'product_catalog_data';
const RESET_FLAG_KEY = 'product_catalog_reset_flag';

// Функция для добавления кнопки сброса данных
const addResetButton = () => {
  // Проверяем, есть ли флаг сброса
  const resetFlag = localStorage.getItem(RESET_FLAG_KEY);
  
  // Если флаг сброса установлен, очищаем хранилище и сбрасываем флаг
  if (resetFlag === 'true') {
    console.log('Обнаружен флаг сброса, очищаем хранилище');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RESET_FLAG_KEY);
  }
};

// Добавляем функцию для сброса данных вручную
export const resetProductData = () => {
  localStorage.setItem(RESET_FLAG_KEY, 'true');
  window.location.reload();
};

// Проверяем флаг сброса при загрузке модуля
addResetButton();

// Загрузка данных из localStorage
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Ошибка при загрузке данных из localStorage:', e);
    return undefined;
  }
};

// Сохранение данных в localStorage
const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (e) {
    console.error('Ошибка при сохранении данных в localStorage:', e);
  }
};

// Начальное состояние для слайса продуктов
const defaultState = {
  products: [
    {
      id: 1,
      name: 'Смартфон XYZ',
      description: 'Современный смартфон с отличной камерой',
      price: 29999,
      available: true,
      imageUrl: '/img/smartphone_01.webp'
    },
    {
      id: 2,
      name: 'Ноутбук ABC',
      description: 'Мощный ноутбук для работы и игр',
      price: 59999,
      available: true,
      imageUrl: '/img/notebook_01.webp'
    },
    {
      id: 3,
      name: 'Наушники QWE',
      description: 'Беспроводные наушники с шумоподавлением',
      price: 8999,
      available: false,
      imageUrl: ''
    },
    {
      id: 4,
      name: 'Смартфон Pro X',
      description: 'Флагманский смартфон с продвинутой камерой и быстрым процессором',
      price: 49999,
      available: true,
      imageUrl: '/img/smartphone_02.png'
    },
    {
      id: 5,
      name: 'Смартфон Lite',
      description: 'Доступный смартфон с хорошим соотношением цена/качество',
      price: 15999,
      available: true,
      imageUrl: '/img/smartphone_03.webp'
    },
    {
      id: 6,
      name: 'Игровой ноутбук Gamer',
      description: 'Мощный игровой ноутбук с высокопроизводительной видеокартой',
      price: 89999,
      available: true,
      imageUrl: '/img/notebook_02.webp'
    },
    {
      id: 7,
      name: 'Ультрабук Slim',
      description: 'Тонкий и легкий ноутбук для работы и путешествий',
      price: 54999,
      available: false,
      imageUrl: '/img/notebook_01.png'
    }
  ],
  nextId: 8 // Для генерации уникальных ID
};

// Загружаем данные из localStorage или используем значения по умолчанию
const initialState = loadFromLocalStorage() || defaultState;

// Создание слайса продуктов
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Добавление нового продукта
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: state.nextId
      };
      state.products.push(newProduct);
      state.nextId += 1;
      // Сохраняем в localStorage
      saveToLocalStorage(state);
    },
    
    // Удаление продукта по ID
    deleteProduct: (state, action) => {
      state.products = state.products.filter(product => product.id !== action.payload);
      // Сохраняем в localStorage
      saveToLocalStorage(state);
    },
    
    // Обновление информации о продукте
    updateProduct: (state, action) => {
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
        // Сохраняем в localStorage
        saveToLocalStorage(state);
      }
    },
    
    // Изменение доступности продукта
    toggleAvailability: (state, action) => {
      const index = state.products.findIndex(product => product.id === action.payload);
      if (index !== -1) {
        state.products[index].available = !state.products[index].available;
        // Сохраняем в localStorage
        saveToLocalStorage(state);
      }
    }
  }
});

// Экспорт actions и reducer
export const { addProduct, deleteProduct, updateProduct, toggleAvailability } = productsSlice.actions;
export default productsSlice.reducer;
