#![no_std]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, Address, Env, Symbol,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Certificate {
    pub learner: Address,
    pub course: Symbol,
    pub issued_at: u64,
}

#[contractevent(topics = ["mint"])]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CertificateMinted {
    #[topic]
    pub learner: Address,
    pub course: Symbol,
}

#[derive(Clone)]
#[contracttype]
enum DataKey {
    Admin,
    Cert(Address, Symbol),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    AlreadyMinted = 3,
}

#[contract]
pub struct CertificateContract;

#[contractimpl]
impl CertificateContract {
    /// One-time setup: sets the admin address authorized to mint certificates.
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        Ok(())
    }

    /// Mint a completion certificate for `learner` on `course`. Requires the
    /// admin's authorization — the platform verifies course completion
    /// off-chain and signs this on the learner's behalf.
    pub fn mint_certificate(env: Env, learner: Address, course: Symbol) -> Result<(), Error> {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)?;
        admin.require_auth();

        let key = DataKey::Cert(learner.clone(), course.clone());
        if env.storage().persistent().has(&key) {
            return Err(Error::AlreadyMinted);
        }

        let cert = Certificate {
            learner: learner.clone(),
            course: course.clone(),
            issued_at: env.ledger().timestamp(),
        };
        env.storage().persistent().set(&key, &cert);

        CertificateMinted { learner, course }.publish(&env);

        Ok(())
    }

    /// Whether `learner` already holds a certificate for `course`.
    pub fn has_certificate(env: Env, learner: Address, course: Symbol) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::Cert(learner, course))
    }

    /// The certificate record for `learner`/`course`, if one has been minted.
    pub fn get_certificate(env: Env, learner: Address, course: Symbol) -> Option<Certificate> {
        env.storage()
            .persistent()
            .get(&DataKey::Cert(learner, course))
    }
}

#[cfg(test)]
mod test;
