// DOM Elements - Core UI
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const mainContent = document.querySelector('.main-content');
const navItems = document.querySelectorAll('.nav-item a');
const views = document.querySelectorAll('.view');

// DOM Elements - Dashboard
const boardsList = document.getElementById('boards-list');
const dashboardView = document.getElementById('dashboard-view');

// DOM Elements - Board View
const activeBoard = document.getElementById('active-board');
const boardTitle = document.getElementById('board-title');
const listsContainer = document.getElementById('lists-container');
const toggleViewBtn = document.getElementById('toggle-view-btn');

// DOM Elements - Modals and Forms
const createBoardBtn = document.getElementById('create-board-btn');
const createBoardModal = document.getElementById('create-board-modal');
const createBoardForm = document.getElementById('create-board-form');
const addListBtn = document.getElementById('add-list-btn');
const createListModal = document.getElementById('create-list-modal');
const createListForm = document.getElementById('create-list-form');
const createCardModal = document.getElementById('create-card-modal');
const createCardForm = document.getElementById('create-card-form');
const editCardModal = document.getElementById('edit-card-modal');
const editCardForm = document.getElementById('edit-card-form');
const backToBoardsBtn = document.getElementById('back-to-boards-btn');
const deleteCardBtn = document.getElementById('delete-card-btn');

// DOM Elements - Modal Controls
const closeButtons = document.querySelectorAll('.close');
const cancelButtons = document.querySelectorAll('.cancel-btn');
const colorOptions = document.querySelectorAll('.color-option');
const labelOptions = document.querySelectorAll('.label-option');

// App State
let boards = JSON.parse(localStorage.getItem('kanban-boards')) || [];
let currentBoardId = null;
let isCanvasMode = false;

// Initialize the app
function init() {
    setupEventListeners();
    renderBoards();
    updateStats();
}

// Setup Event Listeners
function setupEventListeners() {
    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
    
    // Board creation
    createBoardBtn.addEventListener('click', () => openModal(createBoardModal));
    createBoardForm.addEventListener('submit', createBoard);
    
    // List creation
    addListBtn.addEventListener('click', () => openModal(createListModal));
    createListForm.addEventListener('submit', createList);
    
    // Card creation
    createCardForm.addEventListener('submit', createCard);
    
    // Card editing
    editCardForm.addEventListener('submit', updateCard);
    deleteCardBtn.addEventListener('click', deleteCard);
    
    // Navigation
    backToBoardsBtn.addEventListener('click', showDashboard);
    
    // Toggle view mode (Kanban/Canvas)
    toggleViewBtn.addEventListener('click', toggleViewMode);
    
    // Close modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Cancel buttons
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Color options
    colorOptions.forEach(option => {
        option.addEventListener('click', selectColor);
    });
    
    // Label options
    labelOptions.forEach(option => {
        option.addEventListener('click', selectLabel);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Handle pinned board clicks
    document.querySelectorAll('.pinned-boards a, .recent-boards a').forEach(boardLink => {
        boardLink.addEventListener('click', (e) => {
            e.preventDefault();
            const boardId = boardLink.dataset.boardId;
            openBoard(boardId);
        });
    });
}

// Sidebar Functions
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Change the toggle icon
    const icon = sidebarToggle.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
        icon.classList.remove('ph-caret-left');
        icon.classList.add('ph-caret-right');
    } else {
        icon.classList.remove('ph-caret-right');
        icon.classList.add('ph-caret-left');
    }
}

// Navigation Functions
function handleNavigation(e) {
    e.preventDefault();
    const viewName = this.dataset.view;
    
    // Update active nav item
    navItems.forEach(item => item.parentElement.classList.remove('active'));
    this.parentElement.classList.add('active');
    
    // Handle view switching
    if (viewName === 'dashboard') {
        showDashboard();
    } else if (viewName === 'boards') {
        showDashboard();
    } else if (viewName === 'canvas') {
        // For now, just show dashboard
        showDashboard();
    } else if (viewName === 'templates') {
        // For now, just show dashboard
        showDashboard();
    }
}

