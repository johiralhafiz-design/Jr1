# Motion Studio voice patch

`motion-voices.js` adds available Bengali/Bangla voices installed in the visitor's browser/operating system to the voice picker as **system free previews**. These system voices are device-local and preview-only; they do not become server-renderable voices.

To enable the patch in `Motion_Studio.html`, add the following immediately after the app's main inline script and before `</body>`:

```html
<script src="./motion-voices.js"></script>
```

The app already lists Azure neural voices `bn-BD-NabanitaNeural`, `bn-BD-PradeepNeural`, `bn-IN-TanishaaNeural`, and `bn-IN-BashkarNeural`. Actual generated-video narration still requires the app backend/TTS provider to support those voice IDs. The browser patch does not claim that cloud neural voices are free or offline.
