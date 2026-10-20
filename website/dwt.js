// ── DATA ──
const products = [
    {
        
        id: 1,
        name: "Wolf Jersey Pro",
        cat: "Pro Kit",
        price: 89,
        badge: "Best Seller",
        badgeType: "",
        bga: "linear-gradient(135deg,#1a1a2e,#0e0e1e)",
        bgb: "linear-gradient(160deg,#2a2a4e,#1a1a2e)",

        // Bdelna hedhi b'zouz tsawer:
        images: {
            front: "img\amzgh products\New Project (10).jpg", // Thabet mel esm wel dossier s7i7 3andek
            back: "img/jersey-back.png"
        },

        desc: "Championship-grade jersey. Moisture-wicking fabric. DWT embroidered crest. Worn by the pros, made for the pack.",
        sizes: ["XS", "S", "M", "L", "XL", "2XL"],
        colors: ["#e0e0e0", "#2a2a2a", "#2a2a4e"],
        features: [
            "Premium polyester blend",
            "Moisture-wicking",
            "Embroidered DWT logo",
            "Competition fit",
        ],
    }
    ,
{
    id: 2,
        name: "DWT Hoodie Black",
            cat: "New Collection",
                price: 120,
                    badge: "New",
                        badgeType: "new",
                            bga: "linear-gradient(135deg,#141414,#0a0a0a)",
                                bgb: "linear-gradient(160deg,#1e1e1e,#141414)",
                                    desc: "Heavy fleece hoodie with wolf howl graphic on back. Dark Lab premium material. Cold nights, hot wins.",
                                        sizes: ["S", "M", "L", "XL", "2XL"],
                                            colors: ["#141414", "#2a2a2a", "#b8b8c8"],
                                                features: [
                                                    "400g fleece",
                                                    "Hidden kangaroo pocket",
                                                    "Wolf graphic back print",
                                                    "Ribbed cuffs & hem",
                                                ],
    },
{
    id: 3,
        name: "Dark Lab Cap",
            cat: "Accessories",
                price: 45,
                    badge: "",
                        badgeType: "",
                            bga: "linear-gradient(135deg,#111,#1a1418)",
                                bgb: "linear-gradient(160deg,#1a1a1a,#111111)",
                                    desc: "Structured snapback with embroidered Dark Lab logo. One size fits most. Adjustable snap closure.",
                                        sizes: ["One Size"],
                                            colors: ["#141414", "#2a2a2a", "#f0f0f0"],
                                                features: [
                                                    "Structured 6-panel",
                                                    "Embroidered logo",
                                                    "Flat brim",
                                                    "Snapback closure",
                                                ],
    },
{
    id: 4,
        name: "Wolf Collab Tee",
            cat: "Collabs",
                price: 75,
                    oldPrice: 95,
                        badge: "Sale",
                            badgeType: "sale",
                                bga: "linear-gradient(135deg,#0e1a0e,#080808)",
                                    bgb: "linear-gradient(160deg,#1a2a1a,#0e1a0e)",
                                        desc: "Limited collab edition. Wolf silhouette art by local designer. 180g combed cotton. Only 200 units produced.",
                                            sizes: ["S", "M", "L", "XL"],
                                                colors: ["#0e1a0e", "#141414", "#2a3a2a"],
                                                    features: [
                                                        "180g combed cotton",
                                                        "Limited 200 units",
                                                        "Artist signature",
                                                        "Numbered edition",
                                                    ],
    },
];

const museumItems = [
    {
        name: "Season 1 Jersey",
        cat: "Pro Kit",
        year: "2022",
        price: "TND 79",
        bg: "linear-gradient(135deg,#1a0a1a,#0a0a0a)",
        desc: "The very first DWT competition jersey. Worn during the inaugural season. Only 50 were ever made.",
    },
    {
        name: "OG Wolf Tee",
        cat: "Limited Drop",
        year: "2021",
        price: "TND 45",
        bg: "linear-gradient(135deg,#1a1a0a,#0a0a0a)",
        desc: "The original Dark Wolf Team t-shirt. Simple. Raw. Where it all began. This started the culture.",
    },
    {
        name: "Launch Hoodie 001",
        cat: "New Collection",
        year: "2021",
        price: "TND 99",
        bg: "linear-gradient(135deg,#0a1a0a,#0a0a0a)",
        desc: "First Dark Lab hoodie ever released. Sold out in 4 hours. Never reprinted. A true piece of DWT history.",
    },
    {
        name: "Collab Wolf x Nocturne",
        cat: "Collabs",
        year: "2023",
        price: "TND 120",
        bg: "linear-gradient(135deg,#1a0a0e,#0a0a0a)",
        desc: "Collaboration with Nocturne design studio. 100 units. Hand-signed by DWT players. Legendary status.",
    },
    {
        name: "Season 2 Competition Kit",
        cat: "Pro Kit",
        year: "2023",
        price: "TND 89",
        bg: "linear-gradient(135deg,#0a0a1a,#0a0a0a)",
        desc: "Full kit worn during our first international tournament. The pack wore this into battle and came back champions.",
    },
    {
        name: "Archive Cap Vol.1",
        cat: "Accessories",
        year: "2022",
        price: "TND 38",
        bg: "linear-gradient(135deg,#141414,#0a0a0a)",
        desc: "First ever Dark Lab headwear drop. Wool-blend construction. A collector piece for true DWT supporters.",
    },
];

