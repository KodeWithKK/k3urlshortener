import { serverURL } from "./script.js";

const wrapperUrlHistory = document.querySelector('.wrapper-url-history');

const addUrlBar = (shortId, url) => {
  const shortUrl = `${serverURL + '/' + shortId}`;

  const urlBarHtml = `
    <div class="short-url-bar">
      <div class="container-content">
        <a class="short-url" href="${shortUrl}" target="_blank">
          k3url.onrender.com/${shortId}
        </a><br>
        <a class="full-url" href="${url}" target="_blank">
          ${url}
        </a>
      </div>
      <div class="btn-copy-link">
        <i class="fa-solid fa-link"></i>
      </div>
    </div>
  `

  wrapperUrlHistory.insertAdjacentHTML('afterbegin', urlBarHtml);
  const btnCopyLink = wrapperUrlHistory.querySelector('.short-url-bar:first-child .btn-copy-link');

  btnCopyLink.addEventListener('click', async () => {
    await navigator.clipboard.writeText(`${shortUrl}`);
  })
}

function saveHistory(newHistory) {
  localStorage.setItem("history", JSON.stringify(newHistory));
}

function getHistory() {
  return JSON.parse(localStorage.getItem("history")) ?? [];
}

export {
  addUrlBar,
  saveHistory,
  getHistory
}
