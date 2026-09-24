/**
 * Shri Mahakaleshwar Temple Darshan Kiosk — Interactive Logic
 * Developed by FacePe
 */

const DICT = {
  hi: {
    templeTitle: 'श्री महाकालेश्वर ज्योतिर्लिंग मंदिर',
    templeSub: 'उज्जैन (म.प्र.) • दर्शन बुकिंग कियोस्क',
    welcomePraise: '॥ ॐ नमः शिवाय ॥',
    welcomeMain: 'स्वयं सेवा दर्शन पास बुकिंग',
    welcomeSub: 'कियोस्क से निःशुल्क सामान्य दर्शन पास प्राप्त करें',
    btnBookNow: 'सामान्य दर्शन बुक करें',
    liveWait: 'वर्तमान प्रतीक्षा समय',
    minutes: 'मिनट',
    crowd: 'भीड़ स्थिति',
    step1Eye: 'चरण १ / ४',
    step1Title: 'श्रद्धालुओं की संख्या चुनें',
    step1Sub: 'एक बार में अधिकतम ८ श्रद्धालु बुक कर सकते हैं',
    persons: 'श्रद्धालु',
    step2Eye: 'चरण २ / ४',
    step2Title: 'मुख्य श्रद्धालु का विवरण दर्ज करें',
    step2Sub: 'कृपया नाम और मोबाइल नंबर दर्ज करें',
    labelName: 'मुख्य श्रद्धालु का पूरा नाम *',
    placeholderName: 'उदा. राजेश शर्मा',
    labelMobile: 'मोबाइल नंबर (व्हाट्सएप पर पास हेतु)',
    placeholderMobile: '१० अंकों का मोबाइल नंबर',
    labelPhoto: 'लाइव फोटो कैप्चर (वैकल्पिक)',
    btnSnap: 'फोटो लें',
    step3Eye: 'चरण ३ / ४',
    step3Title: 'दर्शन समय स्लॉट चुनें',
    step3Sub: 'आज के उपलब्ध समय स्लॉट',
    step4Eye: 'चरण ४ / ४',
    step4Title: 'बुकिंग की पुष्टि करें',
    step4Sub: 'कृपया विवरण जांचें और टिकट प्रिंट करें',
    summaryDevotee: 'मुख्य श्रद्धालु',
    summaryCount: 'कुल श्रद्धालु',
    summarySlot: 'दर्शन स्लॉट',
    summaryWait: 'अनुमानित प्रतीक्षा समय',
    summaryGate: 'प्रवेश द्वार',
    btnBack: 'पीछे',
    btnNext: 'आगे बढ़ें',
    btnConfirm: 'पुष्टि करें एवं टिकट प्रिंट करें',
    btnPrintNow: 'टिकट प्रिंट करें',
    btnBookAnother: 'नई बुकिंग करें',
    ticketGenerated: 'दर्शन पास सफलतापूर्वक जारी हुआ!',
    ticketSub: 'कृपया नीचे से अपना प्रिंटेड पास प्राप्त करें',
    autoResetMsg: 'कियोस्क होम स्क्रीन पर रीसेट होगा:'
  },
  en: {
    templeTitle: 'Shri Mahakaleshwar Jyotirlinga Temple',
    templeSub: 'Ujjain (M.P.) • Darshan Booking Kiosk',
    welcomePraise: '॥ OM NAMAH SHIVAYA ॥',
    welcomeMain: 'Self-Service Darshan Booking',
    welcomeSub: 'Get your instant General Darshan Pass directly from the Kiosk',
    btnBookNow: 'Book General Darshan',
    liveWait: 'Live Waiting Time',
    minutes: 'Minutes',
    crowd: 'Crowd Level',
    step1Eye: 'STEP 1 / 4',
    step1Title: 'Select Number of Devotees',
    step1Sub: 'You can book up to 8 devotees in one transaction',
    persons: 'Person(s)',
    step2Eye: 'STEP 2 / 4',
    step2Title: 'Enter Primary Devotee Details',
    step2Sub: 'Please enter name and contact details',
    labelName: 'Primary Devotee Full Name *',
    placeholderName: 'e.g. Rajesh Sharma',
    labelMobile: 'Mobile Number (For WhatsApp Pass)',
    placeholderMobile: '10-digit mobile number',
    labelPhoto: 'Live Photo Capture (Optional)',
    btnSnap: 'Capture Photo',
    step3Eye: 'STEP 3 / 4',
    step3Title: 'Select Darshan Time Slot',
    step3Sub: 'Available slots for today',
    step4Eye: 'STEP 4 / 4',
    step4Title: 'Confirm Your Booking',
    step4Sub: 'Please verify details and print your ticket',
    summaryDevotee: 'Primary Devotee',
    summaryCount: 'Total Devotees',
    summarySlot: 'Darshan Slot',
    summaryWait: 'Live Waiting Time',
    summaryGate: 'Designated Entry Gate',
    btnBack: 'Back',
    btnNext: 'Proceed',
    btnConfirm: 'Confirm & Print Ticket',
    btnPrintNow: 'Print Ticket',
    btnBookAnother: 'New Booking',
    ticketGenerated: 'Darshan Pass Issued Successfully!',
    ticketSub: 'Please collect your printed pass from the tray below',
    autoResetMsg: 'Kiosk will reset to home in:'
  }
};

