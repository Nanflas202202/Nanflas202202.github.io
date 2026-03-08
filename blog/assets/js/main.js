/* =========================================
   文章数据配置
   注意：现在 url 改成了参数形式 ?id=文件名
   ========================================= */
   const postsData = [
    {
        title: "测试文章",
        date: "2026-03-08",
        summary: "这是测试这个博客框架运行是否正常的文章",
        cover: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", 
        url: "./post.html?id=test" // 指向 posts/hello.md
    }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 生成魔法光尘
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

    // 2. 鼠标跟随
    const cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursor-glow';
    document.body.appendChild(cursorGlow);
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    });

    // 3. 首页渲染
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

    // 4. 打字机宽度自适应
    const typewriter = document.querySelector('.typewriter');
    if(typewriter) {
        const textLen = typewriter.innerText.length;
        typewriter.style.animation = `typing 2.5s steps(${textLen}, end) forwards, blink-caret .75s step-end infinite`;
        const style = document.createElement('style');
        style.innerHTML = `@keyframes typing { from { width: 0 } to { width: ${textLen}em } }`;
        document.head.appendChild(style);
    }

    // 5. Scroll Reveal 动画
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); 
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 6. 首页极慢缓动滚动接管
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

    // ==========================================
    // 7. 文章页：动态拉取并渲染 Markdown
    // ==========================================
    const mdContainer = document.getElementById('markdown-content');
    const titleEle = document.getElementById('article-title');
    const dateEle = document.getElementById('article-date');

    if (mdContainer) {
        // 从 URL 获取 id 参数，例如 ?id=hello
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');

        if (postId) {
            // 在配置数据中查找这篇文章的信息（用于替换标题和日期）
            const postInfo = postsData.find(p => p.url.includes(postId));
            if(postInfo) {
                titleEle.innerText = postInfo.title;
                dateEle.innerText = postInfo.date;
                document.title = postInfo.title + " - 博客阅读";
            }

            // 使用 fetch 拉取 markdown 文件
            fetch(`./posts/${postId}.md`)
                .then(response => {
                    if (!response.ok) throw new Error('文章飞向了外太空...');
                    return response.text();
                })
                .then(text => {
                    // 调用 marked.js 将 MD 转为 HTML 注入
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