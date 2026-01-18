import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { ptBR, enUS } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata uma data para exibição baseada no idioma
 */
export function formatDate(date: string | Date, language: 'pt' | 'en' = 'en'): string {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      // Tentar parseISO primeiro, se falhar, tentar new Date
      try {
        dateObj = parseISO(date);
      } catch {
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', date);
      return typeof date === 'string' ? date : 'Data inválida';
    }
    
    const locale = language === 'pt' ? ptBR : enUS;
    return format(dateObj, 'dd/MM/yyyy', { locale });
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return typeof date === 'string' ? date : 'Data inválida';
  }
}

/**
 * Converte uma data para o formato ISO (YYYY-MM-DD) para inputs type="date"
 */
export function dateToInputValue(date: string | Date): string {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      // Tentar parseISO primeiro, se falhar, tentar new Date
      try {
        dateObj = parseISO(date);
      } catch {
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', date);
      return new Date().toISOString().split('T')[0];
    }
    
    // Ajustar para o timezone local para evitar problemas de data
    // Usar os componentes de data local para evitar problemas de timezone
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error converting date to input value:', error, date);
    if (typeof date === 'string') {
      // Tentar extrair YYYY-MM-DD de uma string ISO
      const match = date.match(/^\d{4}-\d{2}-\d{2}/);
      return match ? match[0] : new Date().toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Converte uma data ISO (YYYY-MM-DD) para formato brasileiro (DD/MM/YYYY)
 */
export function isoToBrazilianFormat(isoDate: string): string {
  if (!isoDate) return '';
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }
  return isoDate;
}

/**
 * Converte uma data no formato brasileiro (DD/MM/YYYY) para ISO (YYYY-MM-DD)
 */
export function brazilianToIsoFormat(dateStr: string): string {
  if (!dateStr) return '';
  // Remover qualquer caractere não numérico exceto /
  const cleaned = dateStr.replace(/[^\d/]/g, '');
  const match = cleaned.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}
