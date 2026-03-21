import { useEffect, useState } from 'react';
import { voiceAssistant, HINDI_PHRASES } from '../lib/VoiceAssistant';

export function useVoiceAssistant() {
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('voice_enabled') !== 'false';
        }
        return true;
    });

    useEffect(() => {
        voiceAssistant.setEnabled(isVoiceEnabled);
        localStorage.setItem('voice_enabled', String(isVoiceEnabled));
    }, [isVoiceEnabled]);

    const speak = (phraseKey: keyof typeof HINDI_PHRASES | string) => {
        const text = (HINDI_PHRASES as any)[phraseKey] || phraseKey;
        voiceAssistant.speak(text);
    };

    const toggleVoice = () => {
        const newState = !isVoiceEnabled;
        setIsVoiceEnabled(newState);
        if (newState) {
            speak(HINDI_PHRASES.ENABLE_VOICE);
        }
    };

    return {
        isVoiceEnabled,
        toggleVoice,
        speak,
        phrases: HINDI_PHRASES
    };
}
