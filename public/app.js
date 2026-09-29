/**
 * Shri Mahakaleshwar Temple Darshan Kiosk — Interactive Logic
 * Developed by FacePe
 */

const DICT = {
  hi: {
    templeTitle: 'श्री महाकालेश्वर ज्योतिर्लिंग मंदिर',
    templeSub: 'उज्जैन (म.प्र.) • दर्शन पास कियोस्क',
    welcomePraise: '॥ ॐ नमः शिवाय ॥',
    welcomeMain: 'सामान्य दर्शन कियोस्क',
    welcomeSub: 'कियोस्क से निःशुल्क सामान्य दर्शन पास प्राप्त करें',
    btnBookNow: 'सामान्य दर्शन बुक करें',
    liveWait: 'वर्तमान प्रतीक्षा समय:',
    minutes: 'मिनट',
    crowd: 'भीड़ स्थिति:',
    step1Eye: 'चरण १ / ४',
    step1Title: 'दर्शन दिनांक एवं समय स्लॉट चुनें',
    step1Sub: 'उपलब्ध दिनांक एवं दर्शन समय स्लॉट',
    headingDate: '📅 दर्शन दिनांक चुनें / Select Date',
    headingSlot: '⏰ दर्शन समय स्लॉट चुनें / Select Time Slot',
    step2Eye: 'चरण २ / ४',
    step2Title: 'श्रद्धालुओं की संख्या चुनें',
    step2Sub: 'एक बार में अधिकतम ८ श्रद्धालु बुक कर सकते हैं',
    persons: 'श्रद्धालु',
    step3Eye: 'चरण ३ / ४',
    step3Title: 'श्रद्धालु का विवरण दर्ज करें',
    step3Sub: 'कृपया अपना नाम एवं मोबाइल नंबर लिखें',
    labelName: 'मुख्य श्रद्धालु का पूरा नाम *',
    placeholderName: 'श्रद्धालु का नाम दर्ज करें',
    labelMobile: 'मोबाइल नंबर (Mobile No.) *',
    placeholderMobile: '१० अंकों का मोबाइल नंबर *',
    step4Eye: 'चरण ४ / ४',
    step4Title: 'बुकिंग की पुष्टि करें',
    step4Sub: 'कृपया विवरण जांचें और टिकट प्रिंट करें',
    summaryDevotee: 'मुख्य श्रद्धालु:',
    summaryMobile: 'मोबाइल नंबर:',
    summaryCount: 'कुल श्रद्धालु:',
    summaryDate: 'दर्शन दिनांक:',
    summarySlot: 'दर्शन समय स्लॉट:',
    summaryWait: 'अनुमानित प्रतीक्षा समय:',
    summaryGate: 'प्रवेश द्वार:',
    btnBack: 'पीछे',
    btnNext: 'आगे बढ़ें',
    btnConfirm: 'पुष्टि करें एवं टिकट प्रिंट करें',
    btnPrintNow: 'पुनः प्रिंट करें',
    btnBookAnother: 'नई बुकिंग करें',
    ticketGenerated: 'दर्शन पास सफलतापूर्वक जारी हुआ!',
    ticketSub: 'कृपया नीचे से अपना प्रिंटेड पास प्राप्त करें',
    autoResetMsg: 'कियोस्क होम स्क्रीन पर रीसेट होगा:'
  },
  en: {
    templeTitle: 'Shri Mahakaleshwar Jyotirlinga Temple',
    templeSub: 'Ujjain (M.P.) • Darshan Booking Kiosk',
    welcomePraise: '॥ OM NAMAH SHIVAYA ॥',
    welcomeMain: 'General Darshan Kiosk',
    welcomeSub: 'Get your free General Darshan Pass directly from the Kiosk',
    btnBookNow: 'Book General Darshan',
    liveWait: 'Live Waiting Time:',
    minutes: 'Minutes',
    crowd: 'Crowd Level:',
    step1Eye: 'STEP 1 / 4',
    step1Title: 'Select Darshan Date & Time Slot',
    step1Sub: 'Choose your preferred date and slot',
    headingDate: '📅 Select Darshan Date',
    headingSlot: '⏰ Select Time Slot',
    step2Eye: 'STEP 2 / 4',
    step2Title: 'Select Number of Devotees',
    step2Sub: 'You can book up to 8 devotees in one transaction',
    persons: 'Person(s)',
    step3Eye: 'STEP 3 / 4',
    step3Title: 'Enter Devotee Details',
    step3Sub: 'Please enter your full name and mobile number',
    labelName: 'Primary Devotee Full Name *',
    placeholderName: 'Enter devotee name',
    labelMobile: 'Mobile Number (10 digits) *',
    placeholderMobile: 'Enter 10-digit mobile number *',
    step4Eye: 'STEP 4 / 4',
    step4Title: 'Confirm Your Booking',
    step4Sub: 'Please verify details and print your ticket',
    summaryDevotee: 'Primary Devotee:',
    summaryMobile: 'Mobile No.:',
    summaryCount: 'Total Devotees:',
    summaryDate: 'Darshan Date:',
    summarySlot: 'Darshan Slot:',
    summaryWait: 'Live Waiting Time:',
    summaryGate: 'Designated Entry Gate:',
    btnBack: 'Back',
    btnNext: 'Proceed',
    btnConfirm: 'Confirm & Print Ticket',
    btnPrintNow: 'Print Again',
    btnBookAnother: 'New Booking',
    ticketGenerated: 'Darshan Pass Issued Successfully!',
    ticketSub: 'Please collect your printed pass from the tray below',
    autoResetMsg: 'Kiosk will reset to home in:'
  }
};

// Global State
let currentLang = 'hi';
let currentScreen = 'screen-welcome';
let selectedDevoteeCount = 1;
let devoteeName = '';
let devoteeMobile = '';
let selectedDate = '';
let selectedDateFormatted = '';
let selectedDateFormattedEn = '';
let availableDates = [];
let currentSlots = [];
let selectedSlotId = 'S2';
let selectedSlotTime = '08:00 AM - 11:00 AM';
let liveWaitMinutes = 35;
let resetTimerInterval = null;
let bookingData = null;

