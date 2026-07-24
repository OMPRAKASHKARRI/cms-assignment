import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/settings').then(({ data }) => setSettings(data.data));
  }, []);

  if (!settings) return <p className="text-gray-500">Loading…</p>;

  const set = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const { data } = await api.put('/settings', {
        siteName: settings.siteName,
        contactEmail: settings.contactEmail,
        footer: settings.footer,
        navLinks: settings.navLinks,
      });
      setSettings(data.data);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Site Settings</h1>
      <p className="text-gray-500 text-sm mb-6">Global values used across the public site (nav, footer, contact)</p>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Site name</label>
          <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={settings.siteName} onChange={(e) => set({ siteName: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Contact email</label>
          <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={settings.contactEmail} onChange={(e) => set({ contactEmail: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Footer text</label>
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={settings.footer?.text || ''}
            onChange={(e) => set({ footer: { ...settings.footer, text: e.target.value } })}
          />
        </div>

        {saved && <p className="text-sm text-brand-600">Saved.</p>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}
