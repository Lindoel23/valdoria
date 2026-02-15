import { KingdomData, Store, Events } from '../core/store/index.js';

export function createSalariesSection() {
    const section = document.createElement('section');
    section.className = 'salaries-section';
    
    section.innerHTML = `
        <div class="sal-table-wrapper">
            <table class="sal-table">
                <thead>
                    <tr>
                        <th class="col-prof text-left">Profissão</th>
                        <th class="col-sal text-center">Salário</th>
                        <th class="col-life text-center">Nível de Vida</th>
                        <th class="col-del edit-mode"></th>
                    </tr>
                </thead>
                <tbody id="sal-body"></tbody>
            </table>
        </div>
        
        <button class="btn-create-large edit-mode" id="btn-add-salary" style="padding: 10px; font-size: 0.8rem; margin-top: 15px;">
            <span class="material-icons-round">work</span> Adicionar Profissão
        </button>

        <div class="sal-footer">
            <span style="color:var(--text-muted); font-size: 0.75rem; letter-spacing: 1px;">SALÁRIOS MÉDIOS</span>
            <div class="total-display">
                Base: <input class="input-magic sal-footer-input" id="sal-footer-field" placeholder="Ex: PO/Mês">
            </div>
        </div>
    `;

    section.querySelector('#btn-add-salary').onclick = () => Store.addSalary();
    const footerInput = section.querySelector('#sal-footer-field');
    footerInput.value = KingdomData.salaries?.footer || "";
    footerInput.oninput = (e) => Store.updateSalaryFooter(e.target.value);

    const tbody = section.querySelector('#sal-body');

    const createRow = (item) => {
        const row = document.createElement('tr');
        row.dataset.id = item.id;
        row.innerHTML = `
            <td class="text-left"><input class="input-magic in-prof" placeholder="Profissão" value="${item.profession}"></td>
            <td class="text-center"><input class="input-magic in-sal" placeholder="0-0" value="${item.salary}"></td>
            <td class="text-center"><input class="input-magic in-life" placeholder="Nível" value="${item.life}"></td>
            <td class="edit-mode text-center">
                <button class="action-btn del-group"><span class="material-icons-round">close</span></button>
            </td>
        `;

        row.querySelector('.in-prof').oninput = (e) => Store.updateSalary(item.id, 'profession', e.target.value);
        row.querySelector('.in-sal').oninput = (e) => Store.updateSalary(item.id, 'salary', e.target.value);
        row.querySelector('.in-life').oninput = (e) => Store.updateSalary(item.id, 'life', e.target.value);
        row.querySelector('.del-group').onclick = () => Store.deleteSalary(item.id);

        return row;
    };

    (KingdomData.salaries?.list || []).forEach(item => tbody.appendChild(createRow(item)));

    // --- REATIVIDADE ---

    Events.on('salary:added', (item) => {
        if (!document.body.contains(section)) return;
        tbody.appendChild(createRow(item));
    });

    Events.on('salary:deleted', ({ id }) => {
        if (!document.body.contains(section)) return;
        const row = tbody.querySelector(`tr[data-id="${id}"]`);
        if (row) row.remove();
    });

    Events.on('salary:updated', ({ id, field, value }) => {
        if (!document.body.contains(section)) return;
        const row = tbody.querySelector(`tr[data-id="${id}"]`);
        if (row) {
            if (field === 'profession') {
                const el = row.querySelector('.in-prof');
                if (document.activeElement !== el) el.value = value;
            }
            if (field === 'salary') {
                const el = row.querySelector('.in-sal');
                if (document.activeElement !== el) el.value = value;
            }
            if (field === 'life') {
                const el = row.querySelector('.in-life');
                if (document.activeElement !== el) el.value = value;
            }
        }
    });

    return section;
}