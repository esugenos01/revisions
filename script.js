// ------- STORAGE -------
let cards = JSON.parse(localStorage.getItem("cards")) || [];

// ------- INTERVALS FOR SPACED REPETITION -------
const intervals = [1, 3, 7, 14, 30]; // jours

// ------- SAVE -------
function saveCards() {
    localStorage.setItem("cards", JSON.stringify(cards));
}

// ------- ADD A CARD -------
document.getElementById("addCardBtn").addEventListener("click", () => {
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    if (!title || !content) return alert("Complète le titre et le contenu.");

    const newCard = {
        id: Date.now(),
        title,
        content,
        level: 0,
        nextReview: Date.now()
    };

    cards.push(newCard);
    saveCards();
    displayCards();

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
});

// ------- DISPLAY CARDS DUE TODAY -------
function displayCards() {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    const today = Date.now();

    const dueCards = cards.filter(card => card.nextReview <= today);

    if (dueCards.length === 0) {
        container.innerHTML = "<p>Aucune carte à réviser aujourd’hui 🎉</p>";
        return;
    }

    dueCards.forEach(card => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${card.title}</h3>
            <p>${card.content}</p>
            <button onclick="markGood(${card.id})">Je sais ✔️</button>
            <button onclick="markAgain(${card.id})">Réviser encore 🔄</button>
        `;

        container.appendChild(div);
    });
}

// ------- MARK GOOD (INCREASE LEVEL) -------
function markGood(id) {
    const card = cards.find(c => c.id === id);

    if (card.level < intervals.length - 1) {
        card.level++;
    }

    const days = intervals[card.level];
    card.nextReview = Date.now() + days * 24 * 60 * 60 * 1000;

    saveCards();
    displayCards();
}

// ------- MARK AGAIN (RESET LEVEL) -------
function markAgain(id) {
    const card = cards.find(c => c.id === id);

    card.level = 0;
    card.nextReview = Date.now() + 24 * 60 * 60 * 1000; // révision demain

    saveCards();
    displayCards();
}

displayCards();
