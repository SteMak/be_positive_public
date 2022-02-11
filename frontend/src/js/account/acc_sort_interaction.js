const acc_sort_by_newest = () => {
  acc_sort_newest.classList.add("choice_active")
  acc_sort_richest.classList.remove("choice_active")
  acc_sort_cheapest.classList.remove("choice_active")
  cards_sort = { order: "created_at", direction: "DESC", selleble: "false", set: "new" }
}
const acc_sort_by_richest = () => {
  acc_sort_newest.classList.remove("choice_active")
  acc_sort_richest.classList.add("choice_active")
  acc_sort_cheapest.classList.remove("choice_active")
  cards_sort = { order: "price", direction: "DESC", selleble: "true", set: "rch" }
}
const acc_sort_by_cheapest = () => {
  acc_sort_newest.classList.remove("choice_active")
  acc_sort_richest.classList.remove("choice_active")
  acc_sort_cheapest.classList.add("choice_active")
  cards_sort = { order: "price", direction: "ASC", selleble: "true", set: "chp" }
}

const acc_sort_interaction_event_new = () => go_ford((location.hash.slice(0, 5) || "own_") + "new")
const acc_sort_interaction_event_rch = () => go_ford((location.hash.slice(0, 5) || "own_") + "rch")
const acc_sort_interaction_event_chp = () => go_ford((location.hash.slice(0, 5) || "own_") + "chp")
const acc_sort_interaction_event_hash = () => {
  if (location.hash.slice(5, 9) == "new" && cards_sort.set != "new") {
    acc_sort_by_newest()
    document.dispatchEvent(new Event("searchchanged"))
  }
  if (location.hash.slice(5, 9) == "rch" && cards_sort.set != "rch") {
    acc_sort_by_richest()
    document.dispatchEvent(new Event("searchchanged"))
  }
  if (location.hash.slice(5, 9) == "chp" && cards_sort.set != "chp") {
    acc_sort_by_cheapest()
    document.dispatchEvent(new Event("searchchanged"))
  }
}

const init_acc_sort_interaction_events = () => {
  window.addEventListener("hashchange", acc_sort_interaction_event_hash)
  acc_sort_newest.addEventListener("click", acc_sort_interaction_event_new)
  acc_sort_richest.addEventListener("click", acc_sort_interaction_event_rch)
  acc_sort_cheapest.addEventListener("click", acc_sort_interaction_event_chp)
}

const desc_acc_sort_interaction_events = () => {
  window.removeEventListener("hashchange", acc_sort_interaction_event_hash)
  acc_sort_newest.removeEventListener("click", acc_sort_interaction_event_new)
  acc_sort_richest.removeEventListener("click", acc_sort_interaction_event_rch)
  acc_sort_cheapest.removeEventListener("click", acc_sort_interaction_event_chp)
}

const init_acc_sort_interaction = () => {
  if (location.hash.slice(5, 9) == "new") {
    acc_sort_by_newest()
  } else if (location.hash.slice(5, 9) == "rch") {
    acc_sort_by_richest()
  } else if (location.hash.slice(5, 9) == "chp") {
    acc_sort_by_cheapest()
  } else {
    acc_sort_by_newest()
  }
  init_acc_sort_interaction_events()
}
const dest_acc_sort_interaction = () => {
  desc_acc_sort_interaction_events()
}
