import { IInpageProviderConfig } from '@chargerwallet/cross-inpage-provider-core';
import { ProviderAptosBase } from './ProviderAptosBase';
import { AptosAccountInfo, ProviderState, SignMessagePayload, SignMessageResponse } from './types';
import { IJsonRpcRequest } from '@chargerwallet/cross-inpage-provider-types';
import { Types } from 'aptos';
export type AptosProviderType = 'petra' | 'martian';
declare const PROVIDER_EVENTS: {
    readonly connect: "connect";
    readonly disconnect: "disconnect";
    readonly accountChanged: "accountChanged";
    readonly networkChange: "networkChange";
    readonly message_low_level: "message_low_level";
};
type AptosProviderEventsMap = {
    [PROVIDER_EVENTS.connect]: (account: string) => void;
    [PROVIDER_EVENTS.disconnect]: () => void;
    [PROVIDER_EVENTS.accountChanged]: (account: string | null) => void;
    [PROVIDER_EVENTS.networkChange]: (name: string | null) => void;
    [PROVIDER_EVENTS.message_low_level]: (payload: IJsonRpcRequest) => void;
};
export type AptosRequest = {
    'connect': () => Promise<AptosAccountInfo>;
    'disconnect': () => Promise<void>;
    'account': () => Promise<AptosAccountInfo>;
    'network': () => Promise<string>;
    'getNetworkURL': () => Promise<string>;
    'signMessage': (payload: SignMessagePayload) => Promise<SignMessageResponse>;
    'signAndSubmitTransaction': (transactions: Types.TransactionPayload) => Promise<string>;
    'signTransaction': (transactions: Types.TransactionPayload) => Promise<string>;
};
export type PROVIDER_EVENTS_STRINGS = keyof typeof PROVIDER_EVENTS;
export interface IProviderAptos extends ProviderAptosBase {
    publicKey: string | null;
    /**
     * Connect wallet, and get wallet info
     * @emits `connect` on success
     */
    connect(): Promise<AptosAccountInfo>;
    isConnected(): boolean;
    /**
     * Disconnect wallet
     */
    disconnect(): Promise<void>;
    /**
     * Connect wallet, and get wallet info
     */
    account(): Promise<AptosAccountInfo>;
    /**
     * Sign and submit transactions
     * @returns Transaction
     */
    signAndSubmitTransaction(transactions: any): Promise<any>;
    signTransaction(transactions: any): Promise<any>;
    /**
     * Sign message
     * @returns Transaction
     */
    signMessage(payload: SignMessagePayload): Promise<SignMessageResponse>;
    network(): Promise<string>;
    getNetworkURL(): Promise<string>;
}
type ChargerWalletAptosProviderProps = IInpageProviderConfig & {
    timeout?: number;
};
declare class ProviderAptos extends ProviderAptosBase implements IProviderAptos {
    protected _state: ProviderState;
    protected aptosProviderType: AptosProviderType;
    get publicKey(): string | null;
    constructor(props: ChargerWalletAptosProviderProps);
    private _registerEvents;
    private _callBridge;
    private _handleConnected;
    private _handleDisconnected;
    isAccountsChanged(account: AptosAccountInfo | undefined): boolean;
    private _handleAccountChange;
    private _network;
    isNetworkChanged(network: string): boolean;
    private _handleNetworkChange;
    connect(): Promise<AptosAccountInfo>;
    isConnected(): boolean;
    account(): Promise<AptosAccountInfo>;
    signAndSubmitTransaction(transactions: any): Promise<any>;
    signTransaction(transactions: any): Promise<any>;
    signMessage(payload: SignMessagePayload): Promise<SignMessageResponse>;
    network(): Promise<string>;
    getNetwork(): Promise<{
        name: string;
        url: string;
        chainId: number;
    }>;
    getNetworkURL(): Promise<string>;
    disconnect(): Promise<void>;
    onNetworkChange(listener: AptosProviderEventsMap['networkChange']): this;
    onAccountChange(listener: AptosProviderEventsMap['accountChanged']): this;
    onDisconnect(listener: AptosProviderEventsMap['disconnect']): this;
    on<E extends keyof AptosProviderEventsMap>(event: E, listener: AptosProviderEventsMap[E]): this;
    emit<E extends keyof AptosProviderEventsMap>(event: E, ...args: Parameters<AptosProviderEventsMap[E]>): boolean;
}
export { ProviderAptos };