// Sound Effects
function playBeep(freq = 600, duration = 0.08) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

// Language Switcher
function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
  });

  const d = DICT[lang];
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    if (d[key]) {
      if (el.tagName === 'INPUT') {
        el.placeholder = d[key];
      } else {
        el.textContent = d[key];
      }
    }
  });

  if (availableDates.length) {
    initDateSelector(availableDates);
    const activeDateObj = availableDates.find(d => d.isoDate === selectedDate) || availableDates[0];
    if (activeDateObj && activeDateObj.slots) {
      renderSlots(activeDateObj.slots);
    } else if (currentSlots.length) {
      renderSlots(currentSlots);
    }
  } else if (currentSlots.length) {
    renderSlots(currentSlots);
  }

  initDevoteeSelector();
  updateLiveWaitBanner();
  if (currentScreen === 'screen-confirm') {
    renderConfirmation();
  }
}

// Screen Navigation
function goToScreen(screenId) {
  playBeep(750, 0.06);
  document.querySelectorAll('.screen-card').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    currentScreen = screenId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (screenId === 'screen-name') {
    const nameInput = document.getElementById('input-devotee-name');
    if (nameInput) setTimeout(() => nameInput.focus(), 150);
  }

  if (screenId === 'screen-confirm') {
    renderConfirmation();
  }
}

// Live Wait Time
async function updateLiveWaitBanner() {
  try {
    const res = await fetch('/api/waiting-time');
    const data = await res.json();
    if (data.success) {
      liveWaitMinutes = data.waitTimeMinutes;
      const elWait = document.getElementById('live-wait-val');
      const elCrowd = document.getElementById('live-crowd-val');
      if (elWait) {
        elWait.textContent = currentLang === 'hi' ? data.statusTextHi : data.statusTextEn;
      }
      if (elCrowd) {
        elCrowd.textContent = currentLang === 'hi' ? data.crowdLevelHi : data.crowdLevel;
      }
    }
  } catch (e) {}
}

// Devotee Number Selector
function initDevoteeSelector() {
  const container = document.getElementById('devotee-number-grid');
  if (!container) return;

  container.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8].map(num => `
    <div class="number-card ${num === selectedDevoteeCount ? 'selected' : ''}" data-num="${num}">
      <span class="num">${num}</span>
      <span class="lbl" data-t="persons">${DICT[currentLang].persons}</span>
    </div>
  `).join('');

  container.querySelectorAll('.number-card').forEach(card => {
    card.addEventListener('click', () => {
      playBeep(880, 0.05);
      container.querySelectorAll('.number-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedDevoteeCount = parseInt(card.getAttribute('data-num'), 10);
    });
  });
}

