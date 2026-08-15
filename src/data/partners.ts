import { DeliveryRoute, RetailPartner } from '../domain/partners';

export const demoDeliveryRoute: DeliveryRoute = {
  id: 'RT-0814-WEST',
  name: 'Toronto West · Afternoon',
  deliveryPartner: 'Maple Mile Delivery',
  driverName: 'Samir Desai',
  vehicleLabel: 'White Transit · ON BKJM 214',
  routeWindow: '2:00–6:00 PM',
  startLocation: 'Ugadi Hub · Etobicoke',
  stops: [
    {
      id: 'STOP-01', orderId: 'UG-1048', sequence: 1, customerName: 'Neha Sharma',
      address: '425 Lake Shore Blvd W', city: 'Toronto', postalCode: 'M5V 1A4',
      phone: '(416) 555-0148', units: 2, deliveryWindow: '2:00–4:00 PM', eta: '2:24 PM',
      instructions: 'Concierge accepts deliveries. Call on arrival.', status: 'en_route',
    },
    {
      id: 'STOP-02', orderId: 'UG-1051', sequence: 2, customerName: 'Meera Iyer',
      address: '18 Bloorview Place', city: 'Etobicoke', postalCode: 'M8X 2T1',
      phone: '(647) 555-0182', units: 1, deliveryWindow: '3:00–5:00 PM', eta: '3:05 PM',
      instructions: 'Leave with customer only. Fragile gift box.', status: 'ready',
    },
    {
      id: 'STOP-03', orderId: 'UG-1053', sequence: 3, customerName: 'Ravi Patel',
      address: '92 Mineola Road E', city: 'Mississauga', postalCode: 'L5G 2E5',
      phone: '(905) 555-0136', units: 3, deliveryWindow: '3:00–6:00 PM', eta: '4:10 PM',
      instructions: 'Use side entrance beside the garage.', status: 'ready',
    },
    {
      id: 'STOP-04', orderId: 'UG-1042', sequence: 4, customerName: 'Anita Rao',
      address: 'Customer details hidden', city: 'Mississauga', postalCode: 'L5B',
      phone: 'Hidden after delivery', units: 1, deliveryWindow: '1:00–3:00 PM', eta: 'Delivered 1:42 PM',
      status: 'delivered',
    },
  ],
};

export const demoRetailPartner: RetailPartner = {
  id: 'PARTNER-GREENLEAF-01',
  businessName: 'Greenleaf Indian Grocers',
  locationName: 'Mississauga · Hurontario',
  address: '4555 Hurontario St, Mississauga, ON',
  contactName: 'Kavita Shah',
  settlementSchedule: 'Weekly · Every Monday',
  inventory: [
    {
      id: 'INV-ALP-12', productName: 'Alphonso Reserve', unitLabel: '12-count premium box',
      sku: 'UG-FR-ALP-12', lotCode: 'IN-MH-0812-A', bestBefore: 'Aug 21', unitsOnHand: 9,
      reorderAt: 5, wholesaleCents: 4799, retailCents: 5999, status: 'healthy',
    },
    {
      id: 'INV-KES-12', productName: 'Kesar Orchard Box', unitLabel: '12-count orchard box',
      sku: 'UG-FR-KES-12', lotCode: 'IN-GJ-0811-K', bestBefore: 'Aug 20', unitsOnHand: 4,
      reorderAt: 5, wholesaleCents: 4399, retailCents: 5499, status: 'low',
    },
    {
      id: 'INV-GIFT-06', productName: 'Taste of Home Gift Box', unitLabel: '6-count gift box',
      sku: 'UG-GF-ALP-06', lotCode: 'IN-MH-0812-G', bestBefore: 'Aug 21', unitsOnHand: 2,
      reorderAt: 3, wholesaleCents: 2599, retailCents: 3299, status: 'low',
    },
  ],
  recentSales: [
    { id: 'SALE-431', productId: 'INV-ALP-12', productName: 'Alphonso Reserve', quantity: 2, totalCents: 11998, recordedAt: 'Today · 1:42 PM' },
    { id: 'SALE-430', productId: 'INV-KES-12', productName: 'Kesar Orchard Box', quantity: 1, totalCents: 5499, recordedAt: 'Today · 11:18 AM' },
    { id: 'SALE-429', productId: 'INV-GIFT-06', productName: 'Taste of Home Gift Box', quantity: 1, totalCents: 3299, recordedAt: 'Yesterday · 6:04 PM' },
  ],
};
