// Get DOM elements
const emailInput = document.getElementById('email');
const saveBtn = document.getElementById('save');
const status = document.getElementById('status');

// Save email to Chrome storage
saveBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  
  if (!email || !email.includes('@')) {
    showStatus('Please enter a valid email address', 'error');
    return;
  }

  try {
    await chrome.storage.sync.set({ userEmail: email });
    showStatus('Settings saved successfully!', 'success');
  } catch (error) {
    showStatus('Error saving settings: ' + error.message, 'error');
  }
});

// Load saved email when options page opens
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { userEmail } = await chrome.storage.sync.get('userEmail');
    if (userEmail) {
      emailInput.value = userEmail;
    }
  } catch (error) {
    showStatus('Error loading settings: ' + error.message, 'error');
  }
});

// Helper function to show status messages
function showStatus(message, type) {
  status.textContent = message;
  status.className = 'status ' + type;
  status.style.display = 'block';
  
  // Hide status after 3 seconds
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}
