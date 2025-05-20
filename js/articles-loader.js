fetch('index.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('articles-grid');
        if (!container) return;

        data.forEach(article => {
            const card = document.createElement('div');
            card.className = 'article-card';
            card.innerHTML = `
        <img src="${article.thumbnail}" alt="${article.title}" />
        <h2>${article.title}</h2>
        <p>${article.lead}</p>
        <a href="articles/${article.path}">Leer más</a>
      `;
            container.appendChild(card);
        });
    })
    .catch(err => console.error('Error cargando artículos:', err));