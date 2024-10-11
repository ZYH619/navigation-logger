console.log('heihei')
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTabId = tabs[0].id

  chrome.storage.local.get([currentTabId.toString()], (result) => {
    const historyList = document.getElementById('history-list')
    const history = result[currentTabId] || []

    history.forEach((url) => {
      const li = document.createElement('li')
      li.textContent = url
      historyList.appendChild(li)
    })
  })
})
