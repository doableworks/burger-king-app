'use client';

import { useEffect, useRef, useState } from 'react';
import HomePage from './HomePage';
import Gender from './Gender';
import Avatar from './Avatar';
import Personal from './Personal';
import FileUpload from './FileUpload';
import Download from './Download';
import Explore from './Explore';
import { DesktopView } from './DesktopView';

export default function FlowManager() {
  const [step, setStep] = useState(1);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Step navigation
  const goNext = () => {
    const nextStep = step + 1;
    window.history.pushState({ step: nextStep }, `Step ${nextStep}`);
    setStep(nextStep);
  };

  const goBack = () => {
    const prevStep = step - 1;
    window.history.pushState({ step: prevStep }, `Step ${prevStep}`);
    setStep(prevStep);
  };

  // Handle browser back button
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const newStep = event.state?.step || 1;
      setStep(newStep);
    };

    window.addEventListener('popstate', onPopState);
    window.history.replaceState({ step: 1 }, 'Step 1');

    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Load audio file
  useEffect(() => {
    const audioFile = '/BK-Audio.mp3';
    setAudioSrc(audioFile);
  }, []);

  // Start handler — triggered by user interaction
  const handleStart = () => {
    if (audioRef.current && !audioInitialized) {
      audioRef.current
        .play()
        .then(() => setAudioInitialized(true))
        .catch((err) => console.warn('Autoplay blocked:', err));
    }
    goNext();
  };

  return (
    <>
      <DesktopView />
      <div className='mobile-view'>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {audioSrc && (
            <audio ref={audioRef} autoPlay loop>
              <source src={audioSrc} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          )}

          {step === 1 && <HomePage onNext={handleStart} />}
          {step === 2 && <Gender onNext={goNext} />}
          {step === 3 && <Avatar onNext={goNext} onBack={goBack} />}
          {/* {step === 4 && <Personal onNext={goNext} />} */}
          {step === 4 && <FileUpload onNext={goNext} onBack={goBack} />}
          {step === 5 && <Download onNext={goNext} />}
          {step === 6 && <Explore />}
        </div>
      </div>
    </>
  );
}
