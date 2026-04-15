import { create } from 'zustand';

export type FieldType = 'text' | 'number' | 'date' | 'boolean';

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface PublishedForm {
  id: string;
  categoryId: string; 
  title: string;
  fields: Field[];
  createdAt: string;
}

interface FormState {
  // Estado Global
  categories: Category[];
  publishedForms: PublishedForm[];

  // Estado do Rascunho
  fields: Field[];
  title: string;
  selectedCategoryId: string | null;

  // Ações
  setTitle: (title: string) => void;
  setSelectedCategory: (id: string) => void;
  addField: (type: FieldType) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<Field>) => void;

  
  
  // Ações Globais
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;

  publishForm: () => void;
}

export const useFormStore = create<FormState>((set, get) => ({
  categories: [{ id: 'cat_geral', name: 'Geral' }], 
  publishedForms: [],

  fields: [],
  title: '',
  selectedCategoryId: 'cat_geral', 

  setTitle: (title) => set({ title }),
  setSelectedCategory: (id) => set({ selectedCategoryId: id }),

  addField: (type) => set((state) => ({
    fields: [...state.fields, { id: Math.random().toString(36).substring(7), label: '', type, required: false }]
  })),

  removeField: (id) => set((state) => ({
    fields: state.fields.filter((f) => f.id !== id)
  })),

  updateField: (id, updates) => set((state) => ({
    fields: state.fields.map((f) => f.id === id ? { ...f, ...updates } : f)
  })),


  addCategory: (name) => set((state) => ({
    categories: [...state.categories, { id: Math.random().toString(36).substring(7), name }]
  })),

  removeCategory: (id) => set((state) => ({
    categories: state.categories.filter((c) => c.id !== id),
    publishedForms: state.publishedForms.filter((f) => f.categoryId !== id)
  })),

  updateCategory: (id, updates) => set((state) => ({
    categories: state.categories.map((c) => c.id === id ? {...c, ...updates} : c )
  })),


  publishForm: () => {
    const { title, fields, publishedForms, selectedCategoryId } = get();
    
    if (!title || fields.length === 0 || !selectedCategoryId) return;

    const newForm: PublishedForm = {
      id: Math.random().toString(36).substring(7),
      categoryId: selectedCategoryId, // Salva a referência!
      title,
      fields,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    set({
      publishedForms: [newForm, ...publishedForms],
      title: '', 
      fields: [], 
      selectedCategoryId: 'cat_geral', // Reseta para o padrão
    });
  },
}));