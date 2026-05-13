import { createRoot } from 'react-dom/client';
import { App } from '../components/App';
import '../styles/index.css';
import { routeManager } from '../services/gmail/routeManager';
import { mountManager } from '../services/gmail/mountManager';
import { Watchdog } from '../services/runtime/watchdog';
import { getCapability } from '../services/gmail/routeCapabilities';

export default defineContentScript({
  matches: ['https://mail.google.com/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    let ui: any = null;

    // Inject styles globally to hide Gmail native list when Mailman is active
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      body[data-mailman-active="true"] .aKB { display: none !important; }
      body[data-mailman-active="true"] div[role="main"] > .aeF { display: none !important; }
    `;
    document.head.appendChild(styleEl);

    function updateVisibility() {
      const isInbox = window.location.hash.startsWith('#inbox') || window.location.hash === '';
      if (isInbox) {
        document.body.setAttribute('data-mailman-active', 'true');
        if (ui && ui.wrapper) ui.wrapper.style.display = 'block';
      } else {
        document.body.setAttribute('data-mailman-active', 'false');
        if (ui && ui.wrapper) ui.wrapper.style.display = 'none';
      }
    }

    window.addEventListener('hashchange', updateVisibility);

    const observer = new MutationObserver(async () => {
      const mainContainer = document.querySelector('div[role="main"]');
      if (mainContainer && !document.querySelector('mailman-overlay')) {
        observer.disconnect();

        ui = await createShadowRootUi(ctx, {
          name: 'mailman-overlay',
          position: 'inline',
          anchor: mainContainer,
          append: 'first',
          onMount: (container) => {
            container.style.display = 'block';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.overflow = 'hidden';

            const root = createRoot(container);
            root.render(<App />);
            return root;
          },
          onRemove: (root) => {
            root?.unmount();
          },
        });

        ui.mount();
        updateVisibility();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  },
});
