
import CustomButton from "./CustomButton";
import styles from "../../styles/pages/home.module.scss";
import Grnderbanner from "../img/korean_art.jpg";
import Camera from "../img/camera.png";
import Star from "../img/star.png";
export default function Personal({ onNext }: { onNext: () => void }){
    return(
      <div className={styles.personal}>
        <div className={styles.gender_banner}>
              <img src={Grnderbanner.src} alt="Grnderbanner" />
              <div className={styles.gender_title}>
                  <h3 className={styles.gender_title_1}>Say “Kimchi”</h3>
              </div>
        </div>
        <div className={styles.take_selfie}>
        <div className={styles.star_text}>
              <img src={Star.src} alt="Star" />
              <h5>Make sure your face is front-facing</h5>
            </div>
          <div className={styles.box_selfie}>
            <div>
                <img src={Camera.src} alt="Camera" />
                <h6>Take a selfie</h6>
            </div>
          </div>
        </div>
        <CustomButton id="personalbtn" text="Next" onClick={onNext} />
      </div>
    );
}