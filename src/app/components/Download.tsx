import React, { useEffect } from "react";
import CustomButton from "./CustomButton";
import styles from "../../styles/pages/home.module.scss";
import Grnderbanner from "../img/korean_art.jpg";
import AlmostDone from "../img/AlmostDone.gif";
import { FormProvider, useForm1 } from "../context/formContext";
import kingLogo from "../img/king_logo.svg";
import { useState } from "react";
import toast from 'react-hot-toast';
let toastId: string | null = null;
// ✅ Now we receive formData as a parameter
async function fetchResponse(formData: any) {
  const formDataToSend = new FormData();
  formDataToSend.append("subject", formData.file);
  //formDataToSend.append("username", formData.name);
  //formDataToSend.append("gender", formData.gender);
  //formDataToSend.append("style", formData.style);
  if(formData.style == "K-Pop"){
    formDataToSend.append('expression', "K-pop Natural");
  }else if(formData.style == "K-Drama"){
    formDataToSend.append('expression', "K-Drama Serious");
  }else if(formData.style == "K-Foodie"){
    formDataToSend.append('expression', "K-foodie Happiness");
  }else{
    formDataToSend.append('expression', "k-manhwa Angry");
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

const blob = await res.blob();
const imageUrl = URL.createObjectURL(blob);
// Now you can pass dataUrl to your frontend

    return imageUrl;
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
  
  useEffect(() => {
    (async () => {
      console.log(new Date().toString());
      setStatus("starting");
      console.log("Upload Image:");
      const data = await fetchResponse(formData) || "";

   
      setImageUrl(data);
      console.log(data);
      updateForm("file",data);
      document.getElementById('downloadbtn')?.click();
    })();
  }, []);
 


  return (
    <div className={styles.download}>
      <div className={styles.gender_banner}>
        <img src={Grnderbanner.src} alt="Grnderbanner" />
        <img src={kingLogo.src} alt="kingLogo" className={styles.kingLogo} />
        <div className={styles.gender_title}>
          <h3 className={styles.gender_title_1}>Almost done!</h3>
          <h3 className={styles.gender_title_2}>Almost done!</h3>
        </div>
      </div>
      <div className={styles.all_most_done}>
        <img src={AlmostDone.src} alt="AlmostDone" />
        <h4>Your K-look is heating up</h4>
      </div>
      <div id="dwnBtnDiv" style={{ display: "none" }}>
        <CustomButton id="downloadbtn" text="Next" onClick={onNext} />
      </div>
    </div>
  );
}
