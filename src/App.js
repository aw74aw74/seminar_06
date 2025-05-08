import React from 'react';
import { Provider } from 'react-redux';
import { CssBaseline, Container } from '@mui/material';
import store from './store';
import ProductList from './components/ProductList';
import './App.css';

/**
 * Главный компонент приложения
 * Оборачивает все компоненты в Provider для доступа к Redux store
 */
function App() {
  return (
    <Provider store={store}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <ProductList />
      </Container>
    </Provider>
  );
}

export default App;
