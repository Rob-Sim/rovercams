//Fetch info on each of the rovers for the selection menu.
(async function(){
    try{
        const res = await fetch("https://api.nasa.gov/mars-photos/api/v1/rovers/?api_key=qjARvqcicXF8wjhM3emtnFLNBgVNfsU6ydEQsafw")
        let roversObj = await res.json()

        //Display each rover name in the selection menu
        let roverMenu = document.getElementById("rover--select")
        roversObj.rovers.forEach(roverItem => {
            let roverItemEle = document.createElement("option")
            roverItemEle.value = roverItem.name
            roverItemEle.innerText = roverItem.name
            roverMenu.appendChild(roverItemEle)
        });
    }
    catch(e){
        console.log("Error fetching info on all rovers " , e)
    }
}())

//Fetch info about the selected rover. Run when the user selects a rover in the selection menu
async function rover(inputVal = "Curiosity"){
    //Clear all images
    document.getElementById("image--container").innerHTML = " "
    window.roverPointer = inputVal
    modelLoad(inputVal)
    try{
        const res = await fetch("https://api.nasa.gov/mars-photos/api/v1/rovers/"+ roverPointer +"/?api_key=qjARvqcicXF8wjhM3emtnFLNBgVNfsU6ydEQsafw")
        //Stores info about the rover iteself
        window.manifest = await res.json()
    
        //When selecting a new rover - use the latest sol (max_sol)
        document.getElementById("inputSol").value = manifest.rover.max_sol
        document.getElementById("max--display").innerText = manifest.rover.max_sol
        picFetch()
    }
    catch(e){
        console.log("Error fetching info on selected rover from Nasa. " , e)
    }
}
//Fetch default rover on init
rover()

//Runs when the user enters a new sol. Update the pictures.
function solInpFunc(){
    let sol = document.getElementById("inputSol").value
    //If they enter an invalid num i.e. over max_sol
    if(sol > manifest.rover.max_sol){alert("Max sol exceeded: " + manifest.rover.max_sol)}
    else{
        //Clear the Image display and find new images
        document.getElementById("image--container").innerHTML = " "
        picFetch(sol)
    }
}

// Default to max_sol (latest)
async function picFetch(sol = manifest.rover.max_sol){
    document.getElementById("sol--display").innerText = sol

    //Get each of the cameras names on the rover and store in cameraArr
    let cameraArr = []
    manifest.rover.cameras.forEach(camID => {
        cameraArr.push(camID.full_name)
    });

    //Gets images for the selected rover on the selected sol
    try{
        const res2 = await fetch("https://api.nasa.gov/mars-photos/api/v1/rovers/"+ roverPointer +"/photos/?sol=" + sol + "&api_key=qjARvqcicXF8wjhM3emtnFLNBgVNfsU6ydEQsafw")
        //Stores info on the rovers photos - including all srcs
        const roverPhotos = await res2.json()

        //Show the sol day in earth days
        document.getElementById("date--display").innerText = roverPhotos.photos[0].earth_date
        findLatest(roverPhotos.photos, cameraArr)
    }
    catch(e){
        console.log("Error fetching the images of the rover from Nasa. " , e)
    }
};

function findLatest(roverPhotos, cameraArr){
    //Store info on the selected images. nameID, src
    let foundPicObj = {}
    //For each of the cameras that we need pictures for - run through all images stored and check if it was taken by that camera
    cameraArr.forEach(cam => {
        let i = 0
        let picfound = false

        //While there are still images we havent checked, or if we have already got the image from the selected camera
        while((i < roverPhotos.length) && (picfound === false)){
            //if the name ids are the same, then we have a match
            if(roverPhotos[i].camera.full_name === cam){
                //add it to the obj, then cancel the while loop
                foundPicObj[cam] = {nameID: cam, src: roverPhotos[i].img_src}
                picfound = true
            }
            i++
        }
    });
    //We have now checked each camera to see if they have a picture. Display them
    createEle(foundPicObj)
}

//For each of the cameras we got picutres for, create a new img element with the src to show it
function createEle(foundPicObj){
    let cont = document.getElementById("image--container")
    Object.keys(foundPicObj).forEach(key => {
        //Image element consists of a container, image ele, and overlay text
        let imgCont = document.createElement("div")
        imgCont.className = "img--element"
        imgCont.onmouseover = function(){imgClick(this.firstChild.id)}

        let path = foundPicObj[key]
        createImg(key, path.src, imgCont)
        createText(path.nameID, imgCont)

        cont.appendChild(imgCont)
    });
}

//Onclick of a camera image. Sets the POTDslide to the camera src. Also resets timer for the backimg
function imgClick(img){
    clearInterval(timer)
    let imgSrc = document.getElementById(img).src
    backSlide.src = imgSrc
    backSlide.title = "No description"
    startTimer(backImgs.collection, false)
}

//Create the img element and add it to the container. Pass in the Obj Src
function createImg(key, src, imgCont){
    let img = document.createElement("img")

    img.src = src
    img.className = "img--camera"
    img.id = key

    imgCont.appendChild(img)
}

//Create the text element and add it to the container
function createText(id, imgCont){
    let text = document.createElement("p")

    text.innerText = id
    text.className = "img--text"

    imgCont.appendChild(text)
}