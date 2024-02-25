function saveHistory(newHistory) {
  localStorage.setItem("history", JSON.stringify(newHistory));
}

function getHistory() {
  return JSON.parse(localStorage.getItem("history")) ?? [];
}

export { saveHistory, getHistory };
