

let folderName = "f3";

async function getSongs(folderN) {
    folderName = folderN;
    let link = `/songs/${folderName}/`;
    let respones = await fetch(link);


    let myHtml = await respones.text();


    let myEle = document.createElement("div");

    myEle.innerHTML = myHtml;

    let songsArray = myEle.getElementsByTagName("a");

    let songs = [];

    for (i = 0; i < songsArray.length; i++) {
        if (songsArray[i].href.endsWith(".mp3"))
            songs.push(songsArray[i].href);
    }

    return songs;
}







let currentSong = new Audio();

function playSong(name) {
    currentSong.pause();

    currentSong.src = `/songs/${folderName}/` + name;

    document.querySelector("#play").src = "Mysvgs/pauseButton.svg";
    document.querySelector(".songName").innerHTML = `${name}`;
    document.querySelector("#tm").innerHTML = `00:00 / 00:00`;

    currentSong.addEventListener("loadeddata", () => {
        currentSong.play().catch((error) => {
            console.error("Error playing the audio:", error);
        });
    });

    showTime(currentSong);

    let vol = document.querySelector(".volumeTracker").children[1];
    vol.addEventListener("input", (e) => {
        currentSong.volume = parseFloat(vol.value / 100).toFixed(2);
    });

    let icon = document.querySelector(".volumeTracker").children[0];
    icon.addEventListener("click", (e) => {
        if (currentSong.volume == 0) {
            icon.src = "Mysvgs/volume.svg";
            currentSong.volume = 0.3;
            vol.value = 30;

        }
        else {
            icon.src = "Mysvgs/mute.svg";
            currentSong.volume = 0;
            vol.value = 0;

        }
        console.log("Hello");

    })
}



function toMinutes(sec) {
    return String(parseInt(sec / 60)).padStart(2, "0")
}

function toSeconds(sec) {
    return String(Math.floor(sec) % 60).padStart(2, "0");
}

function formatTime(sec) {
    return `${toMinutes(sec)}:${toSeconds(sec)}`;
}

function getPercentage(val, total) {
    if (total === 0) {
        return 0;
    }
    return ((val / total) * 100).toFixed(2);
}


function showTime(song) {
    let songLength;
    song.addEventListener("loadeddata", (e) => {

        songLength = formatTime(song.duration);
    })

    let currentDuration;



    let temp = document.querySelector("#tm");

    let gola = document.querySelector(".circle");

    song.addEventListener("timeupdate", () => {
        currentDuration = formatTime(song.currentTime);

        temp.innerHTML = currentDuration + " / " + songLength;

        gola.style.left = `${getPercentage(song.currentTime, song.duration)}%`;


    });

    let seekBar = document.querySelector(".seekBar");

    seekBar.addEventListener("click", (e) => {
        let clickPosition = e.offsetX;
        let totalLenght = seekBar.offsetWidth;

        gola.style.left = `${getPercentage(clickPosition, totalLenght)}%`;

        song.currentTime = parseFloat(getPercentage(clickPosition, totalLenght) / 100) * song.duration;

    });

    let isMouseDragging = false;

    seekBar.addEventListener("mousedown", (e) => {
        isMouseDragging = true;
    });

    seekBar.addEventListener("mouseup", (e) => {
        isMouseDragging = false;
    });

    seekBar.addEventListener("mouseleave", (e) => {
        isMouseDragging = false;
    });

    seekBar.addEventListener("mousemove", (e) => {
        if (isMouseDragging) {
            e.preventDefault();
            let clickPosition = e.offsetX;
            let totalLenght = seekBar.offsetWidth;

            let rect = seekBar.getBoundingClientRect();
            let x = e.clientX - rect.left;

            gola.style.left = `${getPercentage(clickPosition, totalLenght)}%`;

            song.currentTime = parseFloat(getPercentage(clickPosition, totalLenght) / 100) * song.duration;


            gola.style.left = `${getPercentage(x, rect.width)}%`;

        }
    });



}


let mySongs = []


