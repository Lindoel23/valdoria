import { KingdomData } from '../state.js';
import { Persistence } from '../persistence.js';
import { Events } from '../../events.js';

export const PopulationModule = {
    updatePopLimit(val) {
        if (!KingdomData.population) KingdomData.population = { limit: 0, groups: [] };
        KingdomData.population.limit = Number(val) || 0;
        
        Persistence.save();
        Events.emit('population:updated', { field: 'limit', value: KingdomData.population.limit });
        Events.emit('totals:updated');
    },

    addGroup() {
        if (!KingdomData.population) KingdomData.population = { limit: 100000, groups: [] };
        if (!KingdomData.population.groups) KingdomData.population.groups = [];
        const newGroup = { id: Date.now(), name: "Novo Grupo", count: 0, activity: "Atividade" };
        KingdomData.population.groups.push(newGroup);
        
        Persistence.save();
        Events.emit('group:added', newGroup);
        Events.emit('totals:updated');
    },

    updateGroup(id, field, val) {
        const group = KingdomData.population.groups.find(g => g.id === id);
        if (group) {
            group[field] = field === 'count' ? (Number(val) || 0) : val;
            
            Persistence.save();
            Events.emit('group:updated', { id, field, value: group[field] });
            Events.emit('totals:updated');
        }
    },

    deleteGroup(id) {
        KingdomData.population.groups = KingdomData.population.groups.filter(g => g.id !== id);
        
        Persistence.save();
        Events.emit('group:deleted', { id });
        Events.emit('totals:updated');
    }
};