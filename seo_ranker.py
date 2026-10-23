#!/usr/bin/env python3
# seo_ranker.py — dubbingai.one
# Windows, Python 3.8+, stdlib only
# Usage: python seo_ranker.py [--fix] [--ping] [--schema] [--all]

import os, sys, re, json, time, hashlib, urllib.request, urllib.error, urllib.parse
from pathlib import Path
from datetime import datetime

SITE_ROOT = Path(__file__).parent
BASE_URL  = "https://dubbingai.one"
SITEMAP   = SITE_ROOT / "sitemap.xml"
INDEXNOW_KEY_FILE = "indexnow.txt"

URL_MAP = {
    "index.html":                               "/",
    "fortnite-voice-changer.html":              "/fortnite-voice-changer",
    "discord-voice-changer.html":               "/discord-voice-changer",
    "ai-voice-changer.html":                    "/ai-voice-changer",
    "privacy.html":                             "/privacy",
    "terms.html":                               "/terms",
    "support.html":                             "/support",
    "blog/index.html":                          "/blog/",
    "blog/voice-changer-valorant.html":         "/blog/voice-changer-valorant",
    "blog/voice-changer-roblox.html":           "/blog/voice-changer-roblox",
    "blog/anime-voice-changer.html":            "/blog/anime-voice-changer",
    "blog/girl-voice-changer.html":             "/blog/girl-voice-changer",
    "blog/voice-changer-streaming.html":        "/blog/voice-changer-streaming",
    "blog/free-voice-changer-no-account.html":  "/blog/free-voice-changer-no-account",
}

