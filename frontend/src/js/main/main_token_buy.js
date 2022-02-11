const close_buy_popup_without_hash = () => {
  popup_open = false
  document.body.style.overflow = "overlay"
  popup_window.classList.remove("popup_slidein")
  popup_window.classList.add("popup_slideout")
  back_fill_popup.classList.remove("darkin")
  back_fill_popup.classList.add("darkout")
  back_fill_popup.style.visibility = "hidden"
}

const buy_token_open = (data, st) => {
  token_buy_button.classList.add("button_active")
  setTimeout(() => token_buy_button.classList.remove("button_active"), 200)

  popup_open = true

  const price_by_million = parseInt(data.price.slice(0, data.price.length - 18))
  const min_buy_fee_by_million = parseInt(royalty.min_buy_fee.slice(0, royalty.min_buy_fee.length - 18))

  let my_royalty_by_million = (price_by_million * royalty.my_royalty) / royalty.royalty_full
  if (my_royalty_by_million < min_buy_fee_by_million) my_royalty_by_million = min_buy_fee_by_million
  const price = ((price_by_million * (royalty.royalty_full + royalty.creator_royalty)) / royalty.royalty_full + my_royalty_by_million) / 1000000

  popup_upbar_purchase.style.display = "none"
  popup_upbar_success_purchase.style.display = "none"
  popup_upbar_report.style.display = "none"
  popup_info_purchase.style.display = "none"
  popup_info_success_purchase.style.display = "none"
  popup_error_purchase.style.display = "none"
  popup_info_report_speech.style.display = "none"
  popup_info_report_offence.style.display = "none"
  popup_report_button.style.display = "none"

  popup_buy_button.style.display = "block"

  if (st == true) {
    popup_upbar_success_purchase.style.display = "block"
    popup_info_success_purchase.style.display = "block"
    popup_buy_button.innerHTML = `Continue shopping`
    popup_buy_button.onclick = () => go_back(`tok_${location.hash.slice(5)}`)
  } else {
    popup_upbar_purchase.style.display = "block"
    popup_info_purchase.style.display = "block"
    popup_buy_button.innerHTML = `Confirm purchase <span class="price_value_wrap">${price} NEAR</span>`
    popup_buy_button.onclick = () => send_buy_request(data)
  }
  if (st == false) {
    popup_error_purchase.style.display = "block"
  }

  popup_window.classList.remove("popup_slideout")
  popup_window.classList.add("popup_slidein")
  back_fill_popup.style.visibility = "visible"
  back_fill_popup.classList.remove("darkout")
  back_fill_popup.classList.add("darkin")
}

const buy_token_open_by_id = (id, st) => {
  fetch(`${server}/token/${id}`)
    .then(response => response.json())
    .then(data => {
      if (data != null) buy_token_open(data, st)
      else location.hash = "#"
    })
}

const send_buy_request = data => {
  popup_buy_button.classList.add("button_active")
  setTimeout(() => popup_buy_button.classList.remove("button_active"), 200)

  let my_royalty = (BigInt(data.price) * BigInt(royalty.my_royalty)) / BigInt(royalty.royalty_full)
  if (my_royalty < BigInt(royalty.min_buy_fee)) my_royalty = BigInt(royalty.min_buy_fee)

  contract.nft_buy(
    { token_id: data.token_id },
    200000000000000,
    ((BigInt(data.price) * BigInt(royalty.royalty_full + royalty.creator_royalty)) / BigInt(royalty.royalty_full) + my_royalty).toString()
  )
}

const token_buy_event_hash = () => {
  if (location.hash.slice(0, 5) == "#buy_") {
    if (location.hash.slice(5, 9) == "scs_") buy_token_open_by_id(location.hash.slice(9), true)
    else if (location.hash.slice(5, 9) == "err_") buy_token_open_by_id(location.hash.slice(9), false)
    else buy_token_open_by_id(location.hash.slice(5), null)
  }
  if (location.hash.slice(0, 5) != "#rvs_" && location.hash.slice(0, 5) != "#roc_" && location.hash.slice(0, 5) != "#buy_") {
    close_buy_popup_without_hash()
  }
}
const token_buy_event_click = () => go_back(`tok_${location.hash.slice(5)}`)

const init_token_buy_events = () => {
  back_fill_popup.addEventListener("click", token_buy_event_click)
  window.addEventListener("hashchange", token_buy_event_hash)
}
const dest_token_buy_events = () => {
  back_fill_popup.removeEventListener("click", token_buy_event_click)
  window.removeEventListener("hashchange", token_buy_event_hash)
}

const init_token_buy = () => {
  if (location.hash.slice(0, 5) == "#buy_") {
    if (location.hash.slice(5, 9) == "scs_") buy_token_open_by_id(location.hash.slice(9), true)
    else if (location.hash.slice(5, 9) == "err_") buy_token_open_by_id(location.hash.slice(9), false)
    else buy_token_open_by_id(location.hash.slice(5), null)
  }
  init_token_buy_events()
}
const dest_token_buy = () => {
  close_buy_popup_without_hash()
  dest_token_buy_events()
}
