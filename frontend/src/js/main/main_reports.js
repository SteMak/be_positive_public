const close_popup_without_hash = () => {
  popup_open = false
  document.body.style.overflow = "overlay"
  popup_window.classList.remove("popup_slidein")
  popup_window.classList.add("popup_slideout")
  back_fill_popup.classList.remove("darkin")
  back_fill_popup.classList.add("darkout")
  back_fill_popup.style.visibility = "hidden"
}

const rvs_token_open = id => {
  token_report_speech_button.classList.add("button_active")
  setTimeout(() => token_report_speech_button.classList.remove("button_active"), 200)

  popup_open = true

  popup_upbar_purchase.style.display = "none"
  popup_upbar_success_purchase.style.display = "none"
  popup_info_purchase.style.display = "none"
  popup_info_success_purchase.style.display = "none"
  popup_error_purchase.style.display = "none"
  popup_info_report_offence.style.display = "none"
  popup_buy_button.style.display = "none"

  popup_upbar_report.style.display = "block"
  popup_info_report_speech.style.display = "block"
  popup_report_button.style.display = "block"

  popup_report_button.onclick = () => send_rvs_request(id)

  popup_window.classList.remove("popup_slideout")
  popup_window.classList.add("popup_slidein")
  back_fill_popup.style.visibility = "visible"
  back_fill_popup.classList.remove("darkout")
  back_fill_popup.classList.add("darkin")
}
const roc_token_open = id => {
  token_report_offence_button.classList.add("button_active")
  setTimeout(() => token_report_offence_button.classList.remove("button_active"), 200)

  popup_open = true

  popup_upbar_purchase.style.display = "none"
  popup_upbar_success_purchase.style.display = "none"
  popup_info_purchase.style.display = "none"
  popup_info_success_purchase.style.display = "none"
  popup_error_purchase.style.display = "none"
  popup_info_report_speech.style.display = "none"
  popup_buy_button.style.display = "none"

  popup_upbar_report.style.display = "block"
  popup_info_report_offence.style.display = "block"
  popup_report_button.style.display = "block"

  popup_report_button.onclick = () => send_roc_request(id)

  popup_window.classList.remove("popup_slideout")
  popup_window.classList.add("popup_slidein")
  back_fill_popup.style.visibility = "visible"
  back_fill_popup.classList.remove("darkout")
  back_fill_popup.classList.add("darkin")
}

const send_rvs_request = id => {
  popup_report_button.classList.add("button_active")
  setTimeout(() => popup_report_button.classList.remove("button_active"), 200)

  sign_data(id).then(pack =>
    fetch(`${server}/report_speech/${account_near}/${id}`, {
      method: "POST",
      body: JSON.stringify(pack),
    })
  )

  tokens[id].reports_speech += account_near + " "

  go_back(`tok_${location.hash.slice(5)}`)

  token_report_speech_button.innerHTML = "Report on voice-spam sent"
  token_report_speech_button.classList.add("button_disabled")
  token_report_speech_button.onclick = () => {}
}

const send_roc_request = id => {
  popup_report_button.classList.add("button_active")
  setTimeout(() => popup_report_button.classList.remove("button_active"), 200)

  sign_data(id).then(pack =>
    fetch(`${server}/report_offence/${account_near}/${id}`, {
      method: "POST",
      body: JSON.stringify(pack),
    })
  )

  tokens[id].reports_offence += account_near + " "

  go_back(`tok_${location.hash.slice(5)}`)

  token_report_offence_button.innerHTML = "Report on offensive content sent"
  token_report_offence_button.classList.add("button_disabled")
  token_report_offence_button.onclick = () => {}
}

const reports_event_hash = () => {
  if (location.hash.slice(0, 5) == "#rvs_") {
    rvs_token_open(location.hash.slice(5))
  }
  if (location.hash.slice(0, 5) == "#roc_") {
    roc_token_open(location.hash.slice(5))
  }
  if (location.hash.slice(0, 5) != "#rvs_" && location.hash.slice(0, 5) != "#roc_" && location.hash.slice(0, 5) != "#buy_") {
    close_popup_without_hash()
  }
}
// const reports_event_click = () => go_back(`tok_${location.hash.slice(5)}`)

const init_reports_events = () => {
  // back_fill_popup.addEventListener("click", reports_event_click)
  window.addEventListener("hashchange", reports_event_hash)
}
const dest_reports_events = () => {
  // back_fill_popup.removeEventListener("click", reports_event_click)
  window.removeEventListener("hashchange", reports_event_hash)
}

const init_reports = () => {
  if (location.hash.slice(0, 5) == "#rvs_") {
    rvs_token_open(location.hash.slice(5))
  }
  if (location.hash.slice(0, 5) == "#roc_") {
    roc_token_open(location.hash.slice(5))
  }
  init_reports_events()
}
const dest_reports = () => {
  close_popup_without_hash()
  dest_reports_events()
}
