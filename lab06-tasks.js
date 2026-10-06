/* =====================================================
   Lab 06 Tasks - Course Planner, ID Card Generator,
   Registration Form and Student Dashboard
   Course: Full Stack Web Development (CS-301L)

   Note: lab06Escape() is reused from lab06.js, which
   is loaded before this file.
===================================================== */

/* =====================================================
   TASK 1 - INTERACTIVE COURSE PLANNER
===================================================== */
const plannerCourses = []; // { name, completed }

const plannerInput = document.getElementById("plannerInput");
const plannerList = document.getElementById("plannerList");
const plannerMessage = document.getElementById("plannerMessage");

function plannerRender() {
  plannerList.innerHTML = "";

  plannerCourses.forEach((course, index) => {
    const li = document.createElement("li");
    li.className = "mb-1";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = (index + 1) + ". " + course.name;
    nameSpan.className = "planner-name";
    if (course.completed) {
      nameSpan.classList.add("planner-completed");
    }

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "btn btn-outline-danger btn-sm ms-2";
    delBtn.setAttribute("data-index", index);

    li.appendChild(nameSpan);
    li.appendChild(delBtn);
    plannerList.appendChild(li);
  });

  const total = plannerCourses.length;
  const completed = plannerCourses.filter((c) => c.completed).length;
  document.getElementById("plannerTotal").textContent = total;
  document.getElementById("plannerCompleted").textContent = completed;
  document.getElementById("plannerRemaining").textContent = total - completed;
}

function plannerShowMessage(text, isError) {
  plannerMessage.textContent = text;
  plannerMessage.className = isError ? "text-danger" : "text-success";
}

document.getElementById("plannerAddBtn").addEventListener("click", () => {
  const name = plannerInput.value.trim();

  if (name === "") {
    plannerShowMessage("Error: Course name cannot be empty.", true);
    return;
  }

  const duplicate = plannerCourses.some(
    (course) => course.name.toLowerCase() === name.toLowerCase()
  );
  if (duplicate) {
    plannerShowMessage("Error: Course already exists.", true);
    return;
  }

  plannerCourses.push({ name: name, completed: false });
  plannerShowMessage("Course added: " + name, false);
  plannerInput.value = "";
  plannerInput.focus();
  plannerRender();
});

// Event delegation: one listener handles every Delete button
// and every course-name click, even for items added later
plannerList.addEventListener("click", (event) => {
  const delBtn = event.target.closest("button[data-index]");
  if (delBtn) {
    const index = Number(delBtn.getAttribute("data-index"));
    plannerCourses.splice(index, 1);
    plannerRender();
    return;
  }

  const nameSpan = event.target.closest(".planner-name");
  if (nameSpan) {
    const index = Number(
      nameSpan.parentElement.querySelector("button").getAttribute("data-index")
    );
    plannerCourses[index].completed = !plannerCourses[index].completed;
    plannerRender();
  }
});

document.getElementById("plannerClearBtn").addEventListener("click", () => {
  plannerCourses.length = 0;
  plannerShowMessage("", false);
  plannerRender();
});

document.getElementById("plannerLongestBtn").addEventListener("click", () => {
  const items = plannerList.querySelectorAll("li");
  items.forEach((li) => li.classList.remove("planner-longest"));

  if (items.length === 0) {
    plannerShowMessage("Error: No courses in the list.", true);
    return;
  }

  let longest = items[0];
  items.forEach((li) => {
    if (li.textContent.length > longest.textContent.length) {
      longest = li;
    }
  });
  longest.classList.add("planner-longest");
  plannerShowMessage("Longest course highlighted.", false);
});

plannerRender();

/* =====================================================
   TASK 2 - LIVE STUDENT ID CARD GENERATOR
===================================================== */
const idName = document.getElementById("idName");
const idRoll = document.getElementById("idRoll");
const idDept = document.getElementById("idDept");
const idSemester = document.getElementById("idSemester");
const idColor = document.getElementById("idColor");
const idShowCgpa = document.getElementById("idShowCgpa");
const idCgpaWrap = document.getElementById("idCgpaWrap");
const idCgpa = document.getElementById("idCgpa");
const idCard = document.getElementById("idCard");

