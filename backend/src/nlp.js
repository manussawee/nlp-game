const axios = require('axios');
const config = require('./config');

const getParagraph = async (firstWord, secondWord) => {
  const { data } = await axios.get(`${config.nlpAPI}/generateDocument`, {
    params: {
      text1: firstWord,
      text2: secondWord,
    },
  });
  const words = data.split(' ');
  const newWords = [];
  let wordIndex = 0;
  words.forEach(word => {
    if (wordIndex === firstWord.indexOf(word)) {
      if (wordIndex === 0) newWords.push(word);
      else newWords[newWords.length - 1] += word;
      wordIndex += word.length;
    } else {
      newWords.push(word);
      wordIndex = 0;
    }
  });

  const newWords2 = [];
  let wordIndex2 = 0;
  newWords.forEach(word => {
    if (wordIndex2 === secondWord.indexOf(word)) {
      if (wordIndex2 === 0) newWords2.push(word);
      else newWords2[newWords2.length - 1] += word;
      wordIndex2 += word.length;
    } else {
      newWords2.push(word);
      wordIndex2 = 0;
    }
  });

  return newWords2;
};

module.exports = {
  getParagraph,
};
