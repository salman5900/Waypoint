/**
 * Travel Photography & Landmark Image Resolver
 * Provides reliable, high-resolution curated photography for global destinations,
 * specific landmarks/activities, and cuisine-matched culinary spots.
 */

// Curated 5-photo destination albums
const DESTINATION_ALBUMS = {
  tokyo: [
    { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85", title: "Shinjuku & Shibuya Neon Horizons" },
    { url: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=1600&q=85", title: "Asakusa Senso-ji & Sumida Riverfront" },
    { url: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?auto=format&fit=crop&w=1600&q=85", title: "TeamLab Borderless & Tokyo Bay" },
    { url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=85", title: "Ginza Architectural Boulevard" },
    { url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1600&q=85", title: "Meiji Jingu Sacred Forest Sanctuary" }
  ],
  kyoto: [
    { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85", title: "Fushimi Inari Vermillion Torii Gates" },
    { url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1600&q=85", title: "Arashiyama Emerald Bamboo Groves" },
    { url: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1600&q=85", title: "Kinkaku-ji Golden Pavilion" },
    { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85", title: "Gion Lantern-lit Historic Alleys" },
    { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=85", title: "Kiyomizu-dera Cliffside Sanctuary" }
  ],
  dubai: [
    { url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85", title: "Burj Khalifa & Downtown Skyline" },
    { url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=85", title: "Dubai Marina & JBR Waterfront Towers" },
    { url: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1600&q=85", title: "Arabian Desert Golden Dunes" },
    { url: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1600&q=85", title: "Museum of the Future Architecture" },
    { url: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1600&q=85", title: "Palm Jumeirah & Arabian Gulf Sunsets" }
  ],
  paris: [
    { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85", title: "Eiffel Tower & Champ de Mars" },
    { url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=85", title: "Louvre Museum Glass Pyramid" },
    { url: "https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1600&q=85", title: "Seine River Pont Alexandre III" },
    { url: "https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?auto=format&fit=crop&w=1600&q=85", title: "Montmartre & Sacré-Cœur Basilica" },
    { url: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1600&q=85", title: "Arc de Triomphe Boulevard Views" }
  ],
  swiss: [
    { url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=85", title: "Lauterbrunnen Valley & Alpine Cascades" },
    { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85", title: "Matterhorn Peak & Zermatt Ridge" },
    { url: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1600&q=85", title: "Lake Brienz Turquoise Alpine Waters" },
    { url: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=1600&q=85", title: "Jungfraujoch Top of Europe Rail" },
    { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=85", title: "Interlaken Panoramic Meadow Strolls" }
  ],
  newyork: [
    { url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=85", title: "Manhattan Golden Hour Skyline" },
    { url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=1600&q=85", title: "Central Park Autumn Reservoir" },
    { url: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1600&q=85", title: "Brooklyn Bridge Architectural Span" },
    { url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1600&q=85", title: "Times Square Neon Boulevard" },
    { url: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1600&q=85", title: "SoHo Cast-Iron Facades & Cobblestone" }
  ],
  london: [
    { url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=85", title: "Big Ben & Palace of Westminster" },
    { url: "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=1600&q=85", title: "Tower Bridge Over River Thames" },
    { url: "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1600&q=85", title: "London Eye Dusk Reflections" },
    { url: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1600&q=85", title: "Covent Garden & West End Theatres" },
    { url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=85", title: "Hyde Park Serpentine Promenade" }
  ],
  kerala: [
    { url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85", title: "Munnar Rolling Emerald Tea Estates" },
    { url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1600&q=85", title: "Alleppey Serene Palm Backwaters" },
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85", title: "Traditional Heritage Houseboat" },
    { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85", title: "Varkala Cliff Sunset Beach" },
    { url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85", title: "Kochi Fort Chinese Fishing Nets" }
  ],
  singapore: [
    { url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=85", title: "Marina Bay Sands SkyPark Panorama" },
    { url: "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=1600&q=85", title: "Gardens by the Bay Supertree Grove" },
    { url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1600&q=85", title: "Jewel Changi Rain Vortex Waterfall" },
    { url: "https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&w=1600&q=85", title: "Chinatown & Historic Shophouse Rows" },
    { url: "https://images.unsplash.com/photo-1508963493744-76fce69379c0?auto=format&fit=crop&w=1600&q=85", title: "Sentosa Bayside Sunset Cove" }
  ],
  rome: [
    { url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=85", title: "Colosseum Ancient Amphitheater" },
    { url: "https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1600&q=85", title: "Trevi Fountain Baroque Splendor" },
    { url: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1600&q=85", title: "St. Peter's Basilica & Vatican Square" },
    { url: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1600&q=85", title: "Pantheon Dome & Piazza della Rotonda" },
    { url: "https://images.unsplash.com/photo-1529154036634-a204144510b0?auto=format&fit=crop&w=1600&q=85", title: "Trastevere Cobblestone Trattorias" }
  ]
};

// Generic architectural fallback
const GENERIC_GLOBAL_ALBUM = [
  { url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=85", title: "Global Expedition Horizons" },
  { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=85", title: "Scenic Architectural Vistas" },
  { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=85", title: "Cultural Landmarks & Promenades" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85", title: "Sunset Coasts & Waterfronts" },
  { url: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1600&q=85", title: "Mountain Horizons & Historic Towns" }
];

/**
 * Resolves 5 destination-matched hero slides.
 * Prefers API heroImages if provided, otherwise matches destination keywords.
 */
export function resolveDestinationHeroSlides(itinerary, destinationName = '') {
  // If API provided hero images
  if (Array.isArray(itinerary?.heroImages) && itinerary.heroImages.length > 0) {
    return itinerary.heroImages.slice(0, 5).map((img, i) => {
      if (typeof img === 'string') return { url: img, title: `Spotlight Landmark 0${i + 1}` };
      return { url: img.url || img.imageUrl, title: img.title || `Spotlight 0${i + 1}` };
    });
  }

  const query = `${destinationName} ${itinerary?.tripTitle || ''} ${itinerary?.destination || ''}`.toLowerCase();

  for (const [key, album] of Object.entries(DESTINATION_ALBUMS)) {
    if (query.includes(key)) {
      return album;
    }
  }

  // Check additional city variations
  if (query.includes('interlaken') || query.includes('zermatt') || query.includes('switzerland') || query.includes('alps')) {
    return DESTINATION_ALBUMS.swiss;
  }
  if (query.includes('osaka') || query.includes('japan')) {
    return DESTINATION_ALBUMS.tokyo;
  }
  if (query.includes('munnar') || query.includes('kochi') || query.includes('india')) {
    return DESTINATION_ALBUMS.kerala;
  }
  if (query.includes('france')) {
    return DESTINATION_ALBUMS.paris;
  }
  if (query.includes('uk') || query.includes('scotland') || query.includes('edinburgh')) {
    return DESTINATION_ALBUMS.london;
  }
  if (query.includes('uae') || query.includes('abu dhabi')) {
    return DESTINATION_ALBUMS.dubai;
  }
  if (query.includes('italy') || query.includes('florence') || query.includes('venice')) {
    return DESTINATION_ALBUMS.rome;
  }

  return GENERIC_GLOBAL_ALBUM;
}

/**
 * Landmark photo matcher for individual activity stop cards
 */
export function resolveActivityPhoto(activity, destination = '') {
  if (activity?.image || activity?.imageUrl) {
    return activity.image || activity.imageUrl;
  }

  const text = `${activity?.title || ''} ${activity?.description || ''} ${destination}`.toLowerCase();

  // Dubai landmarks
  if (text.includes('burj khalifa') || text.includes('at the top')) {
    return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('dubai mall') || text.includes('fountain')) {
    return "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('desert') || text.includes('safari') || text.includes('dune')) {
    return "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('marina') || text.includes('jbr') || text.includes('yacht')) {
    return "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('future') || text.includes('museum')) {
    return "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('souk') || text.includes('creek') || text.includes('abra') || text.includes('old dubai')) {
    return "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=800&q=80";
  }

  // Paris landmarks
  if (text.includes('eiffel')) {
    return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('louvre')) {
    return "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('seine') || text.includes('cruise')) {
    return "https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('montmartre') || text.includes('sacre')) {
    return "https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?auto=format&fit=crop&w=800&q=80";
  }

  // Tokyo landmarks
  if (text.includes('shinjuku') || text.includes('government building') || text.includes('metropolitan')) {
    return "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('shibuya') || text.includes('crossing') || text.includes('sky')) {
    return "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('senso') || text.includes('asakusa') || text.includes('temple')) {
    return "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('teamlab') || text.includes('borderless') || text.includes('planets')) {
    return "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('meiji') || text.includes('harajuku') || text.includes('shrine')) {
    return "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes('ginza') || text.includes('tsukiji') || text.includes('market')) {
    return "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80";
  }

  // Category fallback
  switch (activity?.category) {
    case 'sightseeing':
      return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80";
    case 'shopping':
      return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80";
    case 'transit':
      return "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80";
    case 'experience':
    default:
      return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
  }
}

/**
 * Cuisine & Restaurant Photography Resolver
 */
export function resolveRestaurantPhoto(restaurant) {
  if (restaurant?.image || restaurant?.imageUrl) {
    return restaurant.image || restaurant.imageUrl;
  }

  const text = `${restaurant?.name || ''} ${restaurant?.cuisine || ''} ${restaurant?.signatureDish || ''}`.toLowerCase();

  // Middle Eastern / Arabic / Lebanese / Grill (e.g. Al Mallah, Ravi, Aroos Damascus)
  if (text.includes('mallah') || text.includes('lebanese') || text.includes('shawarma') || text.includes('hummus') || text.includes('falafel') || text.includes('arabic') || text.includes('mezze')) {
    return "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80"; // Authentic shawarma/grill
  }
  if (text.includes('ravi') || text.includes('pakistani') || text.includes('karahi') || text.includes('biryani') || text.includes('curry') || text.includes('tikka') || text.includes('naan')) {
    return "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80"; // Rich karahi / tandoori
  }
  if (text.includes('zuma') || text.includes('sushi') || text.includes('japanese') || text.includes('omakase') || text.includes('sashimi') || text.includes('wagyu')) {
    return "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80"; // Modern sushi / Japanese
  }
  if (text.includes('ramen') || text.includes('tsukemen') || text.includes('fuunji') || text.includes('afuri') || text.includes('noodle')) {
    return "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"; // Steaming craft ramen
  }
  if (text.includes('italian') || text.includes('pasta') || text.includes('pizza') || text.includes('trattoria') || text.includes('risotto')) {
    return "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80"; // Fresh handmade pasta
  }
  if (text.includes('french') || text.includes('bistro') || text.includes('pastry') || text.includes('bakery') || text.includes('croissant') || text.includes('steak frites')) {
    return "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"; // Artisan bakery & bistro
  }
  if (text.includes('seafood') || text.includes('fish') || text.includes('oyster') || text.includes('prawn') || text.includes('lobster')) {
    return "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"; // Fresh seafood catch
  }
  if (text.includes('cafe') || text.includes('coffee') || text.includes('brunch') || text.includes('tea') || text.includes('toast')) {
    return "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"; // Specialty cafe & latte
  }

  // General fine dining / gourmet fallback
  return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";
}

/**
 * Dynamic fallback photo for a given destination (used on onError)
 */
export function resolveDestinationFallbackPhoto(destinationName = '') {
  const slides = resolveDestinationHeroSlides(null, destinationName);
  return slides?.[0]?.url || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=85";
}

/**
 * Dynamic fallback photo for an activity based on landmark keywords (used on onError)
 */
export function resolveActivityFallback(activity, destination = '') {
  return resolveActivityPhoto({ title: activity?.title, description: activity?.description, category: activity?.category }, destination);
}

/**
 * Dynamic fallback photo for a restaurant based on cuisine keywords (used on onError)
 */
export function resolveRestaurantFallback(restaurant) {
  return resolveRestaurantPhoto({ name: restaurant?.name, cuisine: restaurant?.cuisine, signatureDish: restaurant?.signatureDish });
}
