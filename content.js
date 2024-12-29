

let state = {
    isScriptRunning: false,
    payments: [],
    counter: 0,
    forceStop: false
}

resetState()

function resetState() {
    state = {
        isScriptRunning: false,
        payments: [],
        counter: 0,
        forceStop: false
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (typeof request.action === "undefined") {
            return
        }

        switch(request.action) {
            default:
                return
            case "start":
                const payments = request.payments

                startListing(payments).then()
                return
            case "getState":
                sendResponse(state)
                return true
            case "forceStop":
                resetState();
                state.forceStop = true
                sendState().then()
                return
            case "reset":
                resetState()
                state.forceStop = true
                break;
        }
    }
);

async function sendState() {
    chrome.runtime.sendMessage({action: "stateUpdate", state});
}

async function sendItIsDone() {
    chrome.runtime.sendMessage({action: "done"});
}



function simulateTyping(input, text) {
    // Nastavení focus na input
    input.focus();

    // Simulace psaní textu znak po znaku
    text.split('').forEach(char => {
        // Vytvoření KeyboardEvent
        const event = new KeyboardEvent('keydown', { key: char, keyCode: char.charCodeAt(0), which: char.charCodeAt(0), bubbles: true });

        // Dispatch event
        input.dispatchEvent(event);

        // Přidání znaku do hodnoty inputu
        input.value += char;

        // Vytvoření události input
        const inputEvent = new Event('input', { bubbles: true });

        // Dispatch input event
        input.dispatchEvent(inputEvent);
    });
}

async function startListing(payments) {
    state.isScriptRunning = true
    state.payments = payments
    state.counter = 1
    state.forceStop = false

    await sendState()

    for(const payment of payments) {
        if (state.forceStop) {
            break;
        }

        console.log("Začátek platby a čekání až bude ready")
        await waitUntilReady()

        console.log("Zadávání platby")
        addPayment(payment)
        await wait(2000)

        if (state.forceStop) {
            break;
        }

        console.log("Odesílání platby")
        submitPayment()

        console.log("Hotovo")
        await sendState()
        state.counter++
    }

    state.counter = state.payments.length

    if (state.forceStop === true) {
        return
    }

    await sendItIsDone()
}

function parseBankAccountNumber(bankAccount) {
    console.log(bankAccount)
    const [left, code] = bankAccount.split('/');
    let [prefix, number] = left.split('-');

    if (!number) {
        number = prefix;
        prefix = '';
    }

    return {
        prefix,
        number,
        code
    };
}

async function waitUntilReady() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const creditAccountNumber = document.querySelector('input[xid="creditAccountNumber"]');

            if (creditAccountNumber && creditAccountNumber.value.length === 0) {
                resolve()
            }
        }, 1000)
    })
}

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms)
    })
}

function submitPayment () {
    let button = document.querySelector('button[xid="saveAndAdd "]');

    button.click()
}

function addPayment(payment) {
    const creditAccountNumberPrefix = document.querySelector('input[xid="creditAccountNumberPrefix"]');
    const creditAccountNumber = document.querySelector('input[xid="creditAccountNumber"]');
    const creditBankCode = document.querySelector('input[xid="creditBankCode-searchQuery"]');

    const amount = document.querySelector('input[xid="amount"]');

    const variableSymbol = document.querySelector('input[xid="variableSymbol"]');
    const constantSymbol = document.querySelector('input[xid="constantSymbol"]');
    const specificSymbol = document.querySelector('input[xid="specificSymbol"]');

    const messageForPayee = document.querySelector('textarea[xid="messageForPayee"]');
    const clientReference = document.querySelector('textarea[xid="clientReference"]');

    const bankAccount = parseBankAccountNumber(payment.bankAccount);

    simulateTyping(creditAccountNumberPrefix, bankAccount.prefix || '')
    simulateTyping(creditAccountNumber, bankAccount.number)
    simulateTyping(creditBankCode, bankAccount.code)

    simulateTyping(amount, payment.amount)

    simulateTyping(variableSymbol, payment.variableSymbol || '')
    simulateTyping(constantSymbol, payment.constantSymbol || '')
    simulateTyping(specificSymbol, payment.specificSymbol || '')

    simulateTyping(messageForPayee, payment.message || '')
    simulateTyping(clientReference, payment.note || '')
}