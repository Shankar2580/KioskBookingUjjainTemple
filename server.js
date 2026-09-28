import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import net from 'net';

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

// API: Get Available Slots & Dates (Always dynamically calculated from today + 5 days)
app.get('/api/slots', (req, res) => {
  const dates = [];
  
  const monthNamesHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNamesHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const baseSlotsConfig = [
    { id: 'S1', time: '06:00 AM - 08:00 AM', baseSeats: 180, wait: '20 mins', waitHi: '२० मिनट' },
    { id: 'S2', time: '08:00 AM - 11:00 AM', baseSeats: 240, wait: `${currentWaitMinutes} mins`, waitHi: `${currentWaitMinutes} मिनट`, isCurrent: true },
    { id: 'S3', time: '11:00 AM - 02:00 PM', baseSeats: 310, wait: '45 mins', waitHi: '४५ मिनट' },
    { id: 'S4', time: '02:00 PM - 05:00 PM', baseSeats: 290, wait: '30 mins', waitHi: '३० मिनट' },
    { id: 'S5', time: '05:00 PM - 08:00 PM', baseSeats: 150, wait: '50 mins', waitHi: '५० मिनट' },
    { id: 'S6', time: '08:00 PM - 10:00 PM', baseSeats: 200, wait: '25 mins', waitHi: '२५ मिनट' }
  ];

  // Helper: Calculate exact date in Indian Standard Time (Asia/Kolkata, UTC+5:30)
  function getKolkataDate(offsetDays = 0) {
    const now = new Date();
    const kolkataStr = now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
    const [m, day, y] = kolkataStr.split('/').map(Number);
    return new Date(y, m - 1, day + offsetDays);
  }

  for (let i = 0; i <= 5; i++) {
    const d = getKolkataDate(i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const isoDate = `${yyyy}-${mm}-${dd}`;
    const dayNameEn = dayNamesEn[d.getDay()];
    const dayNameHi = dayNamesHi[d.getDay()];
    const monthNameEn = monthNamesEn[d.getMonth()];
    const monthNameHi = monthNamesHi[d.getMonth()];
    const dateNum = d.getDate();

    // Distinct seat availability variance for each date
    const dayVariance = [0, 42, -28, 65, -38, 78][i % 6];
    const dateSlots = baseSlotsConfig.map((s, slotIdx) => {
      const slotVariance = [0, -18, 24, -32, 38, -12][(i + slotIdx) % 6];
      const remaining = Math.max(35, s.baseSeats + dayVariance + slotVariance);
      return {
        id: s.id,
        time: s.time,
        remaining,
        wait: s.wait,
        waitHi: s.waitHi,
        available: true,
        isCurrent: i === 0 && s.isCurrent
      };
    });

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
      displayFullHi: `${dateNum} ${monthNameHi} ${yyyy}`,
      displayFullEn: `${dateNum} ${monthNameEn} ${yyyy}`,
      slots: dateSlots
    });
  }

  res.json({
    success: true,
    dates,
    slots: dates[0].slots
  });
});

