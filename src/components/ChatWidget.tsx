import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const initialGreeting = 'Olá! Sou o assistente virtual da CAIXA para Imóveis. Por favor, informe seu **CPF ou CNPJ** para começarmos o atendimento.';
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: initialGreeting }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const history = messages
        .filter(m => m.text !== initialGreeting)
        .map(m => ({ role: m.role, parts: [{ text: m.text }] }));
        
      history.push({ role: 'user', parts: [{ text: userMsg }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: history,
        config: {
          systemInstruction: `
            Você é o assistente virtual da CAIXA Econômica Federal, especializado em Pós-Venda de Imóveis.
            
            DIRETRIZES DE TOM DE VOZ:
            - Profissional: Transmita segurança e autoridade. Use linguagem polida e termos técnicos corretos.
            - Prestativo: Antecipe necessidades e ofereça soluções claras.
            - Direto: Respeite o tempo do usuário com objetividade.
            
            REGRA DE OURO (IDENTIFICAÇÃO):
            - Você NUNCA deve fornecer informações sobre contratos, boletos, ou qualquer outro serviço sem antes o usuário ter fornecido um CPF ou CNPJ válido.
            - Se o usuário não forneceu o CPF/CNPJ, peça educadamente.
            
            BASE DE CONHECIMENTO (KB):
            1. Emissão de Boleto:
               - Onde encontrar: App Habitação CAIXA ou Internet Banking.
               - Dica: O boleto atualiza em até 2 horas após o pedido.
            2. Amortização de Saldo Devedor:
               - Como fazer: Pelo App Habitação, usando recursos próprios ou FGTS.
               - Condição: O contrato deve estar em dia.
            3. Uso do FGTS:
               - Regras: O imóvel deve ser residencial urbano, e o trabalhador deve ter 3 anos de carteira assinada.
               - Processo: Solicitação via App Habitação ou agência.
            4. Ex-Mutuário (Recompra):
               - Se o usuário informar que perdeu o imóvel e quer recomprar, informe que ele tem preferência na compra direta nos primeiros 30 dias após a consolidação.
               - Peça o número do contrato antigo ou endereço completo para verificar a disponibilidade.
            
            INSTRUÇÕES DE INTERAÇÃO:
            - Responda de forma natural e fluida.
            - Não apresente menus numéricos rígidos (ex: "Digite 1 para..."). Em vez disso, entenda a intenção do usuário pela linguagem natural.
            - Use formatação Markdown (negrito, listas) para facilitar a leitura.
            - Se a dúvida for muito complexa ou fora do escopo, oriente o usuário a procurar uma Agência da CAIXA ou ligar para 0800 104 0104.
          `
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Desculpe, não consegui processar sua solicitação.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Ocorreu um erro ao conectar com o assistente. Tente novamente mais tarde.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-transform hover:scale-105 z-50"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-border-light flex flex-col overflow-hidden z-50 h-[500px]">
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 font-medium">
              <Bot size={20} /> Assistente CAIXA
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X size={20}/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-app chat-scroll">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary-light text-primary' : 'bg-gray-200 text-gray-600'}`}>
                  {msg.role === 'user' ? <User size={16}/> : <Bot size={16}/>}
                </div>
                <div className={`p-3 rounded-xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-border-light'}`}>
                  {msg.role === 'user' ? msg.text : <div className="markdown-body"><ReactMarkdown>{msg.text}</ReactMarkdown></div>}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center"><Bot size={16}/></div>
                <div className="bg-white border border-border-light p-3 rounded-xl flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-border-light bg-white flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Digite sua dúvida..." 
              className="flex-1 border border-border-light rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
            />
            <button type="submit" disabled={isLoading} className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark disabled:opacity-50">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
