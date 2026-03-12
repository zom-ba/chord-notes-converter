from fastapi import FastAPI
from music21 import chord, harmony, scale, pitch

# マイナーセブンスフラットファイブ、セブンスフラットファイブの処理を後で追加すべき

app = FastAPI()
@app.get("/identify-chord")
def identify_chord(notes: str = ""):

    if not notes.strip(): # 構成音が空の場合の処理
        return {
            "error": "No notes provided",
            "chord_name": "構成音を入力してください"
        }

    try: # コード名を返す処理
        notes_list = notes.split(",") # 文字列をカンマで分割してリストに変換
        chord_obj = chord.Chord(notes_list) # 構成音のリストからコードオブジェクトを作成
        chord_name = harmony.chordSymbolFromChord(chord_obj).figure # コードオブジェクトからコード名を取得
        if " " in chord_name:
            return {
                "chord_name": "コードを特定できませんでした"
            }
        return {
            "chord_name": chord_name
        }

    except Exception as e: #エラー処理
        return {
            "error": str(e),
            "chord_name": "有効な形式ではありません"
        }

@app.get("/identify-notes")
def identify_notes(chord_name: str = ""):

    if not chord_name.strip(): # コード名が空の場合の処理
        return {
            "error": "No chord name provided",
            "notes": "コードを入力してください"
        }

    try: # 構成音を返す処理
        chord_obj = harmony.ChordSymbol(chord_name) # コード名からコードオブジェクトを作成
        notes = ", ".join([note.name for note in chord_obj.pitches]) # コードオブジェクトから構成音のリストを取得
        return {
            "notes": notes
        }

    except Exception as e: # エラー処理
        return {
            "error": str(e),
            "notes": "有効な形式ではありません"
        }

@app.get("/estimate-scale")
def estimate_scale(chord_name: str = ""):

    if not chord_name.strip(): # コード名が空の場合の処理
        return {
            "error": "No chord name provided",
            "scales": "コードを入力してください"
        }

    try: # スケールを返す処理

        # コードの構成音を取得してセットに追加
        chords_list = chord_name.split(",") # コード名をカンマで分割してリストに変換
        notes_set = set()
        for c in chords_list: # cは各コード名を表す文字列
            chord_obj = harmony.ChordSymbol(c) # コード名からコードオブジェクトを作成
            for p in chord_obj.pitches: # pは構成音を表すコンテナオブジェクト
                notes_set.add(p.pitchClass) # 構成音を数字の形式でセットに追加

        # 候補となるスケールをリストに追加
        scales_list = []
        for root in range(12): # ルート音を0から11の数字で表す
            root_name = pitch.Pitch(root).name # ルート音の名前を取得
            scale_obj = scale.MajorScale(root_name) # ルート音とメジャースケールのオブジェクトを作成
            scale_pitches = set(p.pitchClass for p in scale_obj.getPitches()) # スケールの構成音を数字の形式でセットに追加
            if notes_set <= scale_pitches:
                scales_list.append(scale_obj)

        if not scales_list: # スケールが見つからない場合の処理
            return {
                "scales": "このコードが使われるメジャースケールは見つかりませんでした"
            }

        scales = ", ".join(f"{p.tonic.name} {p.type}" for p in scales_list)

        if len(scales_list) == 1:
            tonic_name = scales_list[0].tonic.name # トニックの名前を取得
            start_pitch = f"{tonic_name}3"
            pitches = scales_list[0].getPitches(start_pitch, 'B4')[:7]
            midi_notes = [p.midi for p in pitches]
            return {
                "scales": scales,
                "midi_notes": midi_notes,
                "tonic": midi_notes[0]
            }
        else:
            return {
                "scales": scales
            }

    except Exception as e: # エラー処理
        return {
            "error": str(e),
            "scales": "有効な形式ではありません"
        }