PAGE_META = {
    "index.html": {
        "title": "Dubbing AI - Free AI Voice Changer for Gaming & Discord",
        "desc":  "Dubbing AI is a free real-time AI voice changer for gaming. 8 girl voice presets, 12 ms latency. Works in Fortnite, Discord, Valorant. No account required.",
        "h1":    "Pick a voice. Sound like her.",
        "breadcrumb": [("Home", "/")],
    },
    "fortnite-voice-changer.html": {
        "title": "Fortnite Voice Changer - Free AI Girl Voice | Dubbing AI",
        "desc":  "Change your voice in Fortnite with AI. Free real-time voice changer, no account. Set dubbingai Virtual Mic as input in Fortnite audio settings.",
        "h1":    "Fortnite Voice Changer — Free AI Voice",
        "breadcrumb": [("Home", "/"), ("Fortnite Voice Changer", "/fortnite-voice-changer")],
        "article": True,
    },
    "discord-voice-changer.html": {
        "title": "Discord Voice Changer - Real-Time AI Voice | Dubbing AI",
        "desc":  "Change your voice on Discord in real time. Free AI voice changer, 12 ms latency, no account. Works with any Discord server.",
        "h1":    "Discord Voice Changer — Real-Time AI",
        "breadcrumb": [("Home", "/"), ("Discord Voice Changer", "/discord-voice-changer")],
        "article": True,
    },
    "ai-voice-changer.html": {
        "title": "AI Voice Changer - Free Real-Time Voice Changer | Dubbing AI",
        "desc":  "The best free AI voice changer for PC. 8 AI girl voice presets, works offline, no account required. Download for Windows 10/11.",
        "h1":    "Free AI Voice Changer for PC",
        "breadcrumb": [("Home", "/"), ("AI Voice Changer", "/ai-voice-changer")],
        "article": True,
    },
    "privacy.html": {
        "title": "Privacy Policy — Dubbing AI Voice Changer",
        "desc":  "Dubbing AI privacy policy. We do not collect voice data. All processing is local on your PC. Read our full privacy policy.",
        "h1":    "Privacy Policy",
        "breadcrumb": [("Home", "/"), ("Privacy Policy", "/privacy")],
    },
    "terms.html": {
        "title": "Terms of Service — Dubbing AI Voice Changer",
        "desc":  "Terms of service for Dubbing AI, the free real-time AI voice changer for Windows. Read before downloading.",
        "h1":    "Terms of Service",
        "breadcrumb": [("Home", "/"), ("Terms of Service", "/terms")],
    },
    "support.html": {
        "title": "Support — Dubbing AI Voice Changer Help",
        "desc":  "Get help with Dubbing AI voice changer. Setup guides, troubleshooting, Discord support, and FAQ for Windows users.",
        "h1":    "Support",
        "breadcrumb": [("Home", "/"), ("Support", "/support")],
    },
    "blog/index.html": {
        "title": "Voice Changer Guides & Tips — Dubbing AI Blog",
        "desc":  "Voice changer guides for gaming, Discord, Fortnite, Valorant, Roblox and streaming. Free AI voice changer tips and tutorials.",
        "h1":    "Voice Changer Guides",
        "breadcrumb": [("Home", "/"), ("Blog", "/blog/")],
    },
    "blog/voice-changer-valorant.html": {
        "title": "Valorant Voice Changer - Free AI Voice | Dubbing AI",
        "desc":  "Use a voice changer in Valorant with Dubbing AI. Free, no account, undetectable — works as a regular mic. No Vanguard ban risk.",
        "h1":    "Valorant Voice Changer — Free AI",
        "breadcrumb": [("Home", "/"), ("Blog", "/blog/"), ("Valorant Voice Changer", "/blog/voice-changer-valorant")],
        "article": True,
    },
    "blog/voice-changer-roblox.html": {
        "title": "Roblox Voice Changer - Free AI Voice | Dubbing AI",
        "desc":  "Change your voice in Roblox voice chat for free. Dubbing AI works as a regular mic — no ban risk, no account required.",
        "h1":    "Roblox Voice Changer — Free AI",
        "breadcrumb": [("Home", "/"), ("Blog", "/blog/"), ("Roblox Voice Changer", "/blog/voice-changer-roblox")],
        "article": True,
    },
    "blog/anime-voice-changer.html": {
        "title": "Anime Voice Changer - Free AI Anime Voice | Dubbing AI",
        "desc":  "Sound like an anime character in real time. Dubbing AI has sweet, royal and robotic anime voice presets. Free, no account.",
        "h1":    "Anime Voice Changer — Free AI",
        "breadcrumb": [("Home", "/"), ("Blog", "/blog/"), ("Anime Voice Changer", "/blog/anime-voice-changer")],
        "article": True,
    },
    "blog/girl-voice-changer.html": {
        "title": "Girl Voice Changer - Free AI Voice Changer | Dubbing AI",
        "desc":  "Change your voice to a girl voice in real time with AI. Free download, no account, works in any game or app on Windows.",
        "h1":    "Girl Voice Changer — Free AI",
        "breadcrumb": [("Home", "/"), ("Blog", "/blog/"), ("Girl Voice Changer", "/blog/girl-voice-changer")],
        "article": True,
    },
    "blog/voice-changer-streaming.html": {
        "title": "Voice Changer for Streaming - Free AI | Dubbing AI",
        "desc":  "The best voice changer for Twitch and YouTube streaming. Works with OBS, Streamlabs and TikTok LIVE Studio. Free, no account.",
        "h1":    "Voice Changer for Streaming — Free AI",
        "breadcrumb": [("Home", "/"), ("Blog", "/blog/"), ("Voice Changer for Streaming", "/blog/voice-changer-streaming")],
        "article": True,
    },
    "blog/free-voice-changer-no-account.html": {
        "title": "Free Voice Changer No Account - AI | Dubbing AI",
        "desc":  "Free AI voice changer with no account, no sign-up, no email. Download and use instantly on Windows 10/11.",
        "h1":    "Free Voice Changer — No Account Needed",
        "breadcrumb": [("Home", "/"), ("Blog", "/blog/"), ("Free Voice Changer No Account", "/blog/free-voice-changer-no-account")],
        "article": True,
    },
}

# ── schema builders ──────────────────────────────────────────────────────────

WEBSITE_SCHEMA = json.dumps({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Dubbing AI",
    "url": "https://dubbingai.one/",
    "description": "Free real-time AI voice changer for gaming. 8 girl voice presets. No account required.",
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://dubbingai.one/?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
    }
}, indent=2)

ORGANIZATION_SCHEMA = json.dumps({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dubbing AI",
    "url": "https://dubbingai.one/",
    "logo": "https://dubbingai.one/download.png",
    "sameAs": []
}, indent=2)

