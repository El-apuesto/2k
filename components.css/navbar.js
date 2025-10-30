class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .logo {
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
          background: linear-gradient(135deg, #8A2BE2 0%, #FF00FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        ul {
          display: flex;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }
        a {
          color: white;
          text-decoration: none;
          transition: all 0.2s;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        a:hover {
          color: #8A2BE2;
        }
        .cta {
          background: linear-gradient(135deg, #8A2BE2 0%, #FF00FF 100%);
          padding: 0.5rem 1.25rem;
          border-radius: 9999px;
          color: white;
        }
        .cta:hover {
          opacity: 0.9;
          color: white;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          nav {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          ul {
            width: 100%;
            justify-content: space-around;
          }
        }
      </style>
      <nav>
        <a href="/" class="logo">StoryFrame</a>
        <ul>
          <li><a href="/"><i data-feather="home"></i> Home</a></li>
          <li><a href="/create.html"><i data-feather="plus-circle"></i> Create</a></li>
          <li><a href="/gallery.html"><i data-feather="image"></i> Gallery</a></li>
          <li><a href="/about.html"><i data-feather="info"></i> About</a></li>
          <li><a href="/account.html" class="cta"><i data-feather="user"></i> Get Started</a></li>
        </ul>
      </nav>
    `;
  }
}
customElements.define('custom-navbar', CustomNavbar);