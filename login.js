const form = document.querySelector("#login-form")

const tokenArr = []

function generateToken(){
    let token = Math.floor(Math.random()* 1000000 + 1)
    return token
}

form.addEventListener("submit", (evt) => {
    evt.preventDefault()
    let username = form[0].value
    let password = form[1].value

    let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers"))
    
    registeredUsers.forEach((user) => {
            if(user.username === username && user.password === password){
                alert("login successful")

                localStorage.setItem("users", JSON.stringify([{
                    username: user.username,
                    currency: "$",
                }]))

                const token = generateToken()


                let getToken = JSON.parse(localStorage.getItem("user-token"))
                console.log(getToken)
                if( getToken === null || getToken[0].token === "" || getToken[0].token === null ){
                    localStorage.setItem("user-token", JSON.stringify([{ token: token}]))
                    window.location.href = "./dashboard.html"
                } else {
                    window.location.href = "./dashboard.html"
                }

            } else {
                alert("Invalid username or password")
            }
    }) 
})