const games = [
    {
        name: "Valorant",
        mem: "6 Players",
        color: "#ff4655",
        bg: "linear-gradient(135deg,#1a0a0e,#0a0a0a)",
        logo: "VAL",
    },
    {
        name: "FC 25",
        mem: "4 Players",
        color: "#00d4aa",
        bg: "linear-gradient(135deg,#0a1a14,#0a0a0a)",
        logo: "FC25",
    },
    {
        name: "Call of Duty",
        mem: "5 Players",
        color: "#ff8800",
        bg: "linear-gradient(135deg,#1a0e0a,#0a0a0a)",
        logo: "COD",
    },
    {
        name: "PUBG Mobile",
        mem: "4 Players",
        color: "#f5d842",
        bg: "linear-gradient(135deg,#1a1a0a,#0a0a0a)",
        logo: "PUBG",
    },
    {
        name: "Fortnite",
        mem: "3 Players",
        color: "#00b4ff",
        bg: "linear-gradient(135deg,#0a141a,#0a0a0a)",
        logo: "FN",
    },
    {
        name: "Rocket League",
        mem: "3 Players",
        color: "#ff6b35",
        bg: "linear-gradient(135deg,#1a0a05,#0a0a0a)",
        logo: "RL",
    },
    {
        name: "EA Sports FC",
        mem: "4 Players",
        color: "#6bff6b",
        bg: "linear-gradient(135deg,#051a05,#0a0a0a)",
        logo: "EASF",
    },
];

const members = [
    {
        name: "ShadowFang",
        role: "IGL / Rifler",
        game: "Valorant",
        kd: "1.42",
        rating: "★★★★★",
        bg: "linear-gradient(160deg,#1a0a0e,#080808)",
    },
    {
        name: "NightWolf",
        role: "Duelist",
        game: "Valorant",
        kd: "1.68",
        rating: "★★★★★",
        bg: "linear-gradient(160deg,#1a1a2e,#080808)",
    },
    {
        name: "GhostByte",
        role: "Sentinel",
        game: "Valorant",
        kd: "1.21",
        rating: "★★★★☆",
        bg: "linear-gradient(160deg,#0e1a0e,#080808)",
    },
    {
        name: "IronFrost",
        role: "Controller",
        game: "Valorant",
        kd: "1.15",
        rating: "★★★★☆",
        bg: "linear-gradient(160deg,#0a141a,#080808)",
    },
    {
        name: "DarkStrike",
        role: "Initiator",
        game: "Valorant",
        kd: "1.33",
        rating: "★★★★★",
        bg: "linear-gradient(160deg,#1a0e0a,#080808)",
    },
    {
        name: "WolfKing",
        role: "Striker",
        game: "FC 25",
        kd: "92 OVR",
        rating: "★★★★★",
        bg: "linear-gradient(160deg,#1a1a0a,#080808)",
    },
    {
        name: "SilentBlade",
        role: "Midfielder",
        game: "FC 25",
        kd: "88 OVR",
        rating: "★★★★☆",
        bg: "linear-gradient(160deg,#0a1a14,#080808)",
    },
    {
        name: "Phantom99",
        role: "Goalkeeper",
        game: "FC 25",
        kd: "85 OVR",
        rating: "★★★★☆",
        bg: "linear-gradient(160deg,#14140a,#080808)",
    },
    {
        name: "GhostOps",
        role: "Entry Fragger",
        game: "Call of Duty",
        kd: "2.1",
        rating: "★★★★★",
        bg: "linear-gradient(160deg,#1a0e0a,#080808)",
    },
    {
        name: "IronWolf",
        role: "Support",
        game: "Call of Duty",
        kd: "1.8",
        rating: "★★★★☆",
        bg: "linear-gradient(160deg,#1a1414,#080808)",
    },
    {
        name: "SilentKill",
        role: "Sniper",
        game: "Call of Duty",
        kd: "2.4",
        rating: "★★★★★",
        bg: "linear-gradient(160deg,#1a1010,#080808)",
    },
    {
        name: "NightHunter",
        role: "Sniper",
        game: "PUBG Mobile",
        kd: "4.2",
        rating: "★★★★★",
        bg: "linear-gradient(160deg,#141a0a,#080808)",
    },
    {
        name: "StormRider",
        role: "Support",
        game: "PUBG Mobile",
        kd: "3.1",
        rating: "★★★★☆",
        bg: "linear-gradient(160deg,#121a08,#080808)",
    },
    {
        name: "DarkPack",
        role: "Rusher",
        game: "Fortnite",
        kd: "8.5",
        rating: "★★★★★",
        bg: "linear-gradient(160deg,#0a121a,#080808)",
    },
    {
        name: "WolfAim",
        role: "Builder",
        game: "Fortnite",
        kd: "7.2",
        rating: "★★★★☆",
        bg: "linear-gradient(160deg,#080e14,#080808)",
    },
    {
        name: "RocketWolf",
        role: "Striker",
        game: "Rocket League",
        kd: "1450 MMR",
        rating: "★★★★★",
        bg: "linear-gradient(160deg,#1a0800,#080808)",
    },
    {
        name: "BoostMaster",
        role: "Midfield",
        game: "Rocket League",
        kd: "1380 MMR",
        rating: "★★★★☆",
        bg: "linear-gradient(160deg,#160600,#080808)",
    },
    {
        name: "AlphaStriker",
        role: "Striker",
        game: "EA Sports FC",
        kd: "91 OVR",
        rating: "★★★★★",
        bg: "linear-gradient(160deg,#001a00,#080808)",
    },
];

