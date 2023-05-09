const init = function(){

    const injectElement = document.createElement('div');
    injectElement.className = 'lol-element';
    injectElement.innerHTML = 'Yo whaddup 😎'

    document.body.appendChild(injectElement);
    let elements = document.getElementsByClassName("world-rank ")
    Array.from(elements).forEach(element => {
        let ele = parseInt(element.innerHTML)
        if (ele < 20) {
          element.style.backgroundColor = '#bf8c00';
          if (ele == 1) {
              element.style.color = '#FFFFFF'
          }
        } else if (ele > 20 && ele < 50) {
            element.style.backgroundColor = '#7d7d7d';
        } else if (ele > 50 && ele < 100) {
            element.style.backgroundColor = '#a05d00';
        }
      });
      console.log(elements[0])
      let firstElement = elements[0]
      chrome.storage.sync.set({ "rank": firstElement.innerHTML }) 
}
init();