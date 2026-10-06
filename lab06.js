/* =====================================================
   Lab 06 - DOM Manipulation, Events, Form Validation
   and Dynamic Updates
   Course: Full Stack Web Development (CS-301L)
===================================================== */

/* =====================================================
   LAB 06
   HELPER FUNCTIONS
===================================================== */
function lab06Show(id, html) {
  document.getElementById(id).innerHTML = html;
}

// Converts special characters so user text is displayed
// as text, never as HTML (prevents HTML injection)
function lab06Escape(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function lab06ShowAlert(id, type, message) {
  lab06Show(
    id,
    `<div class="alert alert-${type} mb-0">${message}</div>`
  );
}

/* =====================================================
   LAB 06
   1. DOM SELECTION
===================================================== */
const lab06List = document.getElementById("lab06CourseList");
const lab06Heading =
  document.querySelector("#lab06 .section-heading h2");
const lab06Courses = document.querySelectorAll(".lab06-course");
const lab06Important =
  document.querySelector(".lab06-important");

let lab06CourseNames = "";
lab06Courses.forEach((course, index) => {
  lab06CourseNames +=
    (index + 1) + ". " + course.textContent.trim() + "<br>";
});

lab06Show(
  "selectionOutput",
  "Section Heading: " + lab06Heading.textContent +
  "<br>" +
  "Total Courses Found: " + lab06Courses.length +
  "<br>" +
  "Important Course: " + lab06Important.textContent.trim() +
  "<br>" +
  "First Child: " +
  lab06List.firstElementChild.textContent.trim() +
  "<br>" +
  "Last Child: " +
  lab06List.lastElementChild.textContent.trim() +
  "<br><br>" +
  "<strong>All Courses:</strong><br>" + lab06CourseNames
);

/* =====================================================
   LAB 06
   2. CHANGING CONTENT, STYLES AND ATTRIBUTES
===================================================== */
const lab06Text = document.getElementById("manipulateText");
const lab06Link = document.getElementById("manipulateLink");
let lab06TextChanged = false;
let lab06ColorIndex = 0;
const lab06Colors = ["#c0392b", "#27ae60", "#2980b9", "#8e44ad"];

// Change content
document.getElementById("changeTextBtn")
  .addEventListener("click", () => {
    lab06TextChanged = !lab06TextChanged;

    if (lab06TextChanged) {
      lab06Text.innerHTML =
        "This text was <strong>changed</strong> using innerHTML.";
    } else {
      lab06Text.textContent = "This is the original text.";
    }

    lab06Show("manipulateOutput", "Content updated.");
  });

// Toggle a CSS class
document.getElementById("toggleStyleBtn")
  .addEventListener("click", () => {
    lab06Text.classList.toggle("lab06-highlight");

    lab06Show(
      "manipulateOutput",
      "Has highlight class: " +
      lab06Text.classList.contains("lab06-highlight")
    );
  });

// Change inline style
document.getElementById("changeColorBtn")
  .addEventListener("click", () => {
    const color = lab06Colors[lab06ColorIndex];
    lab06Text.style.color = color;
    lab06Text.style.fontSize = "20px";
    lab06ColorIndex = (lab06ColorIndex + 1) % lab06Colors.length;

    lab06Show("manipulateOutput", "Text color changed to " + color);
  });

// Change attributes
document.getElementById("changeLinkBtn")
  .addEventListener("click", () => {
    lab06Link.setAttribute("href", "https://www.w3schools.com");
    lab06Link.setAttribute("target", "_blank");
    lab06Link.textContent = "Visit W3Schools";

    lab06Show(
      "manipulateOutput",
      "href = " + lab06Link.getAttribute("href") +
      "<br>target = " + lab06Link.getAttribute("target")
    );
  });

/* =====================================================
   LAB 06
   3. CREATING AND REMOVING ELEMENTS
===================================================== */
const lab06ExtraCourses = [
  "Software Engineering",
  "Computer Vision",
  "Cloud Computing",
  "Data Structures",
  "Mobile Development"
];
let lab06AddIndex = 0;
const lab06DynamicList = document.getElementById("dynamicList");

function lab06UpdateCount() {
  lab06Show(
    "dynamicOutput",
    "Items in list: " + lab06DynamicList.children.length
  );
}

document.getElementById("addItemBtn")
  .addEventListener("click", () => {
    if (lab06AddIndex >= lab06ExtraCourses.length) {
      lab06Show("dynamicOutput", "No more courses to add.");
      return;
    }

    const li = document.createElement("li");
    li.textContent = lab06ExtraCourses[lab06AddIndex];
    li.className = "lab06-item";
    lab06DynamicList.appendChild(li);

    lab06AddIndex++;
    lab06UpdateCount();
  });

document.getElementById("removeItemBtn")
  .addEventListener("click", () => {
    const last = lab06DynamicList.lastElementChild;

    if (last) {
      last.remove();
      lab06AddIndex--;
    }
    lab06UpdateCount();
  });

lab06UpdateCount();

/* =====================================================
   LAB 06
   4. CLICK EVENTS
===================================================== */
let lab06ClickCount = 0;

document.getElementById("clickBtn")
  .addEventListener("click", function (event) {
    lab06ClickCount++;

    lab06Show(
      "clickOutput",
      "Button clicked " + lab06ClickCount + " time(s)" +
      "<br>Event type: " + event.type +
      "<br>Target id: " + event.target.id +
      "<br>Mouse position: X = " + event.clientX +
      ", Y = " + event.clientY
    );
  });

document.getElementById("resetClickBtn")
  .addEventListener("click", () => {
    lab06ClickCount = 0;
    lab06Show("clickOutput", "Counter has been reset.");
  });

/* =====================================================
   LAB 06
   5. INPUT AND CHANGE EVENTS
===================================================== */
const lab06NameInput = document.getElementById("liveName");
const lab06CourseSelect = document.getElementById("liveCourse");

function lab06UpdateInputOutput() {
  const name = lab06NameInput.value.trim();
  const course = lab06CourseSelect.value;
  const remaining =
    lab06NameInput.maxLength - lab06NameInput.value.length;

  lab06Show(
    "inputOutput",
    "Hello, " + lab06Escape(name || "Guest") + "!" +
    "<br>Characters left: " + remaining +
    "<br>Favourite course: " +
    lab06Escape(course || "Not selected")
  );
}

lab06NameInput.addEventListener("input", lab06UpdateInputOutput);
lab06CourseSelect.addEventListener("change", lab06UpdateInputOutput);

lab06UpdateInputOutput();

/* =====================================================
   LAB 06
   6. FORM SUBMIT EVENT
===================================================== */
const lab06FeedbackForm = document.getElementById("feedbackForm");

lab06FeedbackForm.addEventListener("submit", function (event) {
  event.preventDefault();   // stop the page from reloading

  const data = Object.fromEntries(new FormData(lab06FeedbackForm));
  const name = data.name.trim();
  const message = data.message.trim();

  if (name === "" || message === "") {
    lab06ShowAlert(
      "feedbackOutput",
      "danger",
      "Please enter both your name and message."
    );
    return;
  }

  lab06ShowAlert(
    "feedbackOutput",
    "success",
    `Thank you, <strong>${lab06Escape(name)}</strong>!<br>` +
    `Your message: ${lab06Escape(message)}`
  );

  lab06FeedbackForm.reset();
});

/* =====================================================
   LAB 06
   7. BASIC JAVASCRIPT VALIDATION
===================================================== */
// Shows or clears the error message for one field.
// Returns true when the field is valid.
function lab06SetError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + "Error");
  const isValid = message === "";

  error.textContent = message;
  field.classList.toggle("is-invalid", !isValid);
  field.classList.toggle("is-valid", isValid);

  return isValid;
}

