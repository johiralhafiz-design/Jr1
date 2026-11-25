/*
 * Motion Studio optional free Bengali system-voice audition.
 * Load this script after the main Motion_Studio.html application script.
 * System voices are preview-only; they are not Azure/backend render voices.
 */
(() => {
  "use strict";

  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;

  const systemPrefix = "browser-tts:";
  const voiceRegistry = new Map();
  const find = (id) => document.getElementById(id);

  function collectBengaliVoices() {
    const synthVoices = window.speechSynthesis.getVoices();
    const appState = typeof state !== "undefined" ? state : null;
    if (!appState || !Array.isArray(appState.voices)) return;

    synthVoices
      .filter((voice) => /^bn(?:-|$)/i.test(voice.lang || "") || /bengali|bangla/i.test(voice.name || ""))
      .forEach((voice) => {
        const id = systemPrefix + voice.voiceURI;
        voiceRegistry.set(id, voice);
        if (!appState.voices.some((item) => item.id === id)) {
          appState.voices.push({
            id,
            name: `${voice.name} · সিস্টেম ফ্রি প্রিভিউ`,
            gender: "System",
            style: `${voice.lang || "bn"} · শুধু এই ডিভাইসে প্রিভিউ`,
            group: "bn",
            localPreviewOnly: true,
          });
        }
      });

    if (typeof renderVoiceList === "function") renderVoiceList();
    if (typeof updateActiveVoiceLabel === "function") updateActiveVoiceLabel();
  }

  function auditionSystemVoice(id) {
    const voice = voiceRegistry.get(id);
    if (!voice) return;

    window.speechSynthesis.cancel();
    const sample = new SpeechSynthesisUtterance(
      "নমস্কার। আজকের তথ্যচিত্রে আমরা জানব এমন এক গল্প, যা বদলে দিতে পারে আমাদের পৃথিবীকে।"
    );
    sample.voice = voice;
    sample.lang = voice.lang || "bn-BD";
    sample.rate = 0.9;
    sample.pitch = 0.92;
    sample.onend = () => {
      if (typeof state !== "undefined") {
        state.playingVoiceId = null;
        if (typeof renderVoiceList === "function") renderVoiceList();
      }
    };
    sample.onerror = sample.onend;

    if (typeof state !== "undefined") state.playingVoiceId = id;
    if (typeof renderVoiceList === "function") renderVoiceList();
    window.speechSynthesis.speak(sample);
  }

  // Intercept only system-voice rows. Existing Azure/backend voice behavior is unchanged.
  document.addEventListener("click", (event) => {
    const row = event.target.closest?.(".vp-item");
    if (!row) return;

    const appState = typeof state !== "undefined" ? state : null;
    if (!appState) return;
    const systemVoice = appState.voices.find((voice) =>
      voice.localPreviewOnly && row.textContent.includes(voice.name)
    );
    if (!systemVoice) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (event.target.closest(".vp-audition-btn")) {
      auditionSystemVoice(systemVoice.id);
      return;
    }

    const label = find("activeVoiceLabel");
    if (label) label.textContent = "সিস্টেম ভয়েস (শুধু প্রিভিউ) — বাস্তব ভিডিওর জন্য Azure ভয়েস বাছুন";
  }, true);

  collectBengaliVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", collectBengaliVoices);
  // Some browsers populate their voice list asynchronously without firing voiceschanged promptly.
  window.setTimeout(collectBengaliVoices, 500);
})();
