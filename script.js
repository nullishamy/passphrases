import friendlyWords from 'https://cdn.jsdelivr.net/npm/friendly-words@1.3.1/+esm'

const ALL_WORDS = [
  ...friendlyWords.predicates,
  ...friendlyWords.objects,
  ...friendlyWords.teams,
  ...friendlyWords.collections
]
const $$ = document.querySelector.bind(document)
const $ = document.querySelectorAll.bind(document)


console.log("working with", ALL_WORDS.length, "words")

const wordCount = $$("#word-count")
const wordCountValue = $$("#word-count-value")
const form = $$("#passphrase")

function setParams(form) {
  const url = new URL(window.location)
  url.searchParams.set("word-count", form.get("word-count"))
  url.searchParams.set("separator", form.get("separator"))
  url.searchParams.set("capitalisation", form.get("capitalisation"))

  // Avoid using functions that would refresh the page
  window.history.pushState({}, '', url);
}

function selectRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function generate(config) {
  const output = $$("#output")

  let words = []
  for (let i = 0; i < config.wordCount; i++) {
    words.push(selectRandom(ALL_WORDS))
  }

  const separators = {
    "space": " ",
    "underscore": "_",
    "dash": "-"
  }


  if (config.capitalisation === "word") {
    words = words.map(w => capitalizeFirstLetter(w))
  } else if (config.capitalisation === "first") {
    words[0] = capitalizeFirstLetter(words[0])
  }

  const out = words.join(separators[config.separator])
  console.log("generated", out, "with config", config)
  output.textContent = out
}

function setFormFromParms() {
  const searchParams = new URLSearchParams(window.location.search)
  const hasAll = ["separator", "capitalisation", "word-count"].every(k => searchParams.has(k))

  if (!hasAll) {
    return
  }

  const separator = searchParams.get("separator")
  $$(`#${separator}`).checked = true

  const capitalisation = searchParams.get("capitalisation")
  $$(`#${capitalisation}`).checked = true

  const wordC = searchParams.get("word-count")
  wordCount.value = wordC
  wordCountValue.textContent = wordC

  generate({
    separator,
    capitalisation,
    wordCount: parseInt(wordC)
  })
}

wordCount.addEventListener("input", e => {
  wordCountValue.textContent = e.target.value
})

form.addEventListener("submit", e => {
  e.preventDefault()

  const data = new FormData(e.target)
  setParams(data)

  console.log("generating...", data)
  generate({
    separator: data.get("separator"),
    capitalisation: data.get("capitalisation"),
    wordCount: parseInt(data.get("word-count"))
  })

  return false
})

$(".clip-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    e.target.src = "static/tick.png"
    setTimeout(() => {
      e.target.src = "static/copy.png"
    }, 1000);
  })
});

new ClipboardJS('.clip-btn');
setFormFromParms()