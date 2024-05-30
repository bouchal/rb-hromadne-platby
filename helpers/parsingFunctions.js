function parseLineToPayment(line, columnIndexes) {
    const data = line.split("\t")

    if (data.length === 1) {
        return
    }

    let bankAccount, amount, vs, cs, ss, message, note

    if (columnIndexes.bankAccount > -1) {
        const preBankAccount = data[columnIndexes.bankAccount]

        if (preBankAccount.length > 0) {
            if (isBankAccountValid(preBankAccount)) {
                bankAccount = preBankAccount
            } else {
                throw new Error("Bankovní úèet musí být ve formátu 1111-22222222/4444")
            }
        }
    }

    if (columnIndexes.amount > -1) {
        const preAmount = data[columnIndexes.amount].replace(",", ".")

        if (preAmount.length > 0) {
            if (isAmountValid(preAmount)) {
                amount = preAmount
            } else {
                throw new Error("Èástka musí být pozitivní èíslo s teèkou nebo èárkou oddìlující desetinná místa.")
            }
        }
    }

    if (columnIndexes.vs > -1) {
        const preVs = data[columnIndexes.vs]

        if (preVs.length > 0) {
            if (isSymbolValid(preVs)) {
                vs = preVs
            } else {
                throw new Error("VS musí obsahovat pouze èíselné znaky a maximálnì 10 znakù")
            }
        }
    }

    if (columnIndexes.cs > -1) {
        const preCs = data[columnIndexes.cs]

        if (preCs.length > 0) {
            if (isSymbolValid(preCs)) {
                cs = preCs
            } else {
                throw new Error("CS musí obsahovat pouze èíselné znaky a maximálnì 10 znakù")
            }
        }
    }

    if (columnIndexes.ss > -1) {
        const preSs = data[columnIndexes.ss]

        if (preSs.length > 0) {
            if (isSymbolValid(preSs)) {
                ss = preSs
            } else {
                throw new Error("SS musí obsahovat pouze èíselné znaky a maximálnì 10 znakù")
            }
        }
    }

    if (columnIndexes.message > -1) {
        const preMessage = data[columnIndexes.message]

        if (preMessage.length > 0) {
            if (isMessageValid(preMessage)) {
                message = preMessage
            } else {
                throw new Error("V poli ZPRÁVA mùžete použít i èeské háèky a èárky a nìkteré další znaky (závorky, èárky, støedníky, lomítka apod.).")
            }
        }
    }

    if (columnIndexes.note > -1) {
        const preNote = data[columnIndexes.note]

        if (preNote.length > 0) {
            if (isMessageValid(preNote)) {
                note = preNote
            } else {
                throw new Error("V poli POZNÁMKA mùžete použít i èeské háèky a èárky a nìkteré další znaky (závorky, èárky, støedníky, lomítka apod.).")
            }
        }
    }

    return {
        bankAccount,
        amount,
        vs,
        cs,
        ss,
        message,
        note
    }
}