function idCardUpdate() {
  const name = idName.value.trim();
  const roll = idRoll.value.trim();
  const dept = idDept.value;
  const semester = idSemester.value;
  const color = idColor.value;

  document.getElementById("cardName").textContent = name || "Your Name";
  document.getElementById("cardRoll").textContent = roll || "BSCS-000";
  document.getElementById("cardDept").textContent = dept || "Not selected";
  document.getElementById("cardSemester").textContent = semester || "-";

  // Live character counter (maxlength = 30)
  const left = idName.maxLength - idName.value.length;
  document.getElementById("idCharsLeft").textContent =
    "Characters left: " + left;

  // Card background from the color select (element.style)
  idCard.style.backgroundColor = color;

  // CGPA badge only when the checkbox is checked
  const cgpaRow = document.getElementById("cardCgpaRow");
  if (idShowCgpa.checked) {
    idCgpaWrap.style.display = "block";
    cgpaRow.style.display = "block";
    document.getElementById("cardCgpa").textContent = idCgpa.value || "0.00";
  } else {
    idCgpaWrap.style.display = "none";
    cgpaRow.style.display = "none";
  }

  // Read-only summary, updated live with a template literal
  document.getElementById("idSummary").value =
    `Name: ${name || "Your Name"}\n` +
    `Roll No: ${roll || "BSCS-000"}\n` +
    `Department: ${dept || "Not selected"}\n` +
    `Semester: ${semester || "-"}\n` +
    `CGPA: ${idShowCgpa.checked ? (idCgpa.value || "0.00") : "hidden"}`;
}

// input event for text/number fields, change event for selects/checkbox
[idName, idRoll, idSemester, idCgpa].forEach((field) => {
  field.addEventListener("input", idCardUpdate);
});
[idDept, idColor, idShowCgpa].forEach((field) => {
  field.addEventListener("change", idCardUpdate);
});

document.getElementById("idResetBtn").addEventListener("click", () => {
  document.getElementById("idCardForm").reset();
  idCardUpdate();
});

idCardUpdate();

/* =====================================================
   TASK 3 - COURSE REGISTRATION FORM (HTML5 + JS)
===================================================== */
const courseForm = document.getElementById("courseForm");
const cfPassword = document.getElementById("cfPassword");
const cfConfirm = document.getElementById("cfConfirm");
const cfDob = document.getElementById("cfDob");
const cfPhone = document.getElementById("cfPhone");
const cfPhoneMsg = document.getElementById("cfPhoneMsg");

// Custom rule: password must contain at least one digit
cfPassword.addEventListener("input", () => {
  if (cfPassword.value !== "" && !/[0-9]/.test(cfPassword.value)) {
    cfPassword.setCustomValidity("Password must contain at least one digit.");
  } else {
    cfPassword.setCustomValidity("");
  }
  cfPasswordStrength();
});

// Live password strength meter: Weak / Medium / Strong
function cfPasswordStrength() {
  const value = cfPassword.value;
  const box = document.getElementById("cfStrength");

  const weak = /[a-z]/;
  const medium = /(?=.*[A-Z])(?=.*[0-9])/;
  const strong = /(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

  if (value.length === 0) {
    box.textContent = "";
    return;
  }
  if (strong.test(value)) {
    box.textContent = "Strong";
    box.style.color = "green";
  } else if (medium.test(value)) {
    box.textContent = "Medium";
    box.style.color = "orange";
  } else if (weak.test(value)) {
    box.textContent = "Weak";
    box.style.color = "red";
  } else {
    box.textContent = "";
  }
}

// Custom rule: both passwords must match
function cfCheckMatch() {
  if (cfConfirm.value !== cfPassword.value) {
    cfConfirm.setCustomValidity("Passwords do not match.");
  } else {
    cfConfirm.setCustomValidity("");
  }
}
cfPassword.addEventListener("input", cfCheckMatch);
cfConfirm.addEventListener("input", cfCheckMatch);

// Custom rule: student must be at least 16 years old
cfDob.addEventListener("input", () => {
  if (cfDob.value === "") {
    cfDob.setCustomValidity("");
    return;
  }
  const birth = new Date(cfDob.value);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const birthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());
  if (!birthdayPassed) {
    age--;
  }
  if (age < 16) {
    cfDob.setCustomValidity("You must be at least 16 years old.");
  } else {
    cfDob.setCustomValidity("");
  }
});

