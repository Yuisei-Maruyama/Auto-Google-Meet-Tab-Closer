interface Message {
  closeTab: boolean
}

function addEndCallListener() {
  const endCallButton = document.querySelector(
    'button[aria-label="通話から退出"]'
  )

  if (endCallButton) {
    endCallButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ closeTab: true })
    })
  } else {
    setTimeout(addEndCallListener, 500)
  }
}

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: details.tabId },
        func: addEndCallListener,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message)
        }
      }
    )
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
