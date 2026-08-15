export type DeliveryQuote = {
  serviceable: boolean;
  zone?: string;
  feeCents?: number;
  earliestWindow?: string;
  reason?: string;
};

export interface DeliveryService {
  quote(postalCode: string, subtotalCents: number): Promise<DeliveryQuote>;
  getLiveEta(orderId: string): Promise<{ eta: string; driverLocation?: { lat: number; lng: number } }>;
}

// Production implementation calls server endpoints so routing keys and driver
// locations are never exposed directly to arbitrary clients.
export class ApiDeliveryService implements DeliveryService {
  constructor(private readonly baseUrl: string, private readonly token: () => Promise<string>) {}

  private async get(path: string) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${await this.token()}` },
    });
    if (!response.ok) throw new Error('Delivery information is temporarily unavailable.');
    return response.json();
  }

  quote(postalCode: string, subtotalCents: number) {
    return this.get(`/delivery/quote?postalCode=${encodeURIComponent(postalCode)}&subtotal=${subtotalCents}`);
  }

  getLiveEta(orderId: string) {
    return this.get(`/orders/${encodeURIComponent(orderId)}/eta`);
  }
}
