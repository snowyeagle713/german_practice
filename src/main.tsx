import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import './ui/theme/tokens.css';
import './ui/styles.css';

document.documentElement.dataset.theme = 'lingua-learning';
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
