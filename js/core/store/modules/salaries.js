import { KingdomData } from '../state.js';
import { Persistence } from '../persistence.js';
import { Events } from '../../events.js';

export const SalariesModule = {
    addSalary() {
        if (!KingdomData.salaries) KingdomData.salaries = { footer: "PO/mês", list: [] };
        if (!KingdomData.salaries.list) KingdomData.salaries.list = [];
        const newItem = { id: Date.now(), profession: "Nova Profissão", salary: "10-20", life: "Médio" };
        KingdomData.salaries.list.push(newItem);
        
        Persistence.save();
        Events.emit('salary:added', newItem);
    },

    updateSalary(id, field, val) {
        const item = KingdomData.salaries.list.find(i => i.id === id);
        if (item) {
            item[field] = val;
            Persistence.save();
            Events.emit('salary:updated', { id, field, value: val });
        }
    },

    updateSalaryFooter(val) {
        if (!KingdomData.salaries) KingdomData.salaries = { footer: "PO/mês", list: [] };
        KingdomData.salaries.footer = val;
        Persistence.save();
    },

    deleteSalary(id) {
        KingdomData.salaries.list = KingdomData.salaries.list.filter(i => i.id !== id);
        Persistence.save();
        Events.emit('salary:deleted', { id });
    }
};