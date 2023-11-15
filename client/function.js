const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn i');
const dropDownMenu = document.querySelector('.dropdown-menu');

toggleBtn.onclick = function() {
    dropDownMenu.classList.toggle('open');
    const isOpen = dropDownMenu.classList.contains('open');
    toggleBtnIcon.classList.toggle("fa-xmark", isOpen);
    toggleBtnIcon.classList.toggle("fa-bars", !isOpen);
};

const navbarLinks = document.querySelector('.navbar .links');
const navbarActionBtn = document.querySelector('.navbar .action-btn');
toggleBtn.addEventListener('click', function() {
    dropdownMenu.classList.toggle('open');
});

function updateNavbar() {
    if (window.innerWidth <= 992) {
        navbarLinks.style.display = 'none';
        navbarActionBtn.style.display = 'none';
        toggleBtn.style.display = 'block';
        dropdownMenu.style.display = 'block';
    } else {
        navbarLinks.style.display = 'flex';
        navbarActionBtn.style.display = 'block';
        toggleBtn.style.display = 'none';
        dropdownMenu.style.display = 'none';
    }
}

window.addEventListener('resize', updateNavbar);
updateNavbar();