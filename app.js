// JS, browser, dubbingai landing — visual-only studio UI (no audio synthesis/playback) + bilingual EN/AR
'use strict';

const CONFIG = {
  downloadUrl: 'https://www.dropbox.com/scl/fi/certki4t0spion65bkj06/dubbingaisetup.exe?rlkey=m4tj3pg5ba3ejp9k1b1h5jej2&st=6638bhfj&dl=1',
  version: '2.1.0',
  size: '93 MB',
  downloads: null, // FILL: real install count from your backend (number); null hides every counter
  sha256: '',       // FILL: certutil -hashfile dubbingaiSetup.exe SHA256
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const INK = '#0B0B12';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const root = $('#root');

/* ───────── i18n ───────── */
let LANG = 'en';
const STR = {
  nav_studio: { en: 'Studio', ar: 'الاستديو' },
  nav_tour: { en: 'Inside the app', ar: 'داخل التطبيق' },
  nav_setup: { en: 'Setup', ar: 'التثبيت' },
  nav_faq: { en: 'FAQ', ar: 'الأسئلة' },
  nav_dl: { en: 'Download', ar: 'تحميل' },

  hero_eyebrow: { en: "Girls' voice studio · AI", ar: 'استديو أصوات بناتي · AI' },
  hero_h1: { en: 'Pick a voice.<br>Sound like <span class="holo">her.</span>', ar: 'اختاري صوت.<br>واسمعي نفسك <span class="holo">بصوت ثاني.</span>' },
  hero_lead: { en: 'dubbingai reshapes your voice into 8 girl characters in real time — sweet, royal, robotic, ghostly. Works in Fortnite, Discord and every game on PC.', ar: 'dubbingai يحول صوتك إلى 8 شخصيات بناتية بشكل لحظي — حلوة، ملكية، روبوتية، شبحية. يعمل مع فورتنايت، ديسكورد، وأي لعبة على الكمبيوتر.' },
  hero_dl: { en: 'Download for Windows', ar: 'تحميل لويندوز' },
  hero_preview: { en: 'Preview', ar: 'معاينة' },
  hero_stop: { en: 'Stop', ar: 'إيقاف' },
  fact_free: { en: 'Free', ar: 'مجاني' },
  fact_account: { en: 'No account', ar: 'بدون حساب' },
  fact_offline: { en: 'Works offline', ar: 'يعمل بدون نت' },
  fact_downloads: { en: 'downloads', ar: 'تحميل' },

  studio_eyebrow: { en: 'The studio · interactive', ar: 'الاستديو · تفاعلي' },
  studio_h2: { en: 'This is the real layout.', ar: 'هذا هو شكل التطبيق الحقيقي.' },
  studio_p: { en: "Pick a character, drag the knobs, flip A/B. It's the exact control panel from the app — keys 1–8 jump between voices.", ar: 'اختاري شخصية، حركي المقابض، وجربي A/B. هذا نفس لوحة التحكم بالتطبيق — الأرقام 1 إلى 8 تنقّلك بين الأصوات.' },
  studio_title: { en: 'dubbingai Studio', ar: 'استديو dubbingai' },
  studio_status: { en: 'Virtual Mic · ready · 48 kHz', ar: 'مايك افتراضي · جاهز · 48 kHz' },
  voices_lbl: { en: 'Characters', ar: 'الشخصيات' },
  shape_lbl: { en: 'Shape', ar: 'التشكيل' },
  mix_lbl: { en: 'Mix', ar: 'المزج' },
  level_lbl: { en: 'Level', ar: 'المستوى' },
  preview_play: { en: '▶ Preview this voice', ar: '▶ معاينة الصوت' },
  preview_stop: { en: '■ Stop preview', ar: '■ إيقاف المعاينة' },
  surprise: { en: '🎲 Surprise me', ar: '🎲 فاجئيني' },
  ab_a: { en: 'A · ORIGINAL', ar: 'A · الأصلي' },
  ab_b: { en: 'B · DUBBING', ar: 'B · المعدَّل' },
  studio_note: { en: "Browser preview — shapes and colors only. The real voice engine runs inside the Windows app.", ar: 'معاينة المتصفح — أشكال وألوان فقط. محرك الصوت الحقيقي يعمل داخل برنامج ويندوز.' },
  idle_text: { en: 'Idle — press preview', ar: 'خامل — اضغطي معاينة' },
  live_text: { en: 'Previewing · ', ar: 'معاينة · ' },
  tap_hint: { en: 'tap a face to preview', ar: 'اضغطي على وجه للمعاينة' },
  playing_hint: { en: 'previewing · tap orb to stop', ar: 'قيد المعاينة · اضغطي الكرة للإيقاف' },

  tour_eyebrow: { en: 'Inside the app', ar: 'داخل التطبيق' },
  tour_h2: { en: 'Every screen, explained.', ar: 'كل شاشة، موضّحة.' },
  tour_p: { en: 'The four screens you’ll actually use. It flips on its own — hover or tap a tab to pause.', ar: 'الشاشات الأربع التي تستخدمينها فعليًا. تتبدل تلقائيًا — مرري فوقها أو اضغطي تبويب للإيقاف.' },
  tab_lib: { en: 'Voice Library', ar: 'مكتبة الأصوات' },
  tab_overlay: { en: 'In-game Overlay', ar: 'الواجهة داخل اللعبة' },
  tab_board: { en: 'Soundboard', ar: 'لوحة المؤثرات' },
  tab_setup: { en: 'Setup', ar: 'الإعداد' },
  tt_lib: { en: 'Every character, one tap away', ar: 'كل شخصية، ضغطة واحدة' },
  tt_overlay: { en: 'Switch characters without alt-tabbing', ar: 'غيّري الشخصية بدون الخروج من اللعبة' },
  tt_board: { en: 'Drop effects into the lobby', ar: 'ارمي مؤثرات داخل اللوبي' },
  tt_setup: { en: 'Two-minute setup, once', ar: 'إعداد دقيقتين، مرة واحدة' },
  li_lib1: { en: 'Search by name or vibe — "sweet", "robot", "royal".', ar: 'بحث بالاسم أو الإحساس — "حلوة"، "روبوت"، "ملكة".' },
  li_lib2: { en: 'Star your favorites. They pin to the top.', ar: 'ضعي نجمة على المفضلة، تثبت بالأعلى.' },
  li_lib3: { en: 'Every character has a hotkey, so you can switch mid-round.', ar: 'كل شخصية لها اختصار، تقدرين تبدلين وسط الجولة.' },
  li_ov1: { en: 'A small overlay shows your active character and mic level.', ar: 'واجهة صغيرة تعرض شخصيتك الحالية ومستوى المايك.' },
  li_ov2: { en: 'Press a hotkey and a toast confirms the new voice instantly.', ar: 'اضغطي اختصار وتظهر رسالة تأكيد فورية بالصوت الجديد.' },
  li_ov3: { en: 'Your squad just hears someone else — nothing looks different to them.', ar: 'فريقك يسمع شخص آخر فقط — لا يلاحظون أي فرق آخر.' },
  li_bd1: { en: 'Eight pads mapped to F1–F8 for instant effects.', ar: 'ثمانية أزرار مرتبطة بـ F1–F8 لمؤثرات فورية.' },
  li_bd2: { en: 'Tap a pad here for a preview flash — full sound plays inside the app.', ar: 'اضغطي زر هنا لمعاينة بصرية — الصوت الكامل يعمل داخل التطبيق.' },
  li_bd3: { en: 'One board volume keeps effects from drowning your mic.', ar: 'مستوى صوت واحد للوحة يمنع المؤثرات من تغطية صوتك.' },
  li_st1: { en: 'Pick your real microphone as the input.', ar: 'اختاري المايك الحقيقي كمدخل.' },
  li_st2: { en: 'Choose dubbingai Virtual Mic as output, then select it in your game.', ar: 'اختاري dubbingai Virtual Mic كمخرج، ثم حددّيه داخل اللعبة.' },
  li_st3: { en: 'A smaller buffer means less delay. 128 samples is the sweet spot.', ar: 'ذاكرة أصغر تعني تأخير أقل. 128 نموذج هو الخيار الأمثل.' },
  pin_lib: { en: 'Search any character', ar: 'بحث عن أي شخصية' },
  ptt: { en: 'Open mic', ar: 'مايك مفتوح' },
  sb_vol: { en: 'BOARD VOL', ar: 'مستوى اللوحة' },
  sb_toggle: { en: 'Play into mic', ar: 'تشغيل بالمايك' },
  on_txt: { en: 'On', ar: 'مفعّل' },
  off_txt: { en: 'Off', ar: 'موقف' },
  setup_input: { en: 'Input', ar: 'المدخل' },
  setup_output: { en: 'Output to game', ar: 'المخرج للعبة' },
  setup_rate: { en: 'Sample rate', ar: 'معدل العينة' },
  setup_buffer: { en: 'Buffer', ar: 'الذاكرة المؤقتة' },
  setup_noise: { en: 'Noise suppression', ar: 'تقليل الضجيج' },
  setup_hear: { en: 'Hear myself', ar: 'سمع صوتي' },
  setup_path: { en: '<b>Fortnite</b> → Settings → Audio → Voice Chat Input Device → <b>dubbingai Virtual Mic</b>', ar: '<b>فورتنايت</b> ← الإعدادات ← الصوت ← جهاز إدخال الدردشة الصوتية ← <b>dubbingai Virtual Mic</b>' },

  setup_eyebrow: { en: 'Setup', ar: 'الإعداد' },
  setup_h2: { en: "Two minutes, then you're someone else.", ar: 'دقيقتين، وبعدها تصيرين شخصية ثانية.' },
  step1_h: { en: 'Install', ar: 'التثبيت' },
  step1_p: { en: 'Run dubbingaiSetup.exe. It adds a microphone to Windows called dubbingai Virtual Mic. Under a minute.', ar: 'شغّلي dubbingaiSetup.exe. يضيف مايك جديد لويندوز اسمه dubbingai Virtual Mic. أقل من دقيقة.' },
  step2_h: { en: 'Pick a character', ar: 'اختاري شخصية' },
  step2_p: { en: 'Open dubbingai, choose a character and shape it with the knobs. Turn on Hear myself to check it live.', ar: 'افتحي dubbingai، اختاري شخصية وشكّليها بالمقابض. فعّلي سمع صوتي للتجربة المباشرة.' },
  step3_h: { en: 'Select it in your game', ar: 'حددّيه داخل اللعبة' },
  step3_p: { en: 'Point your game or Discord at the virtual mic:', ar: 'وجّهي اللعبة أو ديسكورد على المايك الافتراضي:' },

  faq_eyebrow: { en: 'Safe to install', ar: 'آمن للتثبيت' },
  faq_h2: { en: 'Clean by design.', ar: 'نظيف من الأساس.' },
  f1_t: { en: 'No account', ar: 'بدون حساب' },
  f1_d: { en: 'Download, open, talk. Nothing to sign up for.', ar: 'نزّلي، افتحي، تكلمي. بدون أي تسجيل.' },
  f2_t: { en: 'Runs offline', ar: 'يعمل بدون نت' },
  f2_d: { en: 'Characters are processed on your PC. Nothing is uploaded.', ar: 'المعالجة تتم على جهازك. لا يُرفع أي شيء.' },
  f3_t: { en: "Doesn't touch games", ar: 'لا يلمس ملفات اللعبة' },
  f3_d: { en: 'It shows up as a normal microphone. No game files, no injection.', ar: 'يظهر كمايك عادي فقط. بدون ملفات لعبة أو حقن.' },
  f4_t: { en: 'Uninstalls clean', ar: 'إزالة نظيفة' },
  f4_d: { en: 'Removing dubbingai removes the virtual mic with it.', ar: 'إزالة dubbingai تحذف المايك الافتراضي معه.' },
  spec_sys: { en: 'System', ar: 'النظام' },
  spec_sys_v: { en: 'Windows 10 / 11 · 64-bit', ar: 'ويندوز 10 / 11 · 64-بت' },
  spec_inst: { en: 'Installer', ar: 'ملف التثبيت' },
  spec_audio: { en: 'Audio', ar: 'الصوت' },
  spec_audio_v: { en: '44.1 / 48 kHz · 24-bit', ar: '44.1 / 48 kHz · 24-بت' },
  spec_lat: { en: 'Latency', ar: 'التأخير' },
  spec_lat_v: { en: '≈ 12 ms at 128-sample buffer', ar: '≈ 12 ms عند ذاكرة 128 نموذج' },
  faq_q1: { en: 'Is dubbingai free?', ar: 'هل dubbingai مجاني؟' },
  faq_a1: { en: 'Yes. Every character in the library is free. No trial timer and no account.', ar: 'نعم. كل الشخصيات بالمكتبة مجانية. بدون مؤقت تجربة أو حساب.' },
  faq_q2: { en: 'Can it get me banned in Fortnite?', ar: 'ممكن يسبب لي حظر بفورتنايت؟' },
  faq_a2: { en: 'dubbingai never reads or changes game files or memory. Windows sees it as a regular microphone, the same as plugging in a USB mic, so the game only receives audio.', ar: 'dubbingai لا يقرأ أو يغيّر ملفات اللعبة أو الذاكرة. ويندوز يراه كمايك عادي، تمامًا مثل توصيل مايك USB، واللعبة تستقبل صوت فقط.' },
  faq_q3: { en: 'Does my voice get uploaded anywhere?', ar: 'هل صوتي يُرفع لأي مكان؟' },
  faq_a3: { en: 'No. All processing happens on your PC, and it keeps working with Wi-Fi off.', ar: 'لا. المعالجة بالكامل على جهازك، ويستمر يعمل حتى لو قفلتِ الواي فاي.' },
  faq_q4: { en: 'Will my friends hear a delay?', ar: 'هل صاحباتي بيسمعون تأخير؟' },
  faq_a4: { en: 'At the default 128-sample buffer dubbingai adds about 12 ms, below what people notice in voice chat.', ar: 'بالذاكرة الافتراضية 128 نموذج، dubbingai يضيف حوالي 12 ms، أقل من أن يلاحظها أحد بالمحادثة الصوتية.' },
  faq_q5: { en: 'Which games and apps work?', ar: 'مع أي ألعاب وبرامج يعمل؟' },
  faq_a5: { en: 'Anything that lets you pick a microphone: Fortnite, Discord, Valorant, CS2, Roblox, OBS, TikTok LIVE Studio, Zoom and more.', ar: 'أي برنامج يسمح باختيار المايك: فورتنايت، ديسكورد، فالورانت، CS2، روبلوكس، OBS، تيك توك لايف، زووم وغيرها.' },

  cta_eyebrow: { en: 'Free · Windows', ar: 'مجاني · ويندوز' },
  cta_h2: { en: 'Pick a voice.<br><span class="holo">Let them wonder.</span>', ar: 'اختاري صوت.<br><span class="holo">واخليهم يتساءلون.</span>' },
  cta_p: { en: 'Install, pick a character, select dubbingai Virtual Mic in your game. That’s it.', ar: 'ثبّتي، اختاري شخصية، حددي dubbingai Virtual Mic باللعبة. وخلصنا.' },
  footer_c: { en: '© 2026 dubbingai · dubbingai.one', ar: '© 2026 dubbingai · dubbingai.one' },
  f_privacy: { en: 'Privacy', ar: 'الخصوصية' },
  f_terms: { en: 'Terms', ar: 'الشروط' },
  f_support: { en: 'Support', ar: 'الدعم' },

  k_pitch: { en: 'Pitch', ar: 'حدة الصوت' },
  k_char: { en: 'Character', ar: 'التحويل' },
  k_tone: { en: 'Tone', ar: 'النبرة' },
  k_echo: { en: 'Echo', ar: 'الصدى' },
  k_space: { en: 'Space', ar: 'المساحة' },
  k_grit: { en: 'Grit', ar: 'الخشونة' },
  k_wet: { en: 'Wet', ar: 'نسبة المزج' },
  k_out: { en: 'Out', ar: 'الخروج' },

  toast_pad: { en: 'Full sound plays inside the dubbingai app', ar: 'الصوت الكامل يعمل داخل تطبيق dubbingai' },
  toast_dl: { en: 'installer link not connected yet', ar: 'رابط التحميل غير مفعّل بعد' },
  toast_copy: { en: 'Checksum copied', ar: 'تم نسخ الكود' },
  toast_select: { en: 'Selected — press Ctrl+C', ar: 'تم التحديد — اضغطي Ctrl+C' },
};
const L = k => (STR[k] ? (STR[k][LANG] || STR[k].en) : k);

/* ───────── girl voice characters (drawn mascot icons — not real people) ───────── */
const PRESETS = [
  { id: 'luna', nk: 'v_luna', tk: 't_luna', c: ['#FFE3EC', '#FF9EC4'], ring: 50, band: false,
    face: `<path d="M10 30q0-20 22-20t22 20v6h-6l-2-5-2 5h-4l-1-4-1 4h-2l-2-4-2 4h-4l-2-5-2 5h-6z" fill="${INK}"/><circle cx="24" cy="34" r="4.3" fill="#fff"/><circle cx="40" cy="34" r="4.3" fill="#fff"/><circle cx="24.6" cy="35" r="1.9" fill="${INK}"/><circle cx="40.6" cy="35" r="1.9" fill="${INK}"/><path d="M19 30l-3-2M45 30l3-2" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><circle cx="18" cy="40" r="2.6" fill="#FF9EC4" opacity=".7"/><circle cx="46" cy="40" r="2.6" fill="#FF9EC4" opacity=".7"/><path d="M28 45q4 3 8 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>` },
  { id: 'nova', nk: 'v_nova', tk: 't_nova', c: ['#9FF0FF', '#6FA8FF'], ring: 55, band: false,
    face: `<path d="M24 5h5l1 6h-7z" fill="${INK}"/><circle cx="32" cy="5" r="3" fill="#FF9EC4"/><rect x="12" y="15" width="40" height="34" rx="13" fill="${INK}"/><rect x="19" y="26" width="10" height="7" rx="3" fill="#9FF0FF"/><rect x="35" y="26" width="10" height="7" rx="3" fill="#9FF0FF"/><path d="M18 24l-3-1.6M46 24l3-1.6" stroke="#9FF0FF" stroke-width="1.6" stroke-linecap="round"/><rect x="24" y="40" width="16" height="3" rx="1.5" fill="#fff" opacity=".6"/>` },
  { id: 'velvet', nk: 'v_velvet', tk: 't_velvet', c: ['#FFD37A', '#FF5C7A'], ring: 50, band: false,
    face: `<path d="M16 16l3 8 5-10 8 11 8-11 5 10 3-8-2 16H18z" fill="${INK}"/><circle cx="32" cy="36" r="17" fill="${INK}"/><path d="M23 33l6 3M41 33l-6 3" stroke="#FFD37A" stroke-width="2.6" stroke-linecap="round"/><path d="M24 45q8 5 16 0" stroke="#FF5C7A" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="19" cy="43" r="2" fill="#FFD37A"/><circle cx="45" cy="43" r="2" fill="#FFD37A"/>` },
  { id: 'pixie', nk: 'v_pixie', tk: 't_pixie', c: ['#FFF3A0', '#FF9EC4'], ring: 50, band: false,
    face: `<circle cx="13" cy="21" r="7.5" fill="${INK}"/><circle cx="51" cy="21" r="7.5" fill="${INK}"/><path d="M19 15q13-8 26 0" stroke="${INK}" stroke-width="5" fill="none"/><circle cx="32" cy="37" r="17" fill="${INK}"/><circle cx="25" cy="35" r="5.3" fill="#fff"/><circle cx="39" cy="35" r="5.3" fill="#fff"/><circle cx="26" cy="36" r="2.3" fill="${INK}"/><circle cx="40" cy="36" r="2.3" fill="${INK}"/><path d="M29 45q3 3 6 0" stroke="#FF9EC4" stroke-width="2.2" fill="none" stroke-linecap="round"/>` },
  { id: 'zara', nk: 'v_zara', tk: 't_zara', c: ['#B8FFCE', '#4FE0A8'], ring: 310, band: false,
    face: `<ellipse cx="17" cy="18" rx="4" ry="9" transform="rotate(-18 17 18)" fill="${INK}"/><ellipse cx="47" cy="18" rx="4" ry="9" transform="rotate(18 47 18)" fill="${INK}"/><ellipse cx="32" cy="34" rx="19" ry="22" fill="${INK}"/><ellipse cx="24" cy="34" rx="6.5" ry="4" transform="rotate(26 24 34)" fill="#B8FFCE"/><ellipse cx="40" cy="34" rx="6.5" ry="4" transform="rotate(-26 40 34)" fill="#B8FFCE"/><path d="M22 28l-2-3M42 28l2-3" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><rect x="28" y="46" width="8" height="2.3" rx="1.1" fill="#fff" opacity=".55"/>` },
  { id: 'static', nk: 'v_static', tk: 't_static', c: ['#E9FF8A', '#FFB84F'], ring: 50, band: true,
    face: `<path d="M40 5h5v14h-5z" fill="${INK}"/><rect x="16" y="17" width="32" height="38" rx="9" fill="${INK}"/><rect x="21" y="23" width="22" height="12" rx="3" fill="#E9FF8A"/><circle cx="26" cy="29" r="2.3" fill="${INK}"/><circle cx="38" cy="29" r="2.3" fill="${INK}"/><path d="M29 40q3 2 6 0" stroke="#FFB84F" stroke-width="2" fill="none" stroke-linecap="round"/><g fill="#fff" opacity=".4"><rect x="21" y="44" width="22" height="2.4" rx="1.2"/><rect x="21" y="49" width="22" height="2.4" rx="1.2"/></g>` },
  { id: 'wisp', nk: 'v_wisp', tk: 't_wisp', c: ['#DCE2FF', '#A79BFF'], ring: 6, band: false,
    face: `<path d="M14 56V30a18 18 0 0 1 36 0v26l-6-4.5-6 4.5-6-4.5-6 4.5-6-4.5z" fill="${INK}" opacity=".92"/><ellipse cx="25" cy="30" rx="3.3" ry="5.2" fill="#fff"/><ellipse cx="39" cy="30" rx="3.3" ry="5.2" fill="#fff"/><path d="M27 41q5 3 10 0" stroke="#A79BFF" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M12 22q4-10 20-10M52 22q-4-10-20-10" stroke="${INK}" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>` },
  { id: 'cipher', nk: 'v_cipher', tk: 't_cipher', c: ['#FF9EDB', '#9B7BFF'], ring: 30, band: false,
    face: `<path d="M8 58c0-25 10-47 24-47s24 22 24 47z" fill="${INK}"/><path d="M12 30q10-4 20-4t20 4v5q-10 5-20 5t-20-5z" fill="#fff"/><path d="M23 32.5l6 2M41 32.5l-6 2" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M26 47q6 4 12 0" stroke="#FF9EDB" stroke-width="2.2" fill="none" stroke-linecap="round"/>` },
];
const byId = id => PRESETS.find(p => p.id === id);
let avN = 0;
function avatar(p) {
  const g = 'av' + (++avN); // unique gradient id per instance avoids Chrome dropping fill on repeated <use>
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.c[0]}"/><stop offset="1" stop-color="${p.c[1]}"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="url(#${g})"/>${p.face}</svg>`;
}

/* ───────── visual-only "studio" params (no audio — these only drive shapes/colors) ───────── */
const DEFAULTS = {
  luna:   { pitch: 2, char: 0,  tone: 15,  echo: 0,  space: 10, grit: 0 },
  nova:   { pitch: -1, char: 80, tone: 10, echo: 10, space: 10, grit: 20 },
  velvet: { pitch: -6, char: 0,  tone: -45, echo: 0, space: 30, grit: 25 },
  pixie:  { pitch: 9,  char: 0,  tone: 35, echo: 0,  space: 10, grit: 0 },
  zara:   { pitch: 5,  char: 55, tone: 20, echo: 35, space: 20, grit: 10 },
  static: { pitch: 0,  char: 0,  tone: 10, echo: 0,  space: 0,  grit: 55 },
  wisp:   { pitch: -2, char: 30, tone: -10, echo: 45, space: 80, grit: 0 },
  cipher: { pitch: -4, char: 30, tone: -20, echo: 0,  space: 15, grit: 15 },
};
const P = { pitch: 0, char: 0, tone: 0, echo: 0, space: 0, grit: 0, wet: 100, out: 0 };
let cur = byId('cipher'), ringFreq = 30, previewOn = false, bypass = false;

/* ───────── knobs + faders (visual only) ───────── */
const sign = v => (v > 0 ? '+' : v < 0 ? '−' : '');
const KNOBS = [
  { k: 'pitch', nk: 'k_pitch', min: -12, max: 12, step: 1, bi: true, def: 0, fmt: v => sign(v) + Math.abs(v) + ' st' },
  { k: 'char', nk: 'k_char', min: 0, max: 100, step: 1, def: 0, fmt: v => v + '%' },
  { k: 'tone', nk: 'k_tone', min: -100, max: 100, step: 1, bi: true, def: 0, fmt: v => (v ? sign(v) + Math.abs(v) : '0') },
  { k: 'echo', nk: 'k_echo', min: 0, max: 100, step: 1, def: 0, fmt: v => v + '%' },
  { k: 'space', nk: 'k_space', min: 0, max: 100, step: 1, def: 0, fmt: v => v + '%' },
  { k: 'grit', nk: 'k_grit', min: 0, max: 100, step: 1, def: 0, fmt: v => v + '%' },
];
const FADERS = [
  { k: 'wet', nk: 'k_wet', min: 0, max: 100, step: 1, def: 100, fmt: v => v + '%' },
  { k: 'out', nk: 'k_out', min: -24, max: 6, step: .5, def: 0, fmt: v => sign(v) + Math.abs(v).toFixed(1) + ' dB' },
];
const controls = {};

function setParam(k, v) {
  const d = controls[k].d;
  v = clamp(Math.round(v / d.step) * d.step, d.min, d.max);
  if (v === P[k]) return;
  P[k] = v; controls[k].render();
  if (k === 'pitch') updateReadout();
  updateFXVals();
}
function bindDrag(el, d, sens) {
  let sy = 0, sv = 0;
  el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); sy = e.clientY; sv = P[d.k]; e.preventDefault(); el.focus({ preventScroll: true }); });
  el.addEventListener('pointermove', e => { if (el.hasPointerCapture(e.pointerId)) setParam(d.k, sv + (sy - e.clientY) / sens * (d.max - d.min)); });
  el.addEventListener('keydown', e => {
    const m = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }[e.key];
    if (m) { e.preventDefault(); setParam(d.k, P[d.k] + m * d.step); }
  });
  el.addEventListener('dblclick', () => setParam(d.k, d.def ?? 0));
}
function aria(el, d) {
  el.tabIndex = 0; el.setAttribute('role', 'slider'); el.setAttribute('aria-label', L(d.nk));
  el.setAttribute('aria-valuemin', d.min); el.setAttribute('aria-valuemax', d.max);
}
function makeKnob(d) {
  const el = document.createElement('div'); el.className = 'knob'; aria(el, d);
  el.innerHTML = `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" class="k-track" pathLength="100" stroke-dasharray="75 100" transform="rotate(135 32 32)"/><circle cx="32" cy="32" r="26" class="k-val" pathLength="100" stroke="url(#holoStroke)" transform="rotate(135 32 32)"/><circle cx="32" cy="32" r="19" class="k-cap" fill="url(#capFill)"/><line x1="32" y1="31" x2="32" y2="18" class="k-ptr"/></svg><span class="k-name"></span><span class="k-v"></span>`;
  const val = $('.k-val', el), ptr = $('.k-ptr', el), out = $('.k-v', el), name = $('.k-name', el);
  controls[d.k] = { d, nameEl: name, render() {
    const v = P[d.k], f = (v - d.min) / (d.max - d.min);
    const len = d.bi ? Math.abs(f - .5) * 75 : f * 75, start = d.bi ? (f >= .5 ? 37.5 : 37.5 - len) : 0;
    val.setAttribute('stroke-dasharray', `${len} 200`); val.setAttribute('stroke-dashoffset', -start);
    val.style.opacity = len < .5 ? 0 : 1;
    ptr.setAttribute('transform', `rotate(${-135 + 270 * f} 32 32)`);
    out.textContent = d.fmt(v); name.textContent = L(d.nk);
    el.setAttribute('aria-valuenow', v); el.setAttribute('aria-valuetext', d.fmt(v)); el.setAttribute('aria-label', L(d.nk));
  } };
  bindDrag(el, d, 170);
  return el;
}
function makeFader(d, host) {
  host.innerHTML = `<div class="fader" aria-orientation="vertical"><div class="f-track"><div class="f-fill"></div></div><div class="f-cap"></div></div><span class="k-name"></span><span class="k-v"></span>`;
  const el = $('.fader', host), fill = $('.f-fill', host), cap = $('.f-cap', host), out = $('.k-v', host), name = $('.k-name', host);
  aria(el, d);
  controls[d.k] = { d, nameEl: name, render() {
    const f = (P[d.k] - d.min) / (d.max - d.min);
    fill.style.height = f * 100 + '%'; cap.style.bottom = `calc(10px + ${f} * (100% - 20px))`;
    out.textContent = d.fmt(P[d.k]); name.textContent = L(d.nk);
    el.setAttribute('aria-valuenow', P[d.k]); el.setAttribute('aria-valuetext', d.fmt(P[d.k])); el.setAttribute('aria-label', L(d.nk));
  } };
  bindDrag(el, d, 140);
}
function relabelControls() { Object.values(controls).forEach(c => c.render()); }

