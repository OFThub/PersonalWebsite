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
  LogOut,
  BarChart3,
  X,
  Plus,
  FileText
} from 'lucide-react';
import Loading from '@/components/Common/Loading';
import { InputField, TextAreaField, StatCard } from '@/components/Admin/AdminHelpers';
import DataTable from '@/components/Admin/DataTable';
import AnalyticsDashboard from '@/components/AnalyticsDashboard/AnalyticsDashboard';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import ImageUpload from '@/components/ImageUpload/ImageUpload';

type TabType = 'overview' | 'site' | 'skills' | 'experiences' | 'projects' | 'blog' | 'contacts';
type ModalType = 'skill' | 'experience' | 'project' | 'blog';

export default function AdminPage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();

  // Arayüz State'leri
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('skill');
  
  // Veri State'leri
  const [siteData, setSiteData] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  // Form ve Düzenleme State'leri
  const [editingItem, setEditingItem] = useState<any>(null);
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
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [siteRes, skillsRes, expRes, projRes, blogRes, contactsRes] = await Promise.all([
        fetch('/api/site'),
        fetch('/api/skills'),
        fetch('/api/experiences'),
        fetch('/api/projects'),
        fetch('/api/blog', { headers }),
        fetch('/api/contacts', { headers }),
      ]);

      if (siteRes.ok) setSiteData(await siteRes.json());
      if (skillsRes.ok) setSkills(await skillsRes.json());
      if (expRes.ok) setExperiences(await expRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (blogRes.ok) setBlogPosts(await blogRes.json());
      if (contactsRes.ok) setContacts(await contactsRes.json());
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    }
  };

  // --- CRUD İşlemleri ---
  
  const openModal = (type: ModalType, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    
    // Blog için varsayılan değerler
    if (type === 'blog' && !item) {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'technology',
        tags: [],
        published: false,
        featured: false,
        author: user?.id
      });
    } else {
      setFormData(item || {});
    }
    
    setShowModal(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const method = editingItem ? 'PUT' : 'POST';
      
      let endpoint = '';
      if (modalType === 'blog') {
        endpoint = editingItem ? `/api/blog/${editingItem.slug}` : '/api/blog';
      } else {
        endpoint = `/api/${modalType}s${editingItem ? `/${editingItem._id}` : ''}`;
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchAllData();
        setFormData({});
      } else {
        const error = await res.json();
        alert(error.message || 'Kaydetme sırasında bir hata oluştu.');
      }
    } catch (error) {
      alert('İşlem başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: ModalType, id: string) => {
    if (!confirm('Bu öğeyi silmek istediğinize emin misiniz?')) return;
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'blog' ? `/api/blog/${id}` : `/api/${type}s/${id}`;
      
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) fetchAllData();
    } catch (error) {
      alert('Silme başarısız.');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSiteSettingsUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/site', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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

  // Slug oluşturma
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (authLoading || !user) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-cyan-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Hoş geldin, {user.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition text-sm">
              <LogOut size={16} /> Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Nav Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
            { id: 'site', label: 'Site Ayarları', icon: Settings },
            { id: 'skills', label: 'Yetenekler', icon: Code },
            { id: 'experiences', label: 'Deneyimler', icon: Briefcase },
            { id: 'projects', label: 'Projeler', icon: FolderKanban },
            { id: 'blog', label: 'Blog', icon: FileText },
            { id: 'contacts', label: 'Mesajlar', icon: MailIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 border border-white/5'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Yetenekler" value={skills.length} icon={Code} />
                <StatCard title="Deneyimler" value={experiences.length} icon={Briefcase} />
                <StatCard title="Projeler" value={projects.length} icon={FolderKanban} />
                <StatCard title="Blog Yazıları" value={blogPosts.length} icon={FileText} />
              </div>
              <AnalyticsDashboard />
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
                  onChange={(v: string) => setFormData({ ...siteData, ...formData, name: v })}
                />
                <InputField
                  label="Başlık"
                  value={formData.title !== undefined ? formData.title : siteData.title}
                  onChange={(v: string) => setFormData({ ...siteData, ...formData, title: v })}
                />
                <TextAreaField
                  label="Açıklama"
                  value={formData.description !== undefined ? formData.description : siteData.description}
                  onChange={(v: string) => setFormData({ ...siteData, ...formData, description: v })}
                />
                <InputField
                  label="Email"
                  value={formData.email !== undefined ? formData.email : siteData.email}
                  onChange={(v: string) => setFormData({ ...siteData, ...formData, email: v })}
                />
                <InputField
                  label="GitHub"
                  value={formData.github !== undefined ? formData.github : siteData.github}
                  onChange={(v: string) => setFormData({ ...siteData, ...formData, github: v })}
                />
                <InputField
                  label="LinkedIn"
                  value={formData.linkedin !== undefined ? formData.linkedin : siteData.linkedin}
                  onChange={(v: string) => setFormData({ ...siteData, ...formData, linkedin: v })}
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
              onAdd={() => openModal('skill')}
              onEdit={(item: any) => openModal('skill', item)}
              onDelete={(item: any) => handleDelete('skill', item._id)}
            />
          )}

          {/* Experiences Tab */}
          {activeTab === 'experiences' && (
            <DataTable 
              title="Deneyimler" 
              data={experiences} 
              columns={['title', 'company', 'startDate']} 
              onAdd={() => openModal('experience')}
              onEdit={(item: any) => openModal('experience', item)}
              onDelete={(item: any) => handleDelete('experience', item._id)}
            />
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <DataTable 
              title="Projeler" 
              data={projects} 
              columns={['title', 'status', 'featured']} 
              onAdd={() => openModal('project')}
              onEdit={(item: any) => openModal('project', item)}
              onDelete={(item: any) => handleDelete('project', item._id)}
            />
          )}

          {/* Blog Tab */}
          {activeTab === 'blog' && (
            <DataTable 
              title="Blog Yazıları" 
              data={blogPosts} 
              columns={['title', 'category', 'published', 'views']} 
              onAdd={() => openModal('blog')}
              onEdit={(item: any) => openModal('blog', item)}
              onDelete={(item: any) => handleDelete('blog', item.slug)}
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
                  contacts.map((contact) => (
                    <div key={contact._id} className="bg-white/5 border border-cyan-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{contact.name}</h3>
                          <p className="text-gray-400 text-sm">{contact.email}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            contact.status === 'new'
                              ? 'bg-green-500/20 text-green-400'
                              : contact.status === 'read'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
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
      </div>

      {/* MODAL COMPONENT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-400">
                {editingItem ? 'Düzenle' : 'Yeni Ekle'} - {modalType.toUpperCase()}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* SKILL FORM */}
              {modalType === 'skill' && (
                <>
                  <InputField label="İsim" value={formData.name || ''} onChange={(v: string) => setFormData({...formData, name: v})} />
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Kategori</label>
                    <select
                      value={formData.category || 'other'}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="tools">Tools</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <InputField label="Seviye (0-100)" type="number" value={formData.level || 0} onChange={(v: string) => setFormData({...formData, level: parseInt(v)})} />
                </>
              )}

              {/* EXPERIENCE FORM */}
              {modalType === 'experience' && (
                <>
                  <InputField label="Pozisyon" value={formData.title || ''} onChange={(v: string) => setFormData({...formData, title: v})} />
                  <InputField label="Şirket" value={formData.company || ''} onChange={(v: string) => setFormData({...formData, company: v})} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Başlangıç" value={formData.startDate || ''} onChange={(v: string) => setFormData({...formData, startDate: v})} />
                    <InputField label="Bitiş" value={formData.endDate || ''} onChange={(v: string) => setFormData({...formData, endDate: v})} disabled={formData.current} />
                  </div>
                  <TextAreaField label="Açıklama" value={formData.description || ''} onChange={(v: string) => setFormData({...formData, description: v})} />
                </>
              )}

              {/* PROJECT FORM */}
              {modalType === 'project' && (
                <>
                  <InputField label="Başlık" value={formData.title || ''} onChange={(v: string) => setFormData({...formData, title: v})} />
                  <TextAreaField label="Açıklama" value={formData.description || ''} onChange={(v: string) => setFormData({...formData, description: v})} />
                  <InputField label="GitHub URL" value={formData.github || ''} onChange={(v: string) => setFormData({...formData, github: v})} />
                  <ImageUpload
                    label="Proje Görseli"
                    value={formData.image}
                    onChange={(url: string) => setFormData({...formData, image: url})}
                    folder="projects"
                  />
                </>
              )}

              {/* BLOG FORM */}
              {modalType === 'blog' && (
                <>
                  <InputField 
                    label="Başlık" 
                    value={formData.title || ''} 
                    onChange={(v: string) => {
                      setFormData({...formData, title: v, slug: generateSlug(v)});
                    }} 
                  />
                  <InputField 
                    label="Slug (URL)" 
                    value={formData.slug || ''} 
                    onChange={(v: string) => setFormData({...formData, slug: v})} 
                  />
                  <TextAreaField 
                    label="Özet" 
                    value={formData.excerpt || ''} 
                    onChange={(v: string) => setFormData({...formData, excerpt: v})} 
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">İçerik</label>
                    <RichTextEditor
                      content={formData.content || ''}
                      onChange={(html: string) => setFormData({...formData, content: html})}
                    />
                  </div>

                  <ImageUpload
                    label="Kapak Görseli"
                    value={formData.coverImage}
                    onChange={(url: string) => setFormData({...formData, coverImage: url})}
                    folder="blog"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Kategori</label>
                    <select
                      value={formData.category || 'technology'}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="technology">Technology</option>
                      <option value="programming">Programming</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="career">Career</option>
                      <option value="personal">Personal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <InputField 
                    label="Etiketler (virgülle ayırın)" 
                    value={formData.tags?.join(', ') || ''} 
                    onChange={(v: string) => setFormData({...formData, tags: v.split(',').map((t: string) => t.trim())})} 
                  />

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.published || false}
                        onChange={(e) => setFormData({...formData, published: e.target.checked})}
                        className="w-5 h-5 rounded border-cyan-500/30 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-sm">Yayınla</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        className="w-5 h-5 rounded border-cyan-500/30 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-sm">Öne Çıkar</span>
                    </label>
                  </div>
                </>
              )}
              
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-3 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition"
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