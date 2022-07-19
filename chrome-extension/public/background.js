// Initialize local storage when a windows is created.
// TODO: For every window, create a separate `state` object, each uniquely identified by the ID of 
// the window. 
chrome.windows.onCreated.addListener(function(window) {
  console.log(`Start initializing local storage state for window with ID ${window.id}.`);
  
  // Clear the local storage
  chrome.storage.local.clear();

  // Initialize the `state` object
  state = {
    [`state_${window.id}`]: {}
  }

  // Add the state object to the local storage.
  chrome.storage.local.set(state)

  console.log(`Finished initializing local storage state for window with ID ${window.id}.`)
})

// Clear old unused window states stored in the local storage on Chrome startup
chrome.runtime.onStartup.addListener(function() {
  console.log('Chrome onStartup: Start clearing the local storage.');

  chrome.storage.local.clear();

  console.log('Chrome onStartup: Finish clearing the local storage.');
})