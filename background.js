chrome.alarms.onAlarm.addListener(a => {
    console.log('Alarm! Alarm!', a);
    chrome.tabs.create();
    // cool token stuff
    async function updateToken() {
        var bearToken = await fetch("https://algs.vercel.app/api", {
            method: 'GET',
            redirect: 'follow'
        })
        let token = await bearToken.text().toString();
        console.log(token);
        chrome.storage.sync.set({
            'token': token
        }, function () {
            console.log('Updated token to: ' + token);
            console.log('Updated initial token to: ' + token);
        });
    }
    updateToken();
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.get('alarm', a => {
        if (!a) {
            chrome.alarms.create('alarm', {periodInMinutes: 1}); // 110
            updateToken();
        }
    });
});