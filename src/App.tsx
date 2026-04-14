import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { Building, Users, Settings, ChevronLeft, ShieldCheck, Menu, X, List, Layers } from 'lucide-react';
import { Role, Contract, ProcessConfig, Event, ResponseTemplate } from './types';
import { initialContracts, initialConfigs, initialTemplates } from './mockData';
import Dashboard from './components/Dashboard';
import ContractPortal from './components/ContractPortal';
import AdminBackoffice from './components/AdminBackoffice';
import ListagemGeral from './components/ListagemGeral';
import GestaoFilas from './components/GestaoFilas';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const pathParts = location.pathname.split('/');
  const urlRole = pathParts[1]?.toUpperCase() as Role;
  const validRoles: Role[] = ['CLIENTE', 'ANALISTA', 'GESTOR', 'ADMIN'];
  const role = validRoles.includes(urlRole) ? urlRole : 'CLIENTE';
  const rolePath = role.toLowerCase();

  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [configs, setConfigs] = useState<ProcessConfig[]>(initialConfigs);
  const [templates, setTemplates] = useState<ResponseTemplate[]>(initialTemplates);

  const handleAddEvent = (contractId: string, event: Event) => {
    setContracts(prev => prev.map(c => 
      c.id === contractId ? { ...c, events: [...c.events, event] } : c
    ));
  };

  const handleUpdateStatus = (contractId: string, status: Contract['status']) => {
    setContracts(prev => prev.map(c => 
      c.id === contractId ? { ...c, status } : c
    ));
  };

  const handleUpdateSupportLevel = (contractId: string, level: 'N1' | 'N2') => {
    setContracts(prev => prev.map(c => 
      c.id === contractId ? { ...c, supportLevel: level } : c
    ));
  };

  const handleUpdateConfig = (updatedConfig: ProcessConfig) => {
    setConfigs(prev => prev.map(c => c.id === updatedConfig.id ? updatedConfig : c));
    alert('Configuração salva com sucesso!');
  };

  const handleCreateConfig = (newConfig: ProcessConfig) => {
    setConfigs(prev => [...prev, newConfig]);
    alert('Tipo de Atendimento criado com sucesso!');
  };

  const handleDeleteConfig = (id: string) => {
    setConfigs(prev => prev.filter(c => c.id !== id));
    alert('Tipo de Atendimento removido com sucesso!');
  };

  const handleUpdateTemplate = (updatedTemplate: ResponseTemplate) => {
    setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    alert('Template salvo com sucesso!');
  };

  const handleCreateTicket = (title: string, category: string) => {
    const supportLevel = category === 'IPTU' ? 'N2' : 'N1';
    const newTicket: Contract = {
      id: Date.now().toString(),
      title,
      clientName: role === 'CLIENTE' ? 'João Silva' : 'Cliente Novo',
      corretorName: role === 'CORRETOR' ? 'Maria Corretora' : 'Corretor Padrão',
      status: 'PENDENTE_DOCS',
      processTypeId: 'proc_1', // default
      category,
      supportLevel,
      events: [{
        id: Date.now().toString(),
        type: 'STATUS_CHANGE',
        author: 'Sistema',
        role: 'SISTEMA',
        timestamp: new Date(),
        content: `Chamado aberto na categoria ${category}. Nível de suporte: ${supportLevel}`,
        isInternal: true
      }]
    };
    setContracts([newTicket, ...contracts]);
  };

  return (
    <div className="min-h-screen bg-bg-app flex flex-col font-sans text-gray-800">
      {/* Top Navigation */}
      <header className="bg-white border-b border-border-light shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-border-light rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    navigate(`/${rolePath}/dashboard`);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${location.pathname.includes('/dashboard') ? 'text-primary font-medium bg-primary-light/20' : 'text-gray-700'}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate(`/${rolePath}/listagem-geral`);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${location.pathname.includes('/listagem-geral') ? 'text-primary font-medium bg-primary-light/20' : 'text-gray-700'}`}
                >
                  <List size={16} /> Listagem Geral
                </button>
                <button
                  onClick={() => {
                    navigate(`/${rolePath}/gestao-filas`);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${location.pathname.includes('/gestao-filas') ? 'text-primary font-medium bg-primary-light/20' : 'text-gray-700'}`}
                >
                  <Layers size={16} /> Gestão de Filas
                </button>
                {location.pathname.includes('/contract/') && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors text-primary font-medium bg-primary-light/20`}
                  >
                    Contrato Atual
                  </button>
                )}
                {role === 'ADMIN' && (
                  <button
                    onClick={() => {
                      navigate(`/${rolePath}/backoffice`);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${location.pathname.includes('/backoffice') ? 'text-primary font-medium bg-primary-light/20' : 'text-gray-700'}`}
                  >
                    Backoffice
                  </button>
                )}
              </div>
            )}

            <div className="bg-primary text-white p-2 rounded-lg">
              <Building size={24} />
            </div>
            <h1 className="font-bold text-xl text-primary-dark hidden sm:block">Imóveis CAIXA</h1>
            <span className="text-gray-400 hidden sm:block">|</span>
            <span className="font-medium text-gray-600">Portal de Pós-Venda</span>
          </div>

          <div className="flex items-center gap-4">
            {role === 'ADMIN' && (
              <button onClick={() => navigate(`/${rolePath}/backoffice`)} className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${location.pathname.includes('/backoffice') ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Settings size={18} className="inline mr-1" /> Backoffice
              </button>
            )}
            <div className="flex items-center gap-2 bg-gray-50 border border-border-light rounded-lg p-1">
              <Users size={16} className="text-gray-500 ml-2" />
              <select 
                value={role} 
                onChange={(e) => {
                  const newRole = e.target.value.toLowerCase();
                  let nextView = pathParts[2] || 'dashboard';
                  if (nextView === 'backoffice' && newRole !== 'admin') {
                    nextView = 'dashboard';
                  }
                  if (nextView === 'contract') {
                    nextView = `contract/${pathParts[3]}`;
                  }
                  navigate(`/${newRole}/${nextView}`);
                }}
                className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer py-1 pr-8"
              >
                <option value="CLIENTE">Visão: Cliente</option>
                <option value="CORRETOR">Visão: Corretor</option>
                <option value="AGENTE">Visão: Agente CAIXA</option>
                <option value="ADMIN">Visão: Admin (Negócios)</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 p-4 md:p-8 mx-auto w-full ${(location.pathname.includes('/listagem-geral') || location.pathname.includes('/gestao-filas')) ? 'max-w-[1600px]' : 'max-w-7xl'}`}>
        {location.pathname.includes('/contract/') && (
          <button onClick={() => navigate(`/${rolePath}/dashboard`)} className="flex items-center gap-1 text-primary font-medium mb-6 hover:underline">
            <ChevronLeft size={20} /> Voltar ao Dashboard
          </button>
        )}

        <Routes>
          <Route path="/" element={<Navigate to="/cliente/dashboard" replace />} />
          
          <Route path="/:urlRole/dashboard" element={
            <Dashboard 
              contracts={contracts} 
              configs={configs}
              role={role} 
              onSelect={(id) => navigate(`/${rolePath}/contract/${id}`)} 
              onCreateTicket={handleCreateTicket}
            />
          } />

          <Route path="/:urlRole/contract/:id" element={
            <ContractRoute 
              contracts={contracts}
              configs={configs}
              templates={templates}
              role={role}
              onAddEvent={handleAddEvent}
              onUpdateStatus={handleUpdateStatus}
              onUpdateSupportLevel={handleUpdateSupportLevel}
            />
          } />

          <Route path="/:urlRole/backoffice" element={
            role === 'ADMIN' ? (
              <AdminBackoffice 
                configs={configs} 
                templates={templates}
                onUpdateConfig={handleUpdateConfig} 
                onCreateConfig={handleCreateConfig}
                onDeleteConfig={handleDeleteConfig}
                onUpdateTemplate={handleUpdateTemplate}
              />
            ) : (
              <Navigate to={`/${rolePath}/dashboard`} replace />
            )
          } />

          <Route path="/:urlRole/listagem-geral" element={<ListagemGeral />} />
          <Route path="/:urlRole/gestao-filas" element={<GestaoFilas />} />

          {/* Legacy routes */}
          <Route path="/dashboard" element={<Navigate to="/cliente/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/backoffice" replace />} />
          <Route path="/listagem-geral" element={<Navigate to="/cliente/listagem-geral" replace />} />
          <Route path="/gestao-filas" element={<Navigate to="/cliente/gestao-filas" replace />} />
          <Route path="/contract/:id" element={<LegacyContractRedirect />} />
        </Routes>
      </main>
    </div>
  );
}

function LegacyContractRedirect() {
  const { id } = useParams();
  return <Navigate to={`/cliente/contract/${id}`} replace />;
}

// Wrapper component to extract ID from URL and pass to ContractPortal
function ContractRoute({ contracts, configs, templates, role, onAddEvent, onUpdateStatus, onUpdateSupportLevel }: any) {
  const { id } = useParams();
  const activeContract = contracts.find((c: any) => c.id === id);
  const activeConfig = activeContract ? configs.find((c: any) => c.id === activeContract.processTypeId) : null;

  if (!activeContract || !activeConfig) {
    return <div className="p-8 text-center text-gray-500">Contrato não encontrado.</div>;
  }

  return (
    <ContractPortal 
      contract={activeContract} 
      role={role} 
      config={activeConfig}
      templates={templates}
      onAddEvent={onAddEvent}
      onUpdateStatus={onUpdateStatus}
      onUpdateSupportLevel={onUpdateSupportLevel}
    />
  );
}
