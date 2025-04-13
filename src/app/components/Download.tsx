
import CustomButton from "./CustomButton";
import styles from "../../styles/pages/home.module.scss";
import Grnderbanner from "../img/korean_art.jpg";
import AlmostDone from "../img/almostDone.png";

import kingLogo from "../img/king_logo.svg";
export default function Download({ onNext }: { onNext: () => void }){
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
        <CustomButton id="downloadbtn" text="Next" onClick={onNext}></CustomButton>
      </div>);
}