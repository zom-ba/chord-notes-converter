// 要素の取得

let inputChord = document.getElementById('inputChord');
let convertButtonChord = document.getElementById('convertButtonChord');
let outputChord = document.getElementById('outputChord');

let inputNotes = document.getElementById('inputNotes');
let convertButtonNotes = document.getElementById('convertButtonNotes');
let outputNotes = document.getElementById('outputNotes');

let inputScale = document.getElementById('inputScale');
let estimateButtonScale = document.getElementById('estimateButtonScale');
let outputScale = document.getElementById('outputScale');

let displayButtonChord = document.getElementById('displayButtonChord');
let displayButtonNotes = document.getElementById('displayButtonNotes');
let displayButtonScale = document.getElementById('displayButtonScale');

let displayButtons = document.querySelectorAll('.displayButton');
let chordSection = document.querySelectorAll('.chordSection');
let notesSection = document.querySelectorAll('.notesSection');
let scaleSection = document.querySelectorAll('.scaleSection');

let inputPiano = document.querySelectorAll('.inputPiano');
let outputPiano = document.querySelectorAll('.outputPiano')
let inputButtons = document.querySelectorAll('.inputButton');
let outputButtons = document.querySelectorAll('.outputButton');

// 機能切替ボタンのイベントリスナー
displayButtonChord.addEventListener('click', () => switchSection(chordSection));
displayButtonNotes.addEventListener('click', () => switchSection(notesSection));
displayButtonScale.addEventListener('click', () => switchSection(scaleSection));

// イベントリスナーの追加
convertButtonChord.addEventListener('click', convertChord);
convertButtonNotes.addEventListener('click', convertNotes);
estimateButtonScale.addEventListener('click', estimateScale);

function reset() {
    inputChord.value = '';
    inputNotes.value = '';
    inputScale.value = '';
    outputChord.value = '構成音を入力してください';
    outputNotes.value = 'コードを入力してください';
    outputScale.value = 'コードを入力してください';
    inputButtons.forEach(button => button.classList.remove('active'));
    outputButtons.forEach(button => button.classList.remove('active'));
    outputButtons.forEach(button => button.classList.remove('tonic'));
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
    });
});

// 出力ボタンのアクティブ状態管理、テキストボックス書き換え
function updateOutputButtons(midiNotes, tonic) {

    // 初期化
    outputButtons.forEach(button => button.classList.remove('active'));
    outputButtons.forEach(button => button.classList.remove('tonic'));

    if (!midiNotes) {
        return;
    }

    midiNotes.forEach(midi => {
        console.log(midi);
        target = document.getElementById(`button${midi}`);
        if (target) {
            target.classList.add('active');
        }
        if (tonic === midi) {
            target.classList.add('tonic');
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

        console.log(data.midi_notes, data.tonic);
        
        if (!data.scales.includes(',')) {
            updateOutputButtons(data.midi_notes, data.tonic);
        } else {
            updateOutputButtons([], '');
        }
    } catch (error) {
        outputScale.textContent = (`Error: ${error.message}`);
    }
}