function showDashboard() {
    views.forEach(view => view.classList.add('hidden'));
    dashboardView.classList.remove('hidden');
    currentBoardId = null;
}

// Modal functions
function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
    
    // Reset forms
    if (modal.contains(createBoardForm)) createBoardForm.reset();
    if (modal.contains(createListForm)) createListForm.reset();
    if (modal.contains(createCardForm)) createCardForm.reset();
    if (modal.contains(editCardForm)) editCardForm.reset();
    
    // Reset color selections
    if (modal.contains(createBoardForm)) {
        colorOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.color === '#7C5DFA') {
                option.classList.add('selected');
            }
        });
    }
    
    // Reset label selections
    if (modal.contains(createCardForm) || modal.contains(editCardForm)) {
        labelOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.color === 'none') {
                option.classList.add('selected');
            }
        });
    }
}

// Color and Label Selection
function selectColor() {
    colorOptions.forEach(option => option.classList.remove('selected'));
    this.classList.add('selected');
}

function selectLabel() {
    labelOptions.forEach(option => option.classList.remove('selected'));
    this.classList.add('selected');
    
    const form = this.closest('form');
    const labelInput = form.querySelector('#label-color') || form.querySelector('#edit-label-color');
    if (labelInput) {
        labelInput.value = this.dataset.color;
    }
}

