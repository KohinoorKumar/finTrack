const main = document.querySelector("main")
const rightDiv = document.querySelector(".right-container")
const leftDiv = document.querySelector(".left-container")
const addBtn = document.querySelector("#add-transaction")
const transactionForm = document.querySelector("#Transaction-form")
const formDiv = document.querySelector(".form-div")
const cancelAction = document.querySelector(".cancel")
const nav = document.querySelector("nav")
const card = document.querySelectorAll(".card")
const currentBalance = document.querySelector("#current-balance")
const totalIncome = document.querySelector("#total-income")
const totalExpense = document.querySelector("#total-expense")
const totalTransactions = document.querySelector("#total-transactions")
const myDate = document.querySelector('#my-date')
const graphDiv = document.querySelector(".graph")
const preferenceDiv = document.querySelector(".preferences")
const ctx = document.querySelector("#financeTracker")
const transactionsDiv = document.querySelector(".transactions")
const transactionsList = document.querySelector("#transactions-list")
const filterForm = document.querySelector("#transaction-filter")
const searchDiv = document.querySelector(".search")
const searchInput = document.querySelector("#search-input")
const selectTypes = document.querySelector("#select-types")
const resetBtn = document.querySelector("#reset-all")
const username = document.querySelector("#username")
const darkMode = document.querySelector("#dark-mode")
const logoutBtn = document.querySelector(".logout-btn")

const transactionsArr = []
let transactionEdit = null


// Chart.js configuration or UI

const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Income vs Expenses'],
        datasets: [
            {
                label: 'Income',
                data: '',
                backgroundColor: '#166534',
                borderWidth: 1
            },
            {
                label: "Expense",
                data: '',
                backgroundColor: '#991b1b', 
                borderWidth: 1
            }
        ],
    },
    options: {
        responseive: true,
        plugins: {
            legend: {
                labels: {
                    color: "#2d3e50",
                    font: {size: 14, weight: 'bold'}
                }
            }
        }, 
        scales: {
            x: {
                ticks: {
                    color: '#2c3e50'
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#2c3e50'
                }
            }
        }
     
    }
});


// Functions 

function updateChartData(income = 0, expense = 0) {
    myChart.data.datasets[0].data = [income]
    myChart.data.datasets[1].data = [expense]
    myChart.update()
}

function applyTheme(theme = localStorage.getItem("theme") || "light") {
    const isDark = theme === "dark"
    const textColor = isDark ? "#f3f4f6" : "#2c3e50"
    const gridColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"

    document.body.classList.toggle("dark-theme", isDark)
    main.classList.toggle("dark-theme", isDark)
    rightDiv.classList.toggle("light-down", isDark)
    nav.classList.toggle("light-gray", isDark)
    leftDiv.classList.toggle("light-gray", isDark)
    card.forEach((elem) => elem.classList.toggle("light-gray", isDark))
    graphDiv.classList.toggle("light-gray", isDark)
    ctx.classList.toggle("light-down", isDark)
    preferenceDiv.classList.toggle("light-gray", isDark)
    transactionsDiv.classList.toggle("light-gray", isDark)
    searchDiv.classList.toggle("light-down", isDark)

    if (addBtn) {
        addBtn.style.backgroundColor = isDark ? "#3b82f6" : "#000"
    }

    if (darkMode) {
        darkMode.checked = isDark
    }

    if (searchInput) {
        searchInput.style.color = isDark ? "#f3f4f6" : "#111827"
    }

    if (selectTypes) {
        selectTypes.style.backgroundColor = isDark ? "#111827" : "#fff5f5"
        selectTypes.style.color = isDark ? "#f3f4f6" : "#111827"
    }

    if (myChart) {
        myChart.options.plugins.legend.labels.color = textColor
        myChart.options.scales.x.ticks.color = textColor
        myChart.options.scales.y.ticks.color = textColor
        myChart.options.scales.x.grid.color = gridColor
        myChart.options.scales.y.grid.color = gridColor
        myChart.update()
    }
}

