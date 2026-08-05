# certificate-contract

Soroban contract that issues on-chain course-completion certificates for
SoroLearn. Each certificate is a `(learner, course)` record — there is no
transferable token; it's a simple, queryable attestation.

Progress tracking (lessons/levels) stays off-chain in the frontend. Only the
final "you completed a path" event is recorded here, minted by the platform
admin once it has verified completion.

## Interface

- `initialize(admin: Address)` — one-time setup, sets the authorized minter.
- `mint_certificate(learner: Address, course: Symbol)` — admin-gated. Fails
  with `AlreadyMinted` if `learner` already holds a certificate for `course`.
- `has_certificate(learner: Address, course: Symbol) -> bool`
- `get_certificate(learner: Address, course: Symbol) -> Option<Certificate>`

Minting publishes a `CertificateMinted` event topic'd by `learner`.

## Build

```bash
cargo test
stellar contract build
```

Requires the `wasm32v1-none` target (Rust 1.84+):

```bash
rustup target add wasm32v1-none
```

## Deploy (testnet)

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/certificate_contract.wasm \
  --source <admin-identity> \
  --network testnet

stellar contract invoke --id <contract-id> --source <admin-identity> --network testnet \
  -- initialize --admin <admin-address>
```
