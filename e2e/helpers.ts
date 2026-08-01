import type { Page } from "@playwright/test";

/** Answers all 8 single-choice qualification questions with a consistent
 * "happy path" answer set (Welsh owner-occupier, off-grid oil, detached
 * house), then leaves the test on the postcode screen (question 9). */
export async function answerQualificationQuestions(page: Page) {
  const answers = [
    "Wales",
    "Sole owner",
    "Main residence",
    "No", // listed property
    "No", // new build
    "No", // mains gas grid
    "Oil",
    "Detached house",
  ];
  for (const label of answers) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();
  }
}

export async function fillPostcode(page: Page, postcode = "CF10 1AA") {
  await page.getByLabel("Postcode").fill(postcode);
  await page.getByRole("button", { name: "Continue" }).click();
}

export async function fillContactDetails(
  page: Page,
  { fullName = "Test User", phone = "07911123456", email = "test@example.com" } = {},
) {
  await page.getByLabel("Full name").fill(fullName);
  await page.getByLabel("Phone number").fill(phone);
  await page.getByLabel("Email address").fill(email);
  await page.getByRole("button", { name: "Continue" }).click();
}

export async function acceptEnquiryConsent(page: Page) {
  await page.getByRole("checkbox").first().check();
}
