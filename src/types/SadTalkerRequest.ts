export type SadTalkerRequest = {
  source_image: File
  driven_audio: File
  preprocess: "crop" | "resize" | "full" | "extcrop" | "extfull"
  still_mode: boolean
  use_enhancer: boolean
  batch_size: number
  size: 256 | 512
  pose_style: number
}
