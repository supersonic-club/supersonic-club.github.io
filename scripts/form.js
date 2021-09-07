let modalTrigger = document.querySelector('.open-modal')
let form = document.querySelector('.beta-form')
let url = '//api.supersonic.run/api/rest/signup'

modalTrigger.addEventListener('click', function (e) {
    document.body.classList.add('modal-open')
    document.querySelector('input#email').focus()
    e.preventDefault()
})

let overlay = document.querySelector('.modal__overlay')
let closeButton = document.querySelector('.button--cancel')

overlay.addEventListener('click', closeModal)
closeButton.addEventListener('click', closeModal)

function closeModal(e) {
    document.body.classList.remove('modal-open')
    e.preventDefault()
}

form.addEventListener('submit', function (e) {
    e.preventDefault()
    form.classList.add('beta-form--submitting')

    let emailAddress = document.querySelector('input#email').value
    let data = JSON.stringify({
        'email': emailAddress,
        'name': ''
    })

    var xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = function () {
        form.classList.remove('beta-form--submitting')
        form.classList.remove('beta-form--error')
        form.classList.remove('beta-form--submitted')

        if (xhr.readyState === 4 && xhr.status === 200) {
            form.classList.add('beta-form--submitted')

            let discordXhr = new XMLHttpRequest()
            discordXhr.open('POST', 'https://discord.supersonic.run/discord', true)
            discordXhr.setRequestHeader('Content-Type', 'application/json')
            discordXhr.send(JSON.stringify({
                'content': emailAddress + ' just signed up!'
            }))
        } else {
            form.classList.add('beta-form--error')

            let response = xhr.responseText
            if (response.includes('duplicate')) {
                document.querySelector('.form__error').innerText = 'You\'re already on the list!'
            } else {
                document.querySelector('.form__error').innerText = 'There was an error submitting the form, please try again.'
            }
        }
    }

    xhr.send(data)
}, false)