const matches = [
    { game: "Valorant", t2: "Phoenix GG", time: "LIVE", isLive: true },
    { game: "FC 25", t2: "Atlas FC", time: "Jul 5 · 20:00" },
    { game: "Call of Duty", t2: "Storm Team", time: "Jul 8 · 18:30" },
    { game: "PUBG Mobile", t2: "Iron Wolves", time: "Jul 12 · 15:00" },
    { game: "Fortnite", t2: "NightOwls", time: "Jul 15 · 19:00" },
    { game: "Rocket League", t2: "TurboFC", time: "Jul 18 · 17:00" },
    { game: "EA Sports FC", t2: "ProKicks", time: "Jul 20 · 21:00" },
    { game: "Valorant", t2: "AlphaCrew", time: "Jul 22 · 20:00" },
];

const socials = [
    {
        name: "Instagram",
        handle: "@darkwolfteam",
        color: "#E1306C",
        url: "https://instagram.com",
        icon: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>',
    },
    {
        name: "Twitch",
        handle: "darkw0lfteam",
        color: "#9146FF",
        url: "https://www.twitch.tv/darkw0lfteam",
        icon: '<path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>',
    },
    {
        name: "Discord",
        handle: "Join the Pack",
        color: "#5865F2",
        url: "https://discord.com",
        icon: '<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.138 18.116a19.902 19.902 0 0 0 5.993 3.031.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>',
    },
    {
        name: "X / Twitter",
        handle: "@DarkWolfTeam",
        color: "#ffffff",
        url: "https://twitter.com",
        icon: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
    },
    {
        name: "YouTube",
        handle: "Dark Wolf TV",
        color: "#ff0000",
        url: "https://youtube.com",
        icon: '<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>',
    },
    {
        name: "Facebook",
        handle: "Dark Wolf Team",
        color: "#1877F2",
        url: "https://facebook.com",
        icon: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
    },
];

const ytVideos = [
    {
        title: "Behind the Wolfpack — Season 3 Ep. 4",
        views: "89K views",
        ago: "1 week ago",
        bg: "linear-gradient(135deg,#1a1a2e,#0a0a0a)",
    },
    {
        title: "DWT FC25 — Tournament Highlights Compilation",
        views: "42K views",
        ago: "2 weeks ago",
        bg: "linear-gradient(135deg,#1a0a0a,#0a0a0a)",
    },
    {
        title: "New Player Spotlight — Wolf Recruit 2026",
        views: "31K views",
        ago: "3 weeks ago",
        bg: "linear-gradient(135deg,#0a1a0a,#0a0a0a)",
    },
    {
        title: "Dark Lab Unboxing — Pro Kit Summer 2026",
        views: "58K views",
        ago: "1 month ago",
        bg: "linear-gradient(45deg,#1a1a0a,#0a0a0a)",
    },
];

