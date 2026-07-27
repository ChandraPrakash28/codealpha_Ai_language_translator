from flask import Flask, render_template, request, send_file
from googletrans import Translator, LANGUAGES
import PyPDF2
from docx import Document
from gtts import gTTS
import os
import uuid
app = Flask(__name__)

translator = Translator()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
def read_uploaded_file(file):

    filename = file.filename.lower()

    if filename.endswith(".txt"):

        return file.read().decode("utf-8")

    elif filename.endswith(".pdf"):

        reader = PyPDF2.PdfReader(file)

        text = ""

        for page in reader.pages:

            page_text = page.extract_text()

            if page_text:

                text += page_text + "\n"

        return text

    elif filename.endswith(".docx"):

        doc = Document(file)

        return "\n".join([p.text for p in doc.paragraphs])

    return ""
@app.route("/", methods=["GET", "POST"])
def index():

    translated_text = ""

    if request.method == "POST":

        source = request.form.get("source", "auto")
        target = request.form.get("target", "en")

        text = request.form.get("text", "").strip()

        uploaded_file = request.files.get("file")

        # Agar file upload hui hai to uska text read karo
        if uploaded_file and uploaded_file.filename:

            text = read_uploaded_file(uploaded_file)

        # Agar na text hai aur na file
        if not text:

            return render_template(
                "index.html",
                translated_text="Please enter text or upload a file.",
                languages=LANGUAGES
            )

        try:

            translated = translator.translate(
                text,
                src=source,
                dest=target
            )

            translated_text = translated.text

        except Exception as e:

            translated_text = f"Translation Error: {e}"

    return render_template(
        "index.html",
        translated_text=translated_text,
        languages=LANGUAGES
    )
@app.route("/download")
def download():

    text = request.args.get("text","")

    filename = f"translation_{uuid.uuid4().hex}.txt"

    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath,"w",encoding="utf-8") as f:

        f.write(text)

    return send_file(
        filepath,
        as_attachment=True
    )
@app.route("/speak")
def speak():

    text = request.args.get("text","")

    lang = request.args.get("lang","en")

    filename = f"voice_{uuid.uuid4().hex}.mp3"

    filepath = os.path.join(UPLOAD_FOLDER, filename)

    tts = gTTS(text=text,lang=lang)

    tts.save(filepath)

    return send_file(filepath)
if __name__=="__main__":

    app.run(debug=True)