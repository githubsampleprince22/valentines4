// Store messages for each flower
const flowerMessages = {
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: '',
    10: ''
};

// Load saved data from localStorage
function loadSavedData() {
    const savedMessages = localStorage.getItem('valentineFlowerMessages');
    if (savedMessages) {
        Object.assign(flowerMessages, JSON.parse(savedMessages));
        updateFlowerIndicators();
    }
}

// Save messages to localStorage
function saveMessages() {
    localStorage.setItem('valentineFlowerMessages', JSON.stringify(flowerMessages));
    updateFlowerIndicators();
}

// Update visual indicators for flowers with messages
function updateFlowerIndicators() {
    document.querySelectorAll('.flower').forEach(flower => {
        const flowerId = flower.getAttribute('data-flower');
        if (flowerMessages[flowerId] && flowerMessages[flowerId].trim() !== '') {
            flower.classList.add('has-message');
        } else {
            flower.classList.remove('has-message');
        }
    });
}


// Modal elements
const messageModal = document.getElementById('messageModal');
const viewModal = document.getElementById('viewModal');
const closeButtons = document.querySelectorAll('.close-btn');
const saveButton = document.getElementById('saveMessage');
const messageText = document.getElementById('messageText');
const charCount = document.getElementById('charCount');

let currentFlower = null;

// Rose titles for modal
const roseTitles = {
    1: 'Rose of Love',
    2: 'Rose of Joy',
    3: 'Rose of Happiness',
    4: 'Rose of Devotion',
    5: 'Rose of Passion',
    6: 'Rose of Beauty',
    7: 'Rose of Romance',
    8: 'Rose of Hope',
    9: 'Rose of Faith',
    10: 'Rose of Serenity'
};

// Flower click handlers
document.querySelectorAll('.flower').forEach(flower => {
    flower.addEventListener('click', () => {
        const flowerId = flower.getAttribute('data-flower');
        const flowerLabel = roseTitles[flowerId];
        currentFlower = flowerId;

        // Ensure music is playing when flower is clicked
        playBackgroundMusic();

        // Check if flower has a message
        if (flowerMessages[flowerId] && flowerMessages[flowerId].trim() !== '') {
            // Show view modal
            showViewModal(flowerLabel, flowerMessages[flowerId]);
        } else {
            // Show edit modal
            showEditModal(flowerLabel, flowerId);
        }
    });
});

// Show edit modal
function showEditModal(flowerLabel, flowerId) {
    document.getElementById('modalTitle').textContent = flowerLabel;
    messageText.value = flowerMessages[flowerId] || '';
    updateCharCount();
    messageModal.style.display = 'block';
}

// Show view modal
function showViewModal(flowerLabel, message) {
    document.getElementById('viewModalTitle').textContent = flowerLabel;
    document.getElementById('viewMessageText').textContent = message;
    viewModal.style.display = 'block';
}

// Character counter
messageText.addEventListener('input', updateCharCount);

function updateCharCount() {
    const count = messageText.value.length;
    charCount.textContent = count;

    if (count > 450) {
        charCount.style.color = '#d63384';
    } else {
        charCount.style.color = '#8b4789';
    }
}

// Save message
saveButton.addEventListener('click', () => {
    if (currentFlower) {
        flowerMessages[currentFlower] = messageText.value;
        saveMessages();
        messageModal.style.display = 'none';

        // Show success animation
        const flower = document.querySelector(`[data-flower="${currentFlower}"]`);
        flower.style.animation = 'none';
        setTimeout(() => {
            flower.style.animation = 'growFlower 0.5s ease-out';
        }, 10);
    }
});

// Close modals
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        messageModal.style.display = 'none';
        viewModal.style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === messageModal) {
        messageModal.style.display = 'none';
    }
    if (e.target === viewModal) {
        viewModal.style.display = 'none';
    }
});

