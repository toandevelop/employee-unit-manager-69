
import { StateCreator } from 'zustand';
import { CardTemplate } from '@/types/cardTemplate';

// Define the CardTemplateSlice type
export interface CardTemplateSlice {
  cardTemplates: CardTemplate[];
  setCardTemplates: (templates: CardTemplate[]) => void;
}

// Create and export the CardTemplateSlice
export const createCardTemplateSlice: StateCreator<
  CardTemplateSlice & any,
  [],
  [],
  CardTemplateSlice
> = (set) => ({
  cardTemplates: [
    {
      id: 'default',
      name: 'Mẫu mặc định',
      organizationId: '',
      backgroundColor: 'white',
      headerColor: 'bg-primary',
      textColor: 'text-gray-800',
      qrCodePosition: 'bottom',
      showLogo: true
    },
    {
      id: 'modern',
      name: 'Mẫu hiện đại',
      organizationId: '',
      backgroundColor: '#f8f9fa',
      headerColor: 'bg-blue-600',
      textColor: 'text-gray-900',
      qrCodePosition: 'right',
      showLogo: true
    }
  ],
  setCardTemplates: (templates: CardTemplate[]) => set({ cardTemplates: templates }),
});
