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

let chordSection = document.querySelectorAll('.chordSection');
let notesSection = document.querySelectorAll('.notesSection');
let scaleSection = document.querySelectorAll('.scaleSection');

// イベントリスナーの追加
convertButtonChord.addEventListener('click', convertChord);
convertButtonNotes.addEventListener('click', convertNotes);
estimateButtonScale.addEventListener('click', estimateScale);

// 表示切替のイベントリスナー
displayButtonChord.addEventListener('click', () => switchSection(chordSection));
displayButtonNotes.addEventListener('click', () => switchSection(notesSection));
displayButtonScale.addEventListener('click', () => switchSection(scaleSection));

// セクションの表示管理
function switchSection(target) {
    try {
        const allSections = [chordSection, notesSection, scaleSection];

        allSections.forEach(section => {
            if (section === target) {
                section.forEach(el => el.classList.remove('hidden'));
            } else {
                section.forEach(el => el.classList.add('hidden'));
            }
        });
    } catch (error) {
        console.error('Error switching sections:', error);
    }
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
    } catch (error) {
        outputScale.textContent = (`Error: ${error.message}`);
    }
}