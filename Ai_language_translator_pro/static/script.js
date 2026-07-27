// ================================
// AI Language Translator Pro
// ================================
document.addEventListener("DOMContentLoaded", function () {
const stopSpeakBtn = document.getElementById("stopSpeakBtn");

const inputText = document.getElementById("inputText");
const output = document.getElementById("output");

const copyBtn = document.getElementById("copyBtn");
const speakBtn = document.getElementById("speakBtn");
const clearBtn = document.getElementById("clearBtn");
const swapBtn = document.getElementById("swap");
const voiceBtn = document.getElementById("voiceInput");
const downloadBtn = document.getElementById("downloadBtn");

const source = document.getElementById("source");
const target = document.getElementById("target");

const charCount = document.getElementById("charCount");

// ================================
// Character Counter
// ================================

if(inputText){

    charCount.innerText =
        inputText.value.length + " Characters";

    inputText.addEventListener("input",()=>{

        charCount.innerText =
            inputText.value.length + " Characters";

    });

}

// ================================
// Clear Input
// ================================

if(clearBtn){

    clearBtn.addEventListener("click",()=>{

        inputText.value="";

        charCount.innerText="0 Characters";

    });

}

// ================================
// Swap Languages
// ================================

if(swapBtn){

    swapBtn.addEventListener("click",()=>{

        let temp=source.value;

        source.value=target.value;

        target.value=temp;

    });

}
// ================================
// Copy Button
// ================================

if(copyBtn){

    copyBtn.addEventListener("click",()=>{

        navigator.clipboard.writeText(output.innerText);

        copyBtn.innerHTML="✅ Copied";

        setTimeout(()=>{

            copyBtn.innerHTML='<i class="fa-solid fa-copy"></i> Copy';

        },2000);

    });

}

// =========================
// Speak Button
// =========================

if (speakBtn) {

    speakBtn.addEventListener("click", () => {

        let text = output.innerText.trim();

        if (text === "" || text === "Your translation will appear here...") {
            alert("Nothing to speak.");
            return;
        }

        speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(text);

        speech.rate = 1;
        speech.pitch = 1;

        const targetLang = target.value;
        speech.lang = targetLang;

        const voices = speechSynthesis.getVoices();

        let voice = voices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase());

        if (!voice && targetLang === "hi") {
            voice = voices.find(v => v.lang.toLowerCase().startsWith("hi"));
        }

        if (voice) {
            speech.voice = voice;
        }

        speechSynthesis.speak(speech);

    });

}
// ================================
// Voice Input
// ================================

if(voiceBtn){

    if('webkitSpeechRecognition' in window){

        const recognition=new webkitSpeechRecognition();

        recognition.lang="en-US";

        recognition.continuous=false;

        recognition.interimResults=false;

        voiceBtn.addEventListener("click",()=>{

            recognition.start();

        });

        recognition.onresult=(event)=>{

            inputText.value=event.results[0][0].transcript;

            charCount.innerText=inputText.value.length+" Characters";

        };

    }

}
// ================================
// Download Button
// ================================

if(downloadBtn){

    downloadBtn.addEventListener("click",()=>{

        let text=output.innerText.trim();

        if(text==="" || text==="Your translation will appear here..."){

            alert("Nothing to download.");

            return;

        }

        window.location.href=
        "/download?text="+encodeURIComponent(text);

    });

}

// ================================
// Translation History
// ================================

const historyList=document.getElementById("historyList");

if(historyList && output){

    window.addEventListener("load",()=>{

        let history=
        JSON.parse(localStorage.getItem("history")) || [];

        let current=output.innerText.trim();

        if(current!=="" &&
        current!=="Your translation will appear here..."){

            history.unshift(current);

            history=[...new Set(history)];

            history=history.slice(0,10);

            localStorage.setItem(
                "history",
                JSON.stringify(history)
            );

        }

        historyList.innerHTML="";

        history.forEach(item=>{

            historyList.innerHTML+=`
            <div class="history-item">
                ${item}
            </div>
            `;

        });

    });

}

// ================================
// Loading Animation
// ================================

const form=document.getElementById("translatorForm");

const loading=document.getElementById("loading");

if(form){

    form.addEventListener("submit",()=>{

        loading.style.display="block";

    });

}
if(stopSpeakBtn){

    stopSpeakBtn.addEventListener("click",()=>{

        speechSynthesis.cancel();

    });

}
const clearOutputBtn = document.getElementById("clearOutputBtn");

clearOutputBtn.addEventListener("click", function () {

    document.getElementById("output").innerHTML =
        "Your translation will appear here...";

});
});