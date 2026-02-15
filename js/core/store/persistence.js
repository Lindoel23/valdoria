import { db, dbRef } from '../firebase-config.js'; 
import { set, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { KingdomData, setKingdomData } from './state.js';
import { Events } from '../events.js';

export const Persistence = {
    init() {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setKingdomData(data);
                // Avisa que os dados chegaram para o desenho inicial
                Events.emit('state:loaded', KingdomData);
            } else {
                this.save();
                Events.emit('state:loaded', KingdomData);
            }
        });
    },

    save() {
        set(dbRef, KingdomData);
        // Não emite evento global de redraw. A UI deve reagir aos eventos específicos.
    }
};