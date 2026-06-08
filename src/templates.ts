/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MessageTemplate } from './types';

export const defaultTemplates: MessageTemplate[] = [
  {
    id: 'wa-welcome',
    name: 'Boas-vindas (WhatsApp)',
    type: 'whatsapp',
    content: 'Olá, {nome}! Seja muito bem-vindo(a) à nossa empresa. É um enorme prazer ter você conosco! Qualquer dúvida, estamos por aqui. 😊'
  },
  {
    id: 'wa-reminder',
    name: 'Aviso / Lembrete (WhatsApp)',
    type: 'whatsapp',
    content: 'Olá, {nome}. Passando para lembrar sobre o nosso compromisso agendado. Caso precise reprogramar, por favor nos avise. Aguardamos você!'
  },
  {
    id: 'wa-promo',
    name: 'Promoção (WhatsApp)',
    type: 'whatsapp',
    content: 'Olá, {nome}! Temos uma condição super especial e exclusiva para clientes cadastrados (CPF: {cpf}). Clique aqui para saber mais e garantir seu benefício! 🚀'
  },
  {
    id: 'email-welcome',
    name: 'Boas-vindas (E-mail)',
    type: 'email',
    subject: 'Seja muito bem-vindo(a), {nome}!',
    content: 'Olá, {nome},\n\nSeu cadastro no nosso sistema foi realizado com sucesso!\n\nConfirme seus dados cadastrais abaixo:\n- Nome: {nome}\n- CPF: {cpf}\n- Telefone: {telefone}\n- E-mail: {email}\n\nSeja muito bem-vindo(a) e conte com nossa equipe para o que precisar.\n\nAtenciosamente,\nEquipe de Atendimento'
  },
  {
    id: 'email-reminder',
    name: 'Acompanhamento / Suporte (E-mail)',
    type: 'email',
    subject: '{nome}, como podemos ajudar hoje?',
    content: 'Prezado(a) {nome},\n\nGostaríamos de reforçar que estamos à sua inteira disposição para prestar qualquer suporte ou tirar dúvidas sobre nossos serviços.\n\nConfirmamos seu e-mail de contato como {email}.\n\nSe precisar de auxílio imediato, por favor responda a esta mensagem ou nos acione via WhatsApp no telefone {telefone}.\n\nCordialmente,\nSuporte ao Cliente'
  }
];

export function replacePlaceholders(text: string, data: { nome: string; cpf: string; telefone: string; email: string; dataCadastro: string }): string {
  return text
    .replace(/{nome}/g, data.nome)
    .replace(/{cpf}/g, data.cpf)
    .replace(/{telefone}/g, data.telefone)
    .replace(/{email}/g, data.email)
    .replace(/{dataCadastro}/g, data.dataCadastro);
}
