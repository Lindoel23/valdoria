import { KingdomData, Store, Events } from './core/store/index.js';
import { Kingdom } from './components/Kingdom.js';
import { exportContext } from './utils/exporter.js';
import { calculate } from './utils/calculator.js';

const FAB_MODE = document.getElementById('fab-mode');
const FAB_EXPORT = document.getElementById('fab-export');
const modal = document.getElementById('modal-password');
const inputPass = document.getElementById('input-pass');
const btnConfirm = document.getElementById('btn-confirm-pass');
const btnCancel = document.getElementById('btn-cancel-pass');

function init() {
    Store.init();
    
    // Escuta evento de carregamento inicial para desenhar a estrutura
    Events.on('state:loaded', () => {
        Kingdom.draw(); // Só roda uma vez
        updateHeader(); // Atualiza números iniciais
    });

    // Escuta atualizações de valores para o cabeçalho
    Events.on('totals:updated', updateHeader);
}

FAB_MODE.onclick = () => {
    if (document.body.classList.contains('mode-edit')) {
        document.body.classList.remove('mode-edit');
        return;
    }
    modal.classList.remove('hidden');
    inputPass.value = '';
    inputPass.focus();
};

function handleAuth() {
    const password = inputPass.value;
    if (password === "estrelas") {
        modal.classList.add('hidden');
        document.body.classList.add('mode-edit');
        Kingdom.draw(); 
    } else {
        const content = modal.querySelector('.modal-content');
        content.classList.add('error');
        setTimeout(() => content.classList.remove('error'), 400);
        inputPass.value = '';
    }
}

btnConfirm.onclick = handleAuth;
btnCancel.onclick = () => modal.classList.add('hidden');
inputPass.onkeydown = (e) => { if(e.key === "Enter") handleAuth(); };
FAB_EXPORT.onclick = exportContext;

function updateHeader() {
    let totalSaldo = 0;
    const sessoes = KingdomData.sessoes || [];

    sessoes.forEach(s => {
        (s.niveis || []).forEach(n => {
            (n.linhas || []).forEach(l => {
                totalSaldo += calculate(l.formula || "0");
            });
        });
    });

    const grupos = KingdomData.population?.groups || [];
    const totalPop = grupos.reduce((sum, g) => sum + (Number(g.count) || 0), 0);

    const saldoEl = document.getElementById('meta-saldo');
    if (saldoEl) {
        saldoEl.innerText = totalSaldo.toLocaleString() + " PO";
        saldoEl.style.color = totalSaldo >= 0 ? "var(--success)" : "var(--danger)";
    }

    const popEl = document.getElementById('meta-pop');
    if (popEl) popEl.innerText = totalPop.toLocaleString();
}

init();