// Controller to keep track of income, expenses and the budget.
var budgetController = (function () {

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.perc = -1;
    };

    Expense.prototype.calcPerc = function (total) {
        if (total > 0)
            this.perc = Math.round((this.value / total) * 100);
    };

    Expense.prototype.getPerc = function () {
        return this.perc;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.items[type].forEach(function (curr) {
            sum += curr.value;
        });
        data.totals[type] = sum;
    };

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
    };


    // Returning an object.
    return {
        // All variables and methods that we want accessible later.
        addItem: function (type, desc, value) {
            if (data.items[type].length > 0)
                var ID = data.items[type][data.items[type].length - 1].id + 1;
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
            if (data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else data.percentage = -1;
        },

        calculatePercentage: function () {
            data.items.exp.forEach(function (curr) {
                curr.calcPerc(data.totals.inc);
            })
        },

        getPercentage: function () {
            var percArray = data.items.exp.map(function (curr) {
                return curr.getPerc();
            });
            return percArray;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        deleteItem: function (type, id) {
            data.items[type].forEach(function (curr) {
                if (curr.id === id) {
                    data.items[type].splice(data.items[type].indexOf(curr), 1);
                }
            });
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
        expenseList: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercLabel: '.item__percentage',
        month: '.budget__title--month'
    };

    function formatNumber(num, type) {
        num = Math.abs(num);
        num = num.toFixed(2);

        var numSplit = num.split('.');
        var int = numSplit[0];
        var dec = numSplit[1];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        return (type === 'inc' ? '+ ' : '- ') + int + '.' + dec;
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
                html = `<div class="item clearfix" id="inc-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber(obj.value, type)}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
            } else {
                element = DOM.expenseList;
                html = ` <div class="item clearfix" id="exp-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber(obj.value, type)}</div>
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
        },

        updateUI: function (budgetObj) {
            var type = budgetObj.budget > 0 ? 'inc' : 'exp';
            document.querySelector(DOM.budgetLabel).textContent = formatNumber(budgetObj.budget, type);
            document.querySelector(DOM.incomeLabel).textContent = formatNumber(budgetObj.totalInc, 'inc');
            document.querySelector(DOM.expenseLabel).textContent = formatNumber(budgetObj.totalExp, 'exp');

            if (budgetObj.percentage > 0)
                document.querySelector(DOM.percentageLabel).textContent = budgetObj.percentage + '%';
            else document.querySelector(DOM.percentageLabel).textContent = '...'
        },

        updatePercUI: function (percArray) {
            percLabels = document.querySelectorAll(DOM.expPercLabel);
            for (var i = 0; i < percLabels.length; i++) {
                if (percArray[i] > 0)
                    percLabels[i].textContent = percArray[i] + '%';
                else percLabels[i].textContent = '...';
            };
        },

        displayMonth: function () {
            var now = new Date();
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector(DOM.month).textContent = monthNames[now.getMonth()];
        },

        deleteItemUI: function (id) {
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
            // newer versions support: document.getElementById(id).remove();
        },

        changeFocus: function () {
            var fields = document.querySelectorAll(
                DOM.type + ',' +
                DOM.description + ',' +
                DOM.value
            );

            for (var i = 0; i < fields.length; i++) {
                fields[i].classList.toggle('red-focus');
            }

            document.querySelector(DOM.addButton).classList.toggle('red');
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.type).addEventListener('change', UICtrl.changeFocus);
    };

    function updateBudget() {
        // calculate budget.
        budgetController.calculateBudget();

        // return the budget.
        var budget = budgetController.getBudget();

        // update the UI.
        UICtrl.updateUI(budget);
    };

    function updatePercentage() {
        // calculate percentages
        budgetCtrl.calculatePercentage();

        // read percentages from budget controller
        var perc = budgetCtrl.getPercentage();

        // update UI with new percentage
        UICtrl.updatePercUI(perc);
    };

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

            // calculate and update percentages.
            updatePercentage();

            // Returning an object.
        }
    };

    function ctrlDeleteItem(event) {
        var parent = event.target;
        // DOM traversal to item container.
        for (var i = 0; i < 4; i++) { parent = parent.parentNode; }

        var itemID = itemIDFull = parent.id;
        if (itemID) {
            itemID = itemID.split('-');
            var type = itemID[0];
            var id = parseInt(itemID[1]);

            // remove id from data store.
            budgetCtrl.deleteItem(type, id);

            // remove id from UI.
            UICtrl.deleteItemUI(itemIDFull);

            // update budget.
            updateBudget();
        }
    }


    return {
        // All variables and methods that we want accessible later.
        init: function () {
            console.log('started.');
            UICtrl.displayMonth();
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();