// Board functions
function createBoard(e) {
    e.preventDefault();
    
    const boardNameInput = document.getElementById('board-name');
    const boardName = boardNameInput.value.trim();
    const selectedColor = document.querySelector('.color-option.selected').dataset.color;
    
    if (boardName) {
        const newBoard = {
            id: Date.now().toString(),
            name: boardName,
            color: selectedColor,
            lists: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        boards.push(newBoard);
        saveBoards();
        renderBoards();
        updateStats();
        closeModal(createBoardModal);
    }
}

function renderBoards() {
    boardsList.innerHTML = '';
    
    if (boards.length === 0) {
        boardsList.innerHTML = '<div class="empty-state"><p>No boards yet. Create your first board!</p></div>';
        return;
    }
    
    boards.forEach(board => {
        const boardCard = document.createElement('div');
        boardCard.className = 'board-card';
        boardCard.style.borderLeftColor = board.color || '#7C5DFA';
        
        const lastUpdated = new Date(board.updatedAt).toLocaleDateString();
        
        boardCard.innerHTML = `
            <h3>${board.name}</h3>
            <div class="board-card-meta">
                <span>${board.lists.length} lists</span>
                <span>Updated: ${lastUpdated}</span>
            </div>
        `;
        
        boardCard.addEventListener('click', () => openBoard(board.id));
        
        boardsList.appendChild(boardCard);
    });
}

function openBoard(boardId) {
    currentBoardId = boardId;
    const board = boards.find(b => b.id === boardId);
    
    if (board) {
        boardTitle.textContent = board.name;
        renderLists(board);
        
        views.forEach(view => view.classList.add('hidden'));
        activeBoard.classList.remove('hidden');
        
        // Update the board's last accessed time
        board.updatedAt = new Date().toISOString();
        saveBoards();
    }
}

function updateStats() {
    // Update total boards count
    const totalBoardsElement = document.querySelector('.stat-value');
    if (totalBoardsElement) {
        totalBoardsElement.textContent = boards.length;
    }
    
    // Calculate completed and pending tasks
    let completedTasks = 0;
    let pendingTasks = 0;
    
    boards.forEach(board => {
        board.lists.forEach(list => {
            // Assuming the last list is "Done" or "Completed"
            if (list.name.toLowerCase().includes('done') || list.name.toLowerCase().includes('complete')) {
                completedTasks += list.cards.length;
            } else {
                pendingTasks += list.cards.length;
            }
        });
    });
    
    // Update stats
    const statsElements = document.querySelectorAll('.stat-value');
    if (statsElements.length >= 3) {
        statsElements[1].textContent = completedTasks;
        statsElements[2].textContent = pendingTasks;
    }
}

// List functions
function createList(e) {
    e.preventDefault();
    
    const listNameInput = document.getElementById('list-name');
    const listName = listNameInput.value.trim();
    
    if (listName && currentBoardId) {
        const board = boards.find(b => b.id === currentBoardId);
        
        if (board) {
            const newList = {
                id: Date.now().toString(),
                name: listName,
                cards: []
            };
            
            board.lists.push(newList);
            board.updatedAt = new Date().toISOString();
            saveBoards();
            renderLists(board);
            updateStats();
            closeModal(createListModal);
        }
    }
}

function renderLists(board) {
    listsContainer.innerHTML = '';
    
    if (board.lists.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<p>No lists yet. Add your first list!</p>';
        listsContainer.appendChild(emptyState);
        return;
    }
    
    board.lists.forEach(list => {
        const listElement = document.createElement('div');
        listElement.className = 'list';
        listElement.dataset.listId = list.id;
        
        listElement.innerHTML = `
            <div class="list-header">
                <h3 class="list-title">${list.name}</h3>
                <button class="add-card-btn" data-list-id="${list.id}" aria-label="Add Card">
                    <i class="ph-plus"></i>
                </button>
            </div>
            <div class="cards-container" data-list-id="${list.id}"></div>
        `;
        
        listsContainer.appendChild(listElement);
        
        // Add event listener to the add card button
        const addCardBtn = listElement.querySelector('.add-card-btn');
        addCardBtn.addEventListener('click', () => {
            document.getElementById('list-id').value = list.id;
            openModal(createCardModal);
        });
        
        // Render cards for this list
        const cardsContainer = listElement.querySelector('.cards-container');
        renderCards(list, cardsContainer);
        
        // Setup drag and drop for this list
        setupDragAndDrop(cardsContainer);
    });
}

// Card functions
function createCard(e) {
    e.preventDefault();
    
    const cardTitleInput = document.getElementById('card-title');
    const cardDescInput = document.getElementById('card-description');
    const listIdInput = document.getElementById('list-id');
    const labelColorInput = document.getElementById('label-color');
    
    const cardTitle = cardTitleInput.value.trim();
    const cardDesc = cardDescInput.value.trim();
    const listId = listIdInput.value;
    const labelColor = labelColorInput.value;
    
    if (cardTitle && listId && currentBoardId) {
        const board = boards.find(b => b.id === currentBoardId);
        
        if (board) {
            const list = board.lists.find(l => l.id === listId);
            
            if (list) {
                const newCard = {
                    id: Date.now().toString(),
                    title: cardTitle,
                    description: cardDesc,
                    labelColor: labelColor !== 'none' ? labelColor : null,
                    createdAt: new Date().toISOString()
                };
                
                list.cards.push(newCard);
                board.updatedAt = new Date().toISOString();
                saveBoards();
                renderLists(board);
                updateStats();
                closeModal(createCardModal);
            }
        }
    }
}

function renderCards(list, cardsContainer) {
    cardsContainer.innerHTML = '';
    
    if (list.cards.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-card';
        emptyState.textContent = 'No cards yet';
        cardsContainer.appendChild(emptyState);
        return;
    }
    
    list.cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.draggable = true;
        cardElement.dataset.cardId = card.id;
        
        let cardContent = '';
        
        // Add label if exists
        if (card.labelColor) {
            cardContent += `<div class="card-label" style="background-color: ${card.labelColor};"></div>`;
        }
        
        cardContent += `
            <h4 class="card-title">${card.title}</h4>
            ${card.description ? `<p class="card-description">${card.description}</p>` : ''}
        `;
        
        cardElement.innerHTML = cardContent;
        
        cardsContainer.appendChild(cardElement);
        
        // Add event listener to open edit modal
        cardElement.addEventListener('click', () => {
            document.getElementById('edit-card-title').value = card.title;
            document.getElementById('edit-card-description').value = card.description || '';
            document.getElementById('edit-card-id').value = card.id;
            document.getElementById('edit-list-id').value = list.id;
            document.getElementById('edit-label-color').value = card.labelColor || 'none';
            
            // Set the selected label
            labelOptions.forEach(option => {
                option.classList.remove('selected');
                if ((card.labelColor && option.dataset.color === card.labelColor) || 
                    (!card.labelColor && option.dataset.color === 'none')) {
                    option.classList.add('selected');
                }
            });
            
            openModal(editCardModal);
        });
        
        // Add drag events
        cardElement.addEventListener('dragstart', dragStart);
    });
}

