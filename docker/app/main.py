from fastapi import FastAPI
from music21 import chord, harmony

app = FastAPI()
@app.get("/identify-chord")
def identify_chord(notes: str = ""):

    if not notes.strip(): # 構成音が空の場合の処理
        return {
            "error": "No notes provided",
            "chord_name": "Unknown Chord"
        }

    notes_list = notes.split(",") # 文字列をカンマで分割してリストに変換
    try: # コード名を返す処理
        chord_obj = chord.Chord(notes_list) # 構成音のリストからコードオブジェクトを作成
        chord_name = harmony.chordSymbolFromChord(chord_obj).figure # コードオブジェクトからコード名を取得
        chord_bass = notes_list[0] # 構成音の配列の最初の要素を最低音とする
        if chord_obj.root().name != chord_bass and "/" not in chord_name: # コードのルート音と最低音が異なり、分数コードでないなら分数コードにする
            chord_name = f"{chord_name}/{chord_bass}"
        return {
            "chord_name": chord_name
        }

    except Exception as e: #エラー処理
        return {
            "error": str(e),
            "chord_name": "Unknown Chord"
        }

@app.get("/identify-notes")
def get_chord_notes(chord_name: str = ""):

    if not chord_name.strip(): # コード名が空の場合の処理
        return {
            "error": "No chord name provided",
            "notes": []
        }

    try: # 構成音を返す処理
        if chord_name == "C":
            notes_names = ["C", "E", "G"]
        return {
            "notes": notes_names
        }

    except Exception as e: # エラー処理
        return {
            "error": str(e),
            "notes": []
        }