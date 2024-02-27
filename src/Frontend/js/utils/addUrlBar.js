import { serverURL } from "../const.js";
import { saveHistory, getHistory } from "./memoryOperations.js";

const addUrlBar = (shortId, fullUrl) => {
  const shortUrl = `${serverURL + "/" + shortId}`;

  const urlBarHtml = `
    <div class="short-url-bar">
      <div class="container-content">
        <a class="short-url" href="${shortUrl}" target="_blank" rel="noopener noreferrer">
          k3url.onrender.com/${shortId}
        </a><br>
        <a class="full-url" href="${fullUrl}" target="_blank">
          ${fullUrl}
        </a>
      </div>
      <div class="btn-container">
        <div class="btn-url-bar-action btn-copy-link">
          <i class="fa-solid fa-link"></i>
        </div>
        <div class="btn-url-bar-action btn-delete-link">
          <i class="fa-solid fa-trash-can"></i>
        </div>
      </div>
    </div>
  `;

  const wrapperUrlHistory = document.querySelector(".wrapper-url-history");
  wrapperUrlHistory.insertAdjacentHTML("afterbegin", urlBarHtml);

  const currShortUrlBar = wrapperUrlHistory.querySelector(
    ".short-url-bar:first-child"
  );
  const btnCopyLink = wrapperUrlHistory.querySelector(
    ".short-url-bar:first-child .btn-copy-link"
  );
  const btnDeleteLink = wrapperUrlHistory.querySelector(
    ".short-url-bar:first-child .btn-delete-link"
  );

  if (wrapperUrlHistory.classList.contains("contains-user"))
    btnDeleteLink.style.display = "grid";
  else btnDeleteLink.style.display = "none";

  btnCopyLink.addEventListener("click", async () => {
    await navigator.clipboard.writeText(shortUrl);
  });

  btnDeleteLink.addEventListener("click", async () => {
    await fetch(`u/r/${shortId}`, {
      method: "POST",
    })
      .then(res => res.json())
      .then(res => {
        currShortUrlBar.remove();
        const history = getHistory();
        const shirtIdIdx = history.findIndex(data => data.shortId === shortId);
        history.splice(shirtIdIdx, 1);
        saveHistory(history);
      })
      .catch(err => {
        console.log(err);
        alert(
          "Something went wrong while saving generated URL to your Account!"
        );
      });
  });
};

export { addUrlBar };