def breadcrumb_schema(crumbs: list) -> str:
    items = [
        {
            "@type": "ListItem",
            "position": i + 1,
            "name": name,
            "item": BASE_URL + path
        }
        for i, (name, path) in enumerate(crumbs)
    ]
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
    }, indent=2)

def article_schema(meta: dict, url: str) -> str:
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": meta["h1"],
        "description": meta["desc"],
        "url": url,
        "image": "https://dubbingai.one/og-image.png",
        "author": {"@type": "Organization", "name": "Dubbing AI"},
        "publisher": {
            "@type": "Organization",
            "name": "Dubbing AI",
            "logo": {"@type": "ImageObject", "url": "https://dubbingai.one/download.png"}
        },
        "dateModified": datetime.now().strftime("%Y-%m-%d")
    }, indent=2)

def inject_schema(html: str, schema_json: str) -> str:
    tag = f'\n<script type="application/ld+json">\n{schema_json}\n</script>\n'
    return re.sub(r'(</head>)', lambda m: tag + m.group(1), html, count=1, flags=re.IGNORECASE)

def has_schema_type(html: str, schema_type: str) -> bool:
    return f'"@type": "{schema_type}"' in html or f'"@type":"{schema_type}"' in html

# ── HTML helpers ──────────────────────────────────────────────────────────────

def set_meta_tag(html: str, name: str, content: str) -> str:
    content_esc = content.replace('"', '&quot;')
    pattern = rf'<meta\s+name="{re.escape(name)}"[^>]*/?>'
    replacement = f'<meta name="{name}" content="{content_esc}">'
    if re.search(pattern, html, re.IGNORECASE):
        return re.sub(pattern, replacement, html, flags=re.IGNORECASE)
    return re.sub(r'(<meta\s+charset[^>]*>)', rf'\1\n{replacement}', html, count=1, flags=re.IGNORECASE)

def set_title(html: str, title: str) -> str:
    t = title.replace('<', '&lt;').replace('>', '&gt;')
    if re.search(r'<title>', html, re.IGNORECASE):
        return re.sub(r'<title>[^<]*</title>', f'<title>{t}</title>', html, flags=re.IGNORECASE)
    return re.sub(r'(<head[^>]*>)', rf'\1\n<title>{t}</title>', html, count=1, flags=re.IGNORECASE)

def set_canonical(html: str, url: str) -> str:
    tag = f'<link rel="canonical" href="{url}">'
    if re.search(r'<link\s+rel="canonical"', html, re.IGNORECASE):
        return re.sub(r'<link\s+rel="canonical"[^>]*/?>',  tag, html, flags=re.IGNORECASE)
    return re.sub(r'(</head>)', rf'{tag}\n\1', html, count=1, flags=re.IGNORECASE)

def add_hreflang(html: str, url_path: str) -> str:
    if 'hreflang' in html:
        return html
    tags = (
        f'<link rel="alternate" hreflang="en" href="{BASE_URL}{url_path}">\n'
        f'<link rel="alternate" hreflang="ar" href="{BASE_URL}{url_path}?lang=ar">\n'
        f'<link rel="alternate" hreflang="x-default" href="{BASE_URL}{url_path}">'
    )
    return re.sub(r'(<link\s+rel="canonical"[^>]*/?>)', rf'\1\n{tags}', html, count=1, flags=re.IGNORECASE)

def ensure_h1(html: str, h1_text: str) -> str:
    def filler(m):
        inner = re.sub(r'<[^>]+>', '', m.group(2)).strip()
        if inner:
            return m.group(0)
        return f'{m.group(1)}{h1_text}{m.group(3)}'
    return re.sub(r'(<h1[^>]*>)(.*?)(</h1>)', filler, html, flags=re.IGNORECASE | re.DOTALL)

def ensure_og_tags(html: str, meta: dict, url: str) -> str:
    title_esc = meta["title"].replace('"', '&quot;')
    desc_esc  = meta["desc"].replace('"', '&quot;')
    if 'og:title' not in html:
        og = (
            f'<meta property="og:type" content="website">\n'
            f'<meta property="og:url" content="{url}">\n'
            f'<meta property="og:title" content="{title_esc}">\n'
            f'<meta property="og:description" content="{desc_esc}">\n'
            f'<meta property="og:image" content="{BASE_URL}/og-image.png">\n'
            f'<meta name="twitter:card" content="summary_large_image">\n'
            f'<meta name="twitter:title" content="{title_esc}">\n'
            f'<meta name="twitter:description" content="{desc_esc}">\n'
            f'<meta name="twitter:image" content="{BASE_URL}/og-image.png">'
        )
        html = re.sub(r'(</head>)', rf'{og}\n\1', html, count=1, flags=re.IGNORECASE)
    return html

