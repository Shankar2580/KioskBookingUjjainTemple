import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

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

// API: Get Available Slots
app.get('/api/slots', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const slots = [
    { id: 'S1', time: '06:00 AM - 08:00 AM', labelHi: 'प्रातः दर्शन (Morning Aarti)', wait: '20 mins', available: true, remaining: 180 },
    { id: 'S2', time: '08:00 AM - 11:00 AM', labelHi: 'सामान्य दर्शन (General Darshan)', wait: `${currentWaitMinutes} mins`, available: true, remaining: 240, isCurrent: true },
    { id: 'S3', time: '11:00 AM - 02:00 PM', labelHi: 'मध्याह्न दर्शन (Midday Darshan)', wait: '45 mins', available: true, remaining: 310 },
    { id: 'S4', time: '02:00 PM - 05:00 PM', labelHi: 'अपराह्न दर्शन (Afternoon Darshan)', wait: '30 mins', available: true, remaining: 290 },
    { id: 'S5', time: '05:00 PM - 08:00 PM', labelHi: 'संध्या आरती एवं दर्शन (Evening)', wait: '50 mins', available: true, remaining: 150 },
    { id: 'S6', time: '08:00 PM - 10:30 PM', labelHi: 'शयन आरती दर्शन (Night Darshan)', wait: '25 mins', available: true, remaining: 200 }
  ];

  res.json({
    success: true,
    today,
    tomorrow,
    slots
  });
});

// API: Create Booking & Issue Ticket
app.post('/api/book', (req, res) => {
  const { devoteeName, devoteeCount, mobileNumber, slotId, slotTime, photoBase64, language } = req.body;

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

  const booking = {
    bookingId,
    tokenNumber,
    devoteeName: devoteeName.trim(),
    devoteeCount: parseInt(devoteeCount, 10),
    mobileNumber: mobileNumber ? mobileNumber.trim() : 'Walk-in Devotee',
    slotId: slotId || 'S2',
    slotTime: slotTime || '08:00 AM - 11:00 AM',
    liveWaitMinutes: currentWaitMinutes,
    estimatedDarshanTime,
    gateName: 'Gate No. 4 (Shanku Dwar / Bada Ganesh Marg)',
    gateNameHi: 'गेट नं. ४ (शंकु द्वार / बड़ा गणेश मार्ग)',
    bookedAt: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
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

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🔱 Shri Mahakaleshwar Temple Kiosk Demo running!`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`===================================================`);
});
