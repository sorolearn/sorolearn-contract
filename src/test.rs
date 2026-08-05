use super::*;
use soroban_sdk::testutils::Address as _;

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