function updateCard(e) {
    e.preventDefault();
    
    const cardTitleInput = document.getElementById('edit-card-title');
    const cardDescInput = document.getElementById('edit-card-description');
    const cardIdInput = document.getElementById('edit-card-id');
    const listIdInput = document.getElementById('edit-list-id');
    const labelColorInput = document.getElementById('edit-label-color');
    
    const cardTitle = cardTitleInput.value.trim();
    const cardDesc = cardDescInput.value.trim();
    const cardId = cardIdInput.value;
    const listId = listIdInput.value;
    const labelColor = labelColorInput.value;
    
    if (cardTitle && cardId && listId && currentBoardId) {
        const board = boards.find(b => b.id === currentBoardId);
        
        if (board) {
            const list = board.lists.find(l => l.id === listId);
            
            if (list) {
                const card = list.cards.find(c => c.id === cardId);
                
                if (card) {
                    card.title = cardTitle;
                    card.description = cardDesc;
                    card.labelColor = labelColor !== 'none' ? labelColor : null;
                    
                    board.updatedAt = new Date().toISOString();
                    saveBoards();
                    renderLists(board);
                    closeModal(editCardModal);
                }
            }
        }
    }
}

function deleteCard() {
    const cardId = document.getElementById('edit-card-id').value;
    const listId = document.getElementById('edit-list-id').value;
    
    if (cardId && listId && currentBoardId) {
        const board = boards.find(b => b.id === currentBoardId);
        
        if (board) {
            const list = board.lists.find(l => l.id === listId);
            
            if (list) {
                list.cards = list.cards.filter(c => c.id !== cardId);
                
                board.updatedAt = new Date().toISOString();
                saveBoards();
                renderLists(board);
                updateStats();
                closeModal(editCardModal);
            }
        }
    }
}

// View Mode Toggle
function toggleViewMode() {
    isCanvasMode = !isCanvasMode;
    
    if (isCanvasMode) {
        listsContainer.classList.add('canvas-mode');
        toggleViewBtn.innerHTML = '<i class="ph-columns"></i><span>Kanban View</span>';
    } else {
        listsContainer.classList.remove('canvas-mode');
        toggleViewBtn.innerHTML = '<i class="ph-layout"></i><span>Canvas View</span>';
    }
}

// Drag and Drop functionality
function setupDragAndDrop(container) {
    container.addEventListener('dragover', dragOver);
    container.addEventListener('dragenter', dragEnter);
    container.addEventListener('dragleave', dragLeave);
    container.addEventListener('drop', drop);
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', JSON.stringify({
        cardId: e.target.dataset.cardId,
        sourceListId: e.target.closest('.cards-container').dataset.listId
    }));
    
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function dragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function drop(e) {
    e.preventDefault();
    
    const container = e.currentTarget;
    container.classList.remove('drag-over');
    
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const targetListId = container.dataset.listId;
    
    if (data.sourceListId !== targetListId) {
        moveCard(data.cardId, data.sourceListId, targetListId);
    }
}

function moveCard(cardId, sourceListId, targetListId) {
    if (currentBoardId) {
        const board = boards.find(b => b.id === currentBoardId);
        
        if (board) {
            const sourceList = board.lists.find(l => l.id === sourceListId);
            const targetList = board.lists.find(l => l.id === targetListId);
            
            if (sourceList && targetList) {
                const cardIndex = sourceList.cards.findIndex(c => c.id === cardId);
                
                if (cardIndex !== -1) {
                    const card = sourceList.cards.splice(cardIndex, 1)[0];
                    targetList.cards.push(card);
                    
                    board.updatedAt = new Date().toISOString();
                    saveBoards();
                    renderLists(board);
                    updateStats();
                }
            }
        }
    }
}

// Local Storage
function saveBoards() {
    localStorage.setItem('kanban-boards', JSON.stringify(boards));
}

// Initialize the app
init(); 