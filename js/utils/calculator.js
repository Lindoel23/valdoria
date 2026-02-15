export function calculate(formula) {
    try {
        const clean = formula.replace(/[^-+*/().0-9]/g, '');
        return Function(`'use strict'; return (${clean})`)() || 0;
    } catch (e) { return 0; }
}