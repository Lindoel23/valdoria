import { KingdomData, Store, Events } from '../core/store/index.js';
import { createLine } from './Line.js';
import { calculate } from '../utils/calculator.js';

export function createLevel(nivel, sessionId) {
    const div = document.createElement('div');
    div.className = 'level-card';
    div.dataset.id = nivel.id;

    div.innerHTML = `
        <div class="level-header">
            <div class="level-title-wrapper">
                <span class="material-icons-round collapse-icon">expand_more</span>
                <input class="input-magic title-input" value="${nivel.titulo}">
            </div>
            <span class="level-total">0 PO</span>
            <button class="action-btn delete-btn"><span class="material-icons-round">delete</span></button>
        </div>
        <div class="level-content ${nivel.collapsed ? 'hidden' : ''}">
            <div class="level-lines"></div>
            <button class="btn-create-large add-line-btn">+ Adicionar Linha</button>
        </div>
    `;

    const header = div.querySelector('.level-header');
    if (nivel.collapsed) header.classList.add('collapsed-state');

    header.onclick = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.closest('.delete-btn')) return;
        Store.toggleCollapse('level', nivel.id);
    };

    const titleInput = div.querySelector('.title-input');
    titleInput.oninput = (e) => Store.updateTitle('level', nivel.id, e.target.value);
    
    div.querySelector('.delete-btn').onclick = () => Store.deleteItem('level', nivel.id, sessionId);
    div.querySelector('.add-line-btn').onclick = () => Store.addLine(nivel.id);

    const linesContainer = div.querySelector('.level-lines');
    (nivel.linhas || []).forEach(l => {
        linesContainer.appendChild(createLine(l));
    });

    // --- REATIVIDADE ---

    Events.on('level:updated', ({ id, field, value }) => {
        if (!document.body.contains(div)) return;
        if (id !== nivel.id) return;

        if (field === 'titulo' && document.activeElement !== titleInput) titleInput.value = value;
        if (field === 'collapsed') {
            header.classList.toggle('collapsed-state', value);
            div.querySelector('.level-content').classList.toggle('hidden', value);
        }
    });

    Events.on('line:added', ({ line, levelId }) => {
        if (!document.body.contains(div)) return;
        if (levelId === nivel.id) linesContainer.appendChild(createLine(line));
    });

    Events.on('line:deleted', ({ id, levelId }) => {
        if (!document.body.contains(div)) return;
        if (levelId === nivel.id) {
            const lineEl = linesContainer.querySelector(`.line-container[data-id="${id}"]`);
            if (lineEl) lineEl.remove();
        }
    });

    // Recebe flag 'force' para ignorar verificação de DOM na inicialização
    const recalcLevelTotal = (force = false) => {
        if (!force && !document.body.contains(div)) return;
        
        let foundLevel = null;
        for (const s of KingdomData.sessoes) {
             const n = (s.niveis || []).find(n => n.id === nivel.id);
             if (n) { foundLevel = n; break; }
        }
        if(!foundLevel) return;

        let total = 0;
        (foundLevel.linhas || []).forEach(l => {
            total += calculate(l.formula || "0");
        });

        const totalEl = div.querySelector('.level-total');
        totalEl.innerText = total.toLocaleString() + " PO";
        totalEl.style.color = total >= 0 ? "var(--text-muted)" : "var(--danger)";
    };

    // Executa forçando o cálculo inicial
    recalcLevelTotal(true);
    
    // Nas atualizações futuras, respeita a verificação de DOM
    Events.on('totals:updated', () => recalcLevelTotal(false));

    return div;
}