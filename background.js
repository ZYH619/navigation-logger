// 用于存储导航和重定向历史记录
let navigationHistory = {}

// 监听导航完成事件
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const tabId = details.tabId
  const url = details.url
  debugger
  // 初始化或更新标签页的历史记录
  if (!navigationHistory[tabId]) {
    navigationHistory[tabId] = []
  }

  // 添加当前页面到历史记录中
  navigationHistory[tabId].push(url)
  console.log(`Tab ${tabId} navigation history:`, navigationHistory[tabId])

  // 将历史记录存储到浏览器的本地存储中
  chrome.storage.local.set({ [tabId]: navigationHistory[tabId] })
})

// 监听重定向事件
chrome.webRequest.onBeforeRedirect.addListener(
  (details) => {
    const tabId = details.tabId
    const redirectUrl = details.redirectUrl

    // 初始化或更新标签页的历史记录
    if (!navigationHistory[tabId]) {
      navigationHistory[tabId] = []
    }

    // 记录重定向的 URL
    navigationHistory[tabId].push(redirectUrl)
    console.log(`Tab ${tabId} redirected to:`, redirectUrl)

    // 更新存储的历史记录
    chrome.storage.local.set({ [tabId]: navigationHistory[tabId] })
  },
  { urls: ['<all_urls>'] } // 监听所有 URL 的重定向
)

// 监听标签页关闭事件，清理对应的历史记录
chrome.tabs.onRemoved.addListener((tabId) => {
  delete navigationHistory[tabId]
})
