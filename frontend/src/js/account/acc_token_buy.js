const acc_close_buy_popup_without_hash = () => {
  popup_open = false
  document.body.style.overflow = "overlay"
  acc_popup_window.classList.remove("popup_slidein")
  acc_popup_window.classList.add("popup_slideout")
  acc_back_fill_popup.classList.remove("darkin")
  acc_back_fill_popup.classList.add("darkout")
  acc_back_fill_popup.style.visibility = "hidden"
}

const acc_buy_token_open = (data, st) => {
  acc_token_buy_button.classList.add("button_active")
  setTimeout(() => acc_token_buy_button.classList.remove("button_active"), 200)

  popup_open = true

  const price_by_million = parseInt(data.price.slice(0, data.price.length - 18))
  const min_buy_fee_by_million = parseInt(royalty.min_buy_fee.slice(0, royalty.min_buy_fee.length - 18))

  let my_royalty_by_million = (price_by_million * royalty.my_royalty) / royalty.royalty_full
  if (my_royalty_by_million < min_buy_fee_by_million) my_royalty_by_million = min_buy_fee_by_million
  const price = ((price_by_million * (royalty.royalty_full + royalty.creator_royalty)) / royalty.royalty_full + my_royalty_by_million) / 1000000

  acc_popup_upbar_purchase.style.display = "none"
  acc_popup_upbar_success_purchase.style.display = "none"
  acc_popup_upbar_success_burn.style.display = "none"
  acc_popup_upbar_burn.style.display = "none"
  acc_popup_upbar_update.style.display = "none"
  acc_popup_upbar_success_update.style.display = "none"
  acc_popup_info_purchase.style.display = "none"
  acc_popup_info_success_purchase.style.display = "none"
  acc_popup_info_success_burn.style.display = "none"
  acc_popup_info_success_update.style.display = "none"
  acc_popup_error_purchase.style.display = "none"
  acc_popup_error_burn.style.display = "none"
  acc_popup_info_burn.style.display = "none"
  acc_popup_info_burn_load.style.display = "none"
  acc_popup_info_update.style.display = "none"
  acc_popup_error_update.style.display = "none"
  acc_popup_burn_button.style.display = "none"
  acc_popup_update_button.style.display = "none"

  acc_popup_buy_button.style.display = "block"

  if (st == true) {
    acc_popup_upbar_success_purchase.style.display = "block"
    acc_popup_info_success_purchase.style.display = "block"
    acc_popup_buy_button.innerHTML = `Continue shopping`
    acc_popup_buy_button.onclick = () => go_back(`tok_crt_${location.hash.slice(5)}`)
  } else {
    acc_popup_upbar_purchase.style.display = "block"
    acc_popup_info_purchase.style.display = "block"
    acc_popup_buy_button.innerHTML = `Confirm purchase <span class="price_value_wrap">${price} NEAR</span>`
    acc_popup_buy_button.onclick = () => acc_send_buy_request(data)
  }
  if (st == false) {
    acc_popup_error_purchase.style.display = "block"
  }

  document.body.style.overflow = "hidden"
  acc_popup_window.classList.remove("popup_slideout")
  acc_popup_window.classList.add("popup_slidein")
  acc_back_fill_popup.style.visibility = "visible"
  acc_back_fill_popup.classList.remove("darkout")
  acc_back_fill_popup.classList.add("darkin")
}

const acc_buy_token_open_by_id = (id, st) => {
  fetch(`${server}/token/${id}`)
    .then(response => response.json())
    .then(data => {
      if (data != null) acc_buy_token_open(data, st)
      else location.hash = "#"
    })
}

const acc_send_buy_request = data => {
  acc_popup_buy_button.classList.add("button_active")
  setTimeout(() => acc_popup_buy_button.classList.remove("button_active"), 200)

  let my_royalty = (BigInt(data.price) * BigInt(royalty.my_royalty)) / BigInt(royalty.royalty_full)
  if (my_royalty < BigInt(royalty.min_buy_fee)) my_royalty = BigInt(royalty.min_buy_fee)

  contract.nft_buy(
    { token_id: data.token_id },
    200000000000000,
    ((BigInt(data.price) * BigInt(royalty.royalty_full + royalty.creator_royalty)) / BigInt(royalty.royalty_full) + my_royalty).toString()
  )
}

const acc_token_buy_event_hash = () => {
  if (location.hash.slice(0, 5) == "#buy_") {
    if (location.hash.slice(5, 9) == "scs_") acc_buy_token_open_by_id(location.hash.slice(9), true)
    else if (location.hash.slice(5, 9) == "err_") acc_buy_token_open_by_id(location.hash.slice(9), false)
    else acc_buy_token_open_by_id(location.hash.slice(5), null)
  }
  if (location.hash.slice(0, 5) != "#brn_" && location.hash.slice(0, 5) != "#upd_" && location.hash.slice(0, 5) != "#buy_") {
    acc_close_buy_popup_without_hash()
  }
}
const acc_token_buy_event_click = () => go_back(`tok_crt_${location.hash.slice(5)}`)

const init_acc_token_buy_events = () => {
  acc_back_fill_popup.addEventListener("click", acc_token_buy_event_click)
  window.addEventListener("hashchange", acc_token_buy_event_hash)
}
const dest_acc_token_buy_events = () => {
  acc_back_fill_popup.removeEventListener("click", acc_token_buy_event_click)
  window.removeEventListener("hashchange", acc_token_buy_event_hash)
}

const init_acc_token_buy = () => {
  if (location.hash.slice(0, 5) == "#buy_") {
    if (location.hash.slice(5, 9) == "scs_") acc_buy_token_open_by_id(location.hash.slice(9), true)
    else if (location.hash.slice(5, 9) == "err_") acc_buy_token_open_by_id(location.hash.slice(9), false)
    else acc_buy_token_open_by_id(location.hash.slice(5), null)
  }
  init_acc_token_buy_events()
}
const dest_acc_token_buy = () => {
  acc_close_buy_popup_without_hash()
  dest_acc_token_buy_events()
}
