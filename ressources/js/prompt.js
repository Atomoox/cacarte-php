import {applyAndRegister, reactive, startReactiveDom} from "./react.js";

const getMeteoData = async ({latitude, longitude}) => {
    const response = await fetch(`https://api.open-meteo.com/v1/meteofrance?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);
    if (response.status !== 200) {
        throw new Error('Failed to get meteo data');
    }
    const obj = JSON.parse(await response.text());
    const temp = obj.hourly.temperature_2m.pop();
    if (!temp) throw new Error('no temperature found');
    return temp + ' ' + obj.hourly_units.temperature_2m;
};

const getGeocoding = async (city) => {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`, {
        headers: {
            'accept': '*'
        },
    });

    const text = await response.text();

    if (response.status !== 200) {
        throw new Error('Failed to get geocoding data');
    }
    const obj = JSON.parse(text);
    const geocode = obj.results.shift();
    if (!geocode) throw new Error('no geocode found');
    const {latitude, longitude} = geocode;
    return {latitude, longitude};
};

const p = reactive({
    currentResponse: false,
    currentMeteo: false,
    isOpened: true,
    isDisplayed: true,
    isLoaded: false,
    currentHistory: [],
    historyBody: '',

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
        const userInput = document.getElementById('user');
        const depart = startInput.value;
        const arrive = destinationinput.value;

        startInput.classList.remove('error');
        destinationinput.classList.remove('error');

        if (!depart || !arrive) {
            !depart && startInput.classList.add('error');
            !arrive && destinationinput.classList.add('error');
            return;
        };

        const userQuery = userInput ? `&user=${userInput.value}` : '';

        const start_ts = performance.now();
        fetch(`http://localhost:8083/shortest-path?depart=${depart}&arrivee=${arrive}${userQuery}`, {
            method: 'GET',     
        })
        .then(response => response.json())
        .then(data => {
            this.currentResponse = {
                ...data,
                distance: data.distance.toFixed(2),
                executionTime: (performance.now() - start_ts).toFixed(2),
            };

            this.getMeteo();

            const path = data.points.map(x => [x.lat, x.lon]);
            map.viewPath(path);

            this.currentHistory.push({
                depart: data.villeDepart,
                arrivee: data.villeArrivee,
                distance: data.distance.toFixed(2),
            });

            this.historyBody = this.currentHistory.reverse().map((x, i) => {
                return `
                    <div class="flex--column hentry">
                        <div class="path">${x.depart} - ${x.arrivee}</div>
                        <div class="distance">${parseInt(x.distance).toFixed(2)} km</div>
                    </div>
                `
            }).join('');
        })
    },

    getMeteo: function() {
        const city1 = this.currentResponse?.villeDepart;
        const city2 = this.currentResponse?.villeArrivee;
    
        if (!city1 || !city2) return Promise.resolve();
    
        return Promise.all([
            getGeocoding(city1),
            getGeocoding(city2)
        ]).then(([geoCode1, geoCode2]) => {
            return Promise.all([
                getMeteoData(geoCode1),
                getMeteoData(geoCode2)
            ]).then(([temp1, temp2]) => {
                this.currentMeteo = `${city1} (${temp1}) - ${city2} (${temp2})`;
            });
        });
    },

    displayMeteo: function() {
        return this.currentMeteo;
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
    },

    loadHistory: function() {
        const user = document.getElementById('user').value;

        if (!user) return;

        fetch(`http://localhost:8083/history?user=${user}`)
        .then(response => response.json())
        .then(data => {
            this.currentHistory = data;
            this.historyBody = this.currentHistory.reverse().map((x, i) => {
                return `
                    <div class="flex--column hentry">
                        <div class="path">${x.depart} - ${x.arrivee}</div>
                        <div class="distance">${x.distance.toFixed(2)} km</div>
                    </div>
                `
            }).join('');
        });
    },

    displayHistory: function() {
        return this.historyBody;
    }
}, 'prompt');

applyAndRegister(() => p.displayHistory.bind(p)())

startReactiveDom();