const hiragana = {
    base: {
        a: "あ",
        i: "い",
        u: "う",
        e: "え",
        o: "お"
    },
    k: {
        ka: "か",
        ki: "き",
        ku: "く",
        ke: "け",
        ko: "こ",
        ga: "が", // Tenten version of 'ka'
        gi: "ぎ", // Tenten version of 'ki'
        gu: "ぐ", // Tenten version of 'ku'
        ge: "げ", // Tenten version of 'ke'
        go: "ご"  // Tenten version of 'ko'
    },
    s: {
        sa: "さ",
        shi: "し",
        su: "す",
        se: "せ",
        so: "そ",
        za: "ざ", // Tenten version of 'sa'
        ji: "じ", // Tenten version of 'shi'
        zu: "ず", // Tenten version of 'su'
        ze: "ぜ", // Tenten version of 'se'
        zo: "ぞ"  // Tenten version of 'so'
    },
    t: {
        ta: "た",
        chi: "ち",
        tsu: "つ",
        te: "て",
        to: "と",
        da: "だ", // Tenten version of 'ta'
        ji: "ぢ", // Tenten version of 'chi'
        zu: "づ", // Tenten version of 'tsu'
        de: "で", // Tenten version of 'te'
        do: "ど"  // Tenten version of 'to'
    },
    n: {
        na: "な",
        ni: "に",
        nu: "ぬ",
        ne: "ね",
        no: "の",
        n: "ん"  // Nasal sound (no tenten)
    },
    h: {
        ha: "は",
        hi: "ひ",
        fu: "ふ",
        he: "へ",
        ho: "ほ",
        ba: "ば", // Tenten version of 'ha'
        bi: "び", // Tenten version of 'hi'
        bu: "ぶ", // Tenten version of 'fu'
        be: "べ", // Tenten version of 'he'
        bo: "ぼ", // Tenten version of 'ho'
        pa: "ぱ", // Handakuten version of 'ha'
        pi: "ぴ", // Handakuten version of 'hi'
        pu: "ぷ", // Handakuten version of 'fu'
        pe: "ぺ", // Handakuten version of 'he'
        po: "ぽ"  // Handakuten version of 'ho'
    },
    m: {
        ma: "ま",
        mi: "み",
        mu: "む",
        me: "め",
        mo: "も"
    },
    y: {
        ya: "や",
        yu: "ゆ",
        yo: "よ"
    },
    r: {
        ra: "ら",
        ri: "り",
        ru: "る",
        re: "れ",
        ro: "ろ"
    },
    w: {
        wa: "わ",
        wo: "を" // Particle
    }
};

let selectedHiraganas = [];

// Function to handle checkbox selections and store corresponding Hiragana
function getCheckedCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    selectedHiraganas = []; // Reset the list on every update

    checkboxes.forEach(checkbox => {
        const group = checkbox.value; // Get the group value (like 'k', 's', 'base')

        if (hiragana[group]) {
            // Iterate over all sounds in that group and add them to the selected list
            for (const sound in hiragana[group]) {
                selectedHiraganas.push(hiragana[group][sound]); // Add sound's hiragana
            }
        }
    });
    createPageContent();
    hiraganaRandom();
}

function createPageContent() {
    // Clear the current page content
    document.body.innerHTML = '';

    // Create and append the header
    const header = document.createElement('header');

    // Create and append the title "HIRAGANA"
    const h1Header = document.createElement('h1');
    h1Header.textContent = 'HIRAGANA';
    h1Header.classList.add('main');
    h1Header.onclick = () => { window.location.href = "index.html"; }; // Correct way to set onclick for navigation
    header.appendChild(h1Header);

    // Append the header to the body
    document.body.appendChild(header);

    // Create and append the "Answer" placeholder
    const h1Answer = document.createElement('h1');
    h1Answer.id = 'Answer';
    h1Answer.className = 'hide';
    document.body.appendChild(h1Answer);

    // Create and append the "Hiragana Test" placeholder
    const h1HiraganaTest = document.createElement('h1');
    h1HiraganaTest.id = 'hiraganaTest';
    document.body.appendChild(h1HiraganaTest);

    // Create and append the "Start Test" button
    const startTestButton = document.createElement('button');
    startTestButton.textContent = 'Roll';
    startTestButton.onclick = function () {
        hiraganaRandom();  // Assuming this function is defined elsewhere
    };
    document.body.appendChild(startTestButton);
}



// Function to get a random item from a list
function getRandomItem(list) {
    const randomIndex = Math.floor(Math.random() * list.length); // Get a random index
    return list[randomIndex]; // Return the item at the random index
}

// Function to display a random Hiragana character
function hiraganaRandom() {
    if (selectedHiraganas.length > 0) {
        const randomHiragana = getRandomItem(selectedHiraganas);
        let sound = "";

        // Loop through the groups to find the matching sound for the random Hiragana
        for (const group in hiragana) {
            for (const key in hiragana[group]) {
                if (hiragana[group][key] === randomHiragana) {
                    sound = key; // Get the corresponding sound (like "ka", "shi", etc.)
                    break;
                }
            }
        }

        // Display both the Hiragana and the sound
        document.getElementById("hiraganaTest").textContent = `Hiragana: ${randomHiragana}`;
        document.getElementById("Answer").textContent = `Sound: ${sound}`;
    } else {
        document.getElementById("hiraganaTest").textContent = "Please select a group first.";
    }
}
// Function to get a random item from all Hiragana groups
function getRandomHiraganaFromAll() {
    const allHiraganas = []; // Initialize an empty array to hold all Hiragana characters

    // Loop through each group in the hiragana object
    for (const group in hiragana) {
        for (const key in hiragana[group]) {
            allHiraganas.push(hiragana[group][key]); // Add each Hiragana character to the array
        }
    }

    // Pick a random item from the combined array of all Hiragana
    const randomIndex = Math.floor(Math.random() * allHiraganas.length);
    return allHiraganas[randomIndex];
}

// Example usage to display a random Hiragana and its sound
function hiraganaRandom2() {
    const randomHiragana = getRandomHiraganaFromAll();
    let sound = "";

    // Find the corresponding sound for the random Hiragana
    for (const group in hiragana) {
        for (const key in hiragana[group]) {
            if (hiragana[group][key] === randomHiragana) {
                sound = key; // Get the sound for the matching Hiragana
                break;
            }
        }
    }

    // Display both the Hiragana and its sound
    document.getElementById("hiraganaT").textContent = `Hiragana: ${randomHiragana} | Sound: ${sound}`;
}

// Function to convert sound to Hiragana
function soundToHiragana() {
    const sound = document.getElementById("soundInput").value.toLowerCase(); // Get input and make it lowercase
    let foundHiragana = null;

    // Loop through all groups and all sounds in the hiragana object
    for (const group in hiragana) {
        if (hiragana[group][sound]) {
            foundHiragana = hiragana[group][sound];
            break;  // Stop once we find the matching sound
        }
    }

    // If a Hiragana is found, display it
    if (foundHiragana) {
        document.getElementById("hiraganaEqui").textContent = foundHiragana;
    } else {
        document.getElementById("hiraganaEqui").textContent = "Sound not found!";
    }
}
