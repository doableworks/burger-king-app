
import { useState } from "react";
import CustomButton from "./CustomButton";
import styles from "../../styles/pages/home.module.scss";
import HeaderLogo from "../img/home_logo.png";
import HomeBanner from "../img/home_banner.png";
import DownArrow from "../img/down_arrow.png";
import KingLogo from "../img/king_logo.svg";
import CentrePhoto from "../img/centre_photo.png";
import { useForm } from "react-hook-form";


export default function HomePage({ onNext }: { onNext: () => void }) {
  const [userName, setUserName] = useState("");

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm();


const onSubmit = (data: any) => {
  setUserName(data.name);
  console.log("User Name stored in state:", data.name);
  onNext();
};
console.log(userName, "userName");

    
    return (
      <>
        <div className={styles.home_page_wrapper}>
          <div className={styles.Header_logo}>
            <img src={HeaderLogo.src} alt="logo" />
          </div>

          <div className={styles.home_banner}>
            <img src={HomeBanner.src} alt="HomeBanner" />
            <div className={styles.logo_banner}>
              <div className={styles.home_logo}>
                <img src={KingLogo.src} alt="HomeBanner" />
              </div>
              <div className={styles.home_center}>
                <img src={CentrePhoto.src} alt="HomeBanner" />
              </div>
            </div>
          </div>

          <div className={styles.banner_title}>
            <h4 className={styles.banner_title_text}>transform your photos into <br/> korean masterpieces.</h4>
          </div>
      
          <img src={DownArrow.src} className={styles.down_arrow} alt="DownArrow" />

          <div className={styles.home_avatar_section}>
            <h2 className={styles.home_avatar_1}>Unleash your <br/> avatar, K-STYLE!</h2>
            <h2 className={styles.home_avatar_2}>Unleash your <br/> avatar, K-STYLE!</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={`${styles.form}`}>
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
        {...register("name", { required: true })}
      />
      {errors.name && errors.name.type === "required" && (
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
      {userName ? (
      <button id="nextBtn" onClick={onNext} type="submit" className={styles.next}>
        Start Now
      </button>
    ) : (
      <button type="submit" className={styles.next}>
        Start Now
      </button>
    )}
  </div>
</form>

        </div>

     
       


        <div style={{bottom:0, width:'100%', display:'flex', justifyContent:'space-between', height:'54px', padding:'20px 12px', marginTop:'auto'}}>
            <span style={{
        fontFamily: 'Flame Sans',
        fontWeight: '400',
        fontSize: '12px',
        letterSpacing: '-2%',
        textAlign: 'center',
        color:'#FFFFFFB2'
    }}>Copyrights@2025</span>
            <span style={{
        fontFamily: 'Flame Sans',
        fontWeight: '400',
        fontSize: '12px',
        letterSpacing: '-2%',
        textAlign: 'center',
        color:'#FFFFFFB2'
    }}>Privacy policy</span>
            <span style={{
        fontFamily: 'Flame Sans',
        fontWeight: '400',
        fontSize: '12px',
        letterSpacing: '-2%',
        textAlign: 'center',
        color:'#FFFFFFB2'
    }}>Support</span>
        </div>
      </>
    );
  }
  