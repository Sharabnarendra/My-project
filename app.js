// ****** SELECT ITEMS **********
const form = document.querySelector('.todo-form');
const alert = document.querySelector('.alert');
const todo = document.getElementById('todo');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.todo-container');
const list = document.getElementById('todo-list');
const clearBtn = document.querySelector('.clear-btn');

//  ****** EDIT ITEMS **********
let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItem);

clearBtn.addEventListener('click', clearItems);

window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = todo.value;
    const id = new Date().getTime().toString();
    if (value !== '' && !editFlag) {
        const element = document.createElement('article');
        let attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.classList.add('todo-item');
        element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
            <!-- edit btn -->
            <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
            </button>
            <!-- delete btn -->
            <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
            </button>
        </div>
        `;

        // Event listeners for edit button
        const editBtn = element.querySelector('.edit-btn');
        editBtn.addEventListener('click', editItem);

        // Event listeners for delete button
        const deleteBtn = element.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', deleteItem);

        //append child to the list
        list.appendChild(element);

        // Display the container
        container.classList.add('show-container');

        // Display alerts
        displayAlert('Item added to the list', 'success');

        //Add to the localstorage
        addToLocalStorage(id, value);

    }

    else if (value !== '' && editFlag) {
        editElement.innerHTML = value;

        // Display alerts
        displayAlert('Value changed', 'success');

        // Edit the localstorage
        editLocalStorage(editID, value);
    }

    else {
        displayAlert('please enter a value', 'danger');
    }

    // Set back to Default
    setBackToDefault();
}

function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;

    todo.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;

    submitBtn.textContent = 'Edit';
}

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;

    list.removeChild(element);

    if (list.children.length === 0) {
        container.classList.remove('show-container');
    }

    displayAlert('Item removed', 'danger');
    removeFromLocalStorage(id);

}

function clearItems() {
    const items = document.querySelectorAll('.todo-item');
    if (items.length > 0) {
        items.forEach(item => {
            list.removeChild(item);
        });
    }

    container.classList.remove('show-container');
    displayAlert('Empty list', 'danger');
    setBackToDefault();
    localStorage.removeItem("list");
}

function setBackToDefault() {
    todo.value = "";
    editFlag = false;
    editID = "";

    submitBtn.textContent = 'Submit';
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    const todo = { id, value };
    let items = getLocalStorage();

    items.push(todo);
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if (item.id != id) {
            return item;
        }
    });

    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });

    localStorage.setItem("list", JSON.stringify(items));
}

// ****** SETUP ITEMS **********
function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) {
        items.forEach(item => {
            createListItem(item.id, item.value);
        });
        container.classList.add('show-container');
    }
}

function createListItem(id, value) {
    const element = document.createElement('article');
    let attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add('todo-item');
    element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
            <!-- edit btn -->
            <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
            </button>
            <!-- delete btn -->
            <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
            </button>
        </div>
        `;

    // Event listeners for edit button
    const editBtn = element.querySelector('.edit-btn');
    editBtn.addEventListener('click', editItem);

    // Event listeners for delete button
    const deleteBtn = element.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', deleteItem);

    //append child to the list
    list.appendChild(element);
}