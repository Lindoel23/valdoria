// js/utils/exporter.js

// Tenta importar o estado atual, mas protege contra falhas se o módulo estiver quebrado
let KingdomData = { error: "Could not load state" };
try {
    const storeModule = await import('../core/store/index.js');
    KingdomData = storeModule.KingdomData;
} catch (e) {
    console.warn("Exporter: Não foi possível carregar o KingdomData do store.", e);
}

export async function exportContext() {
    // Lista EXPLICITA de todos os arquivos do projeto
    const files = [
        // Raiz
        'index.html',
        
        // CSS (Base)
        'css/style.css',
        'css/base/variables.css',
        'css/base/reset.css',
        'css/base/animations.css',
        
        // CSS (Layout & Componentes)
        'css/layout/structure.css',
        'css/components/buttons.css',
        'css/components/inputs.css',
        'css/components/cards.css',
        'css/components/lines.css',
        'css/components/table.css',
        'css/components/requests.css',
        'css/components/modal.css',

        // JavaScript (App & Config)
        'js/app.js',
        'js/core/firebase-config.js',

        // JavaScript (Store Modular - Nova Estrutura)
        'js/core/store/index.js',
        'js/core/store/state.js',
        'js/core/store/persistence.js',
        'js/core/store/modules/sessions.js',
        'js/core/store/modules/population.js',
        'js/core/store/modules/salaries.js',
        'js/core/store/modules/requests.js',

        // JavaScript (Componentes Visuais)
        'js/components/Kingdom.js',
        'js/components/Session.js',
        'js/components/Level.js',
        'js/components/Line.js',
        'js/components/Population.js',
        'js/components/Salaries.js',
        'js/components/Requests.js',

        // JavaScript (Utilitários)
        'js/utils/calculator.js',
        'js/utils/exporter.js'
    ];

    let fullContext = "--- START OF SNAPSHOT: VALDORIA MODULAR (REFATORED) ---\n";
    fullContext += "Estrutura completa com Store dividido em módulos.\n\n";

    for (const file of files) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            fullContext += `\n------- FILE: ${file} -------\n${text}\n`;
        } catch (err) {
            fullContext += `\n------- FILE: ${file} -------\n[ERRO AO LER ARQUIVO: ${err.message}]\n`;
        }
    }

    fullContext += `\n\n------- CURRENT KINGDOM DATA (JSON) -------\n`;
    try {
        fullContext += JSON.stringify(KingdomData, null, 2);
    } catch (e) {
        fullContext += `[Erro ao serializar dados: ${e.message}]`;
    }
    
    fullContext += `\n\n--- END OF SNAPSHOT ---`;

    const blob = new Blob([fullContext], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    const timestamp = `${now.getHours()}h${now.getMinutes()}m`;
    
    a.href = url;
    a.download = `valdoria_refatorado_${timestamp}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}