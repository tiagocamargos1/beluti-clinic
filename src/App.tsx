import { useState, useEffect } from 'react'
import { LogOut, LayoutDashboard, Users, Calendar, FileText, Settings, Menu, X, Bell } from 'lucide-react'
import { supabase } from './lib/supabase'
import './App.css'

function AppContent() {
  const [page, setPage] = useState('dashboard')
  const [user, setUser] = useState<any>(null)
  const [userName, setUserName] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkAuth()
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user?.email) {
        setUserName(session.user.email.split('@')[0])
      }
    })
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
    if (session?.user?.email) {
      setUserName(session.user.email.split('@')[0])
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (!user) {
    return <LoginPage onSuccess={() => checkAuth()} />
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pacientes', label: 'Pacientes', icon: Users },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-rose-50 dark:bg-gray-900 flex flex-col md:flex-row">
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed md:relative w-64 h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 shadow-xl border-r-2 border-rose-200 transform transition-transform z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b-2 border-rose-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-300 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">B</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-rose-900">BELUTI</h1>
              <p className="text-xs text-rose-700 font-semibold">Estética Médica</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = page === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-rose-300 text-rose-900 font-bold shadow-lg'
                    : 'text-rose-800 hover:bg-rose-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-rose-200 w-64 bg-rose-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-rose-700 font-semibold">Administrador</p>
              <p className="font-semibold text-sm text-rose-900 capitalize">{userName}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col w-full">
        <header className="bg-white border-b-2 px-4 md:px-8 py-4 shadow-sm sticky top-0">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-rose-100 rounded-lg">
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-rose-900">
                {menuItems.find(m => m.id === page)?.label || 'Dashboard'}
              </h2>
            </div>
            <Bell className="w-5 h-5 text-rose-600 hidden md:block" />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 bg-rose-50">
          {page === 'dashboard' && <DashboardPage />}
          {page === 'pacientes' && <PacientesPage />}
          {page === 'agenda' && <AgendaPage />}
          {page === 'relatorios' && <RelatoriosPage />}
          {page === 'configuracoes' && <ConfiguracoesPage />}
        </div>
      </main>
    </div>
  )
}

function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('demo@beluti.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw err
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-rose-400">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-300 to-rose-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
            <span className="text-4xl font-bold text-white">B</span>
          </div>
          <h1 className="text-4xl font-bold text-rose-900">BELUTI</h1>
          <p className="text-rose-700 mt-2 font-semibold">Estética Médica</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-rose-900 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-rose-200 rounded-lg focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-rose-900 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-rose-200 rounded-lg focus:outline-none focus:border-rose-400"
            />
          </div>

          {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        <p className="text-center text-rose-600 text-xs mt-8">© 2026 BELUTI - Todos os direitos reservados</p>
      </div>
    </div>
  )
}

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Pacientes', value: '24', color: 'bg-blue-500' },
          { label: 'Agendamentos', value: '8', color: 'bg-green-500' },
          { label: 'Hoje', value: '3', color: 'bg-yellow-500' },
          { label: 'Receita', value: 'R$ 2.450', color: 'bg-purple-500' },
        ].map((item) => (
          <div key={item.label} className={`${item.color} text-white p-6 rounded-xl shadow-lg`}>
            <p className="text-sm opacity-90">{item.label}</p>
            <p className="text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold text-rose-900 mb-4">Últimos Pacientes</h3>
        <p className="text-rose-600">Carregando dados do Supabase...</p>
      </div>
    </div>
  )
}

function PacientesPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-rose-900 mb-4">Pacientes</h2>
      <p className="text-rose-600">Módulo de pacientes - Integrado com Supabase</p>
    </div>
  )
}

function AgendaPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-rose-900 mb-4">Agenda</h2>
      <p className="text-rose-600">Calendário de agendamentos - Integrado com Supabase</p>
    </div>
  )
}

function RelatoriosPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-rose-900 mb-4">Relatórios</h2>
      <p className="text-rose-600">Relatórios e análises - Dados do Supabase</p>
    </div>
  )
}

function ConfiguracoesPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-rose-900 mb-4">Configurações</h2>
      <p className="text-rose-600">Configurações do sistema</p>
    </div>
  )
}

export default function App() {
  return <AppContent />
}