function updateFinancial(list = transactionsArr, users) {
    let currentBalanceValue = 0
    let totalIncomeValue = 0
    let totalExpenseValue = 0
    let count = 0

    list.forEach((transaction) => {
        if(transaction.type === 'income'){
            totalIncomeValue += Number(transaction.amount)
        } else {
            totalExpenseValue += Number(transaction.amount)
        }
        count++
    })

    currentBalanceValue = totalIncomeValue - totalExpenseValue

    const currency = users?.[0]?.currency || "$"

    console.log(currency);
    

    currentBalance.innerText = `${currency}${currentBalanceValue.toFixed(2)}
    `
    totalIncome.innerText = `${currency}${totalIncomeValue.toFixed(2)}`
    totalExpense.innerText = `${currency}${totalExpenseValue.toFixed(2)}`
    totalTransactions.innerText = count

    updateChartData(totalIncomeValue, totalExpenseValue)
    return {currentBalanceValue, totalIncomeValue, totalExpenseValue, count}
}

function resetForm() {
    transactionForm.reset()
    transactionEdit = null
    formDiv.style.display = 'none'
}

function renderTransaction(id, date, type, description, category, amount, users) {
    const div = document.createElement("div")
    const dateText = document.createElement("h4")
    const descriptionText = document.createElement("h4")
    const categoryText = document.createElement("h4")
    const amountText = document.createElement("h4")
    const action = document.createElement("div")
    const editBtn = document.createElement("button")
    const editIcon = document.createElement("i")
    const deleteBtn = document.createElement("button")
    const deleteIcon = document.createElement("i")
    const hr = document.createElement("hr")

    transactionsList.append(div, hr)
    div.classList.add('transactions-data')
    div.append(dateText, descriptionText, categoryText, amountText, action)
    action.append(editBtn, deleteBtn)

    div.setAttribute("data-id", id)

    dateText.innerText = date
    descriptionText.innerHTML = description
    categoryText.innerHTML = category
    categoryText.style.fontSize = ".8rem"
    categoryText.style.textTransform = "capitalize"
    


    const currency = users?.[0]?.currency || "$"
    amountText.innerHTML = `${currency}${amount}`
    if(type === 'income'){
        amountText.innerHTML = `+${currency}${amount}`
        amountText.style.color = "#166534"
    } else {
        amountText.innerHTML = `-${currency}${amount}`
        amountText.style.color = "#991b1b"
    }

    action.classList.add("action-btn")
    editBtn.type = "button"
    deleteBtn.type = "button"
    editBtn.appendChild(editIcon)
    editIcon.classList.add("ri-pencil-fill")
    deleteBtn.appendChild(deleteIcon)
    deleteIcon.classList.add("ri-delete-bin-7-fill")

    editBtn.addEventListener("click", (event) => {
        event.stopPropagation()
        formDiv.style.display = 'flex'
        myDate.valueAsDate = new Date()

        let transactionId = transactionsArr.find((transaction) => {
          return transaction.id === Number(div.dataset.id)
        })

        if(transactionId){
            transactionForm[0].value = transactionId.type
            transactionForm[1].value = transactionId.description
            transactionForm[2].value = transactionId.amount
            transactionForm[3].value = transactionId.date
            transactionForm[4].value = transactionId.category
        }

        transactionEdit = transactionsArr.findIndex((transaction) => transaction.id === Number(div.dataset.id))
        updateChartData()
        // updateFinancial()
    })


    deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation()
        let index = transactionsArr.findIndex((transaction) => transaction.id === Number(div.dataset.id))
        if (index !== -1) {
            transactionsArr.splice(index, 1)
            localStorage.setItem("transactions", JSON.stringify(transactionsArr))
            updateUI()
            updateChartData()
        }
    })
}

const renderTransactionData = (list = transactionsArr) => {
    transactionsList.innerHTML = ''
    if(!list || list.length === 0){
        const msg = document.createElement('p')
        msg.classList.add('no-results')
        msg.innerText = 'No tasks found'
        transactionsList.append(msg)
        return
    }

    let users = localStorage.getItem("users")

    list.forEach((elem) => {
        renderTransaction(elem.id, elem.date, elem.type, elem.description, elem.category, elem.amount, users)
    })

    updateFinancial(list, users)

}

