import { Platform } from 'react-native';

export const colors = {
  forest950: '#073D20',
  forest900: '#075D2A',
  forest800: '#0D6C35',
  forest100: '#DFECDC',
  leaf600: '#4C941C',
  leaf500: '#72B724',
  lime300: '#B8DA69',
  mango500: '#F1B634',
  mango100: '#FFF0C8',
  ivory: '#FFFDF5',
  canvas: '#F6F3E8',
  paper: '#FFFFFF',
  ink: '#17351F',
  inkSoft: '#5E6D60',
  line: '#DCE2D5',
  danger: '#B84B3F',
  dangerSoft: '#FCE7E2',
  successSoft: '#E0F1E2',
  skySoft: '#EAF3EE',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 18, xl: 24, xxl: 36, xxxl: 56 } as const;
export const radius = { sm: 10, md: 16, lg: 24, xl: 32, pill: 999 } as const;

export const shadow = Platform.select({
  web: { boxShadow: '0 18px 48px rgba(7, 61, 32, 0.10)' },
  default: {
    shadowColor: '#073D20',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 5,
  },
});

export const typography = {
  display: { fontSize: 48, lineHeight: 50, fontWeight: '900' as const, letterSpacing: -1.7 },
  h1: { fontSize: 34, lineHeight: 39, fontWeight: '900' as const, letterSpacing: -1 },
  h2: { fontSize: 26, lineHeight: 31, fontWeight: '900' as const, letterSpacing: -0.5 },
  h3: { fontSize: 18, lineHeight: 23, fontWeight: '800' as const },
  body: { fontSize: 15, lineHeight: 23 },
  small: { fontSize: 12, lineHeight: 17 },
  micro: { fontSize: 10, lineHeight: 14, letterSpacing: 1.25, fontWeight: '800' as const },
};

export const contentMaxWidth = 1180;
