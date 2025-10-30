const calender = document.getElementById("calender");
const paginateLeft = document.getElementById("left");
const paginateRight = document.getElementById("right");

const eventTitleInput = document.getElementById("eventTitle");
const personsInput = document.getElementById("persons");

const eventDateInput = document.getElementById("event-date");
const startHourInput = document.getElementById("start-hour");
const startMinInput = document.getElementById("start-min");
const endHourInput = document.getElementById("end-hour");
const endMinInput = document.getElementById("end-min");

const save = document.getElementById("save");

function getWeekDays(pagination = 0) {
  // get monday of current week
  const today = new Date();
  const day = today.getDay(); // get current day index
  const diff = day === 0 ? -6 : 1 - day; // diff to back to monday
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + pagination * 7);

  const days = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dayName = d.toLocaleString("en-US", { weekday: "short" }); // e.g. Mon, Tue
    const date = d.toISOString().split("T")[0]; // e.g. 2025-10-29
    days.push({ day: dayName, date: date });
  }

  return days;
} // [{day, date}] A Week

let reservations = {
  "2025-10-27": [
    {
      startHour: "10",
      startMin: "30",
      endHour: "12",
      endMin: "00",
      title: "Meeting",
    },
    {
      startHour: "2",
      startMin: "30",
      endHour: "4",
      endMin: "00",
      title: "Meeting2",
    },
  ],
  "2025-10-28": [
    {
      startHour: "14",
      startMin: "00",
      endHour: "15",
      endMin: "30",
      title: "Lunch",
    },
  ],
};

const freeDays = ["Saturday", "Sunday"];
let pagination = 0;
let days = getWeekDays();
let currentlyEditedReservation = -1;

function isItAlreadyReserved(date, startHour, startMin, endHour, endMin) {
  if (!reservations[date]) {
    return true;
  }

  startTime = startHour * 60 + startMin;
  endTime = endHour * 60 + endMin;


  for (const event of reservations[date]) {
    takendStartTime = +event.startHour * 60 + +event.startMin;
    takendEndTime = +event.endHour * 60 + +event.endMin;

    if (startTime >= takendStartTime && startTime < takendEndTime) {
      console.log("you reservation can't start here");
      return false;
    } else if (endTime < takendStartTime && endTime >= takendStartTime) {
      console.log("your reservation can't end here");
      return false;
    }
  }
  // console.log("will be pushed");
  return true;
}

function printReservation(reservation) {}

save.addEventListener("click", (e) => {
  e.preventDefault();

  const title = eventTitleInput.value.trim();
  const eventDate = eventDateInput.value;
  const numberOfPeople = +personsInput.value;
  const startHour = +startHourInput.value;
  const startMin = +startMinInput.value;
  const endHour = +endHourInput.value;
  const endMin = +endMinInput.value;

  // if (!eventDate) {
  //   alert("Please select a date.");
  //   return;
  // }
  // if (!title) {
  //   alert("Please enter a title.");
  //   return;
  // }
  // if (!numberOfPeople || numberOfPeople <= 0) {
  //   alert("Number of persons must be greater than 0.");
  //   return;
  // }
  // if (startHour === "" || startMin === "" || endHour === "" || endMin === "") {
  //   alert("Please fill in start and end time.");
  //   return;
  // }

  if (isItAlreadyReserved(eventDate, startHour, startMin, endHour, endMin)) {
    reservations[eventDate] = {
      title,
      numberOfPeople,
      startHour,
      startMin,
      endHour,
      endMin,
    };
    popup.style.display = "none";
  }
});

paginateLeft.addEventListener("click", (e) => {
  pagination--;
  days = getWeekDays(pagination);
  calender.innerHTML = "";
  printDays();
  printHours();
});

paginateRight.addEventListener("click", (e) => {
  pagination++;
  days = getWeekDays(pagination);
  calender.innerHTML = "";
  printDays();
  printHours();
});

function printDays() {
  const emptyField = craeteField();
  emptyField.innerText = "-";
  calender.append(emptyField);

  days.forEach((element, i) => {
    let day = craeteField();
    day.setAttribute("data-date", element.date);
    day.innerText = element.day;
    calender.append(day);
  });
}

function printHours() {
  for (let i = 0; i < 24; i++) {
    // print hours
    let field = craeteField();
    field.innerText = i;
    calender.append(field);

    // print hours in days
    for (let j = 0; j < 7; j++) {
      let field = craeteField();
      field.setAttribute("data-date", days[j].date);
      field.setAttribute("data-hour", i);
      // field.innerText = days[j].date;
      calender.append(field);
    }
  }
}

function craeteField() {
  let field = document.createElement("div");
  field.classList.add("border", "p-2", "text-center");
  return field;
}
printDays();
printHours();

/*
  reservations: {
    "2024-11-27": {
        "startHour":
        "startMin":

        "endHour":
        "endMin":

        "tilte":
    }
  }
*/
