// Function to get or create a player ID
function getOrCreatePlayerId() {
  // Try to retrieve the player ID from localStorage
  let playerId = localStorage.getItem("playerId");

  // If no player ID is found, create a new one and store it
  if (!playerId) {
    playerId = crypto.randomUUID(); // Generate a UUID for the player
    localStorage.setItem("playerId", playerId); // Store it in localStorage
  }

  return playerId; // Return the player ID
}

// Initialize player ID
const playerId = getOrCreatePlayerId();
let playerName = ""; // Placeholder for player name
console.log(playerId); // Log the player ID for debugging

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

// Function to generate a random 4-character room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase(); // Generate and return a room code
}

// Function to create a new room
function createRoom() {
  const playerNameInput = document.getElementById("playerName");
  playerName = playerNameInput?.value?.trim(); // Get the player name from the input field

  // Ensure the player has entered a valid name
  if (!playerName) return alert("Enter a name");

  const roomCode = generateRoomCode(); // Generate a random room code
  console.log("Creating room:", roomCode); // Log the room creation for debugging

  // Create a new room in the Firebase database
  database.ref('rooms/' + roomCode).set({
    host: playerId, // Set the host as the player creating the room
    status: "waiting", // Set the room status to "waiting"
    players: {
      [playerId]: {
        name: playerName,
        word: "####" // Placeholder for the word
      } // Add the creator as a player
    }
  })
  .then(() => {
    // After room creation, redirect the player to the lobby
    JoinLobby(roomCode);
  })
  .catch(error => {
    console.error("Error creating room:", error);
    alert("An error occurred while creating the room.");
  });
}

// Function to join an existing room
function joinRoom() {
  const playerNameInput = document.getElementById("playerName");
  let playerName = playerNameInput?.value?.trim(); // Get the player name from the input field

  // Ensure the player has entered a valid name
  if (!playerName) {
    return alert("Please enter a name");
  }

  // Get the room code from the input field
  const roomCode = document.getElementById("roomCodeInput").value.trim().toUpperCase();

  // Check if the room exists and if the game has already started
  firebase.database().ref('rooms/' + roomCode + '/status').once('value').then(snapshot => {
    const roomStatus = snapshot.val();

    // If the game has started, prevent joining
    if (roomStatus === "started") {
      return alert("The game has already started. You cannot join.");
    }

    // If the game hasn't started, proceed with adding the player to the room
    const playerId = getOrCreatePlayerId();  // Retrieve or generate a new player ID

    firebase.database().ref('rooms/' + roomCode + '/players').update({
      [playerId]: {
        name: playerName,
        word: '####'  // Placeholder for the word
      }
    })
    .then(() => {
      // After adding the player to the room, redirect to the lobby
      JoinLobby(roomCode);
    })
    .catch(error => {
      console.error("Error updating player in room:", error);
      alert("An error occurred. Please try again.");
    });
  }).catch(error => {
    console.error("Error checking room status:", error);
    alert("Error checking room status. Please try again.");
  });
}

// Function to redirect to the lobby page
function JoinLobby(roomCode) {
  window.location.replace("Lobby.html?roomCode=" + roomCode);

  // Update the room code display once the page has loaded
  window.onload = function() {
    document.getElementById("roomCodeDisplay").textContent = roomCode;
  };
}
