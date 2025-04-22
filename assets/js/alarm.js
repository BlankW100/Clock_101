import { formatDateTime } from './timezone-utils.js';

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const liveClock = document.getElementById('live-clock');
    const liveDate = document.getElementById('live-date');
    
    // Update clock with Day.js
    function updateClock() {
        const now = dayjs();
        liveClock.textContent = now.format('HH:mm:ss');
        liveDate.textContent = now.format('dddd, MMMM D, YYYY');
        checkAlarms(now);
    }
    
    // Check alarms
    function checkAlarms(now) {
        alarms.forEach(alarm => {
            if (alarm.active && 
                now.hour() === alarm.hours && 
                now.minute() === alarm.minutes &&
                now.second() === 0) {
                triggerAlarm(alarm);
                
                if (!alarm.repeat) {
                    alarm.active = false;
                    saveAlarms();
                    renderAlarms();
                }
            }
        });
    }
    
    
});


document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const liveClock = document.getElementById('live-clock');
    const liveDate = document.getElementById('live-date');
    const alarmTimeInput = document.getElementById('alarm-time');
    const alarmNameInput = document.getElementById('alarm-name');
    const repeatDailyCheckbox = document.getElementById('repeat-daily');
    const alarmSoundSelect = document.getElementById('alarm-sound');
    const setAlarmBtn = document.getElementById('set-alarm-btn');
    const activeAlarmsList = document.getElementById('active-alarms-list');
    const alarmAudio = document.getElementById('alarm-sound');
    
    // Alarm storage
    let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    
    // Initialize
    updateClock();
    setInterval(updateClock, 1000);
    renderAlarms();
    
    // Event Listeners
    setAlarmBtn.addEventListener('click', setNewAlarm);
    
    function updateClock() {
        const now = new Date();
        
        // Update live clock
        const timeOptions = {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        liveClock.textContent = now.toLocaleTimeString('en-US', timeOptions);
        liveDate.textContent = now.toLocaleDateString('en-US', dateOptions);
        
        // Check alarms
        checkAlarms(now);
    }
    
    function setNewAlarm() {
        const alarmTime = alarmTimeInput.value;
        const alarmName = alarmNameInput.value || 'Alarm';
        const repeatDaily = repeatDailyCheckbox.checked;
        const sound = alarmSoundSelect.value;
        
        if (!alarmTime) {
            alert('Please set a time for the alarm');
            return;
        }
        
        const [hours, minutes] = alarmTime.split(':');
        const alarm = {
            id: Date.now(),
            hours: parseInt(hours),
            minutes: parseInt(minutes),
            name: alarmName,
            repeat: repeatDaily,
            sound: sound,
            active: true
        };
        
        alarms.push(alarm);
        saveAlarms();
        renderAlarms();
        
        // Reset form
        alarmTimeInput.value = '';
        alarmNameInput.value = '';
    }
    
    function renderAlarms() {
        activeAlarmsList.innerHTML = '';
        
        if (alarms.length === 0) {
            activeAlarmsList.innerHTML = '<li class="no-alarms">No alarms set</li>';
            return;
        }
        
        alarms.forEach(alarm => {
            const alarmElement = document.createElement('li');
            alarmElement.className = 'alarm-item';
            
            const timeString = `${alarm.hours.toString().padStart(2, '0')}:${alarm.minutes.toString().padStart(2, '0')}`;
            
            alarmElement.innerHTML = `
                <div class="alarm-time">${timeString}</div>
                <div class="alarm-name">${alarm.name}</div>
                <div class="alarm-repeat">${alarm.repeat ? 'Daily' : 'Once'}</div>
                <button class="delete-alarm" data-id="${alarm.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            activeAlarmsList.appendChild(alarmElement);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-alarm').forEach(button => {
            button.addEventListener('click', function() {
                const alarmId = parseInt(this.getAttribute('data-id'));
                deleteAlarm(alarmId);
            });
        });
    }
    
    function deleteAlarm(alarmId) {
        alarms = alarms.filter(alarm => alarm.id !== alarmId);
        saveAlarms();
        renderAlarms();
    }
    
    function saveAlarms() {
        localStorage.setItem('alarms', JSON.stringify(alarms));
    }
    
    function checkAlarms(now) {
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        
        alarms.forEach(alarm => {
            if (alarm.active && alarm.hours === currentHours && alarm.minutes === currentMinutes) {
                triggerAlarm(alarm);
                
                // If not repeating, deactivate alarm
                if (!alarm.repeat) {
                    alarm.active = false;
                    saveAlarms();
                    renderAlarms();
                }
            }
        });
    }
    
    function triggerAlarm(alarm) {
        // Play sound based on alarm setting
        alarmAudio.src = `assets/sounds/${alarm.sound}.mp3`;
        alarmAudio.play();
        
        // Show notification
        if (Notification.permission === 'granted') {
            new Notification(`Alarm: ${alarm.name}`, {
                body: `It's ${alarm.hours}:${alarm.minutes.toString().padStart(2, '0')}`,
                icon: 'assets/images/icon.png'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(`Alarm: ${alarm.name}`, {
                        body: `It's ${alarm.hours}:${alarm.minutes.toString().padStart(2, '0')}`,
                        icon: 'assets/images/icon.png'
                    });
                }
            });
        }
        
        // Show alert (fallback)
        alert(`ALARM: ${alarm.name}\nTime: ${alarm.hours}:${alarm.minutes.toString().padStart(2, '0')}`);
    }
});