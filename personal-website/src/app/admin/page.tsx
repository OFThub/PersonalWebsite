'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Settings,
  Code,
  Briefcase,
  FolderKanban,
  Mail as MailIcon,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  LogOut,
  BarChart3
} from 'lucide-react';

import chart from '@/components/AnalyticsDashboard/AnalyticsDashboard';

type TabType = 'overview' | 'site' | 'skills' | 'experiences' | 'projects' | 'contacts';

export default function AdminPage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(false);

  // Data states
  const [siteData, setSiteData] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'skill' | 'experience' | 'project' | null>(null);

  // Form states
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      const [siteRes, skillsRes, expRes, projRes, contactsRes] = await Promise.all([
        fetch('/api/site'),
        fetch('/api/skills'),
        fetch('/api/experiences'),
        fetch('/api/projects'),
        fetch('/api/contacts')
      ]);

      if (siteRes.ok) setSiteData(await siteRes.json());
      if (skillsRes.ok) setSkills(await skillsRes.json());
      if (expRes.ok) setExperiences(await expRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (contactsRes.ok) setContacts(await contactsRes.json());
    } catch (error) {
      console.error('Data fetch error:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // CRUD Operations
  const handleCreate = (type: 'skill' | 'experience' | 'project') => {
    setModalType(type);
    setEditingItem(null);
    
    // Set default values based on type
    if (type === 'skill') {
      setFormData({ name: '', category: 'other', level: 50, icon: '', order: 0 });
    } else if (type === 'experience') {
      setFormData({ title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', technologies: [], order: 0 });
    } else if (type === 'project') {
      setFormData({ title: '', description: '', longDescription: '', technologies: [], github: '', demo: '', image: '', featured: false, status: 'completed', order: 0 });
    }
    
    setShowModal(true);
  };

  const handleEdit = (type: 'skill' | 'experience' | 'project', item: any) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!modalType) return;
    
    setLoading(true);
    try {
      const endpoint = `/api/${modalType === 'skill' ? 'skills' : modalType === 'experience' ? 'experiences' : 'projects'}`;
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `${endpoint}/${editingItem._id}` : endpoint;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert(editingItem ? 'Güncellendi!' : 'Eklendi!');
        setShowModal(false);
        fetchAllData();
      } else {
        const data = await res.json();
        alert(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      alert('İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'skill' | 'experience' | 'project', id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;

    try {
      const endpoint = `/api/${type === 'skill' ? 'skills' : type === 'experience' ? 'experiences' : 'projects'}`;
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });

      if (res.ok) {
        alert('Silindi!');
        fetchAllData();
      }
    } catch (error) {
      alert('Silme başarısız');
    }
  };

  const handleSiteSettingsUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Site ayarları güncellendi!');
        fetchAllData();
        setFormData({});
      }
    } catch (error) {
      alert('Güncelleme başarısız');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-cyan-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Hoş geldin, {user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition"
            >
              <LogOut size={18} />
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
            { id: 'site', label: 'Site Ayarları', icon: Settings },
            { id: 'skills', label: 'Yetenekler', icon: Code },
            { id: 'experiences', label: 'Deneyimler', icon: Briefcase },
            { id: 'projects', label: 'Projeler', icon: FolderKanban },
            { id: 'contacts', label: 'Mesajlar', icon: MailIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 border border-cyan-500/20'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          <chart></chart>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Yetenekler" value={skills.length} icon={Code} />
            <StatCard title="Deneyimler" value={experiences.length} icon={Briefcase} />
            <StatCard title="Projeler" value={projects.length} icon={FolderKanban} />
            <StatCard title="Yeni Mesajlar" value={contacts.filter(c => c.status === 'new').length} icon={MailIcon} />
          </div>
        )}

        {/* Site Settings Tab */}
        {activeTab === 'site' && siteData && (
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Site Ayarları</h2>
            <div className="space-y-4">
              <InputField 
                label="İsim" 
                value={formData.name !== undefined ? formData.name : siteData.name} 
                onChange={(v: string) => setFormData({...siteData, ...formData, name: v})} 
              />
              <InputField 
                label="Başlık" 
                value={formData.title !== undefined ? formData.title : siteData.title} 
                onChange={(v: string) => setFormData({...siteData, ...formData, title: v})} 
              />
              <TextAreaField 
                label="Açıklama" 
                value={formData.description !== undefined ? formData.description : siteData.description} 
                onChange={(v: string) => setFormData({...siteData, ...formData, description: v})} 
              />
              <TextAreaField 
                label="Bio (Hakkımda)" 
                value={formData.bio !== undefined ? formData.bio : siteData.bio} 
                onChange={(v: string) => setFormData({...siteData, ...formData, bio: v})} 
              />
              <InputField 
                label="Email" 
                value={formData.email !== undefined ? formData.email : siteData.email} 
                onChange={(v: string) => setFormData({...siteData, ...formData, email: v})} 
              />
              <InputField 
                label="Telefon" 
                value={formData.phone !== undefined ? formData.phone : siteData.phone} 
                onChange={(v: string) => setFormData({...siteData, ...formData, phone: v})} 
              />
              <InputField 
                label="GitHub" 
                value={formData.github !== undefined ? formData.github : siteData.github} 
                onChange={(v: string) => setFormData({...siteData, ...formData, github: v})} 
              />
              <InputField 
                label="LinkedIn" 
                value={formData.linkedin !== undefined ? formData.linkedin : siteData.linkedin} 
                onChange={(v: string) => setFormData({...siteData, ...formData, linkedin: v})} 
              />
              <InputField 
                label="Twitter" 
                value={formData.twitter !== undefined ? formData.twitter : siteData.twitter} 
                onChange={(v: string) => setFormData({...siteData, ...formData, twitter: v})} 
              />
              <InputField 
                label="CV URL" 
                value={formData.resumeUrl !== undefined ? formData.resumeUrl : siteData.resumeUrl} 
                onChange={(v: string) => setFormData({...siteData, ...formData, resumeUrl: v})} 
              />
              
              <button
                onClick={handleSiteSettingsUpdate}
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <DataTable
            title="Yetenekler"
            data={skills}
            columns={['name', 'category', 'level']}
            onAdd={() => handleCreate('skill')}
            onEdit={(item: any) => handleEdit('skill', item)}
            onDelete={(id: string) => handleDelete('skill', id)}
          />
        )}

        {/* Experiences Tab */}
        {activeTab === 'experiences' && (
          <DataTable
            title="Deneyimler"
            data={experiences}
            columns={['title', 'company', 'startDate']}
            onAdd={() => handleCreate('experience')}
            onEdit={(item: any) => handleEdit('experience', item)}
            onDelete={(id: string) => handleDelete('experience', id)}
          />
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <DataTable
            title="Projeler"
            data={projects}
            columns={['title', 'status', 'featured']}
            onAdd={() => handleCreate('project')}
            onEdit={(item: any) => handleEdit('project', item)}
            onDelete={(id: string) => handleDelete('project', id)}
          />
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Mesajlar ({contacts.length})</h2>
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Henüz mesaj yok</p>
              ) : (
                contacts.map(contact => (
                  <div key={contact._id} className="bg-white/5 border border-cyan-500/20 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{contact.name}</h3>
                        <p className="text-gray-400 text-sm">{contact.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        contact.status === 'new' ? 'bg-green-500/20 text-green-400' :
                        contact.status === 'read' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                    {contact.subject && <p className="text-cyan-400 mb-2">{contact.subject}</p>}
                    <p className="text-gray-300">{contact.message}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(contact.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-cyan-500/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingItem ? 'Düzenle' : 'Yeni Ekle'} - {
                  modalType === 'skill' ? 'Yetenek' : 
                  modalType === 'experience' ? 'Deneyim' : 
                  'Proje'
                }
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={24} />
              </button>
            </div>

            {/* Dynamic Form Based on Type */}
            <div className="space-y-4">
              {modalType === 'skill' && (
                <>
                  <InputField label="İsim" value={formData.name || ''} onChange={(v: string) => setFormData({...formData, name: v})} />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                    <select
                      value={formData.category || 'other'}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="tools">Tools</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Seviye (0-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.level || 50}
                      onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <InputField label="İkon (opsiyonel)" value={formData.icon || ''} onChange={(v: string) => setFormData({...formData, icon: v})} />
                  <InputField label="Sıra" value={formData.order || 0} onChange={(v: string) => setFormData({...formData, order: parseInt(v) || 0})} />
                </>
              )}

              {modalType === 'experience' && (
                <>
                  <InputField label="Pozisyon" value={formData.title || ''} onChange={(v: string) => setFormData({...formData, title: v})} />
                  <InputField label="Şirket" value={formData.company || ''} onChange={(v: string) => setFormData({...formData, company: v})} />
                  <InputField label="Lokasyon" value={formData.location || ''} onChange={(v: string) => setFormData({...formData, location: v})} />
                  <InputField label="Başlangıç Tarihi" value={formData.startDate || ''} onChange={(v: string) => setFormData({...formData, startDate: v})} />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.current || false}
                      onChange={(e) => setFormData({...formData, current: e.target.checked, endDate: e.target.checked ? '' : formData.endDate})}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-300">Halen devam ediyor</label>
                  </div>
                  {!formData.current && (
                    <InputField label="Bitiş Tarihi" value={formData.endDate || ''} onChange={(v: string) => setFormData({...formData, endDate: v})} />
                  )}
                  <TextAreaField label="Açıklama" value={formData.description || ''} onChange={(v: string) => setFormData({...formData, description: v})} />
                  <InputField 
                    label="Teknolojiler (virgülle ayırın)" 
                    value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : ''} 
                    onChange={(v: string) => setFormData({...formData, technologies: v.split(',').map((t: string) => t.trim()).filter(Boolean)})} 
                  />
                </>
              )}

              {modalType === 'project' && (
                <>
                  <InputField label="Başlık" value={formData.title || ''} onChange={(v: string) => setFormData({...formData, title: v})} />
                  <TextAreaField label="Kısa Açıklama" value={formData.description || ''} onChange={(v: string) => setFormData({...formData, description: v})} />
                  <TextAreaField label="Uzun Açıklama" value={formData.longDescription || ''} onChange={(v: string) => setFormData({...formData, longDescription: v})} />
                  <InputField 
                    label="Teknolojiler (virgülle ayırın)" 
                    value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : ''} 
                    onChange={(v: string) => setFormData({...formData, technologies: v.split(',').map((t: string) => t.trim()).filter(Boolean)})} 
                  />
                  <InputField label="GitHub URL" value={formData.github || ''} onChange={(v: string) => setFormData({...formData, github: v})} />
                  <InputField label="Demo URL" value={formData.demo || ''} onChange={(v: string) => setFormData({...formData, demo: v})} />
                  <InputField label="Görsel URL" value={formData.image || ''} onChange={(v: string) => setFormData({...formData, image: v})} />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-300">Öne çıkan proje</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Durum</label>
                    <select
                      value={formData.status || 'completed'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="completed">Tamamlandı</option>
                      <option value="in-progress">Devam Ediyor</option>
                      <option value="planned">Planlanıyor</option>
                    </select>
                  </div>
                </>
              )}
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-3 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon className="text-cyan-400" size={32} />
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <h3 className="text-gray-400">{title}</h3>
    </div>
  );
}

function InputField({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none"
      />
    </div>
  );
}

function DataTable({ title, data, columns, onAdd, onEdit, onDelete }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title} ({data.length})</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg transition"
        >
          <Plus size={20} />
          Yeni Ekle
        </button>
      </div>

      {data.length === 0 ? (
        <p className="text-center text-gray-400 py-8">Henüz veri yok</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyan-500/20">
                {columns.map((col: string) => (
                  <th key={col} className="text-left p-3 font-semibold text-cyan-400">
                    {col}
                  </th>
                ))}
                <th className="text-right p-3 font-semibold text-cyan-400">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any) => (
                <tr key={item._id} className="border-b border-cyan-500/10 hover:bg-white/5">
                  {columns.map((col: string) => (
                    <td key={col} className="p-3">{String(item[col])}</td>
                  ))}
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 hover:bg-cyan-500/20 rounded-lg mr-2 transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}