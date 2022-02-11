use std::convert::TryFrom;

use be_positive::ContractContract as Contract;
pub use near_sdk::json_types::{Base64VecU8, ValidAccountId, WrappedDuration, U64};
use near_sdk::serde_json::{self, Value};
use near_sdk_sim::{
  call, deploy, init_simulator, transaction::ExecutionStatus, ContractAccount, ExecutionResult,
  UserAccount,
};
use serde_json::from_str;

static CONTRACT_BYTES: &[u8] = include_bytes!("../out/main.wasm");

pub const DEFAULT_GAS: u64 = 300_000_000_000_000;

fn init() -> (UserAccount, ContractAccount<Contract>) {
  let root = init_simulator(None);

  let contract: ContractAccount<Contract> = deploy!(
    contract: Contract,
    contract_id: "contract_id".to_string(),
    bytes: CONTRACT_BYTES,
    signer_account: root
  );

  (root, contract)
}

fn should_fail(result: ExecutionResult, should_be: String, else_fail: String) {
  match result.status() {
    ExecutionStatus::Failure(failure) => {
      println!("{}", failure.to_string());
      assert!(failure.to_string().contains(&should_be), "{}", else_fail)
    }
    _ => panic!("Should fail"),
  }
}

fn to_valid_account(account: &str) -> ValidAccountId {
  ValidAccountId::try_from(account.to_string()).expect("Invalid account")
}

#[test]
fn check_init() {
  let (root, contract) = init();

  should_fail(
    call!(root, contract.add_owner(to_valid_account("new_owner"))),
    "The contract is not initialized".to_string(),
    "Contract shouldn't be initialized".to_string(),
  );
  should_fail(
    call!(
      root,
      contract.init_meta(to_valid_account(
        &("0".to_string().to_owned() + &root.account_id)
      ))
    ),
    "Please, define yourself as contract owner".to_string(),
    "Define alien contract owner isn't safe".to_string(),
  );
}

#[test]
fn check_mint() {
  let (root, contract) = init();

  call!(root, contract.init_meta(to_valid_account(&root.account_id))).assert_success();
  call!(
    root,
    contract.nft_create(
      "Title".to_string(),
      "Description".to_string(),
      "Qm12345678901234567890123456789012345678901235".to_string(),
      "8901234567890123456789012".to_string(),
      true
    ),
    deposit = 1000000000000000000000000
  )
  .assert_success();
  should_fail(
    call!(
      root,
      contract.nft_create(
        "Title".to_string(),
        "Description".to_string(),
        "Qm12345678901234567890123456789012345678901235".to_string(),
        "8901234567890123456789012".to_string(),
        true
      ),
      deposit = 1000000000000000000000000
    ),
    "token_id must be unique".to_string(),
    "Token ID should't be duplicated".to_string(),
  );
  assert_ne!(
    call!(
      root,
      contract.nft_token("Qm12345678901234567890123456789012345678901235".to_string())
    )
    .unwrap_json_value()
    .to_string(),
    "null",
    "Token should be created"
  );
  assert_eq!(
    call!(
      root,
      contract.nft_token("Qm12345678901234567890123456789012345678901236".to_string())
    )
    .unwrap_json_value()
    .to_string(),
    "null",
    "Token shouldn't be created"
  );

  let event: Value = from_str(
    &*call!(root, contract.view_events("0".to_string(), 1))
      .unwrap_json_value()
      .to_string(),
  )
  .unwrap();
  assert_eq!(
    event["events"][0]["Transfer"]["initiator"], root.account_id,
    "Event is wrong"
  );
  assert_eq!(
    event["events"][0]["Transfer"]["sender"],
    serde_json::Value::Null,
    "Event is wrong"
  );
  assert_eq!(
    event["events"][0]["Transfer"]["receiver"], "contract_id",
    "Event is wrong"
  );
  assert_eq!(
    event["events"][0]["Transfer"]["token_id"], "Qm12345678901234567890123456789012345678901235",
    "Event is wrong"
  );
  println!("{}", event);

  should_fail(
    call!(
      root,
      contract.nft_create(
        "Title".to_string(),
        "Description".to_string(),
        "Qm12345678901234567890123456789012345678901234".to_string(),
        "89012345678901234a6789012".to_string(),
        true
      ),
      deposit = 1000000000000000000000000
    ),
    "Parsing price failed".to_string(),
    "Price should be set to number".to_string(),
  );
  should_fail(
    call!(
      root,
      contract.nft_create(
        "Title".to_string(),
        "Description".to_string(),
        "Qm12345678901234567890123456789012345678901234".to_string(),
        "8901234567890123456789012".to_string(),
        true
      ),
      deposit = 100
    ),
    "Not enough money attached".to_string(),
    "Should be not enough money".to_string(),
  );
  should_fail(
    call!(
      root,
      contract.nft_create(
        "Title".to_string(),
        "0".repeat(513).to_string(),
        "Qm12345678901234567890123456789012345678901234".to_string(),
        "8901234567890123456789012".to_string(),
        true
      ),
      deposit = 1000000000000000000000000
    ),
    "Description length should be less than 512".to_string(),
    "Description length should be bouded".to_string(),
  );
  should_fail(
    call!(
      root,
      contract.nft_create(
        "0".repeat(65).to_string(),
        "Description".to_string(),
        "Qm12345678901234567890123456789012345678901234".to_string(),
        "8901234567890123456789012".to_string(),
        true
      ),
      deposit = 1000000000000000000000000
    ),
    "Title length should be less than 64".to_string(),
    "Title length should be bounded".to_string(),
  );
  should_fail(
    call!(
      root,
      contract.nft_create(
        "0".repeat(65).to_string(),
        "Description".to_string(),
        "m123456789012345678901234567890123456789012345".to_string(),
        "8901234567890123456789012".to_string(),
        true
      ),
      deposit = 1000000000000000000000000
    ),
    "Token id length should be 46 and start from 'Qm'".to_string(),
    "Wrong media should be deprecated".to_string(),
  );
}
