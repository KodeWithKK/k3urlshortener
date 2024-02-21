import { serverURL } from "./script.js";

const wrapperUrlHistory = document.querySelector(".wrapper-url-history");
const navToggleBtn = document.querySelector("nav .btn-toggle");
const navSigninBtn = document.querySelector("nav .btn-sign-in");

const loadData = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (userData) {
    wrapperUrlHistory.classList.add("contains-user");
    navToggleBtn.style.display = "flex";
    navSigninBtn.style.display = "none";
  } else {
    wrapperUrlHistory.classList.remove("contains-user");
    navToggleBtn.style.display = "none";
    navSigninBtn.style.display = "block";
  }
};

const addUrlBar = (shortId, url) => {
  const shortUrl = `${serverURL + "/" + shortId}`;

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

  if (wrapperUrlHistory.classList.contains("contains-user")) {
    btnDeleteLink.style.display = "grid";
  } else {
    btnDeleteLink.style.display = "none";
  }

  btnCopyLink.addEventListener("click", async () => {
    await navigator.clipboard.writeText(`${shortUrl}`);
  });

  btnDeleteLink.addEventListener("click", async () => {
    await fetch(`u/r/${shortId}`, {
      method: "POST",
    }).catch(err => {
      console.log(err);
      alert("Something went wrong while saving generated URL to your Account!");
    });

    currShortUrlBar.remove();

    const history = getHistory();
    const shirtIdIdx = history.indexOf(shortId);
    history.splice(shirtIdIdx, 1);
    saveHistory(history);
  });
};

function saveHistory(newHistory) {
  localStorage.setItem("history", JSON.stringify(newHistory));
}

function getHistory() {
  return JSON.parse(localStorage.getItem("history")) ?? [];
}

export { loadData, addUrlBar, saveHistory, getHistory };
