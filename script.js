document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      navItems.forEach((nav) => nav.classList.remove('active'));
      item.classList.add('active');
    });
  });

  const searchInput = document.querySelector('.search-box input');
  searchInput.addEventListener('focus', () => {
    if (searchInput.value === 'Buscar pet, cirurgia...') {
      searchInput.value = '';
    }
  });

  searchInput.addEventListener('blur', () => {
    if (!searchInput.value.trim()) {
      searchInput.value = 'Buscar pet, cirurgia...';
    }
  });
});
