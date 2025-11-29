/* =========================================
   1. DATA DUMMY (DATABASE PROMPT)
   ========================================= */
const galleryData = [
    // --- GAMBAR (IMAGES) ---
    { 
        id: 1, 
        title: "Neon Cyber Samurai", 
        category: "cloud", 
        model: "Midjourney v6", 
        type: "image", 
        image: "https://images.unsplash.com/photo-1620641788421-7f1c338e420c?q=80&w=1000&auto=format&fit=crop", 
        prompt: "A futuristic samurai standing in neon rain, cyberpunk city background, highly detailed, 8k resolution, cinematic lighting --ar 16:9" 
    },
    { 
        id: 2, 
        title: "Realistic Portrait LoRA", 
        category: "local", 
        model: "Stable Diffusion XL", 
        type: "image", 
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop", 
        prompt: "Photo of a young woman, natural skin texture, soft lighting, shot on 35mm lens, f/1.8, bokeh background, hyperrealistic" 
    },
    { 
        id: 3, 
        title: "Space Exploration", 
        category: "cloud", 
        model: "DALL-E 3", 
        type: "image", 
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop", 
        prompt: "Astronaut floating in deep space, nebula background, digital art, vibrant colors, sci-fi concept" 
    },
    { 
        id: 4, 
        title: "Fantasy Landscape", 
        category: "local", 
        model: "ComfyUI + SD 1.5", 
        type: "image", 
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto-format&fit=crop", 
        prompt: "Epic fantasy landscape, floating islands, waterfalls, magical atmosphere, matte painting style, artstation trends" 
    },
    { 
        id: 5, 
        title: "Cyberpunk City", 
        category: "cloud", 
        model: "Midjourney v5", 
        type: "image", 
        image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1000&auto-format&fit=crop", 
        prompt: "Futuristic city skyline at night, flying cars, neon signs, rainy streets, blade runner vibe" 
    },
    { 
        id: 6, 
        title: "Anime Style ControlNet", 
        category: "local", 
        model: "SDXL + ControlNet", 
        type: "image", 
        image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto-format&fit=crop", 
        prompt: "Anime style illustration, girl running with toast in mouth, school uniform, morning sunlight, makoto shinkai style" 
    },

    // --- VIDEO (FILE LOKAL DI GITHUB) ---
    { 
        id: 7, 
        title: "Ocean Drone Shot", 
        category: "cloud", 
        model: "Sora", 
        type: "video", 
        // Pastikan file ini ada di repo GitHub kamu
        videoUrl: "vidio1.mp4", 
        prompt: "Aerial drone shot of crashing waves on a rocky cliff, sunset lighting, 4k resolution, smooth motion" 
    },
    { 
        id: 8, 
        title: "Abstract Fluid Art", 
        category: "cloud", 
        model: "Runway Gen-2", 
        type: "video", 
        videoUrl: "vidio2.mp4", 
        prompt: "Liquid colors swirling and mixing, ink in water, slow motion, macro shot, vibrant colors, abstract art" 
    },
    { 
        id: 9, 
        title: "Timelapse City", 
        category: "cloud", 
        model: "Pika Labs", 
        type: "video", 
        videoUrl: "vidio3.mp4", 
        prompt: "Timelapse of city traffic at night, light trails, busy street, hyperlapse style" 
    },
    { 
        id: 10, 
        title: "Forest Morning", 
        category: "local", 
        model: "AnimateDiff", 
        type: "video", 
        videoUrl: "vidio4.mp4", 
        prompt: "Peaceful morning in a forest, sunbeams through trees, slight wind moving leaves, cinematic 4k" 
    }
];

/* =========================================
   2. GLOBAL VARIABLES & INIT
   ========================================= */
let currentData = [...galleryData]; 
let currentIndex = 0;
let favorites = JSON.parse(localStorage.getItem('favPrompts')) || [];
let isDarkMode = localStorage.getItem('theme') !== 'light';

window.onload = () => { 
    applyTheme(); 
    showPage('home'); 
    animateStats(); 
    renderGallery(galleryData); 
};

/* =========================================
   3. SCROLL TO TOP
   ========================================= */
window.onscroll = function() { scrollFunction() };

function scrollFunction() {
    const btn = document.getElementById("scrollTopBtn");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

/* =========================================
   4. THEME TOGGLE
   ========================================= */
function toggleTheme() { 
    isDarkMode = !isDarkMode; 
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); 
    applyTheme(); 
}

