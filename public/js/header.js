function verificarTamanhoTela() {
    // Obtém a largura da tela
    var larguraTela = window.innerWidth;

    // Se a largura da tela for menor ou igual a 500px
    if (larguraTela <= 760) {
        /* var offcanvas = document.querySelector('.offcanvas');
offcanvas.classList.add('show'); // Ativa o offcanvas */
        // Desative o aparecimento dos itens
        // Supondo que você tenha elementos com a classe "item" que deseja ocultar
        var nav = document.querySelectorAll('.nav-header');
        nav[0].style.display = 'none';

        var hamburguer = document.querySelectorAll('.hamburguer-header');
        hamburguer[0].style.display = 'block';
    } else {
        // Se a largura da tela for maior que 760px, fechar o offcanvas e restaurar o botão
        var offcanvas = document.querySelector('.offcanvas');
        offcanvas.classList.remove('show'); // Fecha o offcanvas

        var btnClose = document.querySelector('[data-bs-dismiss="offcanvas"]');
        btnClose.setAttribute('aria-expanded', 'false'); // Restaura a propriedade do botão
        // Se a largura da tela for maior que 500px, torne os itens visíveis novamente
        var nav = document.querySelectorAll('.nav-header');
        nav[0].style.display = 'block';

        var hamburguer = document.querySelectorAll('.hamburguer-header');
        hamburguer[0].style.display = 'none';
    }
}