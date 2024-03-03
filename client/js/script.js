"use strict";

import { loadUserData } from "./utils/loadUserData.js";
import { loadHistory } from "./utils/loadHistory.js";
import { addUrlBar } from "./utils/addUrlBar.js";
import { saveHistory, getHistory } from "./utils/memoryOperations.js";
import { serverURL } from "./const.js";

// ----- elements ------ //
const urlInput = document.querySelector(".wrapper-url-shortener input");
const btnShortUrl = document.querySelector(
  ".wrapper-url-shortener .btn-short-url"
);
const responseMessage = document.querySelector(
  ".wrapper-url-shortener .response-message"
);

const navToggleBtn = document.querySelector("nav .btn-toggle");
const navToggleBtnOptions = document.querySelector(".toggle-options");
const btnLogout = document.querySelector(".btn-logout");

// loading data
loadUserData();
loadHistory();

// ----- Event listeners ----- //
navToggleBtn.addEventListener("click", () => {
  navToggleBtnOptions.classList.toggle("u-hidden");
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
  const fullUrl = urlInput.value.trim();
  const data = { fullUrl };

  if (fullUrl) {
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
        const { shortId, fullUrl } = res.data;
        btnShortUrl.textContent = "Short URL";

        if (!shortId) {
          responseMessage.style.display = "block";
          responseMessage.textContent = "Entered URL is not Valid!";
        } else {
          const history = getHistory();
          responseMessage.style.display = "none";
          addUrlBar(shortId, fullUrl);
          urlInput.value = ``;
          history.push({ shortId, fullUrl });
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
