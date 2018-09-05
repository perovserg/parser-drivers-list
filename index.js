import request from 'request-promise';
import {URL} from 'url';


// source data
const incomingUrl = 'https://ru.gett.com/station?locale=ru&public_key=kosarevgett1881&signature=9e6c54f0517513122f53d0313411be82&station_id=872';

const parseDriversData_v1 = async (link) => {
    // Moscow
    const params = {
        lat: '55.80120428762521',
        lng: '37.41869718833334',
        radius: '100'
    };

    const pathname = '/station.json';


    const url = new URL(link);
    url.pathname = pathname;

    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

    const response = await request({
        uri: url.href,
        json: true
    });

    if (!response || !response.drivers) throw new Error('Got bad response!');

    console.log(`there are ${Object.entries(response.drivers).length} drivers in response`);

    return Object.entries(response.drivers).map(([k, v]) => ({[v.phone]: v}));

};

const parseDriversData = async (link) => {

    const response = await request({
        uri: link,
        json: true
    });

    if (!response) throw new Error('Got no response!');

    let result;
    response.replace(/driver_infos: (.*\}\})/igu, (line, ...[value]) => {
        result = JSON.parse(value);
    });

    console.log(`amount drivers: ${Object.entries(result).length}`);

    return Object.entries(result).map(([k, v]) => ({[v.phone]: {
        'name': v.name,
        'id': k
    }}));

};

parseDriversData(incomingUrl).then((result) => console.log(JSON.stringify(result)));