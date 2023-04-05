const form = document.getElementsByTagName('fieldset')[0];

let isDragging = false;
let start = undefined;
let current = undefined;
let startHeight = undefined;

form.addEventListener('touchstart', (e) => {
  isDragging = true;
  start = e.clientY;
  startHeight = form.offsetHeight;
});

form.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  current = e.clientY;
  const diff = start - current;
  const newHeight = startHeight + diff;
  if (newHeight - startHeight < 0) {
    form.classList.add('closed')
  } else {
    form.classList.remove('opened')
  }
});

form.addEventListener('touchend', () => {
  isDragging = false;
});