/* ───────── studio UI wiring ───────── */
const orbitBtns = [];
function updateReadout() { $('#roName').textContent = L(cur.nk); $('#roPitch').textContent = sign(P.pitch) + Math.abs(P.pitch) + ' st'; }
function updateTransport() {
  $('#playBtn').textContent = previewOn ? L('preview_stop') : L('preview_play');
  $('#specBadge').classList.toggle('live', previewOn);
  $('#specText').textContent = previewOn ? L('live_text') + (bypass ? L('ab_a') : L(cur.nk)) : L('idle_text');
  $('#orbHint').textContent = previewOn ? L('playing_hint') : L('tap_hint');
  $('#heroPlayLbl').textContent = previewOn ? L('hero_stop') : L('hero_preview');
}
function applyPreset(p, wantPlay) {
  cur = p; Object.assign(P, DEFAULTS[p.id]); ringFreq = p.ring;
  relabelControls();
  $$('.vt, .orbit-btn').forEach(b => { const on = b.dataset.id === p.id; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  const i = PRESETS.indexOf(p) + 1;
  $('#stAv').innerHTML = avatar(p); $('#stName').textContent = L(p.nk); $('#stTag').textContent = L(p.tk); $('#stKey').textContent = 'Ctrl+' + i;
  $('#orbName').textContent = L(p.nk);
  orbTarget = p.c.map(hex2rgb);
  updateReadout(); updateTransport();
  if (wantPlay) { previewOn = true; updateTransport(); }
}
function relabelPresetChrome() {
  $$('.vt').forEach(b => { const p = byId(b.dataset.id); $('.vt-name', b).textContent = L(p.nk); });
  $$('.orbit-btn .tip').forEach(t => { const p = byId(t.closest('.orbit-btn').dataset.id); t.textContent = L(p.nk); });
  $('#stName').textContent = L(cur.nk); $('#stTag').textContent = L(cur.tk);
  $('#orbName').textContent = L(cur.nk);
  updateReadout(); updateTransport();
}

function buildStudio() {
  const vw = $('#voices'); vw.innerHTML = '';
  const orbit = $('#orbit'); orbit.innerHTML = ''; orbitBtns.length = 0;
  PRESETS.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'vt'; b.dataset.id = p.id;
    b.innerHTML = `${avatar(p)}<span class="vt-name"></span><kbd>Ctrl+${i + 1}</kbd>`;
    b.onclick = () => applyPreset(p, true);
    vw.append(b);
    const o = document.createElement('button');
    o.type = 'button'; o.className = 'orbit-btn'; o.dataset.id = p.id; o.setAttribute('aria-label', L(p.nk));
    o.innerHTML = `${avatar(p)}<span class="tip"></span>`;
    o.onclick = () => applyPreset(p, true);
    orbit.append(o); orbitBtns.push(o);
  });
  const kw = $('#knobs'); kw.innerHTML = '';
  KNOBS.forEach(d => kw.append(makeKnob(d)));
  makeFader(FADERS[0], $('#fdMix')); makeFader(FADERS[1], $('#fdOut'));
  FADERS.forEach(d => controls[d.k].render());
  relabelPresetChrome();
}

