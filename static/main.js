// The URLSearchParams interface defines utility methods to work with the query string of a URL.
const URL_PARAMS = new URLSearchParams(window.location.search);
// gets the token param of URL_PARAM
const TOKEN = URL_PARAMS.get('token');

// Show an element
const show = (selector) => {
  document.querySelector(selector).style.display = 'block';
};

// Hide an element
const hide = (selector) => {
  document.querySelector(selector).style.display = 'none';
};

if (TOKEN) {
  hide('.content.unauthorized');
  show('.content.authorized');
}
