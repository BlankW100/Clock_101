// assets/js/timezones.js
export const timezones = [
  // Americas
  { value: "America/New_York", label: "(UTC-5) Eastern Time (New York, Toronto)" },
  { value: "America/Chicago", label: "(UTC-6) Central Time (Chicago, Mexico City)" },
  { value: "America/Denver", label: "(UTC-7) Mountain Time (Denver, Phoenix)" },
  { value: "America/Los_Angeles", label: "(UTC-8) Pacific Time (Los Angeles, Vancouver)" },
  { value: "America/Halifax", label: "(UTC-4) Atlantic Time (Halifax)" },
  
  // Europe
  { value: "Europe/London", label: "(UTC±0) London, Dublin" },
  { value: "Europe/Paris", label: "(UTC+1) Paris, Berlin" },
  { value: "Europe/Moscow", label: "(UTC+3) Moscow, Istanbul" },
  
  // Asia
  { value: "Asia/Dubai", label: "(UTC+4) Dubai, Abu Dhabi" },
  { value: "Asia/Kolkata", label: "(UTC+5:30) Mumbai, New Delhi" },
  { value: "Asia/Singapore", label: "(UTC+8) Singapore, Kuala Lumpur" },
  { value: "Asia/Tokyo", label: "(UTC+9) Tokyo, Seoul" },
  
  // Australia/Pacific
  { value: "Australia/Sydney", label: "(UTC+10) Sydney, Melbourne" },
  { value: "Pacific/Auckland", label: "(UTC+12) Auckland, Wellington" },
  
  // Others
  { value: "Africa/Cairo", label: "(UTC+2) Cairo, Johannesburg" },
  { value: "Asia/Riyadh", label: "(UTC+3) Riyadh, Nairobi" },
  { value: "Asia/Shanghai", label: "(UTC+8) Beijing, Shanghai" },
  { value: "America/Sao_Paulo", label: "(UTC-3) São Paulo, Rio de Janeiro" }
];

// Utility function to group by UTC offset
export const timezonesByOffset = {
  "-12": ["Pacific/Midway"],
  "-11": ["Pacific/Pago_Pago"],
  "-10": ["Pacific/Honolulu"],
  // ... (complete offset grouping) ...
  "+14": ["Pacific/Kiritimati"]
};