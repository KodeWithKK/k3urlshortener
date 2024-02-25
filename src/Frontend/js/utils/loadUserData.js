const loadUserData = () => {
  const wrapperUrlHistory = document.querySelector(".wrapper-url-history");
  const navToggleBtn = document.querySelector("nav .btn-toggle");
  const navSigninBtn = document.querySelector("nav .btn-sign-in");
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

export { loadUserData };