# ── patcher ───────────────────────────────────────────────────────────────────

def patch_file(rel_path: str, add_schema: bool = False) -> tuple:
    meta = PAGE_META.get(rel_path)
    if not meta:
        return False, [f"no meta config"]
    path = SITE_ROOT / rel_path
    if not path.exists():
        return False, ["file not found"]

    html = path.read_text(encoding="utf-8", errors="ignore")
    original = html
    url = BASE_URL + URL_MAP.get(rel_path, "/" + rel_path)

    html = set_title(html, meta["title"])
    html = set_meta_tag(html, "description", meta["desc"])
    html = set_meta_tag(html, "robots", "index, follow")
    html = set_canonical(html, url)
    html = add_hreflang(html, URL_MAP.get(rel_path, "/"))
    html = ensure_h1(html, meta["h1"])
    html = ensure_og_tags(html, meta, url)

    if add_schema:
        # BreadcrumbList — every page
        if meta.get("breadcrumb") and not has_schema_type(html, "BreadcrumbList"):
            html = inject_schema(html, breadcrumb_schema(meta["breadcrumb"]))

        # Article — blog/feature pages
        if meta.get("article") and not has_schema_type(html, "Article"):
            html = inject_schema(html, article_schema(meta, url))

        # WebSite + Organization — homepage only
        if rel_path == "index.html":
            if not has_schema_type(html, "WebSite"):
                html = inject_schema(html, WEBSITE_SCHEMA)
            if not has_schema_type(html, "Organization"):
                html = inject_schema(html, ORGANIZATION_SCHEMA)

    changed = html != original
    if changed:
        path.write_text(html, encoding="utf-8")
    return changed, []

# ── audit ─────────────────────────────────────────────────────────────────────

def audit_file(rel_path: str) -> dict:
    path = SITE_ROOT / rel_path
    if not path.exists():
        return {"file": rel_path, "exists": False, "score": 0, "issues": ["FILE NOT FOUND"]}
    html = path.read_text(encoding="utf-8", errors="ignore")

    title   = re.search(r'<title>([^<]*)</title>', html, re.IGNORECASE)
    desc    = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', html, re.IGNORECASE)
    canon   = re.search(r'<link\s+rel="canonical"\s+href="([^"]*)"', html, re.IGNORECASE)
    h1_tags = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.IGNORECASE | re.DOTALL)
    schemas = re.findall(r'"@type"\s*:\s*"([^"]+)"', html)
    robots  = re.search(r'<meta\s+name="robots"\s+content="([^"]*)"', html, re.IGNORECASE)
    hrefl   = 'hreflang' in html
    og      = 'og:title' in html

    title_t = title.group(1).strip() if title else ""
    desc_t  = desc.group(1).strip() if desc else ""
    h1_texts = [re.sub(r'<[^>]+>', '', h).strip() for h in h1_tags]
    h1_clean = [h for h in h1_texts if h]

    issues, score = [], 100
    if not title_t:                     issues.append("no <title>"); score -= 20
    elif len(title_t) < 30:             issues.append(f"title short ({len(title_t)})"); score -= 5
    elif len(title_t) > 65:             issues.append(f"title long ({len(title_t)})"); score -= 3
    if not desc_t:                      issues.append("no meta description"); score -= 15
    elif len(desc_t) < 80:              issues.append(f"desc short ({len(desc_t)})"); score -= 5
    elif len(desc_t) > 160:             issues.append(f"desc long ({len(desc_t)})"); score -= 3
    if not canon:                       issues.append("no canonical"); score -= 8
    if not h1_clean:                    issues.append("no H1"); score -= 15
    if len(h1_clean) > 1:               issues.append(f"multiple H1 ({len(h1_clean)})"); score -= 5
    if not schemas:                     issues.append("no schema.org"); score -= 10
    if "BreadcrumbList" not in schemas: issues.append("no BreadcrumbList"); score -= 5
    if not hrefl:                       issues.append("no hreflang"); score -= 5
    if not og:                          issues.append("no OG tags"); score -= 5
    if robots and "noindex" in robots.group(1).lower(): issues.append("NOINDEX!"); score -= 50

    return {
        "file": rel_path, "exists": True, "score": max(0, score),
        "title": title_t, "desc": desc_t[:80] + "…" if len(desc_t) > 80 else desc_t,
        "h1": h1_clean[0] if h1_clean else "", "schema": list(set(schemas)),
        "hreflang": hrefl, "og": og, "issues": issues,
    }

