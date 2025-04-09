import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = 'https://rstoqslkyzlydtamvdnn.supabase.co';  // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdG9xc2xreXpseWR0YW12ZG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NjQ5MjIsImV4cCI6MjA1NjI0MDkyMn0.hy38O849pB4Mlb8y_PqK7-OqqZiPTv79YnOV7xYOxD4'; // Replace with your Supabase public anon key
const supabase = createClient(supabaseUrl, supabaseKey);

function Transcribe() {
  const [audioFile, setAudioFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responsesArray, setResponsesArray] = useState([]);  // State for storing an array of responses

  const [newGeneration, setNewGeneration] = useState('');  // State for new_generation

  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const uploadAudioFile = async (file) => {
    const sanitizedFileName = file.name.replace(/[^\w\s]/gi, '_').replace(/\s+/g, '_'); 
const filePath = `${Date.now()}-${sanitizedFileName}`; 
console.log('filePath', filePath);

    try {
      const { data, error } = await supabase.storage
        .from('audio')
        .upload(filePath, audioFile);

        console.log('we are here------>  1');

        console.log('Upload response:', data);  // Log data returned from upload
    console.log('Supabase upload error:', error);

        if (error) {
            console.error("Supabase upload error:", error);
            throw new Error('Error uploading audio to Supabase');
          }

          console.log('we are here------>  2');

      // Get the public URL of the uploaded file
    //   const { publicURL, error: urlError } = supabase.storage
    //     .from('audio')
    //     .getPublicUrl(data.fullPath);

    //     console.log('we are here------>  3');

    //   if (urlError) {
    //     console.log('we are here------>  4');
    //     console.log('Error retriving url', urlError);
        
    //     throw new Error('Error retrieving public URL from Supabase');
    //   }

      console.log('we are here------>  5');


      const publicURL = `https://rstoqslkyzlydtamvdnn.supabase.co/storage/v1/object/public/${data.fullPath}`
      
      console.log('publicURL',publicURL);

      return publicURL; 
    } catch (err) {
      console.error(err);
      throw new Error('Error uploading audio to Supabase');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!audioFile) {
      alert('Please select an audio file!');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const audioUrl = await uploadAudioFile(audioFile);

      const apiKey = 'ww-9CTz77OQJ36ebmDirGWUvxSyOMbrai47CiFq3JhAFKEPFpUyOUcdM5';
      const requestBody = {
        inputs: {
          voice_over: {
            type: 'audio',
            audio_url: audioUrl, 
            transcript: "Your transcript here"
          }
        },
        version: '^1.0'
      };

      const response = await axios.post(
        'https://cors-anywhere.herokuapp.com/https://app.wordware.ai/api/released-app/d563e981-8c21-4b38-8201-45f319e4aac9/run',
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json', 
          },
        }
      );

      setLoading(false);
      setResponse(response.data);
      console.log(response);

      setResponsesArray((prev)=> [...prev, response.data])

      const responseValue = response.data.trim().split('\n');

      let parsedChunks = responseValue.map(chunk => JSON.parse(chunk));


      console.log('responseValue', responseValue);
      console.log('parsedChunks', parsedChunks);
      console.log('parsedChunks length', parsedChunks[parsedChunks.length-1].value.values.new_generation);

      const cleanText = parsedChunks[parsedChunks.length-1].value.values['Speech-to-text with Deepgram'].output.transcript
      console.log('actual audio--->', cleanText);

      const cleanedTranscript = cleanText.replace(/^\n?Speaker \d+: /, '').trim();

      console.log(cleanedTranscript);
      
      // const transcript =
      //   response.data?.find(chunk => chunk.value?.type === 'tool' && chunk.value?.label === 'Speech-to-text with Deepgram')?.value?.output?.transcript || '';
      // const newGeneration =
      //   response.data?.find(chunk => chunk.value?.type === 'generation' && chunk.value?.label === 'new_generation')?.value || '';
      
      setNewGeneration(parsedChunks[parsedChunks.length-1].value.values.new_generation);
      
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
          <div>
            <h2>Audio Summary:</h2>
            <p>{newGeneration}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transcribe;