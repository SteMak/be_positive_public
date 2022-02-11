blur_back.addEventListener("click", () => {
  if (blur_back.classList.contains("blur_button_off")) {
    blur_back.classList.remove("blur_button_off")
    back_video.classList.remove("back_video_blurred")

    window.localStorage.setItem("blured_back", "off")
  } else {
    blur_back.classList.add("blur_button_off")
    back_video.classList.add("back_video_blurred")

    window.localStorage.setItem("blured_back", "on")
  }
})

if (window.localStorage.getItem("blured_back") == "on") {
  blur_back.classList.add("blur_button_off")
  back_video.classList.add("back_video_blurred")
} else {
  blur_back.classList.remove("blur_button_off")
  back_video.classList.remove("back_video_blurred")
}
