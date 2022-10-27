const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const describers = ['Noob', 'Friend', 'Ninja', 'Wizard', 'Terminator'];

const getRandomDescriber = () => describers[random(0, describers.length - 1)];

const getAxiosError = (err) => {
  console.log('getAxiosError err', err);
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log(`${err.response.status}: ${JSON.stringify(err.response.data)}`);
    return err.response.data;
  } else if (err.request) {
    // The request was made but no response was received
    // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return err.message || err;
  } else {
    // Something happened in setting up the request that triggered an err
    return err.message || err;
  }
};

const deepCopy = (original) => {
  return JSON.parse(JSON.stringify(original));
};

function setStateKeyVal(state, key, val, updateState) {
  const newState = deepCopy(state);
  newState[key] = val;
  if (updateState) {
    return updateState(newState);
  }
  return newState;
}

function handleError(err, state, updateState) {
  const error = getAxiosError(err);
  console.log(error);
  setStateKeyVal(state, 'error', error, updateState);
}

function removeError(state, updateState) {
  if (state.error) {
    setStateKeyVal(state, 'error', null, updateState);
  }
}

export {
  deepCopy,
  getAxiosError,
  getRandomDescriber,
  handleError,
  random,
  removeError,
  setStateKeyVal,
};
