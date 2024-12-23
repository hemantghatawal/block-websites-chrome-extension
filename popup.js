let ruleIdCounter = 1000; // Start rule IDs from 1000

const blockedSitesList = document.getElementById("blockedSites");
const newSiteInput = document.getElementById("newSite");
const addSiteButton = document.getElementById("addSite");

// Loading current blocked site rules
chrome.declarativeNetRequest.getDynamicRules((rules) => {
  rules.forEach((rule) => {
    if (rule.condition.urlFilter) {
      addSiteToList(rule.condition.urlFilter);
      // Ensure counter is higher than existing rules
      ruleIdCounter = Math.max(ruleIdCounter, rule.id + 1);
    }
  });
});

// Add a new site to blocklist
addSiteButton.addEventListener("click", () => {
  const site = newSiteInput.value.trim();
  if (site) {
    const newRule = {
      id: ruleIdCounter++,
      priority: 1,
      action: {
        type: "redirect",
        redirect: {
          url: chrome.runtime.getURL("blocker.html"),
        },
      },
      condition: {
        urlFilter: site,
        resourceTypes: ["main_frame"],
      },
    };

    chrome.declarativeNetRequest.updateDynamicRules(
      {
        addRules: [newRule],
        removeRuleIds: [],
      },
      () => {
        addSiteToList(site);
        newSiteInput.value = "";
      }
    );
  }
});

// Adding block sites to the list
function addSiteToList(site) {
  const li = document.createElement("li");
  li.textContent = site;
  blockedSitesList.appendChild(li);
}
