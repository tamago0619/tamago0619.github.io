document.addEventListener('DOMContentLoaded', () => {
    // === 圓形文字邏輯 (保持不變) ===
    const circularTextElement = document.getElementById('circularText');
    const textContent = "THE REAL AND THE UNREAL IS THE VIRTUAL BETWEEN";
    const radius = 100;

    circularTextElement.innerHTML = '';

    const totalChars = textContent.length;
    const angleStep = 360 / totalChars;

    for (let i = 0; i < totalChars; i++) {
        const char = textContent.charAt(i);
        const span = document.createElement('span');
        span.textContent = char;

        const currentAngle = i * angleStep;

        span.style.transform = `
            rotate(${currentAngle}deg)
            translateY(-${radius}px)
            rotate(${currentAngle}deg)
        `;
        circularTextElement.appendChild(span);
    }

    // === 系統錯誤圖片/文字彈出邏輯 (已優化動畫重複和停止) ===
    const systemErrorSection = document.getElementById('system-error');
    const errorPopupArea = document.getElementById('error-popup-area');
    const errorImage = document.getElementById('errorImage');
    const errorMessagePopup = document.getElementById('errorMessagePopup');

    if (systemErrorSection && errorPopupArea && errorImage && errorMessagePopup) {
        let hasAnimatedSystemError = false; // 區分這個區塊的動畫狀態
        let currentPopImageTimeout; // 用於清除圖片重複動畫的計時器
        let currentSlideMessageTimeout; // 用於清除文字重複動畫的計時器

        const systemErrorObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!hasAnimatedSystemError) {
                        errorPopupArea.classList.add('active');

                        errorImage.style.animation = 'popIn 0.8s ease-out forwards';
                        errorImage.style.animationDelay = '0.2s';

                        errorMessagePopup.style.animation = 'slideUpFadeIn 0.8s ease-out forwards';
                        errorMessagePopup.style.animationDelay = '0.5s';

                        // 設置動畫重複
                        const startPopAnimation = () => {
                            errorImage.style.animation = 'none';
                            void errorImage.offsetWidth; // 觸發重排
                            errorImage.style.animation = 'popIn 0.8s ease-out forwards';
                        };

                        const startSlideAnimation = () => {
                            errorMessagePopup.style.animation = 'none';
                            void errorMessagePopup.offsetWidth;
                            errorMessagePopup.style.animation = 'slideUpFadeIn 0.8s ease-out forwards';
                        };

                        // 初始觸發一次後，設定定時重複
                        currentPopImageTimeout = setTimeout(function repeatPop() {
                            // 只有當區塊仍然可見時才重複動畫
                            if (isElementInViewport(systemErrorSection)) {
                                startPopAnimation();
                                currentPopImageTimeout = setTimeout(repeatPop, 2000); // 2秒後再次彈出
                            }
                        }, 2000); // 首次延遲2秒後彈出

                        currentSlideMessageTimeout = setTimeout(function repeatSlide() {
                            // 只有當區塊仍然可見時才重複動畫
                            if (isElementInViewport(systemErrorSection)) {
                                startSlideAnimation();
                                currentSlideMessageTimeout = setTimeout(repeatSlide, 2000); // 2秒後再次彈出
                            }
                        }, 2000); // 首次延遲2秒後彈出

                        hasAnimatedSystemError = true;
                    }
                } else {
                    // 當區塊離開視窗時
                    errorPopupArea.classList.remove('active');
                    errorImage.style.animation = 'none'; // 停止動畫
                    errorMessagePopup.style.animation = 'none'; // 停止動畫
                    hasAnimatedSystemError = false;
                    // 清除所有重複的 setTimeout，防止在區塊離開後繼續觸發
                    if (currentPopImageTimeout) clearTimeout(currentPopImageTimeout);
                    if (currentSlideMessageTimeout) clearTimeout(currentSlideMessageTimeout);
                }
            });
        }, { threshold: 0.1 });

        // 輔助函數：檢查元素是否在視窗內
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom > 0 &&
                rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
                rect.right > 0
            );
        }

        systemErrorObserver.observe(systemErrorSection);
    }

    // === 漢堡包菜單邏輯 (保持不變) ===
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = mobileNav.querySelectorAll('a');

    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // === 新增：通用進入動畫邏輯 ===
    // 選取所有需要動畫的元素
    const animateElements = document.querySelectorAll('.slide-up, .fade-in, .slide-left, .slide-right, .module-card, table tbody tr');

    const generalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 如果是卡片或表格行，處理延遲動畫
                if (entry.target.classList.contains('module-card')) {
                    // 獲取所有父級卡片容器內的未動畫卡片
                    const parentCardsContainer = entry.target.closest('.cards');
                    if (parentCardsContainer) {
                        const unAnimatedCards = Array.from(parentCardsContainer.querySelectorAll('.module-card:not(.animated)'));
                        unAnimatedCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('animated');
                            }, index * 100); // 每張卡片延遲 100ms
                        });
                    }
                } else if (entry.target.tagName === 'TR' && entry.target.closest('table')) { // 檢查是否是表格行
                    // 獲取所有父級表格容器內的未動畫行
                    const parentTableBody = entry.target.closest('tbody');
                    if (parentTableBody) {
                        const unAnimatedRows = Array.from(parentTableBody.querySelectorAll('tr:not(.animated)'));
                        unAnimatedRows.forEach((row, index) => {
                            setTimeout(() => {
                                row.classList.add('animated');
                            }, index * 80); // 每行延遲 80ms
                        });
                    }
                } else {
                    // 對其他有動畫類的元素直接添加 animated 類
                    entry.target.classList.add('animated');
                }
                // 一旦元素觸發了動畫，就不再觀察它
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // 當元素 10% 可見時觸發
        rootMargin: '0px 0px -100px 0px' // 在視窗底部提前 100px 觸發
    });

    // 觀察所有有動畫類型的元素
    animateElements.forEach(element => {
        generalObserver.observe(element);
    });

    // 頁面載入時檢查首屏元素是否需要立即動畫
    // 這部分通常由 CSS 的初始狀態和 Intersection Observer 協同完成，
    // 對於首屏可見的元素，Intersection Observer 會立即觸發。

});