const inputText = document.getElementById("inputText");
const summarizeBtn = document.getElementById("summarizeBtn");
const output = document.getElementById("output");
const summaryText = document.getElementById("summaryText");
const sentenceSlider = document.getElementById("sentenceCount");
const countLabel = document.getElementById("countLabel");
const themeToggle = document.getElementById("themeToggle");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");

countLabel.textContent = sentenceSlider.value;

sentenceSlider.addEventListener("input", () => {
  countLabel.textContent = sentenceSlider.value;
});

summarizeBtn.addEventListener("click", summarize);

function summarize() {
  const text = inputText.value.trim();
  if (!text) return;

  const sentenceLimit = Number(sentenceSlider.value);

  const sentences = text.match(/[^.!?。！？]+[.!?。！？]*/g) || [];
  const words = text.toLowerCase().match(/\p{L}+/gu) || [];

  const frequency = {};
  words.forEach(word => {
    if (word.length > 3) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  const scored = sentences.map(sentence => {
    let score = 0;
    const sentenceWords = sentence.toLowerCase().match(/\p{L}+/gu) || [];
    sentenceWords.forEach(word => {
      score += frequency[word] || 0;
    });
    return { sentence, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const summary = scored
    .slice(0, sentenceLimit)
    .map(s => s.sentence.trim())
    .join(" ");

  summaryText.innerHTML = highlight(summary);
  output.classList.remove("hidden");
}

function highlight(text) {
  return text
    .split(" ")
    .map(word => `<span class="hl">${word}</span>`)
    .join(" ");
}

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(summaryText.innerText);
  copyBtn.textContent = "✅ Copied";
  setTimeout(() => copyBtn.textContent = "📋 Copy", 1500);
});

shareBtn.addEventListener("click", async () => {
  const text = summaryText.innerText;

  if (navigator.share) {
    await navigator.share({ text });
  } else {
    navigator.clipboard.writeText(text);
    alert("Summary copied to clipboard");
  }
});