// ✏️ Edit button — close view modal and open edit modal
document.getElementById('editMessageBtn')?.addEventListener('click', () => {
    viewModal.style.display = 'none';
    if (currentFlower) {
        const flowerLabel = roseTitles[currentFlower];
        showEditModal(flowerLabel, currentFlower);
    }
});

// 🗑️ Delete button — clear the message from this flower
document.getElementById('deleteMessageBtn')?.addEventListener('click', () => {
    if (currentFlower && confirm('Delete this message?')) {
        flowerMessages[currentFlower] = '';
        saveMessages();
        viewModal.style.display = 'none';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        messageModal.style.display = 'none';
        viewModal.style.display = 'none';
    }

    if (e.key === 'Enter' && e.ctrlKey && messageModal.style.display === 'block') {
        saveButton.click();
    }
});

// Add floating hearts animation
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.bottom = '-50px';
    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
    heart.style.opacity = '0.6';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '0';
    heart.style.transition = 'all 6s ease-in-out';

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.style.bottom = '110vh';
        heart.style.opacity = '0';
        heart.style.transform = `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`;
    }, 100);

    setTimeout(() => {
        heart.remove();
    }, 6000);
}

// Create hearts periodically
setInterval(createFloatingHeart, 3000);

// Photo upload functionality
document.querySelectorAll('.photo-input').forEach(input => {
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const slot = input.id.split('-')[1];
                const img = document.querySelector(`.uploaded-photo[data-slot="${slot}"]`);
                const label = document.querySelector(`label[for="${input.id}"]`);
                const photoSlot = input.closest('.photo-slot');

                img.src = event.target.result;
                img.style.display = 'block';
                label.style.display = 'none';
                // Add has-photo class so delete button shows on mobile
                if (photoSlot) photoSlot.classList.add('has-photo');

                // Save to localStorage
                localStorage.setItem(`valentinePhoto${slot}`, event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
});

// Load saved photos
for (let i = 1; i <= 4; i++) {
    const savedPhoto = localStorage.getItem(`valentinePhoto${i}`);
    if (savedPhoto) {
        const img = document.querySelector(`.uploaded-photo[data-slot="${i}"]`);
        const label = document.querySelector(`label[for="photo-${i}"]`);
        const photoSlot = document.querySelector(`#photo-${i}`)?.closest('.photo-slot');
        img.src = savedPhoto;
        img.style.display = 'block';
        label.style.display = 'none';
        // Add has-photo class so delete button shows on mobile
        if (photoSlot) photoSlot.classList.add('has-photo');
    }
}

// Delete photo functionality
document.querySelectorAll('.delete-photo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering file input
        const slot = btn.getAttribute('data-slot');

        // Confirm deletion
        if (confirm('Remove this photo?')) {
            // Clear the image
            const img = document.querySelector(`.uploaded-photo[data-slot="${slot}"]`);
            const label = document.querySelector(`label[for="photo-${slot}"]`);
            const input = document.getElementById(`photo-${slot}`);
            const photoSlot = btn.closest('.photo-slot');

            img.src = '';
            img.style.display = 'none';
            label.style.display = 'flex';
            input.value = ''; // Clear file input
            // Remove has-photo class so delete button hides on mobile
            if (photoSlot) photoSlot.classList.remove('has-photo');

            // Remove from localStorage
            localStorage.removeItem(`valentinePhoto${slot}`);
        }
    });
});

// Recipient name editing
const recipientName = document.getElementById('recipientName');
if (recipientName) {
    // Load saved name
    const savedName = localStorage.getItem('valentineRecipientName');
    if (savedName) {
        recipientName.textContent = savedName;
    }

    // Save on blur
    recipientName.addEventListener('blur', () => {
        localStorage.setItem('valentineRecipientName', recipientName.textContent);
    });

    // Save on Enter key
    recipientName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            recipientName.blur();
        }
    });
}

