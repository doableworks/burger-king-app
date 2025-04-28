import React, { useEffect } from "react";
import CustomButton from "./CustomButton";
import styles from "../../styles/pages/home.module.scss";
import Grnderbanner from "../img/korean_art.jpg";
import AlmostDone from "../img/AlmostDone.gif";
import { FormProvider, useForm1 } from "../context/formContext";
import kingLogo from "../img/king_logo.svg";
import { useState } from "react";

// ✅ Now we receive formData as a parameter
async function fetchResponse(action: string, userimageurl: string, generatedimageurl: string, formData: any) {
  const formDataToSend = new FormData();
  formDataToSend.append("image", formData.file);
  formDataToSend.append("username", formData.name);
  formDataToSend.append("gender", formData.gender);
  formDataToSend.append("style", formData.style);
  formDataToSend.append("action", action);
  formDataToSend.append("userimageurl", userimageurl);
  formDataToSend.append("generatedimageurl", generatedimageurl);
  let prompt = "";
  if(formData.style == "K-Pop"){
    prompt = "K-pop manhwa style digital illustration of this image";
  }
  else if(formData.style == "K-Drama"){
    prompt = "K-Drama manhwa style digital illustration of this image";
  }else if(formData.style == "K-Foodie"){
    prompt = "K-Foodie manhwa style digital illustration of this image";
  }else {
    prompt = "Manhwa style digital illustration of this image";
  }

  try {
    const res = await fetch("/api/manhwa", {
      method: "POST",
      body: formDataToSend,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Server Error:", res.status, errorData);
      alert(`Error ${res.status}: ${errorData.error || "Unknown error"}`);
      return;
    }

    const data = await res.json();
    data.prompt = prompt;
    data.style = formData.style;
    return data;
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
      console.log("Upload Image:");
      const imageupload = await fetchResponse("uploadimage", "", "", formData);
      if (imageupload?.status === "Success") {
        await startJob(imageupload.url,imageupload.base_prompt, imageupload.name, imageupload.gender, imageupload.prompt, imageupload.style);
      }
    })();
  }, []);

  const startJob = async (imageurl:string, base_prompt:string,name:string, gender:string, prompt:string, style:string ) => {
    setStatus("starting");
    console.log("Image URL:", imageurl);
    //alert("Image URL: "+ imageurl);
    const res = await fetch("/api/job-start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: imageurl,
        prompt: prompt,
        username:name,
        gender:gender,
        base_prompt:base_prompt,
        style: style
      }),
    });
  
    const data = await res.json();
    console.log("Start Job Output",data);
    setJobId(data.jobId);
  };
  
  useEffect(() => {
    if (!jobId) return;
  
    const interval = setInterval(async () => {
      const res = await fetch(`/api/job-status?jobId=${jobId}`);
      const data = await res.json();
      
      setStatus(data.status);
  
      if (data.status === "success") {
        setImageUrl(data.result);
        clearInterval(interval);
        console.log(data.result);
        updateForm("file",data.result);
        document.getElementById('downloadbtn')?.click();
        
      } else if (data.status === "error") {
        alert("Something Went Wrong Please Try Again.");
        console.error(data.error);
        clearInterval(interval);
        window.location.reload();
      }
    }, 3000); // poll every 3 seconds
  
    return () => clearInterval(interval);
  }, [jobId]);

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
