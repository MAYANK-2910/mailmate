import { useSettingsStore } from '../../store/settingsStore';
import { Toggle } from '../ui/Toggle';
import { SHORTCUTS } from '../../constants/shortcuts';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { 
    enableSmartStacks, enablePriorityRanking, enableFocusMode, 
    compactMode, updateSettings, keyboardShortcutsEnabled 
  } = useSettingsStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-overlay z-40" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.15 }} className="fixed inset-4 z-50 flex items-start justify-center pt-[10%]">
            <div className="w-full max-w-sm bg-bg-secondary border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="text-sm font-semibold text-text-primary">Settings</h2>
                <button onClick={onClose} className="text-text-muted hover:text-text-primary text-sm p-1 rounded hover:bg-bg-tertiary transition-colors">✕</button>
              </div>

              <div className="p-4 space-y-4 max-h-80 overflow-y-auto scrollbar-thin">
                <SettingRow label="Smart Stacks" description="Automatically group emails into smart categories">
                  <Toggle enabled={enableSmartStacks} onChange={(v) => updateSettings({ enableSmartStacks: v })} size="sm" />
                </SettingRow>

                <SettingRow label="Priority Ranking" description="Rank important emails and humans first">
                  <Toggle enabled={enablePriorityRanking} onChange={(v) => updateSettings({ enablePriorityRanking: v })} size="sm" />
                </SettingRow>

                <SettingRow label="Focus Mode" description="Hide unimportant categories to stay focused">
                  <Toggle enabled={enableFocusMode} onChange={(v) => updateSettings({ enableFocusMode: v })} size="sm" />
                </SettingRow>

                <SettingRow label="Compact Mode" description="Show more emails with less spacing">
                  <Toggle enabled={compactMode} onChange={(v) => updateSettings({ compactMode: v })} size="sm" />
                </SettingRow>

                <SettingRow label="Keyboard Shortcuts" description="Enable J/K navigation and shortcuts">
                  <Toggle enabled={keyboardShortcutsEnabled} onChange={(v) => updateSettings({ keyboardShortcutsEnabled: v })} size="sm" />
                </SettingRow>

                <div className="pt-2 border-t border-border">
                  <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Keyboard Shortcuts</h3>
                  <div className="space-y-1">
                    {SHORTCUTS.slice(0, 10).map((s) => (
                      <div key={s.action} className="flex items-center justify-between py-1">
                        <span className="text-[11px] text-text-secondary">{s.label}</span>
                        <kbd className="text-[10px] text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded font-mono">
                          {s.modifiers.length > 0 ? s.modifiers.map((m) => m === 'meta' ? '⌘' : m).join('+') + '+' : ''}{s.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-[11px] text-text-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}
