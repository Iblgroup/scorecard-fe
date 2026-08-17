import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { Provider as ChakraProvider } from '@/providers/chakra-provider';
import { QueryProvider } from '@/providers/query-provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <ReduxProvider store={store}>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ReduxProvider>
    </QueryProvider>
  </React.StrictMode>
);
