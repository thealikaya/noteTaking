'use strict';

// Module import
import { addEventOnElements,getGreetingMsg,activeNotebook,makeElemEditable } from "./utils.js";
import { Tooltip} from "./components/Tooltip.js";
import { db } from "./db.js";
import { client } from "./client.js";
import { NoteModal } from "./components/Modal.js";


// Toggle sidebar in small screen

const sidebar = document.querySelector('[data-sidebar]');
const sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');
const overlay = document.querySelector('[data-sidebar-overlay]');

addEventOnElements(sidebarTogglers,'click',function () {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
});


/***
 * show greeting message on homepage
 */

const greetElem = document.querySelector('[data-greeting]');
const currentHour = new Date().getHours();
greetElem.textContent = getGreetingMsg(currentHour);

/**
 * Show current data on homepage
 */

const currentDateElem = document.querySelector('[data-current-date]');
currentDateElem.textContent = new Date().toDateString().replace(' ',',');

/**
 * Initialize tooltip behaviour for all DOM elements with 'data-tooltip' attribute
 *  */ 

const tooltipElem = document.querySelectorAll("[data-tooltip]");
tooltipElem.forEach(elem => Tooltip(elem));

/**
 * Notebook create field
 */

const sidebarList = document.querySelector("[data-sidebar-list]");
const addNotebookBtn = document.querySelector("[data-add-notebook]");

const showNotebookField = function() {
    const navItem = document.createElement("div");
    navItem.classList.add("nav-item");
    navItem.innerHTML = `
        <span class="text text-label-large" data-notebook-field></span>
        <div class="state-layer"></div>
    `;
    sidebarList.appendChild(navItem);

    const navItemField = navItem.querySelector("[data-notebook-field]");

    //Active new created notebook and deactive the last one
    activeNotebook.call(navItem);

    //Make notebook field content editable and focus
    makeElemEditable(navItemField);

    //when user press "Enter" then crate notebook
    navItemField.addEventListener("keydown" , createNotebook);
}

addNotebookBtn.addEventListener("click",showNotebookField);


/**
 * Create new notebook
 * Create a notebook when the "Enter" key is pressed while editing a notebook name field
 * The new notebook is stored in the databases
 */

const createNotebook = function (event){
    if(event.key === "Enter"){
        //store new created notebook in database
        const notebookData = db.post.notebook(this.textContent || "Untitled");
        this.parentElement.remove();
        client.notebook.create(notebookData);
    }
}

/**
 * Renders the existing notebook list by retrieving data from the database
 * and passing it to the client
 */

const renderExistedNotebook = function () {
    const notebookList = db.get.notebook();
    client.notebook.read(notebookList);
}

renderExistedNotebook();


/**
 * Create new note
 * 
 * Attaches event listeners to a collection of DOM elements representing "Creating Note" buttons
 * When a button is clicked , it opens a modal for creating a new note and handles the submission
 * of the new note to the database and client
 */

const noteCreateBtns = document.querySelectorAll("[data-note-create-btn]");

addEventOnElements(noteCreateBtns, 'click', function() {
    //Create and open a new modal
    const modal = NoteModal();
    modal.open();

    //Handle the submission of the new note to the database and client
    modal.onSubmit(noteObj => {
        const activeNotebookId = document.querySelector("[data-notebook].active").dataset.notebook;
        const noteData = db.post.note(activeNotebookId,noteObj);
        client.note.create(noteData);
        modal.close();
    })
});

/**
 * Renders existing notes in the active notebook. Retrieves note
 * data from the database based on the active notebook's ID
 * and uses the client to display the notes
 */

const renderExistedNote = function() {
    const activeNotebookId = document.querySelector("[data-notebook].active")?.dataset.notebook;
    if(activeNotebookId){
        const noteList = db.get.note(activeNotebookId);
        //Display existing note
        client.note.read(noteList);
    }
}

renderExistedNote();