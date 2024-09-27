/**
 * @copyright codewithsadee 2023
 */

'use strict';

import { generateID,findNotebook,findNotebookIndex,findNote,findNoteIndex } from "./utils.js";


//DB Object

let notekeeperDB = {};

/**
 * Initializes a local database, If the data exist in local storage, it is loaded;
 * otherwise a new empty database structure is created and stored
 */

const initDB = function () {
    const db = localStorage.getItem("notekeeperDB");

    if(db)
        notekeeperDB = JSON.parse(db);
    else{
        notekeeperDB.notebooks = [];
        localStorage.setItem("notekeeperDB", JSON.stringify(notekeeperDB));
    }
}

initDB();

/**
 * Reads and loads the localStorage data in to the global variable 'notekeeperDB'
 */
const readDB = function (){
    notekeeperDB = JSON.parse(localStorage.getItem('notekeeperDB'));
}

/**
 * Writes the current state of the global variable 'notekeeperDB' to local storage
 */

const writeDB = function (){
    localStorage.setItem("notekeeperDB", JSON.stringify(notekeeperDB));
}


export const db = {
    post : {
        notebook(name){
            readDB();
            const notebookData = {
                id:generateID(),
                name,
                notes: []
            }
            notekeeperDB.notebooks.push(notebookData);
            writeDB();
            return notebookData;
        },
        /**
         * Adds a new note a specified notebook in the databases
         * 
         * @function
         * @param {string} notebookId - The ID of the notebook to add the note to.
         * @param {Object} object  - The note object to add
         * @returns {Object} The newly created note object
         */
        note(notebookId, object){
            readDB();

            const notebook = findNotebook(notekeeperDB, notebookId);

            const noteData = {
                id: generateID(),
                notebookId,
                ...object,
                postedOn : new Date().getTime()
            }

            console.log(noteData);
            notebook.notes.unshift(noteData);
            writeDB();
            return noteData;
        }
    },

    get :{

        /**
         * Retrieves all notebooks from the database
         * 
         * function
         * returns {ArrayObject} an array of notebook objects
         */
        notebook()
        {
            readDB();

            return notekeeperDB.notebooks;
        },

        /**
         * Retrives all notes within a specified notebook
         * 
         * @function 
         * @param {string} notebookId - The ID of the notebook to retrieve notes from
         * @return {Array<Object>} An array of note objects
         */
        note(notebookId){
            readDB();

            const notebook = findNotebook(notekeeperDB, notebookId);
            return notebook.notes;
        }
    },

    update : {
        /**
         * Updates the name of a notebook in the databases
         * 
         * @function
         * @param {string} notebookId - The ID of the notebook to update
         * @param {string} name - The new name for the notebook
         * @returns {Object} The updated notebook object.
         */
        notebook(notebookId, name) {
            readDB();
            const notebook = findNotebook(notekeeperDB,notebookId);
            notebook.name = name;
            writeDB();

            return notebook;
        },

        /**
         * Updates the content of a note in the database.
         * @function
         * @param {string} noteId - The ID of the note to update 
         * @param {Object} object - The updated data for the note.
         * @returns {Object} The updated note object.
         */
        note(noteId, object){
            readDB();
            const oldNote = findNote(notekeeperDB, noteId);
            const newNote = Object.assign(oldNote, object);
            writeDB();
            return newNote;
        }


    },

    delete : {
        /**
         * Deletes a notebook from the database
         * 
         * @function
         * @param {string} notebookId - The Id of the notebook to delete
         */
        notebook(notebookId){
            readDB();

            const notebookIndex = findNotebookIndex(notekeeperDB, notebookId);
            notekeeperDB.notebooks.splice(notebookIndex, 1);    
            writeDB();
        },

        /**
         * Deletes a note from a specified notebook in the database.
         * 
         * @function
         * @param {string} notebookId - The ID of the notebook containing the note to delete
         * @param {string} noteId - The ID of the note to delete.
         * @returns {Array<Object>} An array of remaining notes in the notebook
         * 
         */

        note(notebookId,noteId){
            readDB();

            const notebook = findNotebook(notekeeperDB, notebookId);
            const noteIndex = findNoteIndex(notebook, noteId);
            notebook.notes.splice(noteIndex, 1);
            writeDB();

            return notebook.notes;
        }
    }



}

