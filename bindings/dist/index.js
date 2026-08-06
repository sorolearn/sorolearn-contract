import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CCVFIMTLHN2YFVKFITJYU4PWDIGNG2Q7AWWF4GPKBUBQOJEOGRDTIK5K",
    }
};
export const Errors = {
    1: { message: "AlreadyInitialized" },
    2: { message: "NotInitialized" },
    3: { message: "AlreadyMinted" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAwAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAABAAAAAAAAAA5Ob3RJbml0aWFsaXplZAAAAAAAAgAAAAAAAAANQWxyZWFkeU1pbnRlZAAAAAAAAAM=",
            "AAAAAQAAAAAAAAAAAAAAC0NlcnRpZmljYXRlAAAAAAMAAAAAAAAABmNvdXJzZQAAAAAAEQAAAAAAAAAJaXNzdWVkX2F0AAAAAAAABgAAAAAAAAAHbGVhcm5lcgAAAAAT",
            "AAAABQAAAAAAAAAAAAAAEUNlcnRpZmljYXRlTWludGVkAAAAAAAAAQAAAARtaW50AAAAAgAAAAAAAAAHbGVhcm5lcgAAAAATAAAAAQAAAAAAAAAGY291cnNlAAAAAAARAAAAAAAAAAI=",
            "AAAAAAAAAEdPbmUtdGltZSBzZXR1cDogc2V0cyB0aGUgYWRtaW4gYWRkcmVzcyBhdXRob3JpemVkIHRvIG1pbnQgY2VydGlmaWNhdGVzLgAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAQAAA+kAAAACAAAAAw==",
            "AAAAAAAAAEZUaGUgY2VydGlmaWNhdGUgcmVjb3JkIGZvciBgbGVhcm5lcmAvYGNvdXJzZWAsIGlmIG9uZSBoYXMgYmVlbiBtaW50ZWQuAAAAAAAPZ2V0X2NlcnRpZmljYXRlAAAAAAIAAAAAAAAAB2xlYXJuZXIAAAAAEwAAAAAAAAAGY291cnNlAAAAAAARAAAAAQAAA+gAAAfQAAAAC0NlcnRpZmljYXRlAA==",
            "AAAAAAAAADtXaGV0aGVyIGBsZWFybmVyYCBhbHJlYWR5IGhvbGRzIGEgY2VydGlmaWNhdGUgZm9yIGBjb3Vyc2VgLgAAAAAPaGFzX2NlcnRpZmljYXRlAAAAAAIAAAAAAAAAB2xlYXJuZXIAAAAAEwAAAAAAAAAGY291cnNlAAAAAAARAAAAAQAAAAE=",
            "AAAAAAAAALlNaW50IGEgY29tcGxldGlvbiBjZXJ0aWZpY2F0ZSBmb3IgYGxlYXJuZXJgIG9uIGBjb3Vyc2VgLiBSZXF1aXJlcyB0aGUKYWRtaW4ncyBhdXRob3JpemF0aW9uIOKAlCB0aGUgcGxhdGZvcm0gdmVyaWZpZXMgY291cnNlIGNvbXBsZXRpb24Kb2ZmLWNoYWluIGFuZCBzaWducyB0aGlzIG9uIHRoZSBsZWFybmVyJ3MgYmVoYWxmLgAAAAAAABBtaW50X2NlcnRpZmljYXRlAAAAAgAAAAAAAAAHbGVhcm5lcgAAAAATAAAAAAAAAAZjb3Vyc2UAAAAAABEAAAABAAAD6QAAAAIAAAAD"]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        get_certificate: (this.txFromJSON),
        has_certificate: (this.txFromJSON),
        mint_certificate: (this.txFromJSON)
    };
}
