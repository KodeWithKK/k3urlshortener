import { addUrlBar } from "./addUrlBar.js";
import { getHistory } from "./memoryOperations.js";

function loadHistory() {
  const history = getHistory();

  for (const { shortId, fullUrl } of history) {
    addUrlBar(shortId, fullUrl);
  }
}

export { loadHistory };
