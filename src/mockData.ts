import { Contract, ProcessConfig, ResponseTemplate } from './types';

export const initialTemplates: ResponseTemplate[] = [
  {
    id: 'tpl_1',
    category: '1. AVERBAÇÕES E LEILÕES',
    subject: 'Averbação de Leilão - imóvel vendido em leilão',
    message: 'Com relação às averbações dos leilões e baixa da alienação é de responsabilidade do comprador conforme previsto no edital de venda, cabendo ao corretor orientar o comprador nos procedimentos a serem adotados. Solicite ao leiloeiro a documentação do 1° e 2º leilão (Ata, Termo de Arrematação e publicação), para providências de averbação. Caso haja exigência do cartório, encaminhe ao corretor (com cópia para nós) para inclusão no endereço: ceven@caixa.gov.br.'
  },
  {
    id: 'tpl_2',
    category: '1. AVERBAÇÕES E LEILÕES',
    subject: 'Averbação de Leilão Negativo',
    message: 'Em atenção à sua reclamação, observamos tratar-se da averbação dos leilões negativos na matrícula. Conforme Regras da Venda Online, é de responsabilidade do cliente comprador a realização da averbação e pagamento das taxas incidentes junto ao RGI, mediante documentação disponibilizada pela CAIXA. Solicite os documentos pelo formulário: https://forms.office.com/r/NL1a8Rj9Rc.'
  },
  {
    id: 'tpl_3',
    category: '1. AVERBAÇÕES E LEILÕES',
    subject: 'Averbação de Leilão - Modelo 03 (Vendido no Leilão)',
    message: 'Esclarecemos que o imóvel foi arrematado em leilão na condição fiduciária. [Orientações sobre a arrematação e procedimentos de registro conforme a Lei de Alienação Fiduciária].'
  },
  {
    id: 'tpl_4',
    category: '2. DIREITO DE PREFERÊNCIA E RETOMADA (EDP)',
    subject: 'EDP (1º contato cliente)',
    message: 'Informamos que infelizmente o imóvel foi retomado pela CAIXA por inadimplência, conforme a Lei 9.514/1997 (Alienação Fiduciária). A matrícula do cartório já se encontra com o registro de propriedade da CAIXA, não sendo mais possível o parcelamento ou renegociação. É assegurado a você exercer o "Direito de Preferência" para recompra do imóvel pelo valor total da dívida, na condição de pagamento "Somente à Vista", até a data do 2º Leilão SFI. A emissão da proposta e boleto devem ser feitos em: www.caixa.gov.br/imoveiscaixa.'
  },
  {
    id: 'tpl_5',
    category: '2. DIREITO DE PREFERÊNCIA E RETOMADA (EDP)',
    subject: 'EDP (Orientações completas gravação de proposta site)',
    message: '[Template detalhado com o passo a passo para o cliente realizar a gravação da proposta de preferência diretamente no portal, incluindo a navegação pelos menus e finalização do boleto].'
  },
  {
    id: 'tpl_6',
    category: '3. ATENDIMENTO E ORIENTAÇÕES GERAIS (CEMAB/CEPAT)',
    subject: 'CEMAB - Informação sobre pagamento de débitos e averbação',
    message: '1. Para demandas relativas a débitos de imóveis e averbação de leilão, utilize os canais específicos descritos no edital.\n2. O imóvel retornou para venda online e você poderá fazer nova proposta no site Venda de Imóveis CAIXA: https://www.caixa.gov.br/voce/habitacao/imoveis-venda/Paginas/default.aspx.'
  },
  {
    id: 'tpl_7',
    category: '3. ATENDIMENTO E ORIENTAÇÕES GERAIS (CEMAB/CEPAT)',
    subject: 'CEPAT - Redirecionamento de demanda',
    message: 'Informamos que sua solicitação foi encaminhada ao setor responsável (CEPAT) para análise técnica. O prazo de retorno é de X dias úteis.'
  },
  {
    id: 'tpl_8',
    category: '4. GESTÃO DE CORRETORES E PERFORMANCE',
    subject: 'Corretor (Avaliação - Questionamento da Nota de Performance)',
    message: 'A nota de performance é calculada exclusivamente com base em dados quantitativos, seguindo metodologia única para todas as imobiliárias. Os itens considerados são: desempenho em vendas (quantidade e valor), conformidade documental e de registro, e proporção de reclamações (ouvidorias). O e-mail mensal reflete a situação em um dia específico. Estamos trabalhando para detalhar melhor esses comunicados em breve.'
  },
  {
    id: 'tpl_9',
    category: '4. GESTÃO DE CORRETORES E PERFORMANCE',
    subject: 'Corretor - Nota Fiscal / V360',
    message: '[Template com orientações sobre o preenchimento de Notas Fiscais de prestação de serviço e integração com o sistema V360].'
  },
  {
    id: 'tpl_10',
    category: '5. FINALIZAÇÃO E FEEDBACK',
    subject: 'Pesquisa de Satisfação (Pós-Venda)',
    message: 'Sua opinião é muito importante para nós! Acesse o portal: Busque seu imóvel > Meus Resultados (botão laranja) e avalie o serviço (1 a 4 estrelas). Levará menos de 1 minuto!'
  }
];

