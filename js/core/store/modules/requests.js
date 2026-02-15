import { KingdomData } from '../state.js';
import { Persistence } from '../persistence.js';
import { Events } from '../../events.js';

export const RequestsModule = {
    addRequest() {
        if (!KingdomData.requests) KingdomData.requests = [];
        const newReq = {
            id: Date.now(),
            title: "Nova Solicitação",
            description: "",
            status: "pending",
            collapsed: false
        };
        KingdomData.requests.push(newReq);
        
        Persistence.save();
        Events.emit('request:added', newReq);
    },

    updateRequest(id, field, val) {
        const req = KingdomData.requests.find(r => r.id === id);
        if (req) {
            req[field] = val;
            Persistence.save();
            Events.emit('request:updated', { id, field, value: val });
        }
    },

    toggleRequestStatus(id, newStatus) {
        const req = KingdomData.requests.find(r => r.id === id);
        if (req) {
            req.status = (req.status === newStatus) ? 'pending' : newStatus;
            Persistence.save();
            Events.emit('request:updated', { id, field: 'status', value: req.status });
        }
    },

    toggleRequestCollapse(id) {
        const req = KingdomData.requests.find(r => r.id === id);
        if (req) {
            req.collapsed = !req.collapsed;
            Persistence.save();
            Events.emit('request:updated', { id, field: 'collapsed', value: req.collapsed });
        }
    },

    deleteRequest(id) {
        KingdomData.requests = KingdomData.requests.filter(r => r.id !== id);
        Persistence.save();
        Events.emit('request:deleted', { id });
    }
};