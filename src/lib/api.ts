import type { SadTalkerRequest } from "../types/SadTalkerRequest"

export function buildFormData(data: SadTalkerRequest): FormData {
  const formData = new FormData()
  formData.append("source_image", data.source_image)
  formData.append("driven_audio", data.driven_audio)
  formData.append("preprocess", data.preprocess)
  formData.append("still_mode", String(data.still_mode))
  formData.append("use_enhancer", String(data.use_enhancer))
  formData.append("batch_size", data.batch_size.toString())
  formData.append("size", data.size.toString())
  formData.append("pose_style", data.pose_style.toString())
  return formData
}

export async function generateSadTalkerVideo(data: SadTalkerRequest): Promise<string> {
  const formData = buildFormData(data)

  const res = await fetch("http://localhost:8000/generate", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) throw new Error("Generation failed")

  const blob = await res.blob()
  return URL.createObjectURL(blob)
}