/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Client, MessageTemplate } from '../types';
import { defaultTemplates, replacePlaceholders } from '../templates';
import { makeWhatsAppLink, makeMailtoLink, formatPhone } from '../utils';
import { X, Send, Copy, Check, MessageSquare, Mail, FileText } from 'lucide-react';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  mode: 'whatsapp' | 'email' | null;
}

export default function MessageModal({ isOpen, onClose, client, mode }: MessageModalProps) {
  if (!isOpen || !client || !mode) return null;

  const filteredTemplates = defaultTemplates.filter((t) => t.type === mode);
  
  // States
  const [selectedTemplateId, setSelectedTemplateId] = useState(filteredTemplates[0]?.id || 'custom');
  const [subject, setSubject] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [copied, setCopied] = useState(false);

  // Set default contents when client or template changes
  useEffect(() => {
    const activeTemplate = filteredTemplates.find((t) => t.id === selectedTemplateId);
    if (activeTemplate) {
      setSubject(activeTemplate.subject || '');
      setBodyContent(activeTemplate.content);
    } else if (selectedTemplateId === 'custom') {
      setSubject(mode === 'email' ? 'Mensagem Importante' : '');
      setBodyContent(
        mode === 'email' 
          ? 'Olá, {nome},\n\nDigite sua mensagem personalizada aqui...' 
          : 'Olá, {nome}! Digite sua mensagem aqui...'
      );
    }
  }, [selectedTemplateId, client, mode]);

  // Compute live preview
  const clientData = {
    nome: client.nome,
    cpf: client.cpf,
    telefone: client.telefone,
    email: client.email,
    dataCadastro: client.dataCadastro,
  };

  const previewSubject = replacePlaceholders(subject, clientData);
  const previewBody = replacePlaceholders(bodyContent, clientData);

  // Generate action links
  const targetLink = mode === 'whatsapp' 
    ? makeWhatsAppLink(client.telefone, previewBody)
    : makeMailtoLink(client.email, previewSubject, previewBody);

  const handleCopyText = async () => {
    try {
      const textToCopy = mode === 'email' 
        ? `Assunto: ${previewSubject}\n\n${previewBody}` 
        : previewBody;
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <div id="message-modal-overlay" className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        id="message-modal-box"
        className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden w-full max-w-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${mode === 'whatsapp' ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600'}`}>
              {mode === 'whatsapp' ? <MessageSquare size={18} /> : <Mail size={18} />}
            </div>
            <div>
              <h3 id="modal-title" className="font-bold text-slate-900 text-md leading-tight">
                Disparar por {mode === 'whatsapp' ? 'WhatsApp' : 'E-mail'}
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Destinatário: <strong className="text-slate-800 font-semibold">{client.nome}</strong>
              </p>
            </div>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form & Workspace body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* Client Target Card */}
          <div id="target-details-bar" className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium text-slate-500">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">E-mail de Destino</span>
              <span className="text-slate-800 break-all">{client.email}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">WhatsApp / Telefone</span>
              <span className="text-slate-800">{formatPhone(client.telefone)}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">Placeholders válidos</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {['{nome}', '{cpf}', '{telefone}', '{email}'].map(tag => (
                  <code key={tag} className="text-[9px] bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                    {tag}
                  </code>
                ))}
              </div>
            </div>
          </div>

          {/* Selector de Modelos (Templates) */}
          <div className="flex flex-col gap-1.5">
            <span id="template-select-label" className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              Modelo de Mensagem
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {filteredTemplates.map((temp) => (
                <button
                  key={temp.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(temp.id)}
                  className={`px-3 py-2 rounded-lg text-left border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    selectedTemplateId === temp.id
                      ? mode === 'whatsapp'
                        ? 'border-green-600 bg-green-50/50 text-green-805'
                        : 'border-indigo-600 bg-indigo-50/50 text-indigo-805'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="block truncate">{temp.name}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedTemplateId('custom')}
                className={`px-3 py-2 rounded-lg text-left border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedTemplateId === 'custom'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-805'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                Escrever Mensagem Livre
              </button>
            </div>
          </div>

          {/* Email Subject field (Only for email) */}
          {mode === 'email' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject-input" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Assunto do E-mail
              </label>
              <input
                id="subject-input"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex e-mail: Confirmamos sua inscrição"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white text-slate-800 font-medium"
              />
            </div>
          )}

          {/* Editable text container */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="body-input" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Texto Base (Suporta Placeholders)
            </label>
            <textarea
              id="body-input"
              rows={5}
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              placeholder="Sua mensagem..."
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white font-mono text-slate-700 leading-relaxed"
            />
          </div>

          {/* Preview panel */}
          <div id="live-preview-box" className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col gap-2 relative">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <FileText size={12} />
              Visualização Real do Canal
            </span>
            <div className="text-sm text-slate-700 whitespace-pre-wrap font-sans mt-0.5 leading-relaxed bg-white rounded-md p-4 border border-slate-150 max-h-[160px] overflow-y-auto shadow-2xs">
              {mode === 'email' && (
                <div id="preview-subject-header" className="border-b border-slate-100 pb-2 mb-2">
                  <span className="text-xs font-bold text-slate-400">Assunto:</span>{' '}
                  <span className="font-semibold text-slate-800 text-xs">{previewSubject}</span>
                </div>
              )}
              {previewBody}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="copy-preview-btn"
            type="button"
            onClick={handleCopyText}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-slate-750 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all select-none active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-500" />
                Copiado com Sucesso!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copiar Texto Formatado
              </>
            )}
          </button>

          <a
            id="launch-dispatch-anchor"
            href={targetLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-xs text-white text-center flex items-center justify-center gap-2 cursor-pointer select-none transition-all ${
              mode === 'whatsapp'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Send size={13} />
            {mode === 'whatsapp' ? 'Abrir no WhatsApp Web' : 'Disparar Novo E-mail'}
          </a>
        </div>
      </div>
    </div>
  );
}
