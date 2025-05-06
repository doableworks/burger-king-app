import { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import styles from "../../styles/pages/home.module.scss";
import HeaderLogo from "../img/home_logo.png";
import HomeBanner from "../img/home_banner.png";
import DownArrow from "../img/down_arrow.png";
import KingLogo from "../img/king_logo.svg";
import CentrePhoto from "../img/centre_photo.gif";
import { useForm } from "react-hook-form";
import { FormProvider, useForm1 } from "@/app/context/formContext";

export default function HomePage({ onNext }: { onNext: () => void }) {
  const [userName, setUserName] = useState("");
  const [musicPlayed, setMusicPlayed] = useState(false); // ✅ Initially false to show Play Music button

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const { formData, updateForm } = useForm1();

  const onSubmit = (data: any) => {
    setUserName(data.name);
    updateForm("name", data.name);
    console.log("User Name stored in state:", data.name);
    onNext();
  };

  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  useEffect(() => {
    // Function to load and store the audio file URL in localStorage
    const loadAudioFile = () => {
      const audioFile = '/K-Pop.mp3'; // This should be relative to the public directory

      // Check if the file is not already stored in localStorage
      if (!localStorage.getItem('audioFile')) {
        localStorage.setItem('audioFile', audioFile); // Save the file URL in localStorage
      }

      setAudioSrc(localStorage.getItem('audioFile') || audioFile); // Set the audio source state
    };

    loadAudioFile();
  }, []);

  return (
    <>
      <div className={styles.home_page_wrapper}>
        {/* <div className={styles.Header_logo}>
          <img src={HeaderLogo.src} alt="logo" />
        </div> */}

        <div className={styles.home_banner}>
          <img src={HomeBanner.src} alt="HomeBanner" />
          <div className={styles.logo_banner}>
            <div className={styles.home_logo}>
              <img src={KingLogo.src} alt="KingLogo" />
            </div>
            <div className={styles.home_center}>
              <img src={CentrePhoto.src} alt="CentrePhoto" />
            </div>
          </div>
        </div>

        <div className={styles.banner_title}>
          <h4 className={styles.banner_title_text}>
            transform your photos into <br />
            korean masterpieces.
          </h4>
        </div>

        <img
          src={DownArrow.src}
          className={styles.down_arrow}
          alt="DownArrow"
        />

      {/*  <div className={styles.home_avatar_section}>
          <h2 className={styles.home_avatar_1}>
            Unleash your <br /> avatar, K-STYLE!
          </h2>
          <h2 className={styles.home_avatar_2}>
            Unleash your <br /> avatar, K-STYLE!
          </h2>
        </div> */}

        {/* <form onSubmit={handleSubmit(onSubmit)} className={`${styles.form}`}>
          <div className={styles.formGroupSection}>
            <div className={styles.formGroup}>
              <label className={`${styles.lable_text}`}>
                Enter name<span>*</span>
              </label>
              <input
                className={`${styles.input} text_xs`}
                type="text"
                id="name"
                placeholder="Enter name"
                {...register("name", {
                  required: true,
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters are allowed",
                  },
                })}
                onKeyDown={(e) => {
                  const isLetterOrSpace = /^[a-zA-Z\s]$/.test(e.key);
                  if (
                    !isLetterOrSpace &&
                    e.key !== "Backspace" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault(); // Block non-alphabet keys
                  }
                }}
              />
              {errors.name?.type === "required" && (
                <label className={styles.error}>This field is required</label>
              )}
            </div>
          </div>

          <div className={styles.formGroupSection}>
            <div className={`${styles.formGroup} ${styles.check_box}`}>
              <input
                type="checkbox"
                id="terms"
                {...register("terms", { required: "This field is required" })}
              />
              {errors.terms && (
                <label className={styles.error}>This field is required</label>
              )}
              <label className={styles.agree} htmlFor="terms">
                I agree to receive updates from Burger King
              </label>
            </div>
          </div>

          <div className={`${styles.btn_section_next}`}>
            <button type="submit" className={styles.next}>
              Start Now
            </button>
          </div>
        </form> */}

<div className={`${styles.btn_section_next}`} onClick={() => {
                onNext();
            }}>
            <button type="submit" className={styles.next}>
              Start Now
            </button>
            <div className={`${styles.tnc} ${styles.pt_10}`}>
              <h6>TnC Apply</h6>
            </div>
          </div>
         
      </div>
    </>
  );
}
