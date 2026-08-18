// Unified brand palette shared across the Document Scanner and Refugee Support Assistant.
export const theme = {
  blue: '#4199CB',
  blueDark: '#2E7BA8',
  mint: '#62E0C8',
  aqua: '#C3F1EA',
  aquaSoft: '#E8FAF6',
  white: '#FFFFFF',
  bg: '#F4FAFC',
  textPrimary: '#1E2A38',
  textSecondary: '#5B7184',
  border: '#D9E6EC',
  error: '#B94A48',
  warning: '#E0922F',
  gradient: 'linear-gradient(90deg, #4199CB 0%, #62E0C8 100%)',
  gradientSoft: 'linear-gradient(135deg, #C3F1EA 0%, #E8FAF6 100%)',
  shadow: '0 4px 20px rgba(65, 153, 203, 0.10)',
  shadowSoft: '0 2px 10px rgba(65, 153, 203, 0.06)',
};

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic' },
  { code: 'sw', label: 'Swahili' },
  { code: 'fr', label: 'French' },
  { code: 'so', label: 'Somali' },
  { code: 'rw', label: 'Kinyarwanda' },
];

export const LOCATIONS = [
  { code: 'kakuma', label: 'Kakuma' },
  { code: 'bidibidi', label: 'Bidibidi' },
  { code: 'other', label: 'Other' },
];

export const SERVICE_TYPES = [
  { code: 'health', label: 'Health Services', desc: 'Clinics, medication, maternal care, emergencies' },
  { code: 'legal', label: 'Legal & Protection', desc: 'Legal aid, asylum, documentation, safety' },
];
