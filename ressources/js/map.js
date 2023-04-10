class MapCacarte {
    constructor() {
        //setview on France lat and lon
        this.map = L.map('mapcaca').setView([
            46.227638,
            2.213749
        ], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            maxZoom: 18,
        }).addTo(this.map );
    }

    viewPath(path) {
        if (this.currentPath)
            this.map.removeLayer(this.currentPath);
        this.currentPath = L.polyline(path, {color: 'blue'}).addTo(this.map);
        this.map.fitBounds(this.currentPath.getBounds());
    }
};

const map = new MapCacarte();