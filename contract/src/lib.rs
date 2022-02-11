use std::collections::HashMap;
use std::convert::TryInto;

use near_contract_standards::non_fungible_token::core::{
  NonFungibleTokenCore, NonFungibleTokenResolver,
};
use near_contract_standards::non_fungible_token::enumeration::NonFungibleTokenEnumeration;
use near_contract_standards::non_fungible_token::metadata::{
  NFTContractMetadata, TokenMetadata, TokenStatus, NFT_METADATA_SPEC,
};
use near_contract_standards::non_fungible_token::{NonFungibleToken, Token, TokenId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, LookupSet, UnorderedSet};
use near_sdk::json_types::{ValidAccountId, U128};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::serde_json::json;
use near_sdk::{
  env, near_bindgen, setup_alloc, AccountId, Balance, BorshStorageKey, Gas, PanicOnDefault,
  Promise, PromiseOrValue,
};

setup_alloc!();

static IMAGE_ICON: &str = include_str!("../../logo.base64");

const SINGLE_CALL_GAS: Gas = 50_000_000_000_000;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
  tokens: NonFungibleToken,
  metadata: LazyOption<NFTContractMetadata>,
  owners: UnorderedSet<ValidAccountId>,
  moderators: UnorderedSet<ValidAccountId>,
  royalty: Royalty,
  events_transfer: LookupMap<String, EventTransfer>,
  events_lock: LookupMap<String, EventLock>,
  events_pricing: LookupMap<String, EventPricing>,
  events_ban: LookupMap<String, EventBan>,
  next_event_id: u128,
  mint_locked: LookupSet<String>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
