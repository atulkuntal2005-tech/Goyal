import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initApiBridge } from './services/apiBridge';

// Initialize transparent bridge for Netlify and static hosting
initApiBridge();

createRoot(document.getElementById('root')!).render(<App />);
