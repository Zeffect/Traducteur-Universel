document.getElementById('translateButton').addEventListener('click', translateText);
document.getElementById('copyButton').addEventListener('click', copyText);

function translateText() {
    const inputText = document.getElementById('inputText').value;
    const translationType = document.getElementById('translationType').value;
    let outputText = '';

    if (inputText.trim() === '') {
        document.getElementById('errorMessage').textContent = "Veuillez entrer du texte à traduire.";
        return;
    }

    document.getElementById('errorMessage').textContent = "";

    let detectedType;
    if (/^[01\s]+$/.test(inputText)) {
        detectedType = 'binary';
    } else if (/^[.\-\s/]+$/.test(inputText)) {
        detectedType = 'morse';
    } else if (/^[\da-fA-F\s]+$/.test(inputText)) {
        detectedType = 'hex';
    } else {
        detectedType = 'text'; // Langage texte par défaut
    }

    if (translationType === 'original') {
        // Traduction en mots courants si l'option "Original" est sélectionnée
        switch (detectedType) {
            case 'binary':
                outputText = binaryToText(inputText);
                break;
            case 'morse':
                outputText = morseToText(inputText);
                break;
            case 'hex':
                outputText = hexToText(inputText);
                break;
            default:
                outputText = inputText; // Aucune traduction nécessaire pour le texte brut
        }
    } else {
        // Traduction selon l'option sélectionnée
        switch (translationType) {
            case 'binary':
                outputText = textToBinary(inputText);
                break;
            case 'morse':
                outputText = textToMorse(inputText);
                break;
            case 'hex':
                outputText = textToHex(inputText);
                break;
            default:
                outputText = "Sélectionnez une option de traduction valide.";
        }
    }

    document.getElementById('outputText').value = outputText;

    document.getElementById('originalTranslation').textContent = inputText;
}

function textToBinary(text) {
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
}

function textToMorse(text) {
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
        'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
        'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-',
        'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
        '6': '-....', '7': '--...', '8': '---..', '9': '----.',
        ' ': '/', '.': '.-.-.-', ',': '--..--', '?': '..--..', '\'': '.----.', '!': '-.-.--',
        '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.',
        '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-',
        '@': '.--.-.',
        'À': '.--.-', 'Â': '.-.-', 'Ä': '.-.-', 'È': '.-..-', 'É': '..-..', 'Ê': '-..-.',
        'Ë': '..-..', 'Î': '.-..', 'Ï': '..--', 'Ô': '---.', 'Œ': '---.', 'Ö': '---.', 'Ù': '..--',
        'Û': '..--', 'Ü': '..--', 'Ç': '-.-..'
    };

    return text.toUpperCase().split('').map(char => {
        return morseCode[char] || '';
    }).join(' ');
}


function textToHex(text) {
    let hex = '';
    for (let i = 0; i < text.length; i++) {
        hex += text.charCodeAt(i).toString(16).toUpperCase().padStart(2, '0');
    }
    return hex;
}

function hexToText(hex) {
    let text = '';
    for (let i = 0; i < hex.length; i += 2) {
        text += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return text;
}

function binaryToText(binary) {
    const bytes = binary.match(/.{1,8}/g);
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
}

function morseToText(morse) {
    const morseCode = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G',
        '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N',
        '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U',
        '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z', '-----': '0',
        '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6',
        '--...': '7', '---..': '8', '----.': '9', '/': ' '
    };

    return morse.split(' ').map(code => morseCode[code] || '').join('');
}

function copyText() {
    const outputText = document.getElementById('outputText');
    outputText.select();
    outputText.setSelectionRange(0, 99999);
    document.execCommand("copy");

    const copyButton = document.getElementById('copyButton');
    copyButton.textContent = '✅';
    setTimeout(() => {
        copyButton.textContent = 'Copier';
    }, 15000);
}