# ── pings ─────────────────────────────────────────────────────────────────────

def ensure_indexnow_key() -> str:
    p = SITE_ROOT / INDEXNOW_KEY_FILE
    if p.exists():
        k = p.read_text().strip()
        if k: return k
    k = hashlib.md5(BASE_URL.encode()).hexdigest()
    p.write_text(k)
    return k

def http_post(url: str, data: bytes, headers: dict, label: str) -> bool:
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=12) as r:
            print(f"  [{label}] {r.status}")
            return r.status in (200, 202)
    except urllib.error.HTTPError as e:
        print(f"  [{label}] HTTP {e.code}")
        return False
    except Exception as e:
        print(f"  [{label}] {e}")
        return False

def http_get(url: str, label: str) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=12) as r:
            print(f"  [{label}] {r.status}")
            return r.status == 200
    except urllib.error.HTTPError as e:
        print(f"  [{label}] HTTP {e.code}")
        return False
    except Exception as e:
        print(f"  [{label}] {e}")
        return False

def ping_indexnow(urls: list) -> bool:
    key = ensure_indexnow_key()
    payload = json.dumps({
        "host": BASE_URL.replace("https://", ""),
        "key": key,
        "keyLocation": f"{BASE_URL}/{INDEXNOW_KEY_FILE}",
        "urlList": urls,
    }).encode()
    ok = http_post("https://api.indexnow.org/indexnow", payload,
                   {"Content-Type": "application/json; charset=utf-8"}, "IndexNow")
    # also hit Bing directly
    http_post("https://www.bing.com/indexnow", payload,
              {"Content-Type": "application/json; charset=utf-8"}, "IndexNow/Bing")
    # Yandex
    http_post("https://yandex.com/indexnow", payload,
              {"Content-Type": "application/json; charset=utf-8"}, "IndexNow/Yandex")
    return ok

def ping_pingomatic() -> bool:
    """XML-RPC ping to Ping-O-Matic — broadcasts to 20+ blog/feed directories."""
    xml = (
        '<?xml version="1.0"?>'
        '<methodCall><methodName>weblogUpdates.extendedPing</methodName>'
        '<params>'
        f'<param><value><string>Dubbing AI - Free AI Voice Changer</string></value></param>'
        f'<param><value><string>{BASE_URL}/</string></value></param>'
        f'<param><value><string>{BASE_URL}/</string></value></param>'
        f'<param><value><string>{BASE_URL}/sitemap.xml</string></value></param>'
        '</params></methodCall>'
    ).encode()
    ok = http_post("http://rpc.pingomatic.com/", xml,
                   {"Content-Type": "text/xml"}, "Ping-O-Matic")
    return ok

def ping_sitemap_yandex() -> bool:
    url = f"https://webmaster.yandex.ru/ping?sitemap={urllib.parse.quote(BASE_URL + '/sitemap.xml')}"
    return http_get(url, "Yandex sitemap")

def ping_fetcher_io(urls: list) -> bool:
    """Submit URLs to Fetcher.io free ping service."""
    for url in urls[:5]:  # free tier limit
        encoded = urllib.parse.quote(url)
        http_get(f"https://www.pingler.com/ping/?url={encoded}", "Pingler")
        time.sleep(0.3)
    return True

