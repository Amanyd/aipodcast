# Bookmark Podcast Summarizer

A Chrome extension that automatically collects your bookmarks, generates AI-powered summaries, and creates audio podcasts of your weekly reading material.

## Features

- **Automatic Bookmark Collection**: Seamlessly collects and organizes your bookmarks
- **AI-Powered Summaries**: Uses Hugging Face's AI models to generate concise summaries
- **Weekly Podcast Generation**: Converts summaries into audio podcasts using gTTS
- **Email Delivery**: Sends weekly summaries and podcasts directly to your email
- **Customizable Settings**: Configure your email and preferences through the extension options

## Tech Stack

### Frontend (Chrome Extension)
- **HTML/CSS/JavaScript**: Core extension interface
- **Chrome Extension APIs**: For bookmark management and background tasks
- **Bootstrap**: For responsive and modern UI design

### Backend (Node.js Server)
- **Express.js**: Web server framework
- **Hugging Face Inference API**: For AI-powered text summarization
- **gTTS (Google Text-to-Speech)**: For generating audio podcasts
- **Brevo (formerly Sendinblue)**: For email delivery
- **Cheerio**: For web scraping and content extraction
- **Axios**: For HTTP requests

## Project Structure

```
bookmark-podcast-summarizer/
├── extension/                 # Chrome extension files
│   ├── manifest.json         # Extension configuration
│   ├── popup.html           # Extension popup interface
│   ├── popup.js             # Popup functionality
│   ├── background.js        # Background tasks
│   ├── options.html         # Settings page
│   └── options.js           # Settings functionality
├── backend/                  # Node.js server
│   ├── server.js            # Main server file
│   ├── package.json         # Dependencies
│   └── .env                 # Environment variables
└── README.md                # Project documentation
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   BREVO_API_KEY=your_brevo_api_key
   EMAIL_FROM=your_sender_email
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `extension` directory
4. Click the extension icon and configure your email in the options

## How It Works

1. **Bookmark Collection**:
   - The extension monitors and collects your bookmarks
   - Bookmarks are stored locally in Chrome's storage

2. **Weekly Processing**:
   - Every week, the extension sends bookmarks to the backend
   - The backend extracts content from each bookmark
   - AI generates concise summaries of the content

3. **Podcast Generation**:
   - Summaries are converted to speech using gTTS
   - Audio is generated in MP3 format
   - Podcast is attached to the weekly email

4. **Email Delivery**:
   - Weekly summary and podcast are sent via Brevo
   - Email includes both text summary and audio player
   - MP3 file is attached for offline listening

## Environment Variables

- `BREVO_API_KEY`: Your Brevo API key for email sending
- `EMAIL_FROM`: The email address to send summaries from
- `PORT`: The port number for the backend server (default: 3000)

## Dependencies

### Backend
- express: Web server framework
- sib-api-v3-sdk: Brevo email API client
- cheerio: HTML parsing and content extraction
- axios: HTTP client
- @huggingface/inference: AI model integration
- node-gtts: Text-to-speech conversion
- dotenv: Environment variable management

### Frontend
- Bootstrap: UI framework
- Chrome Extension APIs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hugging Face for AI models
- Google for text-to-speech technology
- Brevo for email delivery services 