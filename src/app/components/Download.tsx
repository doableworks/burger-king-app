
import CustomButton from "./CustomButton";
import styles from "../../styles/pages/home.module.scss";
import Grnderbanner from "../img/korean_art.jpg";
import AlmostDone from "../img/almostDone.png";
import { FormProvider, useForm1 } from "../context/formContext";

import kingLogo from "../img/king_logo.svg";
export default function Download({ onNext }: { onNext: () => void }){

  (async () => {
    const { formData, updateForm } = useForm1();
  
    console.log("Name: ", formData.name);
    console.log("Gender: ", formData.gender);
    console.log("Style: ", formData.style);
    console.log("File: ", formData.file);
  
    const formDataToSend = new FormData();
  
    formDataToSend.append("image", formData.file);
    formDataToSend.append("username", formData.name);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("style", formData.style);
  
    try {
      const res = await fetch("/api/manhwa", {
        method: "POST",
        body: formDataToSend,
      });
  
      console.log(res);
  
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Server Error:", res.status, errorData);
        alert(`Error ${res.status}: ${errorData.error || "Unknown error"}`);
        return;
      }
  
      const data = await res.json();
      console.log(data);
      updateForm("file",data.url);
      document.getElementById("downloadbtn")?.click();

    } catch (error) {
      console.error("Request failed:", error);
      alert("An error occurred while submitting the form.");
    }
  })();
  
  
  




    return(
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

        
      </div>);
}