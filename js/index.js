
const drumSoundMap = {
  'crash': 'drums/crash',
  'bass': 'drums/bass',
  'snare-drum': 'drums/snare-drum',
  'snare-stick': 'drums/snare-stick',
  'floor-tom': 'drums/floor-tom',
  'tom-1': 'drums/tom1',
  'tom-2': 'drums/tom2',
  'ride': 'drums/ride',
  'hihat-foot': 'drums/hihat-foot',
  'hihat-open': 'drums/hihat-open',
  'hihat': 'drums/hihat',
};

const drumKeyMap = {
  'y': 'crash',
  'x': 'bass',
  's': 'snare-drum',
  'd': 'snare-stick',
  'j': 'floor-tom',
  'g': 'tom-1',
  'h': 'tom-2',
  'u': 'ride',
  'c': 'hihat-foot',
  'w': 'hihat-open',
  'r': 'hihat',
};

const pianoPressLetters = ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'v', 'g', 'b', 'h', 'n', 'm', 'k', ',', 'l', '.', ';', '/'];
const pianoButtons = document.querySelectorAll('.key');
const pianoArr = Array.from(pianoButtons).map(button => button.id);


document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.instrument-card');
  cards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => video.play());
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
});

document.querySelectorAll('.drum').forEach(button => {
  button.addEventListener('click', () => playSound(button.id));
});

pianoButtons.forEach(button => {
  button.addEventListener('click', () => playSound(button.id));
});

function playSound(keyNote) {
  const button = document.querySelector('#' + keyNote);
  if (button) {
    button.classList.add("pressed");
    setTimeout(() => button.classList.remove("pressed"), 100);
  }

  if (document.body.id === 'drumPage') {
    const soundFile = drumSoundMap[keyNote];
    if (soundFile) {
      const sound = new Audio('../sounds/' + soundFile + '.mp3');
      sound.currentTime = 0;
      sound.play();
      return;
    }
  }

  const sound = new Audio('../sounds/' + keyNote + '.mp3');
  sound.currentTime = 0;
  sound.play();
}

document.addEventListener('keydown', function (event) {
  if (event.repeat) return;

  if (document.body.id === 'drumPage') {
    const btnId = drumKeyMap[event.key.toLowerCase()];
    if (btnId) {
      playSound(btnId);
      return;
    }
  }

  if (window.location.pathname.split('/').pop() === 'piano.html') {
    const keyIndex = pianoPressLetters.indexOf(event.key);
    if (keyIndex !== -1) {
      playSound(pianoArr[keyIndex]);
    }
  }
});