// ── CART ──
let cart = [];
function addToCart(id, e) {
    if (e) e.stopPropagation();
    const p = products.find((x) => x.id === id);
    const ex = cart.find((x) => x.id === id);
    if (ex) ex.qty++;
    else cart.push({ ...p, qty: 1 });
    renderPanel();
    document.getElementById("opanel").classList.add("open");
}
function updateQty(id, d) {
    const i = cart.findIndex((x) => x.id === id);
    if (i === -1) return;
    cart[i].qty += d;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    renderPanel();
}
function renderPanel() {
    const el = document.getElementById("opitems"),
        tot = document.getElementById("ototal"),
        qty = document.getElementById("oqty"),
        badge = document.getElementById("cartBadge");
    if (!cart.length) {
        el.innerHTML =
            '<div style="text-align:center;color:var(--gray3);padding:40px 0;font-family:Rajdhani;font-size:13px;letter-spacing:.1em;text-transform:uppercase">Your order is empty</div>';
        tot.textContent = "TND 0.00";
        qty.textContent = "0";
        badge.textContent = "0";
        return;
    }
    let total = 0,
        totalQ = 0;
    el.innerHTML = cart
        .map((it) => {
            const lt = it.price * it.qty;
            total += lt;
            totalQ += it.qty;
            return `<div class="oitem"><div class="oimg" style="background:${it.bga}"></div><div class="oinfo"><div class="oname">${it.name}</div><div class="ocat">${it.cat}</div><div class="qc"><button class="qb" onclick="updateQty(${it.id},-1)">−</button><div class="qn">${it.qty}</div><button class="qb" onclick="updateQty(${it.id},1)">+</button><span class="oprm" onclick="updateQty(${it.id},-99)">✕</span></div></div><div class="oamt">TND ${lt}</div></div>`;
        })
        .join("");
    tot.textContent = `TND ${total.toFixed(2)}`;
    qty.textContent = totalQ;
    badge.textContent = totalQ;
}
function togglePanel() {
    document.getElementById("opanel").classList.toggle("open");
}
function confirmOrder() {
    if (!cart.length) return;
    alert(
        "🐺 Order confirmed! Dark Wolf Team thanks you.\nConfirmation email incoming.",
    );
    cart = [];
    renderPanel();
    document.getElementById("opanel").classList.remove("open");
}

// ── PRODUCT DETAIL ──
function openPD(id) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const sizes = p.sizes
        .map(
            (s) =>
                `<button class="szb${s === "M" ? " act" : ""}" onclick="this.parentNode.querySelectorAll('.szb').forEach(b=>b.classList.remove('act'));this.classList.add('act')">${s}</button>`,
        )
        .join("");
    const colors = p.colors
        .map(
            (c) =>
                `<div class="clr" style="background:${c}" onclick="this.parentNode.querySelectorAll('.clr').forEach(b=>b.classList.remove('act'));this.classList.add('act')"></div>`,
        )
        .join("");
    const feats = p.features
        .map(
            (f) =>
                `<div class="pdfeat"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span class="pdft">${f}</span></div>`,
        )
        .join("");
    document.getElementById("pdinner").innerHTML =
        `<div class="pdgallery"><div class="pdmainimg" id="pdmain" style="background:${p.bgb}"></div><div class="pdthumbs"><div class="pdthumb act" style="background:${p.bga}" onclick="switchImg(this,'${p.bga}')"></div><div class="pdthumb" style="background:${p.bgb}" onclick="switchImg(this,'${p.bgb}')"></div><div class="pdthumb" style="background:${p.bga};filter:hue-rotate(30deg) brightness(.8)" onclick="switchImg(this,'${p.bga}')"></div><div class="pdthumb" style="background:${p.bgb};filter:hue-rotate(60deg)" onclick="switchImg(this,'${p.bgb}')"></div></div></div><div class="pddetails"><div class="pdcat">${p.cat}</div><h1 class="pdname">${p.name}</h1><div class="pdprice">TND ${p.price}${p.oldPrice ? `<span class="pdold">TND ${p.oldPrice}</span>` : ""}</div><p class="pddesc">${p.desc}</p><div class="pdlbl">Select Size</div><div class="sizes">${sizes}</div><div class="pdlbl">Color</div><div class="colors">${colors}</div><div class="pdbtns"><button class="bpd" onclick="addToCart(${p.id},null);closePD()">Add to Order</button><button class="bwl">♡ Wishlist</button></div><div class="pdfeats">${feats}</div></div>`;
    document.getElementById("pdpage").classList.add("open");
    document.body.style.overflow = "hidden";
}
function switchImg(t, bg) {
    document
        .querySelectorAll(".pdthumb")
        .forEach((x) => x.classList.remove("act"));
    t.classList.add("act");
    document.getElementById("pdmain").style.background = bg;
}
function closePD() {
    document.getElementById("pdpage").classList.remove("open");
    document.body.style.overflow = "";
}

// ── MUSEUM ──
function openMuseum() {
    document.getElementById("musGrid").innerHTML = museumItems
        .map(
            (m) =>
                `<div class="musCard"><div class="musCover" style="background:${m.bg}"></div><div class="musOverlay"><div class="musSoldBadge">Sold Out — Archive Only</div></div><div class="musInfo"><div class="musYear">${m.year}</div><div class="musName">${m.name}</div><div class="musCat">${m.cat}</div><div class="musDesc2">${m.desc}</div><div class="musPrice">${m.price}</div></div></div>`,
        )
        .join("");
    document.getElementById("museumPage").classList.add("open");
    document.body.style.overflow = "hidden";
}
function closeMuseum() {
    document.getElementById("museumPage").classList.remove("open");
    document.body.style.overflow = "";
}

