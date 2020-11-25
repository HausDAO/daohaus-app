export const contra = (callback) => {
  const pattern = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];
  let current = 0;

  const keyHandler = (event) => {
    if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
      current = 0;
      return;
    }
    current++;

    if (pattern.length === current) {
      current = 0;
      callback();
    }
  };
  document.addEventListener('keydown', keyHandler, false);
};