function applyTheme() {
    const icon = document.getElementById('themeIcon');
    if(isDarkMode) { 
        document.body.classList.remove('light-mode'); 
        icon.className = 'fas fa-moon'; 
    } else { 
        document.body.classList.add('light-mode'); 
        icon.className = 'fas fa-sun'; 
    }
}

/* =========================================
   5. NAVIGATION
   ========================================= */
function showPage(pageId) {
    window.scrollTo({top:0, behavior:'smooth'});
    
    document.querySelectorAll('.main-page-content').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId + '-page').classList.add('active');
    
    // Logic untuk tombol teks maupun ikon
    document.querySelectorAll('.page-nav-btn, .icon-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`button[onclick="showPage('${pageId}')"]`);
    if(btn) btn.classList.add('active');
    
    if(pageId==='home') resetFilter();
}

/* =========================================
   6. GALLERY & CARD RENDERING (FIXED VIDEO)
   ========================================= */
function scrollGallery(id, val) {
    document.getElementById(id).scrollBy({ left: val, behavior: 'smooth' });
}

function renderGallery(data) {
    const imageGrid = document.getElementById('imageGrid');
    const videoGrid = document.getElementById('videoGrid');
    
    imageGrid.innerHTML = ''; 
    videoGrid.innerHTML = '';
    
    const images = data.filter(i => i.type === 'image');
    const videos = data.filter(i => i.type === 'video');
    
    if(images.length > 0) {
        document.getElementById('imageSectionContainer').style.display='block';
        images.forEach(item => imageGrid.appendChild(createCard(item)));
    } else {
        document.getElementById('imageSectionContainer').style.display='none';
    }

    if(videos.length > 0) {
        document.getElementById('videoSectionContainer').style.display='block';
        videos.forEach(item => videoGrid.appendChild(createCard(item)));
    } else {
        document.getElementById('videoSectionContainer').style.display='none';
    }

    if(images.length===0 && videos.length===0) {
        document.getElementById('emptyState').style.display='block';
    } else {
        document.getElementById('emptyState').style.display='none';
    }
}

function createCard(item) {
    const badgeClass = item.category==='cloud'?'badge-cloud':'badge-local';
    const badgeText = item.category==='cloud'?'CLOUD':'LOCAL';
    const isFav = favorites.includes(item.id);
    const favClass = isFav ? 'active' : '';
    
    // --- LOGIKA THUMBNAIL (VIDEO AUTOPLAY) ---
    let mediaContent = '';
    if (item.type === 'video') {
        // Autoplay, Muted, Loop = Video bergerak sendiri tanpa suara
        mediaContent = `<video src="${item.videoUrl}" class="gallery-img" autoplay muted loop playsinline></video>`;
    } else {
        // Gambar Biasa
        mediaContent = `<img src="${item.image}" class="gallery-img" loading="lazy">`;
    }
    
    const div = document.createElement('div'); 
    div.className = 'gallery-item';
    
    div.innerHTML = `
        ${mediaContent}
        <div class="badge-model" style="background:var(--accent-${item.category==='cloud'?'cloud':'offline'})">${badgeText}</div>
        <button class="btn-fav ${favClass}" onclick="toggleFavorite(event, ${item.id})">
            <i class="fas fa-heart"></i>
        </button>
        <div class="item-content">
            <div class="item-title">${item.title}</div>
            <div class="item-preview">${item.prompt}</div>
            <div class="item-model"><i class="fas fa-bolt"></i> ${item.model}</div>
        </div>
    `;
    
    div.onclick = (e) => { 
        if(!e.target.closest('.btn-fav')) openModal(item); 
    };
    
    return div;
}

/* =========================================
   7. FILTER & SEARCH
   ========================================= */
function filterByModel(cat, el) {
    document.querySelectorAll('.model-card').forEach(c=>c.classList.remove('active')); 
    if(el) el.classList.add('active');
    
    currentData = galleryData.filter(i=>i.category===cat); 
    renderGallery(currentData);
}

function resetFilter() {
    document.querySelectorAll('.model-card').forEach(c=>c.classList.remove('active')); 
    document.getElementById('searchInput').value='';
    currentData=[...galleryData]; 
    renderGallery(currentData);
}

