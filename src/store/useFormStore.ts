import { create } from 'zustand';

export type FieldType = 'text' | 'number' | 'date' | 'boolean' | 'image';

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
}

// Representa um formulário completo e salvo
export interface PublishedForm {
  id: string;
  title: string;
  fields: Field[];
  createdAt: string;
}

interface FormState {
  // Estado do Rascunho (Tela de Criação)
  fields: Field[];
  title: string;
  
  // Estado Global (Dashboard)
  publishedForms: PublishedForm[];

  // Ações do Rascunho
  setTitle: (title: string) => void;
  addField: (type: FieldType) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  
 
  publishForm: () => void;
}

export const useFormStore = create<FormState>((set, get) => ({
  fields: [],
  title: '',
  publishedForms: [],

  setTitle: (title) => set({ title }),

  addField: (type) => set((state) => ({
    fields: [...state.fields, { id: Math.random().toString(36).substring(7), label: '', type, required: false }]
  })),

  removeField: (id) => set((state) => ({
    fields: state.fields.filter((f) => f.id !== id)
  })),

  updateField: (id, updates) => set((state) => ({
    fields: state.fields.map((f) => f.id === id ? { ...f, ...updates } : f)
  })),

   
  publishForm: () => {
    const { title, fields, publishedForms } = get();
    if (!title || fields.length === 0) return;

    const newForm: PublishedForm = {
      id: Math.random().toString(36).substring(7),
      title,
      fields,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    set({
      publishedForms: [newForm, ...publishedForms], // Adiciona no topo da lista
      title: '', // Limpa o rascunho
      fields: [], // Limpa o rascunho
    });
  },
}));