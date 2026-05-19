export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@900&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: #0A0B0D;
    color: var(--mv-text);
    font-family: 'Barlow', sans-serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 1.6;
  }

  a { color: inherit; text-decoration: none; }

  input, textarea, select, button {
    font-family: 'Barlow', sans-serif;
    outline: none;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--mv-card); }
  ::-webkit-scrollbar-thumb { background: var(--mv-border-2); border-radius: 3px; }
`;