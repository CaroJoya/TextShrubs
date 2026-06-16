# Text Shrubs <3

A Chrome extension that provides instant definitions for selected text and transforms the tone of any text using AI.

## Features

- Select any text on a webpage to get an instant definition
- Transform text into different vibes:
  - Casual - friendly and conversational tone
  - Professional - formal and business-like tone
  - Simple - explained like you are 5 years old
  - Gossip - dramatic and entertaining style

## How It Works

1. Select any text on a webpage
2. A floating box appears with the definition
3. Click any vibe button to transform the text
4. The transformed text appears instantly

## Installation

### From Source (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Turn on "Developer mode" (top right corner)
4. Click "Load unpacked"
5. Select the folder containing these files
6. The extension is now installed


## Setup

### Get an OpenAI API Key

The AI transformation features require an OpenAI API key.

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in to your account
3. Click "Create new secret key"
4. Name your key (e.g., "Text Shrubs")
5. Copy the key (starts with sk-)

### Add the API Key to the Extension

1. Click the extension icon in your Chrome toolbar
2. Paste your OpenAI API key
3. Click "Save Key"

The extension will now remember your key and use it for all AI transformations.

Note: The dictionary definition feature works without an API key.

## File Structure

```
TextShrubs/
├── manifest.json    - Extension configuration
├── content.js       - Main extension logic
├── popup.html       - Settings page
├── popup.js         - Settings page logic
├── style.css        - Styling
└── icon.png         - Extension icon
```

## Technical Stack

- Vanilla JavaScript (ES6+)
- Chrome Extensions Manifest V3
- Dictionary API (free)
- OpenAI API (requires API key)

## Usage

### Getting Definitions

Select any word on a webpage. A floating box will appear showing the definition.

### Changing Text Vibes

1. Select any text (up to 200 characters)
2. Click one of the vibe buttons:
   - Casual - makes text friendly
   - Professional - makes text formal
   - Simple - explains in simple terms
   - Tea - adds dramatic flair
3. The transformed text appears in the box

## Limitations

- Text selection limited to 200 characters for AI features
- OpenAI API key required for vibe transformations
- Requires internet connection for API calls
- Works only on desktop Chrome browser

## Privacy

- Your API key is stored locally in Chrome's secure storage
- No data is sent to any server except the Dictionary API and OpenAI API
- No analytics or tracking is implemented

