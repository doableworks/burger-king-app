import { useRef, useState } from "react";
import { CheckCircle, RotateCcw } from "lucide-react";
import CustomButton from "./CustomButton";
import styles from "../../styles/pages/home.module.scss";
import Grnderbanner from "../img/korean_art.jpg";
import Camera from "../img/camera.png";
import Star from "../img/star.png";

export default function FileUpload({ onNext, onBack }: { onNext: () => void; onBack: () => void }){
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewURL(URL.createObjectURL(selectedFile));
    }
  };

    return(<div className={styles.file_upload}>
      <div className={styles.gender_banner}>
            <img src={Grnderbanner.src} alt="Grnderbanner" />
            <div className={styles.gender_title}>
                <h3 className={styles.gender_title_1}>Say “Kimchi”</h3>
            </div>
      </div>
      <div className={styles.take_selfie_wrapper}>
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
        {/* <div className={styles.take_selfie}>
            <div className={styles.box_selfie}>
            <div>
            <img src={Camera.src} alt="Camera" />
            <h6>Click to upload</h6>
            </div>
            </div>
            </div> */}

         <div className={styles.take_selfie}>
            <h4>OR</h4>
          {!file ? (
            <div className={styles.box_selfie} onClick={handleClick}>
              <div>
                <img src={Camera.src} alt="Camera" />
                <h6>Click to upload</h6>
              </div>
            </div>
          ) : (
            <div className={styles.upload_preview}>
              <div className={styles.preview_card}>
                <img className={styles.preview_img} src={previewURL || ""} alt="Preview" />
                <span className={styles.filename}>{file.name}</span>
                <CheckCircle size={20} color="green" className={styles.icon} />
                <RotateCcw size={20} onClick={handleClick} className={styles.icon} />
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div className={styles.btn_section_next_small}>
      <div
            className={styles.back}
            onClick={onBack}
          >
            back
          </div>
          <div
            id="nextBtn"
            onClick={() => {
              if (file) {
                onNext();
              } else {
                alert("Please upload a selfie first!");
              }
            }}
            className={styles.next}
            style={{
              opacity: file ? 1 : 1,
              cursor: file ? "pointer" : "not-allowed"
            }}
          >
            Next
          </div>
      </div>
    </div>);
}