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
  
  // Novas regras de preços
  const [regraNoite, setRegraNoite] = useState(false);
  const [regraSabado, setRegraSabado] = useState(false);
  const [regraDomingo, setRegraDomingo] = useState(false);
  const [regraFeriadoNacional, setRegraFeriadoNacional] = useState(false);
  const [regraFeriadoLocal, setRegraFeriadoLocal] = useState(false);

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
    { name: 'Dinheiro', value: 65, color: '#FFD000' },
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
      if (settingsData[0].tarifa_base !== null && settingsData[0].tarifa_base !== undefined) {
        setTarifaBase(settingsData[0].tarifa_base.toString());
      }
      if (settingsData[0].mensalidade_valor !== null && settingsData[0].mensalidade_valor !== undefined) {
        setMensalidadeValor(settingsData[0].mensalidade_valor.toString());
      }
      if (settingsData[0].pix_admin !== null && settingsData[0].pix_admin !== undefined) {
        setPixAdmin(settingsData[0].pix_admin);
      }
      if (settingsData[0].regra_noite !== undefined) setRegraNoite(settingsData[0].regra_noite);
      if (settingsData[0].regra_sabado !== undefined) setRegraSabado(settingsData[0].regra_sabado);
      if (settingsData[0].regra_domingo !== undefined) setRegraDomingo(settingsData[0].regra_domingo);
      if (settingsData[0].regra_feriado_nacional !== undefined) setRegraFeriadoNacional(settingsData[0].regra_feriado_nacional);
      if (settingsData[0].regra_feriado_local !== undefined) setRegraFeriadoLocal(settingsData[0].regra_feriado_local);
    }
  };

  const salvarConfiguracoesGlobais = async () => {
    setSalvandoTarifa(true);
    
    try {
      // Primeiro busca o ID da configuração para atualizar a linha exata
      const { data: currentSettings } = await supabase.from("settings").select("id").limit(1);
      
      if (currentSettings && currentSettings.length > 0) {
        const { error } = await supabase.from("settings").update({ 
          tarifa_base: parseFloat(tarifaBase.toString().replace(',', '.')) || 0,
          mensalidade_valor: parseFloat(mensalidadeValor.toString().replace(',', '.')) || 0,
          pix_admin: pixAdmin,
          regra_noite: regraNoite,
          regra_sabado: regraSabado,
          regra_domingo: regraDomingo,
          regra_feriado_nacional: regraFeriadoNacional,
          regra_feriado_local: regraFeriadoLocal
        }).eq("id", currentSettings[0].id);

        if (error) throw error;
        
        alert("Configurações salvas com sucesso! Todos os aplicativos foram atualizados.");
      } else {
        // Se não existir nenhuma linha, cria uma
        const { error } = await supabase.from("settings").insert([{ 
          tarifa_base: parseFloat(tarifaBase.toString().replace(',', '.')) || 0,
          mensalidade_valor: parseFloat(mensalidadeValor.toString().replace(',', '.')) || 0,
          pix_admin: pixAdmin,
          regra_noite: regraNoite,
          regra_sabado: regraSabado,
          regra_domingo: regraDomingo,
          regra_feriado_nacional: regraFeriadoNacional,
          regra_feriado_local: regraFeriadoLocal
        }]);
        
        if (error) throw error;
        
        alert("Configurações salvas com sucesso! Todos os aplicativos foram atualizados.");
      }
    } catch (error: any) {
      console.error("ERRO SUPABASE:", error);
      alert("Erro ao salvar configurações: " + error.message);
    } finally {
      setSalvandoTarifa(false);
      fetchData(); // Recarrega os dados para garantir que a interface mostre o que está no banco
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
    <div className="flex fixed inset-0 z-50 bg-black font-sans overflow-hidden w-full h-full text-white">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-[#0A0A0A] text-white hidden md:flex flex-col fixed h-full z-20 border-r border-[#222]">
        <div className="p-6 border-b border-[#222]">
          <img src="/logo.png" alt="MotoSango" className="h-8 object-contain mb-1" />
          <p className="text-xs text-gray-400">Painel Administrativo</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setTab("dashboard")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'dashboard' ? 'bg-[#FFD000] text-black font-bold' : 'hover:bg-[#111111]'}`}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => setTab("motoristas")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'motoristas' ? 'bg-[#FFD000] text-black font-bold' : 'hover:bg-[#111111]'}`}
          >
            🏍️ Mototaxistas
          </button>
          <button 
            onClick={() => setTab("mensalidades")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'mensalidades' ? 'bg-[#FFD000] text-black font-bold' : 'hover:bg-[#111111]'}`}
          >
            💰 Mensalidades
          </button>
          <button 
            onClick={() => setTab("corridas")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'corridas' ? 'bg-[#FFD000] text-black font-bold' : 'hover:bg-[#111111]'}`}
          >
            🚖 Corridas
          </button>
          <button 
            onClick={() => setTab("configuracoes")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'configuracoes' ? 'bg-[#FFD000] text-black font-bold' : 'hover:bg-[#111111]'}`}
          >
            ⚙️ Configurações
          </button>
        </nav>
        <div className="p-4 border-t border-[#222]">
          <button 
            onClick={() => {
              if (confirm("Deseja realmente sair do painel administrador?")) {
                localStorage.removeItem("motosango_admin");
                router.push("/");
              }
            }}
            className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto w-full bg-black">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden flex items-center justify-between bg-[#0A0A0A] border border-[#222] text-white p-4 rounded-3xl mb-6 shadow-md">
          <img src="/logo.png" alt="MotoSango Admin" className="h-6 object-contain" />
          <select 
            value={tab} 
            onChange={(e) => setTab(e.target.value)}
            className="bg-[#1A1A1A] text-white text-sm rounded-xl px-3 py-2 outline-none border border-[#333]"
          >
            <option value="dashboard">📊 Dashboard</option>
            <option value="motoristas">🏍️ Mototaxistas</option>
            <option value="mensalidades">💰 Mensalidades</option>
            <option value="corridas">🚖 Corridas</option>
            <option value="configuracoes">⚙️ Configurações</option>
          </select>
        </div>

        <header className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-white capitalize">{tab}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Olá, Admin</span>
            <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-xl shadow-sm border-2 border-[#FFD000]">👤</div>
            <button 
              onClick={() => {
                if (confirm("Deseja realmente sair do painel administrador?")) {
                  localStorage.removeItem("motosango_admin");
                  router.push("/");
                }
              }}
              className="md:hidden ml-2 text-red-400 hover:text-red-300 p-2"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>
          
        {tab === "dashboard" && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-[#111111] p-6 rounded-3xl shadow-sm border border-[#222] hover:border-[#FFD000] transition-colors">
                  <p className="text-gray-400 text-sm font-medium mb-1">Corridas Hoje</p>
                  <p className="text-3xl md:text-4xl font-bold text-[#FFD000]">{rides.length}</p>
                  <p className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">↑ +12% vs ontem</p>
                </div>
                <div className="bg-[#111111] p-6 rounded-3xl shadow-sm border border-[#222] hover:border-[#FFD000] transition-colors">
                  <p className="text-gray-400 text-sm font-medium mb-1">Corridas no Mês</p>
                  <p className="text-3xl md:text-4xl font-bold text-[#FFD000]">{rides.length * 10}</p>
                  <p className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">↑ +8% vs mês passado</p>
                </div>
                <div className="bg-[#111111] p-6 rounded-3xl shadow-sm border border-[#222] hover:border-[#FFD000] transition-colors">
                  <p className="text-gray-400 text-sm font-medium mb-1">Aguardando Aprovação</p>
                  <p className="text-3xl md:text-4xl font-bold text-red-500">{drivers.filter(d => !d.aprovado_admin).length}</p>
                </div>
                <div className="bg-[#111111] p-6 rounded-3xl shadow-sm border border-[#222] hover:border-[#FFD000] transition-colors">
                  <p className="text-gray-400 text-sm font-medium mb-1">Mototaxistas Online</p>
                  <p className="text-3xl md:text-4xl font-bold text-[#FFD000]">{drivers.filter(d => d.status_online).length}</p>
                  <p className="text-xs text-blue-400 font-bold mt-2">De {drivers.length} cadastrados</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-[#111111] p-6 rounded-3xl shadow-sm border border-[#222] lg:col-span-2">
                  <h3 className="font-bold text-white mb-6">Corridas por dia</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#1A1A1A'}} contentStyle={{backgroundColor: '#111', color: '#fff', borderRadius: '1rem', border: '1px solid #222'}} />
                        <Bar dataKey="corridas" fill="#FFD000" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#111111] p-6 rounded-3xl shadow-sm border border-[#222]">
                  <h3 className="font-bold text-white mb-6">Formas de Pagamento</h3>
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
                        <Tooltip contentStyle={{backgroundColor: '#111', color: '#fff', borderRadius: '1rem', border: '1px solid #222'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FFD000]"></div>
                      <span className="text-sm font-medium text-gray-400">Dinheiro (65%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-400">PIX (35%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {tab === "mensalidades" && (
          <div className="bg-[#111111] rounded-3xl shadow-sm border border-[#222] overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-[#1A1A1A] border-b border-[#222]">
                <tr>
                  <th className="p-4 font-medium text-gray-400">Nome</th>
                  <th className="p-4 font-medium text-gray-400">Telefone</th>
                  <th className="p-4 font-medium text-gray-400">Vencimento</th>
                  <th className="p-4 font-medium text-gray-400">Status</th>
                  <th className="p-4 font-medium text-gray-400">Renovar</th>
                  <th className="p-4 font-medium text-gray-400">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {drivers.map(driver => (
                  <tr key={driver.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="p-4 font-medium text-white">{driver.nome}</td>
                    <td className="p-4 text-gray-400">{driver.telefone}</td>
                    <td className="p-4 text-gray-400">
                      {driver.vencimento_mensalidade 
                        ? new Date(driver.vencimento_mensalidade).toLocaleDateString() 
                        : 'Teste grátis'}
                    </td>
                    <td className="p-4">
                      {driver.bloqueado_mensalidade ? (
                        <span className="px-2 py-1 bg-red-900/30 text-red-400 border border-red-800/50 text-xs rounded-full font-bold">Bloqueado</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-800/50 text-xs rounded-full font-bold">Ativo</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => atualizarMensalidade(driver.id, 7)} className="px-2 py-1 bg-blue-900/30 border border-blue-800/50 text-blue-400 text-xs font-bold rounded hover:bg-blue-800/50 transition-colors">+7d</button>
                        <button onClick={() => atualizarMensalidade(driver.id, 15)} className="px-2 py-1 bg-blue-900/30 border border-blue-800/50 text-blue-400 text-xs font-bold rounded hover:bg-blue-800/50 transition-colors">+15d</button>
                        <button onClick={() => atualizarMensalidade(driver.id, 30)} className="px-2 py-1 bg-blue-900/30 border border-blue-800/50 text-blue-400 text-xs font-bold rounded hover:bg-blue-800/50 transition-colors">+30d</button>
                      </div>
                    </td>
                    <td className="p-4">
                      {!driver.bloqueado_mensalidade ? (
                        <button 
                          onClick={() => alternarBloqueioMensalidade(driver.id, true)}
                          className="px-3 py-1 bg-red-900/30 border border-red-800/50 text-red-400 text-sm font-bold rounded hover:bg-red-800/50 transition-colors"
                        >
                          Bloquear
                        </button>
                      ) : (
                        <button 
                          onClick={() => alternarBloqueioMensalidade(driver.id, false)}
                          className="px-3 py-1 bg-green-900/30 border border-green-800/50 text-green-400 text-sm font-bold rounded hover:bg-green-800/50 transition-colors"
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
          <div className="bg-[#111111] rounded-3xl shadow-sm border border-[#222] overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-[#1A1A1A] border-b border-[#222]">
                <tr>
                  <th className="p-4 font-medium text-gray-400">Nome</th>
                  <th className="p-4 font-medium text-gray-400">Telefone</th>
                  <th className="p-4 font-medium text-gray-400">Moto</th>
                  <th className="p-4 font-medium text-gray-400">Chave PIX</th>
                  <th className="p-4 font-medium text-gray-400">Status</th>
                  <th className="p-4 font-medium text-gray-400">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {drivers.map(driver => (
                  <tr key={driver.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="p-4 font-medium text-white">{driver.nome}</td>
                    <td className="p-4 text-gray-400">{driver.telefone}</td>
                    <td className="p-4 text-gray-400">{driver.modelo_moto} - {driver.placa}</td>
                    <td className="p-4 text-gray-400">{driver.chave_pix || '-'}</td>
                    <td className="p-4">
                      {driver.aprovado_admin ? (
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-800/50 text-xs rounded-full font-bold">Aprovado</span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-800/50 text-xs rounded-full font-bold">Pendente</span>
                      )}
                    </td>
                    <td className="p-4">
                      {!driver.aprovado_admin ? (
                        <button 
                          onClick={() => aprovarMotorista(driver.id, true)}
                          className="px-3 py-1 bg-[#FFD000] text-black text-sm font-bold rounded hover:bg-yellow-500 transition-colors"
                        >
                          Aprovar
                        </button>
                      ) : (
                        <button 
                          onClick={() => aprovarMotorista(driver.id, false)}
                          className="px-3 py-1 bg-yellow-900/30 border border-yellow-800/50 text-yellow-400 text-sm font-bold rounded hover:bg-yellow-800/50 transition-colors"
                        >
                          Bloquear
                        </button>
                      )}
                      <button 
                        onClick={() => apagarMotorista(driver.id)}
                        className="ml-2 px-3 py-1 bg-red-900/30 border border-red-800/50 text-red-400 text-sm font-bold rounded hover:bg-red-800/50 transition-colors"
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
          <div className="bg-[#111111] rounded-3xl shadow-sm border border-[#222] overflow-hidden">
            <div className="p-4 border-b border-[#222] flex flex-wrap gap-2">
              {['todas', 'concluido', 'cancelado', 'aguardando', 'especial'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFiltroCorrida(f)}
                  className={`px-3 py-1.5 rounded-full text-sm font-bold capitalize transition-colors ${filtroCorrida === f ? 'bg-[#FFD000] text-black' : 'bg-[#1A1A1A] text-gray-400 hover:bg-[#222]'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <table className="w-full text-left">
              <thead className="bg-[#1A1A1A] border-b border-[#222]">
                <tr>
                  <th className="p-4 font-medium text-gray-400">Data</th>
                  <th className="p-4 font-medium text-gray-400">Cliente</th>
                  <th className="p-4 font-medium text-gray-400">Motorista</th>
                  <th className="p-4 font-medium text-gray-400">Trajeto</th>
                  <th className="p-4 font-medium text-gray-400">Status</th>
                  <th className="p-4 font-medium text-gray-400">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {rides.filter(r => {
                  if (filtroCorrida === 'todas') return true;
                  if (filtroCorrida === 'especial') return r.tipo_corrida === 'especial';
                  return r.status === filtroCorrida;
                }).map(ride => (
                  <tr key={ride.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="p-4 text-sm text-gray-400">{new Date(ride.created_at).toLocaleString()}</td>
                    <td className="p-4 font-medium text-white">{ride.users?.nome || '-'}</td>
                    <td className="p-4 text-gray-400">{ride.drivers?.nome || '-'}</td>
                    <td className="p-4 text-sm text-gray-400">
                      <div><span className="text-green-500 mr-1">•</span>{ride.origem}</div>
                      <div><span className="text-red-500 mr-1">•</span>{ride.destino}</div>
                      {ride.tipo_corrida === 'especial' && <span className="text-xs bg-purple-900/30 border border-purple-800/50 text-purple-400 px-2 py-0.5 rounded-full mt-1 inline-block">Especial</span>}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-[#1A1A1A] border border-[#333] text-gray-300 text-xs rounded-full font-bold">
                        {ride.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => apagarCorrida(ride.id)}
                        className="px-3 py-1 bg-red-900/30 border border-red-800/50 text-red-400 text-sm font-bold rounded hover:bg-red-800/50 transition-colors"
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
          <div className="bg-[#111111] rounded-3xl shadow-sm border border-[#222] p-6 max-w-xl">
            <h3 className="font-bold text-xl text-white mb-6">Configurações Globais</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Valor da Corrida Local (R$)</label>
                <div className="flex gap-4">
                  <input 
                    type="number" 
                    value={tarifaBase}
                    onChange={(e) => setTarifaBase(e.target.value)}
                    className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-xl p-3 outline-none focus:border-[#FFD000] text-white font-bold text-lg"
                    placeholder="10.00"
                    step="0.50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Valor da Mensalidade (R$)</label>
                <div className="flex gap-4">
                  <input 
                    type="number" 
                    value={mensalidadeValor}
                    onChange={(e) => setMensalidadeValor(e.target.value)}
                    className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-xl p-3 outline-none focus:border-[#FFD000] text-white font-bold text-lg"
                    placeholder="50.00"
                    step="5.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Chave PIX do Administrador</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={pixAdmin}
                    onChange={(e) => setPixAdmin(e.target.value)}
                    className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-xl p-3 outline-none focus:border-[#FFD000] text-white font-bold text-lg"
                    placeholder="E-mail, CPF, Telefone ou Aleatória"
                  />
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-gray-200">
                <h4 className="text-lg font-bold mb-4 text-gray-800">Regras de Preço Dinâmico (Corridas Especiais)</h4>
                <p className="text-sm text-gray-500 mb-6">
                  Ative estas regras para forçar as corridas locais a serem negociadas diretamente com o mototaxista.
                </p>
                
                <div className="space-y-4 mb-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={regraNoite} onChange={(e) => setRegraNoite(e.target.checked)} />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${regraNoite ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${regraNoite ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">Após as 22:00</span>
                      <span className="text-xs text-gray-500">Exige negociação de preço entre 22:00 e 06:00.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={regraSabado} onChange={(e) => setRegraSabado(e.target.checked)} />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${regraSabado ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${regraSabado ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">Sábados</span>
                      <span className="text-xs text-gray-500">Exige negociação de preço aos Sábados.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={regraDomingo} onChange={(e) => setRegraDomingo(e.target.checked)} />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${regraDomingo ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${regraDomingo ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">Domingos</span>
                      <span className="text-xs text-gray-500">Exige negociação de preço aos Domingos.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={regraFeriadoNacional} onChange={(e) => setRegraFeriadoNacional(e.target.checked)} />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${regraFeriadoNacional ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${regraFeriadoNacional ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">Feriados Nacionais</span>
                      <span className="text-xs text-gray-500">Exige negociação de preço em datas comemorativas nacionais.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={regraFeriadoLocal} onChange={(e) => setRegraFeriadoLocal(e.target.checked)} />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${regraFeriadoLocal ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${regraFeriadoLocal ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">Feriado Local Hoje</span>
                      <span className="text-xs text-gray-500">Ative manualmente esta chave no dia de um feriado municipal.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={salvarConfiguracoesGlobais}
                  disabled={salvandoTarifa}
                  className="w-full py-4 bg-[#FFD000] text-black font-bold rounded-xl shadow-sm hover:bg-yellow-500 transition-colors disabled:opacity-50 text-lg"
                >
                  {salvandoTarifa ? "Salvando..." : "Salvar Configurações"}
                </button>
                <p className="text-sm text-gray-400 mt-3 text-center">
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
