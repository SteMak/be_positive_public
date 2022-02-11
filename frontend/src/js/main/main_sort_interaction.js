const sort_by_newest = () => {
  sort_newest.classList.add("choice_active")
  sort_popular.classList.remove("choice_active")
  sort_cheapest.classList.remove("choice_active")
  cards_sort = { order: "created_at", direction: "DESC", selleble: "false", set: "new" }
}
const sort_by_popular = () => {
  sort_newest.classList.remove("choice_active")
  sort_popular.classList.add("choice_active")
  sort_cheapest.classList.remove("choice_active")
  cards_sort = { order: "updated_at", direction: "DESC", selleble: "false", set: "pop" }
}
const sort_by_cheapest = () => {
  sort_newest.classList.remove("choice_active")
  sort_popular.classList.remove("choice_active")
  sort_cheapest.classList.add("choice_active")
  cards_sort = { order: "price", direction: "ASC", selleble: "true", set: "chp" }
}

const sort_interaction_event_new = () => go_ford("new")
const sort_interaction_event_pop = () => go_ford("pop")
const sort_interaction_event_chp = () => go_ford("chp")
const sort_interaction_event_hash = () => {
  if (location.hash == "#new" && cards_sort.set != "new") {
    sort_by_newest()
    document.dispatchEvent(new Event("searchchanged"))
  }
  if (location.hash == "#pop" && cards_sort.set != "pop") {
    sort_by_popular()
    document.dispatchEvent(new Event("searchchanged"))
  }
  if (location.hash == "#chp" && cards_sort.set != "chp") {
    sort_by_cheapest()
    document.dispatchEvent(new Event("searchchanged"))
  }
}

const init_sort_interaction_events = () => {
  window.addEventListener("hashchange", sort_interaction_event_hash)
  sort_newest.addEventListener("click", sort_interaction_event_new)
  sort_popular.addEventListener("click", sort_interaction_event_pop)
  sort_cheapest.addEventListener("click", sort_interaction_event_chp)
}

const desc_sort_interaction_events = () => {
  window.removeEventListener("hashchange", sort_interaction_event_hash)
  sort_newest.removeEventListener("click", sort_interaction_event_new)
  sort_popular.removeEventListener("click", sort_interaction_event_pop)
  sort_cheapest.removeEventListener("click", sort_interaction_event_chp)
}

const init_sort_interaction = () => {
  if (location.hash == "#new") {
    sort_by_newest()
  } else if (location.hash == "#pop") {
    sort_by_popular()
  } else if (location.hash == "#chp") {
    sort_by_cheapest()
  } else {
    sort_by_popular()
  }
  init_sort_interaction_events()
}
const dest_sort_interaction = () => {
  desc_sort_interaction_events()
}
