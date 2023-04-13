interface AddedNode {
  textContent: string
}

interface Message {
  closeTab: boolean
}

function checkTargetText(addedNode: Node, targetText: string): boolean {
  const textContent = addedNode.textContent || ''
  return textContent.includes(targetText)
}

function processMutation(
  mutation: MutationRecord,
  targetText: string
): boolean {
  return Array.from(mutation.addedNodes).some((addedNode: Node) => {
    const isTargetTextFound = checkTargetText(addedNode, targetText)
    if (isTargetTextFound) {
      chrome.runtime.sendMessage({ closeTab: true })
    }
    return isTargetTextFound
  })
}

function processMutations(
  mutations: MutationRecord[],
  targetText: string,
  observer: MutationObserver
): void {
  const found = mutations.some((mutation) =>
    processMutation(mutation, targetText)
  )
  if (found) {
    observer.disconnect()
  }
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