function lab06ValidateName() {
  const value = document.getElementById("basicName").value.trim();
  let message = "";

  if (value === "") {
    message = "Name is required.";
  } else if (value.length < 3) {
    message = "Name must be at least 3 characters.";
  } else if (!/^[A-Za-z ]+$/.test(value)) {
    message = "Name can contain letters and spaces only.";
  }
  return lab06SetError("basicName", message);
}

function lab06ValidateEmail() {
  const value = document.getElementById("basicEmail").value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let message = "";

  if (value === "") {
    message = "Email is required.";
  } else if (!pattern.test(value)) {
    message = "Please enter a valid email address.";
  }
  return lab06SetError("basicEmail", message);
}

function lab06ValidateAge() {
  const value = document.getElementById("basicAge").value.trim();
  const age = Number(value);
  let message = "";

  if (value === "") {
    message = "Age is required.";
  } else if (isNaN(age)) {
    message = "Age must be a number.";
  } else if (age < 16 || age > 60) {
    message = "Age must be between 16 and 60.";
  }
  return lab06SetError("basicAge", message);
}

// Validate when the user leaves a field
document.getElementById("basicName")
  .addEventListener("blur", lab06ValidateName);
document.getElementById("basicEmail")
  .addEventListener("blur", lab06ValidateEmail);
document.getElementById("basicAge")
  .addEventListener("blur", lab06ValidateAge);

