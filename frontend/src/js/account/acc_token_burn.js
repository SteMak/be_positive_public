const acc_close_burn_popup_without_hash = () => {
  popup_open = false
  document.body.style.overflow = "overlay"
  acc_popup_window.classList.remove("popup_slidein")
  acc_popup_window.classList.add("popup_slideout")
  acc_back_fill_popup.classList.remove("darkin")
  acc_back_fill_popup.classList.add("darkout")
  acc_back_fill_popup.style.visibility = "hidden"
}

const acc_burn_token_open = () => {
  acc_token_burn_button.classList.add("button_active")
  setTimeout(() => acc_token_burn_button.classList.remove("button_active"), 200)

  popup_open = true

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
  acc_popup_buy_button.style.display = "none"
  acc_popup_update_button.style.display = "none"
  acc_popup_info_burn_input.value = ""

  acc_popup_burn_button.style.display = "block"

  acc_popup_upbar_burn.style.display = "block"
  acc_popup_info_burn.style.display = "block"
  acc_popup_burn_button.classList.add("button_disabled")
  acc_popup_burn_button.innerHTML = "Confirm burning"
  acc_popup_burn_button.onclick = () => {}

  document.body.style.overflow = "hidden"
  acc_popup_window.classList.remove("popup_slideout")
  acc_popup_window.classList.add("popup_slidein")
  acc_back_fill_popup.style.visibility = "visible"
  acc_back_fill_popup.classList.remove("darkout")
  acc_back_fill_popup.classList.add("darkin")
}

const acc_send_burn_request = async id => {
  acc_popup_burn_button.classList.add("button_active")
  setTimeout(() => acc_popup_burn_button.classList.remove("button_active"), 200)

  await contract.nft_burn({ token_id: id }, 200000000000000)
  await fetch(`${server}/nft_remove/${id}`)
}

const acc_popup_burn_button_click = () => {
  acc_popup_burn_button.classList.add("button_disabled")
  acc_popup_info_burn.style.display = "none"
  acc_popup_info_burn_load.style.display = "block"
  acc_popup_error_burn.style.display = "none"

  acc_send_burn_request(location.hash.slice(5))
    .then(() => {
      acc_popup_upbar_burn.style.display = "none"
      acc_popup_info_burn_load.style.display = "none"
      acc_popup_error_burn.style.display = "none"
      acc_popup_upbar_success_burn.style.display = "block"
      acc_popup_info_success_burn.style.display = "block"
      acc_popup_burn_button.classList.remove("button_disabled")
      acc_popup_burn_button.innerHTML = "Continue shopping"
      acc_popup_burn_button.onclick = () => go_back(`tok_crt_${location.hash.slice(5)}`)
    })
    .catch(err => {
      acc_popup_burn_button.classList.remove("button_disabled")
      acc_popup_info_burn.style.display = "block"
      acc_popup_info_burn_load.style.display = "none"
      acc_popup_error_burn.style.display = "block"
      acc_popup_error_burn.innerHTML = `Error happened${
        err.kind &&
        err.kind.ExecutionError &&
        err.kind.ExecutionError &&
        err.kind.ExecutionError.split("Smart contract panicked").length > 1 &&
        err.kind.ExecutionError.split("'").length == 3
          ? `: "${err.kind.ExecutionError.split("'")[1]}"`
          : ", please try again"
      }`
    })
}
const acc_token_burn_event_input = () => {
  if (acc_popup_info_burn_input.value == "Just BURN it") {
    acc_popup_burn_button.classList.remove("button_disabled")
    acc_popup_burn_button.onclick = acc_popup_burn_button_click
  } else {
    acc_popup_burn_button.classList.add("button_disabled")
    acc_popup_burn_button.onclick = () => {}
  }
}

const acc_token_burn_event_hash = () => {
  if (location.hash.slice(0, 5) == "#brn_") {
    if (location.hash.slice(5, 9) == "scs_") acc_burn_token_open(location.hash.slice(9), true)
    else if (location.hash.slice(5, 9) == "err_") acc_burn_token_open(location.hash.slice(9), false)
    else acc_burn_token_open(location.hash.slice(5), null)
  }
  if (location.hash.slice(0, 5) != "#brn_" && location.hash.slice(0, 5) != "#upd_" && location.hash.slice(0, 5) != "#buy_") {
    acc_close_burn_popup_without_hash()
  }
}
// const acc_token_burn_event_click = () => go_back(`tok_crt_${location.hash.slice(5)}`)

const init_acc_token_burn_events = () => {
  // acc_back_fill_popup.addEventListener("click", acc_token_burn_event_click)
  window.addEventListener("hashchange", acc_token_burn_event_hash)
  acc_popup_info_burn_input.addEventListener("input", acc_token_burn_event_input)
}
const dest_acc_token_burn_events = () => {
  // acc_back_fill_popup.removeEventListener("click", acc_token_burn_event_click)
  window.removeEventListener("hashchange", acc_token_burn_event_hash)
  acc_popup_info_burn_input.removeEventListener("change", acc_token_burn_event_input)
}

const init_acc_token_burn = () => {
  if (location.hash.slice(0, 5) == "#brn_") {
    acc_burn_token_open(location.hash.slice(5))
  }
  init_acc_token_burn_events()
}
const dest_acc_token_burn = () => {
  acc_close_burn_popup_without_hash()
  dest_acc_token_burn_events()
}
