import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown, ChevronDown } from 'lucide-react';

// Mock data based on the image
const mockData = [
  {
    id: 78,
    nrDoc: '07102858061_53145_0000980042645_1.pdf',
    bolsao: 'Novo Bolsão',
    bolsaoSub: 'superanalise@alisson.com',
    cat: 'AJ - Cumprimento',
    status: 'Em Análise Simplificada',
    demanda: 'BR 2 AF EMGEA C1',
    bancoCredor: 'CAIXA',
    grupoCredor: 'CAIXA-EMGEA',
    dtAssinatura: '28/09/1990 00:00:00',
    mutuario: 'ANTONIO LOPES TEIXEIRA DE AZEVEDO',
    tipoEvt: 'L11',
    or: '32',
    planoReaj: 'EQ3 1 P 03 CTP',
    im: '08'
  },
  {
    id: 179,
    nrDoc: '10104661728_53163_0007210384411_1.pdf',
    bolsao: 'Novo Bolsão (2)',
    bolsaoSub: 'superanalise@alisson.com',
    cat: 'AJ - Cumprimento',
    status: 'Em Análise Completa',
    demanda: 'SP/BR 1 TR1',
    bancoCredor: 'CAIXA',
    grupoCredor: 'CAIXA-EMGEA',
    dtAssinatura: '16/12/1986 00:00:00',
    mutuario: 'ZELI FIALHO DE SOUZA',
    tipoEvt: 'TPZ',
    or: '32',
    planoReaj: 'EQ1 1 P 12 CTP',
    im: '15'
  },
  {
    id: 549,
    nrDoc: '30680_03100444943_00024_1338000404111_1.pdf',
    bolsao: 'Novo Bolsão',
    bolsaoSub: 'Juliana Siqueira',
    cat: 'Pedido Reanálise',
    status: 'Em Análise Simplificada',
    demanda: 'BR 1 AF CAIXA C1',
    bancoCredor: 'COHAB/SP',
    grupoCredor: 'COHAB',
    dtAssinatura: '10/02/1993 00:00:00',
    mutuario: 'SEVERINA BEZERRA DE MELO',
    tipoEvt: 'TPZ',
    or: '32',
    planoReaj: 'EQ3 1 P 12 CTP',
    im: '00'
  },
  {
    id: 558,
    nrDoc: '31991_17159234352_00016_0430001366_1.pdf',
    bolsao: 'Novo Bolsão',
    bolsaoSub: 'supervisor analise',
    cat: '',
    status: 'Em Análise Completa',
    demanda: '',
    bancoCredor: 'COHAB/MG',
    grupoCredor: 'COHAB',
    dtAssinatura: '01/09/1978 00:00:00',
    mutuario: 'DALVO FONSECA OLIVEIRA',
    tipoEvt: 'TPZ',
    or: '32',
    planoReaj: 'PES 2 A 60 UPC',
    im: '00'
  },
  {
    id: 567,
    nrDoc: '120320_9001319102361_53102_9000493204071_1.pdf',
    bolsao: 'Novo Bolsão (2)',
    bolsaoSub: 'superanalise@alisson.com',
    cat: 'Pedido Reanálise',
    status: 'Inconforme',
    demanda: 'BR 1 AF CAIXA C1',
    bancoCredor: 'CAIXA',
    grupoCredor: 'CAIXA-EMGEA',
    dtAssinatura: '30/05/1985 00:00:00',
    mutuario: 'LUIZ EDUARDO LUCENA GURGEL',
    tipoEvt: 'L13',
    or: '32',
    planoReaj: 'EQ1 4 P 01 CTP',
    im: '00'
  },
  {
    id: 641,
    nrDoc: '62803_10106370587_12_0001510595691_1.pdf',
    bolsao: 'testeRobson',
    bolsaoSub: 'Alisson Forneck De Araujo',
    cat: 'Pedido Reanálise',
    status: 'Aguardando Análise',
    demanda: 'BR 1 AF CAIXA C1',
    bancoCredor: 'ESTADO DA BAHIA',
    grupoCredor: 'ENTES PÚBLICOS',
    dtAssinatura: '',
    mutuario: '',
    tipoEvt: '',
    or: '',
    planoReaj: '',
    im: ''
  },
  {
    id: 1379,
    nrDoc: '9001320251682_85019_3017480335431_1.pdf',
    bolsao: 'teste_aline',
    bolsaoSub: 'SUPERVISOR DE TESTE 02',
    cat: '',
    status: 'Em Análise Simplificada',
    demanda: '',
    bancoCredor: 'EMGEA',
    grupoCredor: 'CAIXA-EMGEA',
    dtAssinatura: '29/04/1988 00:00:00',
    mutuario: 'RITA DE CASSIA BATISTA DE OLIVEIRA',
    tipoEvt: 'TPZ',
    or: '11',
    planoReaj: '',
    im: '00'
  },
  {
    id: 1406,
    nrDoc: '9001319330416_00030_0000850001315_1.pdf',
    bolsao: '',
    bolsaoSub: '',
    cat: '',
    status: 'Em Análise Simplificada',
    demanda: '',
    bancoCredor: 'DATANORTE',
    grupoCredor: 'COHAB',
    dtAssinatura: '28/02/1984 00:00:00',
    mutuario: 'RICARDO DE CARVALHO FERNANDES',
    tipoEvt: 'L13',
    or: '32',
    planoReaj: '',
    im: '00'
  },
  {
    id: 1410,
    nrDoc: '9001319480471_00030_0001050006990_1.pdf',
    bolsao: 'teste_aline',
    bolsaoSub: 'SUPERVISOR DE TESTE 02',
    cat: '',
    status: 'Em Análise Simplificada',
    demanda: '',
    bancoCredor: 'DATANORTE',
    grupoCredor: 'COHAB',
    dtAssinatura: '30/07/1983 00:00:00',
    mutuario: 'FRANCISCO CABRAL MONTENEGRO J',
    tipoEvt: 'L13',
    or: '32',
    planoReaj: '',
    im: '00'
  },
  {
    id: 1571,
    nrDoc: '150174_9001320741971_85049_9993800650631_1',
    bolsao: '',
    bolsaoSub: '',
    cat: 'Reanálise (Inadequado AUDIR)',
    status: 'Inconforme',
    demanda: 'SP/BR 1 TR1',
    bancoCredor: 'EMGEA',
    grupoCredor: 'CAIXA-EMGEA',
    dtAssinatura: '13/01/1989 00:00:00',
    mutuario: 'PLACIDO CRUZ FREITAS',
    tipoEvt: 'L10',
    or: '32',
    planoReaj: '',
    im: '00'
  }
];

