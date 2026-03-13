if (location.hostname !== "localhost") {
    console.log = function() {};
}

// 要素の取得
const inputChord = document.getElementById('inputChord');
const outputChord = document.getElementById('outputChord');

const inputNotes = document.getElementById('inputNotes');
const outputNotes = document.getElementById('outputNotes');

const inputScale = document.getElementById('inputScale');
const outputScale = document.getElementById('outputScale');

const outputText = document.querySelectorAll('.outputText');
const inputPiano = document.querySelectorAll('.inputPiano');
const outputPiano = document.querySelectorAll('.outputPiano')
const inputButtons = document.querySelectorAll('.inputButton');
const outputButtons = document.querySelectorAll('.outputButton');

const displayButtonChord = document.getElementById('displayButtonChord');
const displayButtonNotes = document.getElementById('displayButtonNotes');
const displayButtonScale = document.getElementById('displayButtonScale');

const displayButtons = document.querySelectorAll('.displayButton');
const chordSection = document.querySelectorAll('.chordSection');
const notesSection = document.querySelectorAll('.notesSection');
const scaleSection = document.querySelectorAll('.scaleSection');
const outputWarning = document.getElementById('outputWarning');

// 機能切替ボタンのイベントリスナー
displayButtonChord.addEventListener('click', () => switchSection(chordSection));
displayButtonNotes.addEventListener('click', () => switchSection(notesSection));
displayButtonScale.addEventListener('click', () => switchSection(scaleSection));

// 入力監視
let timeoutId;
inputChord.addEventListener('input', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(convertChord, 100);
});
inputNotes.addEventListener('input', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(convertNotes, 100);
});
inputScale.addEventListener('input', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(estimateScale, 100);
});

function reset() {
    inputChord.value = '';
    inputNotes.value = '';
    inputScale.value = '';
    outputChord.textContent = '構成音を入力してください';
    outputNotes.textContent = 'コードを入力してください';
    outputScale.textContent = 'コードを入力してください';
    outputWarning.classList.add('hidden');
    outputWarning.textContent = '';
    inputButtons.forEach(button => button.classList.remove('active'));
    outputButtons.forEach(button => button.classList.remove('active'));
    outputButtons.forEach(button => button.classList.remove('bass'));
    outputText.forEach(el => el.classList.remove('active'));
}

// 機能切替ボタンのアクティブ状態管理
displayButtons.forEach(button => {
    button.addEventListener('click', () => {
        displayButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // テキストボックスをリセット
        reset();

        if (button.id=='displayButtonChord') {
            inputPiano.forEach(piano => piano.classList.remove('disabled'));
            outputPiano.forEach(piano => piano.classList.add('disabled'));
        } else {
            inputPiano.forEach(piano => piano.classList.add('disabled'));
            outputPiano.forEach(piano => piano.classList.remove('disabled'));
        }
    });
});

// 入力ボタンのアクティブ状態管理、テキストボックス書き換え
inputButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
        inputButtonsList = [];
        inputButtons.forEach(btn => {
            if (btn.classList.contains('active')) {
                inputButtonsList.push(btn.textContent);
            }
        });
        inputChord.value = inputButtonsList.join(', ');
        convertChord();
    });
});

// 出力ボタンのアクティブ状態管理、テキストボックス書き換え
function updateOutputButtons(midiNotes, bass) {

    // 初期化
    outputButtons.forEach(button => button.classList.remove('active'));
    outputButtons.forEach(button => button.classList.remove('bass'));

    midiNotes.forEach(midi => {
        console.log(midi);
        target = document.getElementById(`button${midi}`);
        if (target) {
            target.classList.add('active');
        }
        if (bass === midi) {
            target.classList.add('bass');
        }
    });
}

// セクションの表示管理
function switchSection(target) {
    const allSections = [chordSection, notesSection, scaleSection];

    allSections.forEach(section => {
        if (section === target) {
            section.forEach(el => el.classList.remove('hidden'));
        } else {
            section.forEach(el => el.classList.add('hidden'));
        }
    });
}

// コード名を構成音に変換する関数
async function convertChord() {
    try {
        let notes_str = inputChord.value;
        notes_str = notes_str.replace(/\s+/g, '').replace(/、/g, ',').toUpperCase().replace(/[＃♯]/g, '#').replace(/[♭-]/g, 'b');

        const response = await fetch(`/api/identify-chord?notes=${encodeURIComponent(notes_str)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);

        outputChord.textContent = `${data.chord_name.replace(/#/g, '♯').replace(/-/g, '♭')}`;
        if (!data.error) {
            outputText.forEach(el => el.classList.add('active'));
        } else {
            outputText.forEach(el => el.classList.remove('active'));
        }
    } catch (error) {
        outputChord.textContent = (`Error: ${error.message}`);
    }
}

// 構成音をコード名に変換する関数
async function convertNotes() {
    try {
        let chord_name = inputNotes.value;
        chord_name = chord_name.replace(/\s+/g, '').replace(/[＃♯]/g, '#').replace(/[♭b]/g, '-');

        console.log(chord_name);
        const response = await fetch(`/api/identify-notes?chord_name=${encodeURIComponent(chord_name)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        
        outputNotes.textContent = `${data.notes.replace(/#/g, '♯').replace(/-/g, '♭')}`;

        if (data.midi_notes && data.root) {
            console.log(data.test);
            updateOutputButtons(data.midi_notes, data.root);
        } else {
            updateOutputButtons([], '');
        }

        if (!data.error) {
            outputText.forEach(el => el.classList.add('active'));
        } else {
            outputText.forEach(el => el.classList.remove('active'));
        }

        if (data.warning) {
            outputWarning.textContent = `${data.warning}`;
            outputWarning.classList.remove('hidden');
        } else {
            outputWarning.textContent = '';
            outputWarning.classList.add('hidden');
        }

    } catch (error) {
        outputNotes.textContent = (`Error: ${error.message}`);
    }
}

// コード名から推定されるスケールを表示する関数
async function estimateScale() {
    try {
        let chord_name = inputScale.value;
        chord_name = chord_name.replace(/\s+/g, '').replace(/[＃♯]/g, '#').replace(/[♭b]/g, '-');

        console.log(chord_name);
        const response = await fetch(`/api/estimate-scale?chord_name=${encodeURIComponent(chord_name)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        
        outputScale.textContent = `${data.scales.replace(/#/g, '♯').replace(/-/g, '♭')}`;
        
        if (data.midi_notes && data.tonic) {
            updateOutputButtons(data.midi_notes, data.tonic);
        } else {
            updateOutputButtons([], '');
        }

        if (!data.error) {
            outputText.forEach(el => el.classList.add('active'));
        } else {
            outputText.forEach(el => el.classList.remove('active'));
        }
    } catch (error) {
        outputScale.textContent = (`Error: ${error.message}`);
    }
}