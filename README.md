# certificate-contract

Soroban contract that issues on-chain course-completion certificates for
SoroLearn. Each certificate is a `(learner, course)` record — there is no
transferable token; it's a simple, queryable attestation.

Progress tracking (lessons/levels) stays off-chain in the frontend. Only the
final "you completed a path" event is recorded here, minted by the platform
admin once it has verified completion.


## Deployed instances

### Testnet

- Contract ID: `CCVFIMTLHN2YFVKFITJYU4PWDIGNG2Q7AWWF4GPKBUBQOJEOGRDTIK5K`
- Admin address: `GC3RLT4NG5FFNGHJO64FTQ3NF62FPIKHBSBTRLAJOSASAKBYZHWKIM5Z`
- Wasm hash: `ad8d43486b33391091e1d63bd118f073f55788bbe80535bf34998ecbffc8ba67`
- [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCVFIMTLHN2YFVKFITJYU4PWDIGNG2Q7AWWF4GPKBUBQOJEOGRDTIK5K)
