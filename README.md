# AFAB Nation Radio — Bootstrap Starter

This is a static starter for:

- Social-style home feed
- Text posts
- Local image/audio posts
- Likes + comments stored in the visitor's browser
- Persistent AFAB Nation Radio player
- Music library
- Video placeholders
- Merch placeholders
- Rotating sponsor/flywheel ad block
- Responsive mobile layout

## Run it

Open the folder in VS Code.

For best results, use VS Code Live Server or another tiny local server.

## Add your MP3 files

Create/use the `audio` folder and rename your files to match `data.js`, or edit the `src` values in `data.js`.

Example:

audio/i-am-afab-hear-me-roar.mp3

MP3 at 192 kbps is a strong web default.

## Edit songs

Open `data.js` and change the `tracks` array.

## Important bootstrap limitation

Posts, comments, likes, and uploads are currently stored only in the current browser with localStorage. That is intentional for the front-end bootstrap.

Large photos/audio can exceed browser localStorage. For real users, the next backend step should be:

- Cloudflare D1: accounts, posts, comments, likes, metadata
- Cloudflare R2: images + MP3/audio files
- External embeds or R2/Stream for video
- Cloudflare Worker API: auth + posting + moderation

D1 should not store the MP3 bytes themselves.

## Sponsor flywheel

Edit the `sponsors` array in `data.js`. The sponsor block rotates every 12 seconds.


## Logo

Official AFAB logo is included at `assets/afab-logo.png` and used in the sidebar, mobile header, and Radio page.
