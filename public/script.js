// Wacht tot de gehele HTML pagina is geladen voordat het script wordt uitgevoerd
document.addEventListener("DOMContentLoaded", function() {
    
    // Selecteer alle knoppen met de class 'plus-button'
    const buttons = document.querySelectorAll('.plus-button');
    // Selecteer het element waar de hoofdstukinhoud in weergegeven zal worden
    const chapterDisplay = document.getElementById('chapter-display');

    // Voeg een click-eventlistener toe aan elke 'plus-button'
    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Voorkom de standaard actie van de knop (bijv. navigatie)
            const id = this.getAttribute('data-id'); // Haal het data-id attribuut op van de geklikte knop
            fetchChapterData(id); // Roep de functie aan om de data op te halen voor het hoofdstuk met deze id
        });
    });

    // Functie om hoofdstukdata op te halen van de server
    function fetchChapterData(id) {
        fetch(`/chapter/${id}`) // Maak een HTTP GET verzoek naar de server met de hoofdstuk id
            .then(response => response.text()) // Zet de respons om naar tekst
            .then(html => {
                chapterDisplay.innerHTML = html; // Voeg de opgehaalde HTML toe aan het display element
                chapterDisplay.style.display = 'block'; // Maak het display element zichtbaar
                
                // Controleer of het scherm smaller is dan 1000 pixels
                if (window.matchMedia("(max-width: 1000px)").matches) {
                    // Scroll soepel naar het hoofdstukdisplay element
                    window.scroll({
                        top: chapterDisplay.offsetTop,
                        behavior: 'smooth'
                    });
                }

                // Selecteer de knop om het hoofdstukdisplay te sluiten
                const closeButton = chapterDisplay.querySelector('.close-button');
                closeButton.addEventListener('click', function(event) {
                    event.preventDefault(); // Voorkom de standaard actie van de knop
                    chapterDisplay.style.display = 'none'; // Verberg het hoofdstukdisplay
                });
            })
            .catch(error => {
                console.error('Error fetching chapter data:', error); // Log de fout als er iets misgaat bij het ophalen van data
            });
    }
});

