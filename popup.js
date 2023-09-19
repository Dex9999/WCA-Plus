chrome.storage.sync.get(["rank"], function(items){
    // console.log("yup")
    // console.log(items)
    const newE = document.createElement('h2');
    newE.className = 'lol-element';
    newE.innerHTML = items.rank
    // document.body.appendChild(newE)
})
document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggleSwitch');
  
    // Get the current extension status
    chrome.storage.sync.get('enabled', function (data) {
      toggleSwitch.checked = data.enabled || false;
      updateStatusText(data.enabled);
    });
  
    // Toggle the extension status and update the UI accordingly
    toggleSwitch.addEventListener('change', function () {
      const enabled = toggleSwitch.checked;
      updateStatusText(enabled);
      chrome.storage.sync.set({ enabled });
      chrome.runtime.sendMessage({ enabled });
    });
  
    // Update the status text based on the extension status
    function updateStatusText(enabled) {
      const status = document.getElementById('status');
      status.textContent = enabled ? 'Extension is enabled' : 'Extension is disabled';
    }
  });
  