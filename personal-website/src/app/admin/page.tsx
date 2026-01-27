'use client';

import { useEffect, useState } from 'react';
import { useSite } from '../../context/SiteContext';

export default function AdminPage() {
  const { siteData, saveSiteData } = useSite();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (siteData) {
      setFormData({
        name: siteData.name,
        title: siteData.title,
        description: siteData.description,
      });
    }
  }, [siteData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.title || !formData.description) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setSaving(true);
      await saveSiteData(formData);
      alert('Kaydedildi ✅');
    } catch {
      alert('Kaydedilirken hata oluştu ❌');
    } finally {
      setSaving(false);
    }
  };

  if (!siteData) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="max-w-xl bg-white/5 p-6 rounded-xl border border-cyan-500/20 space-y-4">
        <h2 className="text-2xl font-semibold text-cyan-400">
          Hero / Hakkımda Bilgileri
        </h2>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="İsim"
          className="w-full p-3 bg-black/30 border border-cyan-500/20 rounded"
        />

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ünvan"
          className="w-full p-3 bg-black/30 border border-cyan-500/20 rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Açıklama"
          rows={4}
          className="w-full p-3 bg-black/30 border border-cyan-500/20 rounded resize-none"
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 rounded-lg font-semibold transition
            ${
              saving
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-linear-to-r from-cyan-500 to-emerald-500 hover:shadow-lg hover:shadow-cyan-500/40'
            }
          `}
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </div>
  );
}
