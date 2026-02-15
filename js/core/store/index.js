import { KingdomData } from './state.js';
import { Persistence } from './persistence.js';
import { Events } from '../events.js'; 

import { SessionsModule } from './modules/sessions.js';
import { PopulationModule } from './modules/population.js';
import { SalariesModule } from './modules/salaries.js';
import { RequestsModule } from './modules/requests.js';

export { KingdomData, Events };

export const Store = {
    init: Persistence.init.bind(Persistence),
    save: Persistence.save.bind(Persistence),
    ...SessionsModule,
    ...PopulationModule,
    ...SalariesModule,
    ...RequestsModule
};