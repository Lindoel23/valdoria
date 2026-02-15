import { KingdomData, Store, Events } from '../core/store/index.js';

export function createRequestsSection() {
    const section = document.createElement('section');
    section.className = 'requests-section';

    section.innerHTML = `
        <span class="req-header-title">QUADRO DE SOLICITAÇÕES & DECRETOS</span>
        <div class="req-list" id="req-list-root"></div>
        <button class="btn-create-large edit-mode" id="btn-add-req" style="margin-top: 20px;">
            <span class="material-icons-round">post_add</span> Nova Solicitação
        </button>
    `;

    const listRoot = section.querySelector('#req-list-root');
    section.querySelector('#btn-add-req').onclick = () => Store.addRequest();

    const createReqCard = (req) => {
        const card = document.createElement('div');
        card.className = `req-card ${req.status || 'pending'} ${req.collapsed ? 'collapsed' : ''}`;
        card.dataset.id = req.id;

        card.innerHTML = `
            <div class="req-card-header">
                <span class="material-icons-round req-icon-collapse">expand_more</span>
                <input class="input-magic req-title-input" placeholder="Título" value="${req.title}">
                <div class="req-actions">
                    <button class="btn-decision btn-approve" title="Aprovar"><span class="material-icons-round">check_circle</span></button>
                    <button class="btn-decision btn-reject" title="Reprovar"><span class="material-icons-round">cancel</span></button>
                    <button class="action-btn btn-del-req edit-mode" title="Excluir"><span class="material-icons-round">delete</span></button>
                </div>
            </div>
            <div class="req-card-body">
                <textarea class="req-desc-input" placeholder="Descrição...">${req.description}</textarea>
            </div>
        `;

        const header = card.querySelector('.req-card-header');
        header.onclick = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.closest('button')) return;
            Store.toggleRequestCollapse(req.id);
        };

        const titleInput = card.querySelector('.req-title-input');
        titleInput.oninput = (e) => Store.updateRequest(req.id, 'title', e.target.value);

        const descInput = card.querySelector('.req-desc-input');
        // Ajuste de altura automático
        descInput.style.height = 'auto';
        descInput.style.height = descInput.scrollHeight + 'px';
        
        descInput.oninput = (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
            Store.updateRequest(req.id, 'description', e.target.value);
        };

        card.querySelector('.btn-approve').onclick = () => Store.toggleRequestStatus(req.id, 'approved');
        card.querySelector('.btn-reject').onclick = () => Store.toggleRequestStatus(req.id, 'rejected');
        card.querySelector('.btn-del-req').onclick = () => Store.deleteRequest(req.id);

        return card;
    };

    // Render Inicial
    (KingdomData.requests || []).forEach(r => listRoot.appendChild(createReqCard(r)));

    // --- REATIVIDADE ---

    Events.on('request:added', (req) => {
        if (!document.body.contains(section)) return;
        listRoot.appendChild(createReqCard(req));
    });

    Events.on('request:deleted', ({ id }) => {
        if (!document.body.contains(section)) return;
        const card = listRoot.querySelector(`.req-card[data-id="${id}"]`);
        if (card) card.remove();
    });

    Events.on('request:updated', ({ id, field, value }) => {
        if (!document.body.contains(section)) return;
        const card = listRoot.querySelector(`.req-card[data-id="${id}"]`);
        if (!card) return;

        if (field === 'status') {
            card.classList.remove('pending', 'approved', 'rejected');
            card.classList.add(value);
        }
        if (field === 'collapsed') {
            card.classList.toggle('collapsed', value);
        }
        if (field === 'title') {
            const el = card.querySelector('.req-title-input');
            if (document.activeElement !== el) el.value = value;
        }
        if (field === 'description') {
            const el = card.querySelector('.req-desc-input');
            if (document.activeElement !== el) {
                el.value = value;
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
            }
        }
    });

    return section;
}