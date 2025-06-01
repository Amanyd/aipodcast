# Bookmark Podcast Generator

A Chrome extension that transforms your bookmarks into engaging podcast-style summaries using AI and text-to-speech technology. Get weekly automated summaries of your bookmarks or generate instant summaries on demand.

## Features

- **Automatic Weekly Summaries**: Receive a weekly email with summaries of bookmarks added in the last 7 days
- **Instant Summaries**: Click "Send Now" to get immediate summaries of all your bookmarks
- **AI-Powered Content**: Utilizes Google's Generative AI to create engaging content
- **Text-to-Speech**: Converts summaries into natural-sounding audio using ElevenLabs
- **Email Integration**: Receive summaries directly in your inbox
- **Customizable Settings**: Adjust voice, language, and other preferences through the extension options

## Project Structure

```
bookmark-podcast-extension/
├── backend/               # Node.js backend server
│   ├── server.js         # Main server file
│   ├── emailservice.js   # Email service integration
│   └── utils/            # Utility functions
├── extension/            # Chrome extension files
│   ├── manifest.json     # Extension configuration
│   ├── popup.html        # Extension popup interface
│   ├── popup.js          # Popup functionality
│   ├── background.js     # Background processes
│   ├── options.html      # Settings page
│   ├── options.js        # Settings functionality
│   └── icons/            # Extension icons
└── package.json          # Project dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- Chrome browser
- API keys for:
  - Google Generative AI
  - ElevenLabs
  - Email service (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd bookmark-podcast-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   cd backend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   GOOGLE_API_KEY=your_google_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   EMAIL_SERVICE_KEY=your_email_service_key
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` directory

## Usage

### Initial Setup
1. Click the extension icon in your Chrome toolbar
2. Click "Settings" to configure your email address
3. Save your settings

### Getting Summaries
You have two ways to receive summaries:

1. **Automatic Weekly Summaries**:
   - The extension automatically sends summaries every 7 days
   - Only includes bookmarks added in the last 7 days
   - You'll receive an email with:
     - Text summaries of each bookmark
     - A podcast-style audio summary
     - Links to the original content

2. **Instant "Send Now" Summaries**:
   - Click the extension icon
   - Click "Send Now"
   - Receive an immediate email with:
     - Summaries of ALL your bookmarks
     - A combined podcast of all content
     - Links to the original content

## Configuration

Access the extension settings by:
1. Right-clicking the extension icon
2. Selecting "Options"
3. Configure your preferences for:
   - Email address
   - Voice selection
   - Language
   - Summary length

## Development

To start the backend server:
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## Dependencies

### Backend
- Express.js - Web server framework
- Google Generative AI - AI text generation
- ElevenLabs - Text-to-speech conversion
- Nodemailer - Email functionality
- Cheerio - Web scraping
- Axios - HTTP client

### Extension
- Chrome Extension APIs
- Google Generative AI SDK

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team. 