// Subtitle editing
const cardSubtitle = document.getElementById('cardSubtitle');
if (cardSubtitle) {
    // Load saved subtitle
    const savedSubtitle = localStorage.getItem('valentineSubtitle');
    if (savedSubtitle) {
        cardSubtitle.textContent = savedSubtitle;
    }

    // Save on blur
    cardSubtitle.addEventListener('blur', () => {
        localStorage.setItem('valentineSubtitle', cardSubtitle.textContent);
    });

    // Save on Enter key
    cardSubtitle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            cardSubtitle.blur();
        }
    });
}

// Background music functionality
const backgroundMusic = document.getElementById('backgroundMusic');

// Function to play background music
function playBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
            console.log('Autoplay prevented. Music will play on first user interaction.');
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();

    // Create initial hearts
    for (let i = 0; i < 5; i++) {
        setTimeout(createFloatingHeart, i * 600);
    }

    // Try to play music on page load
    playBackgroundMusic();

    // Fallback: play music on first user interaction
    const playOnInteraction = () => {
        playBackgroundMusic();
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
    };

    document.addEventListener('click', playOnInteraction, { once: true });
    document.addEventListener('touchstart', playOnInteraction, { once: true });
});

// ─── SAVE CARD: generates a fully self-contained shareable HTML file ───────
document.getElementById('saveCardBtn')?.addEventListener('click', () => {

    // 1. Collect photos from localStorage (base64 data URLs)
    const photos = {};
    for (let i = 1; i <= 4; i++) {
        const photo = localStorage.getItem(`valentinePhoto${i}`);
        if (photo) photos[i] = photo;
    }

    // 2. Collect messages and name
    const messages = { ...flowerMessages };
    const recipientName = document.getElementById('recipientName')?.textContent || 'For ';
    const subtitle = document.getElementById('cardSubtitle')?.textContent || 'Click each rose to reveal a message from my heart';

    // 3. Warn if nothing added
    const hasPhotos = Object.keys(photos).length > 0;
    const hasMessages = Object.values(messages).some(m => m && m.trim() !== '');
    if (!hasPhotos && !hasMessages) {
        alert('⚠️ Please add some photos and messages first before saving!');
        return;
    }

    try {
        // 4. Build photo slot HTML (view-only, no upload inputs)
        function buildPhotoSlot(position, slot) {
            const src = photos[slot];
            if (src) {
                return `<div class="photo-slot has-photo" data-position="${position}"><img class="uploaded-photo" data-slot="${slot}" src="${src}" style="display:block;"></div>`;
            }
            return `<div class="photo-slot empty-slot" data-position="${position}"></div>`;
        }

        // 5. Build flower HTML with message baked into data-message attribute
        function buildFlower(num) {
            const msg = (messages[num] || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const hasMsg = (messages[num] || '').trim() !== '';
            return `<div class="flower${hasMsg ? ' has-message' : ''}" data-flower="${num}" data-message="${msg}">
                    <div class="flower-bloom rose rose-${num}">
                        <div class="petal"></div><div class="petal"></div><div class="petal"></div>
                        <div class="petal"></div><div class="petal"></div><div class="center"></div>
                    </div>
                    <div class="flower-stem"><div class="leaf"></div></div>
                </div>`;
        }

        // 6. Assemble the full shareable HTML
        const inlineCSS = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Poppins',sans-serif;background:linear-gradient(135deg,#f5e6e8 0%,#e8d5d8 100%);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.container{max-width:1200px;width:100%}.card{background:rgba(255,255,255,0.5);border-radius:20px;padding:60px 40px;text-align:center;position:relative}.card-header{margin-bottom:60px}.main-title{font-family:'Playfair Display',serif;font-size:3.5rem;color:#7d4f50;margin-bottom:15px}.subtitle{font-family:'Playfair Display',serif;font-size:1.1rem;color:#8b6b6d;font-style:italic}.photo-upload-section{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10}.photo-slot{position:absolute;width:180px;height:180px;pointer-events:all;border-radius:15px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,0.1);background:rgba(255,255,255,0.8);border:3px dashed rgba(125,79,80,0.3);transition:all 0.3s ease}.photo-slot.empty-slot{display:none!important}.photo-slot.has-photo{border:none}.photo-slot[data-position="top-left"]{top:20px;left:20px}.photo-slot[data-position="top-right"]{top:20px;right:20px}.photo-slot[data-position="bottom-left"]{bottom:20px;left:20px}.photo-slot[data-position="bottom-right"]{bottom:20px;right:20px}.uploaded-photo{width:100%;height:100%;object-fit:cover;display:block}.flowers-container{display:flex;justify-content:center;align-items:flex-end;gap:15px;margin:0 auto;max-width:900px}.flower{display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:transform 0.3s ease;position:relative}.flower:hover{transform:translateY(-15px)}.flower-stem{width:4px;height:120px;background:linear-gradient(to bottom,#4a7c59,#2d5a3d);border-radius:2px;position:relative}.leaf{position:absolute;width:20px;height:12px;background:#5a8c5a;border-radius:50% 0 50% 0;top:40%;left:-8px;transform:rotate(-30deg)}.flower-bloom{position:relative;width:50px;height:50px;margin-bottom:5px}.rose .petal{position:absolute;width:20px;height:25px;border-radius:50% 50% 50% 0;transform-origin:bottom left}.rose .petal:nth-child(1){transform:rotate(0deg) translate(15px,0)}.rose .petal:nth-child(2){transform:rotate(72deg) translate(15px,0)}.rose .petal:nth-child(3){transform:rotate(144deg) translate(15px,0)}.rose .petal:nth-child(4){transform:rotate(216deg) translate(15px,0)}.rose .petal:nth-child(5){transform:rotate(288deg) translate(15px,0)}.rose .center{position:absolute;width:18px;height:18px;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%)}.rose-1 .petal{background:radial-gradient(ellipse at center,#a85860,#8b4650)}.rose-1 .center{background:radial-gradient(circle,#c97680,#a85860)}.rose-2 .petal{background:radial-gradient(ellipse at center,#9d5a68,#7d4a58)}.rose-2 .center{background:radial-gradient(circle,#b76878,#9d5a68)}.rose-3 .petal{background:radial-gradient(ellipse at center,#b86070,#985060)}.rose-3 .center{background:radial-gradient(circle,#d27888,#b86070)}.rose-4 .petal{background:radial-gradient(ellipse at center,#a05565,#804555)}.rose-4 .center{background:radial-gradient(circle,#ba6d7d,#a05565)}.rose-5 .petal{background:radial-gradient(ellipse at center,#8d4e5c,#6d3e4c)}.rose-5 .center{background:radial-gradient(circle,#a76674,#8d4e5c)}.rose-6 .petal{background:radial-gradient(ellipse at center,#b25868,#924858)}.rose-6 .center{background:radial-gradient(circle,#cc7080,#b25868)}.rose-7 .petal{background:radial-gradient(ellipse at center,#955260,#754250)}.rose-7 .center{background:radial-gradient(circle,#af6a78,#955260)}.rose-8 .petal{background:radial-gradient(ellipse at center,#a65a6a,#864a5a)}.rose-8 .center{background:radial-gradient(circle,#c07282,#a65a6a)}.rose-9 .petal{background:radial-gradient(ellipse at center,#8f5062,#6f4052)}.rose-9 .center{background:radial-gradient(circle,#a9687a,#8f5062)}.rose-10 .petal{background:radial-gradient(ellipse at center,#9e5466,#7e4456)}.rose-10 .center{background:radial-gradient(circle,#b86c7e,#9e5466)}.flower.has-message::after{content:'✉️';position:absolute;top:-5px;right:-5px;font-size:1.2rem;animation:bounce 2s infinite}.modal{display:none;position:fixed;z-index:1000;left:0;top:0;width:100%;height:100%;background-color:rgba(0,0,0,0.6);backdrop-filter:blur(5px);animation:fadeIn 0.3s ease-out}.modal-content{background:linear-gradient(135deg,#fff 0%,#f5e6e8 100%);margin:10% auto;padding:40px;border-radius:20px;width:90%;max-width:500px;box-shadow:0 20px 60px rgba(125,79,80,0.4);animation:slideDown 0.3s ease-out;position:relative}.close-btn{position:absolute;right:20px;top:20px;font-size:2rem;font-weight:bold;color:#7d4f50;cursor:pointer;transition:all 0.3s ease;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:50%}.close-btn:hover{background:rgba(125,79,80,0.1);transform:rotate(90deg)}.view-modal-header h2{font-family:'Playfair Display',serif;color:#7d4f50;margin-bottom:20px;font-size:1.8rem}.view-modal-body p{font-family:'Poppins',sans-serif;font-size:1.1rem;line-height:1.8;color:#333;padding:20px;background:rgba(255,255,255,0.7);border-radius:10px;min-height:100px}#recipientName{pointer-events:none;user-select:none}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideDown{from{opacity:0;transform:translateY(-50px)}to{opacity:1;transform:translateY(0)}}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@media(max-width:768px){body{padding:10px;align-items:flex-start}.card{padding:30px 15px}.main-title{font-size:2rem}.flowers-container{gap:8px;flex-wrap:wrap;justify-content:center}.flower-bloom{width:40px;height:40px}.flower-stem{height:90px}}@media(max-width:600px){body{padding:8px;align-items:flex-start}.container{width:100%}.card{display:flex;flex-direction:column;align-items:center;padding:15px 10px;border-radius:12px;gap:15px;position:static}.photo-upload-section{position:static!important;width:100%;height:auto;pointer-events:all;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:8px;order:1}.photo-slot{position:relative!important;width:100%!important;height:140px!important;border-radius:10px;top:auto!important;left:auto!important;right:auto!important;bottom:auto!important}.photo-slot[data-position=top-left]{grid-column:1;grid-row:1}.photo-slot[data-position=top-right]{grid-column:2;grid-row:1}.photo-slot[data-position=bottom-left]{grid-column:1;grid-row:2}.photo-slot[data-position=bottom-right]{grid-column:2;grid-row:2}.card-header{order:2;margin-bottom:0;width:100%;text-align:center}.main-title{font-size:1.6rem;line-height:1.2}.subtitle{font-size:0.82rem;line-height:1.5}.flowers-container{order:3;display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:5px;width:100%;max-width:100%;margin:0}.flower{flex:0 0 calc(20% - 5px);max-width:52px}.flower-bloom{width:34px;height:34px}.flower-stem{width:3px;height:65px}.leaf{width:14px;height:9px}.rose .petal{width:14px;height:18px}.rose .petal:nth-child(1){transform:rotate(0deg) translate(9px,0)}.rose .petal:nth-child(2){transform:rotate(72deg) translate(9px,0)}.rose .petal:nth-child(3){transform:rotate(144deg) translate(9px,0)}.rose .petal:nth-child(4){transform:rotate(216deg) translate(9px,0)}.rose .petal:nth-child(5){transform:rotate(288deg) translate(9px,0)}.rose .center{width:12px;height:12px}.modal-content{margin:3% auto;padding:18px 14px;width:95%;border-radius:14px}.view-modal-header h2{font-size:1.15rem}.view-modal-body p{font-size:0.9rem;padding:12px}.close-btn{font-size:1.5rem;width:32px;height:32px;right:10px;top:10px}}`;

        const shareableHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Valentine's Greeting Card</title>
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:wght@400;600&family=Poppins:wght@300;400;500&display=swap" rel="stylesheet">
    <style>${inlineCSS}</style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="photo-upload-section">
                ${buildPhotoSlot('top-left', 1)}
                ${buildPhotoSlot('top-right', 2)}
                ${buildPhotoSlot('bottom-left', 3)}
                ${buildPhotoSlot('bottom-right', 4)}
            </div>
            <div class="card-header">
                <h1 class="main-title" id="recipientName">${recipientName}</h1>
                <p class="subtitle">${subtitle}</p>
            </div>
            <div class="flowers-container">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(buildFlower).join('\n                ')}
            </div>
        </div>
    </div>

    <div class="modal" id="viewModal">
        <div class="modal-content view-content">
            <span class="close-btn view-close">&times;</span>
            <div class="view-modal-header"><h2 id="viewModalTitle"></h2></div>
            <div class="view-modal-body"><p id="viewMessageText"></p></div>
        </div>
    </div>

    <audio id="backgroundMusic" loop>
        <source src="ed.mp3" type="audio/mpeg">
    </audio>

    <script>
    // All data is embedded in the HTML — no localStorage needed
    const roseTitles = {
        1:'Rose of Love',2:'Rose of Joy',3:'Rose of Happiness',4:'Rose of Devotion',
        5:'Rose of Passion',6:'Rose of Beauty',7:'Rose of Romance',8:'Rose of Hope',
        9:'Rose of Faith',10:'Rose of Serenity'
    };

    const viewModal = document.getElementById('viewModal');

    // Flower clicks — read message from data-message attribute
    document.querySelectorAll('.flower').forEach(flower => {
        flower.addEventListener('click', () => {
            const id = flower.getAttribute('data-flower');
            const msg = flower.getAttribute('data-message') || '';
            playMusic();
            if (msg.trim()) {
                document.getElementById('viewModalTitle').textContent = roseTitles[id];
                document.getElementById('viewMessageText').textContent = msg;
                viewModal.style.display = 'block';
            }
        });
    });

    // Close modal
    document.querySelector('.view-close').addEventListener('click', () => viewModal.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === viewModal) viewModal.style.display = 'none'; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') viewModal.style.display = 'none'; });

    // Floating hearts
    function createFloatingHeart() {
        const h = document.createElement('div');
        h.textContent = '❤️';
        h.style.cssText = 'position:fixed;pointer-events:none;z-index:0;opacity:0.6;transition:all 6s ease-in-out;';
        h.style.left = Math.random() * 100 + 'vw';
        h.style.bottom = '-50px';
        h.style.fontSize = (Math.random() * 20 + 10) + 'px';
        document.body.appendChild(h);
        setTimeout(() => {
            h.style.bottom = '110vh'; h.style.opacity = '0';
            h.style.transform = 'translateX(' + ((Math.random()-0.5)*200) + 'px) rotate(' + (Math.random()*360) + 'deg)';
        }, 100);
        setTimeout(() => h.remove(), 6000);
    }
    setInterval(createFloatingHeart, 3000);
    for (let i = 0; i < 5; i++) setTimeout(createFloatingHeart, i * 600);

    // Music
    const bgMusic = document.getElementById('backgroundMusic');
    function playMusic() { bgMusic && bgMusic.play().catch(() => {}); }
    const once = () => { playMusic(); };
    document.addEventListener('click', once, { once: true });
    document.addEventListener('touchstart', once, { once: true });
    playMusic();
    <\/script>
</body>
</html>`;

        // 7. Download as index.html
        const blob = new Blob([shareableHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert(`✅ Card saved!\n\n📋 HOW TO SHARE:\nOption 1 — Send the file directly:\n  • Find "index.html" in your Downloads folder\n  • Send it to her via Messenger, email, or any app\n  • She opens it on her phone — done! 🌹\n\nOption 2 — Share via GitHub Pages link:\n  • Upload the downloaded "index.html" to your GitHub repo (replace the old one)\n  • Send her the GitHub Pages link\n\nThe file works on ANY device without internet! 💕`);

    } catch (error) {
        console.error('Save error:', error);
        alert('❌ Something went wrong. Please try again.');
    }
});
