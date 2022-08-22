// Initialize local storage when a window is created.
chrome.windows.onCreated.addListener((window) => {
  console.log(`Start initializing local storage state for window with ID ${window.id}.`);
  
  // Clear the local storage
  chrome.storage.local.clear();

  // Initialize the `state` object
  state = {
    [`state_${window.id}`]: {
      isAnalysisInProgress: false
    }
  }

  // Add the state object to the local storage.
  chrome.storage.local.set(state)

  console.log(`Finished initializing local storage state for window with ID ${window.id}.`)
})

// Clear old unused window states stored in the local storage on Chrome startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Chrome onStartup: Start clearing the local storage.');

  chrome.storage.local.clear();

  console.log('Chrome onStartup: Finish clearing the local storage.');
})

// Trigger a reliability analysis on accessing a new link
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Tab should be loaded and active
  if (!tab.active) return;
  
  // Get the state of the current window
  const stateKey = `state_${tab.windowId}`;
  const state = await chrome.storage.local.get(stateKey);
  const isAnalysisInProgress = state[stateKey].isAnalysisInProgress;
  
  // There should be no analysis in progress
  if (isAnalysisInProgress) return;
  
  // The source should be present in the database of wiki sources
  const response = await fetch(`http://127.0.0.1:8080/sources?url=${tab.url}`)
  if (response.status != 200) return;

  // Signal to the front-end to start an analysis on the url of the current tab
  currentState = {...state, [stateKey]: {...state[stateKey],
    isAnalysisInProgress: true, 
    shouldShowReliabilityAnalysis: true, 
    currentArticle: {...state[stateKey].currentArticle, url: tab.url}
  }};
  chrome.storage.local.set(currentState);

  // Add loading animation to icon
  let currentAnimationStep = 0;
  const intervalId = setInterval(async () => {
    chrome.action.setIcon({path: `logo-loading-step-${currentAnimationStep + 1}.png`});
    currentAnimationStep = (currentAnimationStep + 1) % 3;

    const state = await chrome.storage.local.get(stateKey);
    const isAnalysisInProgress = state[stateKey].isAnalysisInProgress;

    if (!isAnalysisInProgress) {
      const totalScore = state[stateKey].analysisTotalScore;
      if (totalScore <= 20) {
        chrome.action.setIcon({path: 'logo-highly-unreliable.png'});
      } else if (totalScore <= 40) {
        chrome.action.setIcon({path: 'logo-unreliable.png'});
      } else if (totalScore <= 60) {
        chrome.action.setIcon({path: 'logo-fairly-unreliable.png'});
      } else if (totalScore <= 80) {
        chrome.action.setIcon({path: 'logo-reliable.png'});
      } else {
        chrome.action.setIcon({path: 'logo-highly-reliable.png'});
      }

      clearInterval(intervalId);
    }
  }, 1000);
})