from fastapi import FastAPI

app = FastAPI()
@app.get("/identify-chord")
def identify_chord(notes: str = ""):
    if not notes:
        return {
            "error": "No notes provided",
            "chord_name": None
        }
    if notes == "C,E,G":
        return {
            "chord_name": "C major"
        }
    else:
        return {
            "chord_name": "Unknown chord"
        }