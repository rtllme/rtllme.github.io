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
    // Retrieve the player ID from localStorage, or generate a new one if not found
    let playerId = localStorage.getItem("playerId");
    if (!playerId) {
        playerId = crypto.randomUUID(); // Generate a UUID for the player
        localStorage.setItem("playerId", playerId); // Store it in localStorage
    }
    return playerId; // Return the player ID
}

// Initialize player ID and roomCode
let playerId = getOrCreatePlayerId();
let roomCode = null; // Room code will be set after loading the page

// On page load, fetch the room code and data
window.onload = async function() {
    // Get the room code from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    roomCode = urlParams.get('roomCode'); // Retrieve the room code from the URL

    if (roomCode) {
        try {
            const snapshot = await database.ref('rooms/' + roomCode).once('value');
            const roomData = snapshot.val();

            // Check if the player is the host of the room
            if (roomData.host === playerId) {
                const wordPair = await fetchWordPair(); // Fetch the word pair for the game
                assignRoles(wordPair); // Assign roles to players
            }
        } catch (error) {
            console.error("Error fetching room data:", error);
        }
    }
}

// Function to fetch a random word pair from a JSON file
async function fetchWordPair() {
    try {
        const response = await fetch('lists.json'); // Fetch the word list JSON file
        const data = await response.json(); // Parse the JSON data

        // Randomly select a word pair from the list
        const randomPair = data[Math.floor(Math.random() * data.length)];
        return randomPair; // Return the selected word pair
    } catch (error) {
        console.error('Error fetching word list:', error);
        return null; // Return null in case of error
    }
}

// Function to assign roles to players in the room
function assignRoles(wordPair) {
    const playersRef = database.ref('rooms/' + roomCode + '/players');

    playersRef.once('value').then(snapshot => {
        const players = snapshot.val();// Get the list of players in the room
        const playerIds = Object.keys(players); // Get the player IDs

        // Randomly select one player to be the impostor
        const impostorIndex = Math.floor(Math.random() * playerIds.length);
        const impostorId = playerIds[impostorIndex];

        console.log("Impostor ID:", impostorId); // Log the impostor ID for debugging

        // Assign roles to each player
        playerIds.forEach(playerId => {
            // Assign the role of 'impostor' or 'crewmate' based on the random selection
            const role = (playerId === impostorId) ? 'impostor' : 'crewmate';
            const word = (role === 'impostor') ? wordPair[0] : wordPair[1];

            // Update the player's role and word in the database
            playersRef.child(playerId).update({
                role: role,
                word: word
            });
        });
    }).catch(error => {
        console.error("Error assigning roles:", error);
    });
    
}

function revealWord() {
    const card = document.querySelector('.card');

    database.ref('rooms/' + roomCode + '/players/' + playerId).once('value').then(snapshot => {
        const playerData = snapshot.val();
        if (playerData) {
            document.getElementById("cardWord").textContent = playerData.word;

            // Apply impostor styling if the player is the impostor
            if (playerData.role === 'impostor') {
                card.style.backgroundColor = '#300000';       // dark red/black tone
                card.style.color = '#ff4c4c';                 // bright evil red
                card.style.boxShadow = '0 0 30px #ff0000';    // glowing red effect
                card.style.border = '3px solid #900';
                card.style.transition = 'all 0.3s ease-in-out';
            }

            // Add a delay before fading out
            setTimeout(() => {
                card.classList.add('fade-out');

                // Hide the card entirely after the animation
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300); // Time for the fade-out animation to finish
            }, 1000); // Delay before fade-out starts
        } else {
            console.error("Player data not found.");
        }
    }).catch(error => {
        console.error("Error fetching player data:", error);
    });
}
