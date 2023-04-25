interface AddedNode {
  textContent: string
}

interface Message {
  closeTab: boolean
}

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) => {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      func: function () {
        const targetText = 'ミーティングから退出しました'

        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
              if (
                addedNode.textContent &&
                addedNode.textContent.includes(targetText)
              ) {
                chrome.runtime.sendMessage({ closeTab: true })
                observer.disconnect()
                return
              }
            }
          }
        })

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        })
      },
    })
  },
  {
    url: [{ urlMatches: 'https://meet.google.com/*' }],
  }
)

chrome.runtime.onMessage.addListener(
  (message: Message, sender: chrome.runtime.MessageSender) => {
    if (message.closeTab) {
      chrome.tabs.remove(sender.tab!.id!)
    }
  }
)
