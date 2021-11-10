const axios = require("axios");
const { pexelsApiKey } = require("./config");

function randomNumber(minInclusive, maxExclusive) {
  return Math.floor(
    Math.random() * (maxExclusive - minInclusive) + minInclusive
  );
}

async function fetchCityImages(cityName, total) {
  const {
    data: { photos },
  } = await axios({
    method: "get",
    url: `https://api.pexels.com/v1/search?query=${cityName}`,
    headers: {
      Authorization: pexelsApiKey,
    },
  });
  // todo: retry and error handling.

  const images = new Set();
  while (images.size !== total) {
    images.add(photos[randomNumber(0, photos.length)].src.original);
  }
  return [...images];
}

module.exports = {
  fetchCityImages,
};
