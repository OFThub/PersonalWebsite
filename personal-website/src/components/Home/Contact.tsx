'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (formData.message.length < 10) {
      setErrors({ message: 'Mesaj en az 10 karakter olmalı.' });
      return;
    }

    setSending(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Mesajınız başarıyla gönderildi!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || 'Bir hata oluştu' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bağlantı hatası' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen py-20 px-6 relative z-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-5xl font-bold mb-12 flex items-center gap-3">
          <Mail className="text-cyan-400" />
          <span className="bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            İletişim
          </span>
        </h2>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/50 text-green-400'
                : 'bg-red-500/10 border-red-500/50 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' && <CheckCircle2 size={20} />}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Ad Soyad"
              type="text"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
              placeholder="Adınız Soyadınız"
              required
            />
            <InputField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(v) => setFormData({ ...formData, email: v })}
              placeholder="email@ornek.com"
              required
            />
          </div>

          <InputField
            label="Konu"
            type="text"
            value={formData.subject}
            onChange={(v) => setFormData({ ...formData, subject: v })}
            placeholder="Mesaj konusu"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mesaj</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.message ? 'border-red-500' : 'border-cyan-500/30'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition resize-none`}
              placeholder="Mesajınızı buraya yazın..."
              required
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-400 animate-pulse">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Gönderiliyor...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Gönder</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}