// Validate everything when the form is submitted
document.getElementById("basicForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Run all checks (the array makes sure no check is skipped)
    const results = [
      lab06ValidateName(),
      lab06ValidateEmail(),
      lab06ValidateAge()
    ];
    const allValid = results.every((result) => result === true);

    if (allValid) {
      lab06ShowAlert(
        "basicOutput", "success",
        "All fields are valid. Form accepted!"
      );
    } else {
      lab06ShowAlert(
        "basicOutput", "danger",
        "Please fix the errors shown above."
      );
    }
  });

/* =====================================================
   LAB 06
   8. HTML5 FORM VALIDATION
===================================================== */
const lab06H5Form = document.getElementById("html5Form");
const lab06Username = document.getElementById("h5Username");
const lab06Password = document.getElementById("h5Password");
const lab06Confirm = document.getElementById("h5Confirm");

// Live username feedback using the validity object
function lab06ShowUsernameState() {
  const state = lab06Username.validity;
  const box = document.getElementById("h5UsernameState");
  let message = "";

  if (state.valueMissing) {
    message = "Username is required.";
  } else if (state.tooShort) {
    message = "Too short: minimum 4 characters.";
  } else if (state.patternMismatch) {
    message = "Only letters, numbers and underscore allowed.";
  } else {
    message = "Username looks good.";
  }

  box.textContent = message;
  box.className = state.valid
    ? "form-text text-success"
    : "form-text text-danger";
}

lab06Username.addEventListener("input", lab06ShowUsernameState);

// Custom rule: both passwords must match
function lab06CheckPasswordMatch() {
  if (lab06Confirm.value !== lab06Password.value) {
    lab06Confirm.setCustomValidity("Passwords do not match.");
  } else {
    lab06Confirm.setCustomValidity("");
  }
}

lab06Password.addEventListener("input", lab06CheckPasswordMatch);
lab06Confirm.addEventListener("input", lab06CheckPasswordMatch);

// Show Bootstrap's green/red styles after the first attempt
document.getElementById("h5SubmitBtn")
  .addEventListener("click", () => {
    lab06CheckPasswordMatch();
    lab06H5Form.classList.add("was-validated");
  });

// This runs ONLY when every field is valid
lab06H5Form.addEventListener("submit", function (event) {
  event.preventDefault();

  lab06ShowAlert(
    "html5Output",
    "success",
    `Welcome, <strong>${lab06Escape(lab06Username.value)}</strong>!` +
    `<br>Email: ${lab06Escape(
      document.getElementById("h5Email").value
    )}` +
    `<br>Age: ${document.getElementById("h5Age").value}`
  );

  lab06H5Form.reset();
  lab06H5Form.classList.remove("was-validated");
  document.getElementById("h5UsernameState").textContent = "";
});

/* =====================================================
   LAB 06
   9. STUDENT REGISTRATION SYSTEM
===================================================== */
const lab06Students = [
  {
    name: "Ali Khan", roll: "BSCS-001",
    email: "ali@example.com", dept: "Computer Science",
    semester: 6, cgpa: 3.45
  },
  {
    name: "Sara Ahmed", roll: "BSCS-023",
    email: "sara@example.com", dept: "Software Engineering",
    semester: 5, cgpa: 3.8
  },
  {
    name: "Ayesha Noor", roll: "BSCS-014",
    email: "ayesha@example.com", dept: "Data Science",
    semester: 4, cgpa: 1.9
  }
];

const lab06RegForm = document.getElementById("regForm");
const lab06RegFields = [
  "regName", "regRoll", "regEmail",
  "regDept", "regSemester", "regCgpa"
].map((id) => document.getElementById(id));

// Converts the validity state into a readable message
function lab06GetMessage(field) {
  const state = field.validity;

  if (state.valueMissing) return "This field is required.";
  if (state.typeMismatch) return "Please enter a valid email.";
  if (state.patternMismatch) return field.title || "Invalid format.";
  if (state.tooShort) {
    return "Minimum " + field.minLength + " characters required.";
  }
  if (state.rangeUnderflow) return "Minimum value is " + field.min + ".";
  if (state.rangeOverflow) return "Maximum value is " + field.max + ".";
  if (state.stepMismatch) return "Please enter a valid number.";
  return "";
}

function lab06ValidateField(field) {
  let message = lab06GetMessage(field);

  // Custom rule: roll numbers must be unique
  if (message === "" && field.id === "regRoll") {
    const exists = lab06Students.some(
      (student) => student.roll === field.value.trim()
    );
    if (exists) {
      message = "This roll number is already registered.";
    }
  }

  return lab06SetError(field.id, message);
}

function lab06ClearValidation() {
  lab06RegFields.forEach((field) => {
    field.classList.remove("is-valid", "is-invalid");
    document.getElementById(field.id + "Error").textContent = "";
  });
}

let lab06SearchText = "";

