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
}

const displayBothMeteo = async (city1, city2) => {
    const [geoCode1, geoCode2] = await Promise.all([
        getGeocoding(city1),
        getGeocoding(city2)
    ]);

    const [temp1, temp2] = await Promise.all([
        getMeteoData(geoCode1),
        getMeteoData(geoCode2)
    ]);

    document.getElementById('meteo1').innerHTML = `La temperature a ${city1} est de ${temp1}`
    document.getElementById('meteo2').innerHTML = `La temperature a ${city2} est de ${temp2}`
}