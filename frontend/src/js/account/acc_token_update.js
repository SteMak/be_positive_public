const acc_close_update_popup_without_hash = () => {
  popup_open = false
  document.body.style.overflow = "overlay"
  acc_popup_window.classList.remove("popup_slidein")
  acc_popup_window.classList.add("popup_slideout")
  acc_back_fill_popup.classList.remove("darkin")
  acc_back_fill_popup.classList.add("darkout")
  acc_back_fill_popup.style.visibility = "hidden"
}

const acc_update_token_open = (id, st) => {
  acc_token_buy_button.classList.add("button_active")
  setTimeout(() => acc_token_buy_button.classList.remove("button_active"), 200)

  popup_open = true

  popup_author_fee.innerHTML = (royalty.creator_royalty * 100) / royalty.royalty_full
  popup_contract_fee.innerHTML = (royalty.my_royalty * 100) / royalty.royalty_full
  popup_contract_min_fee.innerHTML = royalty.min_buy_fee.slice(0, royalty.min_buy_fee.length - 18) / 1000000
  popup_contract_author_fee.innerHTML = ((royalty.creator_royalty + royalty.my_royalty) * 100) / royalty.royalty_full

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
  acc_popup_buy_button.style.display = "none"

  acc_popup_update_button.style.display = "block"

  if (st == true) {
    acc_popup_upbar_success_update.style.display = "block"
    acc_popup_info_success_update.style.display = "block"
    acc_popup_update_button.innerHTML = `Continue shopping`
    acc_popup_update_button.onclick = () => go_back(`tok_crt_${location.hash.slice(5)}`)
  } else {
    acc_popup_upbar_update.style.display = "block"
    acc_popup_info_update.style.display = "block"
    acc_popup_update_button.innerHTML = `Confirm update <span class="price_value_wrap">${
      parseInt(royalty.min_pricing_fee.slice(0, royalty.min_pricing_fee.length - 18)) / 1000000
    } NEAR</span>`
    acc_popup_update_button.onclick = () => acc_send_update_request(id)
  }
  if (st == false) {
    acc_popup_error_update.style.display = "block"
  }

  document.body.style.overflow = "hidden"
  acc_popup_window.classList.remove("popup_slideout")
  acc_popup_window.classList.add("popup_slidein")
  acc_back_fill_popup.style.visibility = "visible"
  acc_back_fill_popup.classList.remove("darkout")
  acc_back_fill_popup.classList.add("darkin")
}

const acc_send_update_request = id => {
  acc_popup_update_button.classList.add("button_active")
  setTimeout(() => acc_popup_update_button.classList.remove("button_active"), 200)

  const ch = acc_popup_info_update_input_selleble.checked
  const pr = (ch && acc_popup_info_update_input_price.value > 0 ? acc_popup_info_update_input_price.value : "").split(".")
  pr[1] = pr[1] ? pr[1].slice(0, 24) : ""
  const price = pr.join("") + "".padEnd(24 - pr[1].length, "0")
  contract.nft_update_price({ token_id: id, selleble: ch, price }, 200000000000000, royalty.min_pricing_fee)
}

const acc_token_update_event_hash = () => {
  if (location.hash.slice(0, 5) == "#upd_") {
    if (location.hash.slice(5, 9) == "scs_") acc_update_token_open(location.hash.slice(9), true)
    else if (location.hash.slice(5, 9) == "err_") acc_update_token_open(location.hash.slice(9), false)
    else acc_update_token_open(location.hash.slice(5), null)
  }
  if (location.hash.slice(0, 5) != "#brn_" && location.hash.slice(0, 5) != "#upd_" && location.hash.slice(0, 5) != "#buy_") {
    acc_close_buy_popup_without_hash()
  }
}
const acc_token_update_event_selleble = () => {
  if (acc_popup_info_update_input_selleble.checked) {
    acc_popup_info_row_container_selleble.classList.remove("popup_info_row_container_disabled")
  } else {
    acc_popup_info_row_container_selleble.classList.add("popup_info_row_container_disabled")
  }
}
// const acc_token_update_event_click = () => go_back(`tok_crt_${location.hash.slice(5)}`)

const init_acc_token_update_events = () => {
  // acc_back_fill_popup.addEventListener("click", acc_token_update_event_click)
  window.addEventListener("hashchange", acc_token_update_event_hash)
  acc_popup_info_update_input_selleble.addEventListener("change", acc_token_update_event_selleble)
}
const dest_acc_token_update_events = () => {
  // acc_back_fill_popup.removeEventListener("click", acc_token_update_event_click)
  window.removeEventListener("hashchange", acc_token_update_event_hash)
}

const init_acc_token_update = () => {
  if (location.hash.slice(0, 5) == "#upd_") {
    if (location.hash.slice(5, 9) == "scs_") acc_update_token_open(location.hash.slice(9), true)
    else if (location.hash.slice(5, 9) == "err_") acc_update_token_open(location.hash.slice(9), false)
    else acc_update_token_open(location.hash.slice(5), null)
  }
  init_acc_token_update_events()
}
const dest_acc_token_update = () => {
  acc_close_update_popup_without_hash()
  dest_acc_token_update_events()
}
