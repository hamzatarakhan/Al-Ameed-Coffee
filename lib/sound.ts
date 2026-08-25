import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

// iOS mutes app audio by default when the hardware silent switch is on —
// these are UI feedback sounds, not media, so they should still play.
setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

const sources = {
  tap: require('../assets/sounds/tap.wav'),
  success: require('../assets/sounds/success.wav'),
};

// One player per sound, reused across calls (button taps happen often —
// allocating a native player per tap is wasteful and adds latency).
const players: Partial<Record<keyof typeof sources, AudioPlayer>> = {};

function play(name: keyof typeof sources) {
  try {
    let player = players[name];
    if (!player) {
      player = createAudioPlayer(sources[name]);
      players[name] = player;
    }
    player.seekTo(0).then(() => player!.play());
  } catch {
    // Best-effort — a missing/failed sound should never break the tap it's attached to.
  }
}

export const playTap = () => play('tap');
export const playSuccess = () => play('success');
