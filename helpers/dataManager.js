
async function sendMessageToContentScript(message) {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, message, function (response) {
                resolve(response);
            });
        });
    })
}

async function getStateFromContent() {
    const stateFromContent = await sendMessageToContentScript({
        action: "getState"
    })

    if (!stateFromContent) {
        throw new Error("Nepodařilo se načíst state z content scriptu")
    }

    return stateFromContent
}