const DATA = window.AFAB_DATA;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const state = {
  currentTrack: 0,
  sponsor: 0,
  pendingUpload: null,
  posts: JSON.parse(localStorage.getItem("afab_posts") || "null") || DATA.starterPosts
};

const audio = $("#radioAudio");
const playButtons = [$("#radioPlay"), $("#dockPlay")];

function routeTo(route){
  $$(".page").forEach(p => p.classList.remove("active"));
  const page = $(`#page-${route}`);
  (page || $("#page-home")).classList.add("active");
  $$("[data-route]").forEach(btn => {
    if(btn.classList.contains("nav-link") || btn.classList.contains("top-link")){
      btn.classList.toggle("active", btn.dataset.route === route);
    }
  });
  window.scrollTo({top:0, behavior:"smooth"});
}

$$("[data-route]").forEach(btn => btn.addEventListener("click", e => {
  e.preventDefault();
  routeTo(btn.dataset.route);
  if(mobileQuery.matches) closeMobileMenu(false);
}));

const sidebar = $("#sidebar");
const menuToggle = $("#menuToggle");
const navBackdrop = $("#navBackdrop");
const mobileQuery = window.matchMedia("(max-width: 780px)");
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function syncSidebarForViewport(){
  if(mobileQuery.matches){
    if(!sidebar.classList.contains("open")){
      sidebar.setAttribute("aria-hidden", "true");
      sidebar.inert = true;
    }
  }else{
    sidebar.removeAttribute("aria-hidden");
    sidebar.inert = false;
    closeMobileMenu(false);
  }
}

function openMobileMenu(){
  sidebar.classList.add("open");
  sidebar.removeAttribute("aria-hidden");
  sidebar.inert = false;
  navBackdrop.hidden = false;
  navBackdrop.classList.add("open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");
  document.addEventListener("keydown", onMenuKeydown);
  const first = $(FOCUSABLE, sidebar);
  if(first) first.focus();
}

function closeMobileMenu(returnFocus = true){
  sidebar.classList.remove("open");
  navBackdrop.hidden = true;
  navBackdrop.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  document.removeEventListener("keydown", onMenuKeydown);
  if(mobileQuery.matches){
    sidebar.setAttribute("aria-hidden", "true");
    sidebar.inert = true;
  }
  if(returnFocus) menuToggle.focus();
}

