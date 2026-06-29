const form = document.querySelector("#register-form")

const registerArr = []
const tokenArr = []

function generateToken(){
    let token = Math.floor(Math.random()* 1000000 + 1)
    return token
}



form.addEventListener("submit", (evt) => {
    evt.preventDefault()
    let username = form[0].value
    let password = form[1].value
    
    registerArr.push({
        username: username,
        password: password
    })

    const token = generateToken()

    console.log(registerArr);
    
    localStorage.setItem("registeredUsers", JSON.stringify(registerArr))
    localStorage.setItem("user-token", JSON.stringify([{
        token: token
    }]))

    window.location.href = "./dashboard.html"
})