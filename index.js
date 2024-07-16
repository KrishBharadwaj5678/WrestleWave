let start=document.querySelector("button.start-game");
const audio = document.getElementById('audio');
const playPauseButton = document.querySelector('.play-pause');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');
const audioplayer = document.querySelector('div.audio-player');
const game_parent = document.querySelector('div.game-parent');
const search_player_name = document.querySelector('div.input-box');
const submit_player = document.querySelector('button.submit');
const user_input = document.querySelector('input.game_input');
const show_score = document.querySelector('p.score');
const show_hint = document.querySelector('p.remaining_hint');
const hint_selected = document.querySelector('button.hint');
const winner = document.querySelector('h3.winning');
const general_instructions = document.querySelector('button.btn-info');
t=gsap.timeline();

t.from("h2.header", {
    opacity:0,
    duration:1,
    y:-20
});

t.to("p.sub-head", {
    text: "Can you guess the WWE superstar just by their theme music?",
    duration:3,
    ease: "power4.out",
});


t.from("button.btn-info,button.start-game",{
    opacity:0,
    duration:1,
    stagger:0.4,
    y:-20
})

t.to("button.start-game",{
    repeat:-1,
    y: 3,
    yoyo:true
})

let value=0,score=0,playername=null,hint=5,setColor="white";

let bonusAudio=new Audio();
bonusAudio.src="bonus.wav";

let victory=new Audio();
victory.src="victory.wav";

let lose=new Audio();
lose.src="lose.wav";

let instructions=new Audio();
instructions.src="instructions.mp3";

let usehint=new Audio();
usehint.src="hint.wav";

let play_game=new Audio();
play_game.src="play_game.mp3";

general_instructions.addEventListener("click",()=>{
    instructions.play();
})

let arr=[];

for(let i=0;81>i;i++){
    arr.push(i);
}

function fisherYatesShuffle(array) {
    let n = array.length;
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let shuffledArray = fisherYatesShuffle(arr);

async function getPlayer(){
    let url=await fetch("music.json");
    let data=await url.json();
    try{
        playername=data[shuffledArray[value]].name;
        audio.src="Entrances/"+data[shuffledArray[value]].musicSrc;
        value++;
    }
    catch{
        victory.play();
        submit_player.disabled=true;
        winner.style.display="block";
        const end = Date.now() + 15 * 1000;
        const colors = ["#bb0000", "#ffffff"];

        (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
        });

        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
        })();
    }
}
getPlayer()

// Hint Button
hint_selected.addEventListener("click",()=>{
    if(hint!=0){
        usehint.play();
        --hint;
        show_hint.innerText=`Hints: ${hint}`;
        user_input.value=`${playername}`;
    }
    else{
    }
})

// Start Game Button
start.addEventListener("click",()=>{
    instructions.src="";
    play_game.play();
    start.style.display="none";
    game_parent.style.display="block";
})

// Submit Button
submit_player.addEventListener("click",()=>{
    let userdata=user_input.value.toLowerCase();
   
    if(userdata==playername){
        bonusAudio.play();
        getPlayer();
        score+=5;
        user_input.value='';
        if(score>=0){
            setColor="#33d439";
        }else if(score==0){
            setColor="white";
        }
        show_score.innerHTML=`Score: <span style='color:${setColor};'>${score}</span>`;
        progress.style.width="0%";
        audio.pause();
        playPauseButton.textContent = 'Play';
    }
    else if(userdata!=playername){
        lose.play();
        score-=2;
        if(score<0){
            setColor="#f73d1b";
        }else if(score==0){
            setColor="white";
        }
        show_score.innerHTML=`Score: <span style='color:${setColor};'>${score}</span>`;
    }
})

// Audio Bar
playPauseButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseButton.textContent = 'Pause';
    } else {
        audio.pause();
        playPauseButton.textContent = 'Play';
    }
})
audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    progress.style.borderRadius=`20vw`;
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`
    if (!isNaN(duration)) {
        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = Math.floor(duration % 60);
        durationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    }
})
progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});