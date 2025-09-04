import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # --- Test Data ---
        plays_to_enter = ["1B", "E5", "2B"]
        manual_runs_to_enter = "5"
        expected_hits = 2
        expected_errors = 1

        # --- Dialog Handler ---
        page.on("dialog", lambda dialog: dialog.accept(plays_to_enter.pop(0) if plays_to_enter else ""))

        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # 1. Enter plays
        visitor_inning_boxes = page.locator('#visitor-body .inning-box')
        for i in range(len(plays_to_enter)):
             visitor_inning_boxes.nth(i).click()

        # 2. Enter manual runs
        visitor_manual_runs_input = page.locator('#visitor-body .manual-runs')
        visitor_manual_runs_input.fill(manual_runs_to_enter)

        # 3. Assert totals before reload
        visitor_total_row = page.locator('#visitor-body tr').last
        expect(visitor_total_row.locator('.total-hits')).to_have_text(str(expected_hits))
        expect(visitor_total_row.locator('.total-errors')).to_have_text(str(expected_errors))
        print("Pre-reload check OK.")

        # 4. Reload page
        page.reload()

        # 5. Assert totals and manual runs after reload
        reloaded_total_row = page.locator('#visitor-body tr').last
        reloaded_manual_runs = page.locator('#visitor-body .manual-runs')

        expect(reloaded_total_row.locator('.total-hits')).to_have_text(str(expected_hits))
        expect(reloaded_total_row.locator('.total-errors')).to_have_text(str(expected_errors))
        expect(reloaded_manual_runs).to_have_value(manual_runs_to_enter)
        print("Post-reload check OK.")

        # 6. Take screenshot
        page.screenshot(path="jules-scratch/verification/fix_verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