function onMenuKeydown(e){
  if(e.key === "Escape"){
    e.preventDefault();
    closeMobileMenu();
    return;
  }
  if(e.key === "Tab"){
    const focusables = $$(FOCUSABLE, sidebar);
    if(!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if(e.shiftKey && document.activeElement === first){
      e.preventDefault(); last.focus();
    }else if(!e.shiftKey && document.activeElement === last){
      e.preventDefault(); first.focus();
    }
  }
}

menuToggle.addEventListener("click", () => {
  if(sidebar.classList.contains("open")) closeMobileMenu();
  else openMobileMenu();
});
navBackdrop.addEventListener("click", () => closeMobileMenu());
mobileQuery.addEventListener("change", syncSidebarForViewport);
syncSidebarForViewport();

$("#sidebarNewPost").addEventListener("click", () => {
  routeTo("home");
  setTimeout(() => $("#postText").focus(), 100);
});

function getTrack(){
  return DATA.tracks[state.currentTrack];
}

function setTrack(index, autoplay=false){
  state.currentTrack = (index + DATA.tracks.length) % DATA.tracks.length;
  const t = getTrack();
  audio.src = t.src;
  $("#radioTitle").textContent = t.title;
  $("#radioArtist").textContent = t.artist;
  $("#dockTitle").textContent = t.title;
  $("#dockArtist").textContent = t.artist;
  $("#radioCover").textContent = t.coverText;
  $("#dockCover").textContent = t.coverText.replace(/\n/g," ");
  updateRecentlyPlayed();
  if(autoplay){
    audio.play().catch(() => {});
  }
}

function togglePlay(){
  if(!audio.src) setTrack(state.currentTrack);
  if(audio.paused) audio.play().catch(() => alert("Add your MP3 files to the audio folder first."));
  else audio.pause();
}
playButtons.forEach(b => b.addEventListener("click", togglePlay));
$("#dockPrev").addEventListener("click", () => setTrack(state.currentTrack - 1, true));
$("#dockNext").addEventListener("click", () => setTrack(state.currentTrack + 1, true));
$("#radioPrev").addEventListener("click", () => setTrack(state.currentTrack - 1, true));
$("#radioNext").addEventListener("click", () => setTrack(state.currentTrack + 1, true));
audio.addEventListener("play", () => playButtons.forEach(b => { b.textContent = "❚❚"; b.setAttribute("aria-label", "Pause"); }));
audio.addEventListener("pause", () => playButtons.forEach(b => { b.textContent = "▶"; b.setAttribute("aria-label", "Play"); }));
audio.addEventListener("ended", () => setTrack(state.currentTrack + 1, true));
audio.addEventListener("loadedmetadata", () => $("#duration").textContent = formatTime(audio.duration));
audio.addEventListener("timeupdate", () => {
  $("#currentTime").textContent = formatTime(audio.currentTime);
  if(audio.duration) $("#seekBar").value = (audio.currentTime / audio.duration) * 100;
});
$("#seekBar").addEventListener("input", e => {
  if(audio.duration) audio.currentTime = audio.duration * (Number(e.target.value) / 100);
});
function formatTime(sec){
  if(!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2,"0")}`;
}

function mediaCard(track, index){
  return `<article class="media-card">
    <div class="cover">${track.coverText.replace(/\n/g,"<br>")}</div>
    <div class="media-card-body">
      <h3>${escapeHtml(track.title)}</h3>
      <p>${escapeHtml(track.artist)}</p>
      <button data-track="${index}">▶ Play</button>
    </div>
  </article>`;
}

function renderMusic(){
  $("#musicGrid").innerHTML = DATA.tracks.map(mediaCard).join("");
  $$("#musicGrid [data-track]").forEach(btn => btn.addEventListener("click", () => {
    setTrack(Number(btn.dataset.track), true); routeTo("radio");
  }));
}
function updateRecentlyPlayed(){
  const indexes = DATA.tracks.map((_,i) => (state.currentTrack - i + DATA.tracks.length) % DATA.tracks.length).slice(0,4);
  $("#recentlyPlayed").innerHTML = indexes.map(i => mediaCard(DATA.tracks[i], i)).join("");
  $$("#recentlyPlayed [data-track]").forEach(btn => btn.addEventListener("click", () => setTrack(Number(btn.dataset.track), true)));
}

function renderMerch(){
  $("#merchGrid").innerHTML = DATA.merch.map(m => `<article class="merch-card">
    <div class="merch-art">${escapeHtml(m.art).replace(/\n/g,"<br>")}</div>
    <div class="media-card-body"><h3>${escapeHtml(m.name)}</h3><p class="price">${m.price}</p></div>
  </article>`).join("");
}
function rotateSponsor(){
  state.sponsor = (state.sponsor + 1) % DATA.sponsors.length;
  const s = DATA.sponsors[state.sponsor];
  $("#sponsorName").textContent = s.name; $("#sponsorText").textContent = s.text;
}
$("#nextSponsor").addEventListener("click", rotateSponsor);
setInterval(rotateSponsor, 12000);

$("#imageUpload").addEventListener("change", e => handleUpload(e.target.files[0], "image"));
$("#audioUpload").addEventListener("change", e => handleUpload(e.target.files[0], "audio"));
function handleUpload(file, type){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.pendingUpload = {type, src:reader.result, name:file.name};
    const preview = $("#uploadPreview");
    preview.hidden = false;
    const fieldLabel = type === "image" ? "Alt text (describe this photo)" : "Caption / transcript";
    const fieldId = type === "image" ? "uploadAltText" : "uploadCaption";
    preview.innerHTML = `
      <p>${type === "image" ? "Photo" : "Audio"} ready: ${escapeHtml(file.name)}</p>
      <label for="${fieldId}">${fieldLabel}</label>
      <input type="text" id="${fieldId}" placeholder="${type === "image" ? "A short description for screen readers" : "What is said or sung in this clip"}" />
    `;
    $(`#${fieldId}`, preview).addEventListener("input", e => {
      if(!state.pendingUpload) return;
      if(type === "image") state.pendingUpload.altText = e.target.value;
      else state.pendingUpload.caption = e.target.value;
    });
  };
  reader.readAsDataURL(file);
}

