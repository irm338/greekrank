// Conserva el identificador para que una notificación nueva reemplace su temporizador.
let notificationTimeout;

// Muestra el mensaje como texto para evitar interpretar contenido como HTML.
function showNotification(msg, type = 'info') {
    const banner = document.getElementById('notification-banner');
    const content = document.getElementById('notification-content');
    const messageEl = document.getElementById('notification-message');
    
    messageEl.textContent = msg;
    banner.classList.remove('hidden');
    content.classList.toggle('is-error', type === 'error');
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(closeNotification, 4000);
}

function closeNotification() {
    clearTimeout(notificationTimeout);
    document.getElementById('notification-banner').classList.add('hidden');
}

// Abre y cierra el diálogo de autenticación y bloquea el desplazamiento del fondo.
function openAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
    document.body.classList.add('modal-open');
}

function openLoginModal() {
    switchAuthTab('login');
    openAuthModal();
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('form-login');
    const regForm = document.getElementById('form-register');
    const tabLogin = document.getElementById('auth-tab-login');
    const tabReg = document.getElementById('auth-tab-register');

    if (!['login', 'register'].includes(tab)) return;

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        tabLogin.classList.add('is-active');
        tabReg.classList.remove('is-active');
        tabLogin.setAttribute('aria-selected', 'true');
        tabReg.setAttribute('aria-selected', 'false');
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        tabReg.classList.add('is-active');
        tabLogin.classList.remove('is-active');
        tabReg.setAttribute('aria-selected', 'true');
        tabLogin.setAttribute('aria-selected', 'false');
    }
}

function selectRegistrationType(type) {
    const requestAdmin = type === 'administrador';
    const userButton = document.getElementById('register-user-type');
    const adminButton = document.getElementById('register-admin-type');
    const codeGroup = document.getElementById('register-admin-code-group');
    const codeInput = document.getElementById('reg-admin-code');
    userButton.classList.toggle('is-active', !requestAdmin);
    adminButton.classList.toggle('is-active', requestAdmin);
    userButton.setAttribute('aria-pressed', String(!requestAdmin));
    adminButton.setAttribute('aria-pressed', String(requestAdmin));
    codeGroup.classList.toggle('hidden', !requestAdmin);
    codeInput.required = requestAdmin;
    if (!requestAdmin) codeInput.value = '';
    document.getElementById('register-role-note').textContent = requestAdmin
        ? 'Tu cuenta será de usuario hasta que un administrador apruebe tu solicitud.'
        : 'Crea una cuenta para participar en la comunidad.';
}

// Mantiene sincronizadas la vista visible y la opción activa de navegación.
function navigateTo(viewId) {
    const adminNavigation = document.getElementById('nav-admin');
    if (viewId === 'admin' && (!adminNavigation || adminNavigation.classList.contains('hidden'))) {
        showNotification('Solo un administrador puede acceder a esta sección.', 'error');
        return;
    }

    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('is-active'));
    const activeLink = document.querySelector(`.nav-link[onclick="navigateTo('${viewId}')"]`);
    if (activeLink) activeLink.classList.add('is-active');
}

// Permite cerrar el diálogo con Escape, además del botón y el fondo del modal.
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !document.getElementById('auth-modal').classList.contains('hidden')) {
        closeAuthModal();
    }
});