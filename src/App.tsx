import React, { useState } from 'react';
import { Building, Users, Settings, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Role, Contract, ProcessConfig, Event, ResponseTemplate } from './types';
import { initialContracts, initialConfigs, initialTemplates } from './mockData';
import Dashboard from './components/Dashboard';
import ContractPortal from './components/ContractPortal';
import AdminBackoffice from './components/AdminBackoffice';

export default function App() {
  const [role, setRole] = useState<Role>('CLIENTE');
  const [view, setView] = useState<'DASHBOARD' | 'CONTRACT' | 'ADMIN'>('DASHBOARD');
  const [activeContractId, setActiveContractId] = useState<string | null>(null);
  
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [configs, setConfigs] = useState<ProcessConfig[]>(initialConfigs);
  const [templates, setTemplates] = useState<ResponseTemplate[]>(initialTemplates);

  const activeContract = contracts.find(c => c.id === activeContractId);
  const activeConfig = activeContract ? configs.find(c => c.id === activeContract.processTypeId) : null;

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
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Building size={24} />
            </div>
            <h1 className="font-bold text-xl text-primary-dark hidden sm:block">Imóveis CAIXA</h1>
            <span className="text-gray-400 hidden sm:block">|</span>
            <span className="font-medium text-gray-600">Portal de Pós-Venda</span>
          </div>

          <div className="flex items-center gap-4">
            {role === 'ADMIN' && (
              <button onClick={() => setView('ADMIN')} className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${view === 'ADMIN' ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Settings size={18} className="inline mr-1" /> Backoffice
              </button>
            )}
            <div className="flex items-center gap-2 bg-gray-50 border border-border-light rounded-lg p-1">
              <Users size={16} className="text-gray-500 ml-2" />
              <select 
                value={role} 
                onChange={(e) => {
                  setRole(e.target.value as Role);
                  setView('DASHBOARD');
                  setActiveContractId(null);
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
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {view === 'CONTRACT' && (
          <button onClick={() => setView('DASHBOARD')} className="flex items-center gap-1 text-primary font-medium mb-6 hover:underline">
            <ChevronLeft size={20} /> Voltar ao Dashboard
          </button>
        )}

        {view === 'DASHBOARD' && (
          <Dashboard 
            contracts={contracts} 
            configs={configs}
            role={role} 
            onSelect={(id) => { setActiveContractId(id); setView('CONTRACT'); }} 
            onCreateTicket={handleCreateTicket}
          />
        )}

        {view === 'CONTRACT' && activeContract && activeConfig && (
          <ContractPortal 
            contract={activeContract} 
            role={role} 
            config={activeConfig}
            templates={templates}
            onAddEvent={handleAddEvent}
            onUpdateStatus={handleUpdateStatus}
            onUpdateSupportLevel={handleUpdateSupportLevel}
          />
        )}

        {view === 'ADMIN' && role === 'ADMIN' && (
          <AdminBackoffice 
            configs={configs} 
            templates={templates}
            onUpdateConfig={handleUpdateConfig} 
            onCreateConfig={handleCreateConfig}
            onDeleteConfig={handleDeleteConfig}
            onUpdateTemplate={handleUpdateTemplate}
          />
        )}
      </main>
    </div>
  );
}
