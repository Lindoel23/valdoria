import { KingdomData, Store, Events } from '../core/store/index.js';
import { createSession } from './Session.js';
import { createPopulationSection } from './Population.js';
import { createSalariesSection } from './Salaries.js';
import { createRequestsSection } from './Requests.js';

let isInitialized = false;

export const Kingdom = {
    root: document.getElementById('kingdom-root'),

    draw() {
        const isEditing = document.body.classList.contains('mode-edit');

        // Impede redesenho completo se já inicializou
        if (isInitialized && !isEditing) return;
        
        const loadingState = this.root.querySelector('.empty-state') || this.root.querySelector('p');
        if (loadingState && (KingdomData.sessoes?.length > 0 || isEditing)) {
            loadingState.remove();
        }
        
        if (!isInitialized) {
            this.setupStructure();
            isInitialized = true;
        }

        this.ensureAddButton();
    },

    setupStructure() {
        // 1. População
        let popSection = this.root.querySelector('.population-section');
        if (!popSection) {
            popSection = createPopulationSection();
            this.root.prepend(popSection);
        }

        // 2. Sessões
        let sessionsContainer = document.createElement('div');
        sessionsContainer.id = 'sessions-container';
        this.root.appendChild(sessionsContainer);

        (KingdomData.sessoes || []).forEach(sessao => {
            sessionsContainer.appendChild(createSession(sessao));
        });

        // Listeners para estrutura macro
        Events.on('session:added', (newSession) => {
            document.getElementById('sessions-container').appendChild(createSession(newSession));
        });

        Events.on('session:deleted', ({ id }) => {
            const el = document.querySelector(`.session-block[data-id="${id}"]`);
            if (el) el.remove();
        });

        // 3. Salários e Solicitações
        let salSection = createSalariesSection();
        this.root.appendChild(salSection);

        let reqSection = createRequestsSection();
        this.root.appendChild(reqSection);
    },

    ensureAddButton() {
        const isEditing = document.body.classList.contains('mode-edit');
        let btnAdd = this.root.querySelector('.btn-main-add');
        
        if (isEditing && !btnAdd) {
            btnAdd = document.createElement('button');
            btnAdd.className = 'btn-create-large btn-main-add';
            btnAdd.innerHTML = '<span class="material-icons-round">add_box</span> Criar Nova Sessão';
            btnAdd.onclick = () => Store.addSession();
            
            const salSection = this.root.querySelector('.salaries-section');
            if (salSection) this.root.insertBefore(btnAdd, salSection);
        } else if (!isEditing && btnAdd) {
            btnAdd.remove();
        }
    }
};