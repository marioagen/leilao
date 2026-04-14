import React, { useState } from 'react';
import { Contract, Role, Event, ProcessConfig, ResponseTemplate } from '../types';
import { Upload, Clock, Bot, User, FileText, CheckCircle, XCircle, Send, MessageSquareText } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Props {
  contract: Contract;
  role: Role;
  config: ProcessConfig;
  onAddEvent: (contractId: string, event: Event) => void;
  onUpdateStatus: (contractId: string, status: Contract['status']) => void;
}

export default function ContractPortal({ contract, role, config, templates, onAddEvent, onUpdateStatus, onUpdateSupportLevel }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [msg, setMsg] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const docEvent: Event = {
      id: Date.now().toString(), type: 'DOCUMENT', author: role, role: role,
      timestamp: new Date(), content: `Documento enviado: ${file.name}`
    };
    onAddEvent(contract.id, docEvent);
    onUpdateStatus(contract.id, 'EM_ANALISE');

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: [
            { inlineData: { data: base64, mimeType: file.type } },
            `Você é o Motor de IA da CAIXA. Analise este documento para o processo: ${config.name}.
             Regras: ${config.validationRules}.
             Responda ESTRITAMENTE em JSON:
             {
               "extractedData": {"campo": "valor"},
               "isValid": true,
               "suggestion": "Sua sugestão baseada nos templates: Aprovação (${config.approvalTemplate}) ou Rejeição (${config.rejectionTemplate})"
             }`
          ],
          config: { responseMimeType: "application/json" }
        });
        
        const result = JSON.parse(response.text || '{}');
        const aiEvent: Event = {
          id: (Date.now() + 1).toString(), type: 'AI_ANALYSIS', author: 'Motor IA CAIXA', role: 'SISTEMA',
          timestamp: new Date(), content: 'Análise de documento concluída.', metadata: result
        };
        onAddEvent(contract.id, aiEvent);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!msg.trim()) return;
    
    const userMsg = msg;
    setMsg('');
    setShowTemplates(false);

    let authorName = role as string;
    if (role === 'AGENTE') authorName = 'Atendimento CAIXA';
    else if (role === 'CLIENTE') authorName = contract.clientName;
    else if (role === 'CORRETOR') authorName = contract.corretorName;

    onAddEvent(contract.id, {
      id: Date.now().toString(), type: 'MESSAGE', author: authorName, role: role,
      timestamp: new Date(), content: userMsg
    });

    if (contract.supportLevel === 'N1' && (role === 'CLIENTE' || role === 'CORRETOR')) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: `Você é o assistente virtual da CAIXA. O usuário enviou a seguinte mensagem em um chamado da categoria "${contract.category || 'Geral'}": "${userMsg}". Responda de forma prestativa, direta e profissional.`
        });
        
        const aiEvent: Event = {
          id: (Date.now() + 1).toString(), type: 'MESSAGE', author: 'Atendimento CAIXA', role: 'SISTEMA',
          timestamp: new Date(), content: response.text || 'Desculpe, não consegui processar sua solicitação.'
        };
        onAddEvent(contract.id, aiEvent);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const applyTemplate = (template: ResponseTemplate) => {
    setMsg(template.message);
    setShowTemplates(false);
  };

  const handleAgentDecision = (approved: boolean) => {
    onUpdateStatus(contract.id, approved ? 'APROVADO' : 'REJEITADO');
    onAddEvent(contract.id, {
      id: Date.now().toString(), type: 'STATUS_CHANGE', author: 'Agente CAIXA', role: 'AGENTE',
      timestamp: new Date(), content: approved ? 'Documentação Aprovada. Enviado ao sistema legado.' : 'Documentação Rejeitada.'
    });
  };

  const handleTakeover = () => {
    if (onUpdateSupportLevel) {
      onUpdateSupportLevel(contract.id, 'N2');
      onAddEvent(contract.id, {
        id: Date.now().toString(), type: 'STATUS_CHANGE', author: 'Sistema', role: 'SISTEMA',
        timestamp: new Date(), content: 'Atendimento assumido pelo Agente. O assistente virtual (N1) foi desativado para este chamado.',
        isInternal: true
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-[#d0d4d9] shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="text-[#0060c7]" size={20} />
            <h3 className="font-semibold text-lg text-[#0060c7]">Dados da solicitação</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5c738b] mb-1">Número do Contrato</label>
              <div className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm bg-white text-gray-700">
                {contract.id.replace('ctr_', '26548')}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5c738b] mb-1">Atividade</label>
              <div className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm bg-white text-gray-700">
                Atendimento
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5c738b] mb-1">Data da Demanda</label>
              <div className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm bg-white text-gray-700">
                {contract.events[0]?.timestamp.toLocaleDateString('pt-BR') || '25/02/2026'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5c738b] mb-1">Tipo do Solicitante</label>
              <div className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm bg-white text-gray-700">
                Cliente
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#5c738b] mb-1">Nome do Solicitante</label>
              <div className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm bg-white text-gray-700">
                {contract.clientName}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#5c738b] mb-1">Assunto <span className="text-[#d83a52]">*</span></label>
              <div className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm bg-white text-gray-700">
                {contract.title}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5c738b] mb-1">Status</label>
              <select 
                value={contract.status}
                onChange={(e) => onUpdateStatus(contract.id, e.target.value as any)}
                className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm bg-white text-gray-700 focus:ring-1 focus:ring-[#0073ea] outline-none"
                disabled={role === 'CLIENTE'}
              >
                <option value="EM_ANALISE">Em Andamento</option>
                <option value="PENDENTE_DOCS">Pendente Docs</option>
                <option value="APROVADO">Concluído</option>
                <option value="REJEITADO">Rejeitado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5c738b] mb-1">Responsável</label>
              <div className="w-full border border-[#d0d4d9] rounded-lg p-2.5 text-sm bg-white text-gray-700">
                {contract.corretorName}
              </div>
            </div>
          </div>

          {/* Arquivos anexados */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-[#5c738b] mb-2">Arquivos anexados</label>
            <div className="flex flex-wrap gap-2">
              {contract.events.filter(e => e.type === 'DOCUMENT').map(doc => (
                <div key={doc.id} className="bg-[#f8f9fb] border border-[#d0d4d9] rounded-lg p-3 flex flex-col items-center justify-center gap-2 w-28 h-28 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <FileText className="text-gray-500" size={28} />
                  <span className="text-[11px] text-gray-600 line-clamp-2 break-all font-medium">{doc.content.replace('Documento enviado: ', '')}</span>
                </div>
              ))}
              {contract.events.filter(e => e.type === 'DOCUMENT').length === 0 && (
                <span className="text-sm text-gray-400 italic">Nenhum arquivo anexado.</span>
              )}
            </div>
          </div>

          {role === 'AGENTE' && contract.supportLevel === 'N1' && (
            <button 
              onClick={handleTakeover} 
              className="mt-6 w-full bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <User size={16} /> Assumir Atendimento (Desativar Bot)
            </button>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl border border-border-light shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Documentos Necessários</h3>
          <ul className="space-y-3 mb-4">
            {config.requiredDocs.map((doc, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <FileText size={16} className="text-gray-400"/> {doc}
              </li>
            ))}
          </ul>
          {(role === 'CLIENTE' || role === 'CORRETOR') && (
            <label className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 cursor-pointer">
              <Upload size={18} /> Enviar Documento
              <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleUpload} disabled={isAnalyzing} />
            </label>
          )}
          {isAnalyzing && <p className="text-sm text-primary mt-2 animate-pulse">Analisando documento via IA...</p>}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-border-light flex flex-col h-[600px] relative">
        <div className="p-4 border-b border-border-light flex items-center gap-2">
          <Clock className="text-primary" size={20} />
          <h3 className="font-semibold text-lg">Timeline Compartilhada</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-scroll">
          {contract.events.filter(ev => !(ev.isInternal && (role === 'CLIENTE' || role === 'CORRETOR'))).map(ev => (
            <div key={ev.id} className={`flex gap-4 ${ev.role === role ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${ev.type === 'AI_ANALYSIS' ? 'bg-purple-100 text-purple-600' : ev.role === 'SISTEMA' ? 'bg-gray-100 text-gray-600' : 'bg-primary-light text-primary'}`}>
                {ev.type === 'AI_ANALYSIS' ? <Bot size={20}/> : ev.type === 'DOCUMENT' ? <FileText size={20}/> : <User size={20}/>}
              </div>
              <div className={`max-w-[80%] ${ev.role === role ? 'text-right' : 'text-left'}`}>
                <div className="text-xs text-gray-500 mb-1">{ev.author} • {ev.timestamp.toLocaleTimeString()}</div>
                <div className={`p-3 rounded-xl inline-block text-sm whitespace-pre-wrap ${ev.type === 'AI_ANALYSIS' ? 'bg-purple-50 border border-purple-100 text-left' : ev.role === role ? 'bg-primary text-white' : 'bg-gray-50 border border-border-light'}`}>
                  {ev.content}
                  {ev.type === 'AI_ANALYSIS' && role === 'AGENTE' && ev.metadata && (
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <p className="font-semibold mb-1">Dados Extraídos:</p>
                      <pre className="bg-white p-2 rounded text-xs overflow-x-auto mb-2">{JSON.stringify(ev.metadata.extractedData, null, 2)}</pre>
                      <p className="font-semibold mb-1">Sugestão da IA:</p>
                      <p className="italic mb-3">{ev.metadata.suggestion}</p>
                      {contract.status === 'EM_ANALISE' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleAgentDecision(true)} className="flex-1 bg-success text-white py-1.5 rounded flex items-center justify-center gap-1 hover:bg-success-dark"><CheckCircle size={16}/> Aprovar</button>
                          <button onClick={() => handleAgentDecision(false)} className="flex-1 bg-danger text-white py-1.5 rounded flex items-center justify-center gap-1 hover:bg-danger-dark"><XCircle size={16}/> Recusar</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showTemplates && role === 'AGENTE' && (
          <div className="absolute bottom-20 left-4 right-4 bg-white border border-border-light shadow-xl rounded-xl p-4 max-h-64 overflow-y-auto z-10">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-sm text-gray-700">Templates de Resposta</h4>
              <button type="button" onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={16}/></button>
            </div>
            <div className="space-y-2">
              {templates.map(t => (
                <button 
                  key={t.id} 
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded border border-transparent hover:border-border-light transition-colors"
                >
                  <p className="text-xs font-bold text-primary mb-1">{t.category}</p>
                  <p className="text-sm font-medium text-gray-800">{t.subject}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">{t.message}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border-light bg-gray-50 rounded-b-xl">
          <form onSubmit={handleSendMsg} className="flex gap-2">
            {role === 'AGENTE' && (
              <button 
                type="button" 
                onClick={() => setShowTemplates(!showTemplates)}
                className={`p-2.5 rounded-lg border transition-colors ${showTemplates ? 'bg-primary-light border-primary text-primary' : 'bg-white border-border-light text-gray-600 hover:bg-gray-100'}`}
                title="Usar Template"
              >
                <MessageSquareText size={18} />
              </button>
            )}
            <textarea 
              value={msg} 
              onChange={e => setMsg(e.target.value)} 
              placeholder="Adicionar mensagem à timeline..." 
              className="flex-1 border border-border-light rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none text-sm resize-none h-11" 
              rows={1}
            />
            <button type="submit" className="bg-primary text-white px-4 rounded-lg hover:bg-primary-dark flex items-center justify-center"><Send size={18}/></button>
          </form>
        </div>
      </div>
    </div>
  );
}
