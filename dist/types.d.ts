export type AptosAccountInfo = {
    publicKey: string;
    address: string;
};
export type ProviderState = {
    account: AptosAccountInfo | null;
};
export type TxnOptions = {
    sender?: string;
    sequence_number?: string;
    max_gas_amount?: string;
    gas_unit_price?: string;
    gas_currency_code?: string;
    expiration_timestamp_secs?: string;
};
export type TxnPayload = {
    function: string;
    type_arguments: any[];
    arguments: any[];
};
export interface SignMessagePayload {
    address?: boolean;
    application?: boolean;
    chainId?: boolean;
    message: string;
    nonce: number;
}
export interface SignMessageResponse {
    address?: string;
    application?: string;
    chainId?: number;
    fullMessage: string;
    message: string;
    nonce: number;
    prefix: string;
    signature: string;
}
