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

const reservations = []; // title day startHour endHour
const freeDays = ["Saturday", "Sunday"];
let pagination = 0;
let days = getWeekDays();

const calender = document.getElementById("calender");

document.getElementById("left").addEventListener("click", (e) => {
  pagination--;
  days = getWeekDays(pagination);
  calender.innerHTML = "";
  printDays();
  printHours();
});

document.getElementById("right").addEventListener("click", (e) => {
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
      field.innerText = days[j].date;
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
  [
    "2024-11-27": {
      [
        [
        "start":
        "end":
        "tilte":
        ]
      ]
    }
  ]
*/