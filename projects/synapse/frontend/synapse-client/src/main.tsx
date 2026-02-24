import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { store, persistor } from './store/config'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min before a query is considered stale
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: '#111118',
                border: '1px solid #1e1e2e',
                color: '#e2e8f0',
                fontFamily: 'Geist, sans-serif',
                fontSize: '14px',
              }
            }}
          />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
