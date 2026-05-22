document.addEventListener('DOMContentLoaded', function() {
    
    // ========== ЛЕПЕСТКИ САКУРЫ ==========
    const petalsContainer = document.getElementById('petalsContainer');
    const petalShapes = ['🌸', '💮', '✿', '🌺'];
    const petalColors = [
        '#ffb7c5', '#ffccd5', '#ffd1dc', '#ffe0e6', 
        '#ffc0cb', '#f8bbd0', '#fbd5e0', '#fde4ec'
    ];
    
    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        const shape = petalShapes[Math.floor(Math.random() * petalShapes.length)];
        const size = Math.random() * 18 + 12;
        const leftPos = Math.random() * 100;
        const duration = Math.random() * 8 + 10;
        const delay = Math.random() * 5;
        const rotation = Math.random() * 360;
        
        petal.textContent = shape;
        petal.style.cssText = `
            left: ${leftPos}%;
            font-size: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            transform: rotate(${rotation}deg);
            color: ${petalColors[Math.floor(Math.random() * petalColors.length)]};
        `;
        
        petalsContainer.appendChild(petal);
        
        setTimeout(() => {
            if (petal.parentNode) {
                petal.remove();
            }
        }, (duration + delay) * 1000 + 500);
    }
    
    // Создаём лепестки с интервалом
    function startPetals() {
        // Начальные лепестки
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createPetal(), i * 600);
        }
        // Регулярное создание
        setInterval(() => {
            if (document.querySelectorAll('.petal').length < 20) {
                createPetal();
            }
        }, 2000);
    }
    
    startPetals();
    
    // ========== ЭКРАНЫ ==========
    const lockScreen = document.getElementById('lockScreen');
    const heartScreen = document.getElementById('heartScreen');
    const letterScreen = document.getElementById('letterScreen');
    
    const codeDisplay = document.getElementById('codeDisplay');
    const lockWrapper = document.getElementById('lockWrapper');
    const numButtons = document.querySelectorAll('.num-btn');
    const lockContainer = document.querySelector('.lock-container');
    
    const bigHeart = document.getElementById('bigHeart');
    const backToHeartBtn = document.getElementById('backToHeartBtn');
    
    let currentCode = '';
    const correctCode = '1001';
    const maxDigits = 4;
    
    updateDisplay();
    
    // ========== КНОПКИ ЗАМКА ==========
    numButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.num;
            
            if (action === 'clear') {
                currentCode = '';
                updateDisplay();
            } else if (action === 'enter') {
                checkCode();
            } else {
                if (currentCode.length < maxDigits) {
                    currentCode += action;
                    updateDisplay();
                    
                    if (currentCode.length === maxDigits) {
                        setTimeout(checkCode, 300);
                    }
                }
            }
        });
    });
    
    function updateDisplay() {
        let displayText = currentCode;
        while (displayText.length < maxDigits) {
            displayText += '0';
        }
        codeDisplay.textContent = displayText;
    }
    
    function checkCode() {
        if (currentCode === correctCode) {
            unlockLock();
        } else {
            shakeLock();
            
            if (currentCode.length === maxDigits) {
                setTimeout(() => {
                    currentCode = '';
                    updateDisplay();
                }, 500);
            }
        }
    }
    
    function shakeLock() {
        lockContainer.classList.add('shake');
        codeDisplay.style.color = '#ff1744';
        codeDisplay.style.textShadow = '0 0 15px rgba(255, 23, 68, 0.6)';
        
        setTimeout(() => {
            lockContainer.classList.remove('shake');
            codeDisplay.style.color = '#e91e63';
            codeDisplay.style.textShadow = '0 0 15px rgba(233, 30, 99, 0.4)';
        }, 500);
    }
    
    function unlockLock() {
        codeDisplay.style.color = '#f48fb1';
        codeDisplay.style.textShadow = '0 0 20px rgba(244, 143, 177, 0.8)';
        
        // Усиливаем лепестки при открытии
        for (let i = 0; i < 15; i++) {
            setTimeout(() => createPetal(), i * 100);
        }
        
        setTimeout(() => {
            lockWrapper.classList.add('unlocking');
            
            setTimeout(() => {
                lockScreen.classList.remove('active');
                heartScreen.classList.add('active');
                
                const heartContainer = document.getElementById('heartContainer');
                heartContainer.style.animation = 'none';
                heartContainer.offsetHeight;
                heartContainer.style.animation = 'heartAppear 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                
                setTimeout(() => {
                    lockWrapper.classList.remove('unlocking');
                    currentCode = '';
                    updateDisplay();
                    codeDisplay.style.color = '#e91e63';
                    codeDisplay.style.textShadow = '0 0 15px rgba(233, 30, 99, 0.4)';
                }, 1500);
                
            }, 1000);
        }, 300);
    }
    
    // ========== НАЖАТИЕ НА СЕРДЦЕ ==========
    bigHeart.addEventListener('click', function() {
        bigHeart.style.transform = 'scale(0.8)';
        bigHeart.style.filter = 'drop-shadow(0 0 55px rgba(233, 30, 99, 0.9))';
        
        // Всплеск лепестков
        for (let i = 0; i < 12; i++) {
            setTimeout(() => createPetal(), i * 80);
        }
        
        setTimeout(() => {
            heartScreen.classList.remove('active');
            letterScreen.classList.add('active');
            
            letterScreen.scrollIntoView({ behavior: 'smooth' });
            
            bigHeart.style.transform = '';
            bigHeart.style.filter = '';
        }, 400);
    });
    
    // ========== КНОПКА НАЗАД ==========
    backToHeartBtn.addEventListener('click', function() {
        letterScreen.classList.remove('active');
        heartScreen.classList.add('active');
        
        const heartContainer = document.getElementById('heartContainer');
        heartContainer.style.animation = 'none';
        heartContainer.offsetHeight;
        heartContainer.style.animation = 'heartAppear 0.8s ease';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // ========== КЛАВИАТУРА ==========
    document.addEventListener('keydown', function(e) {
        if (!lockScreen.classList.contains('active')) return;
        
        if (e.key >= '0' && e.key <= '9') {
            if (currentCode.length < maxDigits) {
                currentCode += e.key;
                updateDisplay();
                
                if (currentCode.length === maxDigits) {
                    setTimeout(checkCode, 300);
                }
            }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            currentCode = '';
            updateDisplay();
        } else if (e.key === 'Enter') {
            checkCode();
        }
    });
    
    // ========== ЗАГРУЗКА ФОТО ==========
    function tryLoadPhoto() {
        const photo = document.getElementById('ourPhoto');
        const placeholder = document.getElementById('photoPlaceholder');
        
        photo.onerror = function() {
            photo.style.display = 'none';
            placeholder.style.display = 'flex';
        };
        
        photo.onload = function() {
            photo.style.display = 'block';
            placeholder.style.display = 'none';
        };
        
        if (!photo.src || photo.src === window.location.href || photo.src.endsWith('our-photo.jpg')) {
            if (photo.naturalWidth === 0) {
                photo.style.display = 'none';
                placeholder.style.display = 'flex';
            }
        }
    }
    
    setTimeout(tryLoadPhoto, 100);
    
    console.log('💖 Для Сони. Код: 1001');
});