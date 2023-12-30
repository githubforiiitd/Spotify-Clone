
//Song currently playing 
let currentsong = new Audio();
let songs;
let currfolder;
let folders;

async function getsongs(folder){
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${currfolder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index< as.length; index++){
        const element = as[index];
        if (element.href.endsWith(".mp3")){
            songs.push(element.href.split(`http://127.0.0.1:3000/${currfolder}/`)[1])
        }
    }
    return songs
}

//get folders from songs
async function getfolders(folderr){

    let a = await fetch(`http://127.0.0.1:3000/${folderr}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let folders = [];

    // Iterate through anchor elements and filter folders
    for (let index = 1; index < as.length; index++) {
        const element = as[index];
        // Check if the element is a folder (you may need to adjust this condition based on your folder structure)
        if (element.href.endsWith("/")) {
            folders.push(element.href.split(`/127.0.0.1:3000/${folderr}/`)[1]);
        }
    }

    // Return the array of folder names
    return folders;
}


playmusic = (track) =>{
    currentsong.src = "songs/" + track.replaceAll("%20"," ");
    currentsong.play();
    play.src = "pause.svg";
    document.querySelector(".songinfo").innerHTML = track.replaceAll(`${currfolder}/`, "").replaceAll("%20"," ").replaceAll(".mp3","");
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return formattedMinutes + ":" + formattedSeconds;
}
 

const playPause = () => {
    if (!(currentsong == null)) {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg";
        } else {
            currentsong.pause();
            play.src = "playm.svg";
        }
    }
    else{
    }
};


async function main(){

    let lastvol = currentsong.volume;

    let isMuted = false;

    // Get list of all folders
    folders = await getfolders("songs");




    //Show folder in songs as card 
    let cardUL = document.querySelector(".card-container");
    let io = 0;
    for (const folder of folders){
        cardUL.innerHTML = cardUL.innerHTML + 
        `<div class = "card">
            <img id="${io}" class = "playy" src="green-playbutton.svg" alt="">
            <img src= "/songs/${folder}cover.jpeg" alt="">
            <h2>${folder.replaceAll("%20"," ").replaceAll("/",'')}</h2>
        </div>`;
        io++;
    }



    

    //Volumebar mute when clicked
    volumeee.addEventListener("click", () => {
        if (isMuted) {
            // Unmute
            currentsong.volume = lastvol;
            volumeee.src = "lowvolume.svg"
            isMuted = false;
            document.querySelector(".circle").style.left = lastvol*100 +"%";
            document.querySelector(".volume-progress-bar").style.width = lastvol*100 +"%";
        } else {
            // Mute
            lastvol = currentsong.volume;
            currentsong.volume = 0.0;
            volumeee.src = "mute.svg"
            isMuted = true;
            document.querySelector(".circle").style.left = 0 +"%";
            document.querySelector(".volume-progress-bar").style.width = 0 +"%";
        }
    });



    //play pause
    play.addEventListener("click", playPause);

    document.addEventListener("keydown", (event) => {
        // Check if the pressed key is the spacebar (keyCode 32 or key " ")
        if (event.keyCode === 32 || event.key === " ") {
            event.preventDefault(); // Prevent the default behavior of the spacebar (e.g., scrolling the page)
    
            // Call the playPause function for spacebar press
            playPause();
        }
    });



    //Listen for timeupdate event
    currentsong.addEventListener("timeupdate",()=>{
        
        const currentTime = formatTime(currentsong.currentTime);
        const totalDuration = isNaN(currentsong.duration) ? "00:00" : formatTime(currentsong.duration);

        //Song duration and current time 
        document.querySelector(".songtime").innerHTML = currentTime + " / " + totalDuration;

        //playbar move
        document.querySelector(".circlee").style.left = (currentsong.currentTime / currentsong.duration)*100 + "%";
        document.querySelector(".progress-bar").style.width = (currentsong.currentTime / currentsong.duration)*100 + "%";

    })



    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        //637
        const clickPosition = e.offsetX;
        const percentageClicked = (clickPosition / 637) * 100;
    
        const newTime = (percentageClicked / 100) * currentsong.duration;
        if (!isNaN(newTime) && isFinite(newTime)) {
            currentsong.currentTime = newTime;
        }
        document.querySelector(".progress-bar").style.width = "percentageClicked%";
    })



    //sets initial positions of volumebar
    document.querySelector(".circle").style.left = currentsong.volume*100 +"%";
    document.querySelector(".volume-progress-bar").style.width = currentsong.volume*100 +"%";
    //seek Volume 
    document.querySelector(".volumee").addEventListener("click", e=>{
        //154
        clickPositionv = e.offsetX;
        percentageClickedv = (clickPositionv / 154) * 100;
    
        newVolume = (percentageClickedv / 100);
        currentsong.volume = newVolume;
        document.querySelector(".volume-progress-bar").style.width = percentageClickedv + "%";
        document.querySelector(".circle").style.left = percentageClickedv + "%";
    })





    //event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    });
    //event listener for cross
    document.querySelector(".cross").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%";
    });



    // event listener for previous song
    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if(index==0){
            currentsong.src = `${currfolder}/` + songs[index];
            playmusic(`${currfolder}/` + songs[index]);
        }
        else{
            currentsong.src = `${currfolder}/` + songs[index-1];
            playmusic(`${currfolder}/` + songs[index-1]);
        }
    })


    // event listener for next song
    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if(index==(songs.length)-1){
        }
        else{
            currentsong.src = `${currfolder}/` + songs[index+1];
            playmusic(`${currfolder}/` + songs[index+1]);
        }
    })

 


    document.body.addEventListener("click", async (event) => {
        if (event.target.classList.contains("playy")) {
            const playyId = event.target.getAttribute("id");
            songs=[];
            songs = await getsongs("songs/" + folders[playyId].slice(0, -1));
            currfolder = folders[playyId].slice(0, -1);
            // Show all the songs in Library
            let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
            songUL.innerHTML = "";
            for (const song of songs){
                songUL.innerHTML = songUL.innerHTML + 
                `<li>
                    <img class = "invert" src="music.svg" alt="">
                    <div class="info">
                        <div>${song.replaceAll("%20", " ").replaceAll(".mp3","")}</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img class = "playhover" src="play.svg" alt="">
                    </div>
                </li>`;
            } 
        }
    });




    document.querySelector(".songlist").addEventListener("click", (event) => {
        const clickedElement = event.target.closest("li");
        if (clickedElement) {
            // Handle the click on the list item
            const songName = clickedElement.querySelector(".info").firstElementChild.innerHTML;
            playmusic(`${currfolder}/${songName}` + ".mp3");
        }
    });
}    
main() 







