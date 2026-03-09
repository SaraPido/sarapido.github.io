# Sara Pidò — Personal Academic Website

A clean, editorial personal website with 5 pages, built for GitHub Pages.

## Pages
- **index.html** — Home: hero section, career snapshot, research focus
- **publications.html** — Filterable publications list
- **activities.html** — Projects, academic service, mentoring
- **cv.html** — Full CV with skill bars + downloadable PDF
- **about.html** — Personal page: hobbies, fun facts, contact
- **Footer** — Interactive pixel mountain runner game (SPACE/click to jump!)

## Setup for GitHub Pages

1. Copy all files to the root of your `sarapido.github.io` repository
2. Add your photo at `assets/img/sara.jpg` (the site shows initials as fallback until then)
3. Add your CV PDF at `assets/cv/sara_pido_cv.pdf`
4. Push to GitHub — the site deploys automatically!

## File Structure
```
/
├── index.html
├── publications.html
├── activities.html
├── cv.html
├── about.html
├── assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── layout.js     (shared nav + footer)
│   │   └── main.js       (runner game + skill bars)
│   ├── img/
│   │   └── sara.jpg      ← ADD YOUR PHOTO HERE
│   └── cv/
│       └── sara_pido_cv.pdf  ← ADD YOUR CV PDF HERE
└── README.md
```

## Customization tips
- Update nav/footer in `assets/js/layout.js`
- Colors defined as CSS variables in `assets/css/style.css` (look for `:root`)
- Add more publications in `publications.html` following the `.pub-card` pattern
- The runner game is fully playable — SPACE or click to jump over rocks and flags!
