import React, { useEffect } from "react";
import CustomButton from "./CustomButton";
import styles from "../../styles/pages/home.module.scss";
import Grnderbanner from "../img/korean_art.jpg";
import AlmostDone from "../img/AlmostDone.gif";
import { FormProvider, useForm1 } from "../context/formContext";
import kingLogo from "../img/king_logo.svg";
import { useState, useRef } from "react";
import imageCompression from 'browser-image-compression';

// Function to compress image
async function compressImage(file:any) {
  const options = {
    maxSizeMB: 0.2, // Maximum size in MB
    maxWidthOrHeight: 800, // Maximum width or height
    useWebWorker: true, // Use a Web Worker for better performance
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image', error);
  }
}
let toastId: string | null = null;
// ✅ Now we receive formData as a parameter
async function fetchResponse(formData: any) {
  const formDataToSend = new FormData();
  console.log("Original Image", formData.file);
  const compressedImage = formData.file.size > 200 * 1024 ? await compressImage(formData.file) : formData.file;
  console.log("Compressed Image", compressedImage);
  formDataToSend.append("subject", compressedImage);
  if(formData.style == "K-Pop"){
    formDataToSend.append('expression', "1");
  }else if(formData.style == "K-Drama"){
    formDataToSend.append('expression', "2");
  }else if(formData.style == "K-Foodie"){
    formDataToSend.append('expression', "3");
  }else{
    formDataToSend.append('expression', "0");
  }
  const randomIndex = Math.floor(Math.random() * 10) + 1;
        
const capitalized = formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1).toLowerCase();
console.log(capitalized); // "Male"
  const maskUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/assets/masks/${formData.style}/${capitalized}/${randomIndex}.jpg`;
  formDataToSend.append('mask', maskUrl);
  try {
const res = await fetch('/api/generate', {
  method: 'POST',
  body: formDataToSend,
});
if (!res.ok) {
  const errorText = await res.text(); // optional: log error message
  alert('Image generation failed. Please try again.');
  location.reload(); // reload the page
  return;
}


const { job_id, status} = await res.json();
return job_id;

  } catch (error) {
    console.error("Request failed:", error);
    alert("An error occurred while submitting the form.");

  }
}

export default function Download({ onNext }: { onNext: () => void }) {
  const { formData, updateForm } = useForm1();
  const [jobId, setJobId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [final, setFinal] = useState<string>("");
  const finalRef = useRef<string>("");

// Keep ref in sync with state
useEffect(() => {
  finalRef.current = final;
}, [final]);
 
  useEffect(() => {
    (async () => {
      console.log(new Date().toString());
      setStatus("starting");
      console.log("Upload Image:");
      const data = await fetchResponse(formData) || "";



      let job_id = data; // assuming backend returns { job_id }
if(job_id != ""){
  const pollInterval = 6000; // 2 seconds

const intervalId = setInterval(async () => {
  try {
    const jformData = new FormData();
    jformData.append("job_id",job_id);
    const statusRes = await fetch('/api/image-status', {
      method: 'POST',
      body: jformData,
    });
    console.log(statusRes);
    if (!statusRes.ok) {
      alert("Something Went Wrong, Please Try Again!");
      location.reload();
    }else if(statusRes.ok == true){
      
    if (statusRes.status === 200) {
      clearInterval(intervalId);
      console.log('Job done:', "Completed");
      
      const blob = await statusRes.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
      console.log(imageUrl);
      updateForm("file",imageUrl);
      setFinal("Completed");
    }
    else if(statusRes.status == 202){
      const statusData = await statusRes.json();
      console.log(statusData);
      if (statusData.details === 'failed') {
        clearInterval(intervalId);
        alert('Job failed.');
        location.reload();
      } else {
        console.log('Job still in progress...');
      }
    }
  }
    
    
  } catch (err) {
    clearInterval(intervalId);
    console.error('Polling error:', err);
    alert('Error checking job status.');
    location.reload();
  }
}, pollInterval);
}

   
      
    })();
  }, []);
 
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState<string>("Uploading Image");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let current = 0;
    let phase = 1; // 1: Uploading, 2: Processing
  
    const startPhase1 = () => {
      const duration = 10000; // 10 seconds
      const totalSteps = duration / 100;
      const step = 100 / totalSteps;
  
      setProgressLabel("Uploading Image");
  
      interval = setInterval(() => {
        current += step;
        const roundedProgress = Math.min(Math.floor(current), 100);
        setProgress(roundedProgress);
  
        if (roundedProgress >= 100) {
          clearInterval(interval);
          setProgress(100);
          startPhase2();
        }
      }, 100);
    };
  
    const startPhase2 = () => {
      current = 0;
      const duration = 80000; // Or however long "processing" should appear
      const totalSteps = duration / 100;
      const step = 100 / totalSteps;
  
      setProgressLabel("Processing");
  
      interval = setInterval(() => {
        // If the file is processed (e.g., finalRef is ready), finish faster
        if (finalRef.current !== "") {
          current += step * 5;
        } else if(current < 95) {
          current += step;
        }
  
        const roundedProgress = Math.min(Math.floor(current), 100);
        setProgress(roundedProgress);
  
        if (roundedProgress >= 100) {
          clearInterval(interval);
          setProgressLabel("Done");
          setTimeout(() => {
            document.getElementById('downloadbtn')?.click();
          }, 500);
        }
      }, 100);
    };
  
    startPhase1();
  
    return () => clearInterval(interval);
  }, []);
  

  
  const texts = [
    'K-reation in Progress ⌛',
    'Gear up for a K-twist 🔥',
    'Giving it a finishing K-touch 🖌',
    'Almost done, getting you K-ready 😎',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState(styles.fadeIn);

  useEffect(() => {
    const cycleText = () => {
      setFadeState(styles.fadeIn);

      setTimeout(() => {
        setFadeState(styles.fadeOut);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
          cycleText();
        }, 2000); // fadeOut duration
      }, 4000); // 2s fadeIn + 2s visible
    };

    cycleText();
  }, []);

  return (
    <div className={styles.download}>
      <div className={styles.gender_banner}>
        <img src={Grnderbanner.src} alt="Grnderbanner" className={styles.Grnderbanner} />
        <img src={kingLogo.src} alt="kingLogo" className={styles.kingLogo} />

        
        {/* <div className={styles.gender_title}>
          <h3 className={styles.gender_title_1}>Almost done!</h3>
          <h3 className={styles.gender_title_2}>Almost done!</h3>
        </div> */}
      </div>
      <div className={styles.all_most_done}>
      <div className={`${styles.auraText} ${fadeState} ${styles.gender_title}`}>
      <h3 className={styles.gender_title_1}>{texts[currentIndex]}</h3>
      <h3 className={styles.gender_title_2}>{texts[currentIndex]}</h3>
    </div>
        {/* <img src={AlmostDone.src} alt="AlmostDone" /> */}

        <div className={styles.loader_container}>
          {/* <h5>Processing</h5> */}
            <h4>{progressLabel}</h4>
          <div className={styles.progress_bar}>
            <div
              className={styles.progress_fill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className={styles.counter}>{progress}%</div>
        </div>
      </div>
      <div id="dwnBtnDiv" style={{ display: "none" }}>
        <CustomButton id="downloadbtn" text="Next" onClick={onNext} />
      </div>
      <div className={styles.tnc}>
        <h6>*T&C APPLY. TM & © 2025 BURGER KING COMPANY LLC. USED UNDER LICENSE.</h6>
      </div>
    </div>
  );
}
