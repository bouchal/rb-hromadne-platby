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
                throw new Error("Bankovn� ��et mus� b�t ve form�tu 1111-22222222/4444")
            }
        }
    }

    if (columnIndexes.amount > -1) {
        const preAmount = data[columnIndexes.amount].replace(",", ".")

        if (preAmount.length > 0) {
            if (isAmountValid(preAmount)) {
                amount = preAmount
            } else {
                throw new Error("��stka mus� b�t pozitivn� ��slo s te�kou nebo ��rkou odd�luj�c� desetinn� m�sta.")
            }
        }
    }

    if (columnIndexes.vs > -1) {
        const preVs = data[columnIndexes.vs]

        if (preVs.length > 0) {
            if (isSymbolValid(preVs)) {
                vs = preVs
            } else {
                throw new Error("VS mus� obsahovat pouze ��seln� znaky a maxim�ln� 10 znak�")
            }
        }
    }

    if (columnIndexes.cs > -1) {
        const preCs = data[columnIndexes.cs]

        if (preCs.length > 0) {
            if (isSymbolValid(preCs)) {
                cs = preCs
            } else {
                throw new Error("CS mus� obsahovat pouze ��seln� znaky a maxim�ln� 10 znak�")
            }
        }
    }

    if (columnIndexes.ss > -1) {
        const preSs = data[columnIndexes.ss]

        if (preSs.length > 0) {
            if (isSymbolValid(preSs)) {
                ss = preSs
            } else {
                throw new Error("SS mus� obsahovat pouze ��seln� znaky a maxim�ln� 10 znak�")
            }
        }
    }

    if (columnIndexes.message > -1) {
        const preMessage = data[columnIndexes.message]

        if (preMessage.length > 0) {
            if (isMessageValid(preMessage)) {
                message = preMessage
            } else {
                throw new Error("V poli ZPR�VA m��ete pou��t i �esk� h��ky a ��rky a n�kter� dal�� znaky (z�vorky, ��rky, st�edn�ky, lom�tka apod.).")
            }
        }
    }

    if (columnIndexes.note > -1) {
        const preNote = data[columnIndexes.note]

        if (preNote.length > 0) {
            if (isMessageValid(preNote)) {
                note = preNote
            } else {
                throw new Error("V poli POZN�MKA m��ete pou��t i �esk� h��ky a ��rky a n�kter� dal�� znaky (z�vorky, ��rky, st�edn�ky, lom�tka apod.).")
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