// Live message under the Phone field using the validity object
cfPhone.addEventListener("input", () => {
  const state = cfPhone.validity;
  if (state.valueMissing) {
    cfPhoneMsg.textContent = "Phone is required.";
    cfPhoneMsg.className = "form-text text-danger";
  } else if (state.patternMismatch) {
    cfPhoneMsg.textContent = "Phone must look like 03001234567.";
    cfPhoneMsg.className = "form-text text-danger";
  } else {
    cfPhoneMsg.textContent = "Phone looks good.";
    cfPhoneMsg.className = "form-text text-success";
  }
});

// Show Bootstrap validation styles after the first submit attempt
document.getElementById("cfSubmitBtn").addEventListener("click", () => {
  courseForm.classList.add("was-validated");
});

// Show / Hide password
document.getElementById("cfShowPwd").addEventListener("change", function () {
  const type = this.checked ? "text" : "password";
  cfPassword.type = type;
  cfConfirm.type = type;
});

// Runs only when every field is valid
courseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Read values with FormData (uses the name attributes)
  const data = Object.fromEntries(new FormData(courseForm));

  document.getElementById("cfOutput").innerHTML = `
    <div class="border rounded p-3 mb-3">
      <h5 class="text-success">Registration Successful</h5>
      <p class="mb-0">
        <strong>Name:</strong> ${lab06Escape(data.fullName.trim())}<br>
        <strong>Email:</strong> ${lab06Escape(data.email.trim())}<br>
        <strong>Phone:</strong> ${lab06Escape(data.phone.trim())}<br>
        <strong>Date of Birth:</strong> ${lab06Escape(data.dob)}<br>
        <strong>Course:</strong> ${lab06Escape(data.course)}
      </p>
    </div>`;

  courseForm.reset();
  courseForm.classList.remove("was-validated");
  cfPhoneMsg.textContent = "";
});

/* =====================================================
   TASK 4 - STUDENT MANAGEMENT DASHBOARD
===================================================== */
const dashStudents = [
  { name: "Sara Ahmed", roll: "BSCS-023", dept: "Software Engineering",
    semester: 5, cgpa: 3.80, email: "sara@example.com" },
  { name: "Ali Khan", roll: "BSCS-001", dept: "Computer Science",
    semester: 6, cgpa: 3.45, email: "ali@example.com" },
  { name: "Fatima Raza", roll: "BSCS-045", dept: "Software Engineering",
    semester: 3, cgpa: 3.10, email: "fatima@example.com" },
  { name: "Ahmed Raza", roll: "BSCS-002", dept: "Computer Science",
    semester: 6, cgpa: 2.75, email: "ahmed@example.com" },
  { name: "Hassan Ali", roll: "BSCS-031", dept: "Computer Science",
    semester: 5, cgpa: 2.30, email: "hassan@example.com" },
  { name: "Ayesha Noor", roll: "BSCS-014", dept: "Data Science",
    semester: 4, cgpa: 1.90, email: "ayesha@example.com" }
];

let dashSearchText = "";
let dashDeptFilter = "All";
let dashSortDir = "desc"; // "desc" = highest first, "asc" = lowest first
let dashEditRoll = null;

const dashList = document.getElementById("dashList");

// Grade-based status using a function and the ternary operator
function dashStatus(cgpa) {
  return cgpa >= 3.00 ? "Excellent"
       : cgpa >= 2.50 ? "Good"
       : cgpa >= 2.00 ? "Satisfactory"
       : "Academic Warning";
}

function dashStatusColor(cgpa) {
  return cgpa >= 3.00 ? "text-success"
       : cgpa >= 2.50 ? "text-primary"
       : cgpa >= 2.00 ? "text-warning"
       : "text-danger";
}

