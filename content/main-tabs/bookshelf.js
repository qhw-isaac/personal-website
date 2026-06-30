// ================================================
// 📚 BOOKSHELF WORKSPACE
// ================================================
// A reading shelf rendered as book spines.
//   1st click  → slide the book out to reveal its cover
//   2nd click  → open a lightbox with title, author, and
//                reading stats (from content/books/reading-log.csv)
// Covers live in content/books/ (filename = title).
// ================================================

const BOOKSHELF_BOOKS = [
    { file: "Nicomachean Ethics.jpg",                                            author: "Aristotle" },
    { file: "The Philosophy of Kant.jpg",                                        author: "Immanuel Kant" },
    { file: "Economic Philosophy.jpg",                                           author: "Joan Robinson" },
    { file: "The Theory of Incentives.jpg",                                      author: "Laffont & Martimort" },
    { file: "The Handbook of Experimental Economics.jpg",                        author: "Kagel & Roth" },
    { file: "A Life of Experimental Economics - Volume II - The Next Fifty Years.webp", author: "Vernon L. Smith" },
    { file: "The Universal Book of Mathematics.jpg",                             author: "David Darling" },
    { file: "The Data Detective.jpg",                                            author: "Tim Harford" },
    { file: "The Pattern Seekers.png",                                           author: "Simon Baron-Cohen" },
    { file: "Hidden Potential.jpg",                                              author: "Adam Grant" },
    { file: "Rich Dad Poor Dad.jpg",                                             author: "Robert Kiyosaki" },
    { file: "Animal Welfare.png",                                                author: "" },
    { file: "The Humane Economy.jpg",                                            author: "Wayne Pacelle" },
    { file: "Animal Farm.jpg",                                                   author: "George Orwell" },
    { file: "The Hen Who Dreamed She Could Fly.jpg",                             author: "Sun-mi Hwang" },
    { file: "Fifteen Dogs.jpg",                                                  author: "André Alexis" },
    { file: "The Murder of Roger Ackroyd.jpg",                                   author: "Agatha Christie" },
    { file: "On Earth We're Briefly Gorgeous.jpg",                               author: "Ocean Vuong" }
];

// Stable per-title variation so the shelf looks like real books
// of differing heights and thicknesses (no randomness on reload).
function bookshelfHash(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
    return sum;
}

// Reading log lives in a CSV the user can edit:
//   content/books/reading-log.csv  →  title,status,hours,page
// content/books/reading-log.js mirrors it as a JS array (regenerated from the
// CSV by the tracker updater) so the stats also work over file://, where
// fetch() is blocked. We prefer the JS data and fall back to fetching the CSV.
let BOOKSHELF_READING_LOG = null;

function indexReadingLog(entries) {
    const log = {};
    entries.forEach(e => {
        const title = (e.title || '').trim();
        if (!title) return;
        const page = (e.page === null || e.page === undefined || e.page === '')
            ? NaN : parseInt(e.page, 10);
        log[title.toLowerCase()] = {
            status: (e.status || '').trim(),
            hours: parseFloat(e.hours),
            page: page
        };
    });
    return log;
}

function parseReadingLogCSV(text) {
    const entries = [];
    const lines = text.trim().split(/\r?\n/);
    lines.shift(); // header
    lines.forEach(line => {
        if (!line.trim()) return;
        // Parse from the right so a title containing commas stays intact.
        const parts = line.split(',');
        if (parts.length < 4) return;
        const page = parts.pop().trim();
        const hours = parts.pop().trim();
        const status = parts.pop().trim();
        const title = parts.join(',').trim().replace(/^"|"$/g, '');
        entries.push({ title, status, hours, page });
    });
    return entries;
}

function loadReadingLog() {
    if (BOOKSHELF_READING_LOG) return;

    // Preferred: the JS mirror (works over file:// and http).
    if (typeof BOOKSHELF_READING_LOG_DATA !== 'undefined') {
        BOOKSHELF_READING_LOG = indexReadingLog(BOOKSHELF_READING_LOG_DATA);
        return;
    }

    // Fallback: fetch the CSV directly (http only).
    fetch('content/books/reading-log.csv')
        .then(r => r.ok ? r.text() : Promise.reject(r.status))
        .then(text => { BOOKSHELF_READING_LOG = indexReadingLog(parseReadingLogCSV(text)); })
        .catch(() => { BOOKSHELF_READING_LOG = {}; });
}

