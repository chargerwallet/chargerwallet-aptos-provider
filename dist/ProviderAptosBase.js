import { IInjectedProviderNames } from '@chargerwallet/cross-inpage-provider-types';
import { ProviderBase } from '@chargerwallet/cross-inpage-provider-core';
class ProviderAptosBase extends ProviderBase {
    constructor(props) {
        super(props);
        this.providerName = IInjectedProviderNames.aptos;
    }
    request(data) {
        return this.bridgeRequest(data);
    }
}
export { ProviderAptosBase };