function wireStudioOnce() {
  $('#playBtn').onclick = togglePreview;
  $('#heroPlay').onclick = togglePreview;
  $('#orb').onclick = togglePreview;
  $('#surprise').onclick = () => { const p = PRESETS[Math.floor(Math.random() * PRESETS.length)]; applyPreset(p, true); };
  const setAB = byp => { bypass = byp; $('#abA').setAttribute('aria-pressed', byp); $('#abB').setAttribute('aria-pressed', !byp); updateTransport(); };
  $('#abA').onclick = () => setAB(true);
  $('#abB').onclick = () => setAB(false);
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    const i = '12345678'.indexOf(e.key);
    if (i >= 0) applyPreset(PRESETS[i], true);
  });
}
function togglePreview() { previewOn = !previewOn; updateTransport(); }

/* ───────── canvases: orb + spectrum + meters (procedural, not real audio) ───────── */
const orb = $('#orb'), octx = orb.getContext('2d'), spec = $('#spec'), sctx = spec.getContext('2d');
let osz = 0, ssz = { w: 0, h: 0 }, angle = 0, level = 0, orbVisible = true, specVisible = true;
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
let orbCol = PRESETS[7].c.map(hex2rgb), orbTarget = orbCol.map(c => c.slice());
const BARS = 72, peaks = new Float32Array(BARS);

