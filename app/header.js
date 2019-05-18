let header = document.getElementsByTagName("header")[0];

const englishHeader = `
  <div class="container">
    <div id="branding">
      <h1><span class="highlight">Musil Blockchain</span></h1>
    </div>
    <nav>
      <ul>
        <li class=""><a href="../indexEng.html">Home</a></li>
        <li><a href="../aboutEng.html">About</a></li>
        <li><a href="../sourcesEng.html">Sources</a></li>
        <li><a href="../servicesEng.html">Services</a></li>
        <li><a href="../articlesEng.html">Articles</a></li>
        <li class="current"><a href="../applicationsEng.html">Applications</a></li>
        <li class="language"><a href="appMultisignature.html"><img src="../img/cz.png" alt="Přejít do češtiny" width="58" height="42"></a> </li>
      </ul>
    </nav>
  </div>
`;

const czechHeader = `
  <div class="container">
    <div id="branding">
      <h1><span class="highlight">Musil Blockchain</span></h1>
    </div>
    <nav>
      <ul>
        <li><a href="../index.html">Domů</a></li>
        <li><a href="../about.html">O mně</a></li>
        <li class=""><a href="../sources.html">Zdroje</a></li>
        <li><a href="../services.html">Služby</a></li>
        <li><a href="../articles.html">Články</a></li>
        <li class="current"><a href="../applications.html">Aplikace</a></li>
        <li class="language"><a href="appReceivingCCEng.html"><img src="../img/gb.png" alt="Switch into english" width="58" height="42"></a> </li>
      </ul>
    </nav>
  </div>
`;


if (document.documentElement.lang === "cz") {
  header.innerHTML = czechHeader;
} else {
  header.innerHTML = englishHeader;
}
