function isNumeric(str) {
    return /^0*[1-9]\d*$/.test(str)
}

function isBankAccountValid(bankAccount) {
    const split = bankAccount.split("/")

    if (split.length !== 2) {
        return false
    }

    const [left, bankCode] = split

    if (!isNumeric(bankCode)) {
        return false
    }

    const leftSplit = left.split('-')

    let prefix, number

    if (leftSplit.length === 2) {
        [prefix, number] = leftSplit
    } else if (leftSplit.length === 1) {
        number = leftSplit
    } else {
        return false
    }

    if (prefix && !isNumeric(prefix)) {
        return false
    }

    if (!isNumeric(number)) {
        return false
    }

    return true
}

function isAmountValid(amount) {
    // Kontrola, jestli je vstup validní èíslo s monımi desetinnımi místy
    if (!/^\d+(\.\d+)?$/.test(amount)) {
        return false;
    }

    const amountNumber = parseFloat(amount);

    // Kontrola, jestli je èíslo vìtší ne 0
    if (amountNumber <= 0) {
        return false;
    }

    return true;
}

function isSymbolValid(symbol) {
    if (parseInt(symbol).toString() !== symbol) {
        return false
    }

    if (symbol.length > 10) {
        return false
    }

    return true
}

function isMessageValid(message) {
    if (message.length > 140) {
        return false;
    }

    const regex = /^[a-zA-Z0-9áèïéìíòóøšúùıÁÈÏÉÌÍÒÓØŠÚÙİ\s\.,;:()\-_\/]+$/;

    if (!regex.test(message)) {
        return false;
    }

    return true;
}