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

    const handleUpdate = () => {
      const route = routeManager.getRoute();
      const capability = getCapability(route);
      
      if (capability.showMailman) {
        mountManager.mountToMain();
      } else {
        mountManager.unmountFromMain();
      }
    };

    routeManager.onRouteOY(handleUpdate);

    const watchdog = new Watchdog(
      () => {
        const route = routeManager.getRoute();
        const capability = getCapability(route);
        if (!capability.showMailman) return true;
        return mountManager.isMounted();
      },
      () => handleUpdate()
    );

    const container = mountManager.createMountPoint('mailman-workspace');
    const root = createRoot(container);
    root.render(<App />);

    watchdog.start();
    handleUpdate();
  },
});
