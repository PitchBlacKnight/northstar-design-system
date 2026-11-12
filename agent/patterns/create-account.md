# Create account workflow

> NorthStar pattern. https://mikelrosenthal.com/northstar/#/patterns/create-account

A composed form showing entry, actionable validation and a success outcome on one surface. Synced from the Figma workflow showcase; all account values are demo data.

NORTHSTAR DS / COMPOSED WORKFLOW · 06 · Reviewed 04 Oct 2026
Open the workflow showcase in Figma ↗

**Form states**

Default, validation error and success, rebuilt with live NorthStar components. Tier uses the native Select, as the online forms pattern does.
Default · demo data

Create account

Add an account and set its billing preferences.
Required fields are marked *. Cancel leaves without creating an account; persistence rules require application decisions.
Validation error · demo data

Create account

Add an account and set its billing preferences.
Account not created
Check Billing email. Enter a complete address, then create the account again.
Required fields are marked *. Cancel leaves without creating an account; persistence rules require application decisions.
Success · demo data

Create account

Add an account and set its billing preferences.
Account created · demo outcome
Atlas Works is ready. Billing email and Growth tier are saved in this illustrative state.
Proposed success behavior: prevent duplicate submit while preserving the result. Next action: open the account record.

**01 Entry → validation recovery**

Evidence boundary
Online validation messages are example content, not verified server submission. These are composed design states, not a functioning prototype. No prototype interactions have been authored.

**02 Success / preserve the outcome**

ANNOTATED WALKTHROUGH · proposed application behavior

**03 Tier / composed options handoff**

DEMO OPTIONS · open composition
Figma specimen · Account tier options (Menu instance, 200x174)Menu with four overridden demo options: 'Starter', 'Growth', 'Enterprise', 'Custom' (14px, gray/1 #d0d0da). Container bg gray/9 #0f0f13, padding 4, gap 2, radius 8; first-row hover shown.
The actual Menu instance uses four overridden demo options. Its first-row hover is not a selected-value indicator. The form trigger text is Growth; open / selection controller behavior is proposed, not an existing Figma variant.
Deliberate difference from the online form
NorthStar’s forms pattern uses a native Select for Tier, not the custom Dropdown. This showcase uses the current Figma Dropdown recipe to demonstrate composition. Retain native Select online until the custom keyboard and ARIA gates are met.
https://mikelrosenthal.com/northstar/#/patterns/forms

**04 Handoff / property mapping**

No package, exporter, CI or submission service was verified. Form-state orchestration belongs to the application; @northstar/react examples remain advertised only.

**05 Accessibility / release acceptance**

- Names: associate Company name, Billing email, Tier and Send welcome kit labels with controls; helper and error IDs remain stable.
- Keyboard: logical field → preference → actions order. Custom Tier needs Arrow navigation, selection, Escape close, focus return and accurate aria-expanded.
- Validation: preserve entered values, show an actionable email message, link summary to invalid field and specify focus behavior after submit; avoid duplicate announcements.
- Feedback: status is polite by default; assertive only for urgent dynamic alerts. Banner appearance alone does not move focus; dismissal must actually remove it.
- Responsive: stack fields and actions when needed; retain recovery copy at 200% zoom and in long translations / RTL. Validate contrast, target size and forced colors.
- Before release: manual keyboard / screen-reader and visual tests, real submission / failure evidence, duplicate-submit policy and assigned owners. All gates remain required.
Ownership / status
Design, engineering, accessibility and release owners: Unassigned. Status: Source-reviewed / Partial parity. This static showcase does not change the website or deployment.
NORTHSTAR DS is the linked Figma library. NorthStar is the online documentation name. · Required before release
