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
    const { bookmarks, email } = request;
    
    // For Send Now, send all bookmarks without filtering
    fetchWithRetry('http://localhost:3001/api/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        bookmarks: bookmarks
      })
    })
    .then(response => {
      if (!response) {
        throw new Error('No response received from server');
      }
      return response.json().then(data => {
        if (!response.ok) {
          throw new Error(data.error || 'Failed to send summary');
        }
        sendResponse({ success: true, message: data.message });
      });
    })
    .catch(error => {
      console.error('Error:', error);
      sendResponse({ success: false, error: error.message });
    });

    return true; // Required for async sendResponse
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

// Function to fetch with retry
async function fetchWithRetry(url, options, maxRetries = 3, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempting request to ${url}, attempt ${i + 1} of ${maxRetries}`);
      const response = await fetch(url, options);
      if (!response) {
        throw new Error('No response received');
      }
      if (response.status === 503) {
        console.log(`Server is spinning up, attempt ${i + 1} of ${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return response;
    } catch (error) {
      console.error(`Request failed on attempt ${i + 1}:`, error);
      if (i === maxRetries - 1) throw error;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
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

    const response = await fetchWithRetry('https://podbackend-d9cg.onrender.com/api/summary', {
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
    const response = await fetchWithRetry('https://podbackend-d9cg.onrender.com/api/summary', {
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
