/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Client {
  id: string;
  nome: string;
  cpf: string;
  telefone: string; // WhatsApp number
  email: string;
  dataCadastro: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  type: 'whatsapp' | 'email';
  subject?: string; // Only for email
  content: string; // Content with placeholders like {nome}, {cpf}, etc.
}
