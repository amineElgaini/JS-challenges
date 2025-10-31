const types = {
  vip: "bg-red-600",
  standard: "bg-green-500",
  groupe: "bg-blue-600",
};

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
const popupmode = document.getElementById("popupmode");
const deleteButton = document.getElementById("delete");
const eventType = document.getElementById("eventType");

const save = document.getElementById("save");

const popup = document.getElementById("popup");
const createReservation = document.getElementById("createReservation");
const closeBtn = document.getElementById("closePopup");

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
      startHour: 10,
      type: "standard",
      startMin: 30,
      endHour: 12,
      endMin: 0,
      title: "Meeting",
      numberOfPeople: 3,
    },
    {
      type: "groupe",
      startHour: 2,
      startMin: 30,
      endHour: 4,
      endMin: 30,
      title: "Meeting2",
      numberOfPeople: 3,
    },
  ],
  "2025-10-28": [
    {
      type: "vip",
      startHour: 14,
      startMin: 0,
      endHour: 15,
      endMin: 30,
      title: "Lunch",
      numberOfPeople: 4,
    },
  ],
};

let pagination = 0;
let days = getWeekDays();
let currentlyEditedReservationDate = "";
let currentlyEditedReservationIndex = -1;


function isItAlreadyReserved(date, startHour, startMin, endHour, endMin) {
  startTime = startHour * 60 + startMin;
  endTime = endHour * 60 + endMin;

  if (endTime <= startTime) {
    showToast("Date end is smaller than date begin!", false);
    return false;
  }

  if (!reservations[date]) {
    return true;
  }


  for (const [index, event] of reservations[date].entries()) {
    takendStartTime = event.startHour * 60 + event.startMin;
    takendEndTime = event.endHour * 60 + event.endMin;

    if (
      currentlyEditedReservationDate == date &&
      index == currentlyEditedReservationIndex
    ) {
      continue;

    } else if (
      (startTime >= takendStartTime && startTime < takendEndTime) ||
      (endTime < takendStartTime && endTime >= takendStartTime)
    ) {
      
      alert("reservation false 1");
      showToast("Error!", false);
      return false;
      
    } else if (startTime < takendStartTime && endTime > takendStartTime) {
      alert("reservation false 2");
      showToast("Error!", false);
      return false;
      
    }
  }
  return true;
}


