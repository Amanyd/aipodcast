document.getElementById('sendNow').addEventListener('click', async () => {
  const status = document.getElementById('status');

  try {
    const { userEmail } = await chrome.storage.sync.get('userEmail');

    if (!userEmail) {
      showStatus('Please configure your email in settings first', 'error');
      return;
    }

    const bookmarkTreeNodes = await chrome.bookmarks.getTree();
    const bookmarks = extractUrls(bookmarkTreeNodes);

    if (bookmarks.length === 0) {
      showStatus('No bookmarks found to summarize', 'error');
      return;
    }

    chrome.runtime.sendMessage({
      action: 'sendSummary',
      bookmarks: bookmarks,
      email: userEmail
    }, (response) => {
      if (response.success) {
        showStatus('Summary sent successfully! Check your email.', 'success');
      } else {
        showStatus('Error sending summary: ' + response.error, 'error');
      }
    });
  } catch (error) {
    showStatus('Error: ' + error.message, 'error');
  }
});

document.getElementById('openSettings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

function showStatus(message, type) {
  const status = document.getElementById('status');
  const spacer = document.getElementById('statusSpacer');

  status.textContent = message;
  status.className = 'status ' + type + ' show';
  spacer.classList.add('visible');

  setTimeout(() => {
    status.classList.remove('show');
    spacer.classList.remove('visible');
  }, 3000);
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { userEmail } = await chrome.storage.sync.get('userEmail');
    if (!userEmail) {
      showStatus('Please configure your email in settings', 'error');
    }
  } catch (error) {
    showStatus('Error loading settings: ' + error.message, 'error');
  }
});

function extractUrls(nodes, bookmarks = []) {
  for (let node of nodes) {
    if (node.url && (node.url.startsWith('http://') || node.url.startsWith('https://'))) {
      bookmarks.push({
        url: node.url,
        title: node.title || 'Untitled',
        dateAdded: node.dateAdded || Date.now()
      });
    }
    if (node.children) extractUrls(node.children, bookmarks);
  }
  return bookmarks;
}
