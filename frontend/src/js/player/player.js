init_player = (media, id = media) => {
  // Cache references to DOM elements.
  let elms = ["player_container", "title", "timer", "waveform", "duration", "playBtn", "pauseBtn", "progress", "loading", "token_button"]
  let document_elms = {}
  elms.forEach(function (elm) {
    document_elms[elm] = document.getElementById(elm + "_" + id)
  })

  /**
   * Player class containing the state of our songs and where we are in it.
   * Includes all methods for playing, skipping, updating the display, etc.
   * @param {{file, howl}} song Object with details.
   */
  let Player = function (song) {
    this.song = song
    this.index = 0
  }
  Player.prototype = {
    /**
     * Play a song
     */
    play: function () {
      let self = this
      let sound

      let data = self.song

      // If we already loaded this track, use the current one.
      // Otherwise, setup and load a new Howl.
      if (data.howl) {
        sound = data.howl
      } else {
        sound = data.howl = new Howl({
          src: [data.file],
          html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
          onplay: function () {
            // Display the duration.
            document_elms.duration.innerHTML = self.formatTime(Math.round(sound.duration()))
            document_elms.title.style.display = "block"

            // Start updating the progress of the track.
            requestAnimationFrame(self.step.bind(self))

            // Start the wave animation if we have already loaded
            resume_speed()
            // grow_amlitude()
            document_elms.pauseBtn.style.display = "block"

            document.dispatchEvent(new Event("player_started"))
          },
          onload: function () {
            // Start the wave animation.
            resume_speed()
            // grow_amlitude()
            document_elms.loading.style.display = "none"
          },
          onend: function () {
            // Stop the wave animation.
            // less_amlitude()
            pause_speed()
            document_elms.playBtn.style.display = "block"
            document_elms.pauseBtn.style.display = "none"

            if (play_all_indexes.includes(id)) {
              play_all_indexes.splice(play_all_indexes.indexOf(id), 1)
              if (play_all_indexes.length == 0) {
                document.dispatchEvent(new Event("play_all_finished"))
              }
            }

            if (play_indexes.includes(id)) {
              play_indexes.splice(play_indexes.indexOf(id), 1)
            }

            morda_1.dispatchEvent(new Event("mouseout"))
            document_elms.token_button.classList.remove("card_active")
            document.dispatchEvent(new Event("player_ended"))
          },
          onpause: function () {
            // Stop the wave animation.
            pause_speed()
            document_elms.playBtn.style.display = "block"
            document_elms.pauseBtn.style.display = "none"
            document_elms.token_button.classList.remove("card_active")

            if (play_all_indexes.includes(id)) {
              play_all_indexes.splice(play_all_indexes.indexOf(id), 1)
              if (play_all_indexes.length == 0) {
                document.dispatchEvent(new Event("play_all_finished"))
              }
            }

            if (play_indexes.includes(id)) {
              play_indexes.splice(play_indexes.indexOf(id), 1)
            }

            morda_1.dispatchEvent(new Event("mouseout"))
            document.dispatchEvent(new Event("player_ended"))
          },
          onstop: function () {
            // Stop the wave animation.
            // less_amlitude()
            pause_speed()
            document_elms.playBtn.style.display = "block"
            document_elms.pauseBtn.style.display = "none"

            if (play_all_indexes.includes(id)) {
              play_all_indexes.splice(play_all_indexes.indexOf(id), 1)
              if (play_all_indexes.length == 0) {
                document.dispatchEvent(new Event("play_all_finished"))
              }
            }

            if (play_indexes.includes(id)) {
              play_indexes.splice(play_indexes.indexOf(id), 1)
            }

            morda_1.dispatchEvent(new Event("mouseout"))
            document_elms.token_button.classList.remove("card_active")
            document.dispatchEvent(new Event("player_ended"))
          },
          onseek: function () {
            // Start updating the progress of the track.
            requestAnimationFrame(self.step.bind(self))
          },
        })
      }

      // Begin playing the sound.
      sound.play()
      document_elms.token_button.classList.add("card_active")

      // Show the pause button.
      if (sound.state() === "loaded") {
        document_elms.playBtn.style.display = "none"
        document_elms.pauseBtn.style.display = "block"
      } else {
        document_elms.loading.style.display = "block"
        document_elms.playBtn.style.display = "none"
        document_elms.pauseBtn.style.display = "none"
      }
    },

    /**
     * Pause the currently playing track.
     */
    pause: function () {
      let self = this

      // Get the Howl we want to manipulate.
      let sound = self.song.howl

      // Puase the sound.
      sound.pause()

      // Show the play button.
      document_elms.playBtn.style.display = "block"
      document_elms.pauseBtn.style.display = "none"
    },

    stop: function () {
      let self = this

      // Get the Howl we want to manipulate.
      let sound = self.song.howl

      // Puase the sound.
      if (sound) sound.stop()

      // Show the play button.
      document_elms.playBtn.style.display = "block"
      document_elms.loading.style.display = "none"
      document_elms.pauseBtn.style.display = "none"
    },

    /**
     * Set the volume and update the volume slider display.
     * @param  {Number} val Volume between 0 and 1.
     */
    volume: function (val) {
      let self = this

      // Update the global volume (affecting all Howls).
      Howler.volume(val)
    },

    /**
     * Seek to a new position in the currently playing track.
     * @param  {Number} per Percentage through the song to skip.
     */
    seek: function (per) {
      let self = this

      // Get the Howl we want to manipulate.
      let sound = self.song.howl

      // Convert the percent into a seek position.
      if (sound) {
        sound.seek(sound.duration() * per)
      }
    },

    /**
     * The step called within requestAnimationFrame to update the playback position.
     */
    step: function () {
      let self = this

      // Get the Howl we want to manipulate.
      let sound = self.song.howl

      // Determine our current seek position.
      let seek = sound.seek() || 0
      document_elms.timer.innerHTML = self.formatTime(Math.round(seek))
      document_elms.progress.style.width = ((seek / sound.duration()) * 100 || 0) + "%"

      // If the sound is still playing, continue stepping.
      if (sound.playing()) {
        requestAnimationFrame(self.step.bind(self))
      }
    },

    /**
     * Toggle the volume display on/off.
     */
    toggleVolume: function () {
      let self = this
    },

    /**
     * Format the time from seconds to M:SS.
     * @param  {Number} secs Seconds to format.
     * @return {String}      Formatted time.
     */
    formatTime: function (secs) {
      let minutes = Math.floor(secs / 60) || 0
      let seconds = secs - minutes * 60 || 0

      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    },
  }

  // Setup our new audio player class and pass it the song.
  let player = new Player({
    file: location.origin + "/ipfs/" + media,
    howl: null,
  })

  const morda_1_play_click = e => {
    if (play_all_playing) {
      player.play()
      play_all_indexes.push(id)
      play_indexes.push(id)
    } else {
      if (play_all_indexes.includes(id)) {
        player.stop()
        play_all_indexes.splice(play_all_indexes.indexOf(id), 1)
      }
    }
  }
  const play_btn_click = e => {
    e.stopPropagation()
    player.play()
    play_indexes.push(id)
    morda_1.dispatchEvent(new Event("mouseover"))
  }
  const pause_btn_click = e => {
    e.stopPropagation()
    player.pause()
  }
  const player_container_click = e => {
    if (player && player.song && player.song.howl && player.song.howl._sounds && player.song.howl._sounds[0] && player.song.howl._sounds[0]._ended == false) {
      e.stopPropagation()
      player.seek((e.clientX - document_elms.player_container.offsetLeft) / document_elms.player_container.offsetWidth)
    }
  }

  const init_player_events = () => {
    document.addEventListener("play_all_playing", morda_1_play_click)

    document_elms.playBtn.addEventListener("click", play_btn_click)
    document_elms.pauseBtn.addEventListener("click", pause_btn_click)
    document_elms.player_container.addEventListener("click", player_container_click)
  }
  const dest_player_events = e => {
    if (e.detail.includes(id)) {
      if (player) player.stop()
      document.removeEventListener("remove_players", dest_player_events)
      document.removeEventListener("play_all_playing", morda_1_play_click)

      document_elms.playBtn.removeEventListener("click", play_btn_click)
      document_elms.pauseBtn.removeEventListener("click", pause_btn_click)
      document_elms.player_container.removeEventListener("click", player_container_click)
    }
  }
  init_player_events()

  document.addEventListener("remove_players", dest_player_events)

  let wave = new SiriWave({
    container: document_elms.waveform,
    width: document_elms.waveform.parentElement.clientWidth,
    height: document_elms.waveform.parentElement.clientHeight * 0.3,
    cover: true,
    frequency: 3,
  })
  wave.speed = 0
  wave.amplitude = 1
  wave.start()

  const pause_speed = () => (wave.speed = 0)
  const resume_speed = () => (wave.speed = 0.1)
}
