/* JavaScript logic for Gemini & ChatGPT RTL Formatter Popup Panel */

document.addEventListener('DOMContentLoaded', () => {
  const enableToggle = document.getElementById('enableToggle');
  const fontSelect = document.getElementById('fontSelect');
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const alignModeRadios = document.getElementsByName('alignMode');

  // Load settings from chrome.storage.local
  chrome.storage.local.get(['enabled', 'alignMode', 'selectedFont'], (res) => {
    // Default values if not yet set in storage
    const enabled = res.enabled !== undefined ? res.enabled : true;
    const alignMode = res.alignMode !== undefined ? res.alignMode : 'auto';
    const selectedFont = res.selectedFont !== undefined ? res.selectedFont : 'Vazirmatn';

    enableToggle.checked = enabled;
    fontSelect.value = selectedFont;
    updateStatusUI(enabled);

    // Set correct radio button for alignment mode
    for (const radio of alignModeRadios) {
      if (radio.value === alignMode) {
        radio.checked = true;
        break;
      }
    }
  });

  // Listen to enable/disable toggle changes
  enableToggle.addEventListener('change', () => {
    const enabled = enableToggle.checked;
    chrome.storage.local.set({ enabled });
    updateStatusUI(enabled);
  });

  // Listen to custom font select changes
  fontSelect.addEventListener('change', () => {
    const selectedFont = fontSelect.value;
    chrome.storage.local.set({ selectedFont });
  });

  // Listen to alignment mode selection changes
  for (const radio of alignModeRadios) {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        chrome.storage.local.set({ alignMode: radio.value });
      }
    });
  }

  // Update status UI indicator text & styles
  function updateStatusUI(enabled) {
    if (enabled) {
      statusIndicator.classList.remove('disabled');
      statusText.textContent = 'فعال';
    } else {
      statusIndicator.classList.add('disabled');
      statusText.textContent = 'غیرفعال';
    }
  }
});
