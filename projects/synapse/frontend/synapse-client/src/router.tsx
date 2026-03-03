import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/', element: <LandingPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/chat', element: <ChatPage /> },
      { path: '/chat/:chatId', element: <ChatPage /> },
    ],
  },
])

export default router
