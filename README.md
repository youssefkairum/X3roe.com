# X3roe.com - Personal Portfolio & Digital Store

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

This repository contains the source code for **X3roe.com**, the personal portfolio website of **Youssef Keram** (iOS Engineer & Music Producer). 

The site is a high-performance, static web application designed to showcase iOS projects, music discography, and a digital asset store. It features a modern, dark-themed UI with advanced CSS animations and 3D transforms.

## ✨ Features

### 🎨 Design & UI
* **Glassmorphism & Neomorphism:** Extensive use of backdrop filters and semi-transparent borders to create a modern, depth-filled aesthetic.
* **Spotlight Hover Effects:** Custom JavaScript and CSS implementation that tracks mouse movement to create a glowing "spotlight" effect on cards.
* **3D CSS Transforms:** A pure CSS 3D iPhone mockup that reacts to hover states (`rotateY`, `rotateX`).
* **Bento Grid Layout:** A responsive grid layout used to showcase projects and discography.
* **Scroll-Spy Navigation:** A floating navbar with a "sliding capsule" that automatically moves to the active section based on scroll position.

### 🛠 Technical Implementation
* **Tailwind CSS (CDN):** Styled entirely using Tailwind utility classes via CDN for rapid development without a build step.
* **Supabase Integration:** Connects to a Supabase backend to dynamically fetch and display digital products in the "Store" section.
* **Formspree Integration:** Contact forms are wired to Formspree for serverless email handling.
* **Sparkle Appcast:** Includes an `appcast.xml` file to support software updates for macOS applications (e.g., Joke Generator).

### 📱 Pages
1.  **Home (`index.html`):** The main landing page featuring the portfolio, skills, and store. Dark/Platinum theme.
2.  **iPasscoder (`ipasscoder.html`):** A dedicated product landing page for the iOS security app. White/Gold theme.
3.  **Music (`music.html`):** A discography showcase for the artist alias "X3rœ". Dark/Orange theme.
4.  **Error Pages:** Custom designs for 401, 403, 404, 500, etc.

## 📂 Project Structure

```text
/
├── index.html            # Main Portfolio Landing Page
├── ipasscoder.html       # iPasscoder App Landing Page
├── music.html            # Music & Discography Page
├── appcast.xml           # Sparkle Framework Appcast for software updates
├── CNAME                 # Domain configuration
├── 404.html              # Custom Error Page
├── assets/
│   ├── cover_*.jpg       # Album art covers
│   ├── ipasscoder_icon.png
│   └── ...
└── JokeGenerator_v2.0.zip # Downloadable software assets
