const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const describers = [
  'Noob',
  'Friend',
  'Ninja',
  'Wizard',
  'Terminator'
];

const getRandomDescriber = () => describers[random(0, describers.length - 1)];

const utils = {
  getRandomDescriber,
  random,
};

export default utils;