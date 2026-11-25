// Lee la URL de la API desde el documento y usa el servicio local si no se configuró.
const configuredApiBase = document.querySelector('meta[name="api-base"]')?.content.trim();
const defaultApiBase = `${location.protocol === 'file:' ? 'http:' : location.protocol}//${location.hostname || 'localhost'}:3000/api/v1`;
const API_BASE = (configuredApiBase || defaultApiBase).replace(/\/+$/, '');

// Centraliza las solicitudes, la autenticación y la conversión de errores HTTP.
async function apiRequest(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('jwt_token');
    const headers = {};

    if (body !== null) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
        response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers,
            body: body === null ? null : JSON.stringify(body)
        });
    } catch {
        throw new Error(`No se pudo conectar con la API (${API_BASE}). Verifica que el servidor esté encendido y que la dirección sea correcta.`);
    }

    const data = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
        const apiMessage = typeof data?.error === 'string'
            ? data.error
            : typeof data?.message === 'string' ? data.message : '';
        const statusMessages = {
            400: 'La solicitud no es válida. Revisa los datos e inténtalo de nuevo.',
            401: 'No se pudo autenticar la solicitud. Inicia sesión o verifica tus credenciales.',
            403: 'No tienes permiso para realizar esta acción.',
            404: 'No se encontró el recurso solicitado.',
            500: 'La API encontró un error interno. Inténtalo más tarde.'
        };
        const message = apiMessage || statusMessages[response.status] || `Error HTTP ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        throw error;
    }

    return data;
}
