import React, { useState, useRef, useEffect } from 'react';
import { Contract, Role, ProcessConfig } from '../types';
import { Users, FileText, CheckCircle, Clock, AlertCircle, Search, Plus, X, Upload, File as FileIcon } from 'lucide-react';

interface Props {
  contracts: Contract[];
  configs: ProcessConfig[];
  role: Role;
  onSelect: (id: string) => void;
  onCreateTicket: (title: string, category: string) => void;
}

export default function Dashboard({ contracts, configs, role, onSelect, onCreateTicket }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(configs[0]?.name || '');
  const [attachedFiles, setAttachedFiles] = useState<{file: File, type: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState({
    id: '',
    category: '',
    level: '',
    clientName: '',
    title: '',
    corretorName: ''
  });

  useEffect(() => {
    if (configs.length > 0 && !newCategory) {
      setNewCategory(configs[0].name);
    }
  }, [configs, newCategory]);

  const REQUIRED_DOCS_BY_CATEGORY: Record<string, string[]> = configs.reduce((acc, config) => {
    acc[config.name] = config.requiredDocs;
    return acc;
  }, {} as Record<string, string[]>);

  const filtered = contracts.filter(c => {
    if (role === 'CLIENTE' && c.clientName !== 'João Silva') return false;
    if (role === 'CORRETOR' && c.corretorName !== 'Maria Corretora') return false;

    if (filters.id && !c.id.toLowerCase().includes(filters.id.toLowerCase())) return false;
    if (filters.category && !c.category?.toLowerCase().includes(filters.category.toLowerCase())) return false;
    if (filters.level && c.supportLevel !== filters.level) return false;
    if (filters.clientName && !c.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) return false;
    if (filters.title && !c.title.toLowerCase().includes(filters.title.toLowerCase())) return false;
    if (filters.corretorName && !c.corretorName.toLowerCase().includes(filters.corretorName.toLowerCase())) return false;

    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateTicket(newTitle, newCategory);
    setIsModalOpen(false);
    setNewTitle('');
    setAttachedFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({ file, type: '' }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
    // Reset input so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (indexToRemove: number) => {
    setAttachedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const updateFileType = (index: number, type: string) => {
    setAttachedFiles(prev => {
      const updated = [...prev];
      updated[index].type = type;
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary-light p-2 rounded-lg text-primary">
            <Users size={24} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Atendimento</h2>
        </div>
        {(role === 'CLIENTE' || role === 'CORRETOR') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary-dark transition-colors"
          >
            <Plus size={20} /> Novo Chamado
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button className="flex items-center gap-2 bg-white border border-primary text-primary px-4 py-2 rounded-md font-medium text-sm shadow-sm">
          <FileText size={16} />
          Pendentes
          <span className="bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
            {filtered.length}
          </span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-light flex flex-wrap justify-end items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Exibir</span>
            <select className="border border-border-light rounded p-1 outline-none bg-white">
              <option>25</option>
            </select>
            <span>resultados por página</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Status</span>
            <select className="border border-border-light rounded p-1 outline-none bg-white">
              <option>3 selecionados</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>Prazo</span>
            <select className="border border-border-light rounded p-1 outline-none bg-white">
              <option>Todos</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border-light text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-2 py-3 font-bold w-16 text-center">Ação</th>
                <th className="px-2 py-3 font-bold">ID</th>
                <th className="px-2 py-3 font-bold">Categoria</th>
                <th className="px-2 py-3 font-bold text-center">Nível</th>
                <th className="px-2 py-3 font-bold">Solicitante</th>
                <th className="px-2 py-3 font-bold">Assunto</th>
                <th className="px-2 py-3 font-bold">Abertura</th>
                <th className="px-2 py-3 font-bold">Prazo</th>
                <th className="px-2 py-3 font-bold">Responsável</th>
                <th className="px-2 py-3 font-bold text-center">Prioridade</th>
              </tr>
              <tr className="bg-gray-50 border-b border-border-light">
                <th className="px-2 py-1.5"></th>
                <th className="px-2 py-1.5">
                  <input type="text" placeholder="Filtrar..." className="w-full text-[10px] p-1 border border-[#d0d4d9] rounded outline-none focus:border-[#0073ea] font-normal bg-white" value={filters.id} onChange={e => setFilters({...filters, id: e.target.value})} />
                </th>
                <th className="px-2 py-1.5">
                  <input type="text" placeholder="Filtrar..." className="w-full text-[10px] p-1 border border-[#d0d4d9] rounded outline-none focus:border-[#0073ea] font-normal bg-white" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} />
                </th>
                <th className="px-2 py-1.5">
                  <select className="w-full text-[10px] p-1 border border-[#d0d4d9] rounded outline-none focus:border-[#0073ea] font-normal bg-white" value={filters.level} onChange={e => setFilters({...filters, level: e.target.value})}>
                    <option value="">Todos</option>
                    <option value="N1">N1</option>
                    <option value="N2">N2</option>
                  </select>
                </th>
                <th className="px-2 py-1.5">
                  <input type="text" placeholder="Filtrar..." className="w-full text-[10px] p-1 border border-[#d0d4d9] rounded outline-none focus:border-[#0073ea] font-normal bg-white" value={filters.clientName} onChange={e => setFilters({...filters, clientName: e.target.value})} />
                </th>
                <th className="px-2 py-1.5">
                  <input type="text" placeholder="Filtrar..." className="w-full text-[10px] p-1 border border-[#d0d4d9] rounded outline-none focus:border-[#0073ea] font-normal bg-white" value={filters.title} onChange={e => setFilters({...filters, title: e.target.value})} />
                </th>
                <th className="px-2 py-1.5"></th>
                <th className="px-2 py-1.5"></th>
                <th className="px-2 py-1.5">
                  <input type="text" placeholder="Filtrar..." className="w-full text-[10px] p-1 border border-[#d0d4d9] rounded outline-none focus:border-[#0073ea] font-normal bg-white" value={filters.corretorName} onChange={e => setFilters({...filters, corretorName: e.target.value})} />
                </th>
                <th className="px-2 py-1.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filtered.map((c, i) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors bg-white">
                  <td className="px-2 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => onSelect(c.id)}
                        title="Consultar"
                        className="p-1.5 text-primary hover:bg-primary-light rounded-md transition-colors"
                      >
                        <Search size={16} />
                      </button>
                      <button 
                        onClick={() => onSelect(c.id)}
                        title="Concluir"
                        className="p-1.5 text-[#0f9d58] hover:bg-[#e6f4ea] rounded-md transition-colors"
                      >
                        <CheckCircle size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-xs text-gray-700 font-mono" title={`699e479f1d4a7f8df222a${580 + i}`}>
                    ...222a{580 + i}
                  </td>
                  <td className="px-2 py-3 text-xs text-gray-600 font-medium truncate max-w-[120px]" title={c.category || 'Atendimento Geral'}>
                    {c.category || 'Atendimento Geral'}
                  </td>
                  <td className="px-2 py-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.supportLevel === 'N2' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {c.supportLevel || 'N1'}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="text-xs font-bold text-gray-800 truncate max-w-[100px]" title={c.clientName}>{c.clientName}</div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wide mt-0.5">CLIENTE</div>
                  </td>
                  <td className="px-2 py-3 text-xs text-gray-600 truncate max-w-[160px]" title={c.title}>{c.title}</td>
                  <td className="px-2 py-3 text-xs text-gray-600">
                    <div>{c.events[0]?.timestamp.toLocaleDateString('pt-BR') || '25/02/2026'}</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">{c.events[0]?.timestamp.toLocaleTimeString('pt-BR') || '00:51:43'}</div>
                  </td>
                  <td className="px-2 py-3 text-xs text-gray-600">04/03/2026</td>
                  <td className="px-2 py-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0f9d58] shrink-0"></div>
                      <span className="truncate max-w-[100px]" title={c.corretorName}>{c.corretorName}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <span className="text-[9px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full">Não</span>
                      {i % 2 === 0 ? <AlertCircle size={14} className="text-primary" /> : <Clock size={14} className="text-warning" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Chamado */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[95vh] overflow-hidden">
            <div className="flex items-center gap-2 p-4 sm:p-6 border-b border-[#d0d4d9] shrink-0">
              <FileText className="text-[#0060c7]" size={20} />
              <h3 className="font-semibold text-lg text-[#0060c7]">Dados da solicitação</h3>
              <button onClick={() => setIsModalOpen(false)} className="ml-auto text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4 sm:p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#5c738b] mb-1">Número do Contrato</label>
                  <input type="text" className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#0073ea] outline-none" placeholder="Ex: 265485" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5c738b] mb-1">Atividade</label>
                  <select className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#0073ea] outline-none">
                    <option>Atendimento</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#5c738b] mb-1">Data da Demanda</label>
                  <input type="text" disabled value={new Date().toLocaleDateString('pt-BR')} className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5c738b] mb-1">Tipo do Solicitante</label>
                  <input type="text" disabled value={role === 'CLIENTE' ? 'Cliente' : 'Corretor'} className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm bg-gray-50 text-gray-500" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#5c738b] mb-1">Nome do Solicitante</label>
                  <input type="text" disabled value={role === 'CLIENTE' ? 'João Silva' : 'Maria Corretora'} className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm bg-gray-50 text-gray-500" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#5c738b] mb-1">Categoria do Chamado <span className="text-[#d83a52]">*</span></label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#0073ea] outline-none"
                  >
                    {configs.map(config => (
                      <option key={config.id} value={config.name}>{config.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#5c738b] mb-1">Assunto <span className="text-[#d83a52]">*</span></label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#0073ea] outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#5c738b] mb-2">Arquivos anexados</label>
                <div 
                  className="border border-dashed border-[#d0d4d9] rounded-lg p-6 flex flex-col items-center justify-center text-center bg-[#f8f9fb] hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="text-gray-400 mb-2" size={24} />
                  <span className="text-sm text-[#0060c7] font-medium">Clique para anexar arquivos</span>
                  <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</span>
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>

                {attachedFiles.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {attachedFiles.map((item, index) => (
                      <div key={index} className="flex flex-col gap-3 bg-white border border-[#d0d4d9] rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-[#e1e9f8] p-2 rounded text-[#0060c7] shrink-0">
                              <FileIcon size={16} />
                            </div>
                            <div className="truncate">
                              <p className="text-sm font-medium text-gray-700 truncate">{item.file.name}</p>
                              <p className="text-xs text-gray-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-gray-400 hover:text-[#d83a52] p-1 transition-colors shrink-0"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#5c738b] mb-1">Tipo de Documento <span className="text-[#d83a52]">*</span></label>
                          <select
                            value={item.type}
                            onChange={(e) => updateFileType(index, e.target.value)}
                            className="w-full border border-[#d0d4d9] rounded p-2 text-sm focus:ring-1 focus:ring-[#0073ea] outline-none bg-gray-50"
                            required
                          >
                            <option value="">Selecione o tipo de documento...</option>
                            {(REQUIRED_DOCS_BY_CATEGORY[newCategory] || ['Outros']).map(doc => (
                              <option key={doc} value={doc}>{doc}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#d0d4d9] shrink-0 mt-auto">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors w-full sm:w-auto"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-[#0073ea] text-white hover:bg-[#0060c7] rounded-lg transition-colors w-full sm:w-auto"
                >
                  Abrir Chamado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