function dashRender() {
  // Search + department filter work together
  const filtered = dashStudents.filter((student) => {
    const text = dashSearchText.toLowerCase();
    const matchesSearch =
      student.name.toLowerCase().includes(text) ||
      student.roll.toLowerCase().includes(text);
    const matchesDept =
      dashDeptFilter === "All" || student.dept === dashDeptFilter;
    return matchesSearch && matchesDept;
  });

  // Sort a copy so the original order is kept
  const sorted = filtered.slice().sort((a, b) =>
    dashSortDir === "desc" ? b.cgpa - a.cgpa : a.cgpa - b.cgpa
  );

  dashList.innerHTML = "";
  if (sorted.length === 0) {
    dashList.innerHTML = "<p class='text-muted'>No students found.</p>";
  }

  sorted.forEach((student) => {
    const { name, roll, dept, semester, cgpa, email } = student;
    const status = dashStatus(cgpa);

    const card = document.createElement("div");
    card.className = "border rounded p-3 mb-3";
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h5>Student: ${lab06Escape(name)}</h5>
          <p class="mb-0">
            <strong>Roll No:</strong> ${lab06Escape(roll)}<br>
            <strong>Department:</strong> ${lab06Escape(dept)}<br>
            <strong>Semester:</strong> ${semester}<br>
            <strong>CGPA:</strong> ${cgpa.toFixed(2)}<br>
            <strong>Status:</strong>
            <span class="${dashStatusColor(cgpa)}">${status}</span>
          </p>
        </div>
        <div>
          <button class="btn btn-outline-primary btn-sm me-1"
                  data-action="edit" data-roll="${lab06Escape(roll)}">Edit CGPA</button>
          <button class="btn btn-outline-danger btn-sm"
                  data-action="delete" data-roll="${lab06Escape(roll)}">Delete</button>
        </div>
      </div>`;
    dashList.appendChild(card);
  });

  dashRenderStats();
}

function dashRenderStats() {
  const total = dashStudents.length;
  const sum = dashStudents.reduce((result, s) => result + s.cgpa, 0);
  const average = total > 0 ? (sum / total).toFixed(2) : "0.00";

  let highest = null;
  dashStudents.forEach((s) => {
    if (!highest || s.cgpa > highest.cgpa) {
      highest = s;
    }
  });

  const warnings = dashStudents.filter((s) => s.cgpa < 2.00).length;

  document.getElementById("dashStats").innerHTML = `
    <div class="col-6 col-md-3 mb-2">
      <div class="border rounded p-2 bg-white">
        <div class="fs-4 fw-bold">${total}</div>
        <div class="small text-muted">Total Students</div>
      </div>
    </div>
    <div class="col-6 col-md-3 mb-2">
      <div class="border rounded p-2 bg-white">
        <div class="fs-4 fw-bold">${average}</div>
        <div class="small text-muted">Average CGPA</div>
      </div>
    </div>
    <div class="col-6 col-md-3 mb-2">
      <div class="border rounded p-2 bg-white">
        <div class="fs-4 fw-bold">${highest ? highest.cgpa.toFixed(2) : "0.00"}</div>
        <div class="small text-muted">Highest${highest ? " (" + highest.name + ")" : ""}</div>
      </div>
    </div>
    <div class="col-6 col-md-3 mb-2">
      <div class="border rounded p-2 bg-white">
        <div class="fs-4 fw-bold">${warnings}</div>
        <div class="small text-muted">Academic Warning</div>
      </div>
    </div>`;
}

function dashShowMessage(text, type) {
  const box = document.getElementById("dashMessage");
  box.innerHTML = `<div class="alert alert-${type} mb-0">${text}</div>`;
}

// Event delegation: one listener handles every Edit and Delete
// button, even for cards created later
dashList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const roll = button.getAttribute("data-roll");
  const action = button.getAttribute("data-action");
  const index = dashStudents.findIndex((s) => s.roll === roll);

  if (action === "delete" && index !== -1) {
    const removed = dashStudents.splice(index, 1)[0];
    dashRender();
    dashShowMessage(
      `${lab06Escape(removed.name)} (${lab06Escape(removed.roll)}) was removed. ` +
      "The roll number can be registered again.",
      "warning"
    );
  }

  if (action === "edit" && index !== -1) {
    dashEditRoll = roll;
    document.getElementById("editCgpa").value =
      dashStudents[index].cgpa.toFixed(2);
    document.getElementById("editCgpaError").textContent = "";
    document.getElementById("editTitle").textContent =
      "Edit CGPA - " + dashStudents[index].name;
    const modal = new bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
  }
});

// Save the edited CGPA (validated, no prompt() used)
document.getElementById("editSaveBtn").addEventListener("click", () => {
  const input = document.getElementById("editCgpa");
  const value = input.value.trim();
  const cgpa = Number(value);
  const errorBox = document.getElementById("editCgpaError");

  if (value === "" || isNaN(cgpa) || cgpa < 0 || cgpa > 4) {
    errorBox.textContent = "Please enter a valid CGPA between 0 and 4.";
    input.classList.add("is-invalid");
    return;
  }

  const index = dashStudents.findIndex((s) => s.roll === dashEditRoll);
  if (index !== -1) {
    dashStudents[index].cgpa = Math.round(cgpa * 100) / 100;
    dashRender();
    dashShowMessage(
      `CGPA updated for ${lab06Escape(dashStudents[index].name)}.`,
      "success"
    );
  }

  input.classList.remove("is-invalid");
  bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
});

// Search while typing
document.getElementById("dashSearch").addEventListener("input", function () {
  dashSearchText = this.value.trim();
  dashRender();
});

// Department filter
document.getElementById("dashDept").addEventListener("change", function () {
  dashDeptFilter = this.value;
  dashRender();
});

// Sort toggle: highest-first <-> lowest-first
document.getElementById("dashSortBtn").addEventListener("click", function () {
  dashSortDir = dashSortDir === "desc" ? "asc" : "desc";
  this.textContent =
    dashSortDir === "desc" ? "Sort by CGPA: Low to High" : "Sort by CGPA: High to Low";
  dashRender();
});

/* ---- Add Student form: HTML5 attributes + validity API + custom rules ---- */
const dashForm = document.getElementById("dashForm");
const dashFields = ["dName", "dRoll", "dEmail", "dDept", "dSemester", "dCgpa"]
  .map((id) => document.getElementById(id));

function dashGetMessage(field) {
  const state = field.validity;
  if (state.valueMissing) return "This field is required.";
  if (state.typeMismatch) return "Please enter a valid email.";
  if (state.patternMismatch) return field.title || "Invalid format.";
  if (state.tooShort) return "Minimum " + field.minLength + " characters required.";
  if (state.rangeUnderflow) return "Minimum value is " + field.min + ".";
  if (state.rangeOverflow) return "Maximum value is " + field.max + ".";
  return "";
}

function dashSetError(field, message) {
  const error = document.getElementById(field.id + "Error");
  const isValid = message === "";
  error.textContent = message;
  field.classList.toggle("is-invalid", !isValid);
  field.classList.toggle("is-valid", isValid);
  return isValid;
}

function dashValidateField(field) {
  let message = dashGetMessage(field);

  // Custom rule: roll number must be unique
  if (message === "" && field.id === "dRoll") {
    const exists = dashStudents.some(
      (student) => student.roll === field.value.trim()
    );
    if (exists) {
      message = "This roll number is already registered.";
    }
  }

  return dashSetError(field, message);
}

dashFields.forEach((field) => {
  field.addEventListener("blur", () => dashValidateField(field));
  field.addEventListener("input", () => {
    if (field.classList.contains("is-invalid")) {
      dashValidateField(field);
    }
  });
});

dashForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const results = dashFields.map(dashValidateField);
  const allValid = results.every((result) => result === true);

  if (!allValid) {
    dashShowMessage("Please correct the highlighted fields.", "danger");
    dashForm.querySelector(".is-invalid").focus();
    return;
  }

  dashStudents.push({
    name: document.getElementById("dName").value.trim(),
    roll: document.getElementById("dRoll").value.trim(),
    email: document.getElementById("dEmail").value.trim(),
    dept: document.getElementById("dDept").value,
    semester: Number(document.getElementById("dSemester").value),
    cgpa: Number(document.getElementById("dCgpa").value)
  });

  dashForm.reset();
  dashFields.forEach((field) => {
    field.classList.remove("is-valid", "is-invalid");
    document.getElementById(field.id + "Error").textContent = "";
  });
  dashRender();
  dashShowMessage("Student added successfully.", "success");
});

// Initial render
dashRender();
