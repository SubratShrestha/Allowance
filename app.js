var budgetController = (function () {
    // Code for budgetController.

    // Returning an object.
    return {
        // All variables and methods that we want accessible later.
    }
})();

var UIController = (function () {
    // Code for UI controller.
    var DOM = {
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        addButton: '.add__btn'
    };

    // Returning an object.
    return {
        // All variables and methods that we want accessible later.
        getInput: function () {
            return {
                type: document.querySelector(DOM.type).value, // returns inc or exp.
                desc: document.querySelector(DOM.description).value,
                val: document.querySelector(DOM.value).value
            };
        },
        getDOMElements: DOM
    }
})();

var controller = (function (budgetCtrl, UICtrl) {
    // Code connecting the budget and UI controllers. Takes the objects returned by them as arguments.
    // Renaming arguments of this function to something else so that its more independent.
    // If budget and UI controllers were renamed, only need to change once at the bottom, everything else
    // would still be called budgetCtrl and UICtrl.

    function setupEventListeners() {
        var DOM = UICtrl.getDOMElements;

        document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13)
                ctrlAddItem();
        });
    };

    // Get the input data.
    function ctrlAddItem() {
        input = UICtrl.getInput();
        console.log(input);
    }

    // add item to budget controller.

    // add item to UI.

    // calculate budget.

    // display budget.

    // Returning an object.
    return {
        // All variables and methods that we want accessible later.
        init: function () {
            console.log('started.');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();