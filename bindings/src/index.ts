import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
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
} as const

export const Errors = {
  1: {message:"AlreadyInitialized"},
  2: {message:"NotInitialized"},
  3: {message:"AlreadyMinted"}
}


export interface Certificate {
  course: string;
  issued_at: u64;
  learner: string;
}


export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * One-time setup: sets the admin address authorized to mint certificates.
   */
  initialize: ({admin}: {admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_certificate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * The certificate record for `learner`/`course`, if one has been minted.
   */
  get_certificate: ({learner, course}: {learner: string, course: string}, options?: MethodOptions) => Promise<AssembledTransaction<Option<Certificate>>>

  /**
   * Construct and simulate a has_certificate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Whether `learner` already holds a certificate for `course`.
   */
  has_certificate: ({learner, course}: {learner: string, course: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a mint_certificate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Mint a completion certificate for `learner` on `course`. Requires the
   * admin's authorization — the platform verifies course completion
   * off-chain and signs this on the learner's behalf.
   */
  mint_certificate: ({learner, course}: {learner: string, course: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAwAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAABAAAAAAAAAA5Ob3RJbml0aWFsaXplZAAAAAAAAgAAAAAAAAANQWxyZWFkeU1pbnRlZAAAAAAAAAM=",
        "AAAAAQAAAAAAAAAAAAAAC0NlcnRpZmljYXRlAAAAAAMAAAAAAAAABmNvdXJzZQAAAAAAEQAAAAAAAAAJaXNzdWVkX2F0AAAAAAAABgAAAAAAAAAHbGVhcm5lcgAAAAAT",
        "AAAABQAAAAAAAAAAAAAAEUNlcnRpZmljYXRlTWludGVkAAAAAAAAAQAAAARtaW50AAAAAgAAAAAAAAAHbGVhcm5lcgAAAAATAAAAAQAAAAAAAAAGY291cnNlAAAAAAARAAAAAAAAAAI=",
        "AAAAAAAAAEdPbmUtdGltZSBzZXR1cDogc2V0cyB0aGUgYWRtaW4gYWRkcmVzcyBhdXRob3JpemVkIHRvIG1pbnQgY2VydGlmaWNhdGVzLgAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAQAAA+kAAAACAAAAAw==",
        "AAAAAAAAAEZUaGUgY2VydGlmaWNhdGUgcmVjb3JkIGZvciBgbGVhcm5lcmAvYGNvdXJzZWAsIGlmIG9uZSBoYXMgYmVlbiBtaW50ZWQuAAAAAAAPZ2V0X2NlcnRpZmljYXRlAAAAAAIAAAAAAAAAB2xlYXJuZXIAAAAAEwAAAAAAAAAGY291cnNlAAAAAAARAAAAAQAAA+gAAAfQAAAAC0NlcnRpZmljYXRlAA==",
        "AAAAAAAAADtXaGV0aGVyIGBsZWFybmVyYCBhbHJlYWR5IGhvbGRzIGEgY2VydGlmaWNhdGUgZm9yIGBjb3Vyc2VgLgAAAAAPaGFzX2NlcnRpZmljYXRlAAAAAAIAAAAAAAAAB2xlYXJuZXIAAAAAEwAAAAAAAAAGY291cnNlAAAAAAARAAAAAQAAAAE=",
        "AAAAAAAAALlNaW50IGEgY29tcGxldGlvbiBjZXJ0aWZpY2F0ZSBmb3IgYGxlYXJuZXJgIG9uIGBjb3Vyc2VgLiBSZXF1aXJlcyB0aGUKYWRtaW4ncyBhdXRob3JpemF0aW9uIOKAlCB0aGUgcGxhdGZvcm0gdmVyaWZpZXMgY291cnNlIGNvbXBsZXRpb24Kb2ZmLWNoYWluIGFuZCBzaWducyB0aGlzIG9uIHRoZSBsZWFybmVyJ3MgYmVoYWxmLgAAAAAAABBtaW50X2NlcnRpZmljYXRlAAAAAgAAAAAAAAAHbGVhcm5lcgAAAAATAAAAAAAAAAZjb3Vyc2UAAAAAABEAAAABAAAD6QAAAAIAAAAD" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<Result<void>>,
        get_certificate: this.txFromJSON<Option<Certificate>>,
        has_certificate: this.txFromJSON<boolean>,
        mint_certificate: this.txFromJSON<Result<void>>
  }
}