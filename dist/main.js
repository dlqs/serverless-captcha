const captcha = "/.netlify/functions/captcha"

const base = new URL("https://nifty-tesla-2a3aa5.netlify.com")
const url = new URL(captcha, base)

const onsubmit = (e) => {

    // prevent refresh
    e.preventDefault()
    // get client response token, used to match client on back end
    const rt = grecaptcha.getResponse()

    return fetch(`${url.toString()}?rt=${rt}`)
        .then((res) => {
            if (res.status === 200) {
                return res.text()
            } else {
                throw new Error("Captcha did not suceed")
            }
        }).then((text) => {
            // process response body
            document.getElementById('secret-message').textContent = text
            document.getElementById('secret-message').style.background = 'None'
        }).catch((err) => {
            console.log(err)
        })
}

const f = document.getElementById('form')
f.addEventListener('submit', onsubmit)