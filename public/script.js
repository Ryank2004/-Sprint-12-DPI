document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll('.plus-button');
    const chapterDisplay = document.getElementById('chapter-display');

    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const id = this.getAttribute('data-id');
            fetchChapterData(id);
        });
    });

    function fetchChapterData(id) {
        fetch(`/chapter/${id}`)
            .then(response => response.text())
            .then(html => {
                chapterDisplay.innerHTML = html;
                chapterDisplay.style.display = 'block';

                // Scroll to the chapter display element
                window.scroll({
                    top: chapterDisplay.offsetTop,
                    behavior: 'smooth'
                });

                const closeButton = chapterDisplay.querySelector('.close-button');
                closeButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    chapterDisplay.style.display = 'none';
                });
            })
            .catch(error => {
                console.error('Error fetching chapter data:', error);
            });
    }
});
