import React from 'react';
import ReactDOM from 'react-dom/client';

// Компоненты
import { App } from './components/App';

// React router
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import store from './store/store';

// Стили
import './normalize.css';
import ProductPage from './components/ProductPage';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(

  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/product/:id' element={<ProductPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
