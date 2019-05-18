const sidebar = document.getElementById("sidebar");

const englishSidebar = `
  <div class="dark">
    <h3>Specific blockchain use-cases</h3>

    <h3 class="orange" name="appContentEng.html"><a href="./appContentEng.html" style="color:#e8491d">Blockchain content accessing</a></h3>
    <h3 class="orange" name="appCrowdfundingEng.html"><a href="./appCrowdfundingEng.html" style="color:#e8491d">Blockchain crowdfunding</a></h3>
    <h3 class="orange" name="appAuctionEng.html"><a href="./appAuctionEng.html" style="color:#e8491d">Blockchain auction</a></h3>
    <h3 class="orange" name="appRouletteEng.html"><a href="./appRouletteEng.html" style="color:#e8491d">Blockchain roulette</a></h3>
    <h3 class="orange" name="appPocketEng.html"><a href="./appPocketEng.html" style="color:#e8491d">Blockchain pocket-money</a></h3>
    <h3 class="orange" name="appTipEng.html"><a href="./appTipEng.html" style="color:#e8491d">Blockchain tipping</a></h3>
    <h3 class="orange" name="appReceivingCCEng.html"><a href="./appReceivingCCEng.html" style="color:#e8491d">Blockchain payment accepting</a></h3>
    <h3 class="orange" name="appSwapEng.html"><a href="./appSwapEng.html" style="color:#e8491d">Blockchain exchange</a></h3>
    <h3 class="orange" name="appDigitalSignaturesEng.html"><a href="./appDigitalSignaturesEng.html" style="color:#e8491d">Blockchain autentication and authorization</a></h3>
    <h3 class="orange" name="appMultisignatureEng.html"><a href="./appMultisignatureEng.html" style="color:#e8491d">Blockchain contracts</a></h3>
    <h3 class="orange" name="appElectionsEng.html"><a href="./appElectionsEng.html" style="color:#e8491d">Blockchain elections</a></h3>
  </div>
`;

const czechSidebar = `
  <div class="dark">
    <h3>Příklady konkrétních aplikací</h3>

    <h3 class="orange" name="appContent.html"><a href="./appContent.html" style="color:#e8491d">Blockchainové zpřístupňování obsahu</a></h3>
    <h3 class="orange" name="appCrowdfunding.html"><a href="./appCrowdfunding.html" style="color:#e8491d">Blockchainové financování projektů</a></h3>
    <h3 class="orange" name="appAuction.html"><a href="./appAuction.html" style="color:#e8491d">Blockchainová aukce</a></h3>
    <h3 class="orange" name="appRoulette.html"><a href="./appRoulette.html" style="color:#e8491d">Blockchainová ruleta</a></h3>
    <h3 class="orange" name="appPocket.html"><a href="./appPocket.html" style="color:#e8491d">Blockchainové kapesné</a></h3>
    <h3 class="orange" name="appTip.html"><a href="./appTip.html" style="color:#e8491d">Blockchainové spropitné</a></h3>
    <h3 class="orange" name="appReceivingCC.html"><a href="./appReceivingCC.html" style="color:#e8491d">Blockchainové přijímání plateb</a></h3>
    <h3 class="orange" name="appSwap.html"><a href="./appSwap.html" style="color:#e8491d">Blockchainová směnárna</a></h3>
    <h3 class="orange" name="appDigitalSignatures.html"><a href="./appDigitalSignatures.html" style="color:#e8491d">Blockchainová autentikace a autorizace</a></h3>
    <h3 class="orange" name="appMultisignature.html"><a href="./appMultisignature.html" style="color:#e8491d">Blockchainové smlouvy</a></h3>
    <h3 class="orange" name="appElections.html"><a href="./appElections.html" style="color:#e8491d">Blockchainové volby</a></h3>
  </div>
`;

if (document.documentElement.lang === "cz") {
  sidebar.innerHTML = czechSidebar;
} else {
  sidebar.innerHTML = englishSidebar;
}

// Making sure that the chosen app-page will get highlighted by a white color in the sidebar
// BE AWARE: if there is more scripts using the URL of Filename, it will throw
//   an error! Rather declare variables in these rendering scripts specifically to each script
const sidebar_url = window.location.pathname;
const sidebar_filename = sidebar_url.substring(sidebar_url.lastIndexOf('/')+1);

const sidebar_el = document.getElementsByName(sidebar_filename)[0];
sidebar_el.children[0].setAttribute("style", "color:#ffffff");
