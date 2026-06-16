// content.js - The main extension logic

let floatingBox = null;
let selectedText = '';
let currentVibe = '';

// ========== STEP 1: Detect text selection ==========
document.addEventListener('mouseup', function(event) {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  if (text.length > 0 && text.length < 200) {
    selectedText = text;
    showFloatingBox(event.clientX, event.clientY, text);
  } else if (text.length >= 200) {
    showNotification('Text too long! Select less than 200 characters.');
  }
});

// ========== STEP 2: Show the floating box ==========
function showFloatingBox(x, y, text) {
  // Remove existing box if any
  removeFloatingBox();
  
  // Create the box
  floatingBox = document.createElement('div');
  floatingBox.id = 'text-vibe-box';
  floatingBox.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y + 15}px;
    width: 320px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    padding: 16px;
    z-index: 10000;
    font-family: 'Segoe UI', Roboto, sans-serif;
    max-height: 400px;
    overflow-y: auto;
  `;
  
  // Content of the box
  floatingBox.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start;">
      <div style="flex: 1;">
        <strong style="font-size: 14px; color: #333;">📖 "${text}"</strong>
        <div id="definition-area" style="margin: 8px 0; font-size: 13px; color: #555;">
          ⏳ Loading definition...
        </div>
      </div>
      <button id="close-vibe-box" style="
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #999;
        padding: 0 5px;
      ">✕</button>
    </div>
    
    <div style="margin-top: 12px;">
      <p style="font-size: 12px; color: #666; margin-bottom: 8px;">✨ Change vibe:</p>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="vibe-btn" data-vibe="casual" style="
          padding: 6px 14px;
          border: none;
          border-radius: 15px;
          background: #e3f2fd;
          color: #1976d2;
          cursor: pointer;
          font-size: 12px;
        ">😊 Casual</button>
        
        <button class="vibe-btn" data-vibe="professional" style="
          padding: 6px 14px;
          border: none;
          border-radius: 15px;
          background: #e8f5e9;
          color: #388e3c;
          cursor: pointer;
          font-size: 12px;
        ">👔 Pro</button>
        
        <button class="vibe-btn" data-vibe="simple" style="
          padding: 6px 14px;
          border: none;
          border-radius: 15px;
          background: #fff3e0;
          color: #f57c00;
          cursor: pointer;
          font-size: 12px;
        ">🧒 Simple</button>
        
        <button class="vibe-btn" data-vibe="gossip" style="
          padding: 6px 14px;
          border: none;
          border-radius: 15px;
          background: #fce4ec;
          color: #c62828;
          cursor: pointer;
          font-size: 12px;
        ">☕ Tea</button>
      </div>
    </div>
    
    <div id="result-area" style="
      margin-top: 10px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 8px;
      font-size: 13px;
      color: #333;
      display: none;
      word-wrap: break-word;
    "></div>
  `;
  
  document.body.appendChild(floatingBox);
  
  // ========== STEP 3: Get definition ==========
  getDefinition(text);
  
  // ========== STEP 4: Handle close button ==========
  document.getElementById('close-vibe-box').addEventListener('click', removeFloatingBox);
  
  // ========== STEP 5: Handle vibe buttons ==========
  document.querySelectorAll('.vibe-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const vibe = this.dataset.vibe;
      transformText(selectedText, vibe);
    });
  });
  
  // Close box when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function outsideClick(e) {
      if (floatingBox && !floatingBox.contains(e.target)) {
        removeFloatingBox();
        document.removeEventListener('click', outsideClick);
      }
    });
  }, 100);
}

// ========== STEP 6: Remove floating box ==========
function removeFloatingBox() {
  if (floatingBox) {
    floatingBox.remove();
    floatingBox = null;
  }
}

// ========== STEP 7: Get definition from Dictionary API ==========
function getDefinition(word) {
  const definitionArea = document.getElementById('definition-area');
  
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
    .then(response => {
      if (!response.ok) throw new Error('Word not found');
      return response.json();
    })
    .then(data => {
      if (data && data[0] && data[0].meanings && data[0].meanings[0]) {
        const definition = data[0].meanings[0].definitions[0].definition;
        definitionArea.innerHTML = `<strong>Definition:</strong> ${definition}`;
      } else {
        definitionArea.innerHTML = '❌ No definition found';
      }
    })
    .catch(error => {
      definitionArea.innerHTML = '❌ No definition found';
      console.log('Dictionary API error:', error);
    });
}

// ========== STEP 8: Transform text with OpenAI ==========
function transformText(text, vibe) {
  const resultArea = document.getElementById('result-area');
  const allButtons = document.querySelectorAll('.vibe-btn');
  
  // Disable all buttons while loading
  allButtons.forEach(btn => btn.disabled = true);
  btn.style.opacity = '0.6';
  
  resultArea.style.display = 'block';
  resultArea.innerHTML = '⏳ Thinking...';
  
  // Get API key from storage
  chrome.storage.sync.get(['apiKey'], function(result) {
    const apiKey = result.apiKey;
    
    if (!apiKey) {
      resultArea.innerHTML = '❌ Please set your OpenAI API key first (click extension icon)';
      allButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
      });
      return;
    }
    
    // Create prompt based on vibe
    let prompt = '';
    switch(vibe) {
      case 'casual':
        prompt = `Rewrite this in a casual, friendly tone:\n\n"${text}"`;
        break;
      case 'professional':
        prompt = `Rewrite this in a professional, formal tone:\n\n"${text}"`;
        break;
      case 'simple':
        prompt = `Explain this simply, like I'm 5 years old:\n\n"${text}"`;
        break;
      case 'gossip':
        prompt = `Spill the tea! Rewrite this in a gossipy, dramatic style:\n\n"${text}"`;
        break;
    }
    
    // Call OpenAI API
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that rewrites text in different tones.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your key.');
        }
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.choices && data.choices[0]) {
        const transformed = data.choices[0].message.content.trim();
        resultArea.innerHTML = `✨ <strong>${vibe.charAt(0).toUpperCase() + vibe.slice(1)}:</strong><br>${transformed}`;
      } else {
        resultArea.innerHTML = '❌ No response from AI';
      }
    })
    .catch(error => {
      resultArea.innerHTML = `❌ ${error.message}`;
      console.error('OpenAI error:', error);
    })
    .finally(() => {
      // Re-enable buttons
      allButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
      });
    });
  });
}

// ========== STEP 9: Show notification ==========
function showNotification(message) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 99999;
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
  `;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

console.log('🚀 Text Vibe & Definer loaded!');