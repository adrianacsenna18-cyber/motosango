"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LayoutDashboard, Users, Bike, Wallet, Calendar, Settings, LogOut, Menu, X } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [rides, setRides] = useState<any[]>([]);
  const [tab, setTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tarifaBase, setTarifaBase] = useState("10.00");
  const [salvandoTarifa, setSalvandoTarifa] = useState(false);
  const [mensalidadeValor, setMensalidadeValor] = useState("50.00");
  const [pixAdmin, setPixAdmin] = useState("");
  const [filtroCorrida, setFiltroCorrida] = useState("todas");

  const mockChartData = [
    { name: 'Seg', corridas: 120 },
    { name: 'Ter', corridas: 150 },
    { name: 'Qua', corridas: 180 },
    { name: 'Qui', corridas: 140 },
    { name: 'Sex', corridas: 220 },
    { name: 'Sáb', corridas: 280 },
    { name: 'Dom', corridas: 190 },
  ];

  const mockPieData = [
    { name: 'Dinheiro', value: 65, color: '#FBBF24' },
    { name: 'PIX', value: 35, color: '#10B981' },
  ];

  useEffect(() => {
    const adminData = localStorage.getItem("motosango_admin");
    if (!adminData) {
      router.push("/admin/login");
      return;
    }
    setAdmin(JSON.parse(adminData));
    fetchData();
  }, [router]);

  const fetchData = async () => {
    const { data: driversData } = await supabase.from("drivers").select("*").order("created_at", { ascending: false });
    if (driversData) setDrivers(driversData);

    const { data: ridesData } = await supabase.from("rides").select("*, users(nome), drivers(nome)").order("created_at", { ascending: false });
    if (ridesData) setRides(ridesData);

    const { data: settingsData } = await supabase.from("settings").select("*").limit(1);
    if (settingsData && settingsData.length > 0) {
      setTarifaBase(settingsData[0].tarifa_base.toString());
      if (settingsData[0].mensalidade_valor) setMensalidadeValor(settingsData[0].mensalidade_valor.toString());
      if (settingsData[0].pix_admin) setPixAdmin(settingsData[0].pix_admin);
    }
  };

  const salvarConfiguracoesGlobais = async () => {
    setSalvandoTarifa(true);
    const { error } = await supabase.from("settings").update({ 
      tarifa_base: parseFloat(tarifaBase),
      mensalidade_valor: parseFloat(mensalidadeValor),
      pix_admin: pixAdmin
    }).neq("id", "00000000-0000-0000-0000-000000000000"); // update all
    setSalvandoTarifa(false);
    if (error) {
      alert("Erro ao salvar configurações.");
    } else {
      alert("Configurações salvas com sucesso! Todos os aplicativos foram atualizados.");
    }
  };

  const apagarMotorista = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar este mototaxista?")) {
      await supabase.from("drivers").delete().eq("id", id);
      fetchData();
    }
  };

  const apagarCorrida = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar esta corrida?")) {
      await supabase.from("rides").delete().eq("id", id);
      fetchData();
    }
  };

  const aprovarMotorista = async (id: string, aprovar: boolean) => {
    await supabase.from("drivers").update({ aprovado_admin: aprovar }).eq("id", id);
    fetchData();
  };

  const atualizarMensalidade = async (id: string, dias: number) => {
    const novoVencimento = new Date();
    novoVencimento.setDate(novoVencimento.getDate() + dias);
    await supabase.from("drivers").update({ 
      vencimento_mensalidade: novoVencimento.toISOString(),
      bloqueado_mensalidade: false
    }).eq("id", id);
    fetchData();
  };

  const alternarBloqueioMensalidade = async (id: string, bloqueado: boolean) => {
    await supabase.from("drivers").update({ bloqueado_mensalidade: bloqueado }).eq("id", id);
    fetchData();
  };

  if (!admin) return null;

  return (
    <div className="flex fixed inset-0 z-50 bg-gray-100 font-sans overflow-hidden w-full h-full">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-dark text-white hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-primary">MotoSango</h1>
          <p className="text-xs text-gray-400">Painel Administrativo</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setTab("dashboard")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'dashboard' ? 'bg-primary text-dark font-bold' : 'hover:bg-gray-800'}`}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => setTab("motoristas")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'motoristas' ? 'bg-primary text-dark font-bold' : 'hover:bg-gray-800'}`}
          >
            🏍️ Mototaxistas
          </button>
          <button 
            onClick={() => setTab("mensalidades")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'mensalidades' ? 'bg-primary text-dark font-bold' : 'hover:bg-gray-800'}`}
          >
            💰 Mensalidades
          </button>
          <button 
            onClick={() => setTab("corridas")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'corridas' ? 'bg-primary text-dark font-bold' : 'hover:bg-gray-800'}`}
          >
            🚖 Corridas
          </button>
          <button 
            onClick={() => setTab("configuracoes")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'configuracoes' ? 'bg-primary text-dark font-bold' : 'hover:bg-gray-800'}`}
          >
            ⚙️ Configurações
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => {
              localStorage.removeItem("motosango_admin");
              router.push("/admin/login");
            }}
            className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto w-full bg-gray-50">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden flex items-center justify-between bg-dark text-white p-4 rounded-xl mb-6 shadow-md">
          <h1 className="text-lg font-bold text-primary">MotoSango Admin</h1>
          <select 
            value={tab} 
            onChange={(e) => setTab(e.target.value)}
            className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-gray-700"
          >
            <option value="dashboard">📊 Dashboard</option>
            <option value="motoristas">🏍️ Mototaxistas</option>
            <option value="mensalidades">💰 Mensalidades</option>
            <option value="corridas">🚖 Corridas</option>
            <option value="configuracoes">⚙️ Configurações</option>
          </select>
        </div>

        <header className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-dark capitalize">{tab}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Olá, Admin</span>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl shadow-sm border-2 border-white">👤</div>
          </div>
        </header>
          
        {tab === "dashboard" && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-sm font-medium mb-1">Corridas Hoje</p>
                  <p className="text-3xl md:text-4xl font-bold text-dark">{rides.length}</p>
                  <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">↑ +12% vs ontem</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-sm font-medium mb-1">Corridas no Mês</p>
                  <p className="text-3xl md:text-4xl font-bold text-dark">{rides.length * 10}</p>
                  <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">↑ +8% vs mês passado</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-sm font-medium mb-1">Aguardando Aprovação</p>
                  <p className="text-3xl md:text-4xl font-bold text-red-500">{drivers.filter(d => !d.aprovado_admin).length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-sm font-medium mb-1">Mototaxistas Online</p>
                  <p className="text-3xl md:text-4xl font-bold text-dark">{drivers.filter(d => d.status_online).length}</p>
                  <p className="text-xs text-blue-600 font-bold mt-2">De {drivers.length} cadastrados</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                  <h3 className="font-bold text-dark mb-6">Corridas por dia</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="corridas" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-dark mb-6">Formas de Pagamento</h3>
                  <div className="h-48 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockPieData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {mockPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-sm font-medium text-gray-600">Dinheiro (65%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-600">PIX (35%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {tab === "mensalidades" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-medium text-gray-600">Nome</th>
                  <th className="p-4 font-medium text-gray-600">Telefone</th>
                  <th className="p-4 font-medium text-gray-600">Vencimento</th>
                  <th className="p-4 font-medium text-gray-600">Status</th>
                  <th className="p-4 font-medium text-gray-600">Renovar</th>
                  <th className="p-4 font-medium text-gray-600">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {drivers.map(driver => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-dark">{driver.nome}</td>
                    <td className="p-4 text-gray-600">{driver.telefone}</td>
                    <td className="p-4 text-gray-600">
                      {driver.vencimento_mensalidade 
                        ? new Date(driver.vencimento_mensalidade).toLocaleDateString() 
                        : 'Não definido'}
                    </td>
                    <td className="p-4">
                      {driver.bloqueado_mensalidade ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-bold">Bloqueado</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">Ativo</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => atualizarMensalidade(driver.id, 7)} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded hover:bg-blue-200 transition-colors">+7d</button>
                        <button onClick={() => atualizarMensalidade(driver.id, 15)} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded hover:bg-blue-200 transition-colors">+15d</button>
                        <button onClick={() => atualizarMensalidade(driver.id, 30)} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded hover:bg-blue-200 transition-colors">+30d</button>
                      </div>
                    </td>
                    <td className="p-4">
                      {!driver.bloqueado_mensalidade ? (
                        <button 
                          onClick={() => alternarBloqueioMensalidade(driver.id, true)}
                          className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded hover:bg-red-200 transition-colors"
                        >
                          Bloquear
                        </button>
                      ) : (
                        <button 
                          onClick={() => alternarBloqueioMensalidade(driver.id, false)}
                          className="px-3 py-1 bg-green-100 text-green-600 text-sm font-bold rounded hover:bg-green-200 transition-colors"
                        >
                          Desbloquear
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {drivers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">Nenhum mototaxista encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "motoristas" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-medium text-gray-600">Nome</th>
                  <th className="p-4 font-medium text-gray-600">Telefone</th>
                  <th className="p-4 font-medium text-gray-600">Moto</th>
                  <th className="p-4 font-medium text-gray-600">Chave PIX</th>
                  <th className="p-4 font-medium text-gray-600">Status</th>
                  <th className="p-4 font-medium text-gray-600">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {drivers.map(driver => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-dark">{driver.nome}</td>
                    <td className="p-4 text-gray-600">{driver.telefone}</td>
                    <td className="p-4 text-gray-600">{driver.modelo_moto} - {driver.placa}</td>
                    <td className="p-4 text-gray-600">{driver.chave_pix || '-'}</td>
                    <td className="p-4">
                      {driver.aprovado_admin ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">Aprovado</span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-bold">Pendente</span>
                      )}
                    </td>
                    <td className="p-4">
                      {!driver.aprovado_admin ? (
                        <button 
                          onClick={() => aprovarMotorista(driver.id, true)}
                          className="px-3 py-1 bg-primary text-dark text-sm font-bold rounded"
                        >
                          Aprovar
                        </button>
                      ) : (
                        <button 
                          onClick={() => aprovarMotorista(driver.id, false)}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-bold rounded"
                        >
                          Bloquear
                        </button>
                      )}
                      <button 
                        onClick={() => apagarMotorista(driver.id)}
                        className="ml-2 px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded"
                      >
                        Apagar
                      </button>
                    </td>
                  </tr>
                ))}
                {drivers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum mototaxista encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "corridas" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2">
              {['todas', 'concluido', 'cancelado', 'aguardando', 'especial'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFiltroCorrida(f)}
                  className={`px-3 py-1.5 rounded-full text-sm font-bold capitalize transition-colors ${filtroCorrida === f ? 'bg-primary text-dark' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-medium text-gray-600">Data</th>
                  <th className="p-4 font-medium text-gray-600">Cliente</th>
                  <th className="p-4 font-medium text-gray-600">Motorista</th>
                  <th className="p-4 font-medium text-gray-600">Trajeto</th>
                  <th className="p-4 font-medium text-gray-600">Status</th>
                  <th className="p-4 font-medium text-gray-600">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rides.filter(r => {
                  if (filtroCorrida === 'todas') return true;
                  if (filtroCorrida === 'especial') return r.tipo_corrida === 'especial';
                  return r.status === filtroCorrida;
                }).map(ride => (
                  <tr key={ride.id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-600">{new Date(ride.created_at).toLocaleString()}</td>
                    <td className="p-4 font-medium text-dark">{ride.users?.nome || '-'}</td>
                    <td className="p-4 text-gray-600">{ride.drivers?.nome || '-'}</td>
                    <td className="p-4 text-sm text-gray-500">
                      <div><span className="text-green-500 mr-1">•</span>{ride.origem}</div>
                      <div><span className="text-red-500 mr-1">•</span>{ride.destino}</div>
                      {ride.tipo_corrida === 'especial' && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1 inline-block">Especial</span>}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-bold">
                        {ride.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => apagarCorrida(ride.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded"
                      >
                        Apagar
                      </button>
                    </td>
                  </tr>
                ))}
                {rides.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">Nenhuma corrida encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {tab === "configuracoes" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 max-w-xl">
            <h3 className="font-bold text-xl text-dark mb-6">Configurações Globais</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor da Corrida Local (R$)</label>
                <div className="flex gap-4">
                  <input 
                    type="number" 
                    value={tarifaBase}
                    onChange={(e) => setTarifaBase(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg p-3 outline-none focus:border-primary text-dark font-bold text-lg"
                    placeholder="10.00"
                    step="0.50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor da Mensalidade (R$)</label>
                <div className="flex gap-4">
                  <input 
                    type="number" 
                    value={mensalidadeValor}
                    onChange={(e) => setMensalidadeValor(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg p-3 outline-none focus:border-primary text-dark font-bold text-lg"
                    placeholder="50.00"
                    step="5.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chave PIX do Administrador</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={pixAdmin}
                    onChange={(e) => setPixAdmin(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg p-3 outline-none focus:border-primary text-dark font-bold text-lg"
                    placeholder="E-mail, CPF, Telefone ou Aleatória"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={salvarConfiguracoesGlobais}
                  disabled={salvandoTarifa}
                  className="w-full py-4 bg-primary text-dark font-bold rounded-lg shadow-sm hover:bg-yellow-400 disabled:opacity-50 text-lg"
                >
                  {salvandoTarifa ? "Salvando..." : "Salvar Configurações"}
                </button>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  As alterações serão aplicadas instantaneamente para todos os mototaxistas e clientes.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