function buildBookshelfHTML() {
    loadReadingLog();
    const spines = BOOKSHELF_BOOKS.map((book, i) => {
        const title = book.file.replace(/\.[^.]+$/, '');
        const src = `content/books/${book.file}`;
        const h = bookshelfHash(title);
        const height = 210 + (h % 5) * 10;        // 210–250px
        const spineW = 36 + (h % 6) * 2.4;        // 36–48px
        const tooltip = book.author ? `${title} — ${book.author}` : title;
        const esc = (s) => (s || '').replace(/"/g, '&quot;');
        // Apostrophes in filenames (e.g. "We're") break url('...'), so encode them.
        const cssSrc = src.replace(/'/g, '%27');
        return `
            <div class="bsf-book" data-i="${i}" style="--h:${height}px; --w:${spineW}px;"
                 title="${esc(tooltip)}"
                 data-title="${esc(title)}" data-author="${esc(book.author)}" data-cover="${esc(src)}"
                 onclick="toggleBook(this)">
                <div class="bsf-spine" style="background-image:url('${cssSrc}')">
                    <span class="bsf-shine"></span>
                </div>
                <img class="bsf-cover" src="${src}" alt="${title} cover" loading="lazy">
            </div>`;
    }).join('');

    return `
<style>
    .bsf-wrap { width:100%; padding:18px 22px 8px; box-sizing:border-box; }

    /* The shelf: a single row of books resting on a wooden ledge.
       The ledge is painted as a tiled background with background-attachment:local
       so it covers the FULL scrollable width and reaches the last book (an
       absolutely-positioned ::after would only span the visible area and stop
       short once you scroll). The wood is horizontally uniform, so repeat-x is
       seamless. Layer 1 = soft shadow above the board, layer 2 = the board. */
    .bsf-shelf {
        position:relative;
        display:flex; align-items:flex-end; gap:5px;
        overflow-x:auto; overflow-y:visible;
        padding:48px 14px 18px;          /* top room for the lift, bottom for the ledge */
        scrollbar-width:thin;
        background-image:
            linear-gradient(to top, rgba(0,0,0,.4), rgba(0,0,0,0)),
            linear-gradient(to bottom, #8a6a44 0, #8a6a44 1px, #6b4a2b 1px, #4a3018 100%);
        background-repeat: repeat-x, repeat-x;
        background-position: left calc(100% - 18px), left bottom;
        background-size: 140px 14px, 140px 18px;
        background-attachment: local, local;
    }

    .bsf-book {
        position:relative;
        width:var(--w); height:var(--h);
        flex:0 0 auto;
        cursor:pointer;
        transition:width .5s cubic-bezier(.2,.8,.2,1),
                   transform .5s cubic-bezier(.2,.8,.2,1);
        transform-origin:bottom center;
    }
    .bsf-book:hover { transform:translateY(-10px); }

    .bsf-spine {
        position:absolute; inset:0;
        background-size:cover; background-position:center;
        border-radius:2px 3px 3px 2px;
        box-shadow: inset -7px 0 12px rgba(0,0,0,.4),
                    inset 6px 0 6px rgba(255,255,255,.08),
                    2px 3px 8px rgba(0,0,0,.55);
        transition:opacity .5s ease;
    }
    /* A soft side-shading reads as a spine without darkening the whole book,
       so revealing the cover doesn't cause a harsh brightness jump. */
    .bsf-spine::before {
        content:''; position:absolute; inset:0; border-radius:inherit;
        background:linear-gradient(90deg, rgba(0,0,0,.4), rgba(0,0,0,.04) 42%, rgba(0,0,0,.12) 72%, rgba(0,0,0,.38));
        transition:opacity .5s ease;
    }
    .bsf-shine {
        position:absolute; top:0; bottom:0; left:22%;
        width:3px; background:rgba(255,255,255,.18);
        filter:blur(1px); z-index:1;
        transition:opacity .4s ease;
    }
    .bsf-cover {
        position:absolute; inset:0;
        width:100%; height:100%;
        object-fit:cover;
        border-radius:2px;
        box-shadow:3px 4px 14px rgba(0,0,0,.6);
        opacity:0; pointer-events:none;
        transition:opacity .5s ease;
    }

    /* Stage 1 — "pulled": the book slides out to full cover width so you
       can see the cover. (Click again to open it up in the lightbox.) */
    .bsf-book.pulled { width:150px; transform:translateY(-10px); z-index:5; }
    .bsf-book.pulled .bsf-spine { opacity:0; }
    .bsf-book.pulled .bsf-spine::before { opacity:0; }
    .bsf-book.pulled .bsf-shine { opacity:0; }
    .bsf-book.pulled .bsf-cover { opacity:1; }

    /* Stage 2 — "open it up": full-screen lightbox with the cover and a
       separate text panel, so the title never overlaps the artwork. */
    .bsf-lightbox {
        position:fixed; inset:0; z-index:1000;
        display:none; align-items:center; justify-content:center;
        padding:32px; box-sizing:border-box;
        background:rgba(0,0,0,.78); backdrop-filter:blur(4px);
    }
    .bsf-lightbox.show { display:flex; }
    /* The whole popup is an open book: two pages meeting at a centre binding,
       with stacked page edges on the outer sides and a gentle page bow. */
    .bsf-lb-card {
        position:relative;
        display:flex; align-items:stretch;
        max-width:760px; width:100%;
        padding:48px 52px; box-sizing:border-box;
        background:linear-gradient(90deg,
            #dccba6 0%, #d3c19a 48.5%, #ab9670 50%, #d3c19a 51.5%, #dccba6 100%);
        border:1px solid #bdab84;
        border-radius:7px 7px 10px 10px / 9px 9px 16px 16px;
        box-shadow:
            0 26px 60px rgba(0,0,0,.55),
            6px 0 0 -2px #c8b78f, 11px 0 0 -4px #bba87f,    /* right page stack */
            -6px 0 0 -2px #c8b78f, -11px 0 0 -4px #bba87f;  /* left page stack */
        transform:translateY(10px) scale(.98); opacity:0;
        transition:transform .3s cubic-bezier(.2,.8,.2,1), opacity .3s ease;
    }
    .bsf-lightbox.show .bsf-lb-card { transform:none; opacity:1; }
    /* Centre binding shadow (the book's gutter) — spans the full spine height */
    .bsf-lb-card::before {
        content:''; position:absolute; top:0; bottom:0; left:50%;
        width:46px; transform:translateX(-50%); pointer-events:none; z-index:2;
        background:linear-gradient(90deg,
            rgba(80,60,30,0), rgba(80,60,30,.16) 34%, rgba(80,60,30,.32) 50%, rgba(80,60,30,.16) 66%, rgba(80,60,30,0));
    }
    .bsf-lb-page { flex:1 1 0; display:flex; align-items:center; min-width:0; }
    .bsf-lb-page-left  { justify-content:flex-end; padding-right:34px; }
    .bsf-lb-page-right { padding-left:34px; }
    .bsf-lb-cover {
        flex:0 0 auto; width:300px; height:456px; object-fit:cover;
        border-radius:2px;
        box-shadow:0 14px 30px rgba(0,0,0,.55), 0 2px 6px rgba(0,0,0,.45);
    }
    .bsf-lb-info { flex:1 1 auto; min-width:0; }
    .bsf-lb-title  { font-family:'Poppins', sans-serif; color:#2c2620; font-size:27px; line-height:1.25; margin:0 0 12px; }
    .bsf-lb-author { font-family:'JetBrains Mono', monospace; color:#8a6a3a; font-size:13px; margin:0 0 18px; }

    /* Reading-log stats (from content/books/reading-log.csv) */
    .bsf-lb-meta { display:none; }
    .bsf-lb-meta.show { display:block; }
    .bsf-lb-status {
        display:inline-block; margin-bottom:16px;
        padding:4px 11px; border-radius:999px;
        font-family:'JetBrains Mono', monospace; font-size:11px;
        text-transform:uppercase; letter-spacing:.07em;
        border:1px solid currentColor;
    }
    .bsf-lb-status.st-progress { color:#3f8a35; background:rgba(63,138,53,.13); }
    .bsf-lb-status.st-pause    { color:#a4711a; background:rgba(164,113,26,.13); }
    .bsf-lb-status.st-idle     { color:#7a7060; background:rgba(122,112,96,.13); }
    .bsf-lb-status.st-complete { color:#2f6aa3; background:rgba(47,106,163,.13); }
    .bsf-lb-stats { display:flex; gap:30px; }
    .bsf-lb-stat-num   { display:block; font-family:'Poppins', sans-serif; color:#2c2620; font-size:22px; font-weight:600; }
    .bsf-lb-stat-label { display:block; font-family:'JetBrains Mono', monospace; color:#8a7c62; font-size:10px; text-transform:uppercase; letter-spacing:.06em; margin-top:4px; }
    .bsf-lb-close {
        position:absolute; top:14px; right:18px;
        background:none; border:none; color:#6b5d45;
        font-size:26px; line-height:1; padding:4px 8px; cursor:pointer;
    }
    .bsf-lb-close:hover { color:#2c2620; }
    @media (max-width:560px) {
        .bsf-lb-card { flex-direction:column; align-items:center; gap:18px; text-align:center; }
        .bsf-lb-card::before { display:none; }
        .bsf-lb-page { flex:0 0 auto; justify-content:center; padding:0; }
        .bsf-lb-stats { justify-content:center; }
    }
</style>

<div class="bsf-wrap">
    <div class="bsf-shelf">
        ${spines}
    </div>
    <div class="bsf-lightbox" id="bsf-lightbox" onclick="if(event.target===this)closeBookLightbox()">
        <div class="bsf-lb-card">
            <button class="bsf-lb-close" title="Close" onclick="closeBookLightbox()">&times;</button>
            <h3 class="bsf-lb-title"></h3>
            <div class="bsf-lb-body">
                <div class="bsf-lb-page bsf-lb-page-left">
                    <img class="bsf-lb-cover" src="" alt="">
                </div>
                <div class="bsf-lb-page bsf-lb-page-right">
                    <div class="bsf-lb-info">
                        <p class="bsf-lb-author"></p>
                        <div class="bsf-lb-meta">
                            <span class="bsf-lb-status"></span>
                            <div class="bsf-lb-stats">
                                <div class="bsf-lb-stat bsf-lb-page-stat">
                                    <span class="bsf-lb-stat-num bsf-lb-pagenum"></span>
                                    <span class="bsf-lb-stat-label">current page</span>
                                </div>
                                <div class="bsf-lb-stat">
                                    <span class="bsf-lb-stat-num bsf-lb-hours"></span>
                                    <span class="bsf-lb-stat-label">hours read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
}

// Two-stage interaction:
//   1st click on a spine  → pull the book out to reveal its cover
//   2nd click on a pulled book → open the lightbox with clear title text
function toggleBook(el) {
    if (el.classList.contains('pulled')) {
        openBookLightbox(el);
        return;
    }
    el.closest('.bsf-shelf').querySelectorAll('.bsf-book.pulled')
        .forEach(b => b.classList.remove('pulled'));
    el.classList.add('pulled');
}

function openBookLightbox(el) {
    const lb = document.getElementById('bsf-lightbox');
    if (!lb) return;

    const cover = lb.querySelector('.bsf-lb-cover');
    if (cover) {
        cover.src = el.dataset.cover || '';
        cover.alt = `${el.dataset.title || ''} cover`;
    }

    lb.querySelector('.bsf-lb-title').textContent = el.dataset.title || '';
    const authorEl = lb.querySelector('.bsf-lb-author');
    if (el.dataset.author) {
        authorEl.textContent = el.dataset.author;
        authorEl.style.display = '';
    } else {
        authorEl.style.display = 'none';
    }

    populateReadingMeta(lb, el.dataset.title || '');

    lb.classList.add('show');
}

const BOOKSHELF_STATUS_META = {
    'in progress': { cls: 'st-progress', label: 'Currently reading' },
    'pause':       { cls: 'st-pause',    label: 'Paused' },
    'paused':      { cls: 'st-pause',    label: 'Paused' },
    'idle':        { cls: 'st-idle',     label: 'Not started' },
    'complete':    { cls: 'st-complete', label: 'Completed' },
    'completed':   { cls: 'st-complete', label: 'Completed' }
};

function populateReadingMeta(lb, title) {
    const meta = lb.querySelector('.bsf-lb-meta');
    const entry = BOOKSHELF_READING_LOG && BOOKSHELF_READING_LOG[title.toLowerCase()];
    const statusKey = entry ? (entry.status || '').toLowerCase() : '';

    // "Not started" / Idle books show no stats — same as a cover with no entry.
    if (!entry || statusKey === 'idle' || statusKey === 'not started') {
        meta.classList.remove('show');
        return;
    }

    const statusEl = lb.querySelector('.bsf-lb-status');
    const info = BOOKSHELF_STATUS_META[statusKey];
    if (info) {
        statusEl.textContent = info.label;
        statusEl.className = `bsf-lb-status ${info.cls}`;
        statusEl.style.display = '';
    } else {
        statusEl.style.display = 'none';
    }

    const hours = isNaN(entry.hours) ? '—' : Number(entry.hours.toFixed(1));
    lb.querySelector('.bsf-lb-hours').textContent = hours;

    const pageStat = lb.querySelector('.bsf-lb-page-stat');
    if (!isNaN(entry.page)) {
        lb.querySelector('.bsf-lb-pagenum').textContent = entry.page;
        pageStat.style.display = '';
    } else {
        pageStat.style.display = 'none';
    }

    meta.classList.add('show');
}

function closeBookLightbox() {
    const lb = document.getElementById('bsf-lightbox');
    if (lb) lb.classList.remove('show');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBookLightbox();
});

const BOOKSHELF_WORKSPACE = {
    title: "Reading Shelf",
    description: "Books I've been reading.",
    tabs: [
        {
            id: "bookshelf",
            icon: "fas fa-book",
            name: "Bookshelf",
            content: () => buildBookshelfHTML()
        }
    ]
};
