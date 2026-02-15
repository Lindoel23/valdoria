import { KingdomData, Store, Events } from '../core/store/index.js';
import { createLevel } from './Level.js';
import { calculate } from '../utils/calculator.js';

export function createSession(sessao) {
    const section = document.createElement('section');
    section.className = 'session-block';
    section.dataset.id = sessao.id;

    section.innerHTML = `
        <div class="session-header">
            <span class="material-icons-round collapse-icon">expand_more</span>
            <input class="input-magic session-title" value="${sessao.titulo}">
            <span class="session-total">0 PO</span>
            <button class="action-btn delete-btn"><span class="material-icons-round">delete</span></button>
        </div>
        <div class="session-content ${sessao.collapsed ? 'hidden' : ''}">
            <div class="session-levels"></div>
            <button class="btn-create-large add-lvl-btn">+ Adicionar Nível</button>
        </div>
    `;

    const header = section.querySelector('.session-header');
    if (sessao.collapsed) header.classList.add('collapsed-state');

    header.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.closest('.delete-btn')) return;
        Store.toggleCollapse('session', sessao.id);
    });

    const titleInput = section.querySelector('.session-title');
    titleInput.addEventListener('input', (e) => Store.updateTitle('session', sessao.id, e.target.value));

    section.querySelector('.delete-btn').addEventListener('click', () => {
        if(confirm("Excluir sessão?")) Store.deleteItem('session', sessao.id);
    });

    section.querySelector('.add-lvl-btn').onclick = () => Store.addLevel(sessao.id);

    const levelsContainer = section.querySelector('.session-levels');
    (sessao.niveis || []).forEach(nivel => {
        levelsContainer.appendChild(createLevel(nivel, sessao.id));
    });

    // --- REATIVIDADE ---

    const updateSelf = ({ id, field, value }) => {
        if (!document.body.contains(section)) return;
        if (id !== sessao.id) return;

        if (field === 'titulo' && document.activeElement !== titleInput) {
            titleInput.value = value;
        }
        if (field === 'collapsed') {
            header.classList.toggle('collapsed-state', value);
            section.querySelector('.session-content').classList.toggle('hidden', value);
        }
    };
    Events.on('session:updated', updateSelf);

    const addLevelHandler = ({ level, sessionId }) => {
        if (!document.body.contains(section)) return;
        if (sessionId === sessao.id) {
            levelsContainer.appendChild(createLevel(level, sessionId));
        }
    };
    Events.on('level:added', addLevelHandler);

    const removeLevelHandler = ({ id, sessionId }) => {
        if (!document.body.contains(section)) return;
        if (sessionId === sessao.id) {
            const lvlEl = levelsContainer.querySelector(`.level-card[data-id="${id}"]`);
            if (lvlEl) lvlEl.remove();
        }
    };
    Events.on('level:deleted', removeLevelHandler);

    // Recebe flag 'force' para ignorar verificação de DOM na inicialização
    const recalcTotal = (force = false) => {
        if (!force && !document.body.contains(section)) return;
        
        const currentSession = KingdomData.sessoes.find(s => s.id === sessao.id);
        if(!currentSession) return;

        let total = 0;
        (currentSession.niveis || []).forEach(n => {
            (n.linhas || []).forEach(l => {
                total += calculate(l.formula || "0");
            });
        });

        const totalEl = section.querySelector('.session-total');
        totalEl.innerText = total.toLocaleString() + " PO";
        totalEl.style.color = total >= 0 ? "var(--accent)" : "var(--danger)";
    };
    
    // Executa forçando o cálculo inicial (ignorando se está no body)
    recalcTotal(true);
    
    // Nas atualizações futuras, respeita a verificação de DOM
    Events.on('totals:updated', () => recalcTotal(false));

    return section;
}