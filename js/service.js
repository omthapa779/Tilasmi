const toggleBtn = document.getElementById('toggle-btn');
const cardsContainer = document.getElementById('service-cards-container');

const webpageCards = [
  {
    title: "Static<br> Website",
    description: "Informational Pages <br> Clean Designs.",
    price: "NPR 20,000",
    className: "side-card",
    service: "staticweb"
  },
  {
    title: "Dynamic<br> Website",
    description: "Editable Content, Team, Blogs & Gallery Webpages",
    price: "NPR 45,000 - NPR 50,000",
    className: "main-card",
    service: "dynamicweb"
  },
  {
    title: "Advanced <br> Website",
    description: "Portal, User Forms, Dashboard System",
    price: "NPR 30,000 - NPR 35,000",
    className: "side-card",
    service: "advwebsite"
  }
];

const socialMediaCards = [
  {
    title: "Standard",
    description: "Basic SMM Plan",
    price: "NPR 15,000 - NPR 20,000",
    className: "side-card",
    service: "smm-standard"
  },
  {
    title: "Premium",
    description: "Analytics & Paid Ads",
    price: "NPR 35,000 - NPR 45,000",
    className: "main-card",
    service: "smm-premium"
  },
  {
    title: "Elite",
    description: "Full Campaign Management",
    price: "NPR 50,000+",
    className: "side-card",
    service: "smm-elite"
  }
];

let showingWebpage = true;

function renderCards(cards) {
  cardsContainer.innerHTML = "";
  cards.forEach(card => {
    const a = document.createElement("a");
    a.className = `fade-button card ${card.className}`;
    a.href = `contact.html?service=${card.service}`;
    a.innerHTML = `
      <div class="card-title">${card.title}</div>
      <div class="card-description">${card.description}</div>
      <div class="card-price">${card.price}</div>
    `;
    
    // Add click animation
    a.addEventListener('click', function(e) {
      // Add a brief click effect
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
    
    cardsContainer.appendChild(a);
  });
}

function toggleCards() {
  cardsContainer.style.opacity = "0";
  cardsContainer.style.transform = "translateY(20px)";

  setTimeout(() => {
    if (showingWebpage) {
      renderCards(socialMediaCards);
      toggleBtn.textContent = "Switch to Webpage Services";
    } else {
      renderCards(webpageCards);
      toggleBtn.textContent = "Switch to Social Media Marketing";
    }
    showingWebpage = !showingWebpage;
    cardsContainer.style.opacity = "1";
    cardsContainer.style.transform = "translateY(0)";
  }, 500);
}

toggleBtn.addEventListener("click", toggleCards);

// Initial render
renderCards(webpageCards);
