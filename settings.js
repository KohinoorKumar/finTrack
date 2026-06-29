const profileForm = document.querySelector(".profile-form")
const userUpdateField = document.querySelector("#update-user")
const profileDetailDiv = document.querySelector(".profile-detail")
const rightDiv = document.querySelector(".right-container")
const nav = document.querySelector("nav")
const leftDiv = document.querySelector(".left-container")
const username = document.querySelector("#username")
const addBtn = document.querySelector("#add-transaction")
const logoutBtn = document.querySelector(".logout-btn")

const currencyObj = {
    usd: "$",
    eur: "€",
    gbp: "£",
    inr: "₹",
    jpy: "¥",
}


function settingsUI() {
    let users = JSON.parse(localStorage.getItem("users"))

    users.forEach((element) => {
        profileForm[0].value = element.username
    
        let matchedKey = Object.keys(currencyObj).find(key => currencyObj[key] === element.currency);
    
        profileForm[1].value = matchedKey
    
        username.innerText = element.username
    
        // console.log(profileForm[1].value)
    });
}

settingsUI()


function applyTheme(theme = localStorage.getItem("theme") || "light") {
    const isDark = theme === "dark"
    const textColor = isDark ? "#f3f4f6" : "#2c3e50"
    
    document.body.classList.toggle("dark-theme", isDark)
    rightDiv.classList.toggle("light-down", isDark)
    nav.classList.toggle("light-gray", isDark)
    leftDiv.classList.toggle("light-gray", isDark)

    if(addBtn){
        addBtn.style.backgroundColor = isDark? "#3b82f6" : "#000"
    }
}


profileForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let userUpdate = profileForm[0].value
    let currencyUpdate = profileForm[1].value

    console.log(userUpdate);
    console.log(currencyUpdate);


    localStorage.setItem("users", JSON.stringify([{
        username: userUpdate,
        currency: currencyObj[currencyUpdate]
    }]))
})
applyTheme()

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