// ── RENDER PRODUCTS ──
function renderProducts() {
    document.getElementById("pgrid").innerHTML = products
        .map(
            (p) =>
                `<div class="pcard rv" onclick="openPD(${p.id})"><div class="pimg"><div class="pimg-wrap"><div class="pimg-a" style="background:${p.bga}"></div><div class="pimg-b" style="background:${p.bgb}"></div></div>${p.badge ? `<div class="pbadge ${p.badgeType}">${p.badge}</div>` : ""}<div class="pqv"><button class="bqv" onclick="event.stopPropagation();openPD(${p.id})">Quick View</button></div></div><div class="pinfo"><div class="pname">${p.name}</div><div class="pcat">${p.cat}</div><div class="pfoot"><div class="pprice">TND ${p.price}${p.oldPrice ? `<span class="old">TND ${p.oldPrice}</span>` : ""}</div><button class="bac" onclick="addToCart(${p.id},event)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></button></div></div></div>`,
        )
        .join("");
}

// ── RENDER GAMES ──
function renderGames() {
    document.getElementById("ggrid").innerHTML = games
        .map(
            (g) =>
                `<div class="gcard" onclick="openMembersModal('${g.name}')"><div class="gcbg" style="background:${g.bg}"></div><div class="gcov"></div><div class="glogomark">${g.logo}</div><div class="gcinfo"><div class="gname">${g.name}</div><div class="gmem">${g.mem}</div></div><button class="ghbtn">View Team →</button></div>`,
        )
        .join("");
    document.querySelectorAll(".gcard").forEach((card, i) => {
        const bg = card.querySelector(".gcbg"),
            col = games[i].color;
        card.addEventListener("mouseenter", () => {
            bg.style.filter = "grayscale(0%) brightness(.65)";
            bg.style.background = `linear-gradient(135deg,${col}22,#0a0a0a)`;
        });
        card.addEventListener("mouseleave", () => {
            bg.style.filter = "grayscale(100%) brightness(.55)";
            bg.style.background = games[i].bg;
        });
    });
}

// ── RENDER MATCHES ──
function renderMatches() {
    document.getElementById("mstrip").innerHTML = matches
        .map(
            (m) =>
                `<div class="mcard"><div class="mgame">${m.game}</div><div class="mteams"><div class="mteam"><div class="mlogo">DWT</div><div class="mtn">Dark Wolf</div></div><div class="mvs">VS</div><div class="mteam"><div class="mlogo" style="background:var(--gray2)">${m.t2.slice(0, 3).toUpperCase()}</div><div class="mtn">${m.t2}</div></div></div><div class="mtime">${m.isLive ? '<span class="mlive">● LIVE NOW</span>' : m.time}</div></div>`,
        )
        .join("");
}

// ── MEMBERS MODAL ──
let activeGame = "All";
function openMembersModal(game) {
    activeGame = game || "All";
    // build tabs
    const allGames = ["All", ...new Set(members.map((m) => m.game))];
    document.getElementById("memtabs").innerHTML = allGames
        .map(
            (g) =>
                `<button class="memtabBtn${activeGame === g ? " act" : ""}" onclick="filterMembers('${g}')">${g}</button>`,
        )
        .join("");
    filterMembers(activeGame);
    document.getElementById("memov").classList.add("open");
    document.body.style.overflow = "hidden";
}
function filterMembers(game) {
    activeGame = game;
    document.querySelectorAll(".memtabBtn").forEach((b) => {
        b.classList.toggle("act", b.textContent === game);
    });
    const filtered =
        game === "All" ? members : members.filter((m) => m.game === game);
    document.getElementById("memgrid").innerHTML = filtered
        .map(
            (m) =>
                `<div class="memcard"><div class="memimg" style="background:${m.bg}"></div><div class="meminfo"><div class="memname">${m.name}</div><div class="memrole">${m.role}</div><div class="memgame">${m.game}</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px"><div style="font-family:'Orbitron',monospace;font-size:10px;color:var(--silver)">${m.kd}</div><div style="color:var(--wolf);font-size:11px">${m.rating}</div></div></div></div>`,
        )
        .join("");
}
function closeMem() {
    document.getElementById("memov").classList.remove("open");
    document.body.style.overflow = "";
}

// ── AUTH ──
function openModal(tab) {
    document.getElementById("authMov").classList.add("open");
    switchTab(tab || "login");
    document.body.style.overflow = "hidden";
}
function closeModal() {
    document.getElementById("authMov").classList.remove("open");
    document.body.style.overflow = "";
}
function switchTab(tab) {
    const l = tab === "login";
    document.getElementById("ltab").classList.toggle("act", l);
    document.getElementById("rtab").classList.toggle("act", !l);
    document.getElementById("lform").style.display = l ? "" : "none";
    document.getElementById("rform").style.display = l ? "none" : "";
    document.getElementById("mtitle").textContent = l
        ? "Welcome Back"
        : "Create Account";
}

