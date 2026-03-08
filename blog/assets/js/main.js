/* =========================================
   文章数据配置
   注意：现在 url 改成了参数形式 ?id=文件名
   ========================================= */
   const postsData = [
    {
        title: "测试文章",
        date: "2026-03-08",
        summary: "这是测试这个博客框架运行是否正常的文章",
        cover: "./assets/img/cover1_112461739_p0.jpg", 
        url: "./post.html?id=test" // 指向 posts/hello.md
    }
];

// 2. 随机背景图列表 (支持相对路径或网络图片)
const backgroundImages = [
    "./assets/img/bg.jpg", 
    "./assets/img/bg1.jpg",
    "./assets/img/bg2.jpg",
    "./assets/img/bg.png",
    "./assets/img/bg1.png"
];

// 3. 随机打字机文案列表
const taglines = [
    "记录生活中清澈的灵感与代码。",
    "Code less, create more.",
    "探索未知，保持好奇。",
    "在数字世界里构建诗意。"
];

document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================
    // 1. 随机背景图逻辑
    // ===================================
    const bgLayer = document.querySelector('.background-layer');
    if (bgLayer && backgroundImages.length > 0) {
        // 随机取一张
        const randomBg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
        bgLayer.style.backgroundImage = `url('${randomBg}')`;
    }

    // ===================================
    // 2. 原生 JS 打字机逻辑 (解决截断问题 & 支持多句)
    // ===================================
    const typewriterText = document.getElementById('typewriter-text');
    if (typewriterText && taglines.length > 0) {
        let textIndex = 0; // 当前第几句话
        let charIndex = 0; // 当前第几个字
        let isDeleting = false; // 是否处于回删状态
        let typeSpeed = 100; // 打字速度
        
        function typeLoop() {
            const currentText = taglines[textIndex];
            
            if (isDeleting) {
                // 回删逻辑
                typewriterText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // 回删速度快一点
            } else {
                // 打字逻辑
                typewriterText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150; // 正常打字速度
            }

            // 逻辑判断
            if (!isDeleting && charIndex === currentText.length) {
                // 打完了这句话，停顿 2 秒
                isDeleting = true;
                typeSpeed = 2000; 
            } else if (isDeleting && charIndex === 0) {
                // 删完了，切换下一句
                isDeleting = false;
                textIndex = (textIndex + 1) % taglines.length; // 循环播放
                typeSpeed = 500;
            }

            setTimeout(typeLoop, typeSpeed);
        }

        // 启动打字循环
        typeLoop();
    }

    // ===================================
    // 3. 魔法光尘特效
    // ===================================
    const dustContainer = document.createElement('div');
    dustContainer.className = 'dust-container';
    document.body.appendChild(dustContainer);
    for(let i=0; i<30; i++) {
        const dust = document.createElement('div');
        dust.className = 'dust';
        const size = Math.random() * 12 + 3 + 'px';
        dust.style.width = size; dust.style.height = size;
        dust.style.left = Math.random() * 100 + 'vw';
        dust.style.setProperty('--duration', (Math.random() * 10 + 10) + 's');
        dust.style.setProperty('--sway-duration', (Math.random() * 2 + 2) + 's');
        dust.style.setProperty('--sway-range', (Math.random() * 100 - 50) + 'px');
        dust.style.setProperty('--max-opacity', Math.random() * 0.5 + 0.3);
        dust.style.animationDelay = Math.random() * 10 + 's';
        dustContainer.appendChild(dust);
    }

    // ===================================
    // 4. 鼠标跟随
    // ===================================
    const cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursor-glow';
    document.body.appendChild(cursorGlow);
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    });

    // ===================================
    // 5. 首页列表渲染 & Scroll Reveal
    // ===================================
    const postContainer = document.getElementById('post-container');
    if (postContainer) {
        postContainer.innerHTML = ''; 
        postsData.forEach((post) => {
            const article = document.createElement('a');
            article.href = post.url;
            article.className = 'post-item glass-panel reveal'; 
            const imgHtml = post.cover ? `<img src="${post.cover}" alt="cover" class="post-cover">` : '';
            article.innerHTML = `${imgHtml}<div class="post-info"><h2>${post.title}</h2><div class="date">${post.date}</div><p>${post.summary}</p></div>`;
            postContainer.appendChild(article);
        });
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); 
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ===================================
    // 6. 首页极慢缓动滚动接管
    // ===================================
    const homeSection = document.getElementById('home');
    const contentSection = document.getElementById('content');
    if (homeSection && contentSection) {
        let isAnimating = false;
        function easeInOutQuart(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2 * t * t * t * t + b;
            t -= 2;
            return -c/2 * (t * t * t * t - 2) + b;
        }
        function customScrollTo(targetY, duration = 1500) {
            isAnimating = true;
            const startY = window.pageYOffset;
            const distance = targetY - startY;
            let startTime = null;
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = easeInOutQuart(timeElapsed, startY, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    window.scrollTo(0, targetY);
                    setTimeout(() => { isAnimating = false; }, 100);
                }
            }
            requestAnimationFrame(animation);
        }
        window.addEventListener('wheel', (e) => {
            if (isAnimating) { e.preventDefault(); return; }
            const scrollY = window.scrollY;
            const triggerPoint = window.innerHeight * 0.1;
            if (scrollY <= triggerPoint && e.deltaY > 0) {
                e.preventDefault(); customScrollTo(contentSection.offsetTop);
            } else if (scrollY >= contentSection.offsetTop - triggerPoint && scrollY <= contentSection.offsetTop + triggerPoint && e.deltaY < 0) {
                e.preventDefault(); customScrollTo(0);
            }
        }, { passive: false });
        const indicator = document.querySelector('.scroll-indicator');
        if(indicator) indicator.addEventListener('click', (e) => { e.preventDefault(); if(!isAnimating) customScrollTo(contentSection.offsetTop); });
    }

    // ===================================
    // 7. 文章页：动态拉取 Markdown
    // ===================================
    const mdContainer = document.getElementById('markdown-content');
    const titleEle = document.getElementById('article-title');
    const dateEle = document.getElementById('article-date');

    if (mdContainer) {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');

        if (postId) {
            const postInfo = postsData.find(p => p.url.includes(postId));
            if(postInfo) {
                titleEle.innerText = postInfo.title;
                dateEle.innerText = postInfo.date;
                document.title = postInfo.title + " - 博客阅读";
            }

            fetch(`./posts/${postId}.md`)
                .then(response => {
                    if (!response.ok) throw new Error('文章飞向了外太空...');
                    return response.text();
                })
                .then(text => {
                    mdContainer.innerHTML = marked.parse(text);
                })
                .catch(err => {
                    mdContainer.innerHTML = `<h2>出错了</h2><p>${err.message}</p><p>请确保你在本地使用了 HTTP 服务（如 Live Server）预览，或者已将文件推送到 Github Pages。</p>`;
                });
        } else {
            mdContainer.innerHTML = "<h2>未找到文章</h2><p>URL 缺少参数。</p>";
        }
    }
});