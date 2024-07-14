const container = document.getElementById("exercise-container");
const addForm = document.getElementById("add-form");
const addExerciseBtn = document.getElementById("add-exercise");
const submitExercise = document.getElementById("submit-new-exercise");
const nameInput = document.getElementById("name-input");
const scoreInput = document.getElementById("score-input");
const addCloseDialog = document.getElementById("add-close-dialog");
const dailyInputs = document.getElementById("daily-inputs");
const calender = document.getElementById("calender");
const dailyForm = document.getElementById("daily-form");
const dailyExerciseBtn = document.getElementById("daily-exercise-btn");
const dailyCloseBtn = document.getElementById("daily-close-dialog");
const closeDaily = document.getElementById("close-daily");
const submitDaily = document.getElementById("submit-daily");
const scoreEl = document.getElementById("score");
const highScore = document.getElementById("daily-high-score");
const date = new Date();
const days = JSON.parse(localStorage.getItem("daysStored")) || [{date: "placeholder"}];
let currentExercise = -1;
let exercises = JSON.parse(localStorage.getItem("storedExercises")) || [days[0].date];
let score = 0;

addExerciseBtn.addEventListener("click", () => addForm.showModal());
dailyExerciseBtn.addEventListener("click", () => dailyForm.showModal());

/*
TODO:
Create a scoring system
Sort daily inputs alphebetically
*/

//Renders the html
function render () {

    renderDialog();

    renderExercises();

    storeData();

    calcScore();

    renderCalender();
}

function renderDialog () {

    dailyInputs.innerHTML = "";
    exercises.forEach((item) => {
        dailyInputs.innerHTML += `
        <div class="block">
            <label for="${item.id}-daily-input"><strong>${item.name}:</strong></label>
            <input type="number" id="${item.id}-daily-input" class="number-input" value="0">
        </div>`;
    });

    if (days[0].date === `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`) {
        exercises.forEach(item => document.getElementById(`${item.id}-daily-input`).value = days[0][`${item.id}-daily-input`])
    }

}

function renderExercises () {

    container.innerHTML = "";
    exercises.forEach(({id, name, score, count}) => {

        count = 0;
        days.forEach(item => {
            if (item.date !== "placeholder" && Number(item[`${id}-daily-input`])) {
                count += Number(item[`${id}-daily-input`]);
            }
        })

        container.innerHTML += `
        <div id="${id}" class="excercise">
            <p><strong>${name}</strong></p>
            <p><strong>Score: ${score}</strong></p>
            <p><strong>Count: ${count}</strong></p>
            <button type="button" class="btn" onclick="editExercise(this)">Edit</button>
            <button type="button" class="btn" onclick="deleteExercise(this)">Delete</button>
        </div>`
    })
    
    container.innerHTML += `<div class="placeholder"></div><div class="placeholder"></div><div class="placeholder"></div><div class="placeholder"></div>
                            <div class="placeholder"></div><div class="placeholder"></div><div class="placeholder"></div><div class="placeholder"></div>`;

}

function renderCalender () {

    calender.innerHTML = ""
    days.forEach(item => {
        if (item.date !== "placeholder") {
            calender.innerHTML += `
                <div class="day">
                    <p>Date: ${item.date}</p>
                    <p>Score: ${item.score}</p>
                </div>`
        }
    });

}

//Adds to or updates the exercise array
submitExercise.addEventListener("click", (e) => {

    e.preventDefault();

    const exerciseObj = {
        id: nameInput.value.toLowerCase().split(" ").join("-"),
        name: nameInput.value,
        score: scoreInput.value,
        count: 0,
    }

    if (currentExercise === -1) {
        exercises.unshift(exerciseObj)
    } else {
        exercises[currentExercise] = exerciseObj;
        exercises[currentExercise].count = exercises[currentExercise].count;
        currentExercise = -1;
        submitExercise.innerText = "Add Exercise";
    };

    addForm.close();
    resetInputs();
    render();
})

//closes the dialog when the close button is pressed
addCloseDialog.addEventListener("click", () => {
    resetInputs();
    addForm.close();
    currentExercise = -1;
})

//resets inputs
function resetInputs () {
    nameInput.value = "";
    scoreInput.value = "";
}

//deletes the selected exercise
const deleteExercise = (buttonEl) => {

    days.forEach(item => delete item[`${buttonEl.parentElement.id}-daily-input`]);
    exercises.splice(exercises.findIndex(item => item.id === buttonEl.parentElement.id), 1);

    render();
    calcScore();

}

//edits the selected exercise
const editExercise = (buttonEl) => {
    const exerciseIndex = exercises.findIndex(item => item.id === buttonEl.parentElement.id)
    currentExercise = exerciseIndex;
    nameInput.value = exercises[exerciseIndex].name;
    scoreInput.value = exercises[exerciseIndex].score;
    submitExercise.innerText = "Update Exercise";
    addForm.showModal();
}

//Closes the daily dialog, then updates the scores.
closeDaily.addEventListener("click", (e) => {
    e.preventDefault();

    if (days[0].date !== `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`) {
        days.unshift({date: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`})
    };

    days[0].score = 0;
    exercises.forEach((item) => {
        days[0][`${item.id}-daily-input`] = document.getElementById(`${item.id}-daily-input`).value;
        days[0].score += document.getElementById(`${item.id}-daily-input`).value * item.score;
    })

    render();

    storeData();

    dailyForm.close();
})

//Updates the score
function calcScore () {
    score = 0;
    days.forEach(item => {
        if (item.date !== "placeholder") score += item.score;
    })

    scoreEl.innerHTML = "";
    highScore.innerHTML = "";
    scoreEl.innerHTML = `Score: ${score}`
    highScore.innerHTML = `High Score: ${findHighScore()}`
}

//Searches for the day with the highest score
function findHighScore (max = 0) {
    days.forEach(item => {
        max = item.score > max ? item.score : max;
    })
    return max;
}

//Stores the day and exercise data
function storeData() {
    localStorage.setItem("daysStored", JSON.stringify(days));
    localStorage.setItem("storedExercises", JSON.stringify(exercises));
}

render();
console.log(days[0]);
console.log(exercises);