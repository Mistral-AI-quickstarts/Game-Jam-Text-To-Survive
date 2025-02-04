function playSound(sound) {

    if (typeof isSoundOn === 'undefined' ? false : isSoundOn) {
        let soundToPlay;

        // Determine which sound to play
        switch (sound) {
            case 'clownSound1':
                soundToPlay = clownSound1Snd;
                break;
            case 'clownSound2':
                soundToPlay = clownSound2Snd;
                break;
            case 'clownSeesYou':
                soundToPlay = clownSeesYouSnd;
                break;
            case 'gfMove':
                soundToPlay = gfMoveSnd;
                break;
            case 'lose':
                soundToPlay = loseSnd;
                break;
            case 'unlockDoor':
                soundToPlay = unlockDoorSnd;
                break;
            case 'useKnife':
                soundToPlay = useKnifeSnd;
                break;
            case 'message':
                soundToPlay = messageSnd;
                break;
            case 'success':
                soundToPlay = successSnd;
                break;
        }

        // Play the sound if it's defined and loaded
        if (soundToPlay && soundToPlay.isLoaded()) {
            soundToPlay.setLoop(false); // Ensure looping is disabled
            soundToPlay.playMode('restart'); // Set play mode to 'restart'
            if (soundToPlay.isPlaying()) {
                soundToPlay.stop(); // Stop any existing playback
            }
            soundToPlay.play(); // Play the sound once
        } else {
            console.log('Sound file is not loaded or undefined.');
        }
    }
}



function toggleSound() {
    isSoundOn = !isSoundOn;
    localStorage.setItem("isSoundOn", isSoundOn.toString());

    if (isSoundOn) {
        if (bgMusic.currentTime < 10) {
            bgMusic.currentTime = 10;
        }
        bgMusic.play();
       
    } else {
        bgMusic.pause();
    }
    updateSoundIcon();
}

// Check if sound setting exists in localStorage, if not toggle sound on
if (localStorage.getItem("isSoundOn") === null) {
    toggleSound();
}


function updateSoundIcon() {
    soundIcon.src = isSoundOn ? "/static/assets/img/sondon.png" : "/static/assets/img/soundoff.png";
}

function playMessageSound() {
    try {
        const messageSound = document.getElementById("messageSound");
        if (messageSound) {
            messageSound.currentTime = 0;
            messageSound.volume = 1.0;
            messageSound.play().catch((error) => {
                console.log("Could not play message sound:", error);
            });
        }
    } catch (error) {
        console.error("Error playing message sound:", error);
    }
}