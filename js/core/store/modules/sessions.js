import { KingdomData } from '../state.js';
import { Persistence } from '../persistence.js';
import { calculate } from '../../../utils/calculator.js';
import { Events } from '../../events.js';

export const SessionsModule = {
    addSession() {
        if (!KingdomData.sessoes) KingdomData.sessoes = [];
        const newSession = { id: Date.now(), titulo: "Nova Sessão", niveis: [], collapsed: false };
        KingdomData.sessoes.push(newSession);
        
        Persistence.save();
        Events.emit('session:added', newSession);
        Events.emit('totals:updated');
    },

    addLevel(sessionId) {
        const session = KingdomData.sessoes.find(s => s.id === sessionId);
        if (session) {
            if (!session.niveis) session.niveis = [];
            const newLevel = { id: Date.now(), titulo: "Novo Nível", linhas: [], collapsed: false };
            session.niveis.push(newLevel);
            
            Persistence.save();
            Events.emit('level:added', { level: newLevel, sessionId });
        }
    },

    addLine(levelId) {
        for (let sessao of (KingdomData.sessoes || [])) {
            const level = (sessao.niveis || []).find(n => n.id === levelId);
            if (level) {
                if (!level.linhas) level.linhas = [];
                const newLine = { id: Date.now(), label: "Novo Item", description: "Descrição", formula: "0", valor: 0 };
                level.linhas.push(newLine);
                
                Persistence.save();
                Events.emit('line:added', { line: newLine, levelId });
                break;
            }
        }
    },

    deleteItem(type, id, parentId) {
        if (type === 'session') {
            KingdomData.sessoes = KingdomData.sessoes.filter(s => s.id !== id);
            Events.emit('session:deleted', { id });
        } else if (type === 'level') {
            const sessao = KingdomData.sessoes.find(s => s.id === parentId);
            if (sessao) {
                sessao.niveis = sessao.niveis.filter(n => n.id !== id);
                Events.emit('level:deleted', { id, sessionId: parentId });
            }
        } else if (type === 'line') {
            KingdomData.sessoes.forEach(s => { 
                (s.niveis || []).forEach(n => { 
                    const initialLen = (n.linhas || []).length;
                    n.linhas = (n.linhas || []).filter(l => l.id !== id);
                    if(n.linhas.length !== initialLen) {
                         Events.emit('line:deleted', { id, levelId: n.id });
                    }
                }); 
            });
        }
        Persistence.save();
        Events.emit('totals:updated');
    },

    updateLine(id, field, val) {
        let updated = false;
        KingdomData.sessoes.forEach(s => { 
            (s.niveis || []).forEach(n => { 
                let l = (n.linhas || []).find(l => l.id === id); 
                if (l) { 
                    l[field] = val; 
                    if (field === 'formula') l.valor = calculate(val); 
                    
                    Events.emit('line:updated', { id, field, value: val, calculated: l.valor });
                    updated = true;
                } 
            }); 
        });
        
        if (updated) {
            Persistence.save();
            if (field === 'formula') Events.emit('totals:updated'); 
        }
    },

    updateTitle(type, id, val) {
        if (type === 'session') { 
            const s = KingdomData.sessoes.find(s => s.id === id); 
            if (s) {
                s.titulo = val;
                Events.emit('session:updated', { id, field: 'titulo', value: val });
            }
        }
        else if (type === 'level') { 
            KingdomData.sessoes.forEach(s => { 
                let n = (s.niveis || []).find(n => n.id === id); 
                if (n) {
                    n.titulo = val;
                    Events.emit('level:updated', { id, field: 'titulo', value: val });
                }
            }); 
        }
        Persistence.save();
    },

    toggleCollapse(type, id) {
        let collapsed = false;
        if (type === 'session') { 
            const s = KingdomData.sessoes.find(s => s.id === id); 
            if (s) { s.collapsed = !s.collapsed; collapsed = s.collapsed; }
            Events.emit('session:updated', { id, field: 'collapsed', value: collapsed });
        }
        else if (type === 'level') { 
            KingdomData.sessoes.forEach(s => { 
                let n = (s.niveis || []).find(n => n.id === id); 
                if (n) { n.collapsed = !n.collapsed; collapsed = n.collapsed; }
                Events.emit('level:updated', { id, field: 'collapsed', value: collapsed });
            }); 
        }
        Persistence.save();
    }
};