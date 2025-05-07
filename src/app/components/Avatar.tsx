import { useEffect, useState, useRef, } from "react";
import CustomButton from "./CustomButton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../../styles/pages/home.module.scss";

import React from "react";
import Slider from "react-slick";

import Grnderbanner from "../img/korean_art.jpg";
import kpopFemale from "../img/kpop_female.png";
import kpopMale from "../img/kpop_male.png";
import manhwaFemale from "../img/manhwa_female.png";
import manhwaMale from "../img/manhwa_male.jpg";
import foodieFemale from "../img/foodie_female.png";
import foodieMale from "../img/foodie_male.png";
import dramaFemale from "../img/drama_female.png";
import dramaMale from "../img/drama_male.png";
import PopFrame from "../img/Pop_fram.png";
import ManhwaFrame from "../img/Manhwa_fram.png";
import FoodieFrame from "../img/Foodie_fram.png";
import DramaFrame from "../img/Drama_fram.png";
import { FormProvider, useForm1 } from "../context/formContext";
import kingLogo from "../img/king_logo.svg";

export default function Avatar({ onNext, onBack }: { onNext: () => void; onBack: () => void }){
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [isAvatarSelected, setIsAvatarSelected] = useState(false);
  const { formData, updateForm } = useForm1();

  const audioRef = useRef<HTMLAudioElement | null>(null);
const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const storedGender = localStorage.getItem("selectedGender");
    setGender(storedGender);
    console.log("Stored gender:", storedGender);
  }, []);

  const handleAvatarClick = (frameSrc: string, avatar: string) => {
  localStorage.setItem("selectedAvatarFrame", frameSrc);
  setIsAvatarSelected(true);
  setSelectedFrame(frameSrc);
  console.log("Avatar frame stored:", frameSrc);
  updateForm("style",avatar);
  onNext();
};


const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
const lastCenterIndexRef = useRef<number | null>(null);