// Global App State
let currentLang = 'hi';
let currentScreen = 'screen-welcome';
let selectedDevoteeCount = 1;
let devoteeName = '';
let devoteeMobile = '';
let selectedSlotId = 'S2';
let selectedSlotTime = '08:00 AM - 11:00 AM';
let liveWaitMinutes = 35;
let resetTimerInterval = null;
let bookingData = null;

// Sound Effects (Web Audio API)
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
  } catch (e) {
    // audio not supported or blocked
  }
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

// Navigation State Machine
function goToScreen(screenId) {
  playBeep(750, 0.06);
  document.querySelectorAll('.screen-card').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    currentScreen = screenId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle screen specific triggers
  if (screenId === 'screen-confirm') {
    renderConfirmation();
  }
}

// Fetch Live Waiting Time from backend
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
  } catch (e) {
    // fallback
  }
}

// Devotee Count Selection
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
          <div class="flex items-center justify-between">
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

// Confirmation Preview
function renderConfirmation() {
  devoteeName = document.getElementById('input-devotee-name')?.value || 'Rajesh Sharma';
  devoteeMobile = document.getElementById('input-devotee-phone')?.value || '9876543210';

  const sumName = document.getElementById('sum-name');
  const sumCount = document.getElementById('sum-count');
  const sumSlot = document.getElementById('sum-slot');
  const sumWait = document.getElementById('sum-wait');
  const sumGate = document.getElementById('sum-gate');

  if (sumName) sumName.textContent = devoteeName;
  if (sumCount) sumCount.textContent = `${selectedDevoteeCount} ${DICT[currentLang].persons}`;
  if (sumSlot) sumSlot.textContent = selectedSlotTime;
  if (sumWait) sumWait.textContent = `~${liveWaitMinutes} ${DICT[currentLang].minutes}`;
  if (sumGate) sumGate.textContent = currentLang === 'hi' ? 'गेट नं. ४ (शंकु द्वार)' : 'Gate No. 4 (Shanku Dwar)';
}