// ── HERO SLIDER ──
let cur = 0,
    autoT,
    dragX = 0;
function slide(i) {
    const slides = document.querySelectorAll(".hslide"),
        dots = document.querySelectorAll(".hdot");
    slides[cur].classList.remove("act");
    dots[cur].classList.remove("act");
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add("act");
    dots[cur].classList.add("act");
    document.getElementById("hslides").style.transform =
        `translateX(-${cur * 100}%)`;
    clearInterval(autoT);
    autoT = setInterval(() => slide(cur + 1), 5500);
}
autoT = setInterval(() => slide(cur + 1), 5500);
const hd = document.getElementById("hdrag");
hd.addEventListener("mousedown", (e) => {
    dragX = e.clientX;
});
window.addEventListener("mouseup", (e) => {
    const d = dragX - e.clientX;
    if (Math.abs(d) > 60) {
        d > 0 ? slide(cur + 1) : slide(cur - 1);
    }
});
hd.addEventListener("touchstart", (e) => {
    dragX = e.touches[0].clientX;
});
hd.addEventListener("touchend", (e) => {
    const d = dragX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 60) {
        d > 0 ? slide(cur + 1) : slide(cur - 1);
    }
});

// ── CAROUSEL SCROLL ──
function scrollCarousel(id, dir) {
    const el = document.getElementById(id);
    const w = el.firstElementChild
        ? el.firstElementChild.offsetWidth + 2
        : 300;
    el.scrollBy({ left: dir * w * 2, behavior: "smooth" });
}

// ── HEADER SCROLL ──
window.addEventListener(
    "scroll",
    () => {
        document
            .getElementById("hdr")
            .classList.toggle("scrolled", window.scrollY > 60);
        document
            .getElementById("hdr")
            .classList.toggle("top", window.scrollY <= 60);
        const pct =
            (window.scrollY /
                (document.body.scrollHeight - window.innerHeight)) *
            100;
        document.getElementById("scrollbar").style.width = pct + "%";
    },
    { passive: true },
);

// ── REVEAL ──
function initReveal() {
    const els = document.querySelectorAll(".rv,.rvl,.rvr");
    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("vis");
                    obs.unobserve(e.target);
                }
            });
        },
        { threshold: 0.1 },
    );
    els.forEach((el) => obs.observe(el));
}

// ── STAT COUNTERS ──
function animCounters() {
    document.querySelectorAll(".snum[data-target]").forEach((el) => {
        const target = parseInt(el.dataset.target);
        let c = 0;
        const step = Math.ceil(target / 35);
        const iv = setInterval(() => {
            c = Math.min(c + step, target);
            el.textContent = c + (target > 9 ? "+" : "");
            if (c >= target) clearInterval(iv);
        }, 28);
    });
}
const sObs = new IntersectionObserver(
    (e) => {
        if (e[0].isIntersecting) {
            animCounters();
            sObs.disconnect();
        }
    },
    { threshold: 0.3 },
);
const sEl = document.querySelector(".tstats");
if (sEl) sObs.observe(sEl);

// ── COUNTDOWN ──
const TARGET = new Date("2026-08-15T18:00:00");
function updateTimer() {
    const diff = TARGET - new Date();
    if (diff <= 0) {
        ["tdays", "thours", "tmins", "tsecs"].forEach(
            (id) => (document.getElementById(id).textContent = "00"),
        );
        return;
    }
    document.getElementById("tdays").textContent = String(
        Math.floor(diff / 864e5),
    ).padStart(2, "0");
    document.getElementById("thours").textContent = String(
        Math.floor((diff % 864e5) / 36e5),
    ).padStart(2, "0");
    document.getElementById("tmins").textContent = String(
        Math.floor((diff % 36e5) / 6e4),
    ).padStart(2, "0");
    document.getElementById("tsecs").textContent = String(
        Math.floor((diff % 6e4) / 1e3),
    ).padStart(2, "0");
}
setInterval(updateTimer, 1000);
updateTimer();

// ── CURSOR + PARTICLES ──
const cdot = document.getElementById("cDot"),
    cring = document.getElementById("cRing");
let rx = 0,
    ry = 0,
    mx = 0,
    my = 0,
    lmx = 0,
    lmy = 0;
