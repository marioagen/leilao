export type Role = 'CLIENTE' | 'CORRETOR' | 'AGENTE' | 'ADMIN';

export interface Event {
  id: string;
  type: 'MESSAGE' | 'DOCUMENT' | 'STATUS_CHANGE' | 'AI_ANALYSIS';
  author: string;
  role: Role | 'SISTEMA';
  timestamp: Date;
  content: string;
  metadata?: any;
  isInternal?: boolean;
}

export interface Contract {
  id: string;
  title: string;
  clientName: string;
  corretorName: string;
  status: 'EM_ANALISE' | 'PENDENTE_DOCS' | 'APROVADO' | 'REJEITADO';
  processTypeId: string;
  events: Event[];
  category?: string;
  supportLevel?: 'N1' | 'N2';
}

export interface ProcessConfig {
  id: string;
  name: string;
  requiredDocs: string[];
  validationRules: string;
  approvalTemplate: string;
  rejectionTemplate: string;
}

export interface ResponseTemplate {
  id: string;
  category: string;
  subject: string;
  message: string;
}