// Submit Booking & Generate Thermal Ticket
async function confirmAndPrint() {
  playBeep(1000, 0.15);
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
        devoteeName,
        devoteeCount: selectedDevoteeCount,
        mobileNumber: devoteeMobile,
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
      
      // Auto trigger print dialog after 600ms
      setTimeout(() => {
        window.print();
      }, 600);

      // Start Auto-reset countdown
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

// Render 80mm Thermal Receipt Ticket
function renderThermalTicket(b) {
  const container = document.getElementById('thermal-ticket-mount');
  if (!container) return;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(b.bookingId + '|' + b.tokenNumber)}`;

  container.innerHTML = `
    <div class="thermal-ticket">
      <div class="ticket-header">
        <div class="ticket-om">॥ ॐ नमः शिवाय ॥</div>
        <div class="ticket-temple-name">SHRI MAHAKALESHWAR TEMPLE</div>
        <div style="font-size: 11px; font-weight: 700;">UJJAIN (MADHYA PRADESH)</div>
        <div class="ticket-pass-type">GENERAL DARSHAN PASS (FREE)</div>
      </div>

      <div style="font-size: 11px; font-weight: 700; color: #333;">TOKEN NUMBER</div>
      <div class="ticket-token-large">${b.tokenNumber}</div>
      <div style="font-size: 10px; color: #555; margin-bottom: 8px;">Pass ID: ${b.bookingId}</div>

      <table class="ticket-table">
        <tr>
          <td><strong>Devotee:</strong></td>
          <td align="right">${b.devoteeName}</td>
        </tr>
        <tr>
          <td><strong>No. of Persons:</strong></td>
          <td align="right"><strong>${b.devoteeCount} Person(s)</strong></td>
        </tr>
        <tr>
          <td><strong>Date & Slot:</strong></td>
          <td align="right">${b.slotTime}</td>
        </tr>
        <tr>
          <td><strong>Live Wait Time:</strong></td>
          <td align="right"><strong>~${b.liveWaitMinutes} Mins</strong></td>
        </tr>
        <tr>
          <td><strong>Est. Darshan:</strong></td>
          <td align="right"><strong>${b.estimatedDarshanTime}</strong></td>
        </tr>
        <tr>
          <td><strong>Entry Gate:</strong></td>
          <td align="right">${b.gateName}</td>
        </tr>
        <tr>
          <td><strong>Issued At:</strong></td>
          <td align="right">${b.bookedAt}</td>
        </tr>
      </table>

      <div class="ticket-qr">
        <img src="${qrUrl}" alt="QR Code" width="140" height="140" />
      </div>

      <div class="ticket-footer">
        <p><strong>SCAN AT GATE NO. 4 TURNSTILE</strong></p>
        <p style="margin-top: 3px;">Valid for single entry today only.</p>
        <p style="margin-top: 5px; font-size: 9px;">Kiosk ID: ${b.kioskId} • Powered by FacePe</p>
      </div>
    </div>
  `;
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

// Reset Kiosk to Initial State
function resetKiosk() {
  clearInterval(resetTimerInterval);
  selectedDevoteeCount = 1;
  const nameInput = document.getElementById('input-devotee-name');
  const phoneInput = document.getElementById('input-devotee-phone');
  if (nameInput) nameInput.value = '';
  if (phoneInput) phoneInput.value = '';
  initDevoteeSelector();
  goToScreen('screen-welcome');
}

// Document Ready
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

  // Step 1: Start Booking
  document.getElementById('btn-start-booking')?.addEventListener('click', () => {
    goToScreen('screen-devotees');
  });

  // Step 2: Devotee count -> Name
  document.getElementById('btn-to-name')?.addEventListener('click', () => {
    goToScreen('screen-name');
  });
  document.getElementById('btn-back-to-welcome')?.addEventListener('click', () => {
    goToScreen('screen-welcome');
  });

  // Step 3: Name -> Slot
  document.getElementById('btn-to-slot')?.addEventListener('click', () => {
    const nameInput = document.getElementById('input-devotee-name');
    if (!nameInput || !nameInput.value.trim()) {
      alert(currentLang === 'hi' ? 'कृपया श्रद्धालु का नाम दर्ज करें।' : 'Please enter devotee name.');
      nameInput?.focus();
      return;
    }
    goToScreen('screen-slot');
  });
  document.getElementById('btn-back-to-devotees')?.addEventListener('click', () => {
    goToScreen('screen-devotees');
  });

  // Step 4: Slot -> Confirm
  document.getElementById('btn-to-confirm')?.addEventListener('click', () => {
    goToScreen('screen-confirm');
  });
  document.getElementById('btn-back-to-name')?.addEventListener('click', () => {
    goToScreen('screen-name');
  });

  // Step 5: Confirm -> Print Ticket
  document.getElementById('btn-confirm-booking')?.addEventListener('click', () => {
    confirmAndPrint();
  });
  document.getElementById('btn-back-to-slot')?.addEventListener('click', () => {
    goToScreen('screen-slot');
  });

  // Ticket Screen buttons
  document.getElementById('btn-print-ticket-manual')?.addEventListener('click', () => {
    window.print();
  });
  document.getElementById('btn-start-new-booking')?.addEventListener('click', () => {
    resetKiosk();
  });
});
