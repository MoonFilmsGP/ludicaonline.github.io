window.addEventListener('DOMContentLoaded', () => {
    fetch('index.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('articles-grid');
            const buttons = document.querySelectorAll('#sections button');
            const searchInput = document.getElementById('search');
            let currentFilter = null;

            function renderArticles(articles) {
                container.innerHTML = '';
                articles.forEach(article => {
                    const card = document.createElement('div');
                    card.className = 'article-card';
                    card.innerHTML = `
            <img src="assets/thumbnails/${article.path.split('/').pop()}.jpg" alt="${article.title}">
            <h2>${article.title}</h2>
            <p>${article.lead}</p>
            <a href="articles/${article.path}.html">Leer más</a>
          `;
                    container.appendChild(card);
                });
            }

            function applyFilters() {
                const query = searchInput.value.toLowerCase();
                let filtered = data;

                if (currentFilter) {
                    filtered = filtered.filter(article => article.category === currentFilter);
                }

                if (query) {
                    filtered = filtered.filter(article =>
                        article.title.toLowerCase().includes(query) ||
                        article.lead.toLowerCase().includes(query) ||
                        article.category.toLowerCase().includes(query)
                    );
                }

                renderArticles(filtered);
            }

            // Mostrar todo al inicio
            renderArticles(data);

            // Filtro por sección
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    currentFilter = button.dataset.section;
                    applyFilters();
                });
            });

            // Búsqueda
            searchInput.addEventListener('input', applyFilters);
        })
        .catch(err => console.error('Error cargando artículos:', err));
});
