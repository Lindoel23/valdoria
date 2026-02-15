import { KingdomData, Store, Events } from '../core/store/index.js';

export function createPopulationSection() {
    const section = document.createElement('section');
    section.className = 'population-section';
    section.innerHTML = `
        <div class="pop-table-wrapper">
            <table class="pop-table">
                <thead>
                    <tr>
                        <th class="col-group text-left">Grupo Social</th>
                        <th class="col-pop text-center">População</th>
                        <th class="col-pct text-center">%</th>
                        <th class="col-act text-center">Atividade Econômica</th>
                        <th class="col-del edit-mode"></th>
                    </tr>
                </thead>
                <tbody id="pop-body"></tbody>
            </table>
        </div>
        <button class="btn-create-large edit-mode" id="btn-add-group" style="padding: 10px; font-size: 0.8rem; margin-top: 15px;">
            <span class="material-icons-round">person_add</span> Adicionar Grupo Social
        </button>
        <div class="pop-footer">
            <span style="color:var(--text-muted); font-size: 0.75rem; letter-spacing: 1px;">DISTRIBUIÇÃO POPULACIONAL</span>
            <div class="total-display">
                TOTAL: <span id="pop-total-val">0</span> / 
                <input type="number" class="input-magic pop-limit-input" id="pop-limit-field">
            </div>
        </div>
    `;

    section.querySelector('#btn-add-group').onclick = () => Store.addGroup();
    const limitInput = section.querySelector('#pop-limit-field');
    limitInput.value = KingdomData.population?.limit || 0;
    limitInput.oninput = (e) => Store.updatePopLimit(e.target.value);

    const tbody = section.querySelector('#pop-body');

    const createRow = (group) => {
        const row = document.createElement('tr');
        row.dataset.id = group.id;
        row.innerHTML = `
            <td class="text-left"><input class="input-magic in-name" placeholder="Grupo" value="${group.name}"></td>
            <td class="text-center"><input type="number" class="input-magic in-count" placeholder="0" value="${group.count}"></td>
            <td class="text-center"><span class="pct-label" style="font-family:monospace; color:var(--accent)">0.0%</span></td>
            <td class="text-center"><input class="input-magic in-act" placeholder="Atividade" value="${group.activity}"></td>
            <td class="edit-mode text-center">
                <button class="action-btn del-group"><span class="material-icons-round">close</span></button>
            </td>
        `;
        
        row.querySelector('.in-name').oninput = (e) => Store.updateGroup(group.id, 'name', e.target.value);
        row.querySelector('.in-count').oninput = (e) => Store.updateGroup(group.id, 'count', e.target.value);
        row.querySelector('.in-act').oninput = (e) => Store.updateGroup(group.id, 'activity', e.target.value);
        row.querySelector('.del-group').onclick = () => Store.deleteGroup(group.id);
        
        return row;
    };

    (KingdomData.population?.groups || []).forEach(g => tbody.appendChild(createRow(g)));

    // --- REATIVIDADE ---

    Events.on('group:updated', ({ id, field, value }) => {
        if (!document.body.contains(section)) return;
        
        const row = tbody.querySelector(`tr[data-id="${id}"]`);
        if (row) {
            if (field === 'name') {
                const el = row.querySelector('.in-name');
                if (document.activeElement !== el) el.value = value;
            }
            if (field === 'count') {
                const el = row.querySelector('.in-count');
                if (document.activeElement !== el) el.value = value;
            }
            if (field === 'activity') {
                const el = row.querySelector('.in-act');
                if (document.activeElement !== el) el.value = value;
            }
        }
    });

    Events.on('group:added', (group) => {
        if (!document.body.contains(section)) return;
        tbody.appendChild(createRow(group));
    });

    Events.on('group:deleted', ({ id }) => {
        if (!document.body.contains(section)) return;
        const row = tbody.querySelector(`tr[data-id="${id}"]`);
        if (row) row.remove();
    });

    // Recebe flag 'force' para ignorar verificação de DOM na inicialização
    const recalcPopTotals = (force = false) => {
        if (!force && !document.body.contains(section)) return;

        const groups = KingdomData.population.groups || [];
        const total = groups.reduce((sum, g) => sum + (Number(g.count) || 0), 0);
        const limit = KingdomData.population.limit;

        const totalEl = section.querySelector('#pop-total-val');
        totalEl.innerText = total.toLocaleString();
        totalEl.classList.toggle('limit-exceeded', total > limit);

        if (document.activeElement !== limitInput) limitInput.value = limit;

        groups.forEach(group => {
            const row = tbody.querySelector(`tr[data-id="${group.id}"]`);
            if (row) {
                const pct = total > 0 ? ((group.count / total) * 100).toFixed(1) : "0.0";
                row.querySelector('.pct-label').innerText = pct + "%";
            }
        });
    };

    // Executa forçando o cálculo inicial
    recalcPopTotals(true);

    // Nas atualizações futuras, respeita a verificação de DOM
    Events.on('totals:updated', () => recalcPopTotals(false));
    Events.on('population:updated', () => recalcPopTotals(false));

    return section;
}