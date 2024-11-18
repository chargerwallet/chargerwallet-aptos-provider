var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getOrCreateExtInjectedJsBridge } from '@chargerwallet/extension-bridge-injected';
import { ProviderAptosBase } from './ProviderAptosBase';
import { web3Errors } from '@chargerwallet/cross-inpage-provider-errors';
const PROVIDER_EVENTS = {
    'connect': 'connect',
    'disconnect': 'disconnect',
    'accountChanged': 'accountChanged',
    'networkChange': 'networkChange',
    'message_low_level': 'message_low_level',
};
function isWalletEventMethodMatch({ method, name }) {
    return method === `wallet_events_${name}`;
}
class ProviderAptos extends ProviderAptosBase {
    get publicKey() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this._state) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.publicKey) !== null && _c !== void 0 ? _c : null;
    }
    constructor(props) {
        super(Object.assign(Object.assign({}, props), { bridge: props.bridge || getOrCreateExtInjectedJsBridge({ timeout: props.timeout }) }));
        this._state = {
            account: null,
        };
        this.aptosProviderType = 'petra';
        this._registerEvents();
    }
    _registerEvents() {
        window.addEventListener('chargerwallet_bridge_disconnect', () => {
            this._handleDisconnected();
        });
        this.on(PROVIDER_EVENTS.message_low_level, (payload) => {
            if (!payload)
                return;
            const { method, params } = payload;
            if (isWalletEventMethodMatch({ method, name: PROVIDER_EVENTS.accountChanged })) {
                this._handleAccountChange(params);
            }
            if (isWalletEventMethodMatch({ method, name: PROVIDER_EVENTS.networkChange })) {
                this._handleNetworkChange(params);
            }
        });
    }
    _callBridge(params) {
        params.aptosProviderType = this.aptosProviderType;
        return this.bridgeRequest(params);
    }
    _handleConnected(account, options = { emit: true }) {
        var _a;
        this._state.account = {
            publicKey: account.publicKey,
            address: account.address,
        };
        if (this.isConnectionStatusChanged('connected')) {
            this.connectionStatus = 'connected';
            if (options.emit) {
                const address = (_a = account === null || account === void 0 ? void 0 : account.address) !== null && _a !== void 0 ? _a : null;
                this.emit('connect', address);
                this.emit('accountChanged', address);
            }
        }
    }
    _handleDisconnected(options = { emit: true }) {
        this._state.account = null;
        if (this.isConnectionStatusChanged('disconnected')) {
            this.connectionStatus = 'disconnected';
            if (options.emit) {
                this.emit('disconnect');
                this.emit('accountChanged', null);
            }
        }
    }
    isAccountsChanged(account) {
        var _a;
        return (account === null || account === void 0 ? void 0 : account.address) !== ((_a = this._state.account) === null || _a === void 0 ? void 0 : _a.address);
    }
    // trigger by bridge account change event
    _handleAccountChange(payload) {
        const account = payload;
        if (this.isAccountsChanged(account)) {
            this.emit('accountChanged', (account === null || account === void 0 ? void 0 : account.address) || null);
        }
        if (!account) {
            this._handleDisconnected();
            return;
        }
        this._handleConnected(account, { emit: false });
    }
    isNetworkChanged(network) {
        return this._network === undefined || network !== this._network;
    }
    _handleNetworkChange(payload) {
        const network = payload;
        if (this.isNetworkChanged(network)) {
            this.emit('networkChange', network || null);
        }
        this._network = network;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._state.account) {
                return Promise.resolve(this._state.account);
            }
            const result = yield this._callBridge({
                method: 'connect',
                params: undefined,
            });
            if (!result)
                throw web3Errors.provider.unauthorized();
            this._handleConnected(result, { emit: true });
            return result;
        });
    }
    isConnected() {
        return !!this._state.account;
    }
    account() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._callBridge({
                method: 'account',
                params: undefined,
            });
            if (!res)
                throw web3Errors.provider.unauthorized();
            return Promise.resolve(res);
        });
    }
    signAndSubmitTransaction(transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._callBridge({
                method: 'signAndSubmitTransaction',
                params: transactions,
            });
            if (!res)
                throw web3Errors.provider.unauthorized();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return JSON.parse(res);
        });
    }
    signTransaction(transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._callBridge({
                method: 'signTransaction',
                params: transactions,
            });
            if (!res)
                throw web3Errors.provider.unauthorized();
            return new Uint8Array(Buffer.from(res, 'hex'));
        });
    }
    signMessage(payload) {
        return this._callBridge({
            method: 'signMessage',
            params: payload,
        });
    }
    network() {
        return this._callBridge({
            method: 'network',
            params: undefined,
        });
    }
    getNetwork() {
        return __awaiter(this, void 0, void 0, function* () {
            const name = yield this._callBridge({
                method: 'network',
                params: undefined,
            });
            const url = yield this._callBridge({
                method: 'getNetworkURL',
                params: undefined,
            });
            // see more chainID https://aptos.dev/nodes/networks
            const chainId = name === 'Mainnet' ? 1 : 2;
            return {
                name,
                url,
                chainId,
            };
        });
    }
    getNetworkURL() {
        return this._callBridge({
            method: 'getNetworkURL',
            params: undefined,
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._callBridge({
                method: 'disconnect',
                params: void 0,
            });
            this._handleDisconnected();
        });
    }
    onNetworkChange(listener) {
        return super.on(PROVIDER_EVENTS.networkChange, listener);
    }
    onAccountChange(listener) {
        return super.on(PROVIDER_EVENTS.accountChanged, listener);
    }
    onDisconnect(listener) {
        return super.on(PROVIDER_EVENTS.disconnect, listener);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
}
export { ProviderAptos };
