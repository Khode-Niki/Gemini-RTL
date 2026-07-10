/* Content Script for Gemini RTL Formatter Extension */

// Default settings
let settings = {
  enabled: true,
  alignMode: 'auto', // 'auto', 'force-rtl', 'force-ltr'
  selectedFont: 'Vazirmatn' // 'default', 'Vazirmatn', 'AbarLow', 'Lahzeh', 'Modam', 'Pelak', 'Peyda', 'Pinar', 'YekanBakh'
};

// Regex to detect Persian/Arabic characters
const hasPersianRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

const hasPersian = (text) => hasPersianRegex.test(text);

// Process a single element
function processTextElement(el, force = false) {
  // Exclude code blocks and syntax-highlighted containers
  if (
    el.closest('pre') || 
    el.closest('code') || 
    el.closest('[class*="code"]') || 
    el.closest('[class*="syntax"]') ||
    el.closest('.katex') || // KaTeX math blocks
    el.closest('math')
  ) {
    return;
  }

  // Get text content (value for inputs/textareas, textContent for others)
  const text = (el.value !== undefined ? el.value : el.textContent) || '';

  // Avoid unnecessary DOM operations if text hasn't changed
  if (!force && el.dataset.lastCheckedText === text) {
    return;
  }
  el.dataset.lastCheckedText = text;

  // If extension is disabled, clear styling
  if (!settings.enabled) {
    el.classList.remove('gemini-rtl-forced', 'gemini-rtl-font', 'gemini-ltr-forced');
    return;
  }

  if (settings.alignMode === 'force-rtl') {
    el.classList.add('gemini-rtl-forced');
    el.classList.remove('gemini-ltr-forced');
    if (settings.selectedFont !== 'default') {
      el.classList.add('gemini-rtl-font');
    } else {
      el.classList.remove('gemini-rtl-font');
    }
  } else if (settings.alignMode === 'force-ltr') {
    el.classList.add('gemini-ltr-forced');
    el.classList.remove('gemini-rtl-forced', 'gemini-rtl-font');
  } else {
    // Auto Mode: check if text contains Persian
    if (hasPersian(text)) {
      el.classList.add('gemini-rtl-forced');
      el.classList.remove('gemini-ltr-forced');
      if (settings.selectedFont !== 'default') {
        el.classList.add('gemini-rtl-font');
      } else {
        el.classList.remove('gemini-rtl-font');
      }

      // If it's a list item (li), also set RTL on its parent ul/ol to format bullet points
      if (el.tagName === 'LI') {
        const parentList = el.closest('ul, ol');
        if (parentList) {
          parentList.classList.add('gemini-rtl-forced');
          if (settings.selectedFont !== 'default') {
            parentList.classList.add('gemini-rtl-font');
          }
        }
      }
    } else {
      el.classList.remove('gemini-rtl-forced', 'gemini-rtl-font', 'gemini-ltr-forced');
    }
  }
}

// Sweep the whole page for relevant text containers
function applyRTL(force = false) {
  if (!settings.enabled) {
    clearAllRTL();
    return;
  }

  const selector = 'p, li, h1, h2, h3, h4, h5, h6, blockquote, [contenteditable="true"], textarea, message-content, .message-content';
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => processTextElement(el, force));
}

// Reset all styles (used when extension is disabled)
function clearAllRTL() {
  const elements = document.querySelectorAll('.gemini-rtl-forced, .gemini-rtl-font, .gemini-ltr-forced');
  elements.forEach(el => {
    el.classList.remove('gemini-rtl-forced', 'gemini-rtl-font', 'gemini-ltr-forced');
    delete el.dataset.lastCheckedText;
  });

  const lists = document.querySelectorAll('ul.gemini-rtl-forced, ol.gemini-rtl-forced');
  lists.forEach(el => {
    el.classList.remove('gemini-rtl-forced', 'gemini-rtl-font');
  });
}

// Load settings and initialize
chrome.storage.local.get(['enabled', 'alignMode', 'selectedFont'], (res) => {
  if (res.enabled !== undefined) settings.enabled = res.enabled;
  if (res.alignMode !== undefined) settings.alignMode = res.alignMode;
  if (res.selectedFont !== undefined) settings.selectedFont = res.selectedFont;

  applyFontSettings();
  applyRTL(true);
  initObserver();
});

// Watch storage adjustments
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    let changed = false;
    let fontChanged = false;
    if (changes.enabled) {
      settings.enabled = changes.enabled.newValue;
      changed = true;
    }
    if (changes.alignMode) {
      settings.alignMode = changes.alignMode.newValue;
      changed = true;
    }
    if (changes.selectedFont) {
      settings.selectedFont = changes.selectedFont.newValue;
      changed = true;
      fontChanged = true;
    }

    if (changed) {
      if (fontChanged) {
        applyFontSettings();
      }
      if (!settings.enabled) {
        clearAllRTL();
      } else {
        applyRTL(true);
      }
    }
  }
});

// Setup MutationObserver to scan dynamically loaded content
let observer = null;
function initObserver() {
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldRun = true;
        break;
      }
      if (mutation.type === 'characterData') {
        shouldRun = true;
        break;
      }
    }

    if (shouldRun) {
      applyRTL();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

// Watch user typing in prompt box / inputs
document.addEventListener('input', (e) => {
  const target = e.target;
  if (target.isContentEditable || target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
    processTextElement(target, true);
  }
});

// Re-process on window load or focus
window.addEventListener('load', () => {
  applyFontSettings();
  applyRTL(true);
});
window.addEventListener('focus', () => applyRTL(true));

// Dynamically set CSS custom property for custom Persian fonts
function applyFontSettings() {
  let fontFamily = 'Vazirmatn'; // default fallback
  if (settings.selectedFont === 'default') {
    document.documentElement.style.removeProperty('--custom-rtl-font');
    return;
  }
  
  switch (settings.selectedFont) {
    case 'AbarLow':
      fontFamily = "'AbarLow', sans-serif";
      break;
    case 'Lahzeh':
      fontFamily = "'Lahzeh', sans-serif";
      break;
    case 'Modam':
      fontFamily = "'Modam', sans-serif";
      break;
    case 'Pelak':
      fontFamily = "'Pelak', sans-serif";
      break;
    case 'Peyda':
      fontFamily = "'Peyda', sans-serif";
      break;
    case 'Pinar':
      fontFamily = "'Pinar', sans-serif";
      break;
    case 'YekanBakh':
      fontFamily = "'YekanBakh', sans-serif";
      break;
    case 'Vazirmatn':
    default:
      fontFamily = "'Vazirmatn', sans-serif";
      break;
  }
  
  document.documentElement.style.setProperty('--custom-rtl-font', fontFamily);
}
