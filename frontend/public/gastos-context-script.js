document.addEventListener('DOMContentLoaded', () => {
    const gastosContext = document.querySelector('.gastos-context-provider');
    const carimbo = document.querySelector('.gastos-context-provider::after');

    gastosContext.addEventListener('mouseover', () => {
        carimbo.classList.add('unido');
        setTimeout(() => {
            carimbo.textContent = 'ConectaCash';
            carimbo.style.opacity = '1';
        }, 1000); // 1000 milissegundos = 1 segundo
    });

    gastosContext.addEventListener('mouseout', () => {
        carimbo.classList.remove('unido');
        setTimeout(() => {
            carimbo.textContent = 'Conecta Cash';
            carimbo.style.opacity = '1';
        }, 1000); // 1000 milissegundos = 1 segundo
    });
});