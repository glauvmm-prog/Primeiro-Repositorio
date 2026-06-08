/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { formatCPF, formatPhone, validateEmail, validateCPF } from '../utils';
import { User, CreditCard, Phone, Mail, PlusCircle, Check, X, AlertCircle } from 'lucide-react';

interface ClientFormProps {
  onSave: (client: Omit<Client, 'id' | 'dataCadastro'> | Client) => void;
  editingClient: Client | null;
  onCancelEdit: () => void;
}

export default function ClientForm({ onSave, editingClient, onCancelEdit }: ClientFormProps) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // Validation feedback messages
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (editingClient) {
      setNome(editingClient.nome);
      setCpf(formatCPF(editingClient.cpf));
      setTelefone(formatPhone(editingClient.telefone));
      setEmail(editingClient.email);
    } else {
      resetForm();
    }
    setErrors({});
  }, [editingClient]);

  const resetForm = () => {
    setNome('');
    setCpf('');
    setTelefone('');
    setEmail('');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setTelefone(formatted);
    if (errors.telefone) {
      setErrors(prev => ({ ...prev, telefone: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nome.trim() || nome.trim().length < 3) {
      newErrors.nome = 'Por favor, insira o nome completo (mínimo 3 letras).';
    }

    const cleanCpf = cpf.replace(/\D/g, '');
    if (!cleanCpf) {
      newErrors.cpf = 'CPF é obrigatório.';
    } else if (!validateCPF(cpf)) {
      newErrors.cpf = 'CPF inválido. Deve conter exactly 11 dígitos.';
    }

    const cleanPhone = telefone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.telefone = 'Telefone é obrigatório.';
    } else if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      newErrors.telefone = 'Telefone inválido. Inclua o DDD (ex: 11999999999).';
    }

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Insira um e-mail com formato válido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const rawData = {
      nome: nome.trim(),
      cpf: cpf.replace(/\D/g, ''), // Save only digits for consistency
      telefone: telefone.replace(/\D/g, ''),
      email: email.trim().toLowerCase(),
    };

    if (editingClient) {
      onSave({
        ...editingClient,
        ...rawData,
      });
      setSuccessMessage('Cliente atualizado com sucesso!');
    } else {
      onSave(rawData);
      setSuccessMessage('Cliente cadastrado com sucesso!');
      resetForm();
    }

    // Auto clear success message
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div id="client-form-container" className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col shrink-0 overflow-hidden transition-all duration-300 hover:shadow-md h-fit">
      {/* Header Panel with bg-slate-50 */}
      <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 id="form-title" className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            {editingClient ? (
              <span className="flex items-center gap-2 text-indigo-600">
                Editar Cadastro
              </span>
            ) : (
              <span className="flex items-center gap-2 text-slate-900">
                Novo Cadastro
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {editingClient ? 'Atualize as informações cadastrais do cliente.' : 'Insira os dados do novo cliente.'}
          </p>
        </div>
        
        {editingClient && (
          <button
            id="cancel-edit-btn"
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X size={13} />
            Cancelar
          </button>
        )}
      </div>

      <form id="client-crm-form" onSubmit={handleSubmit} className="p-6 flex-1 space-y-4 flex flex-col">
        {/* Input Nome */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nome-input" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Nome Completo
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <User size={15} />
            </span>
            <input
              id="nome-input"
              type="text"
              required
              placeholder="Ex: Ana Beatriz de Souza"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (errors.nome) setErrors(prev => ({ ...prev, nome: '' }));
              }}
              className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 outline-none transition-all ${
                errors.nome 
                  ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-450 text-rose-900 bg-rose-50/10' 
                  : 'border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>
          {errors.nome && (
            <span id="error-nome" className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-0.5">
              <AlertCircle size={12} />
              {errors.nome}
            </span>
          )}
        </div>

        {/* Input CPF */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cpf-input" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            CPF
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <CreditCard size={15} />
            </span>
            <input
              id="cpf-input"
              type="text"
              required
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 outline-none transition-all ${
                errors.cpf 
                  ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-450 text-rose-900 bg-rose-50/10' 
                  : 'border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>
          {errors.cpf && (
            <span id="error-cpf" className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-0.5">
              <AlertCircle size={12} />
              {errors.cpf}
            </span>
          )}
        </div>

        {/* Input Número Telefone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone-input" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Telefone / WhatsApp
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Phone size={15} />
            </span>
            <input
              id="phone-input"
              type="text"
              required
              placeholder="(11) 00000-0000"
              value={telefone}
              onChange={handlePhoneChange}
              className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 outline-none transition-all ${
                errors.telefone 
                  ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-450 text-rose-900 bg-rose-50/10' 
                  : 'border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>
          {errors.telefone && (
            <span id="error-telefone" className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-0.5">
              <AlertCircle size={12} />
              {errors.telefone}
            </span>
          )}
        </div>

        {/* Input Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email-input" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            E-mail
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Mail size={15} />
            </span>
            <input
              id="email-input"
              type="email"
              required
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 outline-none transition-all ${
                errors.email 
                  ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-450 text-rose-900 bg-rose-50/10' 
                  : 'border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>
          {errors.email && (
            <span id="error-email" className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-0.5">
              <AlertCircle size={12} />
              {errors.email}
            </span>
          )}
        </div>

        {/* Feedback de Sucesso */}
        {successMessage && (
          <div id="success-alert" className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs font-medium flex items-center gap-2 mt-1">
            <Check size={14} className="bg-emerald-500 text-white rounded-full p-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            id="submit-form-btn"
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 active:scale-[0.98] transition-all cursor-pointer select-none"
          >
            {editingClient ? (
              'Atualizar Cadastro'
            ) : (
              'Cadastrar Cliente'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
