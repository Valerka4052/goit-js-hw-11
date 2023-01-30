import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {fetchItems} from './app.js'
  
AOS.init();

const lightbox = new SimpleLightbox('.gallery a')
const form = document.querySelector('#search-form');
const searchValue = form.elements.searchQuery;
const submitButton = document.querySelector('[type="submit"]');
const container = document.querySelector('.gallery');
let pageNumber = 1;
let totalImages = null;
    
submitButton.addEventListener('click', searchItems);
window.addEventListener('scroll', showMoreItems);

function searchItems(event) {
  event.preventDefault();
  reset();
  pageNumber = 1;
  fetchItems(searchValue.value, pageNumber).then(data => {
    totalImages=data.total;
    if (data.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    };
    return data.hits;
  })
    .then(items => {
       if (items.length===0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
      };
    items.forEach(item => {
      makeThumbs(item);
      lightbox.refresh();
    });
  }).catch(console.log);
};

function showMoreItems() {
  const rect = document
    .querySelector(".gallery").getBoundingClientRect();
    if (rect.bottom < document.documentElement.clientHeight + 200) {
    pageNumber += 1;
      fetchItems(searchValue.value, pageNumber).then(data => data.hits)
        .then(items => {
          items.forEach(item => {
            makeThumbs(item);
            lightbox.refresh();
            const loadedImages = container.childElementCount;
            if (totalImages === loadedImages) {
              Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            };
          });
        }).catch(console.log);
  };
};

function makeThumbs(item) {
  const picture = `<a  href='${item.largeImageURL}'><div data-aos="zoom-in"  class="photo-card"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${item.downloads}
    </p>
  </div>
</div></a>`;
  container.insertAdjacentHTML('beforeend', picture);
};

function reset() {
  container.innerHTML = '';
};