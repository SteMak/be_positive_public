const acc_go_top = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: document.body.scrollTop < 10000 && document.documentElement.scrollTop < 10000 ? "smooth" : "instant",
  })
}

const acc_top_button_event_scroll = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    acc_top_button.classList.remove("topout")
    acc_top_button.classList.add("topin")
  } else {
    acc_top_button.classList.remove("topin")
    acc_top_button.classList.add("topout")
  }
}

const init_acc_top_button_events = () => {
  document.addEventListener("scroll", acc_top_button_event_scroll)
}
const dest_acc_top_button_events = () => {
  document.addEventListener("scroll", acc_top_button_event_scroll)
}

const init_acc_top_button = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    acc_top_button.classList.remove("topout")
    acc_top_button.classList.add("topin")
  }
  init_acc_top_button_events()
}
const dest_acc_top_button = () => {
  dest_acc_top_button_events()
}
