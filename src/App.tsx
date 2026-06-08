/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Client } from './types';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import MessageModal from './components/MessageModal';
import { Users, PhoneCall, MailCheck, ShieldCheck, HelpCircle, Send } from 'lucide-react';

const INITIAL_CLIENTS_SEED: Client[] = [
  {
    id: 'seed-1',
    nome: 'Ana Beatriz de Souza',
    cpf: '14725836901',
    telefone: '11988887777',
    email: 'anabeatriz.souza@gmail.com',
    dataCadastro: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: 'seed-2',
    nome: 'Rodrigo Costa Andrade',
    cpf: '98765432109',
    telefone: '21977775555',
    email: 'rodrigo.andrade@yahoo.com.br',
    dataCadastro: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: 'seed-3',
    nome: 'Camila Fernandes Lima',
    cpf: '45678912344',
    telefone: '31966664444',
    email: 'camila.fernandes@outlook.com',
    dataCadastro: new Date().toISOString() // Brand new
  }
];

export default function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Message dispatcher states
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [msgTargetClient, setMsgTargetClient] = useState<Client | null>(null);
  const [msgTargetMode, setMsgTargetMode] = useState<'whatsapp' | 'email' | null>(null);

  // Load clients on boot
  useEffect(() => {
    const cached = localStorage.getItem('crm_clientes_db');
    if (cached) {
      try {
        setClients(JSON.parse(cached));
      } catch (e) {
        console.error('Error parsing client cache', e);
        setClients(INITIAL_CLIENTS_SEED);
      }
    } else {
      // Setup demo records
      setClients(INITIAL_CLIENTS_SEED);
      localStorage.setItem('crm_clientes_db', JSON.stringify(INITIAL_CLIENTS_SEED));
    }
  }, []);

  // Sync clients to localStore on change
  const saveClientsToCache = (updatedList: Client[]) => {
    setClients(updatedList);
    localStorage.setItem('crm_clientes_db', JSON.stringify(updatedList));
  };

  // Create or Update handler
  const handleSaveClient = (clientData: Omit<Client, 'id' | 'dataCadastro'> | Client) => {
    if ('id' in clientData) {
      // Editing Mode
      const updated = clients.map((c) => (c.id === clientData.id ? (clientData as Client) : c));
      saveClientsToCache(updated);
      setEditingClient(null);
    } else {
      // Creating Mode
      const brandNew: Client = {
        ...clientData,
        id: 'cl-' + Math.random().toString(36).substr(2, 9),
        dataCadastro: new Date().toISOString()
      };
      saveClientsToCache([brandNew, ...clients]);
    }
  };

  const handleDeleteClient = (id: string) => {
    const updated = clients.filter((c) => c.id !== id);
    saveClientsToCache(updated);
    if (editingClient?.id === id) {
      setEditingClient(null);
    }
  };

  const handleEditInitiate = (client: Client) => {
    setEditingClient(client);
    // Smooth scroll user to top / form element on mobile devices
    const formElement = document.getElementById('client-form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInitiateMessage = (client: Client, mode: 'whatsapp' | 'email') => {
    setMsgTargetClient(client);
    setMsgTargetMode(mode);
    setIsMsgModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
  };

  // Helper metric states
  const totalClients = clients.length;
  const emailsAvailable = clients.filter(c => c.email).length;
  const whatsappAvailable = clients.filter(c => c.telefone).length;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans flex flex-col antialiased text-slate-900 select-none">
      {/* Top Navbar in Clean Minimalism */}
      <header id="crm-header" className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm">
            C
          </div>
          <span className="text-xl font-semibold tracking-tight text-slate-900">
            CRM de Clientes
          </span>
          <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50/70 px-2 py-0.5 rounded ml-2 hidden sm:inline-block">
            Módulo Fast-Dispatch
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div id="operator-info-chip" className="flex items-center gap-2.5 bg-slate-100 border border-transparent px-3-5 py-1.5 rounded-lg text-xs font-semibold text-slate-600">
            <ShieldCheck size={14} className="text-slate-500" />
            <span className="hidden sm:inline">Operador: glauvmm@gmail.com</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-150 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-700">
            GM
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Metric Boxes Widget */}
        <div id="metrics-bar" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between transition-all hover:shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Clientes Registrados</span>
              <span className="text-2xl font-bold text-slate-900 leading-tight block">{totalClients}</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users size={18} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between transition-all hover:shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Contatos WhatsApp</span>
              <span className="text-2xl font-bold text-slate-900 leading-tight block">{whatsappAvailable}</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <PhoneCall size={18} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between transition-all hover:shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Contatos E-mail</span>
              <span className="text-2xl font-bold text-slate-900 leading-tight block">{emailsAvailable}</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
              <MailCheck size={18} />
            </div>
          </div>
        </div>

        {/* Dashboard Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          {/* Card Form: col-span-4 */}
          <div className="lg:col-span-4">
            <ClientForm
              onSave={handleSaveClient}
              editingClient={editingClient}
              onCancelEdit={handleCancelEdit}
            />

            {/* Micro-Help Guidelines Inside Workspace */}
            <div id="dashboard-help-box" className="mt-4 p-5 bg-amber-50 rounded-xl border border-amber-100 shadow-3xs flex gap-3 text-xs leading-relaxed">
              <HelpCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 mb-1">Como disparar mensagens?</p>
                <p className="text-amber-800">
                  Na tabela ao lado, clique em <strong>WhatsApp</strong> ou <strong>E-mail</strong> para preencher o modelo que deseja e enviar com as informações automáticas do cliente.
                </p>
              </div>
            </div>
          </div>

          {/* List Component: col-span-8 */}
          <div className="lg:col-span-8 h-full min-h-[480px]">
            <ClientList
              clients={clients}
              onEdit={handleEditInitiate}
              onDelete={handleDeleteClient}
              onInitiateMessage={handleInitiateMessage}
            />
          </div>
        </div>
      </main>

      {/* Floating Messenger Handler */}
      <MessageModal
        isOpen={isMsgModalOpen}
        onClose={() => {
          setIsMsgModalOpen(false);
          setMsgTargetClient(null);
          setMsgTargetMode(null);
        }}
        client={msgTargetClient}
        mode={msgTargetMode}
      />

      {/* Bottom Status Bar matching exactly the theme preset */}
      <footer className="h-8 bg-slate-900 text-slate-400 px-8 flex items-center justify-between text-[10px] uppercase tracking-widest shrink-0">
        <div className="flex gap-4">
          <span>Status do Sistema: <span className="text-green-500">Online</span></span>
          <span>Sincronização: LocalStorage OK</span>
        </div>
        <div>
          v2.4.0 — Made for Efficiency
        </div>
      </footer>
    </div>
  );
}
