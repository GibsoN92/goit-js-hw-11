const apiKey = '43727576-846afc7acd33227ff00bb0186';
const baseURL = 'https://pixabay.com/api/';

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');
const loader = document.getElementById('loader');
const error = document.getElementById('error');

let page = 1;

form.addEventListener('submit', async e => {
  e.preventDefault();
  const searchQuery = form.searchQuery.value.trim();
  if (searchQuery === '') return;

  page = 1;
  gallery.innerHTML = '';
  searchImages(searchQuery);
});

loadMoreBtn.addEventListener('click', () => {
  const searchQuery = form.searchQuery.value.trim();
  if (searchQuery === '') return;

  page++;
  searchImages(searchQuery);
});

async function searchImages(query) {
  try {
    loader.style.display = 'block';
    const response = await axios.get(baseURL, {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40, // 40 images per page
        page: page,
      },
    });
    const { data } = response;
    if (data.totalHits === 0) {
      error.style.display = 'block';
      error.textContent = `Sorry, there are no images matching your search query. Please try again.`;
      return;
    }
    renderImages(data.hits);
    loader.style.display = 'none';
    loadMoreBtn.style.display = 'block';
    error.style.display = 'none';
  } catch (err) {
    console.error(err);
    error.style.display = 'block';
    error.textContent = `Sorry, there was an error. Please try again later.`;
    loader.style.display = 'none';
    loadMoreBtn.style.display = 'none';
  }
}

function renderImages(images) {
  images.forEach(image => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');
    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';
    const info = document.createElement('div');
    info.classList.add('info');
    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;
    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;
    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;
    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;
    info.append(likes, views, comments, downloads);
    photoCard.append(img, info);
    gallery.appendChild(photoCard);
  });
}
