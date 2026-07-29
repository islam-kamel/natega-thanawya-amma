import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        print("Navigating to localhost:3000...")
        await page.goto("http://localhost:3000")
        await page.wait_for_selector("input")
        print("Page loaded successfully.")
        
        print("Searching for Arabic name...")
        await page.fill("input", "احمد")
        await page.wait_for_selector(".ResultCard_card__X9D6y", timeout=5000)
        
        cards = await page.locator(".ResultCard_card__X9D6y").count()
        print(f"Found {cards} result cards on the screen.")
        
        await browser.close()

asyncio.run(main())
