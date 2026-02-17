const tabs = document.querySelectorAll('.tab-button');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    panels.forEach(p => p.classList.remove('active'));

    const panel = document.getElementById(tab.dataset.tab);
    panel.classList.add('active');
});
});

panels[0].classList.add('active');