// API: Create Booking & Issue Ticket
app.post('/api/book', async (req, res) => {
  const { devoteeName, devoteeCount, mobileNumber, slotId, slotTime, darshanDate, darshanDateFormatted, darshanDateFormattedEn, photoBase64, language } = req.body;

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
  let formattedDateEn = darshanDateFormattedEn;
  if (!formattedDateEn && darshanDate) {
    const parts = darshanDate.split('-');
    if (parts.length === 3) {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const mIdx = parseInt(parts[1], 10) - 1;
      const dNum = parseInt(parts[2], 10);
      if (mIdx >= 0 && mIdx < 12 && !isNaN(dNum)) {
        formattedDateEn = `${dNum} ${months[mIdx]} ${parts[0]}`;
      }
    }
  }
  if (!formattedDateEn) formattedDateEn = now.toLocaleDateString('en-GB');

  // Generate QR Code data URL
  let qrDataUrl = '';
  try {
    const qrPayload = JSON.stringify({
      passId: bookingId,
      token: tokenNumber,
      name: devoteeName.trim(),
      mobile: mobileNumber ? mobileNumber.trim() : '',
      persons: parseInt(devoteeCount, 10),
      date: formattedDateEn,
      slot: slotTime || '08:00 AM - 11:00 AM',
      gate: 'Nilkanth Gate',
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
    darshanDateFormattedEn: formattedDateEn,
    slotId: slotId || 'S2',
    slotTime: slotTime || '08:00 AM - 11:00 AM',
    liveWaitMinutes: currentWaitMinutes,
    estimatedDarshanTime,
    gateName: 'Nilkanth Gate (नीलकंठ द्वार)',
    gateNameHi: 'नीलकंठ द्वार (Nilkanth Gate)',
    bookedAt: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    qrDataUrl,
    photoBase64: photoBase64 || null,
    kioskId: 'KIOSK-UJJAIN-01'
  };

  bookings.unshift(booking);

  // Directly send to Epson TM-T88VII on local network if reachable (unless skipped for client graphic print)
  if (!req.body.skipServerPrint) {
    const printResult = await printToEpsonNetworkPrinter(booking);
    booking.printedToHardware = printResult.printed;
  } else {
    booking.printedToHardware = false;
  }

  res.json({ success: true, booking, printedToHardware: booking.printedToHardware });
});

// API: Print high-resolution monochrome raster graphic to Epson printer
app.post('/api/print-raster', async (req, res) => {
  const { rasterBase64, widthBytes = 64, heightDots = 960 } = req.body || {};
  if (!rasterBase64) {
    return res.status(400).json({ success: false, error: 'No rasterBase64 provided' });
  }

  try {
    const rasterBuf = Buffer.from(rasterBase64, 'base64');
    const client = new net.Socket();
    client.setTimeout(3500);

    client.connect(PRINTER_PORT, PRINTER_HOST, () => {
      const xL = widthBytes % 256;
      const xH = Math.floor(widthBytes / 256);
      const yL = heightDots % 256;
      const yH = Math.floor(heightDots / 256);

      // ESC @ (init) + GS v 0 0 xL xH yL yH [data] + ESC d 4 + GS V A 3 (cut)
      const header = Buffer.from([0x1b, 0x40, 0x1d, 0x76, 0x30, 0x00, xL, xH, yL, yH]);
      const footer = Buffer.from([0x1b, 0x64, 0x04, 0x1d, 0x56, 0x41, 0x03]);
      const fullBuf = Buffer.concat([header, rasterBuf, footer]);

      client.write(fullBuf, () => {
        client.end();
        res.json({ success: true, printed: true });
      });
    });

    client.on('error', (err) => {
      console.warn('Raster print socket error:', err.message);
      res.json({ success: false, error: err.message });
    });

    client.on('timeout', () => {
      client.destroy();
      res.json({ success: false, error: 'Socket timeout' });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Manual Thermal Print Trigger
app.post('/api/print-thermal', async (req, res) => {
  const b = req.body || {};
  const printResult = await printToEpsonNetworkPrinter(b);
  res.json({ success: printResult.printed, error: printResult.error });
});

const PRINTER_HOST = process.env.PRINTER_HOST || '192.168.31.201';
const PRINTER_PORT = parseInt(process.env.PRINTER_PORT, 10) || 9100;

function printToEpsonNetworkPrinter(b) {
  return new Promise((resolve) => {
    const client = new net.Socket();
    client.setTimeout(2500);

    client.connect(PRINTER_PORT, PRINTER_HOST, () => {
      const ESC = '\x1b';
      const GS = '\x1d';

      const isHi = (b.language === 'hi') || (!b.language);
      const displayDate = b.darshanDateFormatted || b.darshanDateFormattedEn || (b.darshanDate && !/[\u0900-\u097F]/.test(b.darshanDate) ? b.darshanDate : 'Today');
      const devoteeMobile = b.mobileNumber && b.mobileNumber !== 'Walk-in Devotee' ? b.mobileNumber : '—';
      const cleanIssued = b.bookedAt ? b.bookedAt.replace(/[\u0900-\u097F]/g, '').trim() : 'Now';

      const titleHeader = isHi
        ? 'SHRI MAHAKALESHWAR TEMPLE\nJYOTIRLINGA, UJJAIN (M.P.)\n॥ SAMANYA DARSHAN PASS (NISHULK) ॥\n'
        : 'SHRI MAHAKALESHWAR\nJYOTIRLINGA TEMPLE, UJJAIN (M.P.)\nSAMANYA DARSHAN PASS (FREE)\n';

      const tokenLabel  = isHi ? `TOKEN / टोकन: ${b.tokenNumber}\n` : `TOKEN: ${b.tokenNumber}\n`;
      const passIdLabel = isHi ? `PASS ID / पास: ${b.bookingId}\n` : `PASS ID: ${b.bookingId}\n`;
      const statusLabel = isHi ? 'STATUS: PUSHTIKRIT / CONFIRMED (NISHULK)\n' : 'STATUS: CONFIRMED (FREE)\n';

      const lblDevotee = isHi ? 'Shraddhalu / मुख्य श्रद्धालु : ' : 'Devotee Name : ';
      const lblMobile  = isHi ? 'Mobile No. / मोबाइल नंबर   : ' : 'Mobile Number: ';
      const lblCount   = isHi ? 'Kul Sankhya / कुल श्रद्धालु : ' : 'Total Persons: ';
      const lblDate    = isHi ? 'Darshan Dinank / दर्शन दिनांक: ' : 'Darshan Date : ';
      const lblSlot    = isHi ? 'Darshan Slot / समय स्लॉट   : ' : 'Darshan Slot : ';
      const lblWait    = isHi ? 'Pratiksha / प्रतीक्षा समय   : ' : 'Est. Wait    : ';
      const lblGate    = isHi ? 'Pravesh Dwar / प्रवेश द्वार : ' : 'Entry Gate   : ';
      const lblIssued  = isHi ? 'Jari Samay / जारी समय      : ' : 'Issued At    : ';

      const personsVal = isHi ? `${b.devoteeCount} Person / व्यक्ति` : `${b.devoteeCount} Person(s)`;
      const waitVal    = `${b.liveWaitMinutes || 35} Min`;

      const header = Buffer.from(
        ESC + '@' + // Initialize printer
        ESC + 'a' + '\x01' + // Center
        GS + '!' + '\x11' + // Double size
        titleHeader +
        '================================================\n' +
        GS + '!' + '\x11' +
        tokenLabel +
        GS + '!' + '\x00' +
        passIdLabel +
        statusLabel +
        '------------------------------------------------\n' +
        ESC + 'a' + '\x00' + // Left align
        `${lblDevotee}${b.devoteeName}\n` +
        `${lblMobile}${devoteeMobile}\n` +
        `${lblCount}${personsVal}\n` +
        `${lblDate}${displayDate}\n` +
        `${lblSlot}${b.slotTime}\n` +
        `${lblWait}${waitVal}\n` +
        `${lblGate}Nilkanth Gate (Neelkanth Dwar)\n` +
        `${lblIssued}${cleanIssued}\n` +
        '------------------------------------------------\n' +
        ESC + 'a' + '\x01', // Center
        'binary'
      );

      const qrPayloadText = `${b.bookingId}|${b.tokenNumber}|${b.devoteeName}|${devoteeMobile}|${b.devoteeCount}|Nilkanth Gate`;
      const qrBytes = Buffer.from(qrPayloadText, 'utf8');
      const len = qrBytes.length + 3;
      const pL = len % 256;
      const pH = Math.floor(len / 256);

      const qrBuf = Buffer.concat([
        Buffer.from([0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]),
        Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x06]),
        Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x31]),
        Buffer.from([0x1d, 0x28, 0x6b, pL, pH, 0x31, 0x50, 0x30]),
        qrBytes,
        Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30])
      ]);

      const footerText = isHi
        ? '\nNeelkanth Dwar Par Scan Karein\n(Scan at Nilkanth Gate Barrier)\nShri Mahakaleshwar Mandir Prabandh Samiti\n\n\n\n'
        : '\nScan at Nilkanth Gate Barrier\nShri Mahakaleshwar Temple Committee\n\n\n\n';

      const footer = Buffer.from(
        footerText +
        ESC + 'd' + '\x04' +
        GS + 'V' + '\x41' + '\x03',
        'binary'
      );

      const fullBuffer = Buffer.concat([header, qrBuf, footer]);
      client.write(fullBuffer, () => {
        client.end();
        resolve({ printed: true });
      });
    });

    client.on('error', (err) => {
      console.warn('Epson printer offline/unreachable:', err.message);
      resolve({ printed: false, error: err.message });
    });

    client.on('timeout', () => {
      client.destroy();
      resolve({ printed: false, error: 'Printer timeout' });
    });
  });
}

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
