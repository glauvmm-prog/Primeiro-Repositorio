/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Formats CPF while editing (XXX.XXX.XXX-XX)
export function formatCPF(value: string | undefined): string {
  if (!value) return '';
  const onlyDigits = value.replace(/\D/g, '');
  return onlyDigits
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

// Formats Phone while editing: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
export function formatPhone(value: string | undefined): string {
  if (!value) return '';
  const onlyDigits = value.replace(/\D/g, '');
  if (onlyDigits.length <= 10) {
    return onlyDigits
      .slice(0, 10)
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return onlyDigits
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

// Validates simple email pattern
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validates simple CPF (Checks basic length after removing masks)
export function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return false;
  // A simple rule-out of same-digit CPFs (optional but helpful)
  if (/^(\d)\1{10}$/.test(clean)) return false;
  return true;
}

// Prepares phone number for WhatsApp URL (returns only digits, prefixed with country code 55 if length is state+number)
export function cleanPhoneForWhatsApp(phone: string): string {
  let clean = phone.replace(/\D/g, '');
  // If the user has not written the country code (usually Brazilian code 55 is omitted in local CRM input)
  if (clean.length === 10 || clean.length === 11) {
    clean = '55' + clean;
  }
  return clean;
}

// Generates the proper WhatsApp link
export function makeWhatsAppLink(phone: string, text: string): string {
  const destination = cleanPhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${destination}&text=${encodedText}`;
}

// Generates the proper Mailto link
export function makeMailtoLink(email: string, subject: string, body: string): string {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
}
