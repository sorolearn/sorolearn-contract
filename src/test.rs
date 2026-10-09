use super::*;
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, Events as _, MockAuth, MockAuthInvoke},
    vec, IntoVal, Map, Val,
};

fn setup(env: &Env) -> (Address, CertificateContractClient<'_>) {
    let admin = Address::generate(env);
    let contract_id = env.register(CertificateContract, ());
    let client = CertificateContractClient::new(env, &contract_id);
    (admin, client)
}

#[test]
fn initialize_then_mint_and_query() {
    let env = Env::default();
    env.mock_all_auths();

    let (admin, client) = setup(&env);
    client.initialize(&admin);

    let learner = Address::generate(&env);
    let course = Symbol::new(&env, "beginner");

    assert!(!client.has_certificate(&learner, &course));
    assert!(client.get_certificate(&learner, &course).is_none());

    client.mint_certificate(&learner, &course);

    assert!(client.has_certificate(&learner, &course));
    let cert = client.get_certificate(&learner, &course).unwrap();
    assert_eq!(cert.learner, learner);
    assert_eq!(cert.course, course);
}

#[test]
fn initialize_twice_fails() {
    let env = Env::default();
    env.mock_all_auths();

    let (admin, client) = setup(&env);
    client.initialize(&admin);

    let result = client.try_initialize(&admin);
    assert_eq!(result, Err(Ok(Error::AlreadyInitialized)));
}

#[test]
fn mint_before_initialize_fails() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(CertificateContract, ());
    let client = CertificateContractClient::new(&env, &contract_id);

    let learner = Address::generate(&env);
    let course = Symbol::new(&env, "beginner");

    let result = client.try_mint_certificate(&learner, &course);
    assert_eq!(result, Err(Ok(Error::NotInitialized)));
}

#[test]
fn mint_twice_for_same_learner_and_course_fails() {
    let env = Env::default();
    env.mock_all_auths();

    let (admin, client) = setup(&env);
    client.initialize(&admin);

    let learner = Address::generate(&env);
    let course = Symbol::new(&env, "beginner");

    client.mint_certificate(&learner, &course);
    let result = client.try_mint_certificate(&learner, &course);
    assert_eq!(result, Err(Ok(Error::AlreadyMinted)));
}

#[test]
fn certificates_are_scoped_per_course() {
    let env = Env::default();
    env.mock_all_auths();

    let (admin, client) = setup(&env);
    client.initialize(&admin);

    let learner = Address::generate(&env);
    let beginner = Symbol::new(&env, "beginner");
    let intermediate = Symbol::new(&env, "intermediate");

    client.mint_certificate(&learner, &beginner);

    assert!(client.has_certificate(&learner, &beginner));
    assert!(!client.has_certificate(&learner, &intermediate));
}

#[test]
fn certificates_are_scoped_per_learner() {
    let env = Env::default();
    env.mock_all_auths();

    let (admin, client) = setup(&env);
    client.initialize(&admin);

    let alice = Address::generate(&env);
    let bob = Address::generate(&env);
    let course = Symbol::new(&env, "beginner");

    client.mint_certificate(&alice, &course);

    assert!(client.has_certificate(&alice, &course));
    assert!(!client.has_certificate(&bob, &course));
}

/// mint_certificate is correctly gated on the real admin — merely having
/// *some* mocked authorization isn't enough if it's not for the address
/// actually stored as admin. Without this, a caller could potentially mint
/// certificates for themselves by authorizing their own call instead of the
/// admin's.
#[test]
#[should_panic]
fn mint_requires_the_real_admin_not_just_any_authorized_caller() {
    let env = Env::default();

    let admin = Address::generate(&env);
    let contract_id = env.register(CertificateContract, ());
    let client = CertificateContractClient::new(&env, &contract_id);
    client.initialize(&admin);

    let impostor = Address::generate(&env);
    let learner = Address::generate(&env);
    let course = Symbol::new(&env, "beginner");

    // The impostor authorizes their own call to mint_certificate — but the
    // contract requires auth from `admin` specifically, which has no
    // matching mock here, so this must still fail.
    env.mock_auths(&[MockAuth {
        address: &impostor,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "mint_certificate",
            args: (learner.clone(), course.clone()).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    client.mint_certificate(&learner, &course);
}

#[test]
fn mint_publishes_certificate_minted_event() {
    let env = Env::default();
    env.mock_all_auths();

    let (admin, client) = setup(&env);
    client.initialize(&admin);

    let learner = Address::generate(&env);
    let course = Symbol::new(&env, "beginner");

    client.mint_certificate(&learner, &course);

    assert_eq!(
        env.events().all(),
        vec![
            &env,
            (
                client.address.clone(),
                (symbol_short!("mint"), &learner).into_val(&env),
                Map::<Symbol, Val>::from_array(&env, [(symbol_short!("course"), course.into_val(&env))])
                    .into_val(&env),
            ),
        ]
    );
}

/// Documents current behavior rather than asserting a requirement: anyone
/// can call initialize() before it's been set, since it doesn't itself
/// require auth. Safe in practice as long as deployment and initialization
/// happen atomically (the standard pattern), but worth keeping visible —
/// it's the kind of thing that stops being safe if that assumption changes.
#[test]
fn initialize_does_not_require_caller_auth() {
    let env = Env::default();

    let admin = Address::generate(&env);
    let contract_id = env.register(CertificateContract, ());
    let client = CertificateContractClient::new(&env, &contract_id);

    // No mock_all_auths() and no mock_auths() at all — initialize succeeds anyway.
    client.initialize(&admin);

    assert!(client.try_initialize(&admin).is_err());
}
