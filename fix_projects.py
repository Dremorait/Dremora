import re

with open('c:\\xampp\\htdocs\\Dremora\\projects.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Currency Replacements using regex for ? followed by numbers
# E.g. ?2.4L, ?800, ?18,420
content = re.sub(r'\?(?=\d)', '₹', content)
# Special case for "Won ?"
content = content.replace('Won ? (3)', 'Won 🏆 (3)')

# Dashboard / Cafe specific
content = content.replace('BrewSpace POS ?', 'BrewSpace POS ☕')
content = content.replace('4.9?', '4.9★')
content = content.replace('4.8?', '4.8★')
content = content.replace('? BrewSpace — Koregaon Park, Pune', '📍 BrewSpace — Koregaon Park, Pune')
content = content.replace('? LIVE  Sunday', '🔴 LIVE  Sunday')
content = content.replace('??? Live Floor Plan', '🗺️ Live Floor Plan')
content = content.replace('?? Table 4 — Active', '🧾 Table 4 — Active')

# Emojis/Icons missing ??
content = content.replace('AgroTrack ??', 'AgroTrack 🌱')
content = content.replace('EduPro Coaching ??', 'EduPro Coaching 🎓')
content = content.replace('OrbitAgent ??', 'OrbitAgent 🤖')
content = content.replace('? 1h 24m remaining', '⏳ 1h 24m remaining')
content = content.replace('?? AIR Rank', '🏆 AIR Rank')
content = content.replace('?? 21', '🔥 21')

content = content.replace('?? Physics', '🧲 Physics')
content = content.replace('?? Chemistry', '🧪 Chemistry')
content = content.replace('?? Maths', '➗ Maths')

# Agent Names
content = content.replace('?? CodeReview Bot', '🔍 CodeReview Bot')
content = content.replace('?? Test-Gen AI', '🧪 Test-Gen AI')
content = content.replace('?? DocWriter', '📝 DocWriter')
content = content.replace('?? Deploy Guard', '🛡️ Deploy Guard')

# Status symbols
content = content.replace('? Running', '⚡ Running')
content = content.replace('? Idle', '💤 Idle')
content = content.replace('successful ? Zero downtime', 'successful ✅ Zero downtime')
content = content.replace('gap: /payment module 67% ? targeting', 'gap: /payment module 67% ⚠️ targeting')
content = content.replace('patterns ? 40% latency', 'patterns ⚡ 40% latency')

# Timeline icons replacements

# Citizen Complaints
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">Secure Auth</div>', '<div class="ts-icon">🔐</div><div class="ts-title">Secure Auth</div>')
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">Snap & Report</div>', '<div class="ts-icon">📸</div><div class="ts-title">Snap & Report</div>')
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">AI Routing</div>', '<div class="ts-icon">🤖</div><div class="ts-title">AI Routing</div>')
content = content.replace('<div class="ts-icon">???</div><div class="ts-title">Field Action</div>', '<div class="ts-icon">👷</div><div class="ts-title">Field Action</div>')
content = content.replace('<div class="ts-icon">?</div><div class="ts-title">Citizen Notified</div>', '<div class="ts-icon">🔔</div><div class="ts-title">Citizen Notified</div>')

# Lead Capture
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">Lead Capture</div>', '<div class="ts-icon">🎯</div><div class="ts-title">Lead Capture</div>')
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">Qualify</div>', '<div class="ts-icon">🧠</div><div class="ts-title">Qualify</div>')
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">Engage</div>', '<div class="ts-icon">⚡</div><div class="ts-title">Engage</div>')
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">Negotiate</div>', '<div class="ts-icon">🤝</div><div class="ts-title">Negotiate</div>')
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">Win & Retain</div>', '<div class="ts-icon">🏆</div><div class="ts-title">Win & Retain</div>')

# Soil Sensor
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">Soil Sensor</div>', '<div class="ts-icon">🌡️</div><div class="ts-title">Soil Sensor</div>')
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">MQTT Publish</div>', '<div class="ts-icon">📡</div><div class="ts-title">MQTT Publish</div>')
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">AI Analysis</div>', '<div class="ts-icon">🧠</div><div class="ts-title">AI Analysis</div>')
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">Valve Control</div>', '<div class="ts-icon">💧</div><div class="ts-title">Valve Control</div>')
content = content.replace('<div class="ts-icon">??</div><div class="ts-title">Farmer Alert</div>', '<div class="ts-icon">📱</div><div class="ts-title">Farmer Alert</div>')

# Multipliers & Dashes
content = content.replace('3Ã—', '3×')
content = content.replace('2Ã—', '2×')
content = content.replace('10Ã—', '10×')
content = content.replace('â€”', '—')
content = content.replace('Ã¢â‚¬â€œ', '—')
content = content.replace('â€“', '–')

with open('c:\\xampp\\htdocs\\Dremora\\projects.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Replacements done successfully!")
