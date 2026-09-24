/**
 * Shri Mahakaleshwar Temple Darshan Kiosk — Interactive Logic
 * Developed by FacePe
 */

const DICT = {
  hi: {
    templeTitle: 'श्री महाकालेश्वर ज्योतिर्लिंग मंदिर',
    templeSub: 'उज्जैन (म.प्र.) • दर्शन पास कियोस्क',
    welcomePraise: '॥ ॐ नमः शिवाय ॥',
    welcomeMain: 'स्वयं सेवा सामान्य दर्शन पास',
    welcomeSub: 'कियोस्क से निःशुल्क सामान्य दर्शन पास प्राप्त करें',
    btnBookNow: 'सामान्य दर्शन बुक करें',
    liveWait: 'वर्तमान प्रतीक्षा समय:',
    minutes: 'मिनट',
    crowd: 'भीड़ स्थिति:',
    step1Eye: 'चरण १ / ४',
    step1Title: 'श्रद्धालुओं की संख्या चुनें',
    step1Sub: 'एक बार में अधिकतम ८ श्रद्धालु बुक कर सकते हैं',
    persons: 'श्रद्धालु',
    step2Eye: 'चरण २ / ४',
    step2Title: 'मुख्य श्रद्धालु का नाम दर्ज करें',
    step2Sub: 'कृपया अपना पूरा नाम लिखें',
    labelName: 'मुख्य श्रद्धालु का पूरा नाम *',
    placeholderName: 'श्रद्धालु का नाम दर्ज करें',
    step3Eye: 'चरण ३ / ४',
    step3Title: 'दर्शन समय स्लॉट चुनें',
    step3Sub: 'आज के उपलब्ध समय स्लॉट',
    step4Eye: 'चरण ४ / ४',
    step4Title: 'बुकिंग की पुष्टि करें',
    step4Sub: 'कृपया विवरण जांचें और टिकट प्रिंट करें',
    summaryDevotee: 'मुख्य श्रद्धालु:',
    summaryCount: 'कुल श्रद्धालु:',
    summarySlot: 'दर्शन स्लॉट:',
    summaryWait: 'अनुमानित प्रतीक्षा समय:',
    summaryGate: 'प्रवेश द्वार:',
    btnBack: 'पीछे',
    btnNext: 'आगे बढ़ें',
    btnConfirm: 'पुष्टि करें एवं टिकट प्रिंट करें',
    btnPrintNow: '🖨️ फिर से प्रिंट करें',
    btnBookAnother: 'नई बुकिंग करें',
    ticketGenerated: 'दर्शन पास सफलतापूर्वक जारी हुआ!',
    ticketSub: 'कृपया नीचे से अपना प्रिंटेड पास प्राप्त करें',
    autoResetMsg: 'कियोस्क होम स्क्रीन पर रीसेट होगा:'
  },
  en: {
    templeTitle: 'Shri Mahakaleshwar Jyotirlinga Temple',
    templeSub: 'Ujjain (M.P.) • Darshan Booking Kiosk',
    welcomePraise: '॥ OM NAMAH SHIVAYA ॥',
    welcomeMain: 'Self-Service General Darshan Pass',
    welcomeSub: 'Get your free General Darshan Pass directly from the Kiosk',
    btnBookNow: 'Book General Darshan',
    liveWait: 'Live Waiting Time:',
    minutes: 'Minutes',
    crowd: 'Crowd Level:',
    step1Eye: 'STEP 1 / 4',
    step1Title: 'Select Number of Devotees',
    step1Sub: 'You can book up to 8 devotees in one transaction',
    persons: 'Person(s)',
    step2Eye: 'STEP 2 / 4',
    step2Title: 'Enter Primary Devotee Name',
    step2Sub: 'Please enter your full name',
    labelName: 'Primary Devotee Full Name *',
    placeholderName: 'Enter devotee name',
    step3Eye: 'STEP 3 / 4',
    step3Title: 'Select Darshan Time Slot',
    step3Sub: 'Available slots for today',
    step4Eye: 'STEP 4 / 4',
    step4Title: 'Confirm Your Booking',
    step4Sub: 'Please verify details and print your ticket',
    summaryDevotee: 'Primary Devotee:',
    summaryCount: 'Total Devotees:',
    summarySlot: 'Darshan Slot:',
    summaryWait: 'Live Waiting Time:',
    summaryGate: 'Designated Entry Gate:',
    btnBack: 'Back',
    btnNext: 'Proceed',
    btnConfirm: 'Confirm & Print Ticket',
    btnPrintNow: '🖨️ Print Again',
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

  updateLiveWaitBanner();
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

// Slots Loader
async function initSlots() {
  const container = document.getElementById('slots-container');
  if (!container) return;

  try {
    const res = await fetch('/api/slots');
    const data = await res.json();
    if (data.success && data.slots) {
      container.innerHTML = data.slots.map(s => `
        <div class="slot-card ${s.id === selectedSlotId ? 'selected' : ''}" data-slot-id="${s.id}" data-slot-time="${s.time}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="slot-time">${s.time}</span>
            <span class="slot-badge">${s.remaining} Seats</span>
          </div>
          <p class="slot-label">${s.labelHi}</p>
          <span class="slot-wait">⏳ Wait: ${s.wait}</span>
        </div>
      `).join('');

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
  } catch (e) {}
}

// Confirmation Step
function renderConfirmation() {
  const inputEl = document.getElementById('input-devotee-name');
  if (inputEl && inputEl.value.trim()) {
    devoteeName = inputEl.value.trim();
  }

  const sumName = document.getElementById('sum-name');
  const sumCount = document.getElementById('sum-count');
  const sumSlot = document.getElementById('sum-slot');
  const sumWait = document.getElementById('sum-wait');
  const sumGate = document.getElementById('sum-gate');

  if (sumName) sumName.textContent = devoteeName || 'श्रद्धालु (Devotee)';
  if (sumCount) sumCount.textContent = `${selectedDevoteeCount} ${DICT[currentLang].persons}`;
  if (sumSlot) sumSlot.textContent = selectedSlotTime;
  if (sumWait) sumWait.textContent = `~${liveWaitMinutes} ${DICT[currentLang].minutes}`;
  if (sumGate) sumGate.textContent = currentLang === 'hi' ? 'गेट नं. ४ (शंकु द्वार)' : 'Gate No. 4 (Shanku Dwar)';
}

// Confirm & Print Action
async function confirmAndPrint() {
  playBeep(1000, 0.15);

  const inputEl = document.getElementById('input-devotee-name');
  if (inputEl && inputEl.value.trim()) {
    devoteeName = inputEl.value.trim();
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
        slotId: selectedSlotId,
        slotTime: selectedSlotTime,
        language: currentLang
      })
    });

    const data = await res.json();
    if (data.success && data.booking) {
      bookingData = data.booking;
      renderThermalTicket(bookingData);
      goToScreen('screen-ticket');

      setTimeout(() => {
        window.print();
      }, 500);

      startAutoResetTimer(20);
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

// Render Official Darshan Pass Card
function renderThermalTicket(b) {
  const container = document.getElementById('thermal-ticket-mount');
  if (!container) return;

  const qrSrc = b.qrDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(b.bookingId + '|' + b.tokenNumber)}`;

  container.innerHTML = `
    <div class="darshan-pass-card">
      <!-- Top Header with Temple Emblem -->
      <div class="pass-header">
        <div class="pass-emblem-row">
          <img src="shrimahakaleshwar_logo.png" alt="श्री महाकालेश्वर मंदिर" class="pass-emblem-img" />
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
          <div class="token-status-pill">✓ पुष्टिकृत / CONFIRMED</div>
          <div style="font-size: 0.75rem; color: #7a1a03; font-weight: 700; margin-top: 6px;">निःशुल्क पास (FREE)</div>
        </div>
      </div>

      <!-- Devotee & Booking Details Table -->
      <table class="pass-details-table">
        <tr>
          <td class="pass-td-key">👤 श्रद्धालु का पूरा नाम (Full Name):</td>
          <td class="pass-td-val val-highlight">${b.devoteeName}</td>
        </tr>
        <tr>
          <td class="pass-td-key">👥 कुल संख्या (Total Persons):</td>
          <td class="pass-td-val"><strong>${b.devoteeCount} Person(s)</strong></td>
        </tr>
        <tr>
          <td class="pass-td-key">⏰ दर्शन स्लॉट (Darshan Slot):</td>
          <td class="pass-td-val">${b.slotTime}</td>
        </tr>
        <tr>
          <td class="pass-td-key">⏳ अनुमानित समय (Est. Time):</td>
          <td class="pass-td-val"><strong>${b.estimatedDarshanTime}</strong> (~${b.liveWaitMinutes} Mins)</td>
        </tr>
        <tr>
          <td class="pass-td-key">📍 प्रवेश द्वार (Entry Gate):</td>
          <td class="pass-td-val" style="color: #2e7d32;"><strong>गेट नं. ४ (शंकु द्वार)</strong></td>
        </tr>
        <tr>
          <td class="pass-td-key">📅 जारी समय (Issued Date/Time):</td>
          <td class="pass-td-val">${b.bookedAt}</td>
        </tr>
      </table>

      <!-- QR Code & Turnstile Instructions -->
      <div class="pass-qr-section">
        <img src="${qrSrc}" alt="Turnstile QR Code" class="pass-qr-img" />
        <div class="pass-qr-meta">
          <p style="font-size: 0.8rem; font-weight: 800; color: #7a1a03;">★ प्रवेश हेतु QR कोड स्कैन करें</p>
          <p style="margin-top: 2px; color: #4b5563;">Scan at turnstile barrier before entering queue.</p>
          <span class="pass-qr-gate-badge">📍 GATE NO. 4 TURNSTILE</span>
        </div>
      </div>

      <!-- Simulated Barcode -->
      <div class="pass-barcode-box">
        <div class="barcode-lines"></div>
        <span>*${b.bookingId}*</span>
      </div>

      <!-- Official Footer -->
      <div class="pass-footer-notes">
        <p>श्री महाकालेश्वर मंदिर प्रबंध समिति, उज्जैन</p>
        <small>यह पास केवल आज के दर्शन के लिए एक बार प्रवेश हेतु मान्य है • Terminal: ${b.kioskId}</small>
      </div>
    </div>
  `;
}

// Download PDF Helper
async function downloadPdfPass() {
  const element = document.querySelector('.darshan-pass-card');
  if (!element || !bookingData) return;

  const btn = document.getElementById('btn-download-pdf');
  const originalText = btn ? btn.textContent : '';
  if (btn) btn.textContent = '⏳ PDF तैयार हो रहा है...';

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `Mahakal_Darshan_Pass_${bookingData.tokenNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
  const nameInput = document.getElementById('input-devotee-name');
  if (nameInput) nameInput.value = '';
  initDevoteeSelector();
  goToScreen('screen-welcome');
}

// Document Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  setLanguage('hi');
  initDevoteeSelector();
  initSlots();
  updateLiveWaitBanner();

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.getAttribute('data-lang'));
    });
  });

  // Step 1 -> Step 2
  document.getElementById('btn-start-booking')?.addEventListener('click', () => {
    goToScreen('screen-devotees');
  });

  // Step 2 -> Step 3
  document.getElementById('btn-to-name')?.addEventListener('click', () => {
    goToScreen('screen-name');
  });
  document.getElementById('btn-back-to-welcome')?.addEventListener('click', () => {
    goToScreen('screen-welcome');
  });

  // Step 3 -> Step 4
  document.getElementById('btn-to-slot')?.addEventListener('click', () => {
    const nameInput = document.getElementById('input-devotee-name');
    if (!nameInput || !nameInput.value.trim()) {
      alert(currentLang === 'hi' ? 'कृपया श्रद्धालु का नाम दर्ज करें।' : 'Please enter devotee name.');
      nameInput?.focus();
      return;
    }
    devoteeName = nameInput.value.trim();
    goToScreen('screen-slot');
  });
  document.getElementById('btn-back-to-devotees')?.addEventListener('click', () => {
    goToScreen('screen-devotees');
  });

  // Step 4 -> Step 5
  document.getElementById('btn-to-confirm')?.addEventListener('click', () => {
    goToScreen('screen-confirm');
  });
  document.getElementById('btn-back-to-name')?.addEventListener('click', () => {
    goToScreen('screen-name');
  });

  // Step 5 -> Step 6
  document.getElementById('btn-confirm-booking')?.addEventListener('click', () => {
    confirmAndPrint();
  });
  document.getElementById('btn-back-to-slot')?.addEventListener('click', () => {
    goToScreen('screen-slot');
  });

  // Print button
  document.getElementById('btn-print-ticket-manual')?.addEventListener('click', () => {
    window.print();
  });

  // PDF Download button
  document.getElementById('btn-download-pdf')?.addEventListener('click', () => {
    downloadPdfPass();
  });

  document.getElementById('btn-start-new-booking')?.addEventListener('click', () => {
    resetKiosk();
  });
});
