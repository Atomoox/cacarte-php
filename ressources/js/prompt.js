import {applyAndRegister, reactive, startReactiveDom} from "./react.js";

reactive({
    currentResponse: false,
    isOpened: true,

    isFormOpened: function () { return this.isOpened },
    changeState: function () {
        this.isOpened = !this.isOpened;
    },
    getButtonText: function() {
        console.log(this.currentResponse)
       return this.isOpened ? 'Cacher' : 'Montrer' 
    },
    getStyle: function() {
        return { 'margin-bottom': this.isOpened ? '0px' : '-260px'}
    },
    getTitle: function() {
        if (
            this.currentResponse?.villeDepart && 
            this.currentResponse?.villeArrivee && 
            !this.isOpened
        ) {
            return `${this.currentResponse.villeDepart} - ${this.currentResponse.villeArrivee}`
        }
        return 'Plus court chemin';
    },
    getDesc: function() {
        if (this.currentResponse?.distance && !this.isOpened) {
            return `${this.currentResponse.distance} km`
        }
        return 'Trouvez le plus court chemin entre deux villes';
    },
    queryApi: function() {
        const startInput = document.getElementById('nomCommuneDepart_id');
        const destinationinput = document.getElementById('nomCommuneArrivee_id');
        const depart = startInput.value;
        const arrive = destinationinput.value;

        startInput.classList.remove('error');
        destinationinput.classList.remove('error');

        if (!depart || !arrive) {
            !depart && startInput.classList.add('error');
            !arrive && destinationinput.classList.add('error');
            return;
        };

        const start_ts = performance.now();
        fetch(`http://localhost:8083/shortest-path?depart=${depart}&arrivee=${arrive}`, {
            method: 'GET',     
        })
        .then(response => response.json())
        .then(data => {
            this.currentResponse = {
                ...data,
                distance: data.distance.toFixed(2),
                executionTime: (performance.now() - start_ts).toFixed(2),
            };

            const path = data.points.map(x => [x.lat, x.lon]);
            map.viewPath(path);
        })
    },
    getresultStyle: function() {
        return {
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '10px',
            'border-radius': '10px',
            'display': this.currentResponse ? 'flex' : 'none',
            'z-index': 2,
            'flex-direction': 'column',
            color: this.currentResponse.errMsg ? 'white !important' : 'black',
            'background-color': this.currentResponse.errMsg ? '#F15656' : 'white',
            gap: '5px',
        }
    },
    displayTravel: function() {
        if (this.currentResponse?.errMsg) {
            return this.currentResponse.errMsg;
        }
        return `${this.currentResponse.villeDepart} - ${this.currentResponse.villeArrivee}`;
    },
    displayDistance: function() {
        return `${this.currentResponse.distance} km`;
    },
    displayExecutionTime: function() {
        return `Le calcul du chemin a pris ${this.currentResponse.executionTime} ms`;
    }
}, 'prompt');

startReactiveDom();