$("#musicPostBtn").addEventListener("click", () => {
  state.pendingUpload = {type:"track", trackId:getTrack().id};
  $("#uploadPreview").hidden = false;
  $("#uploadPreview").textContent = `Music attached: ${getTrack().title}`;
});

$("#publishPost").addEventListener("click", () => {
  const text = $("#postText").value.trim();
  if(!text && !state.pendingUpload) return;
  const post = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    user:"MariCruz", time:"now", text, likes:0, comments:[],
    ...(state.pendingUpload || {})
  };
  state.posts.unshift(post);
  savePosts();
  $("#postText").value = "";
  $("#uploadPreview").hidden = true;
  $("#uploadPreview").textContent = "";
  state.pendingUpload = null;
  $("#imageUpload").value = ""; $("#audioUpload").value = "";
  renderFeed();
});

function savePosts(){
  try{
    localStorage.setItem("afab_posts", JSON.stringify(state.posts));
  }catch(err){
    console.warn("Post could not be saved locally. Large uploads can exceed browser storage.", err);
  }
}

function renderFeed(filter=""){
  const feed = $("#feed");
  feed.innerHTML = "";
  const list = state.posts.filter(p => `${p.user} ${p.text}`.toLowerCase().includes(filter.toLowerCase()));
  list.forEach(post => feed.appendChild(buildPost(post)));
  $("#postCount").textContent = state.posts.length;
}
function buildPost(post){
  const node = $("#postTemplate").content.firstElementChild.cloneNode(true);
  $(".avatar",node).textContent = post.user.slice(0,1).toUpperCase();
  $(".post-user strong",node).textContent = post.user;
  $(".post-user span",node).textContent = post.time || "now";
  $(".post-copy",node).textContent = post.text || "";
  const likeBtn = $(".like-btn",node);
  likeBtn.querySelector("span").textContent = post.likes || 0;
  likeBtn.setAttribute("aria-label", `Like, ${post.likes || 0} likes`);
  const commentBtn = $(".comment-toggle",node);
  commentBtn.querySelector("span").textContent = (post.comments || []).length;
  commentBtn.setAttribute("aria-label", `Show comments, ${(post.comments || []).length} comments`);

  const media = $(".post-media",node);
  const type = post.type || (post.media ? "image" : null);
  if(type === "image" && (post.media || post.src)){
    const img = document.createElement("img"); img.src = post.media || post.src; img.alt = post.altText || "User post"; media.appendChild(img);
  }else if(type === "audio" && post.src){
    const player = document.createElement("audio"); player.controls = true; player.src = post.src; media.appendChild(player);
    if(post.caption){
      const caption = document.createElement("p"); caption.className = "post-caption"; caption.textContent = post.caption; media.appendChild(caption);
    }
  }else if(type === "track" && post.trackId){
    const idx = DATA.tracks.findIndex(t => t.id === post.trackId);
    const t = DATA.tracks[idx < 0 ? 0 : idx];
    media.innerHTML = `<div class="media-card" style="margin-top:8px"><div class="media-card-body"><h3>${escapeHtml(t.title)}</h3><p>${escapeHtml(t.artist)}</p><button class="inline-track-play">▶ Play on AFAB Nation Radio</button></div></div>`;
    $(".inline-track-play",media).addEventListener("click", () => setTrack(idx < 0 ? 0 : idx, true));
  }

  likeBtn.addEventListener("click", () => {
    post.likes = (post.likes || 0) + 1; savePosts(); renderFeed($("#searchInput").value);
  });
  commentBtn.addEventListener("click", () => {
    const c = $(".comments",node); c.hidden = !c.hidden;
    commentBtn.setAttribute("aria-expanded", String(!c.hidden));
  });
  const list = $(".comment-list",node);
  (post.comments || []).forEach(c => {
    const div = document.createElement("div"); div.className="comment-item"; div.textContent=c; list.appendChild(div);
  });
  $(".comment-compose button",node).addEventListener("click", () => {
    const input = $(".comment-compose input",node);
    const value = input.value.trim(); if(!value) return;
    post.comments = post.comments || []; post.comments.push(value); savePosts(); renderFeed($("#searchInput").value);
  });
  return node;
}
$("#searchInput").addEventListener("input", e => renderFeed(e.target.value));

function escapeHtml(v=""){
  return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

renderMusic(); renderMerch(); renderFeed(); setTrack(0);

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(err => console.warn("Service worker registration failed.", err));
  });
}