pub enum EventType {
  Transfer(EventTransfer),
  Lock(EventLock),
  Pricing(EventPricing),
  Ban(EventBan),
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EventTransfer {
  initiator: AccountId,
  sender: Option<AccountId>,
  receiver: Option<AccountId>,
  token_id: TokenId,
  timestamp: String,
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EventLock {
  initiator: AccountId,
  status: TokenStatus,
  token_id: TokenId,
  timestamp: String,
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EventPricing {
  initiator: AccountId,
  price: String,
  selleble: bool,
  token_id: TokenId,
  timestamp: String,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
pub enum BanStatus {
  Ban,
  Unban,
  Warning,
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct EventBan {
  initiator: AccountId,
  receiver: AccountId,
  status: BanStatus,
  timestamp: String,
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ReturnEvents {
  events: Vec<EventType>,
  smth_else: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Royalty {
  mint_price: Balance,
  min_pricing_fee: Balance,
  min_transfer_fee: Balance,
  min_buy_fee: Balance,
  creator_royalty: u16,
  my_royalty: u16,
  royalty_full: u16,
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct ReturnRoyalty {
  mint_price: String,
  min_pricing_fee: String,
  min_transfer_fee: String,
  min_buy_fee: String,
  creator_royalty: u16,
  my_royalty: u16,
  royalty_full: u16,
}

#[derive(BorshSerialize, BorshStorageKey)]
enum StorageKey {
  NonFungibleToken,
  Metadata,
  TokenMetadata,
  Enumeration,
  Approval,
  Moderators,
  Etransfer,
  Elock,
  Epricing,
  Euserban,
  Owners,
  MintLocked,
}

#[near_bindgen]
impl Contract {
  fn is_status_ok(&mut self, status: TokenStatus) {
    assert!(
      status == TokenStatus::Ok || status == TokenStatus::SuperOk,
      "Token status is not ok"
    );
  }
  fn is_caller_owner(&mut self) {
    assert!(
      self
        .owners
        .contains(&env::predecessor_account_id().try_into().unwrap()),
      "Unauthorized"
    );
  }
  fn is_caller_moderator(&mut self) {
    let caller = env::predecessor_account_id().try_into().unwrap();
    assert!(
      self.owners.contains(&caller) || self.moderators.contains(&caller),
      "Unauthorized"
    );
  }

  fn get_metadata(&mut self, token_id: &TokenId) -> TokenMetadata {
    self
      .tokens
      .token_metadata_by_id
      .as_ref()
      .unwrap()
      .get(token_id)
      .unwrap()
  }
  fn put_metadata(&mut self, token_id: &TokenId, metadata: &TokenMetadata) {
    self
      .tokens
      .token_metadata_by_id
      .as_mut()
      .and_then(|by_id| by_id.insert(token_id, metadata));
  }

  fn get_owner(&mut self, token_id: &TokenId) -> AccountId {
    self
      .tokens
      .owner_by_id
      .get(token_id)
      .expect("Token not found")
  }

  fn add_transfer(
    &mut self,
    initiator: AccountId,
    sender: Option<AccountId>,
    receiver: Option<AccountId>,
    token_id: TokenId,
    timestamp: String,
  ) {
    self.events_transfer.insert(
      &self.next_event_id.to_string(),
      &EventTransfer {
        initiator,
        sender,
        receiver,
        token_id,
        timestamp,
      },
    );
    self.next_event_id += 1;
  }
  fn add_lock(
    &mut self,
    initiator: AccountId,
    status: TokenStatus,
    token_id: TokenId,
    timestamp: String,
  ) {
    self.events_lock.insert(
      &self.next_event_id.to_string(),
      &EventLock {
        initiator,
        status,
        token_id,
        timestamp,
      },
    );
    self.next_event_id += 1;
  }
  fn add_pricing(
    &mut self,
    initiator: AccountId,
    price: String,
    selleble: bool,
    token_id: TokenId,
    timestamp: String,
  ) {
    self.events_pricing.insert(
      &self.next_event_id.to_string(),
      &EventPricing {
        initiator,
        price,
        selleble,
        token_id,
        timestamp,
      },
    );
    self.next_event_id += 1;
  }
  fn add_ban(
    &mut self,
    initiator: AccountId,
    receiver: AccountId,
    status: BanStatus,
    timestamp: String,
  ) {
    self.events_ban.insert(
      &self.next_event_id.to_string(),
      &EventBan {
        initiator,
        receiver,
        status,
        timestamp,
      },
    );
    self.next_event_id += 1;
  }

  #[init]
  pub fn init_meta(owner: ValidAccountId) -> Self {
    assert!(!env::state_exists(), "Already initialized");
    let mut owners = UnorderedSet::new(StorageKey::Owners);
    assert_eq!(
      owner.to_string(),
      env::predecessor_account_id(),
      "Please, define yourself as contract owner"
    );
    owners.insert(&owner);
    Self {
      tokens: NonFungibleToken::new(
        StorageKey::NonFungibleToken,
        Some(StorageKey::TokenMetadata),
        Some(StorageKey::Enumeration),
        Some(StorageKey::Approval),
      ),
      metadata: LazyOption::new(
        StorageKey::Metadata,
        Some(&NFTContractMetadata {
          spec: NFT_METADATA_SPEC.to_string(),
          name: "Haher".to_string(),
          symbol: "HA-HA".to_string(),
          icon: Some(IMAGE_ICON.to_string()),
          base_uri: None,
          reference: None,
          reference_hash: None,
        }),
      ),
      owners,
      moderators: UnorderedSet::new(StorageKey::Moderators),
      royalty: Royalty {
        mint_price: 50_000_000_000_000_000_000_000,
        min_pricing_fee: 3_000_000_000_000_000_000_000,
        min_transfer_fee: 3_000_000_000_000_000_000_000,
        min_buy_fee: 5_000_000_000_000_000_000_000,
        creator_royalty: 100,
        my_royalty: 50,
        royalty_full: 10000,
      },
      events_transfer: LookupMap::new(StorageKey::Etransfer),
      events_lock: LookupMap::new(StorageKey::Elock),
      events_pricing: LookupMap::new(StorageKey::Epricing),
      events_ban: LookupMap::new(StorageKey::Euserban),
      next_event_id: 0,
      mint_locked: LookupSet::new(StorageKey::MintLocked),
    }
  }

  pub fn view_events(self, from_index: String, limit: u64) -> ReturnEvents {
    let from = from_index
      .parse::<u128>()
      .expect("Parsing from_index failed");
    let to = from + limit as u128;
    let mut result = Vec::new();
    for i in from..to {
      let evt = self.events_transfer.get(&i.to_string());
      result.push(match evt {
        Some(e) => EventType::Transfer(e),
        None => {
          let evp = self.events_pricing.get(&i.to_string());
          match evp {
            Some(e) => EventType::Pricing(e),
            None => {
              let evl = self.events_lock.get(&i.to_string());
              match evl {
                Some(e) => EventType::Lock(e),
                None => {
                  let evb = self.events_ban.get(&i.to_string());
                  match evb {
                    Some(e) => EventType::Ban(e),
                    None => break,
                  }
                }
              }
            }
          }
        }
      })
    }
    ReturnEvents {
      events: result,
      smth_else: to < self.next_event_id,
    }
  }

  pub fn add_owner(&mut self, owner: ValidAccountId) {
    self.is_caller_owner();
    self.owners.insert(&owner);
  }
  pub fn delete_owner(&mut self, owner: ValidAccountId) {
    self.is_caller_owner();
    assert_ne!(
      env::predecessor_account_id(),
      owner.to_string(),
      "Don't delete yourself"
    );
    self.owners.remove(&owner);
  }
  pub fn view_owners(self) -> Vec<ValidAccountId> {
    self.owners.to_vec()
  }
  pub fn take_money(&mut self, amount: Option<String>) {
    self.is_caller_owner();
    match amount {
      None => Promise::new(env::predecessor_account_id()).transfer(
        env::account_balance() - env::storage_usage() as Balance * env::storage_byte_cost(),
      ),
      Some(money) => Promise::new(env::predecessor_account_id())
        .transfer(money.parse::<Balance>().expect("Parsing amount failed")),
    };
  }
  pub fn update_royalty(
    &mut self,
    mint_price: String,
    min_pricing_fee: String,
    min_transfer_fee: String,
    min_buy_fee: String,
    creator_royalty: u16,
    my_royalty: u16,
    royalty_full: u16,
  ) {
    self.is_caller_owner();
    self.royalty = Royalty {
      mint_price: mint_price
        .parse::<Balance>()
        .expect("Parsing mint price failed"),
      min_pricing_fee: min_pricing_fee
        .parse::<Balance>()
        .expect("Parsing update price failed"),
      min_transfer_fee: min_transfer_fee
        .parse::<Balance>()
        .expect("Parsing transfer price failed"),
      min_buy_fee: min_buy_fee
        .parse::<Balance>()
        .expect("Parsing buy price failed"),
      creator_royalty,
      my_royalty: my_royalty,
      royalty_full: royalty_full,
    }
  }
  pub fn view_royalty(self) -> ReturnRoyalty {
    ReturnRoyalty {
      mint_price: self.royalty.mint_price.to_string(),
      min_pricing_fee: self.royalty.min_pricing_fee.to_string(),
      min_transfer_fee: self.royalty.min_transfer_fee.to_string(),
      min_buy_fee: self.royalty.min_buy_fee.to_string(),
      creator_royalty: self.royalty.creator_royalty,
      my_royalty: self.royalty.my_royalty,
      royalty_full: self.royalty.royalty_full,
    }
  }

  pub fn add_moderator(&mut self, account_id: ValidAccountId) {
    self.is_caller_owner();
    self.moderators.insert(&account_id);
  }
  pub fn delete_moderator(&mut self, account_id: ValidAccountId) {
    self.is_caller_owner();
    self.moderators.remove(&account_id);
  }
  pub fn view_moderators(self) -> Vec<ValidAccountId> {
    self.moderators.to_vec()
  }
  pub fn lock_to_super_ok(&mut self, token_id: TokenId) {
    self.is_caller_moderator();
    let mut metadata = self.get_metadata(&token_id);
    metadata.status = Some(TokenStatus::SuperOk);
    self.put_metadata(&token_id, &metadata);
    self.add_lock(
      env::signer_account_id(),
      TokenStatus::SuperOk,
      token_id,
      env::block_timestamp().to_string(),
    );
  }
  pub fn lock_to_transfer(&mut self, token_id: TokenId) {
    self.is_caller_moderator();
    let mut metadata = self.get_metadata(&token_id);
    metadata.status = Some(TokenStatus::LockedToTransfer);
    self.put_metadata(&token_id, &metadata);
    let owner = self.get_owner(&token_id);
    self.add_lock(
      env::signer_account_id(),
      TokenStatus::LockedToTransfer,
      token_id,
      env::block_timestamp().to_string(),
    );
    self.ban_warning(owner)
  }
  pub fn lock_to_listen(&mut self, token_id: TokenId) {
    self.is_caller_moderator();
    let mut metadata = self.get_metadata(&token_id);
    metadata.status = Some(TokenStatus::LockedToListen);
    self.put_metadata(&token_id, &metadata);
    let owner = self.get_owner(&token_id);
    self.add_lock(
      env::signer_account_id(),
      TokenStatus::LockedToListen,
      token_id,
      env::block_timestamp().to_string(),
    );
    self.ban_create(owner)
  }

  pub fn ban_create(&mut self, user_id: AccountId) {
    self.is_caller_moderator();
    if !self.mint_locked.contains(&user_id) {
      self.mint_locked.insert(&user_id);
      self.add_ban(
        env::signer_account_id(),
        user_id,
        BanStatus::Ban,
        env::block_timestamp().to_string(),
      );
    }
  }
  pub fn ban_disable(&mut self, user_id: AccountId) {
    self.is_caller_moderator();
    if self.mint_locked.contains(&user_id) {
      self.mint_locked.remove(&user_id);
      self.add_ban(
        env::signer_account_id(),
        user_id,
        BanStatus::Unban,
        env::block_timestamp().to_string(),
      );
    }
  }
  pub fn ban_warning(&mut self, user_id: AccountId) {
    self.is_caller_moderator();
    self.add_ban(
      env::signer_account_id(),
      user_id,
      BanStatus::Warning,
      env::block_timestamp().to_string(),
    );
  }

  #[payable]
  pub fn nft_create(
    &mut self,
    title: String,
    description: String,
    media: String,
    price: String,
    selleble: bool,
  ) -> Token {
    let attached = env::attached_deposit();

    assert!(
      self.royalty.mint_price <= attached,
      "Not enough money attached"
    );
    if self.royalty.mint_price < attached {
      Promise::new(env::predecessor_account_id()).transfer(attached - self.royalty.mint_price);
    }

    assert!(
      media.len() == 46 && &media[0..2] == "Qm",
      "Token id length should be 46 and start from 'Qm'"
    );
    assert!(
      description.len() <= 512,
      "Description length should be less than 512"
    );
    assert!(title.len() <= 64, "Title length should be less than 64");

    let caller: AccountId = env::predecessor_account_id();
    assert!(
      !self.mint_locked.contains(&caller),
      "You was banned from minting"
    );

    let contract: ValidAccountId = env::current_account_id().try_into().unwrap();
    let token_id = media.clone();
    let timestamp = env::block_timestamp().to_string();

    let mut metadata = TokenMetadata {
      title: Some(title),
      description: Some(description),
      media: Some(media),
      media_hash: None,
      copies: None,
      issued_at: Some(timestamp.clone()),
      expires_at: None,
      starts_at: None,
      updated_at: Some(timestamp.clone()),
      extra: None,
      reference: None,
      reference_hash: None,
      status: Some(TokenStatus::Ok),
      selleble: Some(false),
      price: Some(0),
      price_str: None,
      creator: Some(caller.clone()),
    };
    self
      .tokens
      .mint(token_id.clone(), contract.clone(), Some(metadata.clone()));

    self.add_transfer(
      env::signer_account_id(),
      None,
      Some(contract.to_string()),
      token_id.clone(),
      timestamp,
    );

    let promise_idx = env::promise_create(
      contract.to_string(),
      b"nft_transfer",
      json!({
        "token_id": token_id,
        "receiver_id": caller,
      })
      .to_string()
      .as_bytes(),
      self.royalty.min_transfer_fee,
      SINGLE_CALL_GAS,
    );

    if selleble {
      env::promise_then(
        promise_idx,
        contract.to_string(),
        b"nft_update_price",
        json!({
          "token_id": token_id,
          "price": price,
          "selleble": selleble,
        })
        .to_string()
        .as_bytes(),
        self.royalty.min_pricing_fee,
        SINGLE_CALL_GAS,
      );
    }

    if selleble {
      metadata.price_str = Some(price.clone());
      metadata.price = Some(price.parse::<Balance>().expect("Parsing price failed"));
    } else {
      metadata.price_str = Some("0".to_string());
    }

    Token {
      token_id,
      owner_id: caller,
      metadata: Some(metadata),
      approved_account_ids: Some(HashMap::new()),
    }
  }

  #[payable]
  pub fn nft_update_price(&mut self, token_id: TokenId, price: String, selleble: bool) {
    let caller: AccountId = env::predecessor_account_id();
    let attached = env::attached_deposit();
    assert!(
      self.royalty.min_pricing_fee <= attached,
      "Not enough money attached"
    );
    if self.royalty.min_pricing_fee < attached {
      Promise::new(caller).transfer(attached - self.royalty.min_pricing_fee);
    }

    let signer: AccountId = env::signer_account_id();
    assert_eq!(self.get_owner(&token_id), signer, "Unauthorized");

    let mut metadata = self.get_metadata(&token_id);
    let status = metadata.status.clone().unwrap();

    self.is_status_ok(status);

    assert!(
      metadata.selleble.unwrap() == true || selleble == true,
      "Selleble param is false and not changed"
    );

    metadata.selleble = Some(selleble);
    metadata.price = Some(price.parse::<Balance>().expect("Parsing price failed"));
    self.put_metadata(&token_id, &metadata);

    self.add_pricing(
      signer,
      price,
      selleble,
      token_id,
      env::block_timestamp().to_string(),
    );
  }

  #[payable]
  pub fn nft_buy(&mut self, token_id: TokenId) {
    let attached = env::attached_deposit();

    let metadata = self.get_metadata(&token_id);
    let selleble = metadata.selleble.unwrap();
    let price = metadata.price.unwrap();

    let mut my_royalty =
      self.royalty.my_royalty as Balance * price / self.royalty.royalty_full as Balance;
    if my_royalty < self.royalty.min_buy_fee {
      my_royalty = self.royalty.min_buy_fee
    }
    let full_price = my_royalty
      + price * (self.royalty.royalty_full + self.royalty.creator_royalty) as Balance
        / self.royalty.royalty_full as Balance;

    assert!(full_price <= attached, "Not enough money attached");
    if full_price < attached {
      Promise::new(env::predecessor_account_id()).transfer(attached - full_price);
    }

    let status = metadata.status.unwrap();

    self.is_status_ok(status);
    assert!(selleble, "Token is not for sale");

    let caller: AccountId = env::predecessor_account_id();
    let contract = env::current_account_id();
    let creator = metadata.creator.clone().unwrap();

    let old_owner = self.get_owner(&token_id);
    self
      .tokens
      .internal_transfer_unguarded(&token_id, &old_owner, &contract);

    self.add_transfer(
      env::signer_account_id(),
      Some(old_owner.clone()),
      Some(contract.to_string()),
      token_id.clone(),
      env::block_timestamp().to_string(),
    );

    env::promise_create(
      contract,
      b"nft_transfer",
      json!({
        "token_id": token_id,
        "receiver_id": caller,
      })
      .to_string()
      .as_bytes(),
      self.royalty.min_transfer_fee,
      SINGLE_CALL_GAS,
    );

    if creator.clone() == old_owner {
      Promise::new(creator).transfer(
        price * (self.royalty.royalty_full + self.royalty.creator_royalty) as Balance
          / self.royalty.royalty_full as Balance,
      );
    } else {
      Promise::new(creator).transfer(
        price * self.royalty.creator_royalty as Balance / self.royalty.royalty_full as Balance,
      );
      Promise::new(old_owner).transfer(price);
    }
  }

  #[payable]
  pub fn nft_transfer(
    &mut self,
    receiver_id: ValidAccountId,
    token_id: TokenId,
    approval_id: Option<u64>,
    memo: Option<String>,
  ) {
    let attached = env::attached_deposit();

    assert!(
      self.royalty.min_transfer_fee <= attached,
      "Not enough money attached"
    );
    if self.royalty.min_transfer_fee < attached {
      Promise::new(env::predecessor_account_id())
        .transfer(attached - self.royalty.min_transfer_fee);
    }

    let old_owner = self.get_owner(&token_id).to_string();
    let mut metadata = self.get_metadata(&token_id);
    let status = metadata.status.clone().unwrap();

    self.is_status_ok(status);

    self
      .tokens
      .nft_transfer(receiver_id.clone(), token_id.clone(), approval_id, memo);

    let timestamp = env::block_timestamp().to_string();
    metadata.selleble = Some(false);
    metadata.updated_at = Some(timestamp.clone());
    self.put_metadata(&token_id, &metadata);

    self.add_transfer(
      env::signer_account_id(),
      Some(old_owner),
      Some(receiver_id.to_string()),
      token_id.clone(),
      timestamp,
    );
  }

  #[payable]
  pub fn nft_transfer_call(
    &mut self,
    receiver_id: ValidAccountId,
    token_id: TokenId,
    approval_id: Option<u64>,
    memo: Option<String>,
    msg: String,
  ) -> PromiseOrValue<bool> {
    let attached = env::attached_deposit();

    assert!(
      self.royalty.min_transfer_fee <= attached,
      "Not enough money attached"
    );
    if self.royalty.min_transfer_fee < attached {
      Promise::new(env::predecessor_account_id())
        .transfer(attached - self.royalty.min_transfer_fee);
    }

    let old_owner = self.get_owner(&token_id).to_string();
    let mut metadata = self.get_metadata(&token_id);
    let status = metadata.status.clone().unwrap();

    self.is_status_ok(status);

    let res = self.tokens.nft_transfer_call(
      receiver_id.clone(),
      token_id.clone(),
      approval_id,
      memo,
      msg,
    );

    let timestamp = env::block_timestamp().to_string();
    metadata.selleble = Some(false);
    metadata.updated_at = Some(timestamp.clone());
    self.put_metadata(&token_id, &metadata);

    self.add_transfer(
      env::signer_account_id(),
      Some(old_owner),
      Some(receiver_id.to_string()),
      token_id.clone(),
      timestamp,
    );

    res
  }

  pub fn nft_token(self, token_id: TokenId) -> Option<Token> {
    self.tokens.nft_token(token_id)
  }

  #[payable]
  pub fn mint(
    &mut self,
    token_id: TokenId,
    token_owner_id: ValidAccountId,
    token_metadata: Option<TokenMetadata>,
  ) -> Token {
    let caller: AccountId = env::predecessor_account_id();
    let meta = token_metadata.unwrap();
    let media = meta.media.unwrap();

    assert_eq!(
      token_owner_id.to_string(),
      caller,
      "Unsupported to create nft for other user",
    );
    assert_eq!(token_id, media.clone(), "Wrong token id for this meta");

    self.nft_create(
      meta.title.unwrap(),
      meta.description.unwrap(),
      media,
      meta.price.unwrap().to_string(),
      meta.selleble.unwrap(),
    )
  }

  pub fn nft_burn(&mut self, token_id: TokenId) {
    let owner_id = self.get_owner(&token_id);
    let caller: AccountId = env::predecessor_account_id();
    assert_eq!(
      owner_id.clone(),
      caller,
      "You can't burn tokens, you don't own"
    );

    self.tokens.owner_by_id.remove(&token_id);
    self
      .tokens
      .token_metadata_by_id
      .as_mut()
      .and_then(|by_id| by_id.remove(&token_id));

    if let Some(tokens_per_owner) = &mut self.tokens.tokens_per_owner {
      let mut token_ids = tokens_per_owner.get(&owner_id).unwrap();
      token_ids.remove(&token_id);
      tokens_per_owner.insert(&owner_id, &token_ids);
    }

    self.add_transfer(
      env::signer_account_id(),
      Some(owner_id),
      None,
      token_id.clone(),
      env::block_timestamp().to_string(),
    );
  }

  #[private]
  pub fn nft_resolve_transfer(
    &mut self,
    previous_owner_id: AccountId,
    receiver_id: AccountId,
    token_id: TokenId,
    approved_account_ids: Option<HashMap<AccountId, u64>>,
  ) -> bool {
    self.tokens.nft_resolve_transfer(
      previous_owner_id,
      receiver_id,
      token_id,
      approved_account_ids,
    )
  }

  pub fn nft_metadata(&self) -> NFTContractMetadata {
    self.metadata.get().unwrap()
  }

  pub fn nft_supply_for_owner(self, account_id: ValidAccountId) -> U128 {
    self.tokens.nft_supply_for_owner(account_id)
  }

  pub fn nft_tokens_for_owner(
    &self,
    account_id: ValidAccountId,
    from_index: Option<U128>,
    limit: Option<u64>,
  ) -> Vec<Token> {
    self
      .tokens
      .nft_tokens_for_owner(account_id, from_index, limit)
  }
}
