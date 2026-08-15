export type PaymentProvider = 'stripe' | 'moneris';

export type CheckoutRequest = {
  orderId: string;
  amountCents: number;
  currency: 'CAD';
  returnUrl: string;
};

export type CheckoutSession = {
  provider: PaymentProvider;
  clientSecret?: string;
  hostedCheckoutUrl?: string;
};

export interface PaymentGateway {
  createCheckout(request: CheckoutRequest): Promise<CheckoutSession>;
}

export type MockStripeReceipt = {
  status: 'succeeded';
  providerReference: string;
  cardBrand: 'Visa';
  cardLast4: '4242';
  paidAt: string;
};

/** Prototype-only simulation. It performs no network request and handles no card data. */
export async function confirmMockStripePayment(amountCents: number): Promise<MockStripeReceipt> {
  if (amountCents <= 0) throw new Error('A positive total is required.');
  await new Promise((resolve) => setTimeout(resolve, 900));
  return {
    status: 'succeeded',
    providerReference: `pi_mock_${Date.now()}`,
    cardBrand: 'Visa',
    cardLast4: '4242',
    paidAt: new Date().toISOString(),
  };
}

/**
 * The app calls one authenticated server endpoint. Provider credentials, amount
 * validation, idempotency, capture and webhook reconciliation remain server-side.
 */
export class ServerPaymentGateway implements PaymentGateway {
  constructor(
    private readonly provider: PaymentProvider,
    private readonly endpoint: string,
    private readonly accessToken: () => Promise<string>,
  ) {}

  async createCheckout(request: CheckoutRequest): Promise<CheckoutSession> {
    const token = await this.accessToken();
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...request, provider: this.provider }),
    });
    if (!response.ok) throw new Error('Unable to start checkout. Please try again.');
    return response.json() as Promise<CheckoutSession>;
  }
}
