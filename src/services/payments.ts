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
