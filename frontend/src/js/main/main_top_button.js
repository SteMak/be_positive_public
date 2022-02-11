const go_top = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: document.body.scrollTop < 10000 && document.documentElement.scrollTop < 10000 ? "smooth" : "instant",
  })
}

const top_button_event_scroll = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    top_button.classList.remove("topout")
    top_button.classList.add("topin")
  } else {
    top_button.classList.remove("topin")
    top_button.classList.add("topout")
  }
}

const init_top_button_events = () => {
  document.addEventListener("scroll", top_button_event_scroll)
}
const dest_top_button_events = () => {
  document.addEventListener("scroll", top_button_event_scroll)
}

const init_top_button = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    top_button.classList.remove("topout")
    top_button.classList.add("topin")
  }
  init_top_button_events()
}
const dest_top_button = () => {
  dest_top_button_events()
}
