import {applyAndRegister, reactive, startReactiveDom} from "./react.js";

const userPrompt = reactive({
    isOpened: true,
    isFormOpened: function () { return this.isOpened },
    changeState: function () {
        this.isOpened = !this.isOpened;
    },
    getButtonText: function() {
       return this.isOpened ? 'Hide' : 'Show' 
    },
    getStyle: function() {
        return { 'margin-bottom': this.isOpened ? '0px' : '-260px'}
    },
    getTitle: function() {
        if (villeDepart && villeArrivee && !this.isOpened) {
            return `${villeDepart} - ${villeArrivee}`
        }
        return 'Plus court chemin';
    },
    getDesc: function() {
        if (distance && !this.isOpened) {
            return `${distance} km`
        }
        return 'Trouvez le plus court chemin entre deux villes';
    }
}, 'prompt');

startReactiveDom();