function updateUI() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || []
    const users = JSON.parse(localStorage.getItem("users")) || []

    users.forEach((user) => {
        username.innerText = `${user.username}`
    })

    transactionsArr.length = 0
    transactionsArr.push(...transactions)

    if(transactionsList) {
        transactionsList.innerHTML = ""
    }

    updateFinancial(transactionsArr, users)
    // updateChartData(res.totalIncomeValue, res.totalExpenseValue)

    transactionsArr.forEach((transaction) => {
        let {id, date, description, type, category, amount} = transaction
        renderTransaction(id, date, type, description, category, amount, users)
    })
}

function searchTransactions(query){
    const filteredTransactions = transactionsArr.filter((transaction) => {
       return transaction.type.toLowerCase().includes(query) || transaction.description.toLowerCase().includes(query) ||
       transaction.date.toLowerCase().includes(query)
    })
    renderTransactionData(filteredTransactions)
}

function selectTransactions(selectedValue){
    let selection = transactionsArr.filter((transaction) => {
        if(selectedValue === 'all-types'){
            return transaction
        } else if(selectedValue === 'income-only'){
            return transaction.type === "income"
        } else {
            return transaction.type === 'expense'
        }
    })

    console.log(selection)

    renderTransactionData(selection)
}

// updateUI and theme

let token = JSON.parse(localStorage.getItem("user-token"))

if(token[0].token === "" || token[0].token === null ){
    window.location.href = "./loginPage.html"
} else {
    updateUI()
    applyTheme(localStorage.getItem("theme") || "light")
}

// Event Listeners

addBtn.addEventListener("click", () => {
    transactionForm.reset()
    transactionEdit = null
    formDiv.style.display = 'flex'
    myDate.valueAsDate = new Date()
})

cancelAction.addEventListener("click", ()=>{
    resetForm()
})

window.addEventListener("click", function(event){
    const clickedInsideForm = transactionForm.contains(event.target)
    const clickedInsideList = transactionsList.contains(event.target)

    if(!clickedInsideForm && !clickedInsideList && event.target !== addBtn && event.target !== cancelAction){
        resetForm()
    }
})

transactionForm.addEventListener("submit", (evt) => {
    evt.preventDefault()

    let type = transactionForm[0].value
    let description = transactionForm[1].value
    let amount = transactionForm[2].value
    let date = transactionForm[3].value
    let category = transactionForm[4].value


    let transactionObj = {
        id: Date.now(),
        type: type,
        description: description,
        amount: amount,
        date: date,
        category: category
    }

    if(transactionEdit !== null){
        transactionObj.id = transactionsArr[transactionEdit].id
        transactionsArr[transactionEdit] = transactionObj
        transactionEdit = null
    }else {
        transactionObj.id = Date.now()
        transactionsArr.push(transactionObj)
    }

    localStorage.setItem("transactions", JSON.stringify(transactionsArr))

    updateUI()

    resetForm()
})

resetBtn.addEventListener("click", () => {
    let confirmation = confirm("Are you sure you want to reset all transactions? This action cannot be undone.")
    if(confirmation){
        transactionsArr.length = 0
        localStorage.removeItem("transactions")
        updateUI()
        updateChartData(0, 0)
    }
})

searchInput.addEventListener("input", () => {
    let searchQuery = searchInput.value.toLowerCase()
    searchTransactions(searchQuery)
})

selectTypes.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    selectTransactions(selectedValue)
})

darkMode.addEventListener("change", () => {
    const nextTheme = darkMode.checked ? "dark" : "light"
    localStorage.setItem("theme", nextTheme)
    applyTheme(nextTheme)
})

logoutBtn.addEventListener("click", () => {
    let confirmation = confirm("Are you sure you want to Logout.")
    if(confirmation){
        let token = localStorage.getItem("user-token")
        localStorage.setItem("user-token", JSON.stringify([{
            token: ""
        }]))
        window.location.href = "./loginPage.html"
    }
})
