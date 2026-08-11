export interface PaymentGatewayWebhookReceipt {
  eventId: string;
  eventType: 'PAYMENT_REFUND_SUCCESS' | 'ESCROW_DISBURSED_COMPANION' | 'PENALTY_DEDUCTED';
  gatewayProvider: 'RAZORPAY_ROUTE' | 'STRIPE_CONNECT';
  transactionHash: string;
  disputeRef: string;
  amountCleared: number;
  clearedAt: string;
  payloadJson: string;
}

/**
 * Simulates real-time execution of Stripe / Razorpay escrow webhook clearance upon resolution.
 */
export function triggerPaymentGatewayWebhook(
  disputeRef: string,
  eventType: PaymentGatewayWebhookReceipt['eventType'],
  amount: number
): PaymentGatewayWebhookReceipt {
  const timestamp = new Date().toISOString();
  const txHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const eventId = 'evt_' + Math.floor(100000 + Math.random() * 900000);

  const payloadJson = JSON.stringify({
    event: eventType,
    created: Math.floor(Date.now() / 1000),
    data: {
      object: 'escrow_settlement',
      dispute_ref: disputeRef,
      amount: amount * 100, // cents/paise
      currency: 'USD',
      status: 'succeeded',
      transaction_hash: txHash,
      gateway: 'Stripe_Connect_Escrow_v2'
    }
  }, null, 2);

  return {
    eventId,
    eventType,
    gatewayProvider: 'STRIPE_CONNECT',
    transactionHash: txHash,
    disputeRef,
    amountCleared: amount,
    clearedAt: timestamp,
    payloadJson
  };
}
