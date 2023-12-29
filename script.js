async function getsongs(){
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index< as.length; index++){
        const element = as[index];
        if (element.href.endsWith(".mp3")){
            songs.push(element.href.split("/127.0.0.1:3000/")[1])
        }
    }
    return songs
}
 
// async function main(){
//     //Get list of all songs
//     let songs = await getsongs()
//     console.log(songs)

//     //Show all the songs in Library
//     let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
//     for (const song of songs){
//         songUL.innerHTML = songUL.innerHTML + `<li>
//         <img class = "invert" src="music.svg" alt="">
//         <div class="info">
//             <div>${song.replaceAll("%20", " ")}</div>
//             <div>Aryan</div>
//         </div>
//         <div class="playnow">
//             <span>Play Now</span>
//             <img class = "invert" src="playm.svg" alt="">
//         </div>
//     </li>`;
//     }  
    
//     //play the first song
//     var audio = new Audio(songs[0])
//     audio.play();
// }    
 
// main() 








async function playSong(songUrl) {
    return new Promise((resolve, reject) => {
        var audio = new Audio(songUrl);
        audio.addEventListener('ended', resolve);
        audio.addEventListener('error', reject);
        audio.play();
    });
}

async function main() {
    // Get list of all songs
    let songs = await getsongs();
    console.log(songs);

    // Show all the songs in Library .replaceAll songs/
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML += `<li>
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ").replaceAll("songs/", "")}</div>
                <div>Aryan</div>
            </div>
            <div class="playnow">
                <span class="play-button" data-song="${song}">Play Now</span>
                <img class="invert play-button" data-song="${song}" src="playm.svg" alt="">
            </div>
        </li>`;
    }

    // Add event listener to each play button
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function () {
            playSong(this.dataset.song);
        });
    });
}

function playSong(songUrl) {
    var audio = new Audio(songUrl);
    audio.play();
}

main();



