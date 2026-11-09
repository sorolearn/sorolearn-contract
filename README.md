# sorolearn-contract

Soroban contract that issues on-chain course-completion certificates for SoroLearn. Each certificate is a `(learner, course)` record. There is no transferable token; it's a simple, queryable attestation.

Progress tracking (lessons and levels) stays off-chain. Only the final "you completed a path" event is recorded here, minted by the platform admin.

Related repos:

- [sorolearn-backend](https://github.com/sorolearn/sorolearn-backend): holds the admin key and calls `mint_certificate` / `has_certificate`
- [sorolearn-frontend](https://github.com/sorolearn/sorolearn-frontend): the learning app

## Interface

| Function | Who can call | What it does |
| --- | --- | --- |
| `initialize(admin)` | anyone, once | Sets the admin. Fails with `AlreadyInitialized` on a second call |
| `mint_certificate(learner, course)` | admin only | Records a certificate. Fails with `AlreadyMinted` if one exists |
| `has_certificate(learner, course)` | anyone | Returns `true` if a certificate exists |
| `get_certificate(learner, course)` | anyone | Returns the certificate record, if any |

See [`src/lib.rs`](src/lib.rs) for the error codes and the certificate record's fields.

## Build and test

Requires Rust with the `wasm32v1-none` target, and the [`stellar` CLI](https://developers.stellar.org/docs/tools/cli) for deploying.

```bash
rustup target add wasm32v1-none
cargo test                      # run the test suite
cargo llvm-cov --summary-only   # coverage (requires: rustup component add llvm-tools-preview)
stellar contract build          # build the wasm
```

Any change to `src/` should come with tests covering the new behavior. See [`src/test.rs`](src/test.rs) for the existing patterns, including auth-failure tests via `MockAuth`/`MockAuthInvoke` and event-payload assertions via `env.events().all()`.

## Deployed instances

### Testnet

- Contract ID: `CCVFIMTLHN2YFVKFITJYU4PWDIGNG2Q7AWWF4GPKBUBQOJEOGRDTIK5K`
- Admin address: `GC3RLT4NG5FFNGHJO64FTQ3NF62FPIKHBSBTRLAJOSASAKBYZHWKIM5Z`
- Wasm hash: `ad8d43486b33391091e1d63bd118f073f55788bbe80535bf34998ecbffc8ba67`
- [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCVFIMTLHN2YFVKFITJYU4PWDIGNG2Q7AWWF4GPKBUBQOJEOGRDTIK5K)

## Changing the deployed contract

Merging a change here does not update what's on testnet. Deploying gives a new contract ID unless you upgrade in place, so any change to the deployed contract needs explicit discussion in the PR first. After deploying:

1. Update the deployed-instance details above.
2. If the public interface changed, regenerate the TypeScript client in sorolearn-backend (`src/certificate-client.ts`; see that repo's README).
3. Set `CERTIFICATE_CONTRACT_ID` on the backend if the contract ID changed.
