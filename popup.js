const errorEl = document.getElementById("error")
const noteEl = document.getElementById("note")
const countEl = document.getElementById("count")
const inputEl = document.getElementById("inputData")
const buttonEl = document.getElementById('startButton')
const resetButtonEl = document.getElementById("resetButton")

const inputContainerEl = document.getElementById("inputContainer")
const runningContainerEl = document.getElementById("runningContainer")
const doneContainerEl = document.getElementById("doneContainer")

const currentCounterEl = document.getElementById("currentCounter")
const totalCountEl = document.getElementById("totalCount")

let paymentList = []


async function run() {
    const  state = await getStateFromContent()

    if (!state.isScriptRunning) {
        showInputContainer()
        return
    }

    if (state.counter === state.payments.length) {
        showDoneContainer().then()
    } else {
        showRunningContainer(state).then()
    }
}

async function showRunningContainer(state) {
    currentCounterEl.innerHTML = "-"
    totalCountEl.innerHTML = "-"

    inputContainerEl.style.display = "none"
    doneContainerEl.style.display = "none"
    runningContainerEl.style.display = "block"

    const currentState = state || await getStateFromStorage()

    await updateRunningContainerInfo(currentState)
}

async function showDoneContainer() {
    inputContainerEl.style.display = "none"
    runningContainerEl.style.display = "none"
    doneContainerEl.style.display = "block"
}

async function updateRunningContainerInfo(state) {
    currentCounterEl.innerHTML = state.counter.toString()
    totalCountEl.innerHTML = state.payments.length.toString()
}



function showInputContainer() {
    runningContainerEl.style.display = "none"
    doneContainerEl.style.display = "none"
    inputContainerEl.style.display = "block"
}

run().then()

inputEl.addEventListener("keyup", () => {
    parseInputData(inputEl.value)
})

function parseInputData(dataString) {
    paymentList = []

    buttonEl.disabled = true
    noteEl.style.display = "block"
    countEl.innerHTML = "0";
    errorEl.style.display = "none"

    const lines = dataString.split("\n")

    const headers = lines[0].split("\t").map((i) => i)

    if (headers.indexOf('ÚÈET') === -1 || headers.indexOf('ÈÁSTKA') === -1) {
        showError("Hlavièka ÚÈET a ÈÁSTKA jsou povinné na prvním øádku")
        return
    }

    const columnIndexes = {
        bankAccount: headers.indexOf('ÚÈET'),
        amount: headers.indexOf("ÈÁSTKA"),
        vs: headers.indexOf("VS"),
        cs: headers.indexOf("KS"),
        ss: headers.indexOf("SS"),
        message: headers.indexOf('ZPRÁVA'),
        note: headers.indexOf('POZNÁMKA')
    }

    const payments = []
    let isError = false

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i]

        try {
            const payment = parseLineToPayment(line, columnIndexes)

            if (payment) {
                payments.push(payment)
            }
        } catch (e) {
            isError = true
            showError(`<strong>Chyba na øádku ${i}</strong><br />${e.message}`)
            break;
        }
    }

    if (isError) {
        return
    }

    countEl.innerHTML = payments.length.toString()

    if (payments.length < 1) {
        return
    }

    paymentList = payments

    buttonEl.disabled = false
}






function showError(message) {
    noteEl.style.display = "none"
    errorEl.style.display = "block"

    errorEl.innerHTML = message
}



buttonEl.addEventListener('click', async function() {
    buttonEl.disabled = true

    await sendMessageToContentScript({
        action: "start",
        payments: paymentList
    })
});

resetButtonEl.addEventListener("click", async function () {
    inputEl.value = ""
    showInputContainer()
})

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (typeof message.action === "undefined") {
        sendResponse()
        return
    }

    switch (message.action) {
        default:
            sendResponse()
            return
        case "stateUpdate":
            const contentPayments = message.state.payments

            if (message.state.counter === contentPayments.length) {
                showDoneContainer().then()
            } else {
                showRunningContainer(message.state).then()
            }
            break
    }
});




