chrome.storage.sync.get(["rank"], function(items){
    // console.log("yup")
    // console.log(items)
    const newE = document.createElement('h2');
    newE.className = 'lol-element';
    newE.innerHTML = items.rank
    document.body.appendChild(newE)
})