function fit(cv, cx) {
  const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = Math.max(1, Math.round(r.width * dpr)); cv.height = Math.max(1, Math.round(r.height * dpr));
  cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return r;
}
function resize() { osz = fit(orb, octx).width; const r = fit(spec, sctx); ssz = { w: r.width, h: r.height }; }

function drawOrb(t) {
  const s = osz, cx = s / 2, cy = s / 2, R = s * .265;
  const jag = P.char / 100, dist = P.grit / 100, glow = 1 + P.space / 100 * .8;
  octx.clearRect(0, 0, s, s);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) orbCol[i][j] += (orbTarget[i][j] - orbCol[i][j]) * .06;
  const [a, b] = orbCol.map(c => c.map(Math.round).join(','));
  const g = octx.createRadialGradient(cx, cy, R * .5, cx, cy, R * (1.7 + level * .5) * glow);
  g.addColorStop(0, `rgba(${a},.4)`); g.addColorStop(1, `rgba(${a},0)`);
  octx.fillStyle = g; octx.fillRect(0, 0, s, s);
  octx.lineWidth = 1;
  octx.setLineDash([2, 7]); octx.strokeStyle = 'rgba(255,255,255,.09)';
  octx.beginPath(); octx.arc(cx, cy, s * .43, 0, Math.PI * 2); octx.stroke();
  octx.setLineDash([]);
  if (P.echo > 0) {
    octx.strokeStyle = `rgba(${b},${.1 + P.echo / 400})`;
    for (let e = 1; e <= 2; e++) { octx.beginPath(); octx.arc(cx, cy, R * (1.12 + e * .1 * (P.echo / 100 + .2)), 0, Math.PI * 2); octx.stroke(); }
  }
  octx.beginPath();
  const segs = 140;
  for (let i = 0; i <= segs; i++) {
    const th = i / segs * Math.PI * 2;
    const jagN = jag > .02 ? Math.round(6 + jag * 14) : 0;
    const facet = jagN ? Math.sin(th * jagN) * jag * .1 : 0;
    const noise = dist * .12 * Math.sin(th * 23 + t * .006);
    const r = R * (1 + .045 * Math.sin(3 * th + t * .0009) + .035 * Math.sin(5 * th - t * .0013) + facet + noise
      + level * (.17 * Math.sin(9 * th + t * .004) + .1 * Math.sin(13 * th - t * .003)));
    const x = cx + r * Math.cos(th), y = cy + r * Math.sin(th);
    i ? octx.lineTo(x, y) : octx.moveTo(x, y);
  }
  octx.closePath();
  const fg = octx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  fg.addColorStop(0, `rgb(${a})`); fg.addColorStop(1, `rgb(${b})`);
  octx.fillStyle = fg; octx.fill();
  const sh = octx.createRadialGradient(cx - R * .35, cy - R * .45, 0, cx - R * .35, cy - R * .45, R * 1.15);
  sh.addColorStop(0, 'rgba(255,255,255,.6)'); sh.addColorStop(.5, 'rgba(255,255,255,.06)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
  octx.fillStyle = sh; octx.fill();
}
function placeOrbit() {
  const s = osz, R = s * .43, n = orbitBtns.length;
  orbitBtns.forEach((b, i) => {
    const th = angle + i / n * Math.PI * 2 - Math.PI / 2;
    b.style.transform = `translate(${s / 2 + R * Math.cos(th)}px,${s / 2 + R * Math.sin(th)}px) translate(-50%,-50%)`;
  });
}
const LO = 80, HI = 14000, logx = f => Math.log(f / LO) / Math.log(HI / LO);
function drawSpec(t) {
  const { w, h } = ssz, base = h - 26, vals = new Float32Array(BARS), top = 30;
  sctx.clearRect(0, 0, w, h);
  const amp = previewOn ? (.3 + P.char / 160 + P.grit / 220) : .05;
  for (let i = 0; i < BARS; i++) {
    const wob = previewOn ? Math.abs(Math.sin(i * .4 + t * .004)) * .6 + Math.abs(Math.sin(i * .9 - t * .0025)) * .3 : .5 + .5 * Math.sin(i * .35 + t * .0015) ** 2;
    vals[i] = wob * amp;
  }
  const gap = 2, bw = (w - gap * (BARS - 1)) / BARS;
  const grad = sctx.createLinearGradient(0, base, 0, top);
  grad.addColorStop(0, '#8A7CFF'); grad.addColorStop(.6, '#FF6BD5'); grad.addColorStop(1, '#FFB86B');
  sctx.fillStyle = grad;
  for (let i = 0; i < BARS; i++) {
    const bh = Math.max(2, vals[i] * (base - top)); sctx.fillRect(i * (bw + gap), base - bh, bw, bh);
    peaks[i] = Math.max(vals[i], peaks[i] - .006);
  }
  sctx.fillStyle = 'rgba(255,255,255,.7)';
  for (let i = 0; i < BARS; i++) sctx.fillRect(i * (bw + gap), base - Math.max(2, peaks[i] * (base - top)) - 4, bw, 2);
  sctx.fillStyle = '#6A677E'; sctx.font = '500 10px "JetBrains Mono", Consolas, monospace'; sctx.textAlign = 'center';
  for (const [f, l] of [[100, '100 Hz'], [300, '300'], [1000, '1 kHz'], [3000, '3 kHz'], [10000, '10 kHz']])
    sctx.fillText(l, clamp(logx(f) * w, 24, w - 24), h - 9);
}
function frame(t) {
  const target = previewOn ? .55 + .35 * Math.sin(t * .0028) ** 2 : .08 + .04 * Math.sin(t * .0012);
  level += (target - level) * .12;
  const tt = reduceMotion ? 0 : t;
  if (!reduceMotion) angle += .0011;
  if (orbVisible) { drawOrb(tt); placeOrbit(); }
  if (specVisible) {
    drawSpec(tt);
    const l = Math.min(1, level * 1.25);
    $('#mL').style.height = (1 - l) * 100 + '%';
    $('#mR').style.height = (1 - l * (.9 + .1 * Math.sin(t * .01))) * 100 + '%';
  }
  requestAnimationFrame(frame);
}

