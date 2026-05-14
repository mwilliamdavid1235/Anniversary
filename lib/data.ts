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
          title: "Depart Knoxville",
          type: "travel",
          description:
            "Leave South Knoxville by 10 AM and head toward the peaceful side of the Smokies. No rush — the drive itself is part of the transition.",
          links: [
            {
              label: "Waze",
              href: "https://waze.com/ul?q=Townsend+TN&navigate=yes",
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
          title: "Lunch in Townsend",
          type: "restaurant",
          description:
            "Ease into the mountains on the peaceful side of the Smokies before heading deeper into the park. Slower roads, river views, and a calmer pace than anything near the Parkway.",
          options: [
            {
              id: "opt-peaceful-side-fri",
              name: "Peaceful Side Social",
              description:
                "Modern casual spot with local beer, pizza, and open-air seating. Good if the day starts later.",
              links: [
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=Peaceful+Side+Social+Townsend+TN&navigate=yes",
                  kind: "waze",
                },
              ],
            },
            {
              id: "opt-apple-valley",
              name: "Apple Valley Cafe",
              description:
                "Relaxed mountain café with strong coffee, scratch breakfast, and garden patio seating.",
              links: [
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=Apple+Valley+Cafe+Townsend+TN&navigate=yes",
                  kind: "waze",
                },
              ],
            },
            {
              id: "opt-riverstone",
              name: "Riverstone Family Restaurant",
              description:
                "Classic Southern breakfast and warm mountain-town hospitality.",
              links: [
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=Riverstone+Family+Restaurant+Townsend+TN&navigate=yes",
                  kind: "waze",
                },
              ],
            },
            {
              id: "opt-artistic-bean",
              name: "The Artistic Bean",
              description:
                "Slow coffeehouse atmosphere with lighter breakfast and lunch options.",
              links: [
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=The+Artistic+Bean+Townsend+TN&navigate=yes",
                  kind: "waze",
                },
              ],
            },
          ],
        },

        {
          id: "d1-e3",
          title: "Porters Creek Trail",
          type: "activity",
          description:
            "One of the quieter corners of the Smokies — huge trees, creek crossings, old stone walls, historic homesteads, and Fern Branch Falls tucked into the forest at the end. Walk at your own pace and turn around whenever it feels right.",
          note: "Moderate trail, roughly 4–4.5 miles round trip if completed fully. Parking tag required ($5/day).",
          links: [
            {
              label: "AllTrails",
              href: "https://www.alltrails.com/trail/us/tennessee/porters-creek-trail",
              kind: "website",
            },
            {
              label: "Waze",
              href: "https://waze.com/ul?q=Greenbrier+Trailhead+Gatlinburg+TN&navigate=yes",
              kind: "waze",
            },
          ],
          playlist: {
            id: "pl-porters-creek",
            label: "Into the forest",
            mood: "Quiet, green, unhurried",
            spotifyQuery: "quiet forest folk acoustic walking",
          },
        },

        {
          id: "d1-e4",
          title: "Provisions Stop",
          type: "activity",
          description:
            "Pick up wine, snacks, breakfast things, and anything you want for a quiet evening at the cabin before heading to Stellara. Publix at Valley Forge is right on the route from Porters Creek — you'll pass it on the Parkway before turning toward Stellara.",
          links: [
            {
              label: "Waze",
              href: "https://waze.com/ul?q=Publix+2656+Parkway+Pigeon+Forge+TN+37863&navigate=yes",
              kind: "waze",
            },
          ],
          note: "Publix at Valley Forge Shopping Center — 2656 Parkway, Pigeon Forge.",
          bailouts: [
            {
              id: "bail-skip-grocery",
              name: "Skip it — go straight to Stellara",
              description:
                "If the grocery run feels like too much after a long trail day, head straight to the resort. Grab essentials at Food City on the way — quick in-and-out, no experience required.",
              links: [
                {
                  label: "Food City — Waze",
                  href: "https://waze.com/ul?q=Food+City+1414+Dolly+Parton+Pkwy+Sevierville+TN&navigate=yes",
                  kind: "waze",
                },
              ],
            },
          ],
        },

        {
          id: "d1-e5",
          title: "Check In — Stellara Resort",
          type: "lodging",
          description:
            "Arrive at Stellara and settle in slowly. Hot tub, mountain air, quiet woods, and nowhere else to be.",
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
          id: "d1-e6",
          title: "Connection Activity",
          type: "experience",
          description:
            "A guided shared experience built around thoughtful questions, memories, intimacy, laughter, and honest conversation. Pour something good, get comfortable, and see where the night takes you together.",
          links: [
            {
              label: "Open Connection Guide",
              href: "/connection",
              kind: "connection",
            },
          ],
        },

        {
          id: "d1-e7",
          title: "Dinner on the Deck",
          type: "experience",
          description:
            "Keep the first night simple. Grill something easy, open a bottle of wine, and let the mountain air do the work.",
        },

        {
          id: "d1-e8",
          title: "After Dark — A Night Among the Stars",
          type: "activity",
          description:
            "Ten stops across the night sky — planets, stars, clusters, and galaxies — guided by a custom star tour built for this trip. Begins after dark.",
          note: "Begin after dark when the sky is fully dark.",
          links: [
            {
              label: "Launch Star Tour",
              href: "/starmap.html",
              kind: "star-tour",
            },
          ],
          bailouts: [
            {
              id: "bail-star-move",
              name: "Move it to Saturday night",
              description:
                "If it's cloudy, cold, or she's tired after a long trail day — don't push it. Saturday evening is already set up as an option in the app. Light a fire, use the hot tub, call it a perfect evening. The tour goes nowhere.",
              links: [],
            },
            {
              id: "bail-star-skip",
              name: "Skip the guided tour entirely",
              description:
                "Use Stellara's own telescope casually and spend the night on the deck. The resort provides a constellation map and stargazing apps with each stay — you don't need the full experience to have a magical night under a new moon in the Smokies.",
              links: [],
            },
          ],
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
          title: "Sleep Until You Wake Up",
          type: "lodging",
          description:
            "No alarms unless you want them. Slow morning, mountain air, coffee on the deck, and nowhere to be yet.",
        },

        {
          id: "d2-e2",
          title: "Breakfast Before the Trail",
          type: "restaurant",
          description:
            "Ease into the day before heading deeper into the Smokies. Nothing rushed — just coffee, breakfast, and a quiet mountain morning.",
          options: [
            {
              id: "opt-breakfast-cabin",
              name: "Breakfast at the cabin",
              description:
                "Stay in. Use what you brought — coffee on the deck, whatever you stocked from Publix. The quietest possible start.",
              links: [],
            },
            {
              id: "opt-breakfast-out",
              name: "Go out for breakfast",
              description:
                "Find something nearby — search Yelp for what's open and close.",
              links: [
                {
                  label: "Search Yelp",
                  href: "https://www.yelp.com/search?find_desc=breakfast&find_near=me",
                  kind: "website",
                },
              ],
            },
          ],
        },

        {
          id: "d2-e3",
          title: "Hen Wallow Falls — Gabes Mountain Trail",
          type: "activity",
          description:
            "A quieter Smokies hike in the Cosby section of the park — lush forest, rhododendron tunnels, and a 90-foot waterfall hidden deep in the woods. Moderate, rewarding, and far from the Parkway crowds.",
          note: "Roughly 4.4 miles round trip. Bring water shoes if you want to wade near the falls. Parking tag required ($5/day).",
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
          bailouts: [
            {
              id: "bail-porters-creek",
              name: "Porters Creek Trail",
              description:
                "4.5 miles round-trip, easy-to-moderate — feels more like a wander than a workout. Spring wildflower corridor that locals call one of the best in the Smokies in May. Historic homestead ruins, 1875 cantilever barn, and Fern Branch Falls at the end. You can cut it at 2 miles and still have a full experience. Parking tag required ($5/day).",
              links: [
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=Greenbrier+Trailhead+Gatlinburg+TN&navigate=yes",
                  kind: "waze",
                },
                {
                  label: "AllTrails",
                  href: "https://www.alltrails.com/trail/us/tennessee/porters-creek-trail",
                  kind: "website",
                },
              ],
            },
            {
              id: "bail-resort-walk",
              name: "Resort Property Walk",
              description:
                "Stellara has 2 miles of on-property trails across 85 acres. Zero drive, zero parking, zero decision fatigue — lace up and walk out the front door. Good for a morning that needs to stay slow.",
              links: [],
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
          id: "d2-e4",
          title: "Greenbrier River Stop & Snack Lunch",
          type: "activity",
          description:
            "On the way back through the park, stop along the river at Greenbrier for snacks, cold water, and a slower pace after the hike. Find a pull-off, sit by the riverbank, and stay as long as you want.",
          links: [
            {
              label: "Waze",
              href: "https://waze.com/ul?q=Greenbrier+GSMNP+Gatlinburg+TN&navigate=yes",
              kind: "waze",
            },
          ],
          bailouts: [
            {
              id: "bail-metcalf",
              name: "Metcalf Bottoms Picnic Area",
              description:
                "Shallow river access right at a picnic area on Little River Road — pull up, walk 50 feet, put your feet in. More parking, easier access, picnic tables if you want to linger.",
              links: [
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=Metcalf+Bottoms+Picnic+Area+GSMNP+TN&navigate=yes",
                  kind: "waze",
                },
              ],
            },
            {
              id: "bail-townsend-wye",
              name: "Townsend Wye (The Y)",
              description:
                "Where two rivers meet — big shallow pools, jump-off rocks. More of a scene than Greenbrier but a local summer hangout, not a tourist trap. Arrive before noon on a hot day.",
              links: [
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=Townsend+Wye+Townsend+TN&navigate=yes",
                  kind: "waze",
                },
              ],
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
          id: "d2-e5",
          title: "Back at Stellara",
          type: "lodging",
          description:
            "Hot tub. Shower. Quiet. Maybe a nap. The space between the hike and dinner is part of the experience too.",
          bailouts: [
            {
              id: "bail-hillside-winery",
              name: "Hillside Winery",
              description:
                "If she'd rather not sit at the resort for 3 hours before dinner — Italian-style and sparkling wines, free tastings, mountain views from the patio, zero pressure. Set back from the main strip, never crowded. Leaves you ~4 miles from The Appalachian.",
              links: [
                {
                  label: "Website",
                  href: "https://hillsidewine.com",
                  kind: "website",
                },
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=Hillside+Winery+Sevierville+TN&navigate=yes",
                  kind: "waze",
                },
                {
                  label: "Call",
                  href: "tel:+18659088482",
                  kind: "phone",
                },
              ],
            },
            {
              id: "bail-tn-cider",
              name: "Tennessee Cider Company",
              description:
                "If cider is more her thing — downtown Gatlinburg, more scene-y but genuinely great. Free samples, 6 tasting stations, craft hard ciders and meads. Fine before dinner if you keep it to one round.",
              links: [
                {
                  label: "Website",
                  href: "https://www.tncidercompany.com",
                  kind: "website",
                },
              ],
            },
          ],
          playlist: {
            id: "pl-afternoon",
            label: "Slow afternoon",
            mood: "Unhurried, soft, warm",
            spotifyQuery: "soft acoustic slow afternoon",
          },
        },

        {
          id: "d2-e6",
          title: "Depart for Dinner",
          type: "travel",
          description:
            "Leave Stellara about 20 minutes before you want to arrive — it's a short drive to downtown Sevierville. Plan to pull up by 6:45 for your 7:00 PM reservation.",
          links: [
            {
              label: "Waze",
              href: "https://waze.com/ul?q=The+Appalachian+133+Bruce+Street+Sevierville+TN&navigate=yes",
              kind: "waze",
            },
          ],
        },

        {
          id: "d2-e7",
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
          id: "d2-e8",
          title: "Back Under the Stars",
          type: "experience",
          description:
            "End the night however the evening wants to end — telescope, hot tub, fire pit, intimacy, conversation, or simply sitting quietly together in the mountains.",
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
          title: "Sleep Until You Wake Up",
          type: "lodging",
          description:
            "No alarms. No plans yet. One last slow mountain morning before heading home.",
        },

        {
          id: "d3-e2",
          time: "09:00",
          title: "Breakfast Before Heading Home",
          type: "restaurant",
          description:
            "Ease into the final morning together before packing up and heading back through the Smokies.",
          options: [
            {
              id: "opt-breakfast-cabin-sun",
              name: "Breakfast at the cabin",
              description:
                "Stay in for the last morning. Coffee on the deck, whatever's left in the kitchen, no schedule.",
              links: [],
            },
            {
              id: "opt-breakfast-out-sun",
              name: "Go out for breakfast",
              description:
                "Find something nearby — search Yelp for what's open and close.",
              links: [
                {
                  label: "Search Yelp",
                  href: "https://www.yelp.com/search?find_desc=breakfast&find_near=me",
                  kind: "website",
                },
              ],
            },
          ],
        },

        {
          id: "d3-e3",
          time: "10:30",
          title: "Pack Up & Head Into the Smokies",
          type: "travel",
          description:
            "Leave Stellara sometime around 10:30–11:00 AM and take the scenic route home through the national park instead of rushing back to Knoxville.",
          links: [
            {
              label: "Waze",
              href: "https://waze.com/ul?q=Great+Smoky+Mountains+National+Park+TN&navigate=yes",
              kind: "waze",
            },
          ],
        },

        {
          id: "d3-e4",
          time: "11:30",
          title: "Waterfall Hike on the Way Home",
          type: "activity",
          description:
            "One last stop in the park before heading home — a short trail, a waterfall, and a reason to not rush.",
          options: [
            {
              id: "opt-laurel-falls",
              name: "Laurel Falls Trail",
              description:
                "Easy-to-moderate paved trail leading to one of the Smokies' most iconic waterfalls. About 2.6 miles round trip. Popular but worth it.",
              links: [
                {
                  label: "AllTrails",
                  href: "https://www.alltrails.com/trail/us/tennessee/laurel-falls-trail",
                  kind: "website",
                },
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=Laurel+Falls+Trailhead+GSMNP+TN&navigate=yes",
                  kind: "waze",
                },
              ],
            },
            {
              id: "opt-spruce-flats",
              name: "Spruce Flats Falls",
              description:
                "Quieter forest hike off the Tremont area with a tucked-away waterfall and fewer people. About 3 miles round trip.",
              links: [
                {
                  label: "AllTrails",
                  href: "https://www.alltrails.com/trail/us/tennessee/spruce-flats-falls-trail",
                  kind: "website",
                },
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=Tremont+Road+GSMNP+Townsend+TN&navigate=yes",
                  kind: "waze",
                },
              ],
            },
          ],
        },

        {
          id: "d3-e5",
          time: "13:30",
          title: "Townsend Stop Before Heading Home",
          type: "restaurant",
          description:
            "One last stop in the peaceful side of the Smokies before getting on the road home.",
          options: [
            {
              id: "opt-peaceful-side-sun",
              name: "Peaceful Side Social",
              description:
                "Outdoor beer garden, pizza, and relaxed mountain-town atmosphere. A good way to end the weekend.",
              links: [
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=Peaceful+Side+Social+Townsend+TN&navigate=yes",
                  kind: "waze",
                },
              ],
            },
            {
              id: "opt-townsend-abbey",
              name: "Townsend Abbey",
              description:
                "Quiet pub atmosphere with craft beer and lighter food options.",
              links: [
                {
                  label: "Waze",
                  href: "https://waze.com/ul?q=Townsend+Abbey+Townsend+TN&navigate=yes",
                  kind: "waze",
                },
              ],
            },
          ],
        },

        {
          id: "d3-e6",
          time: "15:00",
          title: "Head Home",
          type: "travel",
          description:
            "One last stretch through Townsend, Wears Valley, and the foothills before returning home. About 1 hour 15 minutes back to South Knoxville.",
          links: [
            {
              label: "Waze",
              href: "https://waze.com/ul?q=South+Knoxville+TN+37920&navigate=yes",
              kind: "waze",
            },
          ],
          bailouts: [
            {
              id: "bail-scenic-route",
              name: "The Scenic Route",
              description:
                "Instead of the highway, take Wears Valley Rd → TN-73 through Townsend → US-321 → Maryville → Knoxville. Quiet two-lane roads through open valley, no traffic, beautiful. About 20 minutes longer and worth every one of them.",
              links: [],
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