// Render Slots Grid (Clean without darshan labels)
function renderSlots(slots) {
  const container = document.getElementById('slots-container');
  if (!container || !slots) return;
  currentSlots = slots;

  const seatsLabel = currentLang === 'hi' ? 'सीटें' : 'Seats';
  const waitLabel = currentLang === 'hi' ? 'प्रतीक्षा' : 'Wait';

  container.innerHTML = slots.map(s => {
    const isSelected = s.id === selectedSlotId;
    const waitTimeText = currentLang === 'hi' ? (s.waitHi || s.wait) : s.wait;

    return `
      <div class="slot-card ${isSelected ? 'selected' : ''}" data-slot-id="${s.id}" data-slot-time="${s.time}">
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <span class="slot-time">${s.time}</span>
          <span class="slot-badge">${s.remaining} ${seatsLabel}</span>
        </div>
        <div style="display:flex; align-items:center; margin-top:2px;">
          <span class="slot-wait">⏳ ${waitLabel}: ${waitTimeText}</span>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.slot-card').forEach(card => {
    card.addEventListener('click', () => {
      playBeep(880, 0.05);
      container.querySelectorAll('.slot-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedSlotId = card.getAttribute('data-slot-id');
      selectedSlotTime = card.getAttribute('data-slot-time');
    });
  });
}

// Date Selector (Today to 5 days later)
function initDateSelector(dates) {
  const container = document.getElementById('date-selector-grid');
  if (!container || !dates || !dates.length) return;
  availableDates = dates;

  if (!selectedDate && dates[0]) {
    selectedDate = dates[0].isoDate;
    selectedDateFormattedEn = dates[0].displayFullEn;
    selectedDateFormatted = currentLang === 'hi' ? dates[0].displayFullHi : dates[0].displayFullEn;
  }

  container.innerHTML = dates.map((d, idx) => {
    const isSelected = d.isoDate === selectedDate;
    const dayLabel = idx === 0 ? (currentLang === 'hi' ? 'आज' : 'Today') : (idx === 1 ? (currentLang === 'hi' ? 'कल' : 'Tomorrow') : (currentLang === 'hi' ? d.dayNameHi : d.dayNameEn));
    const monthLabel = currentLang === 'hi' ? d.monthNameHi : d.monthNameEn;

    return `
      <div class="date-card ${isSelected ? 'selected' : ''}" data-iso="${d.isoDate}" data-idx="${idx}">
        <span class="date-tag">${dayLabel}</span>
        <span class="date-num">${d.dateNum}</span>
        <span class="date-month">${monthLabel}</span>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.date-card').forEach(card => {
    card.addEventListener('click', () => {
      playBeep(880, 0.05);
      container.querySelectorAll('.date-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const idx = parseInt(card.getAttribute('data-idx'), 10);
      const d = availableDates[idx];
      if (d) {
        selectedDate = d.isoDate;
        selectedDateFormattedEn = d.displayFullEn;
        selectedDateFormatted = currentLang === 'hi' ? d.displayFullHi : d.displayFullEn;
        if (d.slots && d.slots.length) {
          renderSlots(d.slots);
        }
      }
    });
  });
}

// Slots & Dates Loader (Always dynamically calculated)
async function initSlots() {
  try {
    const res = await fetch('/api/slots');
    const data = await res.json();
    if (data.success) {
      if (data.dates) {
        initDateSelector(data.dates);
        const activeDateObj = data.dates.find(d => d.isoDate === selectedDate) || data.dates[0];
        if (activeDateObj && activeDateObj.slots) {
          renderSlots(activeDateObj.slots);
        } else if (data.slots) {
          renderSlots(data.slots);
        }
      }
    }
  } catch (e) {}
}

// Confirmation Step
function renderConfirmation() {
  const inputEl = document.getElementById('input-devotee-name');
  if (inputEl && inputEl.value.trim()) {
    devoteeName = inputEl.value.trim();
  }
  const mobileEl = document.getElementById('input-devotee-mobile');
  if (mobileEl && mobileEl.value.trim()) {
    devoteeMobile = mobileEl.value.trim();
  }

  const sumName = document.getElementById('sum-name');
  const sumMobile = document.getElementById('sum-mobile');
  const sumCount = document.getElementById('sum-count');
  const sumDate = document.getElementById('sum-date');
  const sumSlot = document.getElementById('sum-slot');
  const sumWait = document.getElementById('sum-wait');
  const sumGate = document.getElementById('sum-gate');

  if (sumName) sumName.textContent = devoteeName || 'श्रद्धालु (Devotee)';
  if (sumMobile) sumMobile.textContent = devoteeMobile ? `+91 ${devoteeMobile}` : (currentLang === 'hi' ? 'उपलब्ध नहीं' : 'N/A');
  if (sumCount) sumCount.textContent = `${selectedDevoteeCount} ${DICT[currentLang].persons}`;
  if (sumDate) sumDate.textContent = selectedDateFormatted || (currentLang === 'hi' ? 'आज (Today)' : 'Today');
  if (sumSlot) sumSlot.textContent = selectedSlotTime;
  if (sumWait) sumWait.textContent = `${liveWaitMinutes} ${DICT[currentLang].minutes}`;
  if (sumGate) sumGate.textContent = currentLang === 'hi' ? 'नीलकंठ द्वार (Nilkanth Gate)' : 'Nilkanth Gate';
}

// Confirm & Print Action
async function confirmAndPrint() {
  playBeep(1000, 0.15);

  const inputEl = document.getElementById('input-devotee-name');
  if (inputEl && inputEl.value.trim()) {
    devoteeName = inputEl.value.trim();
  }
  const mobileEl = document.getElementById('input-devotee-mobile');
  if (mobileEl && mobileEl.value.trim()) {
    devoteeMobile = mobileEl.value.trim();
  }

  const btn = document.getElementById('btn-confirm-booking');
  if (btn) {
    btn.disabled = true;
    btn.textContent = currentLang === 'hi' ? 'पास तैयार किया जा रहा है...' : 'Generating Pass...';
  }

  try {
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        devoteeName: devoteeName || 'Devotee',
        devoteeCount: selectedDevoteeCount,
        mobileNumber: devoteeMobile || 'Walk-in Devotee',
        darshanDate: selectedDate,
        darshanDateFormatted: selectedDateFormatted,
        darshanDateFormattedEn: selectedDateFormattedEn,
        slotId: selectedSlotId,
        slotTime: selectedSlotTime,
        language: currentLang,
        skipServerPrint: true
      })
    });

    const data = await res.json();
    if (data.success && data.booking) {
      bookingData = data.booking;
      renderThermalTicket(bookingData);

      // Trigger high-res Hindi graphic / ePOS printing immediately in background
      printViaEposXml(bookingData).catch(e => console.warn('Background print error:', e));

      // Show 3-Second Dispenser Animation and smoothly return to Home
      showPrintingDispenserAnimation(bookingData);
    }
  } catch (e) {
    alert('Booking error. Please try again.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = DICT[currentLang].btnConfirm;
    }
  }
}