/* ───────── tour (procedural screens, auto-rotate) ───────── */
function tourData() {
  return [
    { tabk: 'tab_lib', titlek: 'tt_lib', items: ['li_lib1', 'li_lib2', 'li_lib3'] },
    { tabk: 'tab_overlay', titlek: 'tt_overlay', items: ['li_ov1', 'li_ov2', 'li_ov3'] },
    { tabk: 'tab_board', titlek: 'tt_board', items: ['li_bd1', 'li_bd2', 'li_bd3'] },
    { tabk: 'tab_setup', titlek: 'tt_setup', items: ['li_st1', 'li_st2', 'li_st3'] },
  ];
}
let tIdx = 0;
function showTour(i) {
  tIdx = i;
  const T = tourData();
  $$('.ttab').forEach((b, j) => {
    b.setAttribute('aria-selected', j === i);
    const bar = $('.bar', b); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
  });
  $$('.screen').forEach(s => {
    const on = +s.dataset.s === i; s.hidden = !on;
    if (on) { s.classList.remove('screen-enter'); void s.offsetWidth; s.classList.add('screen-enter'); }
  });
  $('#shotTitle').textContent = L('studio_title') + ' — ' + L(T[i].tabk);
  $('#tourStep').textContent = `0${i + 1} / 0${T.length}`;
  $('#tourTitle').textContent = L(T[i].titlek);
  $('#tourList').innerHTML = T[i].items.map((k, j) => `<li><b>${j + 1}</b><span>${L(k)}</span></li>`).join('');
}
function buildTour() {
  const tabs = $('#tabs'); tabs.innerHTML = '';
  const tour = $('#tourEl');
  tourData().forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ttab'; b.setAttribute('role', 'tab');
    b.innerHTML = `<span class="ttxt">${L(s.tabk)}</span><span class="bar"></span>`;
    b.onclick = () => showTour(i);
    $('.bar', b).addEventListener('animationend', () => { if (tIdx === i) showTour((i + 1) % tourData().length); });
    tabs.append(b);
  });
  const pause = on => tour.classList.toggle('paused', on);
  tour.addEventListener('mouseenter', () => pause(true)); tour.addEventListener('mouseleave', () => pause(false));
  tour.addEventListener('focusin', () => pause(true)); tour.addEventListener('focusout', () => pause(false));

  const favs = ['nova', 'velvet'];
  $('#lib').innerHTML = PRESETS.map((p, i) => `<div class="lc">${avatar(p)}${favs.includes(p.id) ? '<span class="star">★</span>' : ''}${i === 1 ? '<span class="pin">2</span>' : ''}<div class="lc-row"><span>${L(p.nk)}</span><kbd>Ctrl+${i + 1}</kbd>${i === 2 ? '<span class="pin" style="top:-14px;right:-6px">3</span>' : ''}</div></div>`).join('');
  $('#ovAv').innerHTML = avatar(byId('velvet'));
  $('#toastAv').innerHTML = avatar(byId('nova'));

  $('#pads').innerHTML = PADS.map((d, i) => `<button type="button" class="pad" data-i="${i}" style="--pc:${d.c}"><span class="ripple"></span><span class="dot"></span><b></b><kbd>${d.k}</kbd>${i === 0 ? '<span class="pin">1</span>' : ''}</button>`).join('');
  relabelPads();
  $$('.pad').forEach(b => b.addEventListener('click', () => {
    b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit');
    toast(L('toast_pad'));
  }));
}
function relabelTour() {
  const T = tourData();
  $$('.ttab').forEach((b, i) => { $('.ttxt', b).textContent = L(T[i].tabk); });
  $('#lib').innerHTML && (($('#lib').querySelectorAll('.lc-row span')).forEach((el, i) => { el.textContent = L(PRESETS[i].nk); }));
  showTour(tIdx);
  relabelPads();
}

