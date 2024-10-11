;(function () {
  console.log('啥都会发')
  // 保存原始的 pushState 和 replaceState
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  // 劫持 pushState
  history.pushState = function (state, title, url) {
    console.log('走了新的api')
    originalPushState.apply(this, arguments)
    window.dispatchEvent(
      new CustomEvent('history-changed', { detail: { state, url } })
    )
  }

  // 劫持 replaceState
  history.replaceState = function (state, title, url) {
    originalReplaceState.apply(this, arguments)
    window.dispatchEvent(
      new CustomEvent('history-changed', { detail: { state, url } })
    )
  }

  // 监听 popstate 事件
  window.addEventListener('popstate', function (event) {
    console.log('进来了')
    window.dispatchEvent(
      new CustomEvent('history-changed', {
        detail: { state: event.state, url: document.location.href },
      })
    )
  })

  // 监听自定义的 history-changed 事件并将信息发送给后台
  window.addEventListener('history-changed', function (event) {
    const url = event.detail.url || document.location.href
    chrome.runtime.sendMessage({ type: 'history-changed', url: url })
  })
})()
