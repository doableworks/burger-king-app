import { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../../styles/pages/home.module.scss";

import React from "react";
import Slider from "react-slick";

import Grnderbanner from "../img/korean_art.jpg";
import kpopFemale from "../img/kpop_female.jpg";
import kpopMale from "../img/kpop_male.jpg";
import manhwaFemale from "../img/manhwa_female.jpg";
import manhwaMale from "../img/manhwa_male.jpg";
import foodieFemale from "../img/foodie_female.jpg";
import foodieMale from "../img/foodie_male.jpg";
import dramaFemale from "../img/drama_female.jpg";
import dramaMale from "../img/drama_male.jpg";
import PopFrame from "../img/Pop_fram.png";
import ManhwaFrame from "../img/Manhwa_fram.png";
import FoodieFrame from "../img/Foodie_fram.png";
import DramaFrame from "../img/Drama_fram.png";

export default function Avatar({ onNext, onBack }: { onNext: () => void; onBack: () => void }){
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [isAvatarSelected, setIsAvatarSelected] = useState(false);

  useEffect(() => {
    const storedGender = localStorage.getItem("selectedGender");
    setGender(storedGender);
    console.log("Stored gender:", storedGender);
  }, []);

  const handleAvatarClick = (frameSrc: string) => {
  localStorage.setItem("selectedAvatarFrame", frameSrc);
  setIsAvatarSelected(true);
  setSelectedFrame(frameSrc);
  console.log("Avatar frame stored:", frameSrc);
};

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    variableWidth: true,
    centerMode: true,
    focusOnSelect: true,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "ease-in-out",
    pauseOnFocus: false, // 👈 this keeps autoplay running even when focused
    pauseOnHover: false  // 👈 optional, in case you don't want hover to stop it
  };
    return(
      <div className={styles.avatar}>
        <div className={styles.gender_banner}>
            <img src={Grnderbanner.src} alt="Grnderbanner" />
            <div className={styles.gender_title}>
                <h3 className={styles.gender_title_1}>Pick Your K-Style <br/> Avatar</h3>
                <h3 className={styles.gender_title_2}>Pick Your K-Style <br/> Avatar</h3>
            </div>
        </div>
        {gender === "male" && (
          <div className={styles.avatar_slider}>
          <Slider {...settings}>
            <div className={`${styles.item} ${selectedFrame === PopFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(PopFrame.src)}>
              <img src={kpopMale.src} alt="Slider img" />
            </div>
            <div className={`${styles.item} ${selectedFrame === ManhwaFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(ManhwaFrame.src)}>
              <img src={manhwaMale.src} alt="Slider img" />
            </div>
            <div className={`${styles.item} ${selectedFrame === FoodieFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(FoodieFrame.src)}>
              <img src={foodieMale.src} alt="Slider img" />
            </div>
            <div className={`${styles.item} ${selectedFrame === DramaFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(DramaFrame.src)}>
              <img src={dramaMale.src} alt="Slider img" />
            </div>
          </Slider>
        </div>
        )}
        {gender === "female" && (
          <div className={styles.avatar_slider}>
            <Slider {...settings}>
              <div className={`${styles.item} ${selectedFrame === PopFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(PopFrame.src)}>
                <img src={kpopFemale.src} alt="Slider img" />
              </div>
              <div className={`${styles.item} ${selectedFrame === ManhwaFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(ManhwaFrame.src)}>
                <img src={manhwaFemale.src} alt="Slider img" />
              </div>
              <div className={`${styles.item} ${selectedFrame === FoodieFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(FoodieFrame.src)}>
                <img src={foodieFemale.src} alt="Slider img" />
              </div>
              <div className={`${styles.item} ${selectedFrame === DramaFrame.src ? styles.active : " "}`} onClick={() => handleAvatarClick(DramaFrame.src)}>
                <img src={dramaFemale.src} alt="Slider img" />
              </div>
            </Slider>
          </div>
        )}
        

        <div className={`${styles.btn_section_next_small} ${styles.padd_top}`}>
        <div
            className={styles.back}
            onClick={onBack}
          >
            back
          </div>
          <div
            id="nextBtn"
            onClick={() => {
              if (isAvatarSelected) {
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
        </div>
      </div>
    );
}