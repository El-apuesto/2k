exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { text, voice = 'narrator' } = JSON.parse(event.body);
    
    if (!text) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Text is required' }) };
    }

    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'HF_TOKEN not configured' })
      };
    }

    console.log('Generating audio for text:', text.substring(0, 100) + '...');

    // Call HuggingFace API for text-to-speech
    const response = await fetch(
      'https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('HuggingFace TTS Error:', response.status, error);
      
      if (response.status === 503) {
        return {
          statusCode: 503,
          headers,
          body: JSON.stringify({ 
            error: 'Audio model is loading. Please wait and try again.'
          })
        };
      }
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to generate audio', 
          details: error 
        })
      };
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    console.log('Audio generated successfully, size:', audioBuffer.byteLength, 'bytes');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        audio: `data:audio/wav;base64,${base64Audio}`
      })
    };

  } catch (error) {
    console.error('Audio function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      })
    };
  }
};