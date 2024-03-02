const loadUserData = () => {
  const wrapperUrlHistory = document.querySelector(".wrapper-url-history");
  const navSigninBtn = document.querySelector("nav .btn-sign-in");
  const btnLogout = document.querySelector(".btn-logout");
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (userData) {
    wrapperUrlHistory.classList.add("contains-user");
    navSigninBtn.classList.add("u-hidden");
  } else {
    wrapperUrlHistory.classList.remove("contains-user");
    btnLogout.classList.add("u-hidden");
  }
};

export { loadUserData };
