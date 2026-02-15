/* 
   Barramento de Eventos (Pub/Sub) 
   Centraliza a comunicação entre Store e Componentes
*/

const listeners = {};

export const Events = {
    on(event, callback) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
    },

    off(event, callback) {
        if (!listeners[event]) return;
        listeners[event] = listeners[event].filter(cb => cb !== callback);
    },

    emit(event, payload) {
        if (listeners[event]) {
            listeners[event].forEach(callback => {
                try { callback(payload); } 
                catch (e) { console.error(`Erro no evento [${event}]:`, e); }
            });
        }
    }
};