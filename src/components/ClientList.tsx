/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Client } from '../types';
import { formatCPF, formatPhone } from '../utils';
import { Search, UserMinus, Edit3, MessageCircle, Mail, Sparkles, Filter, ShieldAlert } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onInitiateMessage: (client: Client, mode: 'whatsapp' | 'email') => void;
}

export default function ClientList({ clients, onEdit, onDelete, onInitiateMessage }: ClientListProps) {
  const [search, setSearch] = useState('');

  // Sorter
  const [sortBy, setSortBy] = useState<'nome' | 'dataCadastro'>('nome');

  const filteredClients = clients
    .filter(client => {
      const term = search.toLowerCase();
      const rawCpf = client.cpf.replace(/\D/g, '');
      const rawPhone = client.telefone.replace(/\D/g, '');
      return (
        client.nome.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.cpf.includes(term) ||
        rawCpf.includes(term) ||
        client.telefone.includes(term) ||
        rawPhone.includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'nome') {
        return a.nome.localeCompare(b.nome);
      } else {
        return new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime();
      }
    });

  return (
    <div id="client-list-container" className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* List Header */}
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 id="list-title" className="text-lg font-bold text-slate-950 flex items-center gap-2">
            Base de Clientes
            <span id="client-count-badge" className="text-xs bg-slate-100 border border-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-md">
              {clients.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pesquise, edite cadastros e envie mensagens instantâneas por canais integrados.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter size={12} />
            Ordenar:
          </span>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'nome' | 'dataCadastro')}
            className="text-xs font-semibold text-slate-650 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <option value="nome">Nome Alfabético</option>
            <option value="dataCadastro">Cadastro recente</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-6 py-3.5 bg-slate-50/50 border-b border-slate-200 relative">
        <span className="absolute inset-y-0 left-0 pl-10 flex items-center text-slate-400 pointer-events-none">
          <Search size={15} />
        </span>
        <input
          id="search-client-input"
          type="text"
          placeholder="Buscar clientes por nome, CPF, e-mail ou WhatsApp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-100/85 border border-transparent rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-slate-350 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium"
        />
        {search && (
          <button
            id="clear-search-btn"
            onClick={() => setSearch('')}
            className="absolute top-1/2 right-9 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Table view / List cards */}
      <div className="flex-1 overflow-y-auto">
        {filteredClients.length === 0 ? (
          <div id="empty-state" className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {clients.length === 0 ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-4">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Nenhum cliente cadastrado</h3>
                <p className="text-xs text-slate-500 max-w-[280px] mt-1.5 leading-relaxed">
                  Utilize o painel cadastral ao lado para incluir seu primeiro cliente e liberar os disparos.
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-250 flex items-center justify-center text-slate-400 mb-4">
                  <Search size={20} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Sem resultados correspondentes</h3>
                <p className="text-xs text-slate-400 max-w-[280px] mt-1.5 leading-relaxed">
                  Não encontramos clientes registrados com o termo "{search}".
                </p>
              </>
            )}
          </div>
        ) : (
          <div id="clients-responsive-grid" className="divide-y divide-slate-100">
            {/* Desktop Table Headers */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/50 text-[11px] font-semibold text-slate-500 tracking-wider uppercase border-b border-slate-200">
              <div className="col-span-4">Nome / Data de Cadastro</div>
              <div className="col-span-2">CPF</div>
              <div className="col-span-3">Canais de Contato</div>
              <div className="col-span-3 text-right">Ações Rápidas</div>
            </div>

            {/* List Rows */}
            {filteredClients.map((client) => (
              <div
                key={client.id}
                id={`client-row-${client.id}`}
                className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors group"
              >
                {/* Name / Date column */}
                <div className="col-span-1 lg:col-span-4 flex flex-col gap-0.5 min-w-0">
                  <h4 className="font-medium text-slate-900 text-sm truncate">
                    {client.nome}
                  </h4>
                  <span className="text-xs text-slate-500">
                    Cadastrado em {new Date(client.dataCadastro).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* CPF column */}
                <div className="col-span-1 lg:col-span-2 flex items-center lg:block">
                  <span className="text-[11px] lg:hidden font-semibold text-slate-400 mr-2 uppercase tracking-wide">CPF:</span>
                  <span className="text-xs font-mono text-slate-600 bg-slate-100 rounded px-2 py-0.5 lg:p-0 lg:bg-transparent tracking-tight">
                    {formatCPF(client.cpf)}
                  </span>
                </div>

                {/* Contacts column */}
                <div className="col-span-1 lg:col-span-3 flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 min-w-0">
                    <Mail size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MessageCircle size={13} className="text-slate-400 shrink-0" />
                    <span>{formatPhone(client.telefone)}</span>
                  </div>
                </div>

                {/* Quick Interactive Actions column matching Design layout */}
                <div className="col-span-1 lg:col-span-3 flex items-center justify-end gap-2 mt-2 lg:mt-0 pt-3 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                  {/* WhatsApp Launcher */}
                  <button
                    id={`trigger-wa-${client.id}`}
                    type="button"
                    title="Enviar WhatsApp"
                    onClick={() => onInitiateMessage(client, 'whatsapp')}
                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.06 3.96l-1.126 4.114 4.197-1.102a7.86 7.86 0 0 0 3.799.98h.001c4.367 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.381-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                    </svg>
                  </button>

                  {/* Email Launcher */}
                  <button
                    id={`trigger-email-${client.id}`}
                    type="button"
                    title="Enviar E-mail"
                    onClick={() => onInitiateMessage(client, 'email')}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
                  </button>

                  <div className="w-px h-5 bg-slate-200 mx-1 hidden lg:block"></div>

                  {/* Edit Card Button */}
                  <button
                    id={`edit-client-${client.id}`}
                    type="button"
                    title="Editar Cliente"
                    onClick={() => onEdit(client)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  >
                    <Edit3 size={14} />
                  </button>

                  {/* Delete Card Button */}
                  <button
                    id={`delete-client-${client.id}`}
                    type="button"
                    title="Excluir Cliente"
                    onClick={() => {
                      if (confirm(`Deseja realmente excluir o cadastro de ${client.nome}?`)) {
                        onDelete(client.id);
                      }
                    }}
                    className="p-1.5 text-[15px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all cursor-pointer"
                  >
                    <UserMinus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
