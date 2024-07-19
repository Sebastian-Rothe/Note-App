let notes = [];
let notetitlezs = [];
let trash = [];
let archive = [];

function renderPage() {
  load();
  let newNote = document.getElementById("newNote");
  let archiveDiv = document.getElementById("archiveDiv");
  let cardContainer = document.getElementById("cardContainer");
  let trashCan = document.getElementById("trashCan");

  generateCardContainer();
  generateArchive();
  generateTrashCan();
  save();
}

// add new note to array
function add() {
  let titlez = document.getElementById("titlezInput").value;
  let note = document.getElementById("noteInput").value;
  if (titlez === "" || note === "") {
    alert("Both Title and Note must be filled out!");
    return;
  }
  notetitlezs.push(titlez);
  notes.push(note);
  save();
  renderPage();
}

// move to archive
function moveToArchive(i) {
  let archiveTitlez = notetitlezs[i];
  let archiveNote = notes[i];
  notetitlezs.splice(i, 1);
  notes.splice(i, 1);
  archive.push({ title: archiveTitlez, note: archiveNote });
  save();
  renderPage();
}

// move from archive to bin
function moveToTrash(i) {
  let archiveTrash = [];
  archiveTrash = archive[i];
  trash.push(archiveTrash);
  archive.splice(i, 1);
  save();
  renderPage();
}

// restore to notes
function restoreToNotes(i) {
  let archiveItem = archive[i];
  notetitlezs.push(archiveItem.title);
  notes.push(archiveItem.note);
  archive.splice(i, 1);
  save();
  renderPage();
}

// restore from trash to notes
function restoreFromTrash(i) {
  let archiveItem = trash[i];
  notetitlezs.push(archiveItem.title);
  notes.push(archiveItem.note);
  trash.splice(i, 1);
  save();
  renderPage();
}

// delete note from archive//trash
function deleteNote(i) {
  trash.splice(i, 1);
  save();
  renderPage();
}

// save note in localStorage
function save() {
  let noteAsText = JSON.stringify(notes);
  let notetitlezAsText = JSON.stringify(notetitlezs);
  let archiveAsText = JSON.stringify(archive);
  let trashAsText = JSON.stringify(trash);
  localStorage.setItem("notes", noteAsText);
  localStorage.setItem("notetitlezs", notetitlezAsText);
  localStorage.setItem("archive", archiveAsText);
  localStorage.setItem("trash", trashAsText);
}

// load from localStorage
function load() {
  let noteAsText = localStorage.getItem("notes");
  let notetitlezAsText = localStorage.getItem("notetitlezs");
  let archiveAsText = localStorage.getItem("archive");
  let trashAsText = localStorage.getItem("trash");
  if (noteAsText && notetitlezAsText) {
    notes = JSON.parse(noteAsText);
    notetitlezs = JSON.parse(notetitlezAsText);
  }
  if (archiveAsText) {
    archive = JSON.parse(archiveAsText);
  }
  if (trashAsText) {
    trash = JSON.parse(trashAsText);
  } else {
    trash = [];
  }
}

// Note open as Popup
function openNote(i) {
  document.getElementById("openCard").classList.remove("d-none");
  document.getElementById("openNoteText").innerHTML = `
  <h2>${notetitlezs[i]}</h2>
    <p>${notes[i]}</p>`;
}

// close popup note
function closeNote() {
  document.getElementById("openCard").classList.add("d-none");
}

// getting the input field
function addButtonFuction() {
  newNote.innerHTML += `
    <div class="inputBox">
      <input id="titlezInput" type="text" placeholder="Title...">
      <textarea id="noteInput" type="text" placeholder="Note..." "></textarea>
      <div id="inputButtonDiv"><button id="inputButtonAdd" onclick="add()">Add</button></div>
    </div>
  `;
  let checking = document.querySelector("textarea");
  checking.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      add();
    }
  });
  document.getElementById("addButton").classList.add("d-none");
}

// generate to container containing the note cards
function generateCardContainer() {
  newNote.innerHTML = "";
  newNote.innerHTML += `<img id="addButton" src="./img/add.svg" alt="Add Icon" onclick="addButtonFuction()"></img>`;
  cardContainer.innerHTML = "";
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const titlez = notetitlezs[i];

    cardContainer.innerHTML += `
      <div  class="card" onclick="openNote(${i})">
        <div class="left-card">
          <b>${notetitlezs[i]}</b> 
          <p  class="d-none">${notes[i]}</p>
        </div>
        <button id="archiveButton" class="" onclick="event.stopPropagation(); moveToArchive(${i})">Archive</button>
      </div>
      <div id="openCard" class="d-none" onclick="closeNote(${i})">
        <div  class="popUp-bg"  >
          <div id="openNoteText" class="notePopUp">
            <h2>${notetitlezs[i]}</h2>
            <p>${notes[i]}</p>
          </div>
        </div>
      </div>
    `;
  }
}

// generate the archive
function generateArchive() {
  archiveDiv.innerHTML = "";
  archiveDiv.innerHTML += `<h2><img id="archiveIcon" src="./img/archiveIcon.svg" alt="archiveIcon" onclick="showHideArchive()"></h2>`;
  archiveDiv.innerHTML += `<div id="archiveContent" class="archiveContent d-none"></div>`;

  for (let i = 0; i < archive.length; i++) {
    const archivedItem = archive[i];
    const archivedTitle = archivedItem.title;
    const archivedNote = archivedItem.note;

    archiveContent.innerHTML += `
      <div class="card">
        <b>${archivedTitle}</b> <br />
        <p class="d-none">${archivedNote}</p>
        <button onclick="moveToTrash(${i})">
          <img src="./img/trash.svg" alt="trash can" />
        </button>
        <button onclick="restoreToNotes(${i})">Restore</button>
      </div>
    `;
  }
}

// generate the trash can
function generateTrashCan() {
  trashCan.innerHTML = "";
  trashCan.innerHTML += `<h2><img id="mainDivTrashIcon" src="./img/trash.svg" alt="trashCan" onclick="showHideTrash()"></h2>`;
  trashCan.innerHTML += `<div id="trashContent" class="trashContent d-none"></div>`;
  trashContent.innerHTML += `<div id="deleteAllButton"><button onclick="deleteAllTrash()">Empty Trash</button></div>`;

  for (let i = 0; i < trash.length; i++) {
    const archivedItem = trash[i];
    const archivedTitle = archivedItem.title;
    const archivedNote = archivedItem.note;

    trashContent.innerHTML += `
      <div class="card">
        <b>${archivedTitle}</b> <br />
        <p class="d-none">${archivedNote}</p>
        <button onclick="deleteNote(${i})">
          <img src="./img/trash.svg" alt="trash can" />
        </button>
        <button onclick="restoreFromTrash(${i})">Restore</button>
      </div>
    `;
  }
}

// show and hide content of trash onclick on icon
function showHideTrash() {
  let HideAndShow = document.getElementById("trashContent");
  HideAndShow.classList.toggle("d-none");
}

// show and hide content of archive onclick on icon
function showHideArchive() {
  let HideAndShow = document.getElementById("archiveContent");
  HideAndShow.classList.toggle("d-none");
}

// empty trash
function deleteAllTrash() {
  trash = [];
  save();
  renderPage();
}
