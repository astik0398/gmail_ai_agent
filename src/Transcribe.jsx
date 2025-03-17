import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Initialize Supabase client
const supabaseUrl = 'https://rstoqslkyzlydtamvdnn.supabase.co';  // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdG9xc2xreXpseWR0YW12ZG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NjQ5MjIsImV4cCI6MjA1NjI0MDkyMn0.hy38O849pB4Mlb8y_PqK7-OqqZiPTv79YnOV7xYOxD4'; // Replace with your Supabase public anon key
const supabase = createClient(supabaseUrl, supabaseKey);

function Transcribe() {
  const [audioFile, setAudioFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

//   // Upload the file to Supabase and get the public URL
//   const uploadAudioFile = async (file) => {
//     const sanitizedFileName = file.name.replace(/[^\w\s]/gi, '_').replace(/\s+/g, '_');  // Sanitizing the file name
// const filePath = `audio-files/${Date.now()}-${sanitizedFileName}`;  // Unique file name

//     try {
//       // Upload the file to Supabase storage
//       const { data, error } = await supabase.storage
//         .from('audio')  // Replace 'audio' with the name of your storage bucket
//         .upload(filePath, file);

//       if (error) {
//         throw new Error('Error uploading audio to Supabase');
//       }

//       // Get the public URL of the uploaded file
//       const { publicURL, error: urlError } = supabase.storage
//         .from('audio')
//         .getPublicUrl(filePath);

//       if (urlError) {
//         throw new Error('Error retrieving public URL from Supabase');
//       }

//       return publicURL; // Return the public URL of the uploaded file
//     } catch (err) {
//       console.error(err);
//       throw new Error('Error uploading audio to Supabase');
//     }
//   };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!audioFile) {
      alert('Please select an audio file!');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Step 1: Upload the audio file to Supabase and get the audio URL
    //   const audioUrl = await uploadAudioFile(audioFile);

      // Step 2: Send the audio URL to Wordware API
      const apiKey = 'ww-9CTz77OQJ36ebmDirGWUvxSyOMbrai47CiFq3JhAFKEPFpUyOUcdM5'; // Replace with your Wordware API key
      const requestBody = {
        inputs: {
          voice_over: {
            type: 'audio',
            audio_url: "https://rstoqslkyzlydtamvdnn.supabase.co/storage/v1/object/public/audio//sampleAudio.mp3", // Use the audio URL from Supabase
            transcript: "Your transcript here" // Optional, add your transcript text
          }
        },
        version: '^1.0'
      };

      // Step 3: Make the request to the Wordware API
      const response = await axios.post(
        'https://cors-anywhere.herokuapp.com/https://app.wordware.ai/api/released-app/d563e981-8c21-4b38-8201-45f319e4aac9/run',
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json', // Sending JSON data
          },
        }
      );

      setLoading(false);
      setResponse(response.data);
      console.log(response.data);
      
    } catch (error) {
      setLoading(false);
      setError('Error uploading audio to Wordware');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Upload Audio File to Wordware</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={loading}>Upload</button>
      </form>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {response && (
        <div>
          <h2>Response from Wordware:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Transcribe;
