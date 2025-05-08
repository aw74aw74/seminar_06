import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';

// Настройка хранилища Redux с использованием configureStore
const store = configureStore({
  reducer: {
    products: productsReducer
  }
});

export default store;
