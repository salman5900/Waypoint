/**
 * Sample Tokyo Trip Itinerary Contract Payload
 * Conforms exactly to TripItinerary schema returned by POST /api/trips/generate/
 */

export const SAMPLE_TOKYO_TRIP = {
  tripTitle: "Tokyo: Neon Horizons & Quiet Temples",
  summary: "A 4-day balanced immersion spanning electric Shibuya and Akihabara tech quarters, serene Meiji Shrine forested walks, old-town Yanaka craft alleyways, and world-class culinary discoveries across Tokyo's premier culinary districts.",
  heroImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85",
  budgetBreakdown: {
    flights: 1150,
    accommodation: 1020,
    foodAndDining: 620,
    activitiesAndLocalTransit: 400,
    totalEstimated: 3190,
    currency: "USD"
  },
  flightOptions: [
    {
      airline: "All Nippon Airways (ANA)",
      route: "SFO → HND",
      estimatedPrice: 1150,
      duration: "11h 15m",
      stops: "Nonstop",
      bookingSearchUrl: "https://www.google.com/travel/flights?q=SFO+to+HND",
      tip: "Overnight flight arriving directly into Haneda saves 90 minutes of ground rail transit compared to Narita."
    },
    {
      airline: "Japan Airlines (JAL)",
      route: "LAX → HND",
      estimatedPrice: 1080,
      duration: "11h 45m",
      stops: "Nonstop",
      bookingSearchUrl: "https://www.google.com/travel/flights?q=LAX+to+HND",
      tip: "Book 7 weeks in advance for prime window seats on their Boeing 787-9 Dreamliner configuration."
    }
  ],
  hotelRecommendations: [
    {
      name: "TRUNK (HOTEL) Yoyogi Park",
      neighborhood: "Shibuya / Tomigaya",
      pricePerNight: 340,
      rating: "4.9 ★",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      whyItFits: "Features a tranquil rooftop infinity pool overlooking Yoyogi Park; residential tranquility just 10 minutes from Shibuya Crossing.",
      bookingSearchUrl: "https://www.google.com/travel/hotels?q=TRUNK+Hotel+Yoyogi+Park"
    },
    {
      name: "The Gate Hotel Asakusa Kaminarimon",
      neighborhood: "Asakusa Historic District",
      pricePerNight: 190,
      rating: "4.7 ★",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      whyItFits: "Panoramic rooftop terrace with direct front-row vistas of Tokyo Skytree and historic Senso-ji temple gates.",
      bookingSearchUrl: "https://www.google.com/travel/hotels?q=The+Gate+Hotel+Asakusa"
    }
  ],
  days: [
    {
      day: 1,
      theme: "Arrival, Meiji Forest Sanctuary & Shibuya Sunset Vista",
      activities: [
        {
          time: "10:30 AM",
          title: "Walk Through Meiji Jingu Forested Sanctuary",
          category: "sightseeing",
          description: "Stroll beneath century-old cypress torii gates and 100-year-old preserved cedar canopy into Tokyo's grandest Shinto shrine.",
          estimatedCost: 0,
          mapOrBookingUrl: "https://maps.google.com/?q=Meiji+Jingu+Tokyo"
        },
        {
          time: "02:00 PM",
          title: "Artisanal Coffee & Design Flagships in Omotesando",
          category: "experience",
          description: "Explore boutique architectural landmarks along Cat Street with single-origin hand pour and matcha espresso.",
          estimatedCost: 18,
          mapOrBookingUrl: "https://maps.google.com/?q=Cat+Street+Omotesando"
        },
        {
          time: "06:00 PM",
          title: "Shibuya Sky 360-Degree Observation Deck",
          category: "sightseeing",
          description: "Ascend 229 meters for an open-air panoramic sunset vista looking over Mount Fuji and the illuminated Shibuya scramble intersection.",
          estimatedCost: 22,
          mapOrBookingUrl: "https://www.shibuya-scramble-square.com/sky/"
        }
      ],
      restaurantPicks: [
        {
          name: "Afuri Harajuku",
          cuisine: "Craft Yuzu Shio Ramen",
          priceRange: "$$",
          signatureDish: "Signature Yuzu Shio Broth with Charred Chashu",
          mapUrl: "https://maps.google.com/?q=Afuri+Harajuku"
        },
        {
          name: "Nonbei Yokocho (Drunkard's Alley)",
          cuisine: "Artisanal Charcoal Yakitori",
          priceRange: "$$",
          signatureDish: "Tare Charcoal-Grilled Negima & Tsukune Skewers",
          mapUrl: "https://maps.google.com/?q=Nonbei+Yokocho+Tokyo"
        }
      ]
    },
    {
      day: 2,
      theme: "Historic Asakusa Temples, Sumida River & Akihabara Electronics",
      activities: [
        {
          time: "09:00 AM",
          title: "Morning Reverence at Senso-ji Temple",
          category: "sightseeing",
          description: "Beat the afternoon crowds through the iconic Kaminarimon thunder gate into Tokyo's oldest 7th-century Buddhist temple.",
          estimatedCost: 0,
          mapOrBookingUrl: "https://maps.google.com/?q=Sensoji+Tokyo"
        },
        {
          time: "01:00 PM",
          title: "Futuristic Water Bus Cruise Along Sumida River",
          category: "transit",
          description: "Board the Himiko or Hotaluna panoramic water bus designed by anime icon Leiji Matsumoto to Hamarikyu Gardens.",
          estimatedCost: 16,
          mapOrBookingUrl: "https://maps.google.com/?q=Tokyo+Water+Bus+Sumida"
        },
        {
          time: "04:30 PM",
          title: "Curated Retro Gaming & Hardware in Akihabara Electric Town",
          category: "shopping",
          description: "Browse pristine retro Japanese games, rare vinyl, and bespoke audio equipment at Super Potato and Radio Kaikan.",
          estimatedCost: 45,
          mapOrBookingUrl: "https://maps.google.com/?q=Akihabara+Electric+Town"
        }
      ],
      restaurantPicks: [
        {
          name: "Asakusa Imahan",
          cuisine: "Traditional Sukiyaki & Shabu-Shabu",
          priceRange: "$$$",
          signatureDish: "A5 Black Wagyu Sirloin Sukiyaki with Fresh Farm Egg",
          mapUrl: "https://maps.google.com/?q=Asakusa+Imahan"
        },
        {
          name: "Kanda Matsuya",
          cuisine: "Edo-Style Buckwheat Soba",
          priceRange: "$$",
          signatureDish: "Handmade Mori Soba with Crispy Seasonal Tempura",
          mapUrl: "https://maps.google.com/?q=Kanda+Matsuya"
        }
      ]
    },
    {
      day: 3,
      theme: "Old-Town Yanaka Crafts, Ueno Museums & Shinjuku Nightscape",
      activities: [
        {
          time: "10:00 AM",
          title: "Slow Walking Tour of Yanaka Ginza Craft Quarter",
          category: "experience",
          description: "Explore preserved pre-war wooden residences, traditional wagashi confections, and artisan bamboo craft ateliers.",
          estimatedCost: 15,
          mapOrBookingUrl: "https://maps.google.com/?q=Yanaka+Ginza+Tokyo"
        },
        {
          time: "02:30 PM",
          title: "Tokyo National Museum & Le Corbusier Gallery",
          category: "sightseeing",
          description: "Immerse in national treasure samurai katanas, screens, and the UNESCO-listed National Museum of Western Art.",
          estimatedCost: 12,
          mapOrBookingUrl: "https://maps.google.com/?q=Tokyo+National+Museum"
        },
        {
          time: "08:00 PM",
          title: "Jazz & Vinyl Listening Session at Bar Martha",
          category: "experience",
          description: "Sip vintage Japanese single malts while analog Garrard turntables spin classic Blue Note jazz on bespoke Tannoy speakers.",
          estimatedCost: 35,
          mapOrBookingUrl: "https://maps.google.com/?q=Bar+Martha+Ebisu"
        }
      ],
      restaurantPicks: [
        {
          name: "Kayaba Coffee",
          cuisine: "Taisho-Era Retro Cafe",
          priceRange: "$",
          signatureDish: "Famous Steamed Fluffy Egg Sando & Matcha Latte",
          mapUrl: "https://maps.google.com/?q=Kayaba+Coffee"
        },
        {
          name: "Ginza Kyubey",
          cuisine: "Legendary Edomae Sushi",
          priceRange: "$$$$",
          signatureDish: "Chef's Omakase: Wild Bluefin Otoro & Bafun Uni",
          mapUrl: "https://maps.google.com/?q=Ginza+Kyubey"
        }
      ]
    },
    {
      day: 4,
      theme: "Tsukiji Outer Market, TeamLab Immersive Art & Roppongi Finale",
      activities: [
        {
          time: "08:30 AM",
          title: "Fresh Seafood Breakfast at Tsukiji Outer Market",
          category: "experience",
          description: "Sample flame-torched scallops, fresh tamagoyaki skewers, and sashimi bowls prepared directly from Toyosu arrivals.",
          estimatedCost: 30,
          mapOrBookingUrl: "https://maps.google.com/?q=Tsukiji+Outer+Market"
        },
        {
          time: "01:30 PM",
          title: "TeamLab Planets Immersive Digital Art Space",
          category: "experience",
          description: "Wade barefoot through crystal water installations and infinite floating orchid gardens at Toyosu's world-famous sensory museum.",
          estimatedCost: 38,
          mapOrBookingUrl: "https://planets.teamlab.art/tokyo/"
        },
        {
          time: "06:00 PM",
          title: "Tokyo City View at Roppongi Hills Mori Tower",
          category: "sightseeing",
          description: "Sunset rooftop vista with Tokyo Tower radiating in incandescent amber against the urban evening sprawl.",
          estimatedCost: 20,
          mapOrBookingUrl: "https://tcv.roppongihills.com/"
        }
      ],
      restaurantPicks: [
        {
          name: "Sushi Dai",
          cuisine: "Toyosu Market Fresh Sushi",
          priceRange: "$$$",
          signatureDish: "Dawn-Caught Nodoguro & Aji Nigiri",
          mapUrl: "https://maps.google.com/?q=Sushi+Dai+Toyosu"
        },
        {
          name: "Kushikatsu Tanaka Roppongi",
          cuisine: "Osaka-Style Panko Skewers",
          priceRange: "$$",
          signatureDish: "Crispy Lotus Root, Iberico Pork & Asahi Super Dry",
          mapUrl: "https://maps.google.com/?q=Kushikatsu+Tanaka+Roppongi"
        }
      ]
    }
  ]
};
