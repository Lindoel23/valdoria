export let KingdomData = {
    meta: { nome: "Valdoria", populacao: 0 },
    sessoes: [],
    population: { limit: 100000, groups: [] },
    salaries: { footer: "PO/mês", list: [] },
    requests: []
};

export function setKingdomData(data) {
    if (data) {
        KingdomData = data;
        // Garante a existência dos arrays para evitar crash
        if (!KingdomData.sessoes) KingdomData.sessoes = [];
        if (!KingdomData.population) KingdomData.population = { limit: 0, groups: [] };
        if (!KingdomData.salaries) KingdomData.salaries = { footer: "PO/mês", list: [] };
        if (!KingdomData.requests) KingdomData.requests = [];
    }
}