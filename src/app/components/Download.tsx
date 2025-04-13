
import CustomButton from "./CustomButton";
import styles from "../../styles/pages/home.module.scss";
import Grnderbanner from "../img/korean_art.jpg";
import AlmostDone from "../img/almostDone.png";
export default function Download({ onNext }: { onNext: () => void }){
    return(
    <div className={styles.download}>
        <div className={styles.gender_banner}>
              <img src={Grnderbanner.src} alt="Grnderbanner" />
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