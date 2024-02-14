'use strict';

const serverURL = 'https://k3url.netlify.com/';
// const serverURL = 'https://k3url.onrender.com';
// const serverURL = 'http://localhost:8000';

import {
  addUrlBar,
  saveHistory,
  getHistory
} from "./utils.js";

const urlInput = document.querySelector('.wrapper-url-shortner input');
const btnShortUrl = document.querySelector('.wrapper-url-shortner .btn-short-url');
const responseMessage = document.querySelector('.wrapper-url-shortner .response-message');


btnShortUrl.addEventListener('click', async () => {
  const url = urlInput.value;
  const data = { url };

  if (url) {
    responseMessage.style.display = 'none';
    btnShortUrl.textContent = 'Processing...';

    await fetch(serverURL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      const shortId = res.data.shortId;
      const url = res.data.url;
      btnShortUrl.textContent = 'Short URL';

      if (!shortId) {
        responseMessage.style.display = 'block';
        responseMessage.textContent = 'Entered URL is not Valid!';
      }
      else {
        responseMessage.style.display = 'none';
        const history = getHistory();
        addUrlBar(shortId, url);
        urlInput.value = ``;
        history.push({ shortId, url });
        saveHistory(history);
      }
    })
    .catch(error => {
      btnShortUrl.textContent = 'Short URL';
      responseMessage.style.display = 'block';
      responseMessage.textContent = 'Something went wrong!';
    })
  }
  else {
    responseMessage.style.display = 'block';
    responseMessage.textContent = 'URL is required to Short it!';
  }
})

const history = getHistory();

for (const {shortId, url} of history) {
  addUrlBar(shortId, url);
}


export {
  serverURL
}