export const initialConfigs: ProcessConfig[] = [
  {
    id: 'proc_1',
    name: 'Venda Direta Online',
    requiredDocs: ['Matrícula Atualizada', 'IPTU', 'Proposta Assinada'],
    validationRules: 'Verificar se a CAIXA consta como proprietária/transmitente na Matrícula. No IPTU, verificar se o endereço bate com o imóvel.',
    approvalTemplate: 'Documentação validada com sucesso. Dados extraídos conferem com o sistema.',
    rejectionTemplate: 'Divergência encontrada na documentação. Por favor, reenvie o documento corrigido.'
  },
  {
    id: 'proc_2',
    name: 'Leilão SFI',
    requiredDocs: ['Edital Assinado', 'Comprovante de Pagamento', 'RG/CPF'],
    validationRules: 'Verificar autenticidade do comprovante de pagamento e se o valor bate com o lance vencedor.',
    approvalTemplate: 'Pagamento confirmado e documentação de arrematação validada.',
    rejectionTemplate: 'Comprovante de pagamento inválido ou ilegível.'
  }
];

export const initialContracts: Contract[] = [
  {
    id: 'ctr_001',
    title: 'Apto 101 - Res. Flores',
    clientName: 'João Silva',
    corretorName: 'Maria Corretora',
    status: 'PENDENTE_DOCS',
    processTypeId: 'proc_1',
    category: 'Averbação de Leilão',
    supportLevel: 'N1',
    events: [
      { id: 'ev_1', type: 'STATUS_CHANGE', author: 'Sistema', role: 'SISTEMA', timestamp: new Date(Date.now() - 86400000), content: 'Contrato iniciado. Aguardando envio de documentos.' }
    ]
  },
  {
    id: 'ctr_002',
    title: 'Casa 05 - Cond. Bosque',
    clientName: 'Ana Souza',
    corretorName: 'Maria Corretora',
    status: 'EM_ANALISE',
    processTypeId: 'proc_1',
    category: 'IPTU',
    supportLevel: 'N2',
    events: [
      { id: 'ev_2', type: 'STATUS_CHANGE', author: 'Sistema', role: 'SISTEMA', timestamp: new Date(Date.now() - 172800000), content: 'Contrato iniciado.' },
      { id: 'ev_3', type: 'DOCUMENT', author: 'Ana Souza', role: 'CLIENTE', timestamp: new Date(Date.now() - 86400000), content: 'Documento enviado: matricula_atualizada.pdf' }
    ]
  },
  {
    id: 'ctr_003',
    title: 'Terreno Lote 12 - Jd. Primavera',
    clientName: 'Carlos Mendes',
    corretorName: 'Pedro Imóveis',
    status: 'PENDENTE_DOCS',
    processTypeId: 'proc_1',
    category: 'Direito de Preferência',
    supportLevel: 'N1',
    events: [
      { id: 'ev_4', type: 'STATUS_CHANGE', author: 'Sistema', role: 'SISTEMA', timestamp: new Date(Date.now() - 200000000), content: 'Contrato iniciado.' }
    ]
  },
  {
    id: 'ctr_004',
    title: 'Apto 302 - Ed. Central',
    clientName: 'João Silva',
    corretorName: 'Maria Corretora',
    status: 'EM_ANALISE',
    processTypeId: 'proc_2',
    category: 'Averbação de Leilão',
    supportLevel: 'N1',
    events: [
      { id: 'ev_5', type: 'STATUS_CHANGE', author: 'Sistema', role: 'SISTEMA', timestamp: new Date(Date.now() - 300000000), content: 'Contrato iniciado.' }
    ]
  },
  {
    id: 'ctr_005',
    title: 'Casa 10 - Res. Villa',
    clientName: 'Fernanda Lima',
    corretorName: 'João Corretor',
    status: 'APROVADO',
    processTypeId: 'proc_1',
    category: 'IPTU',
    supportLevel: 'N2',
    events: [
      { id: 'ev_6', type: 'STATUS_CHANGE', author: 'Sistema', role: 'SISTEMA', timestamp: new Date(Date.now() - 400000000), content: 'Contrato aprovado.' }
    ]
  },
  {
    id: 'ctr_006',
    title: 'Galpão Comercial - Zona Sul',
    clientName: 'Roberto Costa',
    corretorName: 'Imobiliária Sul',
    status: 'PENDENTE_DOCS',
    processTypeId: 'proc_2',
    category: 'Direito de Preferência',
    supportLevel: 'N1',
    events: [
      { id: 'ev_7', type: 'STATUS_CHANGE', author: 'Sistema', role: 'SISTEMA', timestamp: new Date(Date.now() - 500000000), content: 'Aguardando documentos.' }
    ]
  },
  {
    id: 'ctr_007',
    title: 'Apto 505 - Cond. Vista Bela',
    clientName: 'João Silva',
    corretorName: 'Maria Corretora',
    status: 'REJEITADO',
    processTypeId: 'proc_1',
    category: 'Averbação de Leilão',
    supportLevel: 'N1',
    events: [
      { id: 'ev_8', type: 'STATUS_CHANGE', author: 'Sistema', role: 'SISTEMA', timestamp: new Date(Date.now() - 600000000), content: 'Documentação rejeitada.' }
    ]
  },
  {
    id: 'ctr_008',
    title: 'Casa 02 - Vila Nova',
    clientName: 'Patricia Alves',
    corretorName: 'Vila Imóveis',
    status: 'EM_ANALISE',
    processTypeId: 'proc_1',
    category: 'IPTU',
    supportLevel: 'N2',
    events: [
      { id: 'ev_9', type: 'STATUS_CHANGE', author: 'Sistema', role: 'SISTEMA', timestamp: new Date(Date.now() - 700000000), content: 'Em análise.' }
    ]
  }
];
