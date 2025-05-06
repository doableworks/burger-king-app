import { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import styles from "../../styles/pages/home.module.scss";
import Grnderbanner from "../img/korean_art.jpg";
import Male from "../img/male.png";
import Female from "../img/female.png";
import GenderBg from "../img/gender_bg.png";
import { FormProvider, useForm1 } from '@/app/context/formContext'; // ✅
import kingLogo from "../img/king_logo.svg";

interface GenderProps {
    onNext: (gender: string) => void;
  }

export default function Gender({ onNext }: { onNext: () => void }){
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const { formData, updateForm } = useForm1();
    /** handleSelectGender */
    const handleSelectGender = (gender: string) => {
        setSelectedGender(gender);
        localStorage.setItem("selectedGender", gender); 
        updateForm("gender", gender);
        onNext();
      };
    // const handleSelectGender = (gender: string) => {
    //   setSelectedGender(gender);
    //   localStorage.setItem("selectedGender", gender); 
    //   updateForm("gender",gender);
    // };

    return(
    <div className={styles.gender}>
        <div className={styles.gender_banner}>
            <img src={Grnderbanner.src} alt="Grnderbanner" />
            <img src={kingLogo.src} alt="kingLogo" className={styles.kingLogo} />
            <div className={styles.gender_title}>
                <h3 className={styles.gender_title_1}>Choose Your K-Vibe!</h3>
                <h3 className={styles.gender_title_2}>Choose Your K-Vibe!</h3>
            </div>
        </div>
        <div className={styles.gender_section}>
            <div className={`${styles.gender_male} ${selectedGender === "male" ? styles.active : ""}`}
                onClick={() => handleSelectGender("male")}
                >
                <img src={GenderBg.src} alt="Gender background" className={styles.GenderBg} />
                <img src={Male.src} alt="Male" className={styles.Male} />
                <h3>Male</h3>
            </div>
            <div className={`${styles.gender_female} ${selectedGender === "female" ? styles.active : ""}`}
                onClick={() => handleSelectGender("female")}
                >
                <img src={GenderBg.src} alt="Gender background" className={styles.GenderBg} />
                <img src={Female.src} alt="Female" className={styles.Male} />
                <h3>Female</h3>
            </div>
        </div>
        <div className={styles.tnc}>
            <h5>TnC Apply</h5>
        </div>

        {/* <div className={styles.btn_section_next_small}>
            <div id="nextBtn"
                onClick={selectedGender ? onNext : undefined}
                className={styles.next}
                >
                Next
            </div>
        </div> */}
    </div>);
}