// 3-Second Smooth Dispenser Animation Overlay
function showPrintingDispenserAnimation(b) {
  const modal = document.getElementById('modal-printing-dispenser');
  if (!modal) {
    resetKiosk();
    return;
  }

  // Populate mini slip details
  const tokenEl = document.getElementById('slip-token-val');
  const nameEl = document.getElementById('slip-name-val');
  const countEl = document.getElementById('slip-count-val');
  const slotEl = document.getElementById('slip-slot-val');
  const qrImg = document.getElementById('slip-qr-img');
  const statusText = document.getElementById('dispenser-status-text');
  const subText = document.getElementById('dispenser-subtext');
  const resetMsg = document.getElementById('dispenser-reset-msg');
  const countdownEl = document.getElementById('dispenser-countdown-val');
  const progressFill = document.getElementById('dispenser-progress-fill');

  if (tokenEl) tokenEl.textContent = b.tokenNumber || 'GD-101';
  if (nameEl) nameEl.textContent = b.devoteeName || 'Devotee';
  if (countEl) countEl.textContent = `${b.devoteeCount || 1} Person(s)`;
  if (slotEl) slotEl.textContent = b.slotTime || '08:00 AM - 11:00 AM';
  if (qrImg) qrImg.src = b.qrDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(b.bookingId + '|' + b.tokenNumber)}`;

  if (statusText) {
    statusText.textContent = currentLang === 'hi' ? '🖨️ दर्शन पास प्रिंट हो रहा है...' : '🖨️ Printing Darshan Pass...';
  }
  if (subText) {
    subText.textContent = currentLang === 'hi' ? 'कृपया नीचे प्रिंटर ट्रे से टिकट प्राप्त करें' : 'Please collect ticket from dispenser below';
  }
  if (resetMsg) {
    resetMsg.textContent = currentLang === 'hi' ? 'कियोस्क होम स्क्रीन पर वापस जा रहा है:' : 'Kiosk returning to Home Screen in:';
  }

  // Reset animations
  if (progressFill) {
    progressFill.style.animation = 'none';
    progressFill.offsetHeight; // trigger reflow
    progressFill.style.animation = 'fillDispenserBar 3s linear forwards';
  }

  const ticketSlip = document.getElementById('dispenser-ticket-card');
  if (ticketSlip) {
    ticketSlip.style.animation = 'none';
    ticketSlip.offsetHeight; // trigger reflow
    ticketSlip.style.animation = 'feedPaperDownwards 2.8s cubic-bezier(0.2, 0.7, 0.25, 1) forwards';
  }

  modal.style.display = 'flex';

  // 3-Second countdown (3s -> 2s -> 1s)
  let seconds = 3;
  if (countdownEl) countdownEl.textContent = `${seconds}s`;

  const timer = setInterval(() => {
    seconds--;
    if (countdownEl && seconds >= 0) {
      countdownEl.textContent = `${seconds}s`;
    }
    if (seconds <= 0) {
      clearInterval(timer);
    }
  }, 1000);

  // Exactly 3.0 seconds: chime, hide modal, return to Home Screen
  setTimeout(() => {
    clearInterval(timer);
    playBeep(1200, 0.12);
    modal.style.display = 'none';
    resetKiosk();
  }, 3000);
}

// Helper: Get configured printer IP for this device
function getPrinterIp() {
  return localStorage.getItem('kiosk_printer_ip') || '';
}

// Helper: Ensure date is clean English/Latin without non-ASCII garbled characters
function getCleanDisplayDate(b) {
  if (!b) return 'Today';
  if (b.darshanDateFormattedEn && !/[\u0900-\u097F]/.test(b.darshanDateFormattedEn)) {
    return b.darshanDateFormattedEn;
  }
  if (b.darshanDate) {
    const parts = b.darshanDate.split('-');
    if (parts.length === 3) {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const mIdx = parseInt(parts[1], 10) - 1;
      const dNum = parseInt(parts[2], 10);
      if (mIdx >= 0 && mIdx < 12 && !isNaN(dNum)) {
        return `${dNum} ${months[mIdx]} ${parts[0]}`;
      }
    }
    if (!/[\u0900-\u097F]/.test(b.darshanDate)) return b.darshanDate;
  }
  if (b.darshanDateFormatted && !/[\u0900-\u097F]/.test(b.darshanDateFormatted)) {
    return b.darshanDateFormatted;
  }
  const kolkataStr = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
  const [m, day, y] = kolkataStr.split('/').map(Number);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${day} ${months[m - 1]} ${y}`;
}

// Convert Canvas into Epson 1-bit monochrome raster (native 1:1 dot mapping without blur)
function convertCanvasToEposRaster(canvas) {
  const targetWidth = canvas.width;
  const targetHeight = canvas.height;
  const ctx = canvas.getContext('2d');

  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const data = imgData.data;
  const bytesPerRow = Math.ceil(targetWidth / 8);
  const buffer = new Uint8Array(bytesPerRow * targetHeight);

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (y * targetWidth + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      // High-contrast clean black dot for crisp thermal printhead
      if (a > 35 && lum < 200) {
        const byteIdx = y * bytesPerRow + (x >> 3);
        buffer[byteIdx] |= (0x80 >> (x & 7));
      }
    }
  }

  let binary = '';
  const len = buffer.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = buffer.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, chunk);
  }
  const base64 = btoa(binary);

  return {
    width: targetWidth,
    height: targetHeight,
    widthBytes: bytesPerRow,
    heightDots: targetHeight,
    base64: base64
  };
}

// Local offline QR code data URL generator using qrcode.min.js
function generateLocalQrDataUrl(text, size = 160) {
  try {
    if (typeof QRCode !== 'undefined') {
      const tempDiv = document.createElement('div');
      new QRCode(tempDiv, {
        text: text,
        width: size,
        height: size,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: (QRCode.CorrectLevel && QRCode.CorrectLevel.M) || 0
      });
      const canvas = tempDiv.querySelector('canvas');
      if (canvas) return canvas.toDataURL('image/png');
      const img = tempDiv.querySelector('img');
      if (img && img.src && img.src.startsWith('data:')) return img.src;
    }
  } catch (e) {
    console.warn('Local QR generator warning:', e);
  }
  return '';
}

