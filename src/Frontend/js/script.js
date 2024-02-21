"use strict";

// const serverURL = 'https://k3url.vercel.com';
const serverURL = "https://k3url.onrender.com";
// const serverURL = "http://localhost:8000";

import { loadData, addUrlBar, saveHistory, getHistory } from "./utils.js";

// elements
const urlInput = document.querySelector(".wrapper-url-shortener input");
const btnShortUrl = document.querySelector(
  ".wrapper-url-shortener .btn-short-url"
);
const responseMessage = document.querySelector(
  ".wrapper-url-shortener .response-message"
);

const navToggleBtn = document.querySelector("nav .btn-toggle");
const navToggleBtnOptions = navToggleBtn.querySelector(".toggle-options");
const btnLogout = navToggleBtnOptions.querySelector(".logout");

// loading user data
loadData();

// Event listeners
navToggleBtn.addEventListener("click", () => {
  if (window.getComputedStyle(navToggleBtnOptions).display == "block") {
    navToggleBtnOptions.style.display = "none";
  } else {
    navToggleBtnOptions.style.display = "block";
  }
});

btnLogout.addEventListener("click", async () => {
  await fetch("/u/logout", {
    method: "POST",
  }).catch(err => {
    console.log(err);
    alert("Something went wrong while logging out !!!");
  });

  localStorage.removeItem("userData");
  location.href = "/";
});

btnShortUrl.addEventListener("click", async () => {
  const url = urlInput.value;
  const data = { url };

  if (url) {
    responseMessage.style.display = "none";
    btnShortUrl.textContent = "Processing...";

    await fetch(serverURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(async res => {
        const shortId = res.data.shortId;
        const url = res.data.url;
        btnShortUrl.textContent = "Short URL";

        if (!shortId) {
          responseMessage.style.display = "block";
          responseMessage.textContent = "Entered URL is not Valid!";
        } else {
          const history = getHistory();
          responseMessage.style.display = "none";
          addUrlBar(shortId, url);
          urlInput.value = ``;
          history.push({ shortId, url });
          saveHistory(history);

          await fetch(`/u/a/${shortId}`, {
            method: "POST",
          })
            .then(res => res.json())
            .catch(err => {
              console.log(err);
              alert(
                "Something went wrong while saving generated URL to your Account!"
              );
            });
        }
      })
      .catch(error => {
        btnShortUrl.textContent = "Short URL";
        responseMessage.style.display = "block";
        responseMessage.textContent = "Something went wrong!";
      });
  } else {
    responseMessage.style.display = "block";
    responseMessage.textContent = "URL is required to Short it!";
  }
});

// loading url history
const history = getHistory();

for (const { shortId, url } of history) {
  addUrlBar(shortId, url);
}

export { serverURL };
