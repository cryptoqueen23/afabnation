window.AFAB_DATA = {
  merch: [
    { name: "Totally Excellent Real Female Tee", price: "$24.99", art: "TERF =\nTRANS-EXCLUSIONARY\nRADICAL FEMINIST" },
    { name: "AFAB Nation Hoodie", price: "$44.99", art: "AFAB\nNATION" },
    { name: "XX Mug", price: "$16.99", art: "XX" },
    { name: "AFAB Nation Hat", price: "$22.99", art: "AFAB" }
  ],
  // Sponsor rotation is data-driven so paying advertisers can be added as plain
  // entries here. house:true marks fallback inventory (like Phoenix Securitas
  // Tech) that fills the rotation when there's no paid sponsor for that slot --
  // it isn't given special code paths, just this flag for future logic.
  sponsors: [
    { name: "AFAB Nation Merch", text: "Support the station. Wear it loud." },
    { name: "Your Business Here", text: "Sponsor inventory ready to sell." },
    { name: "Phoenix Securitas Tech", text: "The Texas tech studio behind AFAB Nation.", url: "https://tree.phoenixsecuritas.com", house: true }
  ],
  starterPosts: [
    {
      id: "starter-1",
      user: "LunaRae",
      time: "2h ago",
      text: "Welcome to AFAB Nation. Share your thoughts, images and music.",
      type: "image",
      media: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd4297?auto=format&fit=crop&w=1200&q=80",
      likes: 128,
      comments: ["Glad to see this live."]
    },
    {
      id: "starter-2",
      user: "MariCruz",
      time: "now",
      text: "AFAB Nation Radio is on. Three songs are loaded and ready.",
      type: "track",
      trackId: "clams-not-pronouns",
      likes: 0,
      comments: []
    }
  ]
};