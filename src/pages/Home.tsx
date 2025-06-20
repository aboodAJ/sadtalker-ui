"use client"

import type React from "react"

import { useState } from "react"
import { generateSadTalkerVideo } from "../lib/api"
import type { SadTalkerRequest } from "../types/SadTalkerRequest"
import styles from "../styles/Home.module.css"

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Advanced options state
  const [preprocess, setPreprocess] = useState<"crop" | "resize" | "full" | "extcrop" | "extfull">("crop")
  const [stillMode, setStillMode] = useState(false)
  const [useEnhancer, setUseEnhancer] = useState(false)
  const [batchSize, setBatchSize] = useState(2)
  const [size, setSize] = useState<256 | 512>(256)
  const [poseStyle, setPoseStyle] = useState(0)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setError(null)
    }
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setError(null)
    }
  }

  const handleGenerate = async () => {
    if (!imageFile || !audioFile) {
      setError("Please upload both an image and an audio file.")
      return
    }

    setIsGenerating(true)
    setError(null)
    setVideoUrl(null)

    const data: SadTalkerRequest = {
      source_image: imageFile,
      driven_audio: audioFile,
      preprocess,
      still_mode: stillMode,
      use_enhancer: useEnhancer,
      batch_size: batchSize,
      size,
      pose_style: poseStyle,
    }

    try {
      const url = await generateSadTalkerVideo(data)
      setVideoUrl(url)
    } catch (err) {
      console.error(err)
      setError("Failed to generate video. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h1 className={styles.title}>SadTalker Video Generator</h1>
        <p className={styles.description}>Upload an image and audio file to generate a talking video</p>

        <div className={styles.uploadSection}>
          {/* Image Upload */}
          <div className={styles.uploadCard}>
            <div className={styles.uploadArea}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
                id="image-upload"
              />
              <label htmlFor="image-upload" className={styles.uploadLabel}>
                <div className={styles.uploadIcon}>📷</div>
                <div className={styles.uploadText}>{imageFile ? imageFile.name : "Upload Image"}</div>
                <div className={styles.uploadSubtext}>Click to select an image file</div>
              </label>
            </div>
          </div>

          {/* Audio Upload */}
          <div className={styles.uploadCard}>
            <div className={styles.uploadArea}>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className={styles.fileInput}
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className={styles.uploadLabel}>
                <div className={styles.uploadIcon}>🎵</div>
                <div className={styles.uploadText}>{audioFile ? audioFile.name : "Upload Audio"}</div>
                <div className={styles.uploadSubtext}>Click to select an audio file</div>
              </label>
            </div>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <button className={styles.advancedToggle} onClick={() => setShowAdvanced(!showAdvanced)}>
          Advanced Options {showAdvanced ? "▲" : "▼"}
        </button>

        {/* Advanced Options Panel */}
        {showAdvanced && (
          <div className={styles.advancedPanel}>
            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>Preprocess:</label>
              <select
                value={preprocess}
                onChange={(e) => setPreprocess(e.target.value as any)}
                className={styles.select}
              >
                <option value="crop">Crop</option>
                <option value="resize">Resize</option>
                <option value="full">Full</option>
                <option value="extcrop">Extended Crop</option>
                <option value="extfull">Extended Full</option>
              </select>
            </div>

            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>Size:</label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value) as 256 | 512)}
                className={styles.select}
              >
                <option value={256}>256px</option>
                <option value={512}>512px</option>
              </select>
            </div>

            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>Batch Size:</label>
              <input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                min="1"
                max="10"
                className={styles.numberInput}
              />
            </div>

            <div className={styles.optionGroup}>
              <label className={styles.optionLabel}>Pose Style:</label>
              <input
                type="number"
                value={poseStyle}
                onChange={(e) => setPoseStyle(Number(e.target.value))}
                min="0"
                max="10"
                className={styles.numberInput}
              />
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={stillMode}
                  onChange={(e) => setStillMode(e.target.checked)}
                  className={styles.checkbox}
                />
                Still Mode
              </label>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={useEnhancer}
                  onChange={(e) => setUseEnhancer(e.target.checked)}
                  className={styles.checkbox}
                />
                Use Enhancer
              </label>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !imageFile || !audioFile}
          className={styles.generateButton}
        >
          {isGenerating ? "Generating..." : "Generate Video"}
        </button>

        {/* Loading Indicator */}
        {isGenerating && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Generating your video, please wait...</p>
          </div>
        )}

        {/* Generated Video */}
        {videoUrl && (
          <div className={styles.videoSection}>
            <h2 className={styles.videoTitle}>Generated Video</h2>
            <video controls className={styles.video}>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <a href={videoUrl} download="sadtalker-video.mp4" className={styles.downloadButton}>
              Download Video
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
