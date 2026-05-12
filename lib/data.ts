import type { Trip } from "@/types";

// ─────────────────────────────────────────────────────────────
//  TRIP DATA  — replace with real details when ready
//  Dates, names, links, confirmation numbers all TBD
// ─────────────────────────────────────────────────────────────
export const TRIP: Trip = {
  id: "anniversary-2026",
  title: "Anniversary",
  subtitle: "A weekend for two",
  startDate: "2026-06-06",
  endDate:   "2026-06-08",

  days: [
    // ══════════════════════════════════════════════════
    //  DAY 1 — FRIDAY
    // ══════════════════════════════════════════════════
    {
      id: "day-1",
      dayNumber: 1,
      label: "Friday",
      date: "2026-06-06",
      events: [
        {
          id: "d1-e1",
          time: "15:00",
          title: "Hit the road",
          type: "travel",
          description: "About two hours. Snacks loaded. Aux cord is yours.",
          links: [
            { label: "Waze to hotel", href: "https://waze.com/ul?q=The+Blossom+Inn+Charlottesville+VA&navigate=yes", kind: "waze" },
          ],
          playlist: {
            id: "pl-drive-up",
            label: "For the drive up",
            mood: "indie folk road trip feel-good",
            spotifyQuery: "indie folk road trip",
          },
        },
        {
          id: "d1-e2",
          time: "17:00",
          title: "The Blossom Inn",
          type: "lodging",
          description: "123 Garden Lane, Suite 12. Ask for the corner room — views of the courtyard.",
          note: "Confirmation #BL-8847 · Early check-in requested · Soaking tub in room",
          links: [
            { label: "Hotel website", href: "#", kind: "website" },
            { label: "Waze", href: "https://waze.com/ul?q=123+Garden+Lane+Charlottesville+VA&navigate=yes", kind: "waze" },
            { label: "(540) 555-0172", href: "tel:+15405550172", kind: "phone" },
          ],
        },
        {
          id: "d1-e3",
          time: "18:30",
          title: "Wander downtown",
          type: "activity",
          description: "The pedestrian mall is walkable from the hotel. No agenda — just the two of you.",
          links: [
            { label: "Waze to mall", href: "https://waze.com/ul?q=Downtown+Mall+Charlottesville+VA", kind: "waze" },
          ],
        },
        {
          id: "d1-e4",
          time: "19:30",
          title: "Friday night dinner",
          type: "restaurant",
          description: "Choose on the night — both solid options.",
          options: [
            {
              id: "opt-harvest",
              name: "Harvest Table",
              description: "Farm-to-table, seasonal menu. Cozy, candlelit, unhurried.",
              links: [
                { label: "Waze", href: "https://waze.com/ul?q=Harvest+Table+Charlottesville", kind: "waze" },
                { label: "Menu", href: "#", kind: "menu" },
                { label: "Reserve", href: "#", kind: "reserve" },
              ],
            },
            {
              id: "opt-oak",
              name: "Oak & Vine",
              description: "Wine bar + small plates. Good for lingering over bottles.",
              links: [
                { label: "Waze", href: "https://waze.com/ul?q=Oak+and+Vine+Wine+Bar+Charlottesville", kind: "waze" },
                { label: "Menu", href: "#", kind: "menu" },
                { label: "Reserve", href: "#", kind: "reserve" },
              ],
            },
          ],
          playlist: {
            id: "pl-friday-dinner",
            label: "Dinner soundtrack",
            mood: "romantic jazz dinner candlelight",
            spotifyQuery: "romantic jazz dinner candlelight",
          },
        },
      ],
    },

    // ══════════════════════════════════════════════════
    //  DAY 2 — SATURDAY
    // ══════════════════════════════════════════════════
    {
      id: "day-2",
      dayNumber: 2,
      label: "Saturday",
      date: "2026-06-07",
      events: [
        {
          id: "d2-e1",
          time: "09:00",
          title: "The Morning Standard",
          type: "restaurant",
          description: "No rush. Great coffee, avocado toast, fresh pastries. Walk-in friendly.",
          links: [
            { label: "Waze", href: "https://waze.com/ul?q=The+Morning+Standard+Charlottesville", kind: "waze" },
            { label: "Menu", href: "#", kind: "menu" },
          ],
          playlist: {
            id: "pl-morning",
            label: "Slow morning",
            mood: "slow morning acoustic coffee",
            spotifyQuery: "slow morning acoustic coffee",
          },
        },
        {
          id: "d2-e2",
          time: "11:00",
          title: "Botanical Garden Tour",
          type: "activity",
          description: "Guided 90-minute walk through the heritage gardens. Comfortable shoes.",
          note: "Tickets confirmed for two · QR code on your phones",
          links: [
            { label: "Waze", href: "https://waze.com/ul?q=Lewis+Ginter+Botanical+Garden", kind: "waze" },
            { label: "Garden site", href: "#", kind: "website" },
            { label: "Tickets", href: "#", kind: "tickets" },
          ],
        },
        {
          id: "d2-e3",
          time: "13:00",
          title: "Provisions Market",
          type: "restaurant",
          description: "Deli + wine shop. Build your own lunch — charcuterie, bread, cheese. Eat outside.",
          links: [
            { label: "Waze", href: "https://waze.com/ul?q=Provisions+Market+Charlottesville", kind: "waze" },
            { label: "Website", href: "#", kind: "website" },
          ],
        },
        {
          id: "d2-e4",
          time: "15:00",
          title: "Cedar Ridge Winery",
          type: "activity",
          description: "Private tasting for two — six pours, charcuterie board. Ask for the terrace.",
          note: "3:00pm reservation confirmed · Request the terrace seats",
          links: [
            { label: "Waze", href: "https://waze.com/ul?q=Cedar+Ridge+Winery+Virginia", kind: "waze" },
            { label: "Winery site", href: "#", kind: "website" },
          ],
          playlist: {
            id: "pl-winery",
            label: "Wine afternoon",
            mood: "bossa nova afternoon wine terrace",
            spotifyQuery: "bossa nova afternoon relaxed",
          },
        },
        {
          id: "d2-e5",
          time: "19:00",
          title: "Eloise",
          type: "restaurant",
          description: "The centerpiece of the weekend. Tasting menu, optional wine pairing. Dress nicely.",
          note: "7:00pm reservation confirmed · Anniversary noted in the booking",
          links: [
            { label: "Waze", href: "https://waze.com/ul?q=Eloise+Restaurant+Charlottesville", kind: "waze" },
            { label: "Menu", href: "#", kind: "menu" },
            { label: "Reservation", href: "#", kind: "reserve" },
          ],
          playlist: {
            id: "pl-anniversary-dinner",
            label: "The big night",
            mood: "romantic anniversary dinner elegant",
            spotifyQuery: "romantic dinner elegant jazz anniversary",
          },
        },
      ],
    },

    // ══════════════════════════════════════════════════
    //  DAY 3 — SUNDAY
    // ══════════════════════════════════════════════════
    {
      id: "day-3",
      dayNumber: 3,
      label: "Sunday",
      date: "2026-06-08",
      events: [
        {
          id: "d3-e1",
          time: "10:00",
          title: "Check-out — The Blossom Inn",
          type: "lodging",
          description: "Late check-out until 11am. Bags can stay at the front desk.",
          links: [
            { label: "(540) 555-0172", href: "tel:+15405550172", kind: "phone" },
          ],
        },
        {
          id: "d3-e2",
          time: "11:00",
          title: "Birch & Grain",
          type: "restaurant",
          description: "Unhurried Sunday brunch. Famous for the brioche french toast and bloody marys.",
          links: [
            { label: "Waze", href: "https://waze.com/ul?q=Birch+and+Grain+Charlottesville", kind: "waze" },
            { label: "Menu", href: "#", kind: "menu" },
          ],
          playlist: {
            id: "pl-brunch",
            label: "Sunday brunch",
            mood: "sunday brunch jazz soul warm",
            spotifyQuery: "sunday brunch jazz soul",
          },
        },
        {
          id: "d3-e3",
          time: "13:30",
          title: "Scenic Overlook Walk",
          type: "activity",
          description: "Easy 45-min loop. Sweeping views, good light for photos. Bring water.",
          links: [
            { label: "Waze", href: "https://waze.com/ul?q=Humpback+Rocks+Overlook+Virginia", kind: "waze" },
            { label: "Trail info", href: "#", kind: "website" },
          ],
        },
        {
          id: "d3-e4",
          time: "15:30",
          title: "Head home",
          type: "travel",
          description: "~2 hours. Playlist vol. 2. Happy anniversary.",
          links: [
            { label: "Waze home", href: "https://waze.com/ul?q=home&navigate=yes", kind: "waze" },
          ],
          playlist: {
            id: "pl-drive-home",
            label: "The drive home",
            mood: "nostalgic sunday drive indie warm",
            spotifyQuery: "nostalgic sunday drive indie",
          },
        },
      ],
    },
  ],
};