async function main(folderN) {
    let songs = await getSongs(folderN);
    mySongs = songs;


    let playlist = document.querySelector(".myPlaylist").getElementsByTagName("ul")[0];
    playlist.innerHTML = "";

    for await (const song of songs) {
        let name = song.split(`/${folderName}/`)[1];
        name = name.split("%20").join(" ");
        playlist.innerHTML += `
            <li>
                <div class="info">
                    <img src="MySvgs/musicIcon.svg" alt="">
                    <span>${name}</span>
                </div>
                <div>
                    <span>play now</span>
                    <img src="MySvgs/playIcon.svg" alt="">
                </div>    
            </li>`;
    }

    // Add event listeners for playlist items
    let songNames = Array.from(document.querySelector(".myPlaylist").getElementsByTagName("li"));
    songNames.forEach((element) => {
        let name = element.querySelector(".info").children[1];
        element.addEventListener("click", () => {
            playSong(name.innerHTML.trim());
        });
    });


    const bringLeftButton = document.querySelector(".bringLeft");
    const leftElement = document.querySelector(".left");


    if (bringLeftButton && leftElement) {
        bringLeftButton.addEventListener("click", (e) => {
            leftElement.style.left = "1%";
            document.querySelector(".right").style.filter = "blur(20px)"


        });
    }

    const cross = document.querySelector(".crossButton");

    if (cross) {
        cross.addEventListener("click", (e) => {

            if (leftElement) {

                leftElement.style.left = "-100%";
                document.querySelector(".right").style.filter = "blur(0px)"

            }

        });
    }

    // Reset and attach new event listeners for control buttons
    document.querySelector("#play").onclick = () => {
        if (currentSong.paused) {
            currentSong.play();
            document.querySelector("#play").src = "Mysvgs/pauseButton.svg";
        } else {
            currentSong.pause();
            document.querySelector("#play").src = "Mysvgs/playButton.svg";
        }
    };

    document.querySelector("#prev").onclick = () => {
        let i = mySongs.indexOf(currentSong.src);
        if (i - 1 >= 0) {
            playSong(mySongs[i - 1].split(`/${folderName}/`)[1].split("%20").join(" ").trim());
        } else {
            playSong(mySongs[0].split(`/${folderName}/`)[1].split("%20").join(" ").trim());
        }
    };

    document.querySelector("#next").onclick = () => {
        let i = mySongs.indexOf(currentSong.src);
        if (i + 1 < mySongs.length) {
            playSong(mySongs[i + 1].split(`/${folderName}/`)[1].split("%20").join(" ").trim());
        } else {
            playSong(mySongs[0].split(`/${folderName}/`)[1].split("%20").join(" ").trim());
        }
    };
}

main("f3");

async function loadPlaylists() {

    let container = document.querySelector(".cardContainer").children;

    Array.from(container).forEach((e) => {


        e.addEventListener("click", async (item) => {
            let folderN = item.currentTarget.dataset.folder;

            await main(folderN);

        })





    })
        ;
}


async function displayPlaylist(params) {

    let temp = await fetch(`/songs/`);
    let text = await temp.text();
    let a = document.createElement("div");
    a.innerHTML = text;

    let names = a.getElementsByTagName("a");
    let fold = []
    Array.from(names).forEach((e) => {

        if (e.href.split("/songs/")[1])
            fold.push(e.href.split("/songs/")[1].split("/")[0]);


    });

    let ele = document.querySelector(".cardContainer");
    ele.innerHTML = "";

    for (i = 0; i < fold.length; i++) {
        let myJsn = await fetch(`/songs/${fold[i]}/info.json`);
        let a = await myJsn.json();
        ele.innerHTML = ele.innerHTML + `<div class="card1" data-folder = ${fold[i]} >
            <img src="/songs/${fold[i]}/cover.jpg" alt="">
            <h2>${a.title}</h2>
            <P>${a.description}</P>
            <div class="playButton">
            <svg class="circular-play-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <!-- Outer Circle -->
            <circle cx="256" cy="256" r="256" />
            <!-- Inner Black Triangle (Play Button) -->
            <polygon points="200,150 200,362 362,256" />
            </svg>
            </div>
            </div>`

    }


    loadPlaylists();
}
displayPlaylist();
loadPlaylists();



