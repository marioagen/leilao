import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Settings2, PlusCircle, Plus } from 'lucide-react';

// Mock data based on the image
const managers = [
  { id: 1, name: 'Halana Santos de Oliveira Andrade', analystsCount: 0, expanded: false },
  { id: 2, name: 'Alexandre Augusto Domingues Winetzki', analystsCount: 0, expanded: false },
  { id: 3, name: 'Alisson Forneck De Araujo', analystsCount: 0, expanded: false },
  { id: 4, name: 'ANA CARLA PEREIRA LOPES', analystsCount: 22, expanded: true },
];

const analysts = [
  {
    matricula: 'c119936',
    nome: 'ALESSANDRA RESENDE CARVALHO',
    email: 'alessandra.r.carvalho@caixa.gov.br',
    local: 'BSB',
    bolsao: null,
    docs: [
      '2222 - 32197_10104809081_85053_9948000223421_1',
      '2208 - 126334_9001318220757_31_0011804421_1'
    ],
    moreDocs: 2
  },
  {
    matricula: 'C070789',
    nome: 'ANDRELIA RAMOS COSTA',
    email: 'andrelia.costa@caixa.gov.br',
    local: 'BSB',
    bolsao: null,
    docs: [],
    moreDocs: 0
  },
  {
    matricula: 'C143464',
    nome: 'CHARLES HERMANY OLIVEIRA CAMPOS',
    email: 'charles.campos@caixa.gov.br',
    local: 'BSB',
    bolsao: null,
    docs: [],
    moreDocs: 0
  }
];

export default function GestaoFilas() {
  const [activeTab, setActiveTab] = useState('Visão por Gestor');
  const [expandedManager, setExpandedManager] = useState<number | null>(4);
  const [activeSubTab, setActiveSubTab] = useState('Todos');

  const toggleManager = (id: number) => {
    setExpandedManager(expandedManager === id ? null : id);
  };

  return (
    <div className="bg-white min-h-screen p-6 font-sans w-full">
      {/* Top Tabs and Search */}
      <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-0">
        <div className="flex">
          {['Visão por Gestor', 'Fila Geral', 'Totalizador Geral'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 font-medium text-sm transition-colors rounded-t-lg ${
                activeTab === tab 
                  ? 'text-primary bg-[#f0f7fd] border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="ml-auto relative flex items-center mb-2">
          <input
            type="text"
            placeholder="Buscar documento nos bolsões"
            className="border border-gray-300 rounded-l-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-primary"
          />
          <button className="border border-l-0 border-gray-300 rounded-r-md px-3 py-1.5 bg-white hover:bg-gray-50">
            <Search size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Main Search */}
      <div className="mb-4">
        <div className="relative flex items-center w-full">
          <div className="absolute left-3 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Pesquisar gestor"
            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm bg-[#f8f9fa] focus:outline-none focus:border-primary focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Managers List */}
      <div className="space-y-2">
        {managers.map((manager) => (
          <div key={manager.id} className="border border-gray-200 rounded-md overflow-hidden">
            {/* Manager Header */}
            <div 
              className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${expandedManager === manager.id ? 'bg-[#eef5fc]' : 'bg-[#f4f8fb] hover:bg-[#eef5fc]'}`}
              onClick={() => toggleManager(manager.id)}
            >
              <div className="flex items-center gap-2 text-[#00509e]">
                {expandedManager === manager.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                <span className="font-semibold text-[13px]">{manager.name}</span>
                <span className="text-[11px] text-gray-500 font-normal">({manager.analystsCount} analistas)</span>
              </div>
              
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <button className="flex items-center gap-1.5 bg-[#5c6b7a] hover:bg-[#4a5663] text-white px-3 py-1.5 rounded text-[11px] font-medium transition-colors">
                  <Settings2 size={14} />
                  Gerenciar Fila e Bolsões
                </button>
                <button className="flex items-center gap-1.5 bg-[#0060c7] hover:bg-[#0050a8] text-white px-3 py-1.5 rounded text-[11px] font-medium transition-colors">
                  <PlusCircle size={14} />
                  Atribuir Bolsão
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedManager === manager.id && (
              <div className="bg-white p-4 border-t border-gray-200">
                {/* Analyst Search */}
                <div className="relative flex items-center w-full mb-4">
                  <div className="absolute left-3 text-gray-400">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Pesquisar Nome ou Matrícula"
                    className="w-full border border-gray-300 rounded-md py-1.5 pl-9 pr-4 text-sm bg-[#f8f9fa] focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>

                {/* Sub Tabs */}
                <div className="flex items-center gap-6 border-b border-gray-200 mb-4">
                  {[
                    { name: 'Todos', count: 22 },
                    { name: 'Sem Bolsão', count: 21 },
                    { name: 'Novo Bolsão', count: 1, alert: 0 },
                    { name: 'Bolsão Teste', count: 0, alert: 0 }
                  ].map(tab => (
                    <button
                      key={tab.name}
                      onClick={() => setActiveSubTab(tab.name)}
                      className={`pb-2 text-[12px] font-medium transition-colors relative flex items-center gap-1.5 ${
                        activeSubTab === tab.name ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.name}
                      <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{tab.count}</span>
                      {tab.alert !== undefined && (
                        <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                          {tab.alert}
                        </span>
                      )}
                      {activeSubTab === tab.name && (
                        <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Analysts Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-gray-500 uppercase border-b border-gray-200">
                      <tr>
                        <th className="py-2 font-medium w-24">MATRÍCULA</th>
                        <th className="py-2 font-medium">NOME</th>
                        <th className="py-2 font-medium">E-MAIL</th>
                        <th className="py-2 font-medium w-16">LOCAL</th>
                        <th className="py-2 font-medium w-32">BOLSÃO</th>
                        <th className="py-2 font-medium">DOCS. ATRIBUÍDOS</th>
                        <th className="py-2 font-medium w-24 text-center">AÇÃO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {analysts.map((analyst, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-3 text-gray-700">{analyst.matricula}</td>
                          <td className="py-3 font-semibold text-gray-800">{analyst.nome}</td>
                          <td className="py-3 text-gray-600">{analyst.email}</td>
                          <td className="py-3 text-gray-600">{analyst.local}</td>
                          <td className="py-3">
                            <span className="text-gray-400 italic">Não atribuído</span>
                          </td>
                          <td className="py-3">
                            {analyst.docs.length > 0 ? (
                              <div className="text-gray-700 text-[10px] leading-tight">
                                {analyst.docs.map((doc, i) => (
                                  <div key={i}>{doc}</div>
                                ))}
                                {analyst.moreDocs > 0 && (
                                  <div className="text-gray-500 mt-0.5">(+{analyst.moreDocs}...)</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Sem Documentos</span>
                            )}
                          </td>
                          <td className="py-3 text-center">
                            <button className="inline-flex items-center gap-1 px-3 py-1 border border-primary text-primary rounded text-[11px] font-medium hover:bg-primary-light/20 transition-colors">
                              <Plus size={12} /> Atribuir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
