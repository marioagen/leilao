import React, { useState } from 'react';
import { ProcessConfig, ResponseTemplate } from '../types';
import { Settings, Save, MessageSquareText } from 'lucide-react';

interface Props {
  configs: ProcessConfig[];
  templates: ResponseTemplate[];
  onUpdateConfig: (config: ProcessConfig) => void;
  onCreateConfig: (config: ProcessConfig) => void;
  onDeleteConfig: (id: string) => void;
  onUpdateTemplate: (template: ResponseTemplate) => void;
}

export default function AdminBackoffice({ configs, templates, onUpdateConfig, onCreateConfig, onDeleteConfig, onUpdateTemplate }: Props) {
  const [tab, setTab] = useState<'PROCESS' | 'TEMPLATES'>('TEMPLATES');
  const [activeConfig, setActiveConfig] = useState<ProcessConfig | null>(configs[0] || null);
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [isCreatingConfig, setIsCreatingConfig] = useState(false);

  const handleCreateNewConfig = () => {
    const newConfig: ProcessConfig = {
      id: `proc_${Date.now()}`,
      name: 'Nova Categoria de Chamado',
      requiredDocs: ['Documento 1'],
      validationRules: 'Instruções para a IA aqui...',
      approvalTemplate: 'Template de aprovação...',
      rejectionTemplate: 'Template de rejeição...'
    };
    setActiveConfig(newConfig);
    setIsCreatingConfig(true);
  };

  const handleSaveConfig = () => {
    if (!activeConfig) return;
    if (isCreatingConfig) {
      onCreateConfig(activeConfig);
      setIsCreatingConfig(false);
    } else {
      onUpdateConfig(activeConfig);
    }
  };

  const handleDeleteConfig = () => {
    if (!activeConfig) return;
    if (confirm('Tem certeza que deseja excluir este tipo de atendimento?')) {
      onDeleteConfig(activeConfig.id);
      setActiveConfig(configs[0] || null);
      setIsCreatingConfig(false);
    }
  };

  const handleDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeConfig) return;
    const docs = e.target.value.split(',').map(d => d.trim()).filter(d => d);
    setActiveConfig({ ...activeConfig, requiredDocs: docs });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-light flex flex-col overflow-hidden min-h-[600px]">
      <div className="flex border-b border-border-light bg-gray-50">
        <button 
          onClick={() => setTab('PROCESS')} 
          className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${tab === 'PROCESS' ? 'bg-white border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <Settings size={18}/> Tipos de Processo
        </button>
        <button 
          onClick={() => setTab('TEMPLATES')} 
          className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${tab === 'TEMPLATES' ? 'bg-white border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <MessageSquareText size={18}/> Templates de Resposta
        </button>
      </div>

      <div className="flex flex-1">
        {tab === 'PROCESS' ? (
          <>
            <div className="w-1/3 border-r border-border-light bg-gray-50 p-4 overflow-y-auto flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Tipos de Atendimento</h3>
                <button 
                  onClick={handleCreateNewConfig}
                  className="bg-primary text-white text-xs px-3 py-1.5 rounded hover:bg-primary-dark transition-colors"
                >
                  + Novo
                </button>
              </div>
              <div className="space-y-2 flex-1">
                {configs.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => { setActiveConfig(c); setIsCreatingConfig(false); }} 
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeConfig?.id === c.id && !isCreatingConfig ? 'bg-primary text-white' : 'hover:bg-gray-200 text-gray-700'}`}
                  >
                    {c.name}
                  </button>
                ))}
                {isCreatingConfig && activeConfig && (
                  <button 
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors bg-primary text-white"
                  >
                    {activeConfig.name} (Novo)
                  </button>
                )}
              </div>
            </div>
            <div className="w-2/3 p-6 space-y-6 overflow-y-auto">
              {activeConfig ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{isCreatingConfig ? 'Novo Tipo de Atendimento' : `Configurar: ${activeConfig.name}`}</h2>
                    {!isCreatingConfig && (
                      <button onClick={handleDeleteConfig} className="text-danger hover:text-danger-dark text-sm font-medium">
                        Excluir
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria do Chamado (Nome)</label>
                    <input 
                      type="text"
                      className="w-full border border-border-light rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary"
                      value={activeConfig.name}
                      onChange={e => setActiveConfig({...activeConfig, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documentos Necessários (separados por vírgula)</label>
                    <input 
                      type="text"
                      className="w-full border border-border-light rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary"
                      value={activeConfig.requiredDocs.join(', ')}
                      onChange={handleDocsChange}
                      placeholder="Ex: Matrícula Atualizada, IPTU, Proposta Assinada"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instruções para a IA (Regras de Validação)</label>
                    <textarea 
                      className="w-full border border-border-light rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary h-24"
                      value={activeConfig.validationRules}
                      onChange={e => setActiveConfig({...activeConfig, validationRules: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template de Aprovação</label>
                    <textarea 
                      className="w-full border border-border-light rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary h-20"
                      value={activeConfig.approvalTemplate}
                      onChange={e => setActiveConfig({...activeConfig, approvalTemplate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template de Rejeição</label>
                    <textarea 
                      className="w-full border border-border-light rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary h-20"
                      value={activeConfig.rejectionTemplate}
                      onChange={e => setActiveConfig({...activeConfig, rejectionTemplate: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button onClick={handleSaveConfig} className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-primary-dark">
                      <Save size={18} /> Salvar Configurações
                    </button>
                    {isCreatingConfig && (
                      <button onClick={() => { setIsCreatingConfig(false); setActiveConfig(configs[0] || null); }} className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200">
                        Cancelar
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Selecione ou crie um tipo de atendimento.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="w-1/3 border-r border-border-light bg-gray-50 p-4 overflow-y-auto">
              <div className="space-y-4">
                {Array.from(new Set(templates.map(t => t.category))).map(category => (
                  <div key={category}>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">{category}</h4>
                    <div className="space-y-1">
                      {templates.filter(t => t.category === category).map(t => (
                        <button key={t.id} onClick={() => setActiveTemplate(t)} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTemplate.id === t.id ? 'bg-primary text-white' : 'hover:bg-gray-200 text-gray-700'}`}>
                          {t.subject}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-2/3 p-6 space-y-6 overflow-y-auto">
              <h2 className="text-xl font-semibold">Editar Template</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <input 
                  type="text"
                  className="w-full border border-border-light rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary bg-gray-50"
                  value={activeTemplate.category}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                <input 
                  type="text"
                  className="w-full border border-border-light rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary"
                  value={activeTemplate.subject}
                  onChange={e => setActiveTemplate({...activeTemplate, subject: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea 
                  className="w-full border border-border-light rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary h-64"
                  value={activeTemplate.message}
                  onChange={e => setActiveTemplate({...activeTemplate, message: e.target.value})}
                />
              </div>
              
              <button onClick={() => onUpdateTemplate(activeTemplate)} className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-primary-dark">
                <Save size={18} /> Salvar Template
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
