import { ImageSourcePropType } from 'react-native';

export const productImages: Record<string, ImageSourcePropType> = {
  'alphonso-box': require('../../assets/products/alphonso-box.png'),
  'kesar-crate': require('../../assets/products/kesar-crate.png'),
  'alphonso-gift': require('../../assets/products/alphonso-gift.png'),
};

export const brandImages = {
  hero: require('../../assets/brand/ugadi-hero-premium.png') as ImageSourcePropType,
};

export const categoryImages: Record<string, ImageSourcePropType> = {
  'fresh-fruits': require('../../assets/brand/ugadi-hero-premium.png'),
  'fresh-vegetables': require('../../assets/categories/fresh-vegetables.png'),
  'spices-pantry': require('../../assets/categories/spices-pantry.png'),
  'gift-boxes': require('../../assets/products/alphonso-gift.png'),
};
