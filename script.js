document.addEventListener('DOMContentLoaded', () => {
  const speciesButtons = [...document.querySelectorAll('.species-chip')];
  const caregiverCards = [...document.querySelectorAll('.caregiver-card')];
  const searchForm = document.querySelector('#search-form');
  const toast = document.querySelector('.toast');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  let selectedSpecies = 'Todas';
  let toastTimer;

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2800);
  };

  const filterCaregivers = () => {
    caregiverCards.forEach((card) => {
      const species = (card.dataset.species || '').split(' ');
      card.hidden = selectedSpecies !== 'Todas' && !species.includes(selectedSpecies);
    });
  };

  speciesButtons.forEach((button) => {
    button.addEventListener('click', () => {
      speciesButtons.forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      selectedSpecies = button.dataset.species;
      filterCaregivers();
    });
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const location = document.querySelector('#location').value.trim();
    const suffix = location ? ` em ${location}` : '';
    showToast(`Buscando cuidadores${suffix} para ${selectedSpecies.toLowerCase()}...`);
    document.querySelector('#profissionais').scrollIntoView({ behavior: 'smooth' });
  });

  document.querySelectorAll('.solid-button, .outline-button, .apply-button, .course-cta, .account-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      if (button.classList.contains('course-cta') || button.classList.contains('account-button')) return;
      event.preventDefault();
      const label = button.classList.contains('apply-button') ? 'Interesse registrado! Entre na sua conta para se candidatar.' : 'Entre na sua conta para continuar.';
      showToast(label);
    });
  });

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? '×' : '☰';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    });
  });
});
