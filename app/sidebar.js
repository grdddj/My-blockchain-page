const sidebar = document.getElementById("sidebar");

const englishSidebar = `
  <div class="dark">
    <h3>Specific blockchain use-cases</h3>

    <h3 class="orange" name="appContent.html"><a href="./appContentEng.html" style="color:#e8491d">Blockchain content accessing</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appCrowdfundingEng.html" style="color:#e8491d">Blockchain crowdfunding</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appAuctionEng.html" style="color:#e8491d">Blockchain auction</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appRouletteEng.html" style="color:#e8491d">Blockchain roulette</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appPocketEng.html" style="color:#e8491d">Blockchain pocket-money</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appTipEng.html" style="color:#e8491d">Blockchain tipping</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appReceivingCCEng.html" style="color:#e8491d">Blockchain payment accepting</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appSwapEng.html" style="color:#e8491d">Blockchain exchange</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appDigitalSignaturesEng.html" style="color:#e8491d">Blockchain autentication and authorization</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appMultisignatureEng.html" style="color:#e8491d">Blockchain contracts</a></h3>
    <h3 class="orange"><a href="./appElectionsEng.html" style="color:#e8491d">Blockchain elections</a></h3>
  </div>
`;

const czechSidebar = `
  <div class="dark">
    <h3>Příklady konkrétních aplikací</h3>

    <h3 class="orange" name="appContent.html"><a href="./appContent.html" style="color:#e8491d">Blockchainové zpřístupňování obsahu</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appCrowdfunding.html" style="color:#e8491d">Blockchainové financování projektů</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appAuction.html" style="color:#e8491d">Blockchainová aukce</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appRoulette.html" style="color:#e8491d">Blockchainová ruleta</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appPocket.html" style="color:#e8491d">Blockchainové kapesné</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appTip.html" style="color:#e8491d">Blockchainové spropitné</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appReceivingCC.html" style="color:#e8491d">Blockchainové přijímání plateb</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appSwap.html" style="color:#e8491d">Blockchainová směnárna</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appDigitalSignatures.html" style="color:#e8491d">Blockchainová autentikace a autorizace</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appMultisignature.html" style="color:#e8491d">Blockchainové smlouvy</a></h3>
    <h3 class="orange" name="appContent.html"><a href="./appElections.html" style="color:#e8491d">Blockchainové volby</a></h3>
  </div>
`;

if (document.documentElement.lang === "cz") {
  sidebar.innerHTML = czechSidebar;
} else {
  sidebar.innerHTML = englishSidebar;
}


const url = window.location.pathname;
const filename = url.substring(url.lastIndexOf('/')+1);
const filenameWithSlash = "./" + filename;

alert(filenameWithSlash);

var el = document.getElementsByName("appContent.html")[0];
alert(el)
el.setAttribute("style", "color:#ffffff");
