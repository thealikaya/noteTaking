/**
 * @copyright codewithsadee 2023
 */

'use strict';

const addEventOnElements = function (elements, eventType, callback){
    elements.forEach(element => {
        element.addEventListener(eventType,callback);
    });
}


const getGreetingMsg = function (currentHour){
    const greeting = 
    currentHour < 5 ? "Night" :
    currentHour < 12 ? "Morning" :
    currentHour < 15 ? "Noon" :
    currentHour < 17 ? "Afternoon" :
    currentHour < 20 ? "Evening" :
    "Night"

    return `Good ${greeting}`;
}

let lastActiveNavItem;

const activeNotebook = function () {
    lastActiveNavItem?.classList.remove("active");
    this.classList.add("active");
    lastActiveNavItem = this;
}

const makeElemEditable = function (element) {
    element.setAttribute("contenteditable",true);
    element.focus();
}


/**
 * Generates a unique ID based on the current timestamp
 * 
 * @returns {string} A string representation of the current timestamp
 * 
 */

const generateID = function () {
    return new Date().getTime().toString();
}


/**
 * Finds a notebook in database by its ID
 * 
 * @param {Object} db - The database containing the notebooks 
 * @param {*} notebookId - The ID of the notebook to find.
 * @returns {Object | undefined} The found notebook object, or undefined if not found
 */
const findNotebook =  function (db, notebookId) {
    return db.notebooks.find(notebook => notebook.id === notebookId);
}

/**
 * Find the index of a notebook in an array of notebook based on its ID
 * @param {Object} db - The object containing an array of notebooks 
 * @param {string} notebookId  - The ID of the notebook to find
 * @returns {number} The index of the found notebook, or -1 if not found
 */

const findNotebookIndex = function (db, notebookId){
    return db.notebooks.findIndex(item => item.id === notebookId);
}

/**
 * Convert a timestamp in milliseconds to a human-readable relative time string.
 * @param {number} millisecond - The timestamp in milliseconds to convert
 * @returns {string} A string represanting the relative time (e.g. "Just now",
 * "5 min ago", "3 hours ago", "2 days ago");
 */

const getRelativeTime = function(milliseconds){
    const currentTime = new Date().getTime();
    const minute = Math.floor((currentTime - milliseconds) / 1000 / 60);
    const hour = Math.floor(minute / 60);
    const day = Math.floor(hour / 24);
    return minute < 1 ? "Just now" : minute < 60 ? `${minute} min ago`
    : hour < 24 ? `${hour} hour ago` : `${day} day ago`;
}


/**
 * Finds a specific note by its ID within a database of notebook and their notes
 * @param {Object} db - The database containing notebooks and notes 
 * @param {string} noteId - The ID of the note to find
 * @returns {Object | undefined} The found note object, or undefined if not found
 */


const findNote = (db, noteId) => {
    let note;
    for(const notebook of db.notebooks){
        note = notebook.notes.find(note => note.id === noteId);
        if(note) break;
    }
    return note;
}

/**
 * Finds the index of a note in a notebook's array of notes based on its ID.
 * @param {Object} notebook - The notebook object containing an array of notes 
 * @param {string} noteId - The ID of the note to find 
 * @returns {number} The index of the found note, or -1 if not found
 */

const findNoteIndex = function(notebook, noteId){
    return notebook.notes.findIndex(note => note.id === noteId);
}

export{
    addEventOnElements,
    getGreetingMsg,
    activeNotebook,
    makeElemEditable,
    generateID,
    findNotebook,
    findNotebookIndex,
    getRelativeTime,
    findNote,
    findNoteIndex
}
