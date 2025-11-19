import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './Context/AuthContext';
import { BrowserRouter } from 'react-router-dom';



// Context

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <ToastContainer position="top-right" />
    </AuthProvider>
  </BrowserRouter>

);