function showOnlyFavorites() {
    currentData = galleryData.filter(i => favorites.includes(i.id)); 
    renderGallery(currentData);
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    const t = e.target.value.toLowerCase();
    currentData = galleryData.filter(i => i.title.toLowerCase().includes(t) || i.prompt.toLowerCase().includes(t));
    renderGallery(currentData);
});

/* =========================================
   8. FAVORITES
   ========================================= */
function toggleFavorite(e, id) {
    e.stopPropagation();
    if(favorites.includes(id)) {
        favorites = favorites.filter(fid=>fid!==id); 
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favPrompts', JSON.stringify(favorites));
    document.getElementById('statFavorites').innerText = favorites.length;
    const btn = e.currentTarget; 
    btn.classList.toggle('active');
}

/* =========================================
   9. MODAL POPUP
   ========================================= */
const modal = document.getElementById('detailModal');

function openModal(item) {
    currentIndex = currentData.indexOf(item); 
    updateModal(item); 
    modal.classList.add('active'); 
    document.addEventListener('keydown', handleKey);
}

function updateModal(item) {
    document.getElementById('modalTitle').innerText = item.title;
    document.getElementById('modalPrompt').innerText = item.prompt;
    document.getElementById('modalModelDetail').innerHTML = `<i class="fas fa-layer-group"></i> Model: <strong>${item.model}</strong>`;

    const badge = document.getElementById('modalBadge');
    if (item.category === 'cloud') {
        badge.innerText = 'PUBLIC CLOUD AI';
        badge.style.background = 'var(--accent-cloud)';
        badge.style.color = '#ffffff';
    } else {
        badge.innerText = 'OFFLINE / LOCAL AI';
        badge.style.background = 'var(--accent-offline)';
        badge.style.color = '#000000';
    }

    const container = document.getElementById('mediaContainer');
    if (item.type === 'video') {
        // Kontrol lengkap untuk modal popup
        container.innerHTML = `<video src="${item.videoUrl}" controls autoplay loop style="max-width:100%; max-height:100%;"></video>`;
    } else {
        container.innerHTML = `<img src="${item.image}" style="max-width:100%; max-height:100%; object-fit:contain;">`;
    }
}

function changeImage(dir) {
    currentIndex += dir; 
    if(currentIndex < 0) currentIndex = currentData.length-1; 
    if(currentIndex >= currentData.length) currentIndex = 0;
    updateModal(currentData[currentIndex]);
}

function handleKey(e) { 
    if(e.key==='ArrowLeft') changeImage(-1); 
    if(e.key==='ArrowRight') changeImage(1); 
    if(e.key==='Escape') closeModal(); 
}

function closeModal() { 
    modal.classList.remove('active'); 
    document.removeEventListener('keydown', handleKey); 
    document.getElementById('mediaContainer').innerHTML=''; 
}

/* =========================================
   10. MODAL SPEK PC
   ========================================= */
const sysReq = document.getElementById('sysReqModal');
function openSysReqModal() { sysReq.classList.add('active'); }
function closeSysReqModal() { sysReq.classList.remove('active'); }

window.onclick = (e) => { 
    if(e.target===modal) closeModal(); 
    if(e.target===sysReq) closeSysReqModal(); 
}

/* =========================================
   11. ANIMASI STATS
   ========================================= */
function animateStats() {
    document.querySelectorAll('.stat-number').forEach(el => {
        if(el.id === 'statFavorites') {
            el.innerText = favorites.length;
            return;
        }
        const target = +el.getAttribute('data-target');
        let current = 0;
        const increment = Math.ceil(target / 50);
        const timer = setInterval(() => {
            current += increment;
            if(current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.innerText = current;
        }, 30);
    });
}

/* =========================================
   12. UTILS
   ========================================= */
function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMessage').innerText = msg;
    t.classList.add('show'); 
    setTimeout(()=>t.classList.remove('show'), 3000);
}
function copyPrompt() { navigator.clipboard.writeText(document.getElementById('modalPrompt').innerText); showToast('Disalin!'); }
function simulateDownload() { showToast('Mengunduh...'); }
function handleContactSubmit(e) { e.preventDefault(); showToast('Pesan Terkirim!'); e.target.reset(); }
function handleReviewSubmit(e) { e.preventDefault(); showToast('Review Terkirim!'); e.target.reset(); }
function handleFeedbackSubmit(e) { e.preventDefault(); showToast('Masukan diterima!'); e.target.reset(); }
