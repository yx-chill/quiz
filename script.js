const yearEl = document.querySelector('.year')
const typeEl = document.querySelector('.type')
const question = document.querySelector('.question_container')
const questions = document.querySelector('.questions')
const submitEl = document.querySelector('.submit')
const solution = document.querySelector('.solution_container')
const solutions = document.querySelector('.solutions')
const subject = document.querySelector('.subject')
const again = document.querySelector('.again')
const loading = document.querySelector('.loading')

let data = []
let answerData = []
let year
let type, typeId
let q
let quiz = []

const answer = []

async function getData() {
  loading.classList.remove('hide')
  const res = await fetch(`https://exam.sally-handmade.com/api/v1/post/${year}/${typeId}`, {
    method: 'POST'
  })
  data = await res.json()
  loading.classList.add('hide')
}

async function getAnswerData() {
  loading.classList.remove('hide')
  const res = await fetch(`https://exam.sally-handmade.com/api/v1/post/${year}/${typeId}/answer`, {
    method: 'POST'
  })
  answerData = await res.json()
  loading.classList.add('hide')
}

yearEl.addEventListener('click', (e) => {
  if (e.target.type === 'button') {
    year = Number(e.target.dataset.year)
    yearEl.classList.add('hide')
    typeEl.classList.remove('hide')
  }
})

typeEl.addEventListener('click', async (e) => {
  if (e.target.type === 'button') {
    type = e.target.innerText
    typeId = Number(e.target.dataset.subjectId)

    typeEl.classList.add('hide')
    question.classList.remove('hide')

    subject.textContent = `${year}年度  ${type}`
    
    await showQuestion()
    initAnswer()

    const answerList = [...document.querySelectorAll('.answer_list')]

    answerList.forEach((item) => {
      item.addEventListener('click', (e) => {
        if (e.target.nodeName === 'P') {
          markOption(item.dataset.id, e.target.parentNode)
          answer[item.dataset.id] = e.target.dataset.option
        }
      }, true)
    })
  }
})

submitEl.addEventListener('click', async (e) => {
  for (let i = 0; i < answer.length; i++) {
    const require = document.querySelector(`#q${i}`)
    require.removeAttribute('style')
    require.firstElementChild.textContent = ''
    if (answer[i] === 0) {
      require.setAttribute('style', 'border: 1px solid red;')
      require.firstElementChild.textContent = '尚未作答完畢'
      window.location.hash = `#q${i}`
      return
    }
  }
  question.classList.add('hide')
  solution.classList.remove('hide')
  await showSolution()
})

again.addEventListener('click', reset)

async function showQuestion() {
  await getData()
  let str = ''
  data.forEach((item, i) => {
    str += `
      <div class="question" id="q${i}">
        <p class="require"></p>
        <div class="title">
          <span>${item.num < 9 ? '0' + item.num : item.num }.</span>
          <h2>${item.question}</h2>
        </div>
        <ul class="answer_list" data-id="${i}">
          <li class="answer_item pointer">
            <p data-option="A">${item.A}</p>
          </li>
          <li class="answer_item pointer">
            <p data-option="B">${item.B}</p>
          </li>
          <li class="answer_item pointer">
            <p data-option="C">${item.C}</p>
          </li>
          <li class="answer_item pointer">
            <p data-option="D">${item.D}</p>
          </li>
        </ul>
      </div>
    `
  })
  questions.innerHTML = str
}

function markOption(id, option) {
  [...document.querySelector(`[data-id="${id}"]`).getElementsByTagName('li')].forEach((item) => {
    item.classList.remove('chosen')
  })
  option.classList.add('chosen')
}

function initAnswer() {
  for (let i = 0; i < data.length; i++) {
    answer[i] = 0
  }
}

function setScore() {
  const typed = new Typed('.score', {
    strings: [`測驗結果為 100分 恭喜!!`, '宇智波騙你', `^1000 測驗成績 : ^1000 ${answerData.grade}`],
    typeSpeed: 100,
    cursorChar: '_',
  })
}

async function showSolution() {
  await getAnswerData()
  setScore()
  let str = ''
  answerData.result.forEach((item) => {
    str += `
      <div class="solution">
        <div class="title">
          <span>${item.num < 9 ? '0' + item.num : item.num}.</span>
          <h2>${item.question}</h2>
        </div>
        <ul class="solution_list">
          <li class="solution_item ${item.answer === 'A' ? 'chosen' : ''}">
            <p>${item.A}</p>
          </li>
          <li class="solution_item ${item.answer === 'B' ? 'chosen' : ''}">
            <p>${item.B}</p>
          </li>
          <li class="solution_item ${item.answer === 'C' ? 'chosen' : ''}">
            <p>${item.C}</p>
          </li>
          <li class="solution_item ${item.answer === 'D' ? 'chosen' : ''}">
            <p>${item.D}</p>
          </li>
        </ul>
      </div>
    `
  })
  solutions.innerHTML = str || ''
}

function reset() {
  solution.classList.add('hide')
  yearEl.classList.remove('hide')
  questions.innerHTML = ''
  solutions.innerHTML = ''
}