def submit_free_directories() -> None:
    """Submit site to free web directories that accept GET submissions."""
    site_enc = urllib.parse.quote(BASE_URL)
    name_enc = urllib.parse.quote("Dubbing AI - Free AI Voice Changer for Gaming")
    desc_enc = urllib.parse.quote("Free real-time AI voice changer for gaming. 8 girl voice presets. Works in Fortnite, Discord, Valorant. No account required.")

    submissions = [
        # Ping services
        f"https://pingler.com/ping/?url={site_enc}",
        f"https://www.pingmylinks.com/ping/?url={site_enc}",
        f"https://www.feedburner.com/fb/a/pingSubmit?bloglink={site_enc}",
        # RSS/blog pings
        f"https://rpc.weblogs.com/RPC2",
        f"https://ping.blogs.yam.com/",
    ]
    count = 0
    for url in submissions:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=8) as r:
                if r.status < 400:
                    count += 1
        except Exception:
            pass
    print(f"  [Directories] pinged {count}/{len(submissions)} services")

# ── sitemap ───────────────────────────────────────────────────────────────────

def update_sitemap():
    if not SITEMAP.exists():
        return
    today = datetime.now().strftime("%Y-%m-%d")
    xml = SITEMAP.read_text(encoding="utf-8")
    updated = re.sub(r'<lastmod>[^<]+</lastmod>', f'<lastmod>{today}</lastmod>', xml)
    if updated != xml:
        SITEMAP.write_text(updated, encoding="utf-8")
        print(f"  [Sitemap]  lastmod → {today}")

# ── report ────────────────────────────────────────────────────────────────────

def print_report(results: list):
    print("\n" + "═" * 66)
    print("  SEO REPORT — dubbingai.one")
    print("═" * 66)
    total   = len(results)
    passing = sum(1 for r in results if r.get("score", 0) >= 90)
    avg     = sum(r.get("score", 0) for r in results) / total if total else 0

    for r in sorted(results, key=lambda x: x.get("score", 0)):
        s   = r.get("score", 0)
        bar = "█" * (s // 10) + "░" * (10 - s // 10)
        flag = "✓" if s >= 90 else ("~" if s >= 70 else "✗")
        print(f"\n  {flag} [{bar}] {s:3d}  {r['file']}")
        t = r.get("title", "")
        if t: print(f"       title  : {t[:62]}")
        h = r.get("h1", "")
        if h: print(f"       h1     : {h[:62]}")
        sc = r.get("schema", [])
        if sc: print(f"       schema : {', '.join(sc[:6])}")
        for issue in r.get("issues", []):
            print(f"       ⚠  {issue}")

    print(f"\n  Pages   : {total}")
    print(f"  ≥ 90    : {passing}/{total}")
    print(f"  Average : {avg:.0f}/100")
    print("═" * 66 + "\n")

# ── main ──────────────────────────────────────────────────────────────────────

def main():
    args     = sys.argv[1:]
    do_fix   = "--fix"    in args or "--all" in args
    do_ping  = "--ping"   in args or "--all" in args
    do_schema= "--schema" in args or "--all" in args

    if not args:
        print("python seo_ranker.py [--fix] [--schema] [--ping] [--all]")
        print("  --fix     patch title/desc/canonical/H1/hreflang/OG")
        print("  --schema  inject BreadcrumbList/Article/WebSite schema")
        print("  --ping    IndexNow + Bing + Yandex + Ping-O-Matic + directories")
        print("  --all     everything\n")

    files = list(URL_MAP.keys())

    print("\n[*] Auditing...")
    results = [audit_file(f) for f in files]
    for r in results:
        print(f"    {r['score']:3d}  {r['file']}")

    if do_fix or do_schema:
        print("\n[*] Patching...")
        update_sitemap()
        for f in files:
            changed, errs = patch_file(f, add_schema=do_schema)
            if errs:    print(f"    skip   {f} — {', '.join(errs)}")
            elif changed: print(f"    fixed  {f}")
            else:         print(f"    ok     {f}")

        print("\n[*] Re-auditing...")
        results = [audit_file(f) for f in files]

    if do_ping:
        print("\n[*] Pinging search engines...")
        key = ensure_indexnow_key()
        print(f"  [Key]      {key} → serve at {BASE_URL}/{INDEXNOW_KEY_FILE}")
        all_urls = [BASE_URL + p for p in URL_MAP.values()]
        ping_indexnow(all_urls)
        time.sleep(1)
        ping_pingomatic()
        time.sleep(1)
        ping_sitemap_yandex()
        time.sleep(1)
        submit_free_directories()

    print_report(results)


if __name__ == "__main__":
    main()
