let input = document.getElementById('input');
let convertButton = document.getElementById('convert');
let output = document.getElementById('output');

convertButton.addEventListener('click', convertChord);

async function convertChord() {
    try {
        const notes = input.value;
        const response = await fetch(`/api/identify-chord?notes=${encodeURIComponent(notes)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        output.textContent = (`コード: ${data.chord_name}`);
    } catch (error) {
        output.textContent = (`Error: ${error.message}`);
    }
}