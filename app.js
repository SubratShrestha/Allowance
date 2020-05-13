// Controller to keep track of income, expenses and the budget.
var budgetController = (function () {
    // Code for budgetController.
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // Data structure.
    var data = {
        items: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    }


    // Returning an object.
    return {
        // All variables and methods that we want accessible later.
        addItem: function (type, desc, value) {
            if (data.items[type].length > 0)
                var ID = data.items[type][data.items[type].length - 1] + 1;
            else var ID = 0;

            if (type === 'inc')
                newItem = new Income(ID, desc, value);
            else newItem = new Expense(ID, desc, value);

            data.items[type].push(newItem);
        },
        temp: function () {
            return data;
        }
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
        var input = UICtrl.getInput();

        // add item to budget controller.
        budgetCtrl.addItem(input.type, input.desc, input.val);

        // add item to UI.

        // calculate budget.

        // display budget.

        // Returning an object.
    };


    return {
        // All variables and methods that we want accessible later.
        init: function () {
            console.log('started.');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();