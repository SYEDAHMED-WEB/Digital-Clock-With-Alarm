// =====================================
// DIGITAL CLOCK WITH ALARM
// =====================================

// Clock Elements
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const ampm = document.getElementById("ampm");
const date = document.getElementById("date");

// Alarm Elements
const alarmHour = document.getElementById("alarmHour");
const alarmMinute = document.getElementById("alarmMinute");
const alarmPeriod = document.getElementById("alarmPeriod");

const setAlarmBtn = document.getElementById("setAlarm");
const stopAlarmBtn = document.getElementById("stopAlarm");
const alarmStatus = document.getElementById("alarmStatus");

// Alarm Variables
let alarmTime = "";
let alarmPlaying = false;
let alarmTriggered = false;

let audioContext = null;
let oscillator = null;

// =====================================
// Populate Hour Dropdown
// =====================================

for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = String(i).padStart(2, "0");
    alarmHour.appendChild(option);
}

// =====================================
// Populate Minute Dropdown
// =====================================

for (let i = 0; i < 60; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = String(i).padStart(2, "0");
    alarmMinute.appendChild(option);
}

// =====================================
// Update Clock
// =====================================

function updateClock() {

    const now = new Date();

    let hr = now.getHours();
    let min = now.getMinutes();
    let sec = now.getSeconds();

    let period = hr >= 12 ? "PM" : "AM";

    let displayHour = hr % 12;
    if (displayHour === 0) displayHour = 12;

    hours.textContent = String(displayHour).padStart(2, "0");
    minutes.textContent = String(min).padStart(2, "0");
    seconds.textContent = String(sec).padStart(2, "0");
    ampm.textContent = period;

    date.textContent = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    // Current Time

    const currentTime =
        `${String(displayHour).padStart(2, "0")}:${String(min).padStart(2, "0")} ${period}`;

    // Alarm Check

    if (
        currentTime === alarmTime &&
        !alarmTriggered
    ) {

        alarmTriggered = true;

        startAlarm();

    }

}

// =====================================
// Start Alarm
// =====================================

function startAlarm() {

    if (alarmPlaying) return;

    alarmPlaying = true;

    stopAlarmBtn.style.display = "block";

    alarmStatus.innerHTML = "🔔 Alarm Ringing...";

    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    oscillator = audioContext.createOscillator();

    const gainNode = audioContext.createGain();

    oscillator.type = "square";

    oscillator.frequency.value = 900;

    gainNode.gain.value = 0.15;

    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);

    oscillator.start();

}

// =====================================
// Stop Alarm
// =====================================

function stopAlarm() {

    if (!alarmPlaying) return;

    try {

        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
            oscillator = null;
        }

        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }

    } catch (err) {
        console.log(err);
    }

    alarmPlaying = false;

    stopAlarmBtn.style.display = "none";

    alarmStatus.innerHTML = "Alarm Stopped";

    // Clear alarm after stopping
    alarmTime = "";

}

// =====================================
// Set Alarm
// =====================================

setAlarmBtn.addEventListener("click", () => {

    const hr = String(alarmHour.value).padStart(2, "0");

    const min = String(alarmMinute.value).padStart(2, "0");

    const period = alarmPeriod.value;

    alarmTime = `${hr}:${min} ${period}`;

    alarmTriggered = false;

    alarmStatus.innerHTML =
        `✅ Alarm Set for ${alarmTime}`;

});

// =====================================
// Stop Alarm Button
// =====================================

stopAlarmBtn.addEventListener("click", stopAlarm);

// =====================================
// Start Clock
// =====================================

updateClock();

setInterval(updateClock, 1000);