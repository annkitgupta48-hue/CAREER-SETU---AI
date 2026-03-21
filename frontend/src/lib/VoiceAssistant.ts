/**
 * VoiceAssistant Utility
 * Handles Text-to-Speech (TTS) using the Web Speech API with Hindi support.
 */

export const HINDI_PHRASES = {
    WELCOME: "नमस्ते! करियर सेतु में आपका स्वागत है। चलिए आपका अकाउंट बनाते हैं।",
    ENTER_NAME: "कृपया अपना पूरा नाम यहाँ लिखें।",
    ENTER_PHONE: "अपना दस अंकों का मोबाइल नंबर डालें।",
    REGISTER_SUCCESS: "बधाई हो! आपका अकाउंट बन गया है। अब आप काम शुरू कर सकते हैं।",
    VERIFY_AADHAAR_PROMPT: "अपनी पहचान पक्की करने के लिए अपना बारह अंकों का आधार नंबर डालें।",
    VERIFY_SUCCESS: "आपका आधार कार्ड सफ़लतापूर्वक सत्यापित हो गया है।",
    UPDATE_PROFILE: "अपनी स्किल्स और अनुभव की जानकारी यहाँ भरें ताकि आपको ज़्यादा काम मिल सके।",
    ACCEPT_JOB: "आपने यह काम स्वीकार कर लिया है। अब आप ग्राहक से बात कर सकते हैं।",
    REJECT_JOB: "कोई बात नहीं, हम आपके लिए दूसरा काम ढूँढेंगे।",
    ENABLE_VOICE: "आवाज़ सहायता चालू कर दी गई है।",
    DISABLE_VOICE: "आवाज़ सहायता बंद कर दी गई है।"
};

class VoiceAssistant {
    private synthesis: SpeechSynthesis | null = null;
    private voice: SpeechSynthesisVoice | null = null;
    private enabled: boolean = true;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synthesis = window.speechSynthesis;
            this.loadVoice();
        }
    }

    private loadVoice() {
        if (!this.synthesis) return;
        
        const voices = this.synthesis.getVoices();
        // Look for Hindi voice
        this.voice = voices.find(v => v.lang.startsWith('hi')) || null;
        
        // Chrome sometimes needs this event to load voices
        if (!this.voice && this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => {
                const updatedVoices = this.synthesis!.getVoices();
                this.voice = updatedVoices.find(v => v.lang.startsWith('hi')) || null;
            };
        }
    }

    public setEnabled(status: boolean) {
        this.enabled = status;
        if (!status) this.stop();
    }

    public speak(text: string) {
        if (!this.enabled || !this.synthesis) return;

        this.stop(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.lang = 'hi-IN';
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        
        this.synthesis.speak(utterance);
    }

    public stop() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }
}

export const voiceAssistant = new VoiceAssistant();
