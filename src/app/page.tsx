'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import FlowManager from '@/app/components/FlowManager';
import styles from "../styles/pages/home.module.scss";



export default function Home() {

  return (
    <div className={styles.homePage}>
      <FlowManager ></FlowManager>
    </div>
    
    // <div className="p-6">
    //   <form onSubmit={handleUpload} className="space-y-4">
    //     <input type="file" name="image" id="image" accept="image/*" />
    //     <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
    //       Generate Manhwa Image
    //     </button>
    //     <div>
    //     <button onClick={handleClick}>Go to About Page</button>
    //   </div>
    //   </form>

      

    //   {loading && <p>Processing image...</p>}
    //   {imageUrl && (
    //     <div className="mt-6">
    //       <p>🎨 Generated Image:</p>
    //       <img src={imageUrl} alt="Manhwa Style" className="rounded shadow-lg mt-2" />
    //     </div>
    //   )}
    // </div>
  )
}
