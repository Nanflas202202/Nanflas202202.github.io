document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. 开屏动画 ---
    const introLayer = document.getElementById('intro-layer');
    const introImg = document.querySelector('.intro-img');

    setTimeout(() => { introImg.classList.add('visible'); }, 100);
    setTimeout(() => { introLayer.classList.add('fade-out'); }, 2500); 
    setTimeout(() => { introLayer.style.display = 'none'; }, 3500);

    // --- 1. 时间 ---
    function updateTime() {
        const now = new Date();
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        
        const dateStr = now.getFullYear() + '/' + 
                        String(now.getMonth() + 1).padStart(2, '0') + '/' + 
                        String(now.getDate()).padStart(2, '0');
        
        const timeStr = String(now.getHours()).padStart(2, '0') + ':' + 
                        String(now.getMinutes()).padStart(2, '0');
        
        document.getElementById('day-display').innerText = dateStr;
        document.getElementById('weekday-display').innerText = days[now.getDay()];
        document.getElementById('time-display').innerText = timeStr;
    }
    setInterval(updateTime, 1000);
    updateTime();

    // --- 2. 轮播 ---
    const items = document.querySelectorAll('.project-item');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    const intervalTime = 6000;

    function showSlide(index) {
        items.forEach(item => item.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        items[index].classList.add('active');
        if(dots[index]) dots[index].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        showSlide(currentIndex);
    }

    let slideInterval = setInterval(nextSlide, intervalTime);

    const projBox = document.getElementById('project-box');
    projBox.addEventListener('mouseenter', () => clearInterval(slideInterval));
    projBox.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, intervalTime));

    // --- 3. 立绘系统 (核心修改) ---
    
    // 图片列表
    const charList = ['char1.png', 'char2.png', 'char3.png'];
    const charImg = document.getElementById('char-img');
    let charIndex = 0; // 当前立绘索引

    // 切换立绘函数
    function switchCharacter(index) {
        // 索引越界处理
        if(index >= charList.length) index = 0;
        if(index < 0) index = charList.length - 1;
        
        charIndex = index;
        const newSrc = charList[charIndex];

        // 切换动画
        charImg.style.opacity = 0;
        setTimeout(() => {
            charImg.src = newSrc;
            charImg.onload = () => { charImg.style.opacity = 1; };
        }, 200);
    }

    // 事件A：键盘数字键切换
    document.addEventListener('keydown', (e) => {
        const key = parseInt(e.key);
        if (!isNaN(key) && key > 0 && key <= charList.length) {
            switchCharacter(key - 1);
        }
    });

    // 事件B：左键点击立绘切换下一张
    const charWrapper = document.querySelector('.character-wrapper');
    charWrapper.addEventListener('click', (e) => {
        // 切换到下一张
        switchCharacter(charIndex + 1);
    });

    // --- 4. 版权弹窗系统 (Modal) ---
    const modal = document.getElementById('copyright-modal');
    const closeBtn = document.querySelector('.modal-close-btn');

    // 显示弹窗函数
    function showModal() {
        modal.style.display = 'flex'; // 先设为flex占位
        // 稍微延时加show类，触发CSS opacity transition
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }

    // 关闭弹窗函数
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // 等CSS动画走完
    }

    // 事件C：右键立绘 -> 阻止默认菜单 -> 显示弹窗
    charImg.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showModal();
    });

    // 关闭按钮事件
    closeBtn.addEventListener('click', closeModal);

    // 点击弹窗外部背景也可关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});