/* ───────── soundboard pads (visual ripple only — no sound) ───────── */
const PADS = [
  { nk: 'pad_horn', k: 'F1', c: '#FFB86B' },
  { nk: 'pad_gg', k: 'F2', c: '#46E2A0' },
  { nk: 'pad_bruh', k: 'F3', c: '#8A7CFF' },
  { nk: 'pad_drum', k: 'F4', c: '#FF6BD5' },
  { nk: 'pad_win', k: 'F5', c: '#FFD25A' },
  { nk: 'pad_laugh', k: 'F6', c: '#7CE7FF' },
  { nk: 'pad_boom', k: 'F7', c: '#FF4D5E' },
  { nk: 'pad_fail', k: 'F8', c: '#A09DB4' },
];
// voice character names + tags
STR.v_luna   = { en: 'Luna',   ar: 'لونا'   };  STR.t_luna   = { en: 'sweet & bright',    ar: 'حلوة ومشرقة' };
STR.v_nova   = { en: 'Nova',   ar: 'نوفا'   };  STR.t_nova   = { en: 'cool & robotic',    ar: 'باردة وروبوتية' };
STR.v_velvet = { en: 'Velvet', ar: 'فلفت'   };  STR.t_velvet = { en: 'deep & royal',      ar: 'عميقة وملكية' };
STR.v_pixie  = { en: 'Pixie',  ar: 'بكسي'   };  STR.t_pixie  = { en: 'tiny & cute',       ar: 'صغيرة ولطيفة' };
STR.v_zara   = { en: 'Zara',   ar: 'زارا'   };  STR.t_zara   = { en: 'fierce & wild',     ar: 'شرسة وجريئة' };
STR.v_static = { en: 'Static', ar: 'ستاتك'  };  STR.t_static = { en: 'glitchy & digital', ar: 'رقمية ومشوشة' };
STR.v_wisp   = { en: 'Wisp',   ar: 'وسب'    };  STR.t_wisp   = { en: 'ghostly & soft',    ar: 'شبحية وناعمة' };
STR.v_cipher = { en: 'Cipher', ar: 'سايفر'  };  STR.t_cipher = { en: 'mysterious & dark',  ar: 'غامضة ومظلمة' };

STR.pad_horn = { en: 'Air Horn', ar: 'بوق' };
STR.pad_gg = { en: 'GG', ar: 'GG' };
STR.pad_bruh = { en: 'Bruh', ar: 'برووه' };
STR.pad_drum = { en: 'Drum Roll', ar: 'طبول' };
STR.pad_win = { en: 'Victory', ar: 'فوز' };
STR.pad_laugh = { en: 'Laugh', ar: 'ضحكة' };
STR.pad_boom = { en: 'Boom', ar: 'بووم' };
STR.pad_fail = { en: 'Fail', ar: 'فشل' };
function relabelPads() { $$('.pad').forEach((b, i) => { $('b', b).textContent = L(PADS[i].nk); }); }

