// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Global Variables & Elements ---
    const userName = "Super Kid"; // Could be fetched from a backend or user input
    const initialSavedAmount = 50;
    const initialGoalAmount = 100;
    const initialPocketMoney = 25; // Initial pocket money balance

    // Element selectors
    const dynamicUserNameElements = document.querySelectorAll('#dynamicUserName, #userName');
    const savingsProgressBar = document.getElementById('savingsProgressBar');
    const savingsProgressText = document.getElementById('savingsProgressText');
    const savedAmountDisplay = document.getElementById('savedAmount');
    const goalAmountDisplay = document.getElementById('goalAmount');
    const addSavingsBtn = document.getElementById('addSavingsBtn');
    const newFactBtn = document.getElementById('newFactBtn');
    const funFactText = document.getElementById('funFactText');
    const completeChallengeBtn = document.getElementById('completeChallengeBtn');
    const challengeText = document.getElementById('challengeText');
    const navButtons = document.querySelectorAll('.nav-button');
    const pocketMoneyBalanceDisplay = document.getElementById('pocketMoneyBalance');
    const transactionList = document.getElementById('transactionList');

    // Savings Modal elements
    const addSavingsModal = document.getElementById('addSavingsModal');
    const savingsCloseButton = addSavingsModal.querySelector('.close-button');
    const confirmAddSavingsBtn = document.getElementById('confirmAddSavingsBtn');
    const savingsAmountInput = document.getElementById('savingsAmountInput');
    const savingsModalMessage = document.getElementById('savingsModalMessage');

    // Expense Modal elements
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const addExpenseModal = document.getElementById('addExpenseModal');
    const expenseCloseButton = addExpenseModal.querySelector('.close-button');
    const confirmAddExpenseBtn = document.getElementById('confirmAddExpenseBtn');
    const expenseAmountInput = document.getElementById('expenseAmountInput');
    const expenseModalMessage = document.getElementById('expenseModalMessage');

    // Generic Message Modal elements (replaces alert())
    const messageModal = document.getElementById('messageModal');
    const messageModalTitle = document.getElementById('messageModalTitle');
    const messageModalText = document.getElementById('messageModalText');
    const messageModalCloseBtn = document.getElementById('messageModalCloseBtn');
    const messageCloseButton = messageModal.querySelector('.close-button');


    // --- State Variables ---
    let currentSavedAmount = initialSavedAmount;
    let currentGoalAmount = initialGoalAmount;
    let currentPocketMoney = initialPocketMoney;

    // Fun facts and challenges
    const funFacts = [
        "Saving money is like planting a seed; it grows over time!",
        "Every little bit you save adds up to something big!",
        "Setting a goal helps you know what you're saving for!",
        "Needs are things you must have, wants are things you'd like to have.",
        "Making a list before shopping can help you save money.",
        "Turning off lights when you leave a room saves energy and money!",
        "Borrowing books from the library is a free way to read amazing stories."
    ];
    let currentFactIndex = 0;

    const challenges = [
        "Can you find 3 items at home you can recycle?",
        "Draw a picture of your biggest savings goal!",
        "Help with a chore without being asked!",
        "Read a new story or learn one new thing today!",
        "Share one thing you're grateful for."
    ];
    let currentChallengeIndex = 0;

    // --- Functions ---

    /**
     * Updates the user's name across the dashboard.
     */
    function updateUserNameDisplay() {
        dynamicUserNameElements.forEach(el => el.textContent = userName);
    }

    /**
     * Updates the savings progress bar and text.
     */
    function updateSavingsProgress() {
        const percentage = Math.min((currentSavedAmount / currentGoalAmount) * 100, 100);
        savingsProgressBar.style.width = `${percentage}%`;
        savingsProgressText.textContent = `${Math.round(percentage)}%`;
        savedAmountDisplay.textContent = `$${currentSavedAmount.toFixed(2)}`;
        goalAmountDisplay.textContent = `$${currentGoalAmount.toFixed(2)}`;

        if (percentage >= 100) {
            savingsProgressText.textContent = "Goal Reached! 🎉";
            // You could add more celebration visuals here
        }
    }

    /**
     * Updates the pocket money balance display.
     */
    function updatePocketMoneyDisplay() {
        pocketMoneyBalanceDisplay.textContent = `$${currentPocketMoney.toFixed(2)}`;
    }

    /**
     * Adds a new transaction to the history list.
     * @param {string} type - '+' for income, '-' for expense.
     * @param {number} amount - The amount of the transaction.
     * @param {string} description - A brief description of the transaction.
     */
    function addTransactionToHistory(type, amount, description) {
        const listItem = document.createElement('li');
        listItem.textContent = `${type} $${amount.toFixed(2)} (${description})`;
        transactionList.prepend(listItem); // Add to the top of the list
        // Limit the number of visible transactions if needed
        while (transactionList.children.length > 5) {
            transactionList.removeChild(transactionList.lastChild);
        }
    }

    /**
     * Displays a new fun fact.
     */
    function showNewFunFact() {
        currentFactIndex = (currentFactIndex + 1) % funFacts.length;
        funFactText.textContent = funFacts[currentFactIndex];
    }

    /**
     * Displays a new challenge.
     */
    function showNewChallenge() {
        currentChallengeIndex = (currentChallengeIndex + 1) % challenges.length;
        challengeText.textContent = challenges[currentChallengeIndex];
    }

    /**
     * Opens a specified modal.
     * @param {HTMLElement} modalElement - The modal DOM element to open.
     */
    function openModal(modalElement) {
        modalElement.style.display = 'flex'; // Use flex to center
    }

    /**
     * Closes a specified modal.
     * @param {HTMLElement} modalElement - The modal DOM element to close.
     */
    function closeModal(modalElement) {
        modalElement.style.display = 'none';
    }

    /**
     * Shows the generic message modal.
     * @param {string} title - The title for the message modal.
     * @param {string} message - The message text.
     */
    function showMessageModal(title, message) {
        messageModalTitle.textContent = title;
        messageModalText.textContent = message;
        openModal(messageModal);
    }

    /**
     * Handles adding savings from the modal.
     */
    function handleAddSavings() {
        const amountToAdd = parseFloat(savingsAmountInput.value);

        if (isNaN(amountToAdd) || amountToAdd <= 0) {
            savingsModalMessage.textContent = "Please enter a valid amount!";
            savingsModalMessage.style.color = "red";
            return;
        }

        currentSavedAmount += amountToAdd;
        updateSavingsProgress();
        savingsModalMessage.textContent = `Great! $${amountToAdd.toFixed(2)} added to your savings!`;
        savingsModalMessage.style.color = "green";
        addTransactionToHistory('+', amountToAdd, 'Savings Deposit');

        // Optionally close modal after a delay or keep it open
        setTimeout(() => {
            closeModal(addSavingsModal);
            savingsAmountInput.value = ''; // Clear input
            savingsModalMessage.textContent = ''; // Clear message
        }, 1500);
    }

    /**
     * Handles adding an expense from the modal.
     */
    function handleAddExpense() {
        const amountToDeduct = parseFloat(expenseAmountInput.value);

        if (isNaN(amountToDeduct) || amountToDeduct <= 0) {
            expenseModalMessage.textContent = "Please enter a valid amount!";
            expenseModalMessage.style.color = "red";
            return;
        }

        if (currentPocketMoney < amountToDeduct) {
            expenseModalMessage.textContent = "Not enough pocket money!";
            expenseModalMessage.style.color = "orange";
            return;
        }

        currentPocketMoney -= amountToDeduct;
        updatePocketMoneyDisplay();
        expenseModalMessage.textContent = `Expense of $${amountToDeduct.toFixed(2)} recorded!`;
        expenseModalMessage.style.color = "green";
        addTransactionToHistory('-', amountToDeduct, 'Expense');


        // Optionally close modal after a delay or keep it open
        setTimeout(() => {
            closeModal(addExpenseModal);
            expenseAmountInput.value = ''; // Clear input
            expenseModalMessage.textContent = ''; // Clear message
        }, 1500);
    }

    /**
     * Handles navigation button clicks.
     * @param {Event} event - The click event.
     */
    function handleNavClick(event) {
        navButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        // In a real app, this would trigger content changes or navigation.
        console.log(`${event.target.textContent} section selected (visual only).`);
    }


    // --- Event Listeners ---

    // Savings button and modal
    if (addSavingsBtn) {
        addSavingsBtn.addEventListener('click', () => {
            savingsAmountInput.value = ''; // Clear previous input
            savingsModalMessage.textContent = ''; // Clear previous message
            savingsModalMessage.style.color = ''; // Reset message color
            openModal(addSavingsModal);
        });
    }
    if (savingsCloseButton) {
        savingsCloseButton.addEventListener('click', () => closeModal(addSavingsModal));
    }
    if (confirmAddSavingsBtn) {
        confirmAddSavingsBtn.addEventListener('click', handleAddSavings);
    }

    // Expense button and modal
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', () => {
            expenseAmountInput.value = ''; // Clear previous input
            expenseModalMessage.textContent = ''; // Clear previous message
            expenseModalMessage.style.color = ''; // Reset message color
            openModal(addExpenseModal);
        });
    }
    if (expenseCloseButton) {
        expenseCloseButton.addEventListener('click', () => closeModal(addExpenseModal));
    }
    if (confirmAddExpenseBtn) {
        confirmAddExpenseBtn.addEventListener('click', handleAddExpense);
    }

    // Fun fact and challenge buttons
    if (newFactBtn) {
        newFactBtn.addEventListener('click', showNewFunFact);
    }

    if (completeChallengeBtn) {
        completeChallengeBtn.addEventListener('click', () => {
            showMessageModal("Awesome Job!", "You completed the challenge! 🎉 Here's a new one!");
            showNewChallenge(); // Show a new challenge after "completing" one
        });
    }

    // Generic message modal close button
    if (messageModalCloseBtn) {
        messageModalCloseBtn.addEventListener('click', () => closeModal(messageModal));
    }
    if (messageCloseButton) {
        messageCloseButton.addEventListener('click', () => closeModal(messageModal));
    }


    // Close modals if user clicks outside of them
    window.addEventListener('click', (event) => {
        if (event.target === addSavingsModal) {
            closeModal(addSavingsModal);
        }
        if (event.target === addExpenseModal) {
            closeModal(addExpenseModal);
        }
        if (event.target === messageModal) {
            closeModal(messageModal);
        }
    });
// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Global Variables & Elements ---
    const userName = "Super Kid"; // Could be fetched from a backend or user input
    const initialSavedAmount = 50;
    const initialGoalAmount = 100;
    const initialPocketMoney = 25; // Initial pocket money balance

    // Element selectors
    const dynamicUserNameElements = document.querySelectorAll('#dynamicUserName, #userName');
    const savingsProgressBar = document.getElementById('savingsProgressBar');
    const savingsProgressText = document.getElementById('savingsProgressText');
    const savedAmountDisplay = document.getElementById('savedAmount');
    const goalAmountDisplay = document.getElementById('goalAmount');
    const addSavingsBtn = document.getElementById('addSavingsBtn');
    const newFactBtn = document.getElementById('newFactBtn');
    const funFactText = document.getElementById('funFactText');
    const completeChallengeBtn = document.getElementById('completeChallengeBtn');
    const challengeText = document.getElementById('challengeText');
    const navButtons = document.querySelectorAll('.nav-button');
    const pocketMoneyBalanceDisplay = document.getElementById('pocketMoneyBalance');
    const transactionList = document.getElementById('transactionList');

    // Content sections
    const homeContent = document.getElementById('homeContent');
    const goalsContent = document.getElementById('goalsContent');
    const learnContent = document.getElementById('learnContent');
    const parentalControlContent = document.getElementById('parentalControlContent'); // New content section

    // Savings Modal elements
    const addSavingsModal = document.getElementById('addSavingsModal');
    const savingsCloseButton = addSavingsModal.querySelector('.close-button');
    const confirmAddSavingsBtn = document.getElementById('confirmAddSavingsBtn');
    const savingsAmountInput = document.getElementById('savingsAmountInput');
    const savingsModalMessage = document.getElementById('savingsModalMessage');

    // Expense Modal elements
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const addExpenseModal = document.getElementById('addExpenseModal');
    const expenseCloseButton = addExpenseModal.querySelector('.close-button');
    const confirmAddExpenseBtn = document.getElementById('confirmAddExpenseBtn');
    const expenseAmountInput = document.getElementById('expenseAmountInput');
    const expenseModalMessage = document.getElementById('expenseModalMessage');

    // Generic Message Modal elements (replaces alert())
    const messageModal = document.getElementById('messageModal');
    const messageModalTitle = document.getElementById('messageModalTitle');
    const messageModalText = document.getElementById('messageModalText');
    const messageModalCloseBtn = document.getElementById('messageModalCloseBtn');
    const messageCloseButton = messageModal.querySelector('.close-button');

    // Parental Control Zone elements
    const reportScamBtn = document.getElementById('reportScamBtn');


    // --- State Variables ---
    let currentSavedAmount = initialSavedAmount;
    let currentGoalAmount = initialGoalAmount;
    let currentPocketMoney = initialPocketMoney;

    // Fun facts and challenges
    const funFacts = [
        "Saving money is like planting a seed; it grows over time!",
        "Every little bit you save adds up to something big!",
        "Setting a goal helps you know what you're saving for!",
        "Needs are things you must have, wants are things you'd like to have.",
        "Making a list before shopping can help you save money.",
        "Turning off lights when you leave a room saves energy and money!",
        "Borrowing books from the library is a free way to read amazing stories."
    ];
    let currentFactIndex = 0;

    const challenges = [
        "Can you find 3 items at home you can recycle?",
        "Draw a picture of your biggest savings goal!",
        "Help with a chore without being asked!",
        "Read a new story or learn one new thing today!",
        "Share one thing you're grateful for."
    ];
    let currentChallengeIndex = 0;

    // --- Functions ---

    /**
     * Updates the user's name across the dashboard.
     */
    function updateUserNameDisplay() {
        dynamicUserNameElements.forEach(el => el.textContent = userName);
    }

    /**
     * Updates the savings progress bar and text.
     */
    function updateSavingsProgress() {
        const percentage = Math.min((currentSavedAmount / currentGoalAmount) * 100, 100);
        savingsProgressBar.style.width = `${percentage}%`;
        savingsProgressText.textContent = `${Math.round(percentage)}%`;
        savedAmountDisplay.textContent = `$${currentSavedAmount.toFixed(2)}`;
        goalAmountDisplay.textContent = `$${currentGoalAmount.toFixed(2)}`;

        if (percentage >= 100) {
            savingsProgressText.textContent = "Goal Reached! 🎉";
            // You could add more celebration visuals here
        }
    }

    /**
     * Updates the pocket money balance display.
     */
    function updatePocketMoneyDisplay() {
        pocketMoneyBalanceDisplay.textContent = `$${currentPocketMoney.toFixed(2)}`;
    }

    /**
     * Adds a new transaction to the history list.
     * @param {string} type - '+' for income, '-' for expense.
     * @param {number} amount - The amount of the transaction.
     * @param {string} description - A brief description of the transaction.
     */
    function addTransactionToHistory(type, amount, description) {
        const listItem = document.createElement('li');
        listItem.textContent = `${type} $${amount.toFixed(2)} (${description})`;
        transactionList.prepend(listItem); // Add to the top of the list
        // Limit the number of visible transactions if needed
        while (transactionList.children.length > 5) {
            transactionList.removeChild(transactionList.lastChild);
        }
    }

    /**
     * Displays a new fun fact.
     */
    function showNewFunFact() {
        currentFactIndex = (currentFactIndex + 1) % funFacts.length;
        funFactText.textContent = funFacts[currentFactIndex];
    }

    /**
     * Displays a new challenge.
     */
    function showNewChallenge() {
        currentChallengeIndex = (currentChallengeIndex + 1) % challenges.length;
        challengeText.textContent = challenges[currentChallengeIndex];
    }

    /**
     * Opens a specified modal.
     * @param {HTMLElement} modalElement - The modal DOM element to open.
     */
    function openModal(modalElement) {
        modalElement.style.display = 'flex'; // Use flex to center
    }

    /**
     * Closes a specified modal.
     * @param {HTMLElement} modalElement - The modal DOM element to close.
     */
    function closeModal(modalElement) {
        modalElement.style.display = 'none';
    }

    /**
     * Shows the generic message modal.
     * @param {string} title - The title for the message modal.
     * @param {string} message - The message text.
     */
    function showMessageModal(title, message) {
        messageModalTitle.textContent = title;
        messageModalText.textContent = message;
        openModal(messageModal);
    }

    /**
     * Handles adding savings from the modal.
     */
    function handleAddSavings() {
        const amountToAdd = parseFloat(savingsAmountInput.value);

        if (isNaN(amountToAdd) || amountToAdd <= 0) {
            savingsModalMessage.textContent = "Please enter a valid amount!";
            savingsModalMessage.style.color = "red";
            return;
        }

        currentSavedAmount += amountToAdd;
        updateSavingsProgress();
        savingsModalMessage.textContent = `Great! $${amountToAdd.toFixed(2)} added to your savings!`;
        savingsModalMessage.style.color = "green";
        addTransactionToHistory('+', amountToAdd, 'Savings Deposit');

        // Optionally close modal after a delay or keep it open
        setTimeout(() => {
            closeModal(addSavingsModal);
            savingsAmountInput.value = ''; // Clear input
            savingsModalMessage.textContent = ''; // Clear message
        }, 1500);
    }

    /**
     * Handles adding an expense from the modal.
     */
    function handleAddExpense() {
        const amountToDeduct = parseFloat(expenseAmountInput.value);

        if (isNaN(amountToDeduct) || amountToDeduct <= 0) {
            expenseModalMessage.textContent = "Please enter a valid amount!";
            expenseModalMessage.style.color = "red";
            return;
        }

        if (currentPocketMoney < amountToDeduct) {
            expenseModalMessage.textContent = "Not enough pocket money!";
            expenseModalMessage.style.color = "orange";
            return;
        }

        currentPocketMoney -= amountToDeduct;
        updatePocketMoneyDisplay();
        expenseModalMessage.textContent = `Expense of $${amountToDeduct.toFixed(2)} recorded!`;
        expenseModalMessage.style.color = "green";
        addTransactionToHistory('-', amountToDeduct, 'Expense');


        // Optionally close modal after a delay or keep it open
        setTimeout(() => {
            closeModal(addExpenseModal);
            expenseAmountInput.value = ''; // Clear input
            expenseModalMessage.textContent = ''; // Clear message
        }, 1500);
    }

    /**
     * Handles navigation button clicks to show/hide content sections.
     * @param {Event} event - The click event.
     */
    function handleNavClick(event) {
        // Remove 'active' class from all nav buttons
        navButtons.forEach(btn => btn.classList.remove('active'));
        // Add 'active' class to the clicked button
        event.target.classList.add('active');

        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active-content');
        });

        // Show the content section corresponding to the clicked button
        const targetContentId = event.target.dataset.content + 'Content';
        const targetContent = document.getElementById(targetContentId);
        if (targetContent) {
            targetContent.classList.add('active-content');
        }
    }


    // --- Event Listeners ---

    // Savings button and modal
    if (addSavingsBtn) {
        addSavingsBtn.addEventListener('click', () => {
            savingsAmountInput.value = ''; // Clear previous input
            savingsModalMessage.textContent = ''; // Clear previous message
            savingsModalMessage.style.color = ''; // Reset message color
            openModal(addSavingsModal);
        });
    }
    if (savingsCloseButton) {
        savingsCloseButton.addEventListener('click', () => closeModal(addSavingsModal));
    }
    if (confirmAddSavingsBtn) {
        confirmAddSavingsBtn.addEventListener('click', handleAddSavings);
    }

    // Expense button and modal
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', () => {
            expenseAmountInput.value = ''; // Clear previous input
            expenseModalMessage.textContent = ''; // Clear previous message
            expenseModalMessage.style.color = ''; // Reset message color
            openModal(addExpenseModal);
        });
    }
    if (expenseCloseButton) {
        expenseCloseButton.addEventListener('click', () => closeModal(addExpenseModal));
    }
    if (confirmAddExpenseBtn) {
        confirmAddExpenseBtn.addEventListener('click', handleAddExpense);
    }

    // Fun fact and challenge buttons
    if (newFactBtn) {
        newFactBtn.addEventListener('click', showNewFunFact);
    }

    if (completeChallengeBtn) {
        completeChallengeBtn.addEventListener('click', () => {
            showMessageModal("Awesome Job!", "You completed the challenge! 🎉 Here's a new one!");
            showNewChallenge(); // Show a new challenge after "completing" one
        });
    }

    // Parental Control Zone specific listeners
    if (reportScamBtn) {
        reportScamBtn.addEventListener('click', () => {
            showMessageModal("Report a Scam", "Thank you for helping us keep the community safe! Please email us details at safety@kiddash.com.");
        });
    }
    // Placeholder for downloadable links (they are just links in HTML)
    document.querySelectorAll('.download-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent actual navigation for demo
            showMessageModal("Download Ready!", `You clicked to download: "${event.target.textContent}". In a real app, this would start a download!`);
        });
    });


    // Generic message modal close button
    if (messageModalCloseBtn) {
        messageModalCloseBtn.addEventListener('click', () => closeModal(messageModal));
    }
    if (messageCloseButton) {
        messageCloseButton.addEventListener('click', () => closeModal(messageModal));
    }


    // Close modals if user clicks outside of them
    window.addEventListener('click', (event) => {
        if (event.target === addSavingsModal) {
            closeModal(addSavingsModal);
        }
        if (event.target === addExpenseModal) {
            closeModal(addExpenseModal);
        }
        if (event.target === messageModal) {
            closeModal(messageModal);
        }
    });

    // Add click listeners to nav buttons
    navButtons.forEach(button => {
        button.addEventListener('click', handleNavClick);
    });


    // --- Initial Setup ---
    updateUserNameDisplay();
    updateSavingsProgress(); // Initialize progress bar
    updatePocketMoneyDisplay(); // Initialize pocket money display
    funFactText.textContent = funFacts[currentFactIndex]; // Show initial fact
    challengeText.textContent = challenges[currentChallengeIndex]; // Show initial challenge

    // Ensure only the home content is visible on initial load
    document.querySelectorAll('.content-section').forEach(section => {
        if (section.id !== 'homeContent') {
            section.classList.remove('active-content');
        } else {
            section.classList.add('active-content');
        }
    });


    console.log("Kid's Dashboard script loaded and initialized!");
});

    // Add click listeners to nav buttons
    navButtons.forEach(button => {
        button.addEventListener('click', handleNavClick);
    });


    // --- Initial Setup ---
    updateUserNameDisplay();
    updateSavingsProgress(); // Initialize progress bar
    updatePocketMoneyDisplay(); // Initialize pocket money display
    funFactText.textContent = funFacts[currentFactIndex]; // Show initial fact
    challengeText.textContent = challenges[currentChallengeIndex]; // Show initial challenge

    console.log("Kid's Dashboard script loaded and initialized!");
});
