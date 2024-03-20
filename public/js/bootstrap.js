// meu_script.js

// Script Popper.js
var scriptPopper = document.createElement('script');
scriptPopper.src = "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js";
scriptPopper.integrity = "sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r";
scriptPopper.crossOrigin = "anonymous";

// Script Bootstrap
var scriptBootstrap = document.createElement('script');
scriptBootstrap.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js";
scriptBootstrap.integrity = "sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy";
scriptBootstrap.crossOrigin = "anonymous";

// Adiciona os scripts ao corpo do documento
document.body.appendChild(scriptPopper);
document.body.appendChild(scriptBootstrap);
