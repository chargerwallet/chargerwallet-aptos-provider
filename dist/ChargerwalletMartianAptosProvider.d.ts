import { IInpageProviderConfig } from '@chargerwallet/cross-inpage-provider-core';
import { Types, MaybeHexString } from 'aptos';
import { TxnPayload, TxnOptions } from './types';
import { ProviderAptos } from './ChargerwalletAptosProvider';
type AnyNumber = bigint | number;
export type AptosRequestMartian = {
    'martianSignAndSubmitTransaction': (transactions: string) => Promise<string>;
    'martianSignTransaction': (transactions: string) => Promise<string>;
    'signAndSubmitTransaction': (transactions: Types.TransactionPayload) => Promise<string>;
    'signTransaction': (transactions: Types.TransactionPayload) => Promise<string>;
    'signGenericTransaction': (transaction: {
        func: string;
        args: any[];
        type_args: any[];
    }) => Promise<string>;
    'createCollection': (name: string, description: string, uri: string, maxAmount: string) => Promise<string>;
    'createToken': (collectionName: string, name: string, description: string, supply: number, uri: string, max: string, royalty_payee_address: string, royalty_points_denominator: number, royalty_points_numerator: number, property_keys: Array<string>, property_values: Array<string>, property_types: Array<string>) => Promise<string>;
    'generateTransaction': (sender: string, payload: TxnPayload, options?: TxnOptions) => Promise<string>;
    'submitTransaction': (transaction: string) => Promise<string>;
    'getTransactions': (query?: {
        start?: string;
        limit?: number;
    }) => Promise<Types.Transaction[]>;
    'getTransaction': (txnHash: string) => Promise<Types.Transaction>;
    'getAccountTransactions': (accountAddress: string, query?: {
        start?: string;
        limit?: number;
    }) => Promise<Types.Transaction[]>;
    'getAccountResources': (accountAddress: string, query?: {
        ledgerVersion?: string;
    }) => Promise<Types.MoveResource[]>;
    'getAccount': (accountAddress: string) => Promise<Types.AccountData>;
    'getChainId': () => Promise<{
        chainId: number;
    }>;
    'getLedgerInfo': () => Promise<Types.IndexResponse>;
};
type ChargerWalletAptosProviderProps = IInpageProviderConfig & {
    timeout?: number;
};
declare class ProviderAptosMartian extends ProviderAptos {
    readonly isMartian = true;
    get publicKey(): string | null;
    constructor(props: ChargerWalletAptosProviderProps);
    private _callMartianBridge;
    signAndSubmitTransaction(transaction: string | Types.TransactionPayload): Promise<string | Types.Transaction>;
    signTransaction(transaction: string | Types.TransactionPayload): Promise<string | Uint8Array>;
    signGenericTransaction(transaction: {
        func: string;
        args: any[];
        type_args: any[];
    }): Promise<string>;
    generateSignAndSubmitTransaction(sender: string, payload: TxnPayload, options?: TxnOptions): Promise<string>;
    createCollection(name: string, description: string, uri: string): Promise<string>;
    createToken(collectionName: string, name: string, description: string, supply: number, uri: string, max?: number | bigint, royalty_payee_address?: string, royalty_points_denominator?: number, royalty_points_numerator?: number, property_keys?: Array<string>, property_values?: Array<string>, property_types?: Array<string>): Promise<string>;
    generateTransaction(sender: string, payload: TxnPayload, options?: TxnOptions): Promise<string>;
    private _convertStringToUint8Array;
    private _convertMaybeHexStringTostring;
    private _convertAnyNumberToString;
    submitTransaction(transaction: Uint8Array | string): Promise<string>;
    getTransactions(query?: {
        start?: AnyNumber;
        limit?: number;
    }): Promise<Types.Transaction[]>;
    getTransaction(txnHash: string): Promise<Types.Transaction>;
    getAccountTransactions(accountAddress: MaybeHexString, query?: {
        start?: AnyNumber;
        limit?: number;
    }): Promise<Types.Transaction[]>;
    getAccountResources(accountAddress: MaybeHexString, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<Types.MoveResource[]>;
    getAccount(accountAddress: MaybeHexString): Promise<Types.AccountData>;
    getChainId(): Promise<{
        chainId: number;
    }>;
    getLedgerInfo(): Promise<Types.IndexResponse>;
}
export { ProviderAptosMartian };
