import type { Trip } from "@/types";

export const TRIP: Trip = {
  id: "anniversary-2026",
  title: "Among the Stars",
  subtitle: "Twenty-Eight Years",
  startDate: "2026-05-15",
  endDate: "2026-05-17",
  days: [
    // ─────────────────────────────────────────
    // DAY 1 — FRIDAY, MAY 15
    // ─────────────────────────────────────────
    {
      id: "day-1",
      dayNumber: 1,
      label: "Friday",
      date: "2026-05-15",
      events: [
        {
          id: "d1-e1",
          time: "10:00",
          title: "Depart Knoxville",
          type: "travel",
          description:
            "Leave South Knoxville by 10 AM. About 1 hour 15 minutes to the Sevierville area — easy drive through the foothills. No rush.",
          links: [
            {
              label: "Waze",
              href: "https://waze.com/ul?q=Sevierville+TN&navigate=yes",
              kind: "waze",
            },
          ],
          playlist: {
            id: "pl-drive-up",
            label: "For the drive up",
            mood: "Easy open-road energy",
            spotifyQuery: "road trip indie folk driving",
          },
        },

        {
          id: "d1-e2",
          time: "11:30",
          title: "Lunch in Downtown Sevierville",
          type: "restaurant",
          description:
            "Arrive in historic downtown Sevierville for a relaxed first lunch. Two good local options — pick your vibe.",
          options: [
            {
              id: "opt-local-goat",
              name: "The Local Goat",
              description:
                "Casual gastropub in the heart of historic downtown, steps from The Appalachian. Local sourcing, excellent burgers, craft beer — zero tourist trap energy.",
              links: [
                {
                  label: "Website",
                  href: "https://www.thelocalgoat.com",
                  kind: "website",
                },
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=The+Local+Goat+Sevierville+TN&navigate=yes",
                  kind: "waze",
                },
                {
                  label: "Call",
                  href: "tel:+18653663035",
                  kind: "phone",
                },
              ],
            },
            {
              id: "opt-five-oaks",
              name: "Five Oaks Farm Kitchen",
              description:
                "Legacy Southern restaurant rooted in the Ogle family's 1925 farm — griddle cakes, biscuits and gravy, chicken and waffles, and real Sevier County hospitality.",
              links: [
                {
                  label: "Website",
                  href: "https://fiveoaksfarmkitchen.com",
                  kind: "website",
                },
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=Five+Oaks+Farm+Kitchen+Sevierville+TN&navigate=yes",
                  kind: "waze",
                },
                {
                  label: "Call",
                  href: "tel:+18653651008",
                  kind: "phone",
                },
              ],
            },
          ],
        },

        {
          id: "d1-e3",
          time: "13:30",
          title: "Grocery Run — Provisions for the Weekend",
          type: "activity",
          description:
            "Stock up for Friday night dinner on the deck and anything else for the weekend. Publix on Winfield Dunn sits right on the route from downtown toward the resort.",
          links: [
            {
              label: "Waze",
              href: "https://waze.com/ul?q=Publix+750+Winfield+Dunn+Pkwy+Sevierville+TN&navigate=yes",
              kind: "waze",
            },
          ],
        },

        {
          id: "d1-e4",
          time: "18:00",
          title: "Check In — Stellara Resort",
          type: "lodging",
          description:
            "Arrive at golden hour. 85 acres in the Smoky Mountain foothills — private treehouse or mirror cabin with hot tub, fire pit, telescope, and BBQ on the deck.",
          note: "Check-in assistance available 4–7:30 PM. The access road is unlit gravel — arriving before dark makes settling in easier.",
          links: [
            {
              label: "Reservation Portal",
              href: "https://guest.ensoconnect.com/?auth=f7d54fe4",
              kind: "reserve",
            },
            {
              label: "Waze",
              href: "https://waze.com/ul?q=Stellara+Resort+1708+Minty+Way+Sevierville+TN&navigate=yes",
              kind: "waze",
            },
            {
              label: "Call",
              href: "tel:+18654135590",
              kind: "phone",
            },
          ],
        },

        {
          id: "d1-e5",
          time: "21:30",
          title: "A Night Among the Stars — The Tour",
          type: "activity",
          description:
            "Ten stops across the night sky — planets, stars, clusters, and galaxies — guided by a custom star tour built for this trip. Begins after dark. Runs roughly 90 minutes. The light arriving tonight from your anniversary star left in 1998.",
          note: "Star tour launches from the Pecan & Poplar app. Begin after dark when the sky is fully dark.",
          playlist: {
            id: "pl-star-tour",
            label: "Among the stars",
            mood: "Still, vast, and timeless",
            spotifyQuery: "ambient space drone instrumental",
          },
        },
      ],
    },

    // ─────────────────────────────────────────
    // DAY 2 — SATURDAY, MAY 16
    // ─────────────────────────────────────────
    {
      id: "day-2",
      dayNumber: 2,
      label: "Saturday",
      date: "2026-05-16",
      events: [
        {
          id: "d2-e1",
          time: "08:30",
          title: "Hen Wallow Falls — Gabes Mountain Trail",
          type: "activity",
          description:
            "A 4.4-mile moderate hike in the quieter Cosby section of Great Smoky Mountains National Park, ending at a 90-foot waterfall with a natural wading pool at the base. Lush hemlock and rhododendron forest, far fewer people than anything near Gatlinburg.",
          note: "Bring water shoes for the falls. A GSMNP parking tag is required — $5/day or $15/week. Purchase at the trailhead kiosk or online.",
          links: [
            {
              label: "NPS Trail Info",
              href: "https://www.nps.gov/grsm/planyourvisit/cosby.htm",
              kind: "website",
            },
            {
              label: "Waze",
              href: "https://waze.com/ul?q=Cosby+Picnic+Area+Cosby+TN&navigate=yes",
              kind: "waze",
            },
          ],
          playlist: {
            id: "pl-hike",
            label: "Morning on the trail",
            mood: "Steady, earthy, forward-moving",
            spotifyQuery: "hiking morning energy folk indie",
          },
        },

        {
          id: "d2-e2",
          time: "12:30",
          title: "Cool Down at Greenbrier",
          type: "activity",
          description:
            "On the drive back from Cosby, pull off along the Middle Fork of the Little Pigeon River for a post-hike wade. Greenbrier is a locals-only vibe — find a pull-off, walk down to the bank, let the cold mountain water do its thing.",
          links: [
            {
              label: "Waze",
              href: "https://waze.com/ul?q=Greenbrier+GSMNP+Gatlinburg+TN&navigate=yes",
              kind: "waze",
            },
          ],
          playlist: {
            id: "pl-creek",
            label: "Post-hike cool down",
            mood: "Warm, loose, drifting",
            spotifyQuery: "warm acoustic chill afternoon",
          },
        },

        {
          id: "d2-e3",
          time: "14:30",
          title: "Back at Stellara — Rest & Get Ready",
          type: "lodging",
          description:
            "Return to the resort. Hot tub, clean up, rest before dinner. You've earned it.",
          playlist: {
            id: "pl-afternoon",
            label: "Slow afternoon",
            mood: "Unhurried, soft, warm",
            spotifyQuery: "soft acoustic slow afternoon",
          },
        },

        {
          id: "d2-e4",
          time: "19:00",
          title: "Dinner at The Appalachian",
          type: "restaurant",
          description:
            "Contemporary Southern Appalachian cuisine in historic downtown Sevierville — farm-to-table, wood-burning hearth at the center of the kitchen, menu printed daily. Featured in Garden & Gun and Travel & Leisure.",
          note: "Reservation confirmed for 2 at 7:00 PM via Resy. Menu changes daily — no need to preview. Just show up hungry.",
          links: [
            {
              label: "Website",
              href: "https://theappalachianrestaurant.com",
              kind: "website",
            },
            {
              label: "Reservation",
              href: "https://www.resy.com",
              kind: "reserve",
            },
            {
              label: "Waze",
              href: "https://waze.com/ul?q=The+Appalachian+133+Bruce+Street+Sevierville+TN&navigate=yes",
              kind: "waze",
            },
            {
              label: "Call",
              href: "tel:+18655050245",
              kind: "phone",
            },
          ],
          playlist: {
            id: "pl-dinner",
            label: "Woodsmoke & candlelight",
            mood: "Intimate, slow-burning, Southern soul",
            spotifyQuery: "southern soul jazz intimate dinner",
          },
        },

        {
          id: "d2-e5",
          time: "21:30",
          title: "Evening Under the Stars",
          type: "activity",
          description:
            "Back at Stellara, the night is yours. Keep the star tour here if you saved it for tonight, or let the hot tub and fire pit do the work.",
          options: [
            {
              id: "opt-star-tour-sat",
              name: "Star Tour Tonight",
              description:
                "Launch the guided 10-stop telescope tour from the Pecan & Poplar app. Same experience as Friday — move it here if weather, energy, or vibe called for it. Begins after dark, runs ~90 minutes.",
              links: [],
            },
            {
              id: "opt-hot-tub",
              name: "Hot Tub & Fire Pit",
              description:
                "Skip the telescope. Pour something good, get in the hot tub, watch the sky without a plan. The resort's 85 dark acres do the rest.",
              links: [],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────
    // DAY 3 — SUNDAY, MAY 17
    // ─────────────────────────────────────────
    {
      id: "day-3",
      dayNumber: 3,
      label: "Sunday",
      date: "2026-05-17",
      events: [
        {
          id: "d3-e1",
          time: "09:00",
          title: "Breakfast at Sawyer's Farmhouse",
          type: "restaurant",
          description:
            "Locally owned farmhouse breakfast on the quieter Wears Valley Road — scratch-made pancakes, mountain berry crepes, biscuits and gravy, and genuinely warm service. A Sunday morning pace you won't find on the Parkway.",
          note: "Walk-in only, no reservations. Arrive by 9 to beat the wait. Open 7 AM – 2 PM.",
          links: [
            {
              label: "Website",
              href: "https://sawyersbreakfast.com",
              kind: "website",
            },
            {
              label: "Waze",
              href: "https://waze.com/ul?q=Sawyers+Farmhouse+862+Wears+Valley+Rd+Pigeon+Forge+TN&navigate=yes",
              kind: "waze",
            },
            {
              label: "Call",
              href: "tel:+18653661090",
              kind: "phone",
            },
          ],
          playlist: {
            id: "pl-sunday-breakfast",
            label: "Sunday morning ease",
            mood: "Warm coffee, slow tempo, no agenda",
            spotifyQuery: "sunday morning coffee slow jazz",
          },
        },

        {
          id: "d3-e2",
          time: "11:00",
          title: "Head Home",
          type: "travel",
          description:
            "About 1 hour 15 minutes back to South Knoxville. Take the scenic route through Wears Valley and Townsend if the mood is right — it adds maybe 20 minutes and it's worth it.",
          links: [
            {
              label: "Waze",
              href: "https://waze.com/ul?q=South+Knoxville+TN+37920&navigate=yes",
              kind: "waze",
            },
          ],
          playlist: {
            id: "pl-drive-home",
            label: "The long way home",
            mood: "Reflective, satisfied, roads you know",
            spotifyQuery: "mellow indie road trip homeward",
          },
        },
      ],
    },
  ],
};
