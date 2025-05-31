// Handle "Send Summary Now" button click
document.getElementById('sendNow').addEventListener('click', async () => {
  const status = document.getElementById('status');
  
  try {
    // Get email from storage
    const { userEmail } = await chrome.storage.sync.get('userEmail');
    
    if (!userEmail) {
      showStatus('Please configure your email in settings first', 'error');
      return;
    }

    // Get all bookmarks
    const bookmarkTreeNodes = await chrome.bookmarks.getTree();
    const urls = extractUrls(bookmarkTreeNodes);

    if (urls.length === 0) {
      showStatus('No bookmarks found to summarize', 'error');
      return;
    }

    // Send message to background script to trigger summary
    chrome.runtime.sendMessage({ 
      action: 'sendSummary',
      urls: urls,
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

// Handle "Open Settings" button click
document.getElementById('openSettings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// Helper function to show status messages
function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
  status.style.display = 'block';
  
  // Hide status after 3 seconds
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

// Check if email is configured when popup opens
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

// Helper function to extract URLs from bookmark tree
function extractUrls(nodes, urls = []) {
  for (let node of nodes) {
    if (node.url && (node.url.startsWith('http://') || node.url.startsWith('https://'))) {
      urls.push(node.url);
    }
    if (node.children) extractUrls(node.children, urls);
  }
  return urls;
}
