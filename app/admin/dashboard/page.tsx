'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

// Icons
const Icons = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  Clients: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  News: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    </svg>
  ),
  Services: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  ),
  CaseStudy: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

interface Client {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  industry: string | null;
  is_featured: boolean;
}

interface News {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  is_published: boolean;
  created_at: string;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  is_active: boolean;
}

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  growth_percentage: string | null;
  is_featured: boolean;
}

type TabType = 'overview' | 'clients' | 'news' | 'services' | 'case-studies' | 'settings';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [clients, setClients] = useState<Client[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [stats, setStats] = useState({ clients: 0, news: 0, services: 0, caseStudies: 0 });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkUser();
    fetchStats();
  }, []);

  useEffect(() => {
    if (user) {
      if (activeTab === 'clients') fetchClients();
      if (activeTab === 'news') fetchNews();
      if (activeTab === 'services') fetchServices();
      if (activeTab === 'case-studies') fetchCaseStudies();
    }
  }, [user, activeTab]);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/admin');
    } else {
      setUser(user);
    }
    setLoading(false);
  }

  async function fetchStats() {
    const [clientsRes, newsRes, servicesRes, caseStudiesRes] = await Promise.all([
      supabase.from('clients').select('id', { count: 'exact', head: true }),
      supabase.from('news').select('id', { count: 'exact', head: true }),
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase.from('case_studies').select('id', { count: 'exact', head: true }),
    ]);
    setStats({
      clients: clientsRes.count || 0,
      news: newsRes.count || 0,
      services: servicesRes.count || 0,
      caseStudies: caseStudiesRes.count || 0,
    });
  }

  async function fetchClients() {
    const { data } = await supabase.from('clients').select('*').order('order_index');
    if (data) setClients(data);
  }

  async function fetchNews() {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (data) setNews(data);
  }

  async function fetchServices() {
    const { data } = await supabase.from('services').select('*').order('order_index');
    if (data) setServices(data);
  }

  async function fetchCaseStudies() {
    const { data } = await supabase.from('case_studies').select('*').order('created_at', { ascending: false });
    if (data) setCaseStudies(data);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin');
    router.refresh();
  }

  async function deleteItem(table: string, id: string, fetchFn: () => void) {
    if (confirm('Are you sure you want to delete this item?')) {
      await supabase.from(table).delete().eq('id', id);
      fetchFn();
      fetchStats();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Icons.Dashboard },
    { id: 'clients', label: 'Clients', icon: Icons.Clients },
    { id: 'news', label: 'News / Articles', icon: Icons.News },
    { id: 'services', label: 'Services', icon: Icons.Services },
    { id: 'case-studies', label: 'Case Studies', icon: Icons.CaseStudy },
    { id: 'settings', label: 'Site Settings', icon: Icons.Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10">
          <Image src="/images/logo-bizhive.png" alt="BIZHIVE" width={32} height={32} className="brightness-0 invert" />
          <span className="font-bold text-lg">BIZHIVE Admin</span>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                activeTab === item.id ? 'bg-amber-500 text-slate-900 font-semibold' : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <item.icon />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <Link 
            href="/" 
            target="_blank"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all text-sm"
          >
            <Icons.Eye />
            View Website
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all text-sm"
          >
            <Icons.Logout />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'clients' && 'Manage Clients'}
              {activeTab === 'news' && 'Manage News & Articles'}
              {activeTab === 'services' && 'Manage Services'}
              {activeTab === 'case-studies' && 'Manage Case Studies'}
              {activeTab === 'settings' && 'Site Settings'}
            </h1>
            <p className="text-slate-500 text-sm">Welcome back, {user.email}</p>
          </div>
          
          {activeTab !== 'overview' && activeTab !== 'settings' && (
            <Link 
              href={`/admin/${activeTab}/new`}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              <Icons.Plus />
              Add New
            </Link>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Clients', count: stats.clients, icon: Icons.Clients, color: 'blue', tab: 'clients' },
                { label: 'Articles', count: stats.news, icon: Icons.News, color: 'green', tab: 'news' },
                { label: 'Services', count: stats.services, icon: Icons.Services, color: 'purple', tab: 'services' },
                { label: 'Case Studies', count: stats.caseStudies, icon: Icons.CaseStudy, color: 'amber', tab: 'case-studies' },
              ].map((stat) => (
                <button
                  key={stat.label}
                  onClick={() => setActiveTab(stat.tab as TabType)}
                  className="bg-white rounded-2xl p-6 border border-slate-200 text-left hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
                    <div className={`w-10 h-10 bg-${stat.color}-50 rounded-xl flex items-center justify-center text-${stat.color}-500`}>
                      <stat.icon />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{stat.count}</p>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-4 gap-3">
                <Link href="/admin/clients/new" className="p-4 bg-slate-50 rounded-xl hover:bg-amber-50 transition-colors text-center">
                  <span className="text-2xl mb-2 block">👥</span>
                  <span className="text-sm font-medium text-slate-700">Add Client</span>
                </Link>
                <Link href="/admin/news/new" className="p-4 bg-slate-50 rounded-xl hover:bg-amber-50 transition-colors text-center">
                  <span className="text-2xl mb-2 block">📝</span>
                  <span className="text-sm font-medium text-slate-700">Write Article</span>
                </Link>
                <Link href="/admin/services/new" className="p-4 bg-slate-50 rounded-xl hover:bg-amber-50 transition-colors text-center">
                  <span className="text-2xl mb-2 block">⚙️</span>
                  <span className="text-sm font-medium text-slate-700">Add Service</span>
                </Link>
                <Link href="/admin/case-studies/new" className="p-4 bg-slate-50 rounded-xl hover:bg-amber-50 transition-colors text-center">
                  <span className="text-2xl mb-2 block">📊</span>
                  <span className="text-sm font-medium text-slate-700">Add Case Study</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <DataTable
            columns={['Logo', 'Name', 'Industry', 'Featured', 'Actions']}
            emptyText="No clients yet. Click &quot;Add New&quot; to create one."
            data={clients}
            renderRow={(client) => (
              <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4">
                  {client.logo_url ? (
                    <img src={client.logo_url} alt={client.name} className="w-10 h-10 object-contain rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">N/A</div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">{client.name}</td>
                <td className="px-6 py-4 text-slate-500">{client.industry || '-'}</td>
                <td className="px-6 py-4">
                  <StatusBadge active={client.is_featured} activeText="Yes" inactiveText="No" />
                </td>
                <td className="px-6 py-4 text-right">
                  <ActionButtons
                    editUrl={`/admin/clients/${client.id}`}
                    onDelete={() => deleteItem('clients', client.id, fetchClients)}
                  />
                </td>
              </tr>
            )}
          />
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <DataTable
            columns={['Title', 'Category', 'Status', 'Created', 'Actions']}
            emptyText="No articles yet. Click &quot;Add New&quot; to create one."
            data={news}
            renderRow={(article) => (
              <tr key={article.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900 max-w-xs truncate">{article.title}</td>
                <td className="px-6 py-4 text-slate-500">{article.category || '-'}</td>
                <td className="px-6 py-4">
                  <StatusBadge active={article.is_published} activeText="Published" inactiveText="Draft" />
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {new Date(article.created_at).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4 text-right">
                  <ActionButtons
                    editUrl={`/admin/news/${article.id}`}
                    onDelete={() => deleteItem('news', article.id, fetchNews)}
                  />
                </td>
              </tr>
            )}
          />
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <DataTable
            columns={['Name', 'Description', 'Status', 'Actions']}
            emptyText="No services yet. Click &quot;Add New&quot; to create one."
            data={services}
            renderRow={(service) => (
              <tr key={service.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{service.name}</td>
                <td className="px-6 py-4 text-slate-500 max-w-md truncate">{service.short_description || '-'}</td>
                <td className="px-6 py-4">
                  <StatusBadge active={service.is_active} activeText="Active" inactiveText="Inactive" />
                </td>
                <td className="px-6 py-4 text-right">
                  <ActionButtons
                    editUrl={`/admin/services/${service.id}`}
                    onDelete={() => deleteItem('services', service.id, fetchServices)}
                  />
                </td>
              </tr>
            )}
          />
        )}

        {/* Case Studies Tab */}
        {activeTab === 'case-studies' && (
          <DataTable
            columns={['Title', 'Growth', 'Featured', 'Actions']}
            emptyText="No case studies yet. Click &quot;Add New&quot; to create one."
            data={caseStudies}
            renderRow={(cs) => (
              <tr key={cs.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{cs.title}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                    {cs.growth_percentage || '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge active={cs.is_featured} activeText="Yes" inactiveText="No" />
                </td>
                <td className="px-6 py-4 text-right">
                  <ActionButtons
                    editUrl={`/admin/case-studies/${cs.id}`}
                    onDelete={() => deleteItem('case_studies', cs.id, fetchCaseStudies)}
                  />
                </td>
              </tr>
            )}
          />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-6">Site Settings</h3>
            <p className="text-slate-500 mb-6">Manage global website settings and configurations.</p>
            
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-medium text-slate-700 mb-2">Homepage Hero</h4>
                <p className="text-sm text-slate-500 mb-4">Update the main hero section content.</p>
                <Link href="/admin/settings/hero" className="text-amber-500 font-medium text-sm hover:text-amber-600">
                  Edit Hero Settings →
                </Link>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-medium text-slate-700 mb-2">Contact Information</h4>
                <p className="text-sm text-slate-500 mb-4">Update phone numbers, emails, and social links.</p>
                <Link href="/admin/settings/contact" className="text-amber-500 font-medium text-sm hover:text-amber-600">
                  Edit Contact Info →
                </Link>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-medium text-slate-700 mb-2">Company Stats</h4>
                <p className="text-sm text-slate-500 mb-4">Update the numbers shown on homepage (KOLs, revenue, etc).</p>
                <Link href="/admin/settings/stats" className="text-amber-500 font-medium text-sm hover:text-amber-600">
                  Edit Stats →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Reusable Components
function DataTable<T>({ columns, emptyText, data, renderRow }: {
  columns: string[];
  emptyText: string;
  data: T[];
  renderRow: (item: T) => React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col, i) => (
              <th key={col} className={`${i === columns.length - 1 ? 'text-right' : 'text-left'} px-6 py-4 text-xs font-semibold text-slate-500 uppercase`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map(renderRow)
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ active, activeText, inactiveText }: { active: boolean; activeText: string; inactiveText: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
    }`}>
      {active ? activeText : inactiveText}
    </span>
  );
}

function ActionButtons({ editUrl, onDelete }: { editUrl: string; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-2">
      <Link href={editUrl} className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
        <Icons.Edit />
      </Link>
      <button onClick={onDelete} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
        <Icons.Trash />
      </button>
    </div>
  );
}