useEffect(() => {
  const interval = setInterval(() => {
    const slides = document.querySelectorAll(".slick-slide");
    slides.forEach((slide, index) => {
      const isCenter = slide.classList.contains("slick-center");
      const audio = audioRefs.current[index];

      if (isCenter) {
        // Only play if new center slide
        if (lastCenterIndexRef.current !== index) {
          lastCenterIndexRef.current = index;
          if (audio && audio.paused) {
            audio.play().catch((e) => console.warn("Play error", e));
          }
        }
      } else {
        if (audio && !audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    });
  }, 200); // every 200ms is fine

  return () => clearInterval(interval);
}, []);


{/* <audio ref={(el) => {
                audioRefs.current[0] = el;
              }}>
              <source src="K-Pop.mp3" type="audio/mp3" />
                Your browser does not support the audio element.
            </audio> */}


  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    variableWidth: true,
    centerMode: true,
    focusOnSelect: true,
    autoplay: false,
    autoplaySpeed: 2000,
    cssEase: "ease-in-out",
    pauseOnFocus: false, // 👈 this keeps autoplay running even when focused
    pauseOnHover: false  // 👈 optional, in case you don't want hover to stop it
  };
    return(
      <div className={styles.avatar}>
        <div className={styles.gender_banner}>
            <img src={Grnderbanner.src} alt="Grnderbanner" />
            <img src={kingLogo.src} alt="kingLogo" className={styles.kingLogo} />
            <div className={styles.gender_title}>
                <h3 className={styles.gender_title_1}>Pick Your K-Style <br/> Avatar</h3>
                <h3 className={styles.gender_title_2}>Pick Your K-Style <br/> Avatar</h3>
            </div>
        </div>
        {gender === "male" && (
          <div className={styles.avatar_slider}>
          <Slider {...settings}>
            <div className={`${styles.item} ${selectedFrame === PopFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(PopFrame.src, "K-Pop")}>

              <img src={kpopMale.src} alt="Slider img" />

              <div className={styles.frame_name_wrapper}>
                <div className={styles.frame_name_1}>
                  <h3>K-Pop<br/> Army</h3>
                </div>
                <div className={styles.frame_name_2}>
                  <h3>K-Pop<br/> Army</h3>
                </div>
              </div>
            </div>
            <div className={`${styles.item} ${selectedFrame === ManhwaFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(ManhwaFrame.src, "Manhwa")}>
              <img src={manhwaMale.src} alt="Slider img" />

              <div className={styles.frame_name_wrapper}>
                <div className={styles.frame_name_1}>
                  <h3>Manhwa<br/> Maniacs</h3>
                </div>
                <div className={styles.frame_name_2}>
                  <h3>Manhwa<br/> Maniacs</h3>
                </div>
              </div>
            </div>
            <div className={`${styles.item} ${selectedFrame === FoodieFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(FoodieFrame.src,"K-Foodie")}>
              <img src={foodieMale.src} alt="Slider img" />

              <div className={styles.frame_name_wrapper}>
                <div className={styles.frame_name_1}>
                  <h3>K-Foodie<br/> Fanatics</h3>
                </div>
                <div className={styles.frame_name_2}>
                <h3>K-Foodie<br/> Fanatics</h3>
                </div>
              </div>

            </div>
            <div className={`${styles.item} ${selectedFrame === DramaFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(DramaFrame.src, "K-Drama")}>
            
              <img src={dramaMale.src} alt="Slider img" />

              <div className={styles.frame_name_wrapper}>
                <div className={styles.frame_name_1}>
                  <h3>K-Drama<br/> Die-Hards</h3>
                </div>
                <div className={styles.frame_name_2}>
                <h3>K-Drama<br/> Die-Hards</h3>
                </div>
              </div>

            </div>
          </Slider>
        </div>
        )}
        {gender === "female" && (
          <div className={styles.avatar_slider}>
            <Slider {...settings}>
              <div className={`${styles.item} ${selectedFrame === PopFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(PopFrame.src, "K-Pop")}>
                <img src={kpopFemale.src} alt="Slider img" />
                <div className={styles.frame_name_wrapper}>
                <div className={styles.frame_name_1}>
                  <h3>K-Pop <br/> Army</h3>
                </div>
                <div className={styles.frame_name_2}>
                  <h3>K-Pop <br/> Army</h3>
                </div>
              </div>
              </div>
              <div className={`${styles.item} ${selectedFrame === ManhwaFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(ManhwaFrame.src, "Manhwa")}>
                <img src={manhwaFemale.src} alt="Slider img" />
                <div className={styles.frame_name_wrapper}>
                <div className={styles.frame_name_1}>
                  <h3>Manhwa <br/> Maniacs</h3>
                </div>
                <div className={styles.frame_name_2}>
                  <h3>Manhwa <br/> Maniacs</h3>
                </div>
              </div>
              </div>
              <div className={`${styles.item} ${selectedFrame === FoodieFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(FoodieFrame.src, "K-Foodie")}>
                <img src={foodieFemale.src} alt="Slider img" />
                <div className={styles.frame_name_wrapper}>
                <div className={styles.frame_name_1}>
                  <h3>K-Foodie <br/> Fanatics</h3>
                </div>
                <div className={styles.frame_name_2}>
                <h3>K-Foodie <br/> Fanatics</h3>
                </div>
              </div>
              </div>
              <div className={`${styles.item} ${selectedFrame === DramaFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(DramaFrame.src, "K-Drama")}>
                <img src={dramaFemale.src} alt="Slider img" />
                <div className={styles.frame_name_wrapper}>
                <div className={styles.frame_name_1}>
                  <h3>K-Drama <br/> Die-Hards</h3>
                </div>
                <div className={styles.frame_name_2}>
                <h3>K-Drama <br/> Die-Hards</h3>
                </div>
              </div>
              </div>
            </Slider>
          </div>
        )}
        

        {/* <div className={`${styles.btn_section_next_small} ${styles.padd_top}`}>
        <div
            className={styles.back}
            onClick={onBack}
          >
            back
          </div>
          <div
            id="nextBtn"
            onClick={() => {
              if (isAvatarSelected && formData.style) {
                onNext();
              } else {
                alert("Please select an avatar first!");
              }
            }}
            className={styles.next}
            style={{ opacity: isAvatarSelected ? 1 : 1, cursor: isAvatarSelected ? "pointer" : "not-allowed" }}
          >
            Next
          </div>
        </div> */}

          <div className={styles.tnc}>
            <h5>*T&C APPLY. TM & © 2025 BURGER KING COMPANY LLC. USED UNDER LICENSE.</h5>
          </div>
      </div>
    );
}