// Background script for Bookmark Podcast Summarizer

// Initialize alarm for weekly summary
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('weeklySummary', {
    periodInMinutes: 7 * 24 * 60 // 7 days
  });
});

// Handle alarm trigger
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'weeklySummary') {
    sendWeeklySummary();
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendSummary') {
    sendImmediateSummary(request.urls, request.email)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }
});

// Function to fetch bookmarks
async function fetchBookmarks() {
  const bookmarks = await chrome.bookmarks.getTree();
  const flattenedBookmarks = [];
  
  function traverseBookmarks(bookmarkNodes) {
    for (const node of bookmarkNodes) {
      if (node.url) {
        flattenedBookmarks.push({
          title: node.title,
          url: node.url,
          dateAdded: node.dateAdded
        });
      }
      if (node.children) {
        traverseBookmarks(node.children);
      }
    }
  }
  
  traverseBookmarks(bookmarks);
  return flattenedBookmarks;
}

// Function to send immediate summary
async function sendImmediateSummary(urls, email) {
  try {
    const bookmarks = urls.map(url => ({
      url,
      dateAdded: Date.now()
    }));

    console.log('Sending summary request to backend:', {
      email,
      bookmarkCount: bookmarks.length
    });

    const response = await fetch('http://localhost:3000/api/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        bookmarks
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error response:', errorData);
      throw new Error(errorData.error || 'Failed to send summary');
    }

    const result = await response.json();
    console.log('Summary request successful:', result);
    return result;
  } catch (error) {
    console.error('Error sending immediate summary:', error);
    throw error;
  }
}

// Function to send weekly summary
async function sendWeeklySummary() {
  try {
    const bookmarks = await fetchBookmarks();
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    // Filter bookmarks from the last week
    const recentBookmarks = bookmarks.filter(bookmark => 
      bookmark.dateAdded > oneWeekAgo
    );

    // Get user's email from storage
    const { userEmail } = await chrome.storage.sync.get('userEmail');
    
    if (!userEmail) {
      console.error('No email configured');
      return;
    }

    console.log('Sending weekly summary request:', {
      email: userEmail,
      bookmarkCount: recentBookmarks.length
    });

    // Send to backend
    const response = await fetch('http://localhost:3000/api/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        bookmarks: recentBookmarks
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error response:', errorData);
      throw new Error(errorData.error || 'Failed to send summary');
    }

    const result = await response.json();
    console.log('Weekly summary request successful:', result);
    return result;
  } catch (error) {
    console.error('Error sending weekly summary:', error);
    throw error;
  }
}
