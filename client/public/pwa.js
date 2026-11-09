/*
 * 오래(oraem.com) 앱 설치 기능
 * - 서비스 워커 등록 (빠른 로딩, 인터넷 끊김 대비)
 * - 상단 메뉴(로그인 아이콘 왼쪽)에 "앱 설치" 버튼 추가
 * - 휴대폰 첫 방문 시 하단 안내 띠
 * - 기기별 설치 안내 창 (안드로이드 / 아이폰 / 컴퓨터 / 카카오톡 등 앱 안 브라우저)
 * index.html 의 <script src="/pwa.js?v=1" defer></script> 한 줄로 동작합니다.
 */
(function () {
  "use strict";
  if (window.__oraePWA) return;
  window.__oraePWA = true;

  var BANNER_KEY = "orae-install-banner-hidden-until";
  var BANNER_DAYS = 7;
  var ICON = "/pwa-192.png";
  var deferredPrompt = null;
  var installed = false;
  var ua = navigator.userAgent;

  // ---------- 기기 판별 ----------
  function isIOS() {
    return /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  }
  function isAndroid() { return /android/i.test(ua); }
  function isMobile() { return isIOS() || isAndroid(); }
  function isStandalone() {
    return installed ||
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      navigator.standalone === true;
  }
  function inAppName() {
    if (/KAKAOTALK/i.test(ua)) return "카카오톡";
    if (/NAVER\(inapp/i.test(ua)) return "네이버";
    if (/Instagram/i.test(ua)) return "인스타그램";
    if (/FBAN|FBAV/i.test(ua)) return "페이스북";
    if (/Line\//i.test(ua)) return "라인";
    if (/DaumApps/i.test(ua)) return "다음";
    return null;
  }
  function openExternal() {
    var url = location.href;
    if (/KAKAOTALK/i.test(ua)) {
      location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(url);
    } else if (isAndroid()) {
      location.href = "intent://" + url.replace(/^https?:\/\//, "") + "#Intent;scheme=https;package=com.android.chrome;end";
    }
  }

  // ---------- 서비스 워커 ----------
  var isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  // 개발 서버(npm run dev, Vite)에서는 저장(캐시)하지 않음 — 고친 코드가 바로 보이도록
  var isDevServer = !!document.querySelector('script[src*="/@vite/client"]');
  if (isDevServer && "serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (rs) { rs.forEach(function (r) { r.unregister(); }); });
  }
  if ("serviceWorker" in navigator && !isDevServer && (location.protocol === "https:" || isLocal)) {
    var reg = function () { navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(function () {}); };
    if (document.readyState === "complete") reg(); else window.addEventListener("load", reg, { once: true });
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); // 크롬 기본 안내 대신 우리 버튼으로 띄움
    deferredPrompt = e;
  });
  window.addEventListener("appinstalled", function () {
    installed = true;
    deferredPrompt = null;
    removeAll();
  });

  // ---------- 화면 스타일 (사이트 색 변수 사용 → 다크 모드도 따라감) ----------
  var css = [
    ".orae-pwa *{box-sizing:border-box}",
    ".orae-pwa{--o-card:hsl(var(--card,0 0% 100%));--o-fg:hsl(var(--foreground,0 0% 22%));",
    "--o-sub:hsl(var(--muted-foreground,0 0% 45%));--o-line:hsl(var(--border,0 0% 93%));",
    "--o-btn:#0d7377;--o-btn-fg:#fff;font-family:'Noto Sans KR',-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:var(--o-fg)}",
    ".orae-pwa-banner{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:9998;",
    "display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--o-line);border-radius:14px;",
    "background:var(--o-card);box-shadow:0 6px 24px rgba(0,0,0,.12);max-width:480px;margin:0 auto;animation:orae-up .25s ease-out}",
    ".orae-pwa-banner img{width:40px;height:40px;border-radius:10px;flex:none}",
    ".orae-pwa-banner .t{flex:1;min-width:0}",
    ".orae-pwa-banner b{display:block;font-size:14px;font-weight:600}",
    ".orae-pwa-banner span{display:block;font-size:12px;color:var(--o-sub);margin-top:2px}",
    ".orae-pwa-go{flex:none;border:0;border-radius:10px;padding:9px 14px;background:var(--o-btn);color:var(--o-btn-fg);font:inherit;font-size:14px;font-weight:600;cursor:pointer}",
    ".orae-pwa-x{flex:none;border:0;background:none;color:var(--o-sub);padding:4px;cursor:pointer;line-height:0}",
    ".orae-pwa-dim{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.4);display:flex;align-items:flex-end;justify-content:center}",
    "@media(min-width:640px){.orae-pwa-dim{align-items:center}.orae-pwa-sheet{border-radius:18px!important}}",
    ".orae-pwa-sheet{width:100%;max-width:400px;background:var(--o-card);border:1px solid var(--o-line);border-radius:18px 18px 0 0;",
    "padding:24px 24px calc(24px + env(safe-area-inset-bottom));animation:orae-up .25s ease-out}",
    ".orae-pwa-head{display:flex;align-items:center;gap:12px;margin-bottom:20px}",
    ".orae-pwa-head img{width:44px;height:44px;border-radius:11px}",
    ".orae-pwa-head h2{flex:1;margin:0;font-size:16px;font-weight:600}",
    ".orae-pwa-steps{list-style:none;margin:0;padding:0}",
    ".orae-pwa-steps li{display:flex;gap:12px;align-items:flex-start;font-size:14px;line-height:1.6;margin-bottom:12px}",
    ".orae-pwa-steps li:last-child{margin-bottom:0}",
    ".orae-pwa-n{flex:none;width:24px;height:24px;border:1px solid var(--o-line);border-radius:50%;",
    "display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;margin-top:1px}",
    ".orae-pwa-ic{display:inline-flex;vertical-align:-3px;margin:0 2px}",
    ".orae-pwa-p{font-size:14px;line-height:1.6;margin:0 0 12px}",
    ".orae-pwa-p.sub{color:var(--o-sub)}",
    ".orae-pwa-wide{width:100%;padding:12px;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px}",
    "@keyframes orae-up{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}"
  ].join("");

  function addStyle() {
    if (document.getElementById("orae-pwa-style")) return;
    var s = document.createElement("style");
    s.id = "orae-pwa-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ---------- 아이콘 (lucide 모양) ----------
  function svg(paths, size) {
    size = size || 18;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
      paths + "</svg>";
  }
  var IC = {
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/>',
    plus: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/>',
    dots: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
  };
  function ic(name) { return '<span class="orae-pwa-ic">' + svg(IC[name], 16) + "</span>"; }

  // ---------- 설치 동작 ----------
  function startInstall() {
    hideBanner(true);
    if (inAppName()) return showGuide("inapp");
    if (deferredPrompt) {
      var p = deferredPrompt;
      deferredPrompt = null;
      p.prompt();
      p.userChoice.then(function (r) { if (r && r.outcome === "accepted") { installed = true; removeAll(); } });
      return;
    }
    if (isIOS()) return showGuide("ios");
    if (isAndroid()) return showGuide("android");
    showGuide("desktop");
  }

  // ---------- 설치 안내 창 ----------
  var guideEl = null;
  function closeGuide() { if (guideEl) { guideEl.remove(); guideEl = null; } }
  function step(n, html) { return '<li><span class="orae-pwa-n">' + n + "</span><span>" + html + "</span></li>"; }

  function showGuide(kind) {
    closeGuide();
    var title = {
      ios: "아이폰에 오래 앱 설치",
      android: "안드로이드에 오래 앱 설치",
      desktop: "컴퓨터에 오래 앱 설치",
      inapp: "브라우저에서 열어 주세요"
    }[kind];
    var body = "";
    if (kind === "ios") {
      body = '<ol class="orae-pwa-steps">' +
        step(1, "<b>Safari</b>로 oraem.com을 열어 주세요") +
        step(2, "화면 아래(또는 위)의 공유 버튼" + ic("share") + "을 누르세요") +
        step(3, "목록을 내려 <b>홈 화면에 추가</b>" + ic("plus") + "를 누르세요") +
        step(4, "오른쪽 위 <b>추가</b>를 누르면 홈 화면에 오래 앱이 생겨요") + "</ol>";
    } else if (kind === "android") {
      body = '<ol class="orae-pwa-steps">' +
        step(1, "<b>Chrome</b>(크롬) 또는 삼성 인터넷으로 oraem.com을 열어 주세요") +
        step(2, "오른쪽 위 메뉴" + ic("dots") + "를 누르세요 <span style=\"color:var(--o-sub)\">(삼성 인터넷은 아래 ≡ 메뉴)</span>") +
        step(3, "<b>앱 설치</b> 또는 <b>홈 화면에 추가</b>를 누르세요") + "</ol>";
    } else if (kind === "desktop") {
      body = '<ol class="orae-pwa-steps">' +
        step(1, "Chrome 또는 Edge 주소창 오른쪽의 설치 아이콘" + ic("download") + "을 누르세요") +
        step(2, "<b>설치</b>를 누르면 바탕화면·작업 표시줄에 오래 앱이 생겨요") + "</ol>";
    } else {
      var app = inAppName();
      body = '<p class="orae-pwa-p">' + app + " 안에서는 앱을 설치할 수 없어요. " +
        (isIOS() ? "Safari" : "Chrome") + "에서 열면 설치할 수 있어요.</p>";
      if (isIOS()) {
        body += '<p class="orae-pwa-p sub">오른쪽 아래(또는 위) <b>···</b> 메뉴 → <b>Safari로 열기</b> 또는 ' +
          "<b>다른 브라우저로 열기</b>를 누른 뒤, 다시 <b>앱 설치</b>를 눌러 주세요.</p>";
      } else {
        body += '<button type="button" class="orae-pwa-go orae-pwa-wide" data-act="ext">' + svg(IC.ext, 16) + "Chrome으로 열기</button>";
      }
    }

    guideEl = document.createElement("div");
    guideEl.className = "orae-pwa orae-pwa-dim";
    guideEl.setAttribute("data-testid", "install-guide");
    guideEl.innerHTML =
      '<div class="orae-pwa-sheet" role="dialog" aria-modal="true" aria-label="' + title + '">' +
      '<div class="orae-pwa-head"><img src="' + ICON + '" alt=""><h2>' + title + "</h2>" +
      '<button type="button" class="orae-pwa-x" aria-label="닫기" data-act="close">' + svg(IC.x, 20) + "</button></div>" +
      body + "</div>";
    guideEl.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-act]") : null;
      if (e.target === guideEl || (t && t.getAttribute("data-act") === "close")) closeGuide();
      else if (t && t.getAttribute("data-act") === "ext") openExternal();
    });
    document.body.appendChild(guideEl);
  }

  // ---------- 하단 안내 띠 (휴대폰 첫 방문) ----------
  var bannerEl = null;
  function hideBanner(remember) {
    if (bannerEl) { bannerEl.remove(); bannerEl = null; }
    if (remember) {
      try { localStorage.setItem(BANNER_KEY, String(Date.now() + BANNER_DAYS * 864e5)); } catch (e) {}
    }
  }
  function maybeShowBanner() {
    if (isStandalone() || !isMobile()) return;
    var until = 0;
    try { until = Number(localStorage.getItem(BANNER_KEY) || 0); } catch (e) {}
    if (Date.now() < until) return;
    setTimeout(function () {
      if (isStandalone() || guideEl || bannerEl) return;
      bannerEl = document.createElement("div");
      bannerEl.className = "orae-pwa orae-pwa-banner";
      bannerEl.setAttribute("data-testid", "install-banner");
      bannerEl.innerHTML =
        '<img src="' + ICON + '" alt=""><div class="t"><b>오래 앱으로 쓰기</b><span>홈 화면에서 앱처럼 바로 열려요</span></div>' +
        '<button type="button" class="orae-pwa-go" data-act="go">설치</button>' +
        '<button type="button" class="orae-pwa-x" aria-label="닫기" data-act="close">' + svg(IC.x, 16) + "</button>";
      bannerEl.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-act]") : null;
        if (!t) return;
        if (t.getAttribute("data-act") === "go") startInstall(); else hideBanner(true);
      });
      document.body.appendChild(bannerEl);
    }, 2500);
  }

  // ---------- 상단 메뉴 버튼 ----------
  // 로그인 아이콘(nav-user) 바로 왼쪽에 넣고, 화면이 바뀌어도 자리를 지키게 합니다.
  var navBtn = null;
  function makeNavBtn(ref) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = ref.className; // 사이트 아이콘 버튼과 똑같은 모양
    b.setAttribute("data-testid", "nav-install-app");
    b.setAttribute("aria-label", "앱 설치");
    b.title = "앱 설치";
    var refSvg = ref.querySelector("svg");
    var cls = (refSvg && refSvg.getAttribute("class")) || "h-5 w-5 sm:h-6 sm:w-6";
    cls = cls.replace(/\btext-(primary|foreground)\b/g, "text-muted-foreground");
    if (!/text-muted-foreground/.test(cls)) cls += " text-muted-foreground group-hover:text-foreground";
    b.innerHTML = svg(IC.download, 24).replace("<svg ", '<svg class="' + cls + '" ');
    b.addEventListener("click", startInstall);
    return b;
  }
  function placeNavBtn() {
    if (isStandalone()) return;
    var anchor = document.querySelector('[data-testid="nav-messages"]') ||
                 document.querySelector('[data-testid="nav-user"]');
    if (!anchor || !anchor.parentNode) return;
    if (!navBtn) navBtn = makeNavBtn(document.querySelector('[data-testid="nav-user"]') || anchor);
    if (navBtn.parentNode !== anchor.parentNode || navBtn.nextSibling !== anchor) {
      anchor.parentNode.insertBefore(navBtn, anchor);
    }
  }

  function removeAll() {
    hideBanner(false);
    closeGuide();
    if (navBtn) { navBtn.remove(); navBtn = null; }
    if (observer) observer.disconnect();
  }

  var observer = null;
  var queued = false;
  function start() {
    if (isStandalone()) return; // 이미 앱으로 실행 중이면 아무것도 표시하지 않음
    addStyle();
    placeNavBtn();
    observer = new MutationObserver(function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; placeNavBtn(); });
    });
    observer.observe(document.getElementById("root") || document.body, { childList: true, subtree: true });
    maybeShowBanner();
  }

  window.oraeInstallApp = startInstall; // 다른 곳에서 버튼을 만들 때: onclick="oraeInstallApp()"

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
