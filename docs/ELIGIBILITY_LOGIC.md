# Eligibility Logic

Implemented in [`lib/eligibility.ts`](../lib/eligibility.ts), covered by
[`lib/eligibility.test.ts`](../lib/eligibility.test.ts).

This is an **indicative marketing eligibility tool**, not a formal grant
decision engine. It never states a guaranteed outcome -- see
`components/eligibility-form/routeMessages.ts` for the exact non-committal
wording shown for each route.

## Inputs

`QualificationAnswers` (see `lib/types.ts`):

- `propertyLocation` — wales / england / scotland / northern_ireland / other
- `ownershipStatus` — sole_owner / joint_owner / private_landlord /
  social_landlord / business_owned / tenant / other
- `occupancyStatus` — main_residence / second_home / holiday_home /
  rental_property / commercial / other
- `listedProperty` — yes / no / not_sure
- `newBuildUnderSixMonths` — yes / no
- `mainsGasGrid` — yes / no / not_sure
- `existingHeating` — mains_gas / oil / lpg / coal / direct_electric /
  storage_heaters / existing_heat_pump / other
- `propertyType` — detached_house / semi_detached_house / terraced_house /
  bungalow / flat / maisonette / other
- `postcode`

## Decision order

1. **Outside Wales** → `outside_welsh_service_area`, unconditionally,
   regardless of how strong the BUS/GHW signals otherwise are. This service
   only operates in Wales, even though the Boiler Upgrade Scheme itself
   covers England too.

2. **Manual review triggers** (checked next, before any route logic) — any
   one of these is enough:
   - `listedProperty` is `yes` or `not_sure`
   - `newBuildUnderSixMonths` is `yes`
   - `ownershipStatus` is `private_landlord` or `social_landlord`
   - `ownershipStatus` or `occupancyStatus` is `other` (uncertain)
   - `existingHeating` is `existing_heat_pump` or `other`
   - `propertyType` is `other`

   These mirror CLAUDE.md's original manual-review list (listed / new build
   / landlord / existing heat pump / uncertain ownership). Second homes,
   holiday homes, rental properties, commercial and business-owned
   properties are **not** manual-review triggers — they're clear-cut, not
   ambiguous, so they're handled by clean route logic instead (see below).

3. **Green Homes Wales eligibility** (`ghwEligible`):
   `ownershipStatus` is `sole_owner` or `joint_owner` **and**
   `occupancyStatus` is `main_residence`. Anything else (second home,
   holiday home, rental, commercial, business-owned, tenant) fails this
   cleanly.

4. **Boiler Upgrade Scheme eligibility** — independent of GHW, with one
   ownership gate:
   - A **tenant** cannot authorise or receive a grant for a property they
     don't own, so `ownershipStatus === "tenant"` blocks *both* BUS tiers
     regardless of heating type. Without this gate, a tenant would still
     land in a BUS route purely from their heating answer, which is wrong.
   - **Enhanced tier**: `existingHeating` is `oil` or `lpg` **and**
     `mainsGasGrid === "no"`.
   - **Standard tier**: `existingHeating` is `mains_gas`, `coal`,
     `direct_electric`, `storage_heaters`, or oil/LPG **while still on the
     gas grid** (not enhanced-eligible, but still a valid replacement).

5. **Combine**:
   - BUS route + GHW eligible → `potential_both_routes`
   - Enhanced BUS only → `potential_enhanced_bus`
   - Standard BUS only → `potential_standard_bus`
   - GHW only → `potential_green_homes_wales`
   - Neither → `unlikely_eligible`

## Why owner-occupiers with qualifying heating often show "both routes"

`sole_owner`/`joint_owner` + `main_residence` is exactly the Green Homes
Wales gate, so **any** owner-occupier who also has BUS-qualifying heating
will show the combined route, not just BUS. This is intentional, not a
double-counting bug: a Welsh owner-occupier genuinely may have access to
both schemes, and the combined-route copy already tells them that
"the installer, finance provider and relevant scheme administrators must
confirm eligibility and compatibility" — it does not claim they're
receiving both.

## Business-owned properties

`business_owned` is excluded from Green Homes Wales (individual ownership
only) but is **not** an automatic manual-review trigger or BUS exclusion —
the Boiler Upgrade Scheme's stated criteria in this tool don't gate on
ownership type beyond the tenant case above. If the business wants BUS-only
eligibility to also require manual review, add `business_owned` to the
manual-review trigger list in `lib/eligibility.ts`.

## Funding route → Privyr label mapping

See `lib/privyrFieldLabels.ts` and `docs/PRIVYR_SETUP.md` for the exact,
case-sensitive display strings sent to Privyr for each `FundingRoute` value.