// Generate complete official Darshan Pass on high-contrast 1:1 dot canvas (optimized for narrow thermal roll)
async function generateDarshanPassCanvas(b, lang) {
  if (document.fonts) {
    try { await document.fonts.ready; } catch (e) {}
  }

  // Use configured paper width (default: 384 dots for narrow 58mm printer, 512 for wide 80mm)
  const targetWidth = parseInt(localStorage.getItem('kiosk_paper_width'), 10) || 384;
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = 1100;
  const ctx = canvas.getContext('2d');

  // 1. Crisp White Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let y = 14;

  // 2. Temple Emblem Logo (Centered, crisp monochrome friendly)
  const logoDataUri = (typeof TEMPLE_LOGO_DATA_URL !== 'undefined') ? TEMPLE_LOGO_DATA_URL : 'logo-print.png';
  if (logoDataUri) {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = logoDataUri;
    if (!logoImg.complete) {
      await new Promise(r => {
        logoImg.onload = r;
        logoImg.onerror = r;
        setTimeout(r, 350);
      });
    }
    if (logoImg.naturalWidth) {
      const logoSize = 56;
      ctx.drawImage(logoImg, Math.round((targetWidth - logoSize) / 2), y, logoSize, logoSize);
      y += logoSize + 10;
    }
  }

  // 3. Official Temple Header (Large, bold, high-contrast)
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';

  ctx.font = '900 20px "Noto Sans Devanagari", sans-serif';
  ctx.fillText('॥ श्री महाकालेश्वर ज्योतिर्लिंग ॥', targetWidth / 2, y);
  y += 24;

  ctx.font = 'bold 15px "Noto Sans Devanagari", sans-serif';
  ctx.fillText('उज्जैन (मध्य प्रदेश)', targetWidth / 2, y);
  y += 20;

  ctx.font = '900 16px "Inter", sans-serif';
  ctx.fillText('SHRI MAHAKALESHWAR TEMPLE', targetWidth / 2, y);
  y += 22;

  ctx.font = 'bold 16px "Noto Sans Devanagari", sans-serif';
  ctx.fillText('सामान्य दर्शन पास • DARSHAN PASS', targetWidth / 2, y);
  y += 12;

  // Divider Line
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(8, y);
  ctx.lineTo(targetWidth - 8, y);
  ctx.stroke();
  y += 16;

  // 4. Large Bold Token Number Section
  ctx.font = 'bold 15px "Noto Sans Devanagari", sans-serif';
  ctx.fillText('टोकन संख्या / TOKEN NO.', targetWidth / 2, y);
  y += 48;

  ctx.font = '900 50px "Inter", sans-serif';
  ctx.fillText(b.tokenNumber || 'GD-101', targetWidth / 2, y);
  y += 20;

  ctx.font = 'bold 15px "Noto Sans Devanagari", sans-serif';
  ctx.fillText('पुष्टिकृत / CONFIRMED • निःशुल्क (FREE)', targetWidth / 2, y);
  y += 18;

  ctx.font = 'bold 13px "Inter", sans-serif';
  ctx.fillText(`Pass ID: ${b.bookingId || 'MP-MK-2026'}`, targetWidth / 2, y);
  y += 12;

  // Divider Line
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(8, y);
  ctx.lineTo(targetWidth - 8, y);
  ctx.stroke();
  y += 22;

  // 5. Booking Details (Large fonts, high-contrast, perfectly fitted to narrow roll)
  const cleanDate = getCleanDisplayDate(b);
  const devoteeMobile = b.mobileNumber && b.mobileNumber !== 'Walk-in Devotee' ? b.mobileNumber : '—';
  const cleanIssued = b.bookedAt || 'Now';

  const items = [
    ['श्रद्धालु / Devotee', b.devoteeName || 'श्रद्धालु'],
    ['मोबाइल / Mobile', devoteeMobile],
    ['संख्या / Persons', `${b.devoteeCount || 1} व्यक्ति (${b.devoteeCount || 1})`],
    ['दिनांक / Date', b.darshanDateFormatted || cleanDate],
    ['समय / Slot', b.slotTime || '08:00 AM - 11:00 AM'],
    ['प्रतीक्षा / Wait', `${b.liveWaitMinutes || 35} मिनट (${b.liveWaitMinutes || 35} Min)`],
    ['द्वार / Gate', 'नीलकंठ द्वार (Nilkanth Gate)'],
    ['जारी / Issued', cleanIssued]
  ];

  for (const [lbl, val] of items) {
    ctx.textAlign = 'left';
    ctx.font = 'bold 14px "Noto Sans Devanagari", sans-serif';
    ctx.fillText(lbl + ':', 10, y);

    ctx.textAlign = 'right';
    ctx.font = '900 15px "Noto Sans Devanagari", sans-serif';
    ctx.fillText(val, targetWidth - 10, y);

    y += 7;
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#bbbbbb';
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(targetWidth - 10, y);
    ctx.stroke();
    y += 20;
  }

  y += 8;

  // 6. Turnstile QR Code (Crisp, centered)
  const qrPayload = `${b.bookingId || ''}|${b.tokenNumber || ''}|${b.devoteeName || ''}|${b.devoteeCount || 1}|Nilkanth Gate`;
  let qrDataUri = b.qrDataUrl || '';
  if (!qrDataUri || qrDataUri.includes('api.qrserver.com')) {
    qrDataUri = generateLocalQrDataUrl(qrPayload, 160) || b.qrDataUrl || '';
  }

  if (qrDataUri) {
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.src = qrDataUri;
    if (!qrImg.complete) {
      await new Promise(r => {
        qrImg.onload = r;
        qrImg.onerror = r;
        setTimeout(r, 350);
      });
    }
    const qrSize = 150;
    const qrX = Math.round((targetWidth - qrSize) / 2);
    try {
      ctx.drawImage(qrImg, qrX, y, qrSize, qrSize);
    } catch (e) {}
    y += qrSize + 14;
  }

  // 7. Gate Instruction & Footer
  ctx.textAlign = 'center';
  ctx.font = '900 16px "Noto Sans Devanagari", sans-serif';
  ctx.fillText('प्रवेश हेतु QR कोड स्कैन करें', targetWidth / 2, y);
  y += 18;

  ctx.font = 'bold 12px "Inter", sans-serif';
  ctx.fillText('Scan at Nilkanth Gate Barrier', targetWidth / 2, y);
  y += 18;

  ctx.font = 'bold 13px "Noto Sans Devanagari", sans-serif';
  ctx.fillText('श्री महाकालेश्वर मंदिर प्रबंध समिति, उज्जैन (म.प्र.)', targetWidth / 2, y);
  y += 16;

  ctx.font = '11px "Inter", sans-serif';
  ctx.fillText(`Terminal: ${b.kioskId || 'KIOSK-UJJAIN-01'} • केवल एक बार प्रवेश मान्य`, targetWidth / 2, y);
  y += 20;

  // Crop final canvas height to exact printed content
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = targetWidth;
  finalCanvas.height = y;
  const fCtx = finalCanvas.getContext('2d');
  fCtx.drawImage(canvas, 0, 0, targetWidth, y, 0, 0, targetWidth, y);

  return finalCanvas;
}

