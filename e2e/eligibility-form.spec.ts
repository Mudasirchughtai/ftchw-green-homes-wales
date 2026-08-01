import { expect, test } from "@playwright/test";
import { acceptEnquiryConsent, answerQualificationQuestions, fillContactDetails, fillPostcode } from "./helpers";

// No real Privyr credentials are used in any of these tests -- the local
// dev server runs without PRIVYR_WEBHOOK_URL configured, so submissions are
// only ever persisted to the local backup file, never sent to a real CRM.

test.describe("Full eligibility journey", () => {
  test("successful submission shows the thank-you state with a submission reference", async ({ page }) => {
    await page.goto("/green-homes-wales");
    await expect(page.getByRole("heading", { name: /Where is the property located/ })).toBeVisible();

    await answerQualificationQuestions(page);
    await fillPostcode(page);
    await fillContactDetails(page);
    await acceptEnquiryConsent(page);
    await page.getByRole("button", { name: "Submit My Enquiry" }).click();

    await expect(page.getByRole("heading", { name: /Thank you/ })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Submission reference:/)).toBeVisible();
  });

  test("back navigation preserves previously entered answers", async ({ page }) => {
    await page.goto("/green-homes-wales");
    await page.getByRole("button", { name: "Wales", exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Sole owner", exact: true }).click();

    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByRole("button", { name: "Wales", exact: true })).toHaveAttribute("aria-pressed", "true");
  });

  test("refreshing the page resumes from the same question with answers intact", async ({ page }) => {
    await page.goto("/green-homes-wales");
    await page.getByRole("button", { name: "Wales", exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Sole owner", exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await page.reload();
    await expect(page.getByRole("heading", { name: /How is the property occupied/ })).toBeVisible();
  });

  test("Continue is disabled until the current question is answered", async ({ page }) => {
    await page.goto("/green-homes-wales");
    await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
    await page.getByRole("button", { name: "Wales", exact: true }).click();
    await expect(page.getByRole("button", { name: "Continue" })).toBeEnabled();
  });

  test("invalid postcode shows an inline error and does not advance", async ({ page }) => {
    await page.goto("/green-homes-wales");
    await answerQualificationQuestions(page);
    await page.getByLabel("Postcode").fill("NOTAPOSTCODE");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText(/valid UK postcode/i)).toBeVisible();
    await expect(page.getByLabel("Postcode")).toBeVisible();
  });

  test("invalid phone and email show inline errors and do not advance", async ({ page }) => {
    await page.goto("/green-homes-wales");
    await answerQualificationQuestions(page);
    await fillPostcode(page);

    await page.getByLabel("Full name").fill("Test User");
    await page.getByLabel("Phone number").fill("123");
    await page.getByLabel("Email address").fill("not-an-email");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText(/valid UK phone number/i)).toBeVisible();
    await expect(page.getByText(/valid email address/i)).toBeVisible();
  });

  test("submission is blocked until enquiry consent is checked", async ({ page }) => {
    await page.goto("/green-homes-wales");
    await answerQualificationQuestions(page);
    await fillPostcode(page);
    await fillContactDetails(page);

    await expect(page.getByRole("button", { name: "Submit My Enquiry" })).toBeDisabled();
  });

  test("CRM/API failure keeps answers and offers a retry", async ({ page }) => {
    await page.route("**/api/leads/green-homes-wales", (route) =>
      route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ ok: false, errors: ["Delivery failed"] }) }),
    );

    await page.goto("/green-homes-wales");
    await answerQualificationQuestions(page);
    await fillPostcode(page);
    await fillContactDetails(page);
    await acceptEnquiryConsent(page);
    await page.getByRole("button", { name: "Submit My Enquiry" }).click();

    await expect(page.getByRole("alert").filter({ hasText: /kept/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();

    // The failure leaves the visitor on the consent screen (submit is only
    // one step forward from there) -- going Back twice reaches the contact
    // screen and confirms the answers were never wiped by the failure.
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Full name")).toHaveValue("Test User");
  });

  test("double-clicking submit does not create two requests", async ({ page }) => {
    let requestCount = 0;
    await page.route("**/api/leads/green-homes-wales", async (route) => {
      requestCount++;
      await new Promise((r) => setTimeout(r, 300));
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, fundingRoute: "manual_review", submissionId: "test" }) });
    });

    await page.goto("/green-homes-wales");
    await answerQualificationQuestions(page);
    await fillPostcode(page);
    await fillContactDetails(page);
    await acceptEnquiryConsent(page);

    const submitBtn = page.getByRole("button", { name: "Submit My Enquiry" });
    await submitBtn.click();
    // The label flips to "Submitting…" immediately, so this locator can no
    // longer resolve -- that's the double-submit guard working. Give it a
    // short bounded timeout rather than letting it eat the whole test
    // budget retrying for an element that will never reappear.
    await submitBtn.click({ force: true, timeout: 1_000 }).catch(() => {});

    await expect(page.getByRole("heading", { name: /Thank you/ })).toBeVisible({ timeout: 10_000 });
    expect(requestCount).toBe(1);
  });
});