document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cdot.style.left = mx + "px";
    cdot.style.top = my + "px";
    const spd = Math.hypot(mx - lmx, my - lmy);
    if (spd > 14 && Math.random() > 0.65) spawnTrail(mx, my);
    lmx = mx;
    lmy = my;
});
document.addEventListener("mousedown", () =>
    cring.classList.add("click"),
);
document.addEventListener("mouseup", () =>
    cring.classList.remove("click"),
);
function animRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    cring.style.left = rx + "px";
    cring.style.top = ry + "px";
    requestAnimationFrame(animRing);
}
animRing();
function addHover(el) {
    el.addEventListener("mouseenter", () => cring.classList.add("h"));
    el.addEventListener("mouseleave", () => cring.classList.remove("h"));
}
let lsy = 0;
window.addEventListener(
    "scroll",
    () => {
        const sy = window.scrollY;
        if (Math.abs(sy - lsy) > 4 && Math.random() > 0.55) spawnScrollP();
        lsy = sy;
    },
    { passive: true },
);
function spawnTrail(x, y) {
    const p = document.createElement("div");
    p.className = "spark";
    p.style.cssText = `left:${x}px;top:${y}px;--tx:${(Math.random() - 0.5) * 18}px;--ty:${(Math.random() - 0.5) * 18}px`;
    document.getElementById("particles").appendChild(p);
    setTimeout(() => p.remove(), 700);
}
function spawnScrollP() {
    const p = document.createElement("div");
    p.className = "spark";
    p.style.cssText = `left:${Math.random() * window.innerWidth}px;top:${Math.random() * window.innerHeight}px;--tx:${(Math.random() - 0.5) * 28}px;--ty:${(Math.random() - 0.3) * -22}px;background:rgba(184,184,200,.45)`;
    document.getElementById("particles").appendChild(p);
    setTimeout(() => p.remove(), 700);
}

// ── SOCIALS ──
function renderSocials() {
    document.getElementById("soclinks").innerHTML = socials
        .map(
            (s) =>
                `<div class="soclink" style="--sc:${s.color}" onclick="window.open('${s.url}','_blank')"><svg class="soci" viewBox="0 0 24 24" fill="currentColor">${s.icon}</svg><div><div class="socn">${s.name}</div><div class="socc">${s.handle}</div></div></div>`,
        )
        .join("");
    document.getElementById("fsoc").innerHTML = socials
        .slice(0, 5)
        .map(
            (s) =>
                `<button class="fsoci" onclick="window.open('${s.url}','_blank')"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">${s.icon}</svg></button>`,
        )
        .join("");
}

// ── YT SIDE ──
function renderYT() {
    document.getElementById("yside").innerHTML = ytVideos
        .map(
            (v) =>
                `<div class="ysitem" onclick="window.open('https://youtube.com','_blank')"><div class="ysthumb" style="background:${v.bg}"><div><svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,.7)"><path d="M8 5v14l11-7z"/></svg></div></div><div><div class="ysttl">${v.title}</div><div class="ysmeta">${v.views} • ${v.ago}</div></div></div>`,
        )
        .join("");
}

// ── CHATBOT ──
let chatOpen = false;
const chatResponses = {
    shop: "🛒 You can browse our latest drops in the **Shop** section! We have Pro Kit, New Collection, Collabs, and Accessories. Click any product to see full details, sizes, and colors.",
    jersey:
        "🎽 The Wolf Jersey Pro is our most popular piece — TND 89, championship-grade fabric, DWT embroidered crest. Available in XS to 2XL.",
    hoodie:
        "🖤 The DWT Hoodie Black (TND 120) is a beast — 400g fleece, wolf graphic on back, hidden kangaroo pocket. Very limited stock!",
    museum:
        "🏛️ The Museum is our archive — past drops that sold out and will never be reprinted. Click **Shop** in the nav, then **Museum** to explore.",
    team: "🐺 Dark Wolf Team competes in Valorant, FC 25, Call of Duty, PUBG Mobile, Fortnite, Rocket League, and EA Sports FC. Click **DWT Teams → Our Teams** to see the full roster!",
    members:
        "👥 We have 18+ active players across 7 game titles. You can filter by game in the **Our Teams** modal. Open it from the nav under DWT Teams.",
    matches:
        "⚔️ Check the **News & Matches** section for live and upcoming matches. DWT Valorant is LIVE right now!",
    contact:
        "📧 You can reach us at contact@darkwolfteam.gg or use the **Contact** section at the bottom of the page.",
    social:
        "📱 Follow us on Twitch darkw0lfteam, Instagram @darkwolfteam, Discord, Twitter @DarkWolfTeam, and YouTube. Scroll to **Follow the Pack** section!",
    countdown:
        "⏳ The countdown is for our DWT Summer Championship 2026 on August 15! Big things incoming 🐺",
    join: "💪 To join DWT, scroll to the **Join Us** section and enter your email. For player tryouts, contact esports@darkwolfteam.gg",
    order:
        "📦 Add products to your order using the cart button. You can adjust quantities in the order panel. Confirm with the **Confirm Order** button!",
    default:
        "🐺 Hmm, I'm not sure about that one. Try asking about our **shop**, **team**, **matches**, **museum**, or **contact** info!",
};
const suggestions = [
    "What games does DWT play?",
    "Show me the shop",
    "Who are the team members?",
    "When is the next match?",
    "How to join DWT?",
    "What is the museum?",
    "How to contact DWT?",
    "What's in the countdown?",
];

