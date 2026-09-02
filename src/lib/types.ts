export type ChainId = "btc" | "eth" | "trx" | "bsc";

export interface Chain {
  id: ChainId;
  name: string;
  symbol: string;
  color: string;
  network: "mainnet" | "testnet";
}

export type OrderType = "swap" | "buy" | "sell";

export type OrderStatus =
  | "awaiting_deposit"
  | "deposit_detected"
  | "confirming"
  | "converting"
  | "paying_out"
  | "complete"
  | "rate_expired"
  | "underpaid"
  | "overpaid"
  | "late"
  | "cancelled";

export interface AnonymousOrder {
  claimCode: string;
  type: OrderType;
  fromChain: ChainId;
  fromAmount: number;
  toChain: ChainId;
  toAmount: number;
  destinationAddress: string;
  refundAddress?: string;
  status: OrderStatus;
  depositAddress: string;
  rate: number;
  createdAt: number;
}

export type InvoiceStatus =
  | "pending"
  | "paid"
  | "overpaid"
  | "underpaid"
  | "expired"
  | "cancelled";

export interface Invoice {
  id: string;
  amount: number;
  chain: ChainId;
  description: string;
  customerEmail?: string;
  status: InvoiceStatus;
  createdAt: number;
  expiresAt: number;
  address: string;
}

export type PayoutStatus =
  | "queued"
  | "broadcasting"
  | "confirming"
  | "complete"
  | "failed";

export interface Payout {
  id: string;
  kind: "single" | "bulk";
  destination: string;
  amount: number;
  chain: ChainId;
  status: PayoutStatus;
  createdAt: number;
  recipients?: number;
  txId?: string;
}

export interface WalletBalance {
  chain: ChainId;
  available: number;
  pending: number;
  reserved: number;
  fiatRate: number;
}

export type KybStatus =
  | "not_started"
  | "submitted"
  | "needs_more_info"
  | "approved"
  | "rejected";
