

let folderName = "f3";

let mySongsMain = {
    f1: ["Chana MereYa.mp3", "bulley.mp3"],
    f2: ["Dil meri na sune.mp3", "One Direction night changes.mp3", "tere fittor.mp3"],
    f3: ["A dil he mushkil.mp3", "Ankho me teri Ajab si .mp3", "Apan Her Din Aise Jiyo.mp3", "Dekha Hajaro Dafa.mp3", "Ye Tune Kay Kiya.mp3"]
};

let myFolderMain = ["f1", "f2", "f3"];

function fetchSongs(folderN) {

    let sn = getSongs(folderN);

    let temp = Array.from(sn).map(name => ({
        name: name,
        src: `songs/${folderN}/${name}`
    }));

    console.log(temp);

    return temp;

}

function getSongs(folderN) {
    folderName = folderN;

    let songs = [];



    for (i = 0; i < mySongsMain[`${folderN}`].length; i++) {
        songs.push(mySongsMain[`${folderN}`][i]);

    }
    console.log(songs);


    return songs;
}


let currentSong = new Audio();

function playSong(name) {
    currentSong.pause();

    currentSong.src = `songs/${folderName}/${name}`


    // document.querySelector("#play").src = "/MySvgs/pauseButton.svg";
    document.querySelector("#play").src = "MySvgs/pauseButton.svg";
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
            icon.src = "MySvgs/volume.svg";
            currentSong.volume = 0.3;
            vol.value = 30;

        }
        else {
            icon.src = "MySvgs/mute.svg";
            currentSong.volume = 0;
            vol.value = 0;

        }




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
let mySongsObj = []

async function main(folderN) {
    let songs = getSongs(folderN);

    mySongs = songs;

    mySongsObj = fetchSongs(folderN);

    let playlist = document.querySelector(".myPlaylist").getElementsByTagName("ul")[0];
    playlist.innerHTML = "";

    for await (const song of songs) {

        playlist.innerHTML += `
            <li>
                <div class="info">
                    <img src="MySvgs/musicIcon.svg" alt="">
                    <span>${song}</span>
                </div>
                <div>
                    <span>play now</span>
                    <img src="MySvgs/playIcon.svg" alt="">
                </div>    
            </li>`;
    }


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


    document.querySelector("#play").onclick = () => {
        if (currentSong.paused) {
            currentSong.play();
            document.querySelector("#play").src = "MySvgs/pauseButton.svg?v=" + Date.now();
        } else {
            currentSong.pause();
            document.querySelector("#play").src = "MySvgs/playButton.svg?v=" + Date.now();
        }
    };



    document.querySelector("#prev").onclick = () => {

        if (currentSong) {
            let sr = currentSong.src.split("songs")[1].split("/")[2].split("%20").join(" ").trim();
            let i = 0;
            for (; i < mySongsObj.length; i++) {
                if (sr == mySongsObj[i].name)
                    break;
            }


            if (i - 1 >= 0) {
                playSong(mySongsObj[i - 1].name);
            } else {
                playSong(mySongsObj[0].name);
            }
        }
    };

    document.querySelector("#next").onclick = () => {

        if (currentSong) {

            let sr = currentSong.src.split("songs")[1].split("/")[2].split("%20").join(" ").trim();
            let i = 0;
            for (; i < mySongsObj.length; i++) {
                if (sr == mySongsObj[i].name)
                    break;
            }


            if (i + 1 < mySongsObj.length) {
                playSong(mySongsObj[i + 1].name);
            } else {
                playSong(mySongsObj[0].name);
            }
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


    let fold = myFolderMain;

    let ele = document.querySelector(".cardContainer");
    ele.innerHTML = "";

    for (i = 0; i < fold.length; i++) {
        let myJsn = await fetch(`songs/${fold[i]}/info.json`);

        let a = await myJsn.json();
        console.log(a);


        ele.innerHTML = ele.innerHTML + `<div class="card1" data-folder = ${fold[i]} >
            <img src="songs/${fold[i]}/cover.jpg" alt="">
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



