chrome.omnibox.onInputChanged.addListener(
    function() {
        console.log('input started');
        chrome.omnibox.setDefaultSuggestion({description: 'piss'});
    }
)