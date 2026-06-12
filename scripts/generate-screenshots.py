#!/usr/bin/env python3
"""
IDB-4B 截图生成脚本
使用 Playwright 生成 4 张截图：首页 + 3 个 Demo 页
"""

import asyncio
from playwright.async_api import async_playwright
from pathlib import Path

PAGES = [
    {
        "url": "https://conanxin.github.io/idea-to-demo-blueprints/",
        "output": "homepage.png",
        "full_page": True,
        "wait_ms": 3000,
    },
    {
        "url": "https://conanxin.github.io/idea-to-demo-blueprints/demos/project-memory-meeting-assistant/",
        "output": "demo-project-memory-meeting-assistant.png",
        "full_page": True,
        "wait_ms": 3000,
    },
    {
        "url": "https://conanxin.github.io/idea-to-demo-blueprints/demos/customer-meeting-autonomous-build/",
        "output": "demo-customer-meeting-autonomous-build.png",
        "full_page": True,
        "wait_ms": 3000,
    },
    {
        "url": "https://conanxin.github.io/idea-to-demo-blueprints/demos/multi-agent-project-dashboard/",
        "output": "demo-multi-agent-project-dashboard.png",
        "full_page": True,
        "wait_ms": 3000,
    },
]

OUTPUT_DIR = Path(__file__).parent.parent / "docs" / "media"


async def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        proxy = {"server": "socks5://127.0.0.1:7898"}
        browser = await p.chromium.launch(
            headless=True,
            executable_path="/usr/bin/chromium-browser",
            proxy=proxy,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--proxy-server=socks5://127.0.0.1:7898",
            ],
        )
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        )
        for page_spec in PAGES:
            page = await context.new_page()
            print(f"📸 {page_spec['url']}")
            try:
                await page.goto(page_spec["url"], timeout=60000, wait_until="domcontentloaded")
                await page.wait_for_timeout(page_spec["wait_ms"])
                out = OUTPUT_DIR / page_spec["output"]
                await page.screenshot(path=str(out), full_page=page_spec["full_page"])
                print(f"   ✅ {out}")
            except Exception as e:
                print(f"   ❌ Error: {e}")
            finally:
                await page.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())