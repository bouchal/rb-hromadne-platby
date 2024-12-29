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
                throw new Error("Bankovní účet musí být ve formátu 1111-22222222/4444")
            }
        }
    }

    if (columnIndexes.amount > -1) {
        const preAmount = data[columnIndexes.amount].replace(",", ".")

        if (preAmount.length > 0) {
            if (isAmountValid(preAmount)) {
                amount = preAmount
            } else {
                throw new Error("Částka musí být pozitivní číslo s tečkou nebo čárkou oddělující desetinná místa.")
            }
        }
    }

    if (columnIndexes.vs > -1) {
        const preVs = data[columnIndexes.vs]

        if (preVs.length > 0) {
            if (isSymbolValid(preVs)) {
                vs = preVs
            } else {
                throw new Error("VS musí obsahovat pouze číselné znaky a maximálně 10 znaků")
            }
        }
    }

    if (columnIndexes.cs > -1) {
        const preCs = data[columnIndexes.cs]

        if (preCs.length > 0) {
            if (isSymbolValid(preCs)) {
                cs = preCs
            } else {
                throw new Error("CS musí obsahovat pouze číselné znaky a maximálně 10 znaků")
            }
        }
    }

    if (columnIndexes.ss > -1) {
        const preSs = data[columnIndexes.ss]

        if (preSs.length > 0) {
            if (isSymbolValid(preSs)) {
                ss = preSs
            } else {
                throw new Error("SS musí obsahovat pouze číselné znaky a maximálně 10 znaků")
            }
        }
    }

    if (columnIndexes.message > -1) {
        const preMessage = data[columnIndexes.message]

        if (preMessage.length > 0) {
            if (isMessageValid(preMessage)) {
                message = preMessage
            } else {
                throw new Error("V poli ZPRÁVA můžete použít i české háčky a čárky a některé další znaky (závorky, čárky, středníky, lomítka apod.).")
            }
        }
    }

    if (columnIndexes.note > -1) {
        const preNote = data[columnIndexes.note]

        if (preNote.length > 0) {
            if (isMessageValid(preNote)) {
                note = preNote
            } else {
                throw new Error("V poli POZNÁMKA můžete použít i české háčky a čárky a některé další znaky (závorky, čárky, středníky, lomítka apod.).")
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