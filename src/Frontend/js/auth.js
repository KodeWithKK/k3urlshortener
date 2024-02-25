"use strict";

const signinForm = document.querySelector(".form-sign-in");
const signinFormSigninBtn = signinForm.querySelector(".btn-solid");
const signinFormSignupBtn = signinForm.querySelector(".btn-tertiary");
const signinFormErrorMssg = signinForm.querySelector(".error-message");

const signupForm = document.querySelector(".form-sign-up");
const signupFormSignupBtn = signupForm.querySelector(".btn-solid");
const signupFormSigninBtn = signupForm.querySelector(".btn-tertiary");
const signupFormErrorMssg = signupForm.querySelector(".error-message");

function displayErrorMssg(elm, mssg) {
  if (mssg === "") {
    elm.style.display = "none";
  } else {
    elm.style.display = "block";
    elm.textContent = mssg;
  }
}

// --------- SIGNIN ---------- //
signinFormSignupBtn.addEventListener("click", () => {
  signinForm.style.display = "none";
  signupForm.style.display = "block";
});

signinFormSigninBtn.addEventListener("click", async e => {
  e.preventDefault();

  const formData = new FormData(signinForm);
  const data = Object.fromEntries(formData);
  const history = JSON.parse(localStorage.getItem("history")) ?? [];
  data.history = history;

  await fetch("/u/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then(data => {
      const { user, history } = data.data;

      if (user) {
        displayErrorMssg(signinFormErrorMssg, "");
        const { email, name } = user;
        localStorage.setItem("userData", JSON.stringify({ email, name }));
        localStorage.setItem("history", JSON.stringify(history));
        location.href = "/";
      } else {
        displayErrorMssg(signinFormErrorMssg, data.message);
      }
    })
    .catch(async err => {
      displayErrorMssg(signupFormErrorMssg, "Something went Wrong!");
      console.log(err);
    });
});

// --------- SIGNUP ---------- //
signupFormSigninBtn.addEventListener("click", () => {
  signupForm.style.display = "none";
  signinForm.style.display = "block";
});

signupFormSignupBtn.addEventListener("click", async e => {
  e.preventDefault();

  const formData = new FormData(signupForm);
  const data = Object.fromEntries(formData);
  const history = JSON.parse(localStorage.getItem("history")) ?? [];
  data.history = history;

  await fetch("/u/signup", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then(data => {
      const { createdUser } = data.data;

      if (createdUser) {
        displayErrorMssg(signupFormErrorMssg, "");
        const { email, name } = createdUser;
        localStorage.setItem("userData", JSON.stringify({ email, name }));
        location.href = "/";
      } else {
        displayErrorMssg(signupFormErrorMssg, data.message);
      }
    })
    .catch(err => {
      displayErrorMssg(signupFormErrorMssg, "Something went Wrong!");
      console.log(err);
    });
});
