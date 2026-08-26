// AFAB Nation Radio catalog.
//
// Single source of truth for every song on the site. The Music page and the
// Radio "Now Playing" section both render generically from this array --
// there is no per-song code anywhere else, and the renderer does not inspect
// title/artist/description/lyrics content. To add a song, add an entry here;
// to unpublish one without deleting it, set published:false.
//
// Fields:
//   id            unique slug -- used for transcript panel ids and post links
//   title         song title (required -- entries without one are skipped)
//   artist        display artist name
//   audio         path to the audio file, or "" if no audio yet
//   cover         path to real cover art, or "" to fall back to coverText
//   coverText     short text shown on the placeholder cover when no cover image
//   genre         array of strings, e.g. ["Arena Rock", "Anthem"] -- optional
//   releaseDate   ISO date string ("2026-08-25") -- optional
//   description   one-line blurb shown on the card -- optional
//   explicit      true/false, shows an "Explicit" badge
//   featured      true/false, shows a "Featured" badge
//   published     false hides the track from the site entirely (default true)
//   transcript        full lyrics/transcript text, or "" if not written yet
//   transcriptStatus  "pending" or "complete" -- controls the transcript UI copy

window.AFAB_CATALOG = [
  {
    id: "clams-not-pronouns",
    title: "Clams Not Pronouns",
    artist: "Mari Cruz",
    audio: "audio/clams-not-pronouns.mp3",
    cover: "",
    coverText: "CLAMS",
    genre: [],
    releaseDate: "",
    description: "",
    explicit: false,
    featured: false,
    published: true,
    transcript: "",
    transcriptStatus: "pending"
  },
  {
    id: "xx-is-not-a-feeling",
    title: "XX Is Not a Feeling!",
    artist: "Mari Cruz",
    audio: "audio/xx-is-not-a-feeling.mp3",
    cover: "",
    coverText: "XX",
    genre: [],
    releaseDate: "",
    description: "",
    explicit: false,
    featured: false,
    published: true,
    transcript: "",
    transcriptStatus: "pending"
  },
  {
    id: "real-females-dont-disappear",
    title: "Real Females Don't Disappear",
    artist: "Mari Cruz",
    audio: "audio/real-females-dont-disappear.mp3",
    cover: "",
    coverText: "REAL\nFEMALES",
    genre: [],
    releaseDate: "",
    description: "",
    explicit: false,
    featured: false,
    published: true,
    transcript: "",
    transcriptStatus: "pending"
  },
  {
    id: "keep-your-male-privilege-out-of-womens-spaces",
    title: "Keep Your Male Privilege Out of Women's Spaces",
    artist: "Mari Cruz",
    audio: "audio/keep-your-male-privilege-out-of-womens-spaces.mp3",
    cover: "",
    coverText: "KEEP\nOUT",
    genre: [],
    releaseDate: "",
    description: "",
    explicit: false,
    featured: false,
    published: true,
    transcript: "",
    transcriptStatus: "pending"
  },
  {
    id: "1st-edition",
    title: "1st Edition",
    artist: "Mari Cruz",
    audio: "audio/1st-edition.mp3",
    cover: "",
    coverText: "1ST\nEDITION",
    genre: [],
    releaseDate: "",
    description: "",
    explicit: false,
    featured: false,
    published: true,
    transcript: "",
    transcriptStatus: "pending"
  },
  {
    id: "wrong-door-amigo",
    title: "Wrong Door, Amigo",
    artist: "Mari Cruz",
    audio: "audio/wrong-door-amigo.mp3",
    cover: "",
    coverText: "WRONG\nDOOR",
    genre: [],
    releaseDate: "",
    description: "",
    explicit: false,
    featured: false,
    published: true,
    transcript: "",
    transcriptStatus: "pending"
  },
  {
    id: "define-it-or-draft-em",
    title: "Define It or Draft 'Em",
    artist: "Mari Cruz",
    audio: "audio/define-it-or-draft-em.mp3",
    cover: "",
    coverText: "DEFINE\nIT",
    genre: [],
    releaseDate: "",
    description: "",
    explicit: false,
    featured: false,
    published: true,
    transcript: "",
    transcriptStatus: "pending"
  },
  {
    id: "afab-nation",
    title: "AFAB Nation",
    artist: "AFAB Nation",
    audio: "audio/afab-nation.mp3",
    cover: "",
    coverText: "AFAB\nNATION",
    genre: ["Arena Rock", "Anthem"],
    releaseDate: "2026-08-25",
    description: "",
    explicit: false,
    featured: true,
    published: true,
    transcript: "",
    transcriptStatus: "pending"
  },
  {
    id: "afab-nation-espanol",
    title: "AFAB Nation (Español)",
    artist: "AFAB Nation",
    audio: "audio/afab-nation-espanol.mp3",
    cover: "",
    coverText: "AFAB\nNATION",
    genre: ["Arena Rock", "Anthem"],
    releaseDate: "2026-08-25",
    description: "",
    explicit: false,
    featured: true,
    published: true,
    transcript: "",
    transcriptStatus: "pending"
  }
];