export default function ListagemGeral() {
  const [activeTab, setActiveTab] = useState('Fila Geral');

  return (
    <div className="bg-white min-h-screen p-6 font-sans w-full">
      {/* Top Tabs and Search */}
      <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-2">
        <div className="flex gap-6">
          {['Visão por Gestor', 'Fila Geral', 'Totalizador Geral'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-medium text-sm transition-colors relative ${
                activeTab === tab ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
        <div className="ml-auto relative flex items-center">
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

      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-primary rounded-sm"></div>
        <h2 className="text-xl font-semibold text-gray-800">Fila Geral de Documentos</h2>
      </div>

      {/* Filters */}
      <button className="flex items-center gap-2 text-primary font-medium text-sm mb-6 hover:underline">
        <Filter size={16} /> Mostrar Filtros <ChevronDown size={16} />
      </button>

      {/* Table */}
      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full text-[11px] text-left">
          <thead className="text-[10px] text-gray-500 uppercase bg-white border-b border-gray-200">
            <tr>
              <th className="px-2 py-2 font-medium w-10"><div className="flex items-center gap-1">ID <ArrowUpDown size={10} className="text-gray-400" /></div></th>
              <th className="px-2 py-2 font-medium w-32"><div className="flex items-center gap-1">NR. DOC. <ArrowUpDown size={10} className="text-gray-400" /></div></th>
              <th className="px-2 py-2 font-medium w-28"><div className="flex items-center gap-1">BOLSÃO <ArrowUpDown size={10} className="text-gray-400" /></div></th>
              <th className="px-2 py-2 font-medium w-24"><div className="flex items-center gap-1">CAT. <ArrowUpDown size={10} className="text-gray-400" /></div></th>
              <th className="px-2 py-2 font-medium w-28"><div className="flex items-center gap-1">STATUS <ArrowUpDown size={10} className="text-gray-400" /></div></th>
              <th className="px-2 py-2 font-medium w-24">DEMANDA</th>
              <th className="px-2 py-2 font-medium w-20"><div className="flex items-center gap-1">BANCO CREDOR <ArrowUpDown size={10} className="text-gray-400" /></div></th>
              <th className="px-2 py-2 font-medium w-24"><div className="flex items-center gap-1">GRUPO CREDOR <ArrowUpDown size={10} className="text-gray-400" /></div></th>
              <th className="px-2 py-2 font-medium w-24"><div className="flex items-center gap-1">DT. ASSINATURA <ArrowUpDown size={10} className="text-gray-400" /></div></th>
              <th className="px-2 py-2 font-medium w-32"><div className="flex items-center gap-1">MUTUÁRIO <ArrowUpDown size={10} className="text-gray-400" /></div></th>
              <th className="px-2 py-2 font-medium w-16"><div className="flex items-center gap-1">TIPO EVT. <ArrowUpDown size={10} className="text-gray-400" /></div></th>
              <th className="px-2 py-2 font-medium w-12"><div className="flex items-center gap-1">OR <ArrowUpDown size={10} className="text-gray-400" /></div></th>
              <th className="px-2 py-2 font-medium w-20"><div className="flex items-center gap-1">PLANO REAJ. <ArrowUpDown size={10} className="text-gray-400" /></div></th>
              <th className="px-2 py-2 font-medium w-12"><div className="flex items-center gap-1">IM <ArrowUpDown size={10} className="text-gray-400" /></div></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 bg-white">
                <td className="px-2 py-2 text-gray-700">{row.id}</td>
                <td className="px-2 py-2 text-gray-700">
                  <div className="truncate max-w-[120px]" title={row.nrDoc}>{row.nrDoc}</div>
                </td>
                <td className="px-2 py-2">
                  {row.bolsao && <div className="text-primary hover:underline cursor-pointer truncate max-w-[100px]" title={row.bolsao}>{row.bolsao}</div>}
                  {row.bolsaoSub && <div className="text-[9px] text-gray-500 truncate max-w-[100px]" title={row.bolsaoSub}>{row.bolsaoSub}</div>}
                </td>
                <td className="px-2 py-2 text-gray-700">
                  <div className="truncate max-w-[90px]" title={row.cat}>{row.cat}</div>
                </td>
                <td className="px-2 py-2 text-gray-700">
                  <div className="truncate max-w-[100px]" title={row.status}>{row.status}</div>
                </td>
                <td className="px-2 py-2 text-gray-700">
                  <div className="truncate max-w-[90px]" title={row.demanda}>{row.demanda}</div>
                </td>
                <td className="px-2 py-2 text-gray-700">
                  <div className="truncate max-w-[80px]" title={row.bancoCredor}>{row.bancoCredor}</div>
                </td>
                <td className="px-2 py-2 text-gray-700">
                  <div className="truncate max-w-[90px]" title={row.grupoCredor}>{row.grupoCredor}</div>
                </td>
                <td className="px-2 py-2 text-gray-700 whitespace-nowrap">{row.dtAssinatura.split(' ')[0]}</td>
                <td className="px-2 py-2 text-gray-700">
                  <div className="truncate max-w-[120px]" title={row.mutuario}>{row.mutuario}</div>
                </td>
                <td className="px-2 py-2 text-gray-700">{row.tipoEvt}</td>
                <td className="px-2 py-2 text-gray-700">{row.or}</td>
                <td className="px-2 py-2 text-gray-700">
                  <div className="truncate max-w-[70px]" title={row.planoReaj}>{row.planoReaj}</div>
                </td>
                <td className="px-2 py-2 text-gray-700">{row.im}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>Exibindo 1 a 10 do total de 48 itens</div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={16} /></button>
          <button className="px-3 py-1.5 rounded bg-primary text-white font-medium">1</button>
          <button className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50">2</button>
          <button className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50">3</button>
          <button className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50">4</button>
          <button className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50">5</button>
          <button className="p-1.5 rounded hover:bg-gray-100"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}
