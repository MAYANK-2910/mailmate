import { createRoot } from 'react-dom/client';
import { App } from '../components/App';
import '../styles/index.css';

export default defineContentScript({
  matches: ['https://mail.google.com/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'mailman-overlay',
      position: 'inline',
      anchor: 'body',
      append: 'last',
      onMount: (container) => {
        // Overlay container that spans the entire screen but allows clicks to pass through
        // to Gmail by default. Elements inside the React app will capture clicks as needed.
        container.style.position = 'fixed';
        container.style.inset = '0';
        container.style.zIndex = '999999';
        container.style.pointerEvents = 'none';

        const root = createRoot(container);
        root.render(<App />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