// Test print slip helper
async function sendTestSlip(targetIp) {
  const ip = (targetIp && targetIp.trim()) || getPrinterIp();
  if (!ip) return false;
  const xml = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print"><text align="center" width="2" height="2">SHRI MAHAKALESHWAR&#10;</text><text width="1" height="1">UJJAIN (MADHYA PRADESH)&#10;------------------------------------------------&#10;</text><text width="2" height="2">TEST PRINT OK&#10;</text><text width="1" height="1">Printer IP: ${ip}&#10;Status: ONLINE &amp; READY&#10;------------------------------------------------&#10;&#10;&#10;</text><cut type="feed"/></epos-print></s:Body></s:Envelope>`;

  // Try local /api/print-thermal proxy first
  try {
    const res = await fetch('/api/print-thermal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokenNumber: 'TEST-01',
        bookingId: 'TEST-PRINT',
        devoteeName: 'Test Devotee',
        devoteeCount: 1,
        slotTime: '08:00 AM - 11:00 AM',
        language: currentLang
      }),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return true;
    }
  } catch (e) {}

  const endpoints = [
    `https://${ip}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000`,
    `http://${ip}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000`
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml; charset=utf-8', 'SOAPAction': '""' },
        body: xml,
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return true;
    } catch (e) {}
  }
  return false;
}

// Fast & Crisp hardware text mode print format (Standard Epson receipt)
async function printViaEposXml(b) {
  if (!b) return false;
  const ip = getPrinterIp();

  const cleanDate = getCleanDisplayDate(b);
  const devoteeMobile = b.mobileNumber && b.mobileNumber !== 'Walk-in Devotee' ? b.mobileNumber : '—';
  const qrText = `${b.bookingId}|${b.tokenNumber}|${b.devoteeName}|${devoteeMobile}|${b.devoteeCount}|Nilkanth Gate`;
  const cleanIssued = b.bookedAt ? b.bookedAt.replace(/[\u0900-\u097F]/g, '').trim() : 'Now';

  const xml = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print"><text align="center" width="2" height="2">SHRI MAHAKALESHWAR&#10;</text><text width="1" height="1">JYOTIRLINGA TEMPLE, UJJAIN (M.P.)&#10;SAMANYA DARSHAN PASS (FREE)&#10;================================================&#10;</text><text align="center" width="2" height="2">TOKEN: ${b.tokenNumber}&#10;</text><text width="1" height="1">PASS ID: ${b.bookingId}&#10;STATUS: CONFIRMED (FREE)&#10;------------------------------------------------&#10;</text><text align="left">Devotee Name : ${b.devoteeName}&#10;Mobile Number: ${devoteeMobile}&#10;Total Persons: ${b.devoteeCount} Person(s)&#10;Darshan Date : ${cleanDate}&#10;Darshan Slot : ${b.slotTime}&#10;Est. Wait    : ${b.liveWaitMinutes || 35} Min&#10;Entry Gate   : Nilkanth Gate (Neelkanth Dwar)&#10;Issued At    : ${cleanIssued}&#10;------------------------------------------------&#10;</text><text align="center">&#10;</text><symbol type="qrcode_model_2" level="level_m" width="6">${qrText}</symbol><text align="center">&#10;Scan at Nilkanth Gate Barrier&#10;Shri Mahakaleshwar Temple Committee, Ujjain&#10;Terminal: ${b.kioskId || 'KIOSK-UJJAIN-01'}&#10;&#10;&#10;</text><cut type="feed"/></epos-print></s:Body></s:Envelope>`;

  // 1. Try local server endpoint if running
  try {
    const localRes = await fetch('/api/print-thermal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(b),
      signal: AbortSignal.timeout(2500)
    });
    if (localRes.ok) {
      const data = await localRes.json();
      if (data.success) return true;
    }
  } catch (e) {}

  // 2. Direct Web ePOS-Print to printer IP on local Wi-Fi / tablet
  if (!ip) {
    console.log('ℹ️ No printer IP configured yet in settings. Open ⚙️ to set IP.');
    return false;
  }

  const endpoints = [
    `http://${ip}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000`,
    `https://${ip}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000`,
    'http://EPSON20CAAF.local/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000'
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'SOAPAction': '""'
        },
        body: xml,
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {}
  }

  return false;
}

