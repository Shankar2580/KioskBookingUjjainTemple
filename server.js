import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for today's kiosk bookings
let bookings = [];
let tokenCounter = 101;
let currentWaitMinutes = 35; // Default live wait time

// API: Get Live Temple Queue Waiting Time
app.get('/api/waiting-time', (req, res) => {
  res.json({
    success: true,
    waitTimeMinutes: currentWaitMinutes,
    statusTextEn: `${currentWaitMinutes} Minutes`,
    statusTextHi: `${currentWaitMinutes} मिनट`,
    crowdLevel: currentWaitMinutes > 60 ? 'High' : currentWaitMinutes > 30 ? 'Moderate' : 'Low',
    crowdLevelHi: currentWaitMinutes > 60 ? 'अधिक (Heavy)' : currentWaitMinutes > 30 ? 'मध्यम (Moderate)' : 'सामान्य (Normal)',
    activeQueueCount: bookings.reduce((sum, b) => sum + (b.devoteeCount || 1), 340),
    lastUpdated: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })
  });
});

// API: Set Live Wait Time (Admin Override for Demo)
app.post('/api/admin/waiting-time', (req, res) => {
  const { minutes } = req.body;
  if (minutes && !isNaN(minutes)) {
    currentWaitMinutes = parseInt(minutes, 10);
    return res.json({ success: true, waitTimeMinutes: currentWaitMinutes });
  }
  res.status(400).json({ error: 'Invalid minutes' });
});

// API: Get Available Slots & Dates (Today + 5 days)
app.get('/api/slots', (req, res) => {
  const dates = [];
  const now = new Date();
  
  const monthNamesHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNamesHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  for (let i = 0; i <= 5; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    const isoDate = d.toISOString().split('T')[0];
    const dayNameEn = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNameHi = dayNamesHi[d.getDay()];
    const monthNameEn = monthNamesEn[d.getMonth()];
    const monthNameHi = monthNamesHi[d.getMonth()];
    const dateNum = d.getDate();

    dates.push({
      offset: i,
      isoDate,
      dateNum,
      dayNameEn,
      dayNameHi,
      monthNameEn,
      monthNameHi,
      labelHi: i === 0 ? 'आज (Today)' : i === 1 ? 'कल (Tomorrow)' : `${dayNameHi}, ${dateNum} ${monthNameHi}`,
      labelEn: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${dayNameEn}, ${dateNum} ${monthNameEn}`,
      displayFullHi: `${dateNum} ${monthNameHi} ${d.getFullYear()}`,
      displayFullEn: `${dateNum} ${monthNameEn} ${d.getFullYear()}`
    });
  }

  const slots = [
    { id: 'S1', time: '06:00 AM - 08:00 AM', labelHi: 'प्रातः दर्शन (Morning Aarti)', wait: '20 mins', available: true, remaining: 180 },
    { id: 'S2', time: '08:00 AM - 11:00 AM', labelHi: 'सामान्य दर्शन (General Darshan)', wait: `${currentWaitMinutes} mins`, available: true, remaining: 240, isCurrent: true },
    { id: 'S3', time: '11:00 AM - 02:00 PM', labelHi: 'मध्याह्न दर्शन (Midday Darshan)', wait: '45 mins', available: true, remaining: 310 },
    { id: 'S4', time: '02:00 PM - 05:00 PM', labelHi: 'अपराह्न दर्शन (Afternoon Darshan)', wait: '30 mins', available: true, remaining: 290 },
    { id: 'S5', time: '05:00 PM - 08:00 PM', labelHi: 'संध्या आरती एवं दर्शन (Evening)', wait: '50 mins', available: true, remaining: 150 },
    { id: 'S6', time: '08:00 PM - 10:00 PM', labelHi: 'शयन आरती दर्शन (Night Darshan)', wait: '25 mins', available: true, remaining: 200 }
  ];

  res.json({
    success: true,
    dates,
    slots
  });
});

// API: Create Booking & Issue Ticket
app.post('/api/book', async (req, res) => {
  const { devoteeName, devoteeCount, mobileNumber, slotId, slotTime, darshanDate, darshanDateFormatted, photoBase64, language } = req.body;

  if (!devoteeName || !devoteeCount) {
    return res.status(400).json({ error: 'Devotee name and count are required.' });
  }

  const tokenNumber = `GD-${tokenCounter++}`;
  const bookingId = `MK-${new Date().getFullYear()}-${tokenNumber}`;
  const now = new Date();
  
  // Calculate estimated darshan time
  const estimatedTime = new Date(now.getTime() + currentWaitMinutes * 60000);
  const estimatedDarshanTime = estimatedTime.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const formattedDate = darshanDateFormatted || now.toLocaleDateString('en-IN');

  // Generate QR Code data URL
  let qrDataUrl = '';
  try {
    const qrPayload = JSON.stringify({
      passId: bookingId,
      token: tokenNumber,
      name: devoteeName.trim(),
      persons: parseInt(devoteeCount, 10),
      date: formattedDate,
      slot: slotTime || '08:00 AM - 11:00 AM',
      gate: 'Triveni Gate, Shri Mahakal Mahalok',
      issued: now.toLocaleDateString('en-IN')
    });
    qrDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 220,
      color: {
        dark: '#1e1510',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR generation error:', err);
  }

  const booking = {
    bookingId,
    tokenNumber,
    devoteeName: devoteeName.trim(),
    devoteeCount: parseInt(devoteeCount, 10),
    mobileNumber: mobileNumber ? mobileNumber.trim() : 'Walk-in Devotee',
    darshanDate: darshanDate || now.toISOString().split('T')[0],
    darshanDateFormatted: formattedDate,
    slotId: slotId || 'S2',
    slotTime: slotTime || '08:00 AM - 11:00 AM',
    liveWaitMinutes: currentWaitMinutes,
    estimatedDarshanTime,
    gateName: 'Triveni Gate, Shri Mahakal Mahalok (त्रिवेणी गेट, श्री महाकाल महालोक)',
    gateNameHi: 'त्रिवेणी गेट, श्री महाकाल महालोक (Triveni Gate, Shri Mahakal Mahalok)',
    bookedAt: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    qrDataUrl,
    photoBase64: photoBase64 || null,
    kioskId: 'KIOSK-UJJAIN-01'
  };

  bookings.unshift(booking);
  res.json({ success: true, booking });
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🔱 Shri Mahakaleshwar Temple Kiosk Demo running!`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`===================================================`);
  });
}

export default app;
