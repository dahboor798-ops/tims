// ==========================================
// auth.js - إدارة الجلسات والصلاحيات (مع حقن الإهداء التلقائي)
// ==========================================

const auth = {
    KEY_NAME: 'timss_session',

    saveSession: function(sessionData) {
        sessionStorage.setItem(this.KEY_NAME, JSON.stringify(sessionData));
    },

    getSession: function() {
        const data = sessionStorage.getItem(this.KEY_NAME);
        return data ? JSON.parse(data) : null;
    },

    logout: function() {
        sessionStorage.removeItem(this.KEY_NAME);
        localStorage.removeItem(this.KEY_NAME); 
        localStorage.removeItem('SESSION_KEY');
        window.location.href = 'index.html?logout=1';
    },

    requireRole: function(requiredRole) {
        const session = this.getSession();
        if (!session) {
            location.href = 'index.html';
            return false;
        }
        if (session.role !== requiredRole && requiredRole !== 'any') {
            location.href = 'index.html';
            return false;
        }
        return true;
    },

    canAddQuestions: function() {
        const session = this.getSession();
        return session && session.can_add_questions === true;
    }
};

// ==========================================
// ربط الأحداث وحقن الإهداء في كل الصفحات
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. ربط أزرار تسجيل الخروج
    document.querySelectorAll('[data-logout]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });
    });

    // 2. عرض اسم المستخدم
    const session = auth.getSession();
    if (session) {
        document.querySelectorAll('[data-user-name]').forEach(el => {
            el.textContent = session.full_name || session.name || 'مستخدم';
        });
    }

    // 3. حقن الإهداء تلقائياً في البنر
    injectDedication();
});

function injectDedication() {
    // التحقق من عدم وجود الإهداء مسبقاً (لتجنب التكرار)
    if (document.getElementById('brandCredit')) return;
    
    // إذا كانت الصفحة هي صفحة الدخول index.html (لا تحتوي على .header بل .card-header) نتجاوزها
    const header = document.querySelector('.header');
    if (!header) return;

    // إضافة تنسيقات الإهداء
    const style = document.createElement('style');
    style.innerHTML = `
        .brand-credit {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            line-height: 1.4;
            color: rgba(255, 255, 255, 0.95);
            text-align: center;
            margin: 0 15px;
            font-weight: 500;
        }
        .brand-credit a {
            color: #4ade80;
            text-decoration: none;
            font-weight: bold;
            direction: ltr;
            display: inline-block;
        }
        .brand-credit a:hover {
            text-decoration: underline;
            color: #86efac;
        }
    `;
    document.head.appendChild(style);

    // إنشاء العنصر
    const creditHTML = `
        <div id="brandCredit" class="brand-credit">
            <div>إهداء لمديرية التربية والتعليم لمنطقة الزرقاء الثانية</div>
            <div>من الأستاذ عواد دحبور</div>
            <div><a href="https://wa.me/96278810669" target="_blank">+96278810669</a> <span style="font-size:9px; opacity:0.7;"></span></div>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = creditHTML.trim();
    const creditElement = tempDiv.firstChild;

    // حقن العنصر في منتصف البنر
    // إذا كان البنر يحتوي على عنصرين (الشعار وبيانات المستخدم)، نضعه بينهما
    if (header.children.length >= 2) {
        header.insertBefore(creditElement, header.children[1]);
    } else {
        header.appendChild(creditElement);
    }
}