// Render Official Darshan Pass Card
function renderThermalTicket(b) {
  const container = document.getElementById('thermal-ticket-mount');
  const printMount = document.getElementById('print-render-container');
  if (!container) return;

  const qrPayload = `${b.bookingId}|${b.tokenNumber}|${b.devoteeName}|${b.mobileNumber || ''}|${b.devoteeCount}|Nilkanth Gate`;
  let qrSrc = b.qrDataUrl || '';
  if (!qrSrc || qrSrc.includes('api.qrserver.com')) {
    qrSrc = generateLocalQrDataUrl(qrPayload, 160) || b.qrDataUrl || '';
  }

  const cleanEn = getCleanDisplayDate(b);
  const displayPassDate = b.darshanDateFormatted && b.darshanDateFormatted !== cleanEn 
    ? `${cleanEn} (${b.darshanDateFormatted})` 
    : cleanEn;

  const logoSrc = (typeof TEMPLE_LOGO_DATA_URL !== 'undefined') ? TEMPLE_LOGO_DATA_URL : 'logo-print.png';

  const passHtml = `
    <div class="darshan-pass-card">
      <!-- Top Header with Temple Emblem -->
      <div class="pass-header">
        <div class="pass-emblem-row">
          <img src="${logoSrc}" alt="श्री महाकालेश्वर मंदिर" class="pass-emblem-img" crossorigin="anonymous" />
          <div class="pass-temple-heading">
            <div style="font-size: 0.78rem; font-weight: 800; color: #d84b06; margin-bottom: 2px;">॥ श्री महाकालेश्वर ज्योतिर्लिंग मंदिर ॥</div>
            <h3>SHRI MAHAKALESHWAR TEMPLE</h3>
            <p>UJJAIN (MADHYA PRADESH)</p>
          </div>
        </div>
        <div class="pass-badge-type">स्वयं सेवा सामान्य दर्शन पास • GENERAL DARSHAN PASS</div>
      </div>

      <!-- Token & Status Row -->
      <div class="pass-token-box">
        <div class="token-label-side">
          <span>टोकन क्रमांक / Token No.</span>
          <div class="token-number-large">${b.tokenNumber}</div>
          <small style="color: #6b7280; font-size: 0.72rem;">Pass ID: ${b.bookingId}</small>
        </div>
        <div style="text-align: right;">
          <div class="token-status-pill">पुष्टिकृत / CONFIRMED</div>
          <div style="font-size: 0.75rem; color: #7a1a03; font-weight: 700; margin-top: 6px;">निःशुल्क पास (FREE)</div>
        </div>
      </div>

      <!-- Devotee & Booking Details Table -->
      <table class="pass-details-table">
        <tr>
          <td class="pass-td-key">श्रद्धालु का नाम (Devotee):</td>
          <td class="pass-td-val val-highlight">${b.devoteeName}</td>
        </tr>
        <tr>
          <td class="pass-td-key">मोबाइल नंबर (Mobile No.):</td>
          <td class="pass-td-val"><strong>${b.mobileNumber && b.mobileNumber !== 'Walk-in Devotee' ? b.mobileNumber : '—'}</strong></td>
        </tr>
        <tr>
          <td class="pass-td-key">कुल संख्या (Total Persons):</td>
          <td class="pass-td-val"><strong>${b.devoteeCount} व्यक्ति (${b.devoteeCount} Person)</strong></td>
        </tr>
        <tr>
          <td class="pass-td-key">दर्शन दिनांक (Darshan Date):</td>
          <td class="pass-td-val"><strong>${displayPassDate}</strong></td>
        </tr>
        <tr>
          <td class="pass-td-key">दर्शन समय स्लॉट (Darshan Slot):</td>
          <td class="pass-td-val">${b.slotTime}</td>
        </tr>
        <tr>
          <td class="pass-td-key">अनुमानित प्रतीक्षा समय (Est. Wait):</td>
          <td class="pass-td-val"><strong>${b.liveWaitMinutes || 35} Min</strong></td>
        </tr>
        <tr>
          <td class="pass-td-key">प्रवेश द्वार (Entry Gate):</td>
          <td class="pass-td-val" style="color: #2e7d32;"><strong>नीलकंठ द्वार (Nilkanth Gate)</strong></td>
        </tr>
        <tr>
          <td class="pass-td-key">जारी समय (Issued Date/Time):</td>
          <td class="pass-td-val">${b.bookedAt || 'Now'}</td>
        </tr>
      </table>

      <!-- QR Code & Turnstile Instructions -->
      <div class="pass-qr-section">
        <img src="${qrSrc}" alt="Turnstile QR Code" class="pass-qr-img" crossorigin="anonymous" />
        <div class="pass-qr-meta">
          <p style="font-size: 0.8rem; font-weight: 800; color: #7a1a03;">प्रवेश हेतु QR कोड स्कैन करें</p>
          <p style="margin-top: 2px; color: #4b5563;">Scan at turnstile barrier before entering queue.</p>
          <span class="pass-qr-gate-badge">NILKANTH GATE (नीलकंठ द्वार)</span>
        </div>
      </div>

      <!-- Official Footer -->
      <div class="pass-footer-notes">
        <p>श्री महाकालेश्वर मंदिर प्रबंध समिति, उज्जैन (म.प्र.)</p>
        <small>यह पास केवल चयनित दिनांक के दर्शन के लिए एक बार प्रवेश हेतु मान्य है • Terminal: ${b.kioskId || 'KIOSK-UJJAIN-01'}</small>
      </div>
    </div>
  `;

  container.innerHTML = passHtml;
  if (printMount) {
    printMount.innerHTML = passHtml;
  }
}

