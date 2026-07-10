# Gemini & ChatGPT Persian RTL Formatter
> A premium Chrome Extension to format Persian/Arabic texts to Right-to-Left (RTL) layout on Google Gemini and ChatGPT, with customizable custom Persian fonts.

افزونه‌ای حرفه‌ای و مدرن برای گوگل جمنای و چت‌جی‌پی‌تی جهت راست‌چین‌سازی متون فارسی/عربی همراه با قابلیت انتخاب فونت‌های فارسی یا بازگشت به فونت اصلی وب‌سایت.

---

## Features | امکانات

- 🚀 **Multi-platform support**: Works seamlessly on both [Google Gemini](https://gemini.google.com) and [ChatGPT](https://chatgpt.com).
- 🔄 **Smart Auto RTL**: Automatically detects Persian/Arabic characters and applies RTL alignment.
- 🎨 **Premium Font Selection**: Choice of 8 beautiful Persian web fonts:
  - **Vazirmatn** (Default)
  - **Pelak**
  - **YekanBakh**
  - **Peyda**
  - **Modam**
  - **Lahzeh**
  - **Pinar**
  - **AbarLow**
- ⚙️ **Fallback to Site Font**: Option to keep the website's default font family while maintaining RTL structure.
- 🧠 **Code & Math Safe**: Prevents code blocks (`<pre>`, `<code>`), KaTeX, and MathJax elements from being reversed, keeping them LTR.
- 🌑 **Premium UI**: Modern, glossy dark-theme control panel (Popup menu).

---

## Installation | راهنمای نصب

### English: How to install manually
Since this extension is loaded as an **unpacked extension** in developer mode:

1. **Download the project**: Clone or download this repository to your local computer.
2. **Open Extensions page**: Open Google Chrome (or any Chromium browser like Edge/Brave) and navigate to `chrome://extensions/`.
3. **Enable Developer Mode**: Turn on the **"Developer mode"** toggle in the top-right corner.
4. **Load Unpacked**: Click on the **"Load unpacked"** button in the top-left corner.
5. **Select Folder**: Choose the main folder of this project (the directory containing `manifest.json`).
6. **Done!** The extension icon will appear in your toolbar. Open Gemini or ChatGPT to start chatting in RTL!

---

### فارسی: راهنمای نصب دستی
از آنجا که این افزونه به صورت دستی و از طریق حالت توسعه‌دهنده (Developer Mode) لود می‌شود:

1. **دانلود پروژه:** پروژه را دانلود کرده و در یک پوشه در کامپیوتر خود استخراج (Extract) کنید.
2. **صفحه افزونه‌ها:** مرورگر کروم (یا هر مرورگر مبتنی بر کرومیوم مثل Edge یا Brave) را باز کرده و به آدرس `chrome://extensions/` بروید.
3. **حالت توسعه‌دهنده:** سوئیچ **"Developer mode"** را در گوشه سمت راست بالا فعال کنید.
4. **بارگذاری افزونه:** روی دکمه **"Load unpacked"** در گوشه سمت چپ بالا کلیک کنید.
5. **انتخاب پوشه:** پوشه اصلی این پروژه (پوشه‌ای که فایل `manifest.json` در آن قرار دارد) را انتخاب کنید.
6. **اتمام!** افزونه فعال شد. وارد سایت جمنای یا چت‌جی‌پی‌تی شوید و بدون دغدغه فارسی تایپ کنید.

---

## Repository Structure | ساختار پروژه

```bash
├── manifest.json         # Extension configuration
├── content.js            # RTL detection and DOM manipulation logic
├── content.css           # Styling rules and @font-face declarations
├── popup.html            # Premium UI popup panel
├── popup.css             # Glassy dark styling for the popup
├── popup.js              # Settings persistence & event listeners
├── Font/                 # Directory containing local Persian font files (.woff2, .ttf)
└── README.md             # Project documentation (This file)
```

---

## Author | سازنده

Developed by [Khode-Niki](https://github.com/Khode-Niki).  
توسعه داده شده توسط [Khode-Niki](https://github.com/Khode-Niki).
