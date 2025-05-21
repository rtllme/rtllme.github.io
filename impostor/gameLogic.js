// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD5yMW_YkKI8seU1r503Di7mzmcghneNUs",
    authDomain: "word-impostor-6c242.firebaseapp.com",
    projectId: "word-impostor-6c242",
    storageBucket: "word-impostor-6c242.firebasestorage.app",
    messagingSenderId: "999427570426",
    appId: "1:999427570426:web:54ed41f710070413636743",
    databaseURL: "https://word-impostor-6c242-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();


// Function to get or create a player ID
function getOrCreatePlayerId() {
    let playerId = localStorage.getItem("playerId");
    if (!playerId) {
        playerId = crypto.randomUUID();
        localStorage.setItem("playerId", playerId);
    }
    return playerId;
}

// Initialize player ID and roomCode
let playerId = getOrCreatePlayerId();
let roomCode = null;

// On page load, fetch the room code and data
window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    roomCode = urlParams.get('roomCode');

    if (roomCode) {
        try {
            const snapshot = await database.ref('rooms/' + roomCode).once('value');
            const roomData = snapshot.val();

            if (roomData.host === playerId && roomData.players[playerId].role === 'none') {
                const wordPair = await fetchWordPair();
                assignRoles(wordPair);

                const players = roomData.players;
                const names = Object.values(players).map(player => player.name);

                function shuffle(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                }

                shuffle(names);
                console.log(`The shuffled order is: ${names.join(', ')}`);

                firebase.database().ref('rooms/' + roomCode).update({
                    order: names.join(', ')
                });
            }
        } catch (error) {
            console.error("Error fetching room data:", error);
        }
    }
}

// Fetch a random word pair from JSON file
async function fetchWordPair() {
    try {
        const response = await fetch('lists.json');
        const data = await response.json();
        const randomPair = data[Math.floor(Math.random() * data.length)];
        return randomPair;
    } catch (error) {
        console.error('Error fetching word list:', error);
        return null;
    }
}

// Assign roles to players
function assignRoles(wordPair) {
    const playersRef = database.ref('rooms/' + roomCode + '/players');

    playersRef.once('value').then(snapshot => {
        const players = snapshot.val();
        const playerIds = Object.keys(players);
        const impostorIndex = Math.floor(Math.random() * playerIds.length);
        const impostorId = playerIds[impostorIndex];

        console.log("Impostor ID:", impostorId);

        playerIds.forEach(playerId => {
            const role = (playerId === impostorId) ? 'impostor' : 'crewmate';
            const word = (role === 'impostor') ? wordPair[0] : wordPair[1];

            playersRef.child(playerId).update({
                role: role,
                word: word
            });
        });
    }).catch(error => {
        console.error("Error assigning roles:", error);
    });
}

// Apply impostor styles
function applyImpostorStyle() {
    const card = document.querySelector('.card');
    card.style.backgroundColor = '#1a0000';
    card.style.color = '#ff1a1a';
    card.style.boxShadow = '0 0 30px #ff0000';
    card.style.border = '4px solid #ff1a1a';
    card.style.transition = 'all 0.3s ease-in-out';

    document.body.style.background = `repeating-linear-gradient(
      45deg,
      #1a0000,
      #1a0000 20px,
      #330000 20px,
      #330000 40px
    )`;
    document.body.style.color = '#ffcccc';
    document.body.style.backgroundAttachment = 'fixed';

    const title = document.querySelector('h1');
    if (title) {
        title.style.color = '#ff4d4d';
        title.style.textShadow = '0 0 10px #ff0000';
    }
}

// Apply crewmate styles
function applyCrewmateStyle() {
    const card = document.querySelector('.card');
    card.style.backgroundColor = '#ccf2ff';
    card.style.color = '#1e90ff';
    card.style.boxShadow = '0 0 30px #00bfff';
    card.style.border = '4px solid #00bfff';
    card.style.transition = 'all 0.3s ease-in-out';

    document.body.style.background = `repeating-linear-gradient(
      45deg,
      #ccf2ff,
      #ccf2ff 20px,
      #99ccff 20px,
      #99ccff 40px
    )`;
    document.body.style.color = '#4682b4';
    document.body.style.backgroundAttachment = 'fixed';

    const title = document.querySelector('h1');
    if (title) {
        title.style.color = '#1e90ff';
        title.style.textShadow = '0 0 10px #00bfff';
    }
}

// Reveal word and apply styles
function revealWord() {
    const card = document.querySelector('.card');

    database.ref('rooms/' + roomCode + '/players/' + playerId).once('value').then(snapshot => {
        const playerData = snapshot.val();
        if (playerData) {
            document.getElementById("cardWord").textContent = playerData.word;

            if (playerData.role === 'impostor') {
                applyImpostorStyle();
            } else {
                applyCrewmateStyle();
            }

            setTimeout(() => {
                card.classList.add('fade-out');

                setTimeout(() => {
                    card.style.display = 'none';
                    document.getElementById("title").textContent =
                        `You are the ${playerData.role}, your word is ${playerData.word}`;
                }, 300);
            }, 1000);
        } else {
            console.error("Player data not found.");
        }
    }).catch(error => {
        console.error("Error fetching player data:", error);
    });
}

function deletf() {
    const roomRef = ref(database, `rooms/${roomCode}`);
}