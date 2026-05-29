# 🤖 Bot Control - تعليمات الإعداد

## الملفات
```
worker/
  worker.js      ← كود الـ Cloudflare Worker (الوسيط)
  wrangler.toml  ← إعدادات النشر
site/
  dashboard.html ← الموقع الرئيسي
```

---

## الخطوة 1: نشر الـ Worker على Cloudflare

### الطريقة السهلة (بدون كمبيوتر - من المتصفح)

1. روح على **https://dash.cloudflare.com**
2. سجّل دخول أو أنشئ حساب مجاني
3. من القائمة الجانبية اختر **Workers & Pages**
4. اضغط **Create** ثم **Create Worker**
5. سمّه: `bot-control-proxy`
6. اضغط **Deploy**
7. بعدين اضغط **Edit code**
8. **احذف كل الكود الموجود** والصق محتوى ملف `worker/worker.js`
9. اضغط **Deploy** مرة ثانية
10. انسخ رابط الـ Worker - يكون شكله:
    `https://bot-control-proxy.YOUR-NAME.workers.dev`

---

## الخطوة 2: تحديث رابط الـ Worker في الموقع

افتح ملف `site/dashboard.html` بأي محرر نصوص (Notepad مثلاً)

ابحث عن هذا السطر:
```
const WORKER_URL = "https://bot-control-proxy.YOUR-SUBDOMAIN.workers.dev";
```

غيّره برابط الـ Worker الخاص بك، مثلاً:
```
const WORKER_URL = "https://bot-control-proxy.ymshrf1.workers.dev";
```

احفظ الملف.

---

## الخطوة 3: رفع الموقع على GitHub Pages

1. روح **https://github.com** وسجّل دخول
2. اضغط **New repository**
3. سمّه مثلاً: `bots` - اختر **Public**
4. اضغط **Create repository**
5. اضغط **uploading an existing file**
6. ارفع ملف `dashboard.html`
7. اضغط **Commit changes**
8. روح **Settings** → **Pages**
9. من **Source** اختر **Deploy from a branch** → **main** → **/ (root)**
10. اضغط **Save**
11. بعد دقيقة الموقع يكون جاهز على:
    `https://USERNAME.github.io/bots/dashboard.html`

---

## كلمة السر
```
max-ymshrf
```

---

## ملاحظات
- الـ Worker مجاني حتى 100,000 طلب يومياً (أكثر من كافي)
- GitHub Pages مجاني تماماً
- لو حابب تغيّر كلمة السر، ابحث عن `max-ymshrf` في dashboard.html وغيّرها
