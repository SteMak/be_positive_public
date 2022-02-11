const play_all_click_event = () => {
  if (play_all_playing) {
    morda_1.dispatchEvent(new Event("mouseover"))
    play_all_play.style.display = "none"
    play_all_pause.style.display = "block"
    acc_play_all_play.style.display = "none"
    acc_play_all_pause.style.display = "block"
    acc_al_play_all_play.style.display = "none"
    acc_al_play_all_pause.style.display = "block"
  } else {
    play_all_pause.style.display = "none"
    play_all_play.style.display = "block"
    acc_play_all_pause.style.display = "none"
    acc_play_all_play.style.display = "block"
    acc_al_play_all_pause.style.display = "none"
    acc_al_play_all_play.style.display = "block"
  }
}

play_all.addEventListener("click", play_all_click_event)
acc_play_all.addEventListener("click", play_all_click_event)
acc_al_play_all.addEventListener("click", play_all_click_event)
morda_1.addEventListener("click", play_all_click_event)

document.addEventListener("play_all_finished", () => {
  play_all_pause.style.display = "none"
  play_all_play.style.display = "block"
  acc_play_all_pause.style.display = "none"
  acc_play_all_play.style.display = "block"
  acc_al_play_all_pause.style.display = "none"
  acc_al_play_all_play.style.display = "block"
})

morda_1.addEventListener("mouseover", () => {
  morda_1_gif.style.display = ""
  morda_1_png.style.display = "none"
})
morda_1.addEventListener("mouseout", () => {
  if (!play_all_playing && play_indexes.length == 0) {
    morda_1_gif.style.display = "none"
    morda_1_png.style.display = ""
  }
})

document.addEventListener("play_all_finished", () => {
  morda_1_gif.style.display = "none"
  morda_1_png.style.display = ""
  play_all_playing = false
})

document.addEventListener("remove_players", e => {
  for (let i = play_all_indexes.length; i >= 0; i--) {
    if (e.detail.includes(play_all_indexes[i])) {
      play_all_indexes.splice(i, 1)
    }
  }
  if (play_all_indexes.length == 0) {
    document.dispatchEvent(new Event("play_all_finished"))
  }
})
