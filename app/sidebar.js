let sidebar = document.getElementById("sidebar");

const englishSidebar = `
  <div class="dark">
    <h3 class="cz">Specific blockchain use-cases</h3>

    <h3 class="cz orange"><a href="./appContentEng.html" style="color:#ffffff">Blockchain content accessing</a></h3>
    <h3 class="cz orange"><a href="./appCrowdfundingEng.html" style="color:#e8491d">Blockchain crowdfunding</a></h3>
    <h3 class="cz orange"><a href="./appAuctionEng.html" style="color:#e8491d">Blockchain auction</a></h3>
    <h3 class="cz orange"><a href="./appRouletteEng.html" style="color:#e8491d">Blockchain roulette</a></h3>
    <h3 class="cz orange"><a href="./appPocketEng.html" style="color:#e8491d">Blockchain pocket-money</a></h3>
    <h3 class="cz orange"><a href="./appTipEng.html" style="color:#e8491d">Blockchain tipping</a></h3>
    <h3 class="cz orange"><a href="./appReceivingCCEng.html" style="color:#e8491d">Blockchain payment accepting</a></h3>
    <h3 class="cz orange"><a href="./appSwapEng.html" style="color:#e8491d">Blockchain exchange</a></h3>
    <h3 class="cz orange"><a href="./appDigitalSignaturesEng.html" style="color:#e8491d">Blockchain autentication and authorization</a></h3>
    <h3 class="cz orange"><a href="./appMultisignatureEng.html" style="color:#e8491d">Blockchain contracts</a></h3>
    <h3 class="cz orange"><a href="./appElectionsEng.html" style="color:#e8491d">Blockchain elections</a></h3>
  </div>
`;

const czechSidebar = `
  <div class="dark">
    <h3 class="cz">Příklady konkrétních aplikací</h3>

    <h3 class="cz orange"><a href="./appContent.html" style="color:#e8491d">Blockchainové zpřístupňování obsahu</a></h3>
    <h3 class="cz orange"><a href="./appCrowdfunding.html" style="color:#e8491d">Blockchainové financování projektů</a></h3>
    <h3 class="cz orange"><a href="./appAuction.html" style="color:#ffffff">Blockchainová aukce</a></h3>
    <h3 class="cz orange"><a href="./appRoulette.html" style="color:#e8491d">Blockchainová ruleta</a></h3>
    <h3 class="cz orange"><a href="./appPocket.html" style="color:#e8491d">Blockchainové kapesné</a></h3>
    <h3 class="cz orange"><a href="./appTip.html" style="color:#e8491d">Blockchainové spropitné</a></h3>
    <h3 class="cz orange"><a href="./appReceivingCC.html" style="color:#e8491d">Blockchainové přijímání plateb</a></h3>
    <h3 class="cz orange"><a href="./appSwap.html" style="color:#e8491d">Blockchainová směnárna</a></h3>
    <h3 class="cz orange"><a href="./appDigitalSignatures.html" style="color:#e8491d">Blockchainová autentikace a autorizace</a></h3>
    <h3 class="cz orange"><a href="./appMultisignature.html" style="color:#e8491d">Blockchainové smlouvy</a></h3>
    <h3 class="cz orange"><a href="./appElections.html" style="color:#e8491d">Blockchainové volby</a></h3>
  </div>
`;

if (document.documentElement.lang === "cz") {
  sidebar.innerHTML = czechSidebar;
} else {
  sidebar.innerHTML = englishSidebar;
}
