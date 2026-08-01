import { describe, expect, it } from "vitest";
import { determineFundingRoute } from "@/lib/eligibility";
import type { QualificationAnswers } from "@/lib/types";

const base: QualificationAnswers = {
  propertyLocation: "wales",
  ownershipStatus: "sole_owner",
  occupancyStatus: "main_residence",
  listedProperty: "no",
  newBuildUnderSixMonths: "no",
  mainsGasGrid: "no",
  existingHeating: "oil",
  propertyType: "detached_house",
  postcode: "CF10 1AA",
};

function answers(overrides: Partial<QualificationAnswers>): QualificationAnswers {
  return { ...base, ...overrides };
}

describe("determineFundingRoute", () => {
  // 1. Welsh owner-occupier, main residence, off-grid, oil.
  it("off-grid oil owner-occupier gets the enhanced BUS route, combined with Green Homes Wales (owner-occupier also qualifies for GHW)", () => {
    const result = determineFundingRoute(answers({ existingHeating: "oil", mainsGasGrid: "no" }));
    expect(result.fundingRoute).toBe("potential_both_routes");
  });

  // 2. Welsh owner-occupier, main residence, off-grid, LPG.
  it("off-grid LPG owner-occupier gets the combined enhanced BUS + GHW route", () => {
    const result = determineFundingRoute(answers({ existingHeating: "lpg", mainsGasGrid: "no" }));
    expect(result.fundingRoute).toBe("potential_both_routes");
  });

  // 3. Welsh owner-occupier on mains gas.
  it("owner-occupier on mains gas gets standard BUS combined with GHW", () => {
    const result = determineFundingRoute(answers({ existingHeating: "mains_gas", mainsGasGrid: "yes" }));
    expect(result.fundingRoute).toBe("potential_both_routes");
  });

  // 4. Welsh private landlord with oil.
  it("private landlord goes to manual review regardless of heating type", () => {
    const result = determineFundingRoute(answers({ ownershipStatus: "private_landlord", existingHeating: "oil" }));
    expect(result.fundingRoute).toBe("manual_review");
    expect(result.reasons.join(" ")).toMatch(/landlord/i);
  });

  // 5. Welsh listed property.
  it("listed property goes to manual review", () => {
    const result = determineFundingRoute(answers({ listedProperty: "yes" }));
    expect(result.fundingRoute).toBe("manual_review");
    expect(result.reasons.join(" ")).toMatch(/listed/i);
  });

  // 6. Welsh second home -- standard BUS only, GHW excluded by occupancy.
  it("second home on mains gas gets standard BUS but not Green Homes Wales", () => {
    const result = determineFundingRoute(
      answers({ occupancyStatus: "second_home", existingHeating: "mains_gas", mainsGasGrid: "yes" }),
    );
    expect(result.fundingRoute).toBe("potential_standard_bus");
  });

  // 7. Business-owned property.
  it("business-owned property may still get standard BUS but never Green Homes Wales", () => {
    const result = determineFundingRoute(
      answers({ ownershipStatus: "business_owned", occupancyStatus: "commercial", existingHeating: "coal" }),
    );
    expect(result.fundingRoute).toBe("potential_standard_bus");
  });

  // 8. Recent new build.
  it("new build within six months goes to manual review", () => {
    const result = determineFundingRoute(answers({ newBuildUnderSixMonths: "yes" }));
    expect(result.fundingRoute).toBe("manual_review");
    expect(result.reasons.join(" ")).toMatch(/new build/i);
  });

  // 9. Property outside Wales.
  it("property outside Wales is classified as outside the service area, overriding otherwise-strong BUS/GHW signals", () => {
    const result = determineFundingRoute(answers({ propertyLocation: "england" }));
    expect(result.fundingRoute).toBe("outside_welsh_service_area");
  });

  // 10. Missing/unusual answers.
  it("uncertain ownership status goes to manual review rather than a forced decision", () => {
    const result = determineFundingRoute(answers({ ownershipStatus: "other" }));
    expect(result.fundingRoute).toBe("manual_review");
  });

  // 11. Potential combined funding route (joint ownership variant).
  it("joint owner off-grid oil also produces the combined BUS + GHW route", () => {
    const result = determineFundingRoute(answers({ ownershipStatus: "joint_owner" }));
    expect(result.fundingRoute).toBe("potential_both_routes");
  });

  // 12. Manual-review route (existing heat pump).
  it("existing heat pump goes to manual review", () => {
    const result = determineFundingRoute(answers({ existingHeating: "existing_heat_pump" }));
    expect(result.fundingRoute).toBe("manual_review");
    expect(result.reasons.join(" ")).toMatch(/heat pump/i);
  });

  // Extra: tenants can't authorise works on a property they don't own, so
  // this must not silently fall into a BUS route just from their heating
  // answer -- exercises the "unlikely_eligible" branch.
  it("tenant on mains gas is unlikely eligible for either scheme", () => {
    const result = determineFundingRoute(
      answers({ ownershipStatus: "tenant", occupancyStatus: "rental_property", existingHeating: "mains_gas" }),
    );
    expect(result.fundingRoute).toBe("unlikely_eligible");
  });
});
