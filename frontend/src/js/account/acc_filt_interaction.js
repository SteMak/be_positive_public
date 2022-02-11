const acc_filt_by_owned = () => {
  acc_filt_owned.classList.add("choice_active")
  acc_filt_locked.classList.remove("choice_active")
  acc_filt_created.classList.remove("choice_active")
  cards_filt = { owner: account_near, creator: "", bad_status: "false", set: "own" }
}
const acc_filt_by_locked = () => {
  acc_filt_owned.classList.remove("choice_active")
  acc_filt_locked.classList.add("choice_active")
  acc_filt_created.classList.remove("choice_active")
  cards_filt = { owner: account_near, creator: "", bad_status: "true", set: "lok" }
}
const acc_filt_by_created = () => {
  acc_filt_owned.classList.remove("choice_active")
  acc_filt_locked.classList.remove("choice_active")
  acc_filt_created.classList.add("choice_active")
  cards_filt = { owner: "", creator: account_near, bad_status: "false", set: "crt" }
}

const acc_filt_interaction_event_own = () => go_ford("own_" + (location.hash.slice(5, 9) || "new"))
const acc_filt_interaction_event_lok = () => go_ford("lok_" + (location.hash.slice(5, 9) || "new"))
const acc_filt_interaction_event_crt = () => go_ford("crt_" + (location.hash.slice(5, 9) || "new"))
const acc_filt_interaction_event_hash = () => {
  if (location.hash.slice(0, 5) == "#own_" && cards_filt.set != "own") {
    acc_filt_by_owned()
    document.dispatchEvent(new Event("searchchanged"))
  }
  if (location.hash.slice(0, 5) == "#lok_" && cards_filt.set != "lok") {
    acc_filt_by_locked()
    document.dispatchEvent(new Event("searchchanged"))
  }
  if (location.hash.slice(0, 5) == "#crt_" && cards_filt.set != "crt") {
    acc_filt_by_created()
    document.dispatchEvent(new Event("searchchanged"))
  }
}

const init_acc_filt_interaction_events = () => {
  window.addEventListener("hashchange", acc_filt_interaction_event_hash)
  acc_filt_owned.addEventListener("click", acc_filt_interaction_event_own)
  acc_filt_locked.addEventListener("click", acc_filt_interaction_event_lok)
  acc_filt_created.addEventListener("click", acc_filt_interaction_event_crt)
}

const desc_acc_filt_interaction_events = () => {
  window.removeEventListener("hashchange", acc_filt_interaction_event_hash)
  acc_filt_owned.removeEventListener("click", acc_filt_interaction_event_own)
  acc_filt_locked.removeEventListener("click", acc_filt_interaction_event_lok)
  acc_filt_created.removeEventListener("click", acc_filt_interaction_event_crt)
}

const init_acc_filt_interaction = () => {
  if (location.hash.slice(0, 5) == "#own_") {
    acc_filt_by_owned()
  } else if (location.hash.slice(0, 5) == "#lok_") {
    acc_filt_by_locked()
  } else if (location.hash.slice(0, 5) == "#crt_") {
    acc_filt_by_created()
  } else {
    acc_filt_by_owned()
  }
  init_acc_filt_interaction_events()
}
const dest_acc_filt_interaction = () => {
  desc_acc_filt_interaction_events()
}
