//Get Nasa's image repo with inputted keyword
(async () => {
    try{
        const res = await fetch('https://images-api.nasa.gov/search?keywords="mars"&page='+ Math.floor(Math.random()*(10) + 1) +'&media_type=image')
        window.backImgs = await res.json()

        startTimer(backImgs.collection)
    }
    catch(e){
        console.log("Error fetching background image. " , e)
    }
})()

//Timer that changes the POTD src.
// let backSlide = document.getElementById("POTDslide")
let backSlide = document.getElementById("POTDslide")
function startTimer(backImgs, start = true){
    function newImg(){
        let rand = Math.floor(Math.random()*(backImgs.items.length))
        backSlide.src = backImgs.items[rand].links[0].href
        let desc = backImgs.items[rand].data[0].description
        if(desc === undefined)(desc = "No description found")
        backSlide.title = desc
    }
    //Run on init. Later, we use this function to reset the timer. Dont want to run this.
    if(start)(newImg())
    window.timer = setInterval(newImg, 10000)
}

//Get weather info. Dont think this API is updated anymore though.
(async function(){
    try{
        const res3 = await fetch("https://api.maas2.apollorion.com")
        const tempObj = await res3.json()

        let {terrestrial_date, min_temp, max_temp, atmo_opacity, season, sunset, sunrise, pressure_string, pressure} = tempObj

        //Update visuals
        document.getElementById("date").innerText = terrestrial_date.substring(0, 10)

        document.getElementById("temp--min").innerText = min_temp
        document.getElementById("temp--max").innerText = max_temp
    
        document.getElementById("weather").innerText = atmo_opacity
        document.getElementById("season").innerText = season

        document.getElementById("sunset").innerText = sunset
        document.getElementById("sunrise").innerText = sunrise

        document.getElementById("pressure--string").innerText = pressure_string
        document.getElementById("pressure--num").innerText = pressure
    }
    catch(e){
        console.log("Error fetching temp information " , e)
    }
})();