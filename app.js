// Controller to keep track of income, expenses and the budget.
var budgetController = (function () {

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

    var calculateTotal = function (type) {
        var sum = 0;
        data.items[type].forEach(function (curr) {
            sum += curr.value;
        });
        data.totals[type] = sum;
    }

    // Data structure.
    var data = {
        items: {
            // list of objects.
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
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

            return newItem;
        },
        calculateBudget: function () {
            // calculate total for expense and income.
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate the budget = income - expense.
            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentage
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        temp: function () {
            return data;
        }
    }
})();


// Controller for the UI and contents.
var UIController = (function () {

    var DOM = {
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        addButton: '.add__btn',
        incomeList: '.income__list',
        expenseList: '.expenses__list'
    };

    // Returning an object.
    return {
        // All variables and methods that we want accessible later.
        getInput: function () {
            return {
                type: document.querySelector(DOM.type).value, // returns inc or exp.
                desc: document.querySelector(DOM.description).value,
                val: parseFloat(document.querySelector(DOM.value).value)
            };
        },
        getDOMElements: DOM,
        addListItem: function (obj, type) {

            // create the html string.
            var html, element;
            if (type === 'inc') {
                element = DOM.incomeList;
                html = `<div class="item clearfix" id="income-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${obj.value}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
            } else {
                element = DOM.expenseList;
                html = ` <div class="item clearfix" id="expense-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${obj.value}</div>
                                <div class="item__percentage">10%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
            }

            // add to html file.
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },
        clear: function () {
            var fields = document.querySelectorAll(`${DOM.description}, ${DOM.value}`);

            fields.forEach(function (curr) {
                curr.value = '';
            });

            fields[0].focus();
        }
    }
})();


// Code connecting the budget and UI controllers. Takes the objects returned by them as arguments.
// Renaming arguments of this function to something else so that its more independent.
// If budget and UI controllers were renamed, only need to change once at the bottom, everything else
// would still be called budgetCtrl and UICtrl.
var controller = (function (budgetCtrl, UICtrl) {

    function setupEventListeners() {
        var DOM = UICtrl.getDOMElements;

        document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13)
                ctrlAddItem();
        });
    };

    function updateBudget() {
        // calculate budget.
        budgetController.calculateBudget();

        // return the budget.
        var budget = budgetController.getBudget();

        // update the UI.
        console.log(budget);
    }

    // Controls the adding of items to other modules.
    function ctrlAddItem() {
        // get item from the UI.
        var input = UICtrl.getInput();

        if (input.desc !== '' && !isNaN(input.val) && input.val > 0) {
            // add item to budget controller.
            var newItem = budgetCtrl.addItem(input.type, input.desc, input.val);

            // add item to UI.
            UICtrl.addListItem(newItem, input.type);

            // clear the fields.
            UICtrl.clear();

            // update the budget.
            updateBudget();

            // Returning an object.
        }

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