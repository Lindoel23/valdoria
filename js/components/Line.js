import { Store, Events } from '../core/store/index.js';
import { calculate } from '../utils/calculator.js';

export function createLine(linha) {
    const div = document.createElement('div');
    div.className = 'line-container';
    div.dataset.id = linha.id;

    const valorInicial = calculate(linha.formula);

    div.innerHTML = `
        <div class="view-mode line-row">
            <div class="line-label">${linha.label}</div>
            <div class="line-description">${linha.description}</div>
            <div class="line-result">${valorInicial.toLocaleString()} PO</div>
        </div>
        <div class="edit-mode card-edit-unified">
            <div class="edit-grid-header">
                <input class="input-magic edit-input-name" placeholder="Item" value="${linha.label}">
                <input class="input-magic edit-input-desc" placeholder="Descrição" value="${linha.description}">
                <button class="action-btn delete-btn"><span class="material-icons-round">delete</span></button>
            </div>
            <div class="edit-grid-footer">
                <div class="formula-box">
                    <span class="material-icons-round formula-symbol">functions</span>
                    <input class="input-magic formula-input" placeholder="0" value="${linha.formula}">
                </div>
                <div class="result-badge">${valorInicial.toLocaleString()} <span class="unit">PO</span></div>
            </div>
        </div>
    `;

    const inName = div.querySelector('.edit-input-name');
    const inDesc = div.querySelector('.edit-input-desc');
    const inForm = div.querySelector('.formula-input');

    inName.oninput = (e) => Store.updateLine(linha.id, 'label', e.target.value);
    inDesc.oninput = (e) => Store.updateLine(linha.id, 'description', e.target.value);
    inForm.oninput = (e) => Store.updateLine(linha.id, 'formula', e.target.value);
    div.querySelector('.delete-btn').onclick = () => Store.deleteItem('line', linha.id);

    // --- REATIVIDADE ---
    Events.on('line:updated', ({ id, field, value, calculated }) => {
        if (!document.body.contains(div)) return;
        if (id !== linha.id) return;

        if (field === 'label') {
            div.querySelector('.line-label').innerText = value;
            if (document.activeElement !== inName) inName.value = value;
        }
        if (field === 'description') {
            div.querySelector('.line-description').innerText = value;
            if (document.activeElement !== inDesc) inDesc.value = value;
        }
        if (field === 'formula') {
            if (document.activeElement !== inForm) inForm.value = value;
            const fmt = calculated.toLocaleString();
            div.querySelector('.line-result').innerText = fmt + " PO";
            div.querySelector('.result-badge').innerHTML = `${fmt} <span class="unit">PO</span>`;
        }
    });

    return div;
}