/* ───────── small widgets ───────── */
let toastT = 0;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 3200);
}
function buildWidgets() {
  const apps = ['Fortnite', 'Discord', 'Valorant', 'Counter-Strike 2', 'Roblox', 'TikTok LIVE', 'Zoom', 'OBS Studio'];
  $('#strip').innerHTML = [...apps, ...apps].map(a => `<span>${a}</span>`).join('');

  $$('.rng').forEach(r => { const upd = () => r.style.setProperty('--p', (r.value - r.min) / (r.max - r.min) * 100 + '%'); r.addEventListener('input', upd); upd(); });
  $('#sbVol').addEventListener('input', e => { $('#sbVolV').textContent = e.target.value + '%'; });
  const BUF = [64, 128, 256, 512, 1024];
  $('#bufRng').addEventListener('input', e => { const n = BUF[e.target.value]; $('#bufVal').textContent = `${n} smp · ${(n / 48).toFixed(1)} ms`; });
  $$('.tg').forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on);
    const v = b.parentElement.querySelector('.tgv'); if (v) v.textContent = on ? L('on_txt') : L('off_txt');
  }));
  $$('.seg').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', g).forEach(x => x.setAttribute('aria-pressed', x === b));
  }));

  $$('[data-ver]').forEach(e => (e.textContent = `v${CONFIG.version} · ${CONFIG.size}`));
  $$('.dl').forEach(a => {
    a.removeAttribute('href'); a.setAttribute('role', 'button'); a.tabIndex = 0;
    const go = e => {
      e.preventDefault();
      if (CONFIG.downloadUrl) location.href = CONFIG.downloadUrl; // no visible href, so no status-bar preview on hover
      else toast(`dubbingaiSetup-${CONFIG.version}.exe · ${CONFIG.size} — ${L('toast_dl')}`);
    };
    a.addEventListener('click', go);
    a.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(e); });
  });
  if (Number.isFinite(CONFIG.downloads)) {
    $$('[data-downloads]').forEach(e => (e.hidden = false));
    const N = CONFIG.downloads, t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / 1400), v = Math.round(N * (.94 + .06 * (1 - Math.pow(1 - k, 3))));
      $$('[data-count]').forEach(e => (e.textContent = v.toLocaleString('en-US')));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  if (CONFIG.sha256) {
    $('#shaRow').hidden = false; $('#shaVal').textContent = CONFIG.sha256;
    $('#shaCopy').onclick = async () => {
      try { await navigator.clipboard.writeText(CONFIG.sha256); toast(L('toast_copy')); }
      catch (_) { const r = document.createRange(); r.selectNodeContents($('#shaVal')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast(L('toast_select')); }
    };
  }
}

/* ───────── language switch ───────── */
function applyLang(lang) {
  LANG = lang;
  root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (STR[k]) el.innerHTML = STR[k][lang] || STR[k].en; });
  $$('.langsw button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
  buildStudio();
  buildTour();
  showTour(tIdx);
}
function wireLang() {
  $$('.langsw button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
}

/* ───────── mixer extras (solo/mute + val readout) ───────── */
function wireMixerExtras() {
  // patch render to mirror value into ch-val
  const wetCtrl = controls.wet, outCtrl = controls.out;
  if (wetCtrl) {
    const origWet = wetCtrl.render.bind(wetCtrl);
    wetCtrl.render = () => { origWet(); const e = $('#chWetV'); if (e) e.textContent = FADERS[0].fmt(P.wet); };
  }
  if (outCtrl) {
    const origOut = outCtrl.render.bind(outCtrl);
    outCtrl.render = () => { origOut(); const e = $('#chOutV'); if (e) e.textContent = FADERS[1].fmt(P.out); };
  }
  // initial values
  const wv = $('#chWetV'); if (wv) wv.textContent = FADERS[0].fmt(P.wet);
  const ov = $('#chOutV'); if (ov) ov.textContent = FADERS[1].fmt(P.out);

  // solo / mute
  $$('.ch-s').forEach(btn => btn.addEventListener('click', () => {
    const isSolo = btn.classList.toggle('active');
    // un-solo others
    if (isSolo) $$('.ch-s').forEach(b => { if (b !== btn) b.classList.remove('active'); });
  }));
  $$('.ch-m').forEach(btn => btn.addEventListener('click', () => {
    btn.classList.toggle('active');
  }));
}

/* ───────── ctrl tabs ───────── */
function wireCtrlTabs() {
  const tabs = $$('.ctab');
  const panels = { shape: $('#ctrlShape'), mix: $('#ctrlMix'), eq: $('#ctrlEQ'), fx: $('#ctrlFX') };
  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b => b.setAttribute('aria-selected', 'false'));
    btn.setAttribute('aria-selected', 'true');
    Object.values(panels).forEach(p => { if (p) p.hidden = true; });
    const p = panels[btn.dataset.tab]; if (p) { p.hidden = false; if (btn.dataset.tab === 'eq') drawEQ(); }
  }));
}

/* ───────── EQ canvas ───────── */
const EQ_BANDS = [
  { freq: 80,   gain: 0,   q: 0.7, label: '80Hz',  color: '#8A7CFF' },
  { freq: 250,  gain: 0,   q: 1.0, label: '250Hz', color: '#A07CFF' },
  { freq: 900,  gain: 4,   q: 1.4, label: '900Hz', color: '#FF6BD5' },
  { freq: 3500, gain: -2,  q: 1.2, label: '3.5k',  color: '#FF9EC4' },
  { freq: 8000, gain: 3,   q: 0.9, label: '8kHz',  color: '#FFB86B' },
];
function drawEQ() {
  const cv = $('#eqCv'); if (!cv) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const rect = cv.getBoundingClientRect();
  cv.width = rect.width * dpr; cv.height = rect.height * dpr;
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const W = rect.width, H = rect.height, mid = H / 2;
  const lo = Math.log10(30), hi = Math.log10(20000);
  const fx = f => (Math.log10(f) - lo) / (hi - lo) * W;
  // grid lines
  ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 1;
  [31.5,63,125,250,500,1000,2000,4000,8000,16000].forEach(f => {
    const x = Math.round(fx(f)) + .5; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  });
  [-12,-6,0,6,12].forEach(db => {
    const y = Math.round(mid - db / 18 * (H * .42)) + .5;
    ctx.strokeStyle = db === 0 ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.05)';
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  });
  // freq labels
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.font = '500 9px "JetBrains Mono",monospace'; ctx.textAlign = 'center';
  [100,500,1000,5000,10000].forEach(f => ctx.fillText(f >= 1000 ? f/1000+'k' : f, fx(f), H - 5));
  // EQ curve (sum of all bands, simplified Biquad response shape)
  ctx.beginPath();
  for (let px = 0; px < W; px++) {
    const f = Math.pow(10, lo + (px / W) * (hi - lo));
    let sum = 0;
    EQ_BANDS.forEach(b => {
      const dist = Math.abs(Math.log10(f / b.freq));
      sum += b.gain * Math.exp(-dist * dist * b.q * 3.5);
    });
    const y = mid - sum / 18 * (H * .42);
    px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
  }
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, '#8A7CFF'); grad.addColorStop(.5, '#FF6BD5'); grad.addColorStop(1, '#FFB86B');
  ctx.strokeStyle = grad; ctx.lineWidth = 2.2; ctx.stroke();
  // fill under curve
  ctx.lineTo(W, mid); ctx.lineTo(0, mid); ctx.closePath();
  const fill = ctx.createLinearGradient(0, 0, 0, H);
  fill.addColorStop(0, 'rgba(138,124,255,.18)'); fill.addColorStop(1, 'rgba(138,124,255,0)');
  ctx.fillStyle = fill; ctx.fill();
  // band handle dots
  EQ_BANDS.forEach(b => {
    const x = fx(b.freq), y = mid - b.gain / 18 * (H * .42);
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = b.color; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
  });
}
function buildEQBands() {
  const c = $('#eqBands'); if (!c) return;
  c.innerHTML = EQ_BANDS.map((b, i) => `<div class="eq-band">
    <div class="eq-band-gain" id="eqG${i}">${b.gain > 0 ? '+' : ''}${b.gain} dB</div>
    <div class="eq-band-knob" id="eqK${i}" style="--rot:${90 + b.gain / 18 * 135}deg" data-i="${i}"></div>
    <div class="eq-band-freq">${b.label}</div>
  </div>`).join('');
  // draggable gain knobs
  $$('.eq-band-knob').forEach(el => {
    let sy = 0, sg = 0, idx = +el.dataset.i;
    el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); sy = e.clientY; sg = EQ_BANDS[idx].gain; e.preventDefault(); });
    el.addEventListener('pointermove', e => {
      if (!el.hasPointerCapture(e.pointerId)) return;
      EQ_BANDS[idx].gain = clamp(Math.round(sg + (sy - e.clientY) / 70 * 18), -18, 18);
      const g = EQ_BANDS[idx].gain;
      el.style.setProperty('--rot', (90 + g / 18 * 135) + 'deg');
      $(`#eqG${idx}`).textContent = (g > 0 ? '+' : '') + g + ' dB';
      drawEQ();
    });
    el.addEventListener('dblclick', () => { EQ_BANDS[idx].gain = 0; el.style.setProperty('--rot', '90deg'); $(`#eqG${idx}`).textContent = '0 dB'; drawEQ(); });
  });
}

