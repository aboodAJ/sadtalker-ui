# sadtalker_api.py
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from src.gradio_demo import SadTalker
import uuid, os, shutil

app = FastAPI()

# Optional: enable CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load SadTalker model once
sadtalker = SadTalker(checkpoint_path='checkpoints', config_path='src/config', lazy_load=True)

@app.post("/generate")
async def generate(
    source_image: UploadFile = File(...),
    driven_audio: UploadFile = File(...),
    preprocess: str = Form('crop'),
    still_mode: bool = Form(False),
    use_enhancer: bool = Form(False),
    batch_size: int = Form(2),
    size: int = Form(256),
    pose_style: int = Form(0)
):
    temp_id = str(uuid.uuid4())
    temp_dir = os.path.join("temp", temp_id)
    os.makedirs(temp_dir, exist_ok=True)

    img_path = os.path.join(temp_dir, source_image.filename)
    with open(img_path, "wb") as f:
        shutil.copyfileobj(source_image.file, f)

    audio_path = os.path.join(temp_dir, driven_audio.filename)
    with open(audio_path, "wb") as f:
        shutil.copyfileobj(driven_audio.file, f)

    result_path = sadtalker.test(
        source_image=img_path,
        driven_audio=audio_path,
        preprocess=preprocess,
        still_mode=still_mode,
        use_enhancer=use_enhancer,
        batch_size=batch_size,
        size=size,
        pose_style=pose_style,
        result_dir="results"
    )

    return FileResponse(result_path, media_type="video/mp4", filename="talking_head.mp4")
