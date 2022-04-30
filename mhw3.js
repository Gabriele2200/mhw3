
const weather_key = 'Q3xTS1YTXi1YgLshiNYLutcBQNsGG4vC'
const weather_location='http://dataservice.accuweather.com/locations/v1/cities/search'

const weather_condition='http://dataservice.accuweather.com/currentconditions/v1/'

const client_id ='b6fc6ee311dc497a83d4158a8227090c'
const client_secret = '0628e0ffab8c4bf0ba313f9d4cd7fe88'
let token_spotify;

const Playlist_url ='https://api.spotify.com/v1/search?type=track&q='






function onResponse(response){
    return response.json();
}


function onJsonMeteo_l(json){
    console.log(json);
    console.log(json[0].Key); // check
    City_key = json[0].Key;
    const City_name=document.querySelector('#Title_M');
    City_name.textContent= json[0].LocalizedName;
}

function onSpotifyJson(json){
    console.log(json);
    const s_div = document.querySelector('#Musica_div');
    s_div.classList.remove('hidden');
    const m_div = document.querySelector('#Meteo_div');
    m_div.classList.add('hidden');
    const risultati=json.tracks.items;
    let n_ris=risultati.length;
    if(n_ris>= 5) n_ris=5;
    for(let i=0 ; i<n_ris;i++){
        const M_data=risultati[i];
        const titolo = M_data.name;
        const link = M_data.uri;
        var site_link = document.createElement('a');
        site_link.setAttribute('href' , link);
        site_link.textContent= 'Continua su Spotify';
        const song_image= M_data.album.images[0].url;
        const track = document.createElement('div');
        track.classList.add('track');
        const img = document.createElement('img');
        img.src = song_image;
        const track_T = document.createElement('span');
        track_T.textContent = titolo;
        const artista= M_data.artists[0].name;
        const artista_E = document.createElement('span');
        artista_E.textContent = artista;
        track.appendChild(img);
        track.appendChild(track_T);
        track.appendChild(artista_E);
        track.appendChild(site_link);
        s_div.appendChild(track);


    }

}





function onJsonMeteo_Cc(json){
    console.log(json);
    const w_div = document.querySelector('#Meteo_div');
    w_div.classList.remove('hidden');
    const e_div = document.querySelector('#Musica_div');
    e_div.classList.add('hidden');

    const metric_value = json[0].Temperature.Metric.Value + ' ' + json[0].Temperature.Metric.Unit + '°';
    console.log(metric_value);
    const weather_T = json[0].WeatherText;
    console.log(weather_T);
    const Meteo_p=document.querySelector('#Parag_M');
    Meteo_p.innerHTML= weather_T + '  <span></span>'
    Meteo_p.querySelector('span').textContent=metric_value;
    w_div.querySelector('a').href= json[0].Link;




    

} 

function RicercaCond(){
    const Meteo_req_Cc= weather_condition + City_key + '?apikey=' + weather_key
    fetch(Meteo_req_Cc).then(onResponse).then(onJsonMeteo_Cc)
}


function onToken_sJson(json){
    console.log(json);
    token_spotify= json.access_token;
    console.log('token: ' + token_spotify);
}



fetch("https://accounts.spotify.com/api/token",
    {
    method: "post",
    body: 'grant_type=client_credentials',
    headers:
    {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
    }
    }
).then(onResponse).then(onToken_sJson);








function sendRequest(event){
    event.preventDefault();

    const text = document.querySelector('#content').value;
    const encoded_t = encodeURIComponent(text);
    const tipo = document.querySelector('#tipo').value;
    const Ans_div=document.querySelector('#Risposta_R');
    Ans_div.classList.remove('hidden');
    
    if(tipo === 'meteo'){

        const Meteo_req_l = weather_location + '?apikey=' + weather_key + '&q=' + encoded_t
        fetch(Meteo_req_l).then(onResponse).then(onJsonMeteo_l).then(RicercaCond)


    }
    if(tipo === 'musica'){

        fetch(Playlist_url + encoded_t ,{
            headers:{
                'Authorization': 'Bearer ' + token_spotify
            }
        }).then(onResponse).then(onSpotifyJson)

    }
        


}


const form = document.querySelector('#ricerca');
form.addEventListener('submit', sendRequest);

let City_key;


