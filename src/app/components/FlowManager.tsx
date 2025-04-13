'use client';

import { useEffect, useState } from 'react';
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

    // Push history entry when going forward
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
  
    // Listen for browser back button
    useEffect(() => {
      const onPopState = (event: PopStateEvent) => {
        const newStep = event.state?.step || 1;
        setStep(newStep);
      };
  
      window.addEventListener('popstate', onPopState);
  
      // Push the initial state on mount
      window.history.replaceState({ step: 1 }, 'Step 1');
  
      return () => window.removeEventListener('popstate', onPopState);
    }, []);

  return (

    <>
    <DesktopView></DesktopView>
    <div className='mobile-view'>

    <div style={{minHeight:'100vh',display:'flex', flexDirection:'column'}}>
      {step === 1 && <HomePage onNext={goNext} />}
      {step === 2 && <Gender onNext={goNext}/>}
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
