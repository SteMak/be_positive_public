volume_placeholder.addEventListener("click", e => {
  if (!volume_setting) {
    Howler.volume(1)
    return
  }

  let placeholder = volume_placeholder.getBoundingClientRect()
  let percent = (e.clientY - placeholder.top - volume_padding) / (volume_placeholder.offsetHeight - 2 * volume_padding)
  percent = percent < 0 ? 0 : percent > 1 ? 1 : percent

  if (percent != 1 && volume_mic.classList.contains("volume_mic_off")) {
    volume_mic.classList.remove("volume_mic_off")
  }
  if (percent == 1) {
    volume_mic.classList.add("volume_mic_off")
  }

  Howler.volume(1 - percent)
  volume_active.style.marginTop = (percent - 1) * volume_height + "vh"
  volume_button.style.marginTop = `calc(${(percent - 1) * volume_height}vh - ${volume_button_size / 2}px)`

  window.localStorage.setItem("volume", (1 - percent).toString())
})

let volume_moveable = false
const disable_select = event => event.preventDefault()

volume_button.addEventListener("mousedown", () => {
  if (!volume_setting) {
    return
  }

  volume_button.style.filter = "brightness(100%)"
  volume_moveable = true
  window.addEventListener("selectstart", disable_select)
})
window.addEventListener("mouseup", e => {
  if (!volume_setting) {
    return
  }

  if (volume_moveable) {
    volume_button.style.filter = "brightness(95%)"
    volume_moveable = false
    window.removeEventListener("selectstart", disable_select)

    let placeholder = volume_placeholder.getBoundingClientRect()
    let percent = (e.clientY - placeholder.top - volume_padding) / (volume_placeholder.offsetHeight - 2 * volume_padding)
    percent = percent < 0 ? 0 : percent > 1 ? 1 : percent

    window.localStorage.setItem("volume", (1 - percent).toString())
  }
})
window.addEventListener("mousemove", e => {
  if (!volume_setting) {
    Howler.volume(1)
    return
  }

  if (volume_moveable) {
    let placeholder = volume_placeholder.getBoundingClientRect()
    let percent = (e.clientY - placeholder.top - volume_padding) / (volume_placeholder.offsetHeight - 2 * volume_padding)
    percent = percent < 0 ? 0 : percent > 1 ? 1 : percent

    if (percent != 1 && volume_mic.classList.contains("volume_mic_off")) {
      volume_mic.classList.remove("volume_mic_off")
    }
    if (percent == 1) {
      volume_mic.classList.add("volume_mic_off")
    }

    Howler.volume(1 - percent)
    volume_active.style.marginTop = (percent - 1) * volume_height + "vh"
    volume_button.style.marginTop = `calc(${(percent - 1) * volume_height}vh - ${volume_button_size / 2}px)`
  }
})

volume_mic.addEventListener("click", () => {
  if (!volume_setting) {
    return
  }

  if (volume_mic.classList.contains("volume_mic_off")) {
    volume_mic.classList.remove("volume_mic_off")

    let stored = window.localStorage.getItem("volume")
    if (stored == null) {
      stored = 1
    } else {
      stored = parseFloat(stored)
    }

    if (stored == 0) {
      stored = 0.5
      window.localStorage.setItem("volume", "0.5")
    }
    Howler.volume(stored)

    volume_active.style.marginTop = -stored * volume_height + "vh"
    volume_button.style.marginTop = `calc(${-stored * volume_height}vh - ${volume_button_size / 2}px)`
  } else {
    Howler.volume(0)
    volume_mic.classList.add("volume_mic_off")
    volume_active.style.marginTop = 0 + "vh"
    volume_button.style.marginTop = `calc(0vh - ${volume_button_size / 2}px)`
  }
})

const volume_start = () => {
  if (!volume_setting) {
    Howler.volume(1)
    return
  }

  volume_button.style.display = "block"

  let stored = window.localStorage.getItem("volume")
  if (stored == null) {
    stored = 1
  } else {
    stored = parseFloat(stored)
  }
  if (stored == 0) {
    stored = 0.5
    window.localStorage.setItem("volume", "0.5")
  }

  Howler.volume(stored)
  volume_active.style.marginTop = -stored * volume_height + "vh"
  volume_button.style.marginTop = `calc(${-stored * volume_height}vh - ${volume_button_size / 2}px)`
}

volume_start()
