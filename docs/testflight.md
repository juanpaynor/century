# TestFlight copy

Paste-ready text for App Store Connect. Keep the prototype disclaimers —
this build shows invented rates and loyalty values against a real hotel's
branding, and testers will not read the in-app fine print.

---

## Beta App Description
*App Store Connect → TestFlight → Test Information. Required for external
testing, optional for internal. Limit 4000 characters.*

Century Park Manila is a design prototype of a guest app for Century Park
Hotel Manila — the landmark hotel on P. Ocampo Street in Malate, marking its
50th year in 2026.

This is an early prototype for design review. It runs entirely on sample
data and is not connected to the hotel's systems. Nothing you do in this app
reaches Century Park Hotel: no reservation is made, no payment is taken, no
order is sent to a kitchen, and no charge is posted to any account.

What you can explore:

• Hotel — the home screen, current stay, hotel information and amenities
• Rooms — four room categories, a working date and guest picker, room detail
  with photography and a full rate breakdown
• Dine — the hotel's five outlets with opening hours, plus in-room dining
  with a working basket and order flow
• Elite Card — a digital version of the hotel's membership card, with a
  proposed loyalty points balance, a redemption catalogue and activity history
• My Stay — folio and charges, housekeeping and service requests, and account
  settings
• Digital key — a visual demonstration of unlocking a room

Please note:

• Room rates, loyalty point values and menu prices are placeholder figures
  chosen for demonstration. They are not Century Park Hotel's pricing.
• Loyalty points are a proposed concept and are not part of the hotel's
  current Elite Card programme.
• The digital key is a visual demonstration only. It does not communicate
  with any lock.
• Some flows are unfinished. Reserving a room and joining the Elite Card
  reach placeholder screens.
• Outlet opening hours, descriptions and photography are taken from
  centurypark.com.ph and are accurate at time of writing.

Feedback on layout, navigation, wording and visual design is what's most
useful at this stage.

---

## What to Test
*Per-build field. Also settable via: eas submit --what-to-test "..."*

First TestFlight build. Everything is new, so anything is worth reporting.

Most useful to check:

1. Home screen — does the hotel come across? Is anything cut off or
   overlapping on your device?
2. Rooms — open the date picker, choose a stay, and check the totals update
   correctly on the room detail screen.
3. Dine — open an outlet and confirm the "Open now / Closed" status matches
   the hours shown. Add items to an order and place it.
4. Elite Card — redeem a reward and check the balance and activity update.
5. My Stay — file a service request, then open the digital key and hold to
   unlock.
6. Tab bar — on iOS 26 it should shrink as you scroll down. Please report if
   it is hard to read on any screen.

Known and already on the list: Reserve, booking confirmation and Elite Card
sign-up are placeholder screens. Some room and food photography is stock.

---

## Feedback email
Set this to whoever is collecting notes.

## Beta App Review notes
*Only required for external testing.*

This is an internal design prototype for a client project. It contains no
account creation, no payments and no data collection. All content is sample
data held in memory; there is no backend. A demo guest profile is shown by
default, so no sign-in is required to review any screen.
