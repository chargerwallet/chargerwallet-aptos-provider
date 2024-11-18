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
import { ProviderAptos } from './ChargerwalletAptosProvider';
import { web3Errors } from '@chargerwallet/cross-inpage-provider-errors';
class ProviderAptosMartian extends ProviderAptos {
    get publicKey() {
        var _a, _b;
        return (_b = (_a = this._state.account) === null || _a === void 0 ? void 0 : _a.publicKey) !== null && _b !== void 0 ? _b : null;
    }
    constructor(props) {
        super(Object.assign(Object.assign({}, props), { bridge: props.bridge || getOrCreateExtInjectedJsBridge({ timeout: props.timeout }) }));
        this.isMartian = true;
        window.dispatchEvent(new Event('martian#initialized'));
    }
    _callMartianBridge(params) {
        params.aptosProviderType = this.aptosProviderType;
        return this.bridgeRequest(params);
    }
    signAndSubmitTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof transaction === 'string') {
                return yield this._callMartianBridge({
                    method: 'martianSignAndSubmitTransaction',
                    params: transaction,
                });
            }
            else {
                const res = yield this._callMartianBridge({
                    method: 'signAndSubmitTransaction',
                    params: transaction,
                });
                if (!res)
                    throw web3Errors.provider.unauthorized();
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return JSON.parse(res);
            }
        });
    }
    signTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof transaction === 'string') {
                return this._callMartianBridge({
                    method: 'martianSignTransaction',
                    params: transaction,
                });
            }
            else {
                const res = yield this._callMartianBridge({
                    method: 'signTransaction',
                    params: transaction,
                });
                if (!res)
                    throw web3Errors.provider.unauthorized();
                return new Uint8Array(Buffer.from(res, 'hex'));
            }
        });
    }
    signGenericTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callMartianBridge({
                method: 'signGenericTransaction',
                params: {
                    func: transaction.func,
                    args: transaction.args,
                    type_args: transaction.type_args,
                },
            });
        });
    }
    generateSignAndSubmitTransaction(sender, payload, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const txn = yield this.generateTransaction(sender, payload, options);
            const txnHash = yield this.signAndSubmitTransaction(txn);
            return txnHash;
        });
    }
    createCollection(name, description, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callMartianBridge({
                method: 'createCollection',
                // @ts-expect-error
                params: {
                    name,
                    description,
                    uri,
                },
            });
        });
    }
    createToken(collectionName, name, description, supply, uri, max, royalty_payee_address, royalty_points_denominator, royalty_points_numerator, property_keys, property_values, property_types) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callMartianBridge({
                method: 'createToken',
                // @ts-expect-error
                params: {
                    collectionName,
                    name,
                    description,
                    supply,
                    uri,
                    max,
                    royalty_payee_address,
                    royalty_points_denominator,
                    royalty_points_numerator,
                    property_keys,
                    property_values,
                    property_types,
                },
            });
        });
    }
    // rpc
    generateTransaction(sender, payload, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callMartianBridge({
                method: 'generateTransaction',
                // @ts-expect-error
                params: {
                    sender,
                    payload,
                    options,
                },
            });
        });
    }
    _convertStringToUint8Array(array) {
        return new Uint8Array(array.split(',').map((item) => parseInt(item, 10)));
    }
    _convertMaybeHexStringTostring(hexString) {
        if (typeof hexString === 'string') {
            return hexString;
        }
        else {
            return hexString.toString();
        }
    }
    _convertAnyNumberToString(number) {
        if (typeof number === 'string') {
            return number;
        }
        else {
            return number.toString();
        }
    }
    submitTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const txraw = typeof transaction === 'string' ? this._convertStringToUint8Array(transaction) : transaction;
            return this._callMartianBridge({
                method: 'submitTransaction',
                params: Buffer.from(txraw).toString('hex'),
            });
        });
    }
    getTransactions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callMartianBridge({
                method: 'getTransactions',
                params: Object.assign(Object.assign({}, query), { start: (query === null || query === void 0 ? void 0 : query.start) ? this._convertAnyNumberToString(query.start) : undefined }),
            });
        });
    }
    getTransaction(txnHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callMartianBridge({
                method: 'getTransaction',
                params: txnHash,
            });
        });
    }
    getAccountTransactions(accountAddress, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callMartianBridge({
                method: 'getAccountTransactions',
                // @ts-expect-error
                params: {
                    accountAddress: this._convertMaybeHexStringTostring(accountAddress),
                    query: Object.assign(Object.assign({}, query), { start: (query === null || query === void 0 ? void 0 : query.start) ? this._convertAnyNumberToString(query.start) : undefined }),
                },
            });
        });
    }
    getAccountResources(accountAddress, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callMartianBridge({
                method: 'getAccountResources',
                // @ts-expect-error
                params: {
                    accountAddress: this._convertMaybeHexStringTostring(accountAddress),
                    query: Object.assign(Object.assign({}, query), { ledgerVersion: (query === null || query === void 0 ? void 0 : query.ledgerVersion)
                            ? this._convertAnyNumberToString(query.ledgerVersion)
                            : undefined }),
                },
            });
        });
    }
    getAccount(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callMartianBridge({
                method: 'getAccount',
                params: this._convertMaybeHexStringTostring(accountAddress),
            });
        });
    }
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callMartianBridge({
                method: 'getChainId',
                params: undefined,
            });
        });
    }
    getLedgerInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._callMartianBridge({
                method: 'getLedgerInfo',
                params: undefined,
            });
        });
    }
}
export { ProviderAptosMartian };
