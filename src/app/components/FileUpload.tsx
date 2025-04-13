import { useRef, useState, useEffect } from "react";
import { CheckCircle, RotateCcw } from "lucide-react";
import styles from "../../styles/pages/home.module.scss";
import Grnderbanner from "../img/korean_art.jpg";
import Camera from "../img/camera.png";
import Star from "../img/star.png";

export default function FileUpload({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleSelfieClick = () => {
    if (!isMobile) {
      alert("Camera upload only works on a mobile device.");
    }
    selfieInputRef.current?.click();
  };

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadPreview(URL.createObjectURL(file));
    }
  };

  const finalFile = selfieFile || uploadFile;

  return (
    <div className={styles.file_upload}>
      <div className={styles.gender_banner}>
        <img src={Grnderbanner.src} alt="Grnderbanner" />
        <div className={styles.gender_title}>
          <h3 className={styles.gender_title_1}>Say “Kimchi”</h3>
        </div>
      </div>

      <div className={styles.take_selfie_wrapper}>
        {/* Selfie Option */}
        <div className={styles.take_selfie}>
          <div className={styles.star_text}>
            <img src={Star.src} alt="Star" />
            <h5>Make sure your face is front-facing</h5>
          </div>

          {!selfieFile ? (
            <div className={styles.box_selfie} onClick={handleSelfieClick}>
              <div>
                <img src={Camera.src} alt="Camera" />
                <h6>Take a selfie</h6>
              </div>
            </div>
          ) : (
            <div className={styles.upload_preview}>
              <div className={styles.preview_card}>
                <img className={styles.preview_img} src={selfiePreview || ""} alt="Preview" />
                <span className={styles.filename}>{selfieFile.name}</span>
                <CheckCircle size={20} color="green" className={styles.icon} />
                <RotateCcw size={20} onClick={handleSelfieClick} className={styles.icon} />
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            capture="user"
            ref={selfieInputRef}
            onChange={handleSelfieChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Upload Option */}
        <div className={styles.take_selfie}>
          <h4>OR</h4>

          {!uploadFile ? (
            <div className={styles.box_selfie} onClick={handleUploadClick}>
              <div>
                <img src={Camera.src} alt="Camera" />
                <h6>Click to upload</h6>
              </div>
            </div>
          ) : (
            <div className={styles.upload_preview}>
              <div className={styles.preview_card}>
                <img className={styles.preview_img} src={uploadPreview || ""} alt="Preview" />
                <span className={styles.filename}>{uploadFile.name}</span>
                <CheckCircle size={20} color="green" className={styles.icon} />
                <RotateCcw size={20} onClick={handleUploadClick} className={styles.icon} />
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={uploadInputRef}
            onChange={handleUploadChange}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className={styles.btn_section_next_small}>
        <div className={styles.back} onClick={onBack}>
          back
        </div>
        <div
          id="nextBtn"
          onClick={() => {
            if (finalFile) {
              onNext();
            } else {
              alert("Please upload a selfie or a file first!");
            }
          }}
          className={styles.next}
          style={{
            opacity: finalFile ? 1 : 1,
            cursor: finalFile ? "pointer" : "not-allowed",
          }}
        >
          Next
        </div>
      </div>
    </div>
  );
}
