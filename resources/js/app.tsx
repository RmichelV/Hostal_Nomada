import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { RouteContext } from '@/Hooks/useRoute';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName =
  window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
  title: title => `${title} - ${appName}`,
  progress: {
    color: '#4B5563',
  },
  resolve: async name => {
    // Usa glob para múltiples extensiones
    const pages = import.meta.glob('./Pages/**/*.{tsx,jsx}');

    // Resuelve dinámicamente el componente
    const importPage =
      pages[`./Pages/${name}.tsx`] || pages[`./Pages/${name}.jsx`];

    if (!importPage) {
      throw new Error(`Page not found: ${name}`);
    }

    // Resuelve la promesa antes de devolverla
    return await importPage();
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    return root.render(
      <RouteContext.Provider value={(window as any).route}>
        <App {...props} />
      </RouteContext.Provider>,
    );
  },
});
