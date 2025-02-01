const token = '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';

let folderName = "f3";

async function fetchSongs(folderN) {
    try {

        let response = await fetch(`https://api.github.com/repos/sagarnage884/SpotifyClone/contents/songs/${folderN}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        let data = await response.json();


        let songs = data.filter(item => item.type === "file" && item.name.endsWith('.mp3'))
            .map(item => ({
                name: item.name,

                src: `https://raw.githubusercontent.com/sagarnage884/SpotifyClone/main/${item.path}`
            }));

        return songs;


    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

async function getSongs(folderN) {
    folderName = folderN;

    let response = await fetch(`https://api.github.com/repos/sagarnage884/SpotifyClone/contents/songs/${folderN}`, {
        headers: {
            'Authorization': `token ${token}`
        }
    });

    let data = await response.json();

    let names = data.map(item => item.name);



    let songs = [];

    for (i = 0; i < names.length; i++) {
        if (names[i].includes(".mp3"))
            songs.push(names[i]);
    }
    console.log(songs);


    return songs;
}


let currentSong = new Audio();

function playSong(name) {
    currentSong.pause();
    // 'https://raw.githubusercontent.com/sagarnage884/SpotifyClone/main/songs/f1/bulley.mp3'

    currentSong.src = `https://raw.githubusercontent.com/sagarnage884/SpotifyClone/main/songs/${folderName}/` + name;

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
    let songs = await getSongs(folderN);

    mySongs = songs;

    mySongsObj = await fetchSongs(folderN);

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
            document.querySelector("#play").src = "Mysvgs/pauseButton.svg";
        } else {
            currentSong.pause();
            document.querySelector("#play").src = "Mysvgs/playButton.svg";
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

    let temp = document.createElement("div");


    await fetch("https://api.github.com/repos/sagarnage884/SpotifyClone/contents/songs", {
        headers: {
            'Authorization': `token ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            let textData = data.map(file => file.name).join("\n");
            temp.textContent = textData;
        })
        .catch(error => console.error("Error:", error));

    let s = temp.textContent

    let name = s.split("\n");
    let fold = [];

    Array.from(name).forEach((e) => {
        if (!e.includes(".md"))
            fold.push(e);
    }

    )

    let ele = document.querySelector(".cardContainer");
    ele.innerHTML = "";

    for (i = 0; i < fold.length; i++) {
        let myJsn;


        await fetch("https://api.github.com/repos/sagarnage884/SpotifyClone/contents/songs/f1/info.json", {
            headers: {
                'Authorization': `token ${token}`
            }
        })
            .then(response => response.json()) // Convert response to JSON
            .then(data => {
                const jsonContent = atob(data.content); // Decode Base64 content
                myJsn = JSON.parse(jsonContent);

            })
            .catch(error => console.error("Error:", error));


        let a = myJsn;

        ele.innerHTML = ele.innerHTML + `<div class="card1" data-folder = ${fold[i]} >
            <img src="https://raw.githubusercontent.com/sagarnage884/SpotifyClone/main/songs/${fold[i]}/cover.jpg" alt="">
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



