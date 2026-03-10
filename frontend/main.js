// 要素の取得
let inputChord = document.getElementById('inputChord');
let convertButtonChord = document.getElementById('convertButtonChord');
let outputChord = document.getElementById('outputChord');
let inputNotes = document.getElementById('inputNotes');
let convertButtonNotes = document.getElementById('convertButtonNotes');
let outputNotes = document.getElementById('outputNotes');

// イベントリスナーの追加
convertButtonChord.addEventListener('click', convertChord);
convertButtonNotes.addEventListener('click', convertNotes);

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

        outputChord.textContent = `${data.chord_name}`;
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