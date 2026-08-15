export type DeliveryStopStatus = 'ready' | 'en_route' | 'arrived' | 'delivered' | 'exception';

export type DeliveryStop = {
  id: string;
  orderId: string;
  sequence: number;
  customerName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  units: number;
  deliveryWindow: string;
  eta: string;
  instructions?: string;
  status: DeliveryStopStatus;
};

export type DeliveryRoute = {
  id: string;
  name: string;
  deliveryPartner: string;
  driverName: string;
  vehicleLabel: string;
  routeWindow: string;
  startLocation: string;
  stops: DeliveryStop[];
};

export type RetailStockStatus = 'healthy' | 'low' | 'out_of_stock';

export type RetailInventoryItem = {
  id: string;
  productName: string;
  unitLabel: string;
  sku: string;
  lotCode: string;
  bestBefore: string;
  unitsOnHand: number;
  reorderAt: number;
  wholesaleCents: number;
  retailCents: number;
  status: RetailStockStatus;
};

export type RetailSale = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalCents: number;
  recordedAt: string;
};

export type RetailPartner = {
  id: string;
  businessName: string;
  locationName: string;
  address: string;
  contactName: string;
  settlementSchedule: string;
  inventory: RetailInventoryItem[];
  recentSales: RetailSale[];
};
