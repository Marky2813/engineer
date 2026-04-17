import fs from "fs"; 
import dotenv from 'dotenv'
dotenv.config()

async function encodeImageToBase64(imagePath) {
  const imageBuffer = await fs.promises.readFile(imagePath);
  const base64Image = imageBuffer.toString('base64');
  return `data:image/jpeg;base64,${base64Image}`;
}

// Read and encode the image
const imagePath = "C:/Users/Sarthak/Downloads/weightTransformation.jpeg";
const base64Image = await encodeImageToBase64(imagePath);


const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.API_KEY_REF}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'google/gemini-3.1-flash-image-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `A hyper-realistic full-body portrait of the subject from the reference image(he is 6ft tall, current weight 150kg), now with a slim physique(target weight 100kg). Maintain the identical facial bone structure, jawline, and specific facial features of the subject. Also ensure that the weight loss is consistent throughout the body structure. He is standing confidently in a modern, high-end gym lobby with subtle, cinematic overhead lighting. Authentic skin tones with natural pores and sweat glisten. Neutral, authentic facial expression. 8k resolution, shot on 35mm lens, highly detailed textures, realistic muscle definition without exaggeration.`,
          },
          {
            type: 'image_url',
            image_url: {
              url: base64Image,
            },
          },
        ],
      },
    ],
    modalities: ['image', 'text'], 
    image_config: {
      aspect_ratio: '9:16',
      image_size: '4K',
    }
  }),
});

const result = await response.json();
if (result.choices) {
  const message = result.choices[0].message;
  if (message.images) {
    message.images.forEach(async (image, index) => {
      const imageUrl = image.image_url.url;
      const buffer = Buffer.from(imageUrl.split(",")[1], 'base64');
      console.log("iomage")
      await fs.promises.writeFile('output.jpeg', buffer, (err, call) => {
        if(err) throw err; 
        console.log("file saved!"); 
      })
    });
  }
}