function toggleChat() {
    chatOpen = !chatOpen;
    document
        .getElementById("chatWindow")
        .classList.toggle("open", chatOpen);
    if (
        chatOpen &&
        document.getElementById("chatBody").children.length === 0
    ) {
        addBotMsg(
            "🐺 Yo! I'm Wolf Bot — your DWT guide. Ask me anything about the team, shop, matches, or drops!",
        );
        renderSuggestions();
    }
}
function renderSuggestions() {
    document.getElementById("chatSugBtns").innerHTML = suggestions
        .map(
            (s) =>
                `<button class="chatSug" onclick="handleSug('${s}')">${s}</button>`,
        )
        .join("");
}
function handleSug(text) {
    addUserMsg(text);
    processChatMsg(text);
}
function addBotMsg(text) {
    const body = document.getElementById("chatBody");
    // typing indicator
    const typing = document.createElement("div");
    typing.className = "chatMsg bot typing";
    typing.innerHTML =
        '<div class="chatDot"></div><div class="chatDot"></div><div class="chatDot"></div>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
    setTimeout(() => {
        typing.remove();
        const msg = document.createElement("div");
        msg.className = "chatMsg bot";
        msg.textContent = text.replace(/\*\*(.*?)\*\*/g, "$1");
        body.appendChild(msg);
        body.scrollTop = body.scrollHeight;
    }, 900);
}
function addUserMsg(text) {
    const body = document.getElementById("chatBody");
    const msg = document.createElement("div");
    msg.className = "chatMsg user";
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
}
function processChatMsg(text) {
    const t = text.toLowerCase();
    let resp = chatResponses.default;
    if (t.includes("shop") || t.includes("buy") || t.includes("product"))
        resp = chatResponses.shop;
    else if (t.includes("jersey")) resp = chatResponses.jersey;
    else if (t.includes("hoodie")) resp = chatResponses.hoodie;
    else if (
        t.includes("museum") ||
        t.includes("archive") ||
        t.includes("old")
    )
        resp = chatResponses.museum;
    else if (
        t.includes("game") ||
        t.includes("play") ||
        t.includes("valorant") ||
        t.includes("cod") ||
        t.includes("fifa") ||
        t.includes("fc")
    )
        resp = chatResponses.team;
    else if (
        t.includes("member") ||
        t.includes("player") ||
        t.includes("roster") ||
        t.includes("team")
    )
        resp = chatResponses.members;
    else if (
        t.includes("match") ||
        t.includes("live") ||
        t.includes("tournament")
    )
        resp = chatResponses.matches;
    else if (
        t.includes("contact") ||
        t.includes("email") ||
        t.includes("message")
    )
        resp = chatResponses.contact;
    else if (
        t.includes("social") ||
        t.includes("instagram") ||
        t.includes("twitch") ||
        t.includes("discord") ||
        t.includes("follow")
    )
        resp = chatResponses.social;
    else if (
        t.includes("count") ||
        t.includes("timer") ||
        t.includes("event") ||
        t.includes("championship")
    )
        resp = chatResponses.countdown;
    else if (
        t.includes("join") ||
        t.includes("tryout") ||
        t.includes("apply")
    )
        resp = chatResponses.join;
    else if (
        t.includes("order") ||
        t.includes("cart") ||
        t.includes("confirm")
    )
        resp = chatResponses.order;
    addBotMsg(resp);
}
function sendChat() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();
    if (!text) return;
    addUserMsg(text);
    processChatMsg(text);
    input.value = "";
}

// ── SCROLL UTIL ──
function scrollTo(sel) {
    document.querySelector(sel)?.scrollIntoView({ behavior: "smooth" });
}

// ── KEYBOARD ──
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeModal();
        closeMem();
        closePD();
        closeMuseum();
    }
});

// ── INIT ──
renderProducts();
renderGames();
renderMatches();
renderYT();
renderSocials();
renderPanel();
setTimeout(initReveal, 80);
setTimeout(() => {
    document
        .querySelectorAll(
            "button,a,.pcard,.gcard,.ncard,.ysitem,.soclink,.mcard,.memcard,.pdthumb,.chatSug,.soclink",
        )
        .forEach(addHover);
}, 500);




function skipIntro() {
    const intro = document.getElementById("INTRO");

    intro.classList.add("hide");

    document.body.style.overflow = "auto";

    setTimeout(() => {
        intro.remove();
    }, 800);
}

/* yetsaker wa7dou ba3d 4.5 sec */
window.addEventListener("load", () => {
    document.body.style.overflow = "hidden";

    setTimeout(() => {
        skipIntro();
    }, 4500);
});