/* ───────── FX chain ───────── */
const FX_NODES = [
  { name: 'NOISE GATE',   val: '−40 dB', on: true  },
  { name: 'COMPRESSOR',   val: '4:1 · −18', on: true  },
  { name: 'PITCH SHIFT',  val: () => { const v = P.pitch; return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + ' st'; }, on: true },
  { name: 'DE-ESSER',     val: '3.5 kHz', on: false },
  { name: 'REVERB',       val: () => P.space + '%', on: true  },
  { name: 'LIMITER',      val: '−0.3 dBFS', on: true  },
];
function buildFXChain() {
  const c = $('#fxChain'); if (!c) return;
  c.innerHTML = FX_NODES.map((n, i) => {
    const val = typeof n.val === 'function' ? n.val() : n.val;
    return `<div class="fx-node ${n.on ? 'active' : 'bypassed'}" data-i="${i}">
      <div class="fx-bypass ${n.on ? 'on' : ''}" data-bp="${i}"></div>
      <span class="fx-name">${n.name}</span>
      <span class="fx-val" id="fxV${i}">${val}</span>
    </div>`;
  }).join('');
  $$('[data-bp]').forEach(el => el.addEventListener('click', () => {
    const i = +el.dataset.bp;
    FX_NODES[i].on = !FX_NODES[i].on;
    el.classList.toggle('on', FX_NODES[i].on);
    el.closest('.fx-node').classList.toggle('active', FX_NODES[i].on);
    el.closest('.fx-node').classList.toggle('bypassed', !FX_NODES[i].on);
  }));
}
function updateFXVals() {
  FX_NODES.forEach((n, i) => { if (typeof n.val === 'function') { const el = $(`#fxV${i}`); if (el) el.textContent = n.val(); } });
}

/* ───────── pan mini canvas ───────── */
function drawPan(id, pos) { // pos: -1 to 1
  const cv = $(`#${id}`); if (!cv) return;
  const W = cv.offsetWidth || 40, H = cv.offsetHeight || 14;
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = 'var(--panel3,#242435)';
  ctx.beginPath(); ctx.roundRect(0, H/2 - 2, W, 4, 2); ctx.fill();
  const cx = W/2 + pos * (W/2 - 4);
  ctx.fillStyle = pos === 0 ? '#A09DB4' : (pos < 0 ? '#8A7CFF' : '#FF6BD5');
  ctx.beginPath(); ctx.arc(cx, H/2, 4, 0, Math.PI*2); ctx.fill();
}
function initPans() { drawPan('panWet', 0); drawPan('panOut', 0); }


/* ───────── 3D win tilt ───────── */
function initWinTilt() {
  const win = document.querySelector('#studio .win');
  if (!win || window.matchMedia('(hover:none)').matches) return;
  const sec = document.querySelector('#studio');
  sec.addEventListener('mousemove', e => {
    const r = win.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const cx = clamp(dx, -1, 1), cy = clamp(dy, -1, 1);
    win.style.transform = `perspective(1400px) rotateY(${cx * 5}deg) rotateX(${-cy * 3.5}deg) translateZ(14px)`;
    win.style.boxShadow = `
      ${-cx * 28}px ${cy * 18}px 160px -40px rgba(0,0,0,.9),
      0 0 0 1px rgba(0,0,0,.5),
      ${cx > 0 ? cx * 20 : 0}px 0 100px -50px rgba(255,107,213,.45),
      ${cx < 0 ? -cx * 20 : 0}px 0 100px -50px rgba(138,124,255,.45)`;
  });
  sec.addEventListener('mouseleave', () => {
    win.style.transform = '';
    win.style.boxShadow = '';
  });
}

/* ───────── win-foot live stats ───────── */
function animateFooter() {
  let cpuBase = 3, latBase = 12.1;
  setInterval(() => {
    const cpuTarget = previewOn ? 8 + Math.random() * 6 : 2 + Math.random() * 3;
    cpuBase += (cpuTarget - cpuBase) * .3;
    const cpuEl = $('#wfCpu'); if (cpuEl) cpuEl.textContent = cpuBase.toFixed(0) + '%';
    latBase += (Math.random() - .5) * .2;
    latBase = clamp(latBase, 11.4, 13.2);
    const latEl = $('#wfLat'); if (latEl) latEl.textContent = latBase.toFixed(1);
    const hi = level > .7;
    ['#clipWet','#clipOut','#clipMeter'].forEach(sel => {
      const el = $(sel); if (!el) return;
      if (hi && previewOn && Math.random() > .65) {
        el.classList.add('hit'); setTimeout(() => el.classList.remove('hit'), 80);
      }
    });
  }, 400);

  // WET fader cap breathes with audio level when preview on
  const fdMixEl = $('#fdMix');
  const animFader = () => {
    if (fdMixEl && previewOn) {
      const cap = fdMixEl.querySelector('.f-cap');
      if (cap) {
        const f = (P.wet - 0) / 100; // 0..1
        const base = 10 + f * (fdMixEl.offsetHeight - 20 - 22);
        const breathe = level * 8 * Math.sin(performance.now() * .003);
        cap.style.bottom = `calc(${clamp(base + breathe, 10, fdMixEl.offsetHeight - 32)}px)`;
      }
    }
    requestAnimationFrame(animFader);
  };
  animFader();
}

/* ───────── social proof carousel ───────── */
function buildSocialProof() {
  const cards = $$('#spTrack .sp-card');
  const dotsWrap = $('#spDots');
  if (!cards.length || !dotsWrap) return;
  const total = cards.length;
  let idx = 0;

  // build dots
  cards.forEach((_, i) => {
    const d = document.createElement('span');
    d.addEventListener('click', () => goTo(i));
    dotsWrap.append(d);
  });

  function goTo(i) {
    idx = (i + total) % total;
    cards.forEach((c, j) => {
      const rel = j - idx;
      // normalise to -2..2 range for wrapping
      const pos = rel > 2 ? rel - total : rel < -2 ? rel + total : rel;
      c.dataset.pos = String(clamp(pos, -2, 2));
    });
    $$('#spDots span').forEach((d, j) => d.classList.toggle('active', j === idx));
  }

  goTo(0);

  $('#spPrev').addEventListener('click', () => goTo(idx - 1));
  $('#spNext').addEventListener('click', () => goTo(idx + 1));

  // click side cards to jump to them
  cards.forEach(c => c.addEventListener('click', () => {
    const pos = parseInt(c.dataset.pos, 10);
    if (pos !== 0) goTo(idx + pos);
  }));

  // auto-advance every 5s
  let timer = setInterval(() => goTo(idx + 1), 5000);
  const stage = document.querySelector('.sp-stage');
  if (stage) {
    stage.addEventListener('mouseenter', () => clearInterval(timer));
    stage.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(idx + 1), 5000); });
  }
}

/* ───────── boot ───────── */
wireLang();
buildStudio();
wireStudioOnce();
wireCtrlTabs();
wireMixerExtras();
buildTour();
buildWidgets();
buildEQBands();
buildFXChain();
buildSocialProof();
initPans();
applyPreset(cur, false);
showTour(0);
resize();
animateFooter();
initWinTilt();
new ResizeObserver(resize).observe($('#stage'));
new ResizeObserver(resize).observe($('.spec'));
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.target.id === 'stage') orbVisible = e.isIntersecting; else specVisible = e.isIntersecting;
}));
io.observe($('#stage')); io.observe($('.spec'));
requestAnimationFrame(frame);