// Download PDF Helper
async function downloadPdfPass() {
  const element = document.querySelector('.darshan-pass-card');
  if (!element || !bookingData) return;

  const btn = document.getElementById('btn-download-pdf');
  const originalText = btn ? btn.textContent : '';
  if (btn) btn.textContent = '⏳ PDF तैयार हो रहा है...';

  const opt = {
    margin: [12, 10, 12, 10],
    filename: `Mahakal_Darshan_Pass_${bookingData.tokenNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3, useCORS: true, letterRendering: true, backgroundColor: '#ffffff', scrollY: 0 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    if (window.html2pdf) {
      await window.html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  } catch (err) {
    console.error('PDF download error:', err);
    window.print();
  } finally {
    if (btn) btn.textContent = originalText;
  }
}

// Auto Reset Timer
function startAutoResetTimer(seconds = 20) {
  clearInterval(resetTimerInterval);
  let remaining = seconds;
  const countEl = document.getElementById('reset-countdown');
  if (countEl) countEl.textContent = `${remaining}s`;

  resetTimerInterval = setInterval(() => {
    remaining--;
    if (countEl) countEl.textContent = `${remaining}s`;
    if (remaining <= 0) {
      clearInterval(resetTimerInterval);
      resetKiosk();
    }
  }, 1000);
}

// Reset Kiosk
function resetKiosk() {
  clearInterval(resetTimerInterval);
  selectedDevoteeCount = 1;
  devoteeName = '';
  devoteeMobile = '';
  const nameInput = document.getElementById('input-devotee-name');
  if (nameInput) nameInput.value = '';
  const mobileInput = document.getElementById('input-devotee-mobile');
  if (mobileInput) mobileInput.value = '';
  initDevoteeSelector();
  initSlots();
  goToScreen('screen-welcome');
}

// Document Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  setLanguage('hi');
  initDevoteeSelector();
  initSlots();
  updateLiveWaitBanner();

  // Mobile number input sanitization & strict numeric keyboard enforcement
  const mobileInput = document.getElementById('input-devotee-mobile');
  if (mobileInput) {
    mobileInput.setAttribute('inputmode', 'numeric');
    mobileInput.setAttribute('pattern', '[0-9]*');
    mobileInput.setAttribute('type', 'tel');

    // Re-assert numeric inputmode when user focuses or taps the field
    mobileInput.addEventListener('focus', () => {
      mobileInput.setAttribute('inputmode', 'numeric');
    });

    mobileInput.addEventListener('touchstart', () => {
      mobileInput.setAttribute('inputmode', 'numeric');
    }, { passive: true });

    mobileInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });

    mobileInput.addEventListener('keydown', (e) => {
      if (['Backspace', 'Tab', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        return;
      }
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    });
  }

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.getAttribute('data-lang'));
    });
  });

  // Welcome -> Step 1 (Date & Slot)
  document.getElementById('btn-start-booking')?.addEventListener('click', () => {
    goToScreen('screen-slot');
  });

  // Step 1 (Date & Slot) -> Step 2 (Devotees Count)
  document.getElementById('btn-to-devotees')?.addEventListener('click', () => {
    goToScreen('screen-devotees');
  });
  document.getElementById('btn-back-to-welcome')?.addEventListener('click', () => {
    goToScreen('screen-welcome');
  });

  // Step 2 (Devotees Count) -> Step 3 (Devotee Name)
  document.getElementById('btn-to-name')?.addEventListener('click', () => {
    goToScreen('screen-name');
  });
  document.getElementById('btn-back-to-slot')?.addEventListener('click', () => {
    goToScreen('screen-slot');
  });

  // Step 3 (Devotee Name & Mobile) -> Step 4 (Confirmation)
  document.getElementById('btn-to-confirm')?.addEventListener('click', () => {
    const nameInput = document.getElementById('input-devotee-name');
    if (!nameInput || !nameInput.value.trim()) {
      alert(currentLang === 'hi' ? 'कृपया मुख्य श्रद्धालु का नाम दर्ज करें।' : 'Please enter primary devotee name.');
      nameInput?.focus();
      return;
    }
    const mobInput = document.getElementById('input-devotee-mobile');
    const mobVal = mobInput ? mobInput.value.trim().replace(/\D/g, '') : '';
    if (!mobVal || mobVal.length !== 10) {
      alert(currentLang === 'hi' ? 'कृपया १० अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      mobInput?.focus();
      return;
    }
    devoteeName = nameInput.value.trim();
    devoteeMobile = mobVal;
    goToScreen('screen-confirm');
  });
  document.getElementById('btn-back-to-devotees')?.addEventListener('click', () => {
    goToScreen('screen-devotees');
  });

  // Step 4 (Confirmation) -> Step 5 (Ticket Print)
  document.getElementById('btn-confirm-booking')?.addEventListener('click', () => {
    confirmAndPrint();
  });
  document.getElementById('btn-back-to-name')?.addEventListener('click', () => {
    goToScreen('screen-name');
  });

  // Print button
  document.getElementById('btn-print-ticket-manual')?.addEventListener('click', async () => {
    if (bookingData) {
      const printed = await printViaEposXml(bookingData);
      if (printed) {
        playBeep(900, 0.08);
        return;
      }
    }
    window.print();
  });

  // PDF Download button
  document.getElementById('btn-download-pdf')?.addEventListener('click', () => {
    downloadPdfPass();
  });

  document.getElementById('btn-start-new-booking')?.addEventListener('click', () => {
    resetKiosk();
  });

  // Printer Settings Modal Handlers
  const modal = document.getElementById('modal-printer-settings');
  const ipInput = document.getElementById('input-printer-ip');
  const widthSelect = document.getElementById('select-paper-width');
  const statusEl = document.getElementById('settings-status');

  document.getElementById('btn-open-settings')?.addEventListener('click', () => {
    if (modal && ipInput) {
      // If user opens first time, will be empty ('')
      ipInput.value = localStorage.getItem('kiosk_printer_ip') || '';
      if (widthSelect) {
        widthSelect.value = localStorage.getItem('kiosk_paper_width') || '384';
      }
      if (statusEl) statusEl.textContent = '';
      modal.style.display = 'flex';
    }
  });

  document.getElementById('btn-close-settings')?.addEventListener('click', () => {
    if (modal) modal.style.display = 'none';
  });

  document.getElementById('btn-save-printer')?.addEventListener('click', () => {
    const rawIp = ipInput ? ipInput.value.trim() : '';
    if (widthSelect) {
      localStorage.setItem('kiosk_paper_width', widthSelect.value);
    }
    if (rawIp) {
      localStorage.setItem('kiosk_printer_ip', rawIp);
      if (statusEl) {
        statusEl.style.color = '#2e7d32';
        statusEl.textContent = `✓ IP सेव हो गया (Saved: ${rawIp})`;
      }
      setTimeout(() => {
        if (modal) modal.style.display = 'none';
      }, 1000);
    } else {
      localStorage.removeItem('kiosk_printer_ip');
      if (statusEl) {
        statusEl.style.color = '#7a1a03';
        statusEl.textContent = 'ℹ️ कोई IP सेट नहीं है (IP cleared / empty)';
      }
      setTimeout(() => {
        if (modal) modal.style.display = 'none';
      }, 1000);
    }
  });

  document.getElementById('btn-test-printer')?.addEventListener('click', async () => {
    const testIp = (ipInput ? ipInput.value.trim() : '') || getPrinterIp();
    if (!testIp) {
      if (statusEl) {
        statusEl.style.color = '#b91c1c';
        statusEl.textContent = '⚠️ कृपया प्रिंटर IP दर्ज करें (Please enter IP first)';
      }
      return;
    }
    if (statusEl) {
      statusEl.style.color = '#d84b06';
      statusEl.textContent = `⏳ Sending test print to ${testIp}...`;
    }
    const ok = await sendTestSlip(testIp);
    if (statusEl) {
      if (ok) {
        statusEl.style.color = '#2e7d32';
        statusEl.textContent = '✓ Test print successful!';
      } else {
        statusEl.style.color = '#b91c1c';
        statusEl.textContent = `✗ Unreachable at ${testIp}. Check IP & Wi-Fi.`;
      }
    }
  });
});