function lab06RenderStudents() {
  const container = document.getElementById("regList");
  container.innerHTML = "";

  const visible = lab06Students.filter((student) => {
    const text = lab06SearchText.toLowerCase();
    return student.name.toLowerCase().includes(text) ||
           student.roll.toLowerCase().includes(text);
  });

  if (visible.length === 0) {
    container.innerHTML =
      "<p class='text-muted'>No students found.</p>";
    return;
  }

  visible.forEach((student) => {
    const { name, roll, email, dept, semester, cgpa } = student;
    const status = cgpa >= 2.0 ? "Eligible" : "Academic Warning";
    const color = cgpa >= 2.0 ? "text-success" : "text-danger";

    const card = document.createElement("div");
    card.className = "border rounded p-3 mb-3";
    card.innerHTML = `
      <div class="d-flex justify-content-between">
        <div>
          <h5>${lab06Escape(name)}</h5>
          <p class="mb-0">
            <strong>Roll No:</strong> ${lab06Escape(roll)}<br>
            <strong>Email:</strong> ${lab06Escape(email)}<br>
            <strong>Department:</strong> ${lab06Escape(dept)}<br>
            <strong>Semester:</strong> ${semester}<br>
            <strong>CGPA:</strong> ${cgpa.toFixed(2)}<br>
            <strong>Status:</strong>
            <span class="${color}">${status}</span>
          </p>
        </div>
        <div>
          <button class="btn btn-outline-danger btn-sm"
                  data-roll="${lab06Escape(roll)}">Delete</button>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

function lab06RenderStats() {
  const total = lab06Students.length;
  const eligible =
    lab06Students.filter((s) => s.cgpa >= 2.0).length;
  const sum =
    lab06Students.reduce((result, s) => result + s.cgpa, 0);
  const average = total > 0 ? (sum / total).toFixed(2) : "0.00";

  const stat = (label, value) => `
    <div class="col-4">
      <div class="border rounded p-2 bg-white">
        <div class="fs-4 fw-bold">${value}</div>
        <div class="small text-muted">${label}</div>
      </div>
    </div>`;

  lab06Show(
    "regSummary",
    stat("Total Students", total) +
    stat("Average CGPA", average) +
    stat("Eligible Students", eligible)
  );
}

function lab06Refresh() {
  lab06RenderStudents();
  lab06RenderStats();
}

// Validate each field when the user leaves it, and re-check
// while typing once the field has been marked invalid
lab06RegFields.forEach((field) => {
  field.addEventListener("blur", () => lab06ValidateField(field));
  field.addEventListener("input", () => {
    if (field.classList.contains("is-invalid")) {
      lab06ValidateField(field);
    }
  });
});

// Register a new student
lab06RegForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const results = lab06RegFields.map(lab06ValidateField);
  const allValid = results.every((result) => result === true);

  if (!allValid) {
    lab06ShowAlert(
      "regMessage", "danger",
      "Please correct the highlighted fields."
    );
    lab06RegForm.querySelector(".is-invalid").focus();
    return;
  }

  const student = {
    name: document.getElementById("regName").value.trim(),
    roll: document.getElementById("regRoll").value.trim(),
    email: document.getElementById("regEmail").value.trim(),
    dept: document.getElementById("regDept").value,
    semester: Number(document.getElementById("regSemester").value),
    cgpa: Number(document.getElementById("regCgpa").value)
  };

  lab06Students.push(student);

  // Reset FIRST: the reset event also clears regMessage,
  // so the success message must be shown after it
  lab06RegForm.reset();
  lab06ClearValidation();
  lab06Refresh();

  lab06ShowAlert(
    "regMessage", "success",
    `<strong>${lab06Escape(student.name)}</strong> ` +
    "was registered successfully."
  );
});

// Reset button
lab06RegForm.addEventListener("reset", () => {
  lab06ClearValidation();
  lab06Show("regMessage", "");
});

// Live search
document.getElementById("regSearch")
  .addEventListener("input", function () {
    lab06SearchText = this.value.trim();
    lab06RenderStudents();
  });

// Event delegation: ONE listener handles every Delete button,
// even for cards that are created later
document.getElementById("regList")
  .addEventListener("click", (event) => {
    const button = event.target.closest("button[data-roll]");
    if (!button) return;

    const index = lab06Students.findIndex(
      (student) => student.roll === button.dataset.roll
    );

    if (index !== -1) {
      const removed = lab06Students.splice(index, 1)[0];
      lab06Refresh();
      lab06ShowAlert(
        "regMessage", "warning",
        `${lab06Escape(removed.name)} was removed.`
      );
    }
  });

// Show the initial data when the page loads
lab06Refresh();
