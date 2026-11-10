'use strict';
// ============================================================
// إصلاح زر الرجوع (Back) — يمنع الخروج المفاجئ من الموقع
// يُحمَّل بعد auth.js في كل صفحة محمية
// ============================================================
(function fixBackButton() {
  // لا تفعل شيئًا إن لم توجد دوال الجلسة (صفحة عامة)
  if (typeof getSession !== 'function' || typeof getRoleHome !== 'function') return;

  // لا تفعل شيئًا إن لم يكن هناك جلسة (requireRole سيتولى التوجيه)
  const s0 = getSession();
  if (!s0) return;

  // ثبّت نقطة رجوع وهمية
  try { history.pushState({ __nav: true }, ''); } catch (e) { return; }

  window.addEventListener('popstate', function () {
    const s = getSession();
    const home = s ? getRoleHome(s.role) : 'index.html';
    const curFile = (location.pathname.split('/').pop() || 'index.html').split('?')[0];
    const homeFile = home.split('?')[0];

    if (!s) {
      if (curFile !== 'index.html') location.replace('index.html');
      return;
    }

    if (curFile !== homeFile) {
      // ليس في الصفحة الرئيسية لدوره → اذهب لها
      location.replace(home);
    } else {
      // في الصفحة الرئيسية → أعِد التثبيت (لا خروج)
      history.pushState({ __nav: true }, '');
    }
  });
})();