function showToast(message, right=false) {
  const color = right ? "bg-green-600" : "bg-red-600";
  
  const toast = document.createElement("div");
  toast.classList.add("custom-toast", color);
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

const reservationSpacing = {
  0: 0,
  15: 25,
  30: 50,
  45: 75,
};

function printNewReservation(newReservation, date, index) {
  const element = document.querySelector(
    `[data-date="${date}"][data-hour="${newReservation.startHour}"]`
  );

  if (!element) return;

  element.style.position = "relative";

  const reservationElement = document.createElement("div");
  reservationElement.innerHTML = `
    ${newReservation.title}
  `;

  let top = reservationSpacing[newReservation.startMin];
  startTime = newReservation.startHour * 60 + newReservation.startMin;
  endTime = newReservation.endHour * 60 + newReservation.endMin;
  let height = endTime - startTime;

  reservationElement.classList.add(types[newReservation.type]);
  reservationElement.style.cssText = `
  position: absolute;
  z-index: 2;
  top: ${top}%;
  height: ${height}px;
  left: 4px;
  right: 4px;
  border-radius: 0.5rem;
  color: white;
  padding: 6px 8px;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
`;

  element.appendChild(reservationElement);

  reservationElement.setAttribute("data-date", date);
  reservationElement.setAttribute("data-index", index);

  reservationElement.addEventListener("click", (e) => {
    let date = e.target.getAttribute("data-date");
    let index = e.target.getAttribute("data-index");

    let reservation = reservations[date][index];

    currentlyEditedReservationDate = date;
    currentlyEditedReservationIndex = index;

    eventTitleInput.value = reservation.title;
    eventDateInput.value = date;
    personsInput.value = reservation.numberOfPeople;
    startHourInput.value = reservation.startHour;
    startMinInput.value = reservation.startMin;
    endHourInput.value = reservation.endHour;
    endMinInput.value = reservation.endMin;
    eventType.value = reservation.type;

    popupmode.innerText = `Update Reservation: ${reservation.title}`;
    popup.style.display = "block";
    deleteButton.style.display = "block";
  });
}

// delete logic
deleteButton.addEventListener("click", (e) => {
  reservations[currentlyEditedReservationDate].splice(
    currentlyEditedReservationIndex,
    1
  );
  calender.innerHTML = "";

  printDays();
  printHours();
  deleteButton.style.display = "none";
  popup.style.display = "none";
  currentlyEditedReservationDate = "";
  currentlyEditedReservationIndex = -1;
});

function isNotAValidDate(eventDate) {
  const date = new Date(eventDate);
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday

  if (day === 0 || day === 6) {
    return true;
  }
  return false;
}

save.addEventListener("click", (e) => {
  e.preventDefault();

  const title = eventTitleInput.value.trim();
  const eventDate = eventDateInput.value;
  const numberOfPeople = +personsInput.value;
  const startHour = +startHourInput.value;
  const startMin = +startMinInput.value;
  const endHour = +endHourInput.value;
  const endMin = +endMinInput.value;
  const type = eventType.value;

  if (!eventDate) {
    alert("Please select a date.");
    return;
  }
  if (!title) {
    alert("Please enter a title.");
    return;
  }
  if (!numberOfPeople || numberOfPeople <= 0) {
    alert("Number of persons must be greater than 0.");
    return;
  }
  if (startHour === "" || startMin === "" || endHour === "" || endMin === "") {
    alert("Please fill in start and end time.");
    return;
  }

  if (!(type in types)) {
    alert("Enter a type.");
    return;
  }

  if (isNotAValidDate(eventDate)) {
    alert("you can't reserve in weekend");
    return;
  }

  if (isItAlreadyReserved(eventDate, startHour, startMin, endHour, endMin)) {
    
    const newReservation = {
      title,
      numberOfPeople,
      startHour,
      startMin,
      endHour,
      endMin,
      type
    };

    if (currentlyEditedReservationIndex != -1) {
      
      if (currentlyEditedReservationDate !== eventDate) {
        reservations[currentlyEditedReservationDate].splice(
          currentlyEditedReservationIndex,
          1
        );
        
        reservations[eventDate] ||= [];
        reservations[eventDate].push(newReservation) - 1;
      } else {
        reservations[currentlyEditedReservationDate][
          currentlyEditedReservationIndex
        ] = newReservation; // this will create another one
      }

      
      showToast("Edited Sucesfuly", true);
    } else {
      reservations[eventDate] ||= [];
      reservations[eventDate].push(newReservation) - 1;
      showToast("Added Sucesfuly", true);
    }

    calender.innerHTML = "";

    printDays();
    printHours();
    popup.style.display = "none";
    currentlyEditedReservationDate = "";
    currentlyEditedReservationIndex = -1;
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
  emptyField.innerHTML = `<span class="text-gray-400 font-semibold">#</span>`;
  emptyField.classList.add("bg-gray-100");
  calender.append(emptyField);

  days.forEach((element) => {
    let day = craeteField();
    day.setAttribute("data-date", element.date);
    day.innerHTML = `
      <div class="flex flex-col items-center">
        <span class="text-blue-600 font-semibold text-sm uppercase tracking-wide">${element.day}</span>
        <span class="text-gray-600 text-xs mt-1">${element.date}</span>
      </div>
    `;
    day.classList.add("bg-gray-50", "hover:bg-blue-50", "transition");
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
  printReservations();
}

function craeteField() {
  const field = document.createElement("div");

  field.classList.add(
    "border",
    "border-gray-200",
    "p-2",
    "text-center",
    "h-[60px]",
    "bg-white",
    "hover:bg-gray-50",
    "transition"
  );
  return field;
}

function printReservations() {
  for (const reservation in reservations) {
    const date = reservation;
    for (const [index, res] of reservations[date].entries()) {
      printNewReservation(res, date, index);
    }
  }
}

printDays();
printHours();



createReservation.addEventListener("click", () => {

  popupmode.innerText = `New Reservation`;
  eventTitleInput.value = "test";
  eventDateInput.value = "2025-10-31";
  personsInput.value = 2;
  startHourInput.value = 1;
  startMinInput.value = 0;
  endHourInput.value = 2;
  endMinInput.value = 0;

  // eventTitleInput.value = "";
  // eventDateInput.value = "";
  // personsInput.value = "";
  // startHourInput.value = "";
  // startMinInput.value = "";
  // endHourInput.value = "";
  // endMinInput.value = "";

  popup.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
  deleteButton.style.display = "none";
});
