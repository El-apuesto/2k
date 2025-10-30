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
    const { prompt } = JSON.parse(event.body);
    
    if (!prompt) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Prompt is required' }) };
    }

    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'HF_TOKEN not configured' })
      };
    }

    console.log('Generating image with prompt:', prompt.substring(0, 50) + '...');

    // Call HuggingFace API with FLUX.1-schnell model
    const response = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            guidance_scale: 7.5,
            num_inference_steps: 25,
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('HuggingFace API Error:', response.status, error);
      
      if (response.status === 503) {
        return {
          statusCode: 503,
          headers,
          body: JSON.stringify({ 
            error: 'Model is loading. Please wait a moment and try again.',
            details: 'The AI model is starting up. This usually takes 20-30 seconds.'
          })
        };
      }
      
      if (response.status === 429) {
        return {
          statusCode: 429,
          headers,
          body: JSON.stringify({ 
            error: 'Rate limit exceeded. Please wait a moment.',
            details: 'Too many requests. Please wait a minute and try again.'
          })
        };
      }
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to generate image', 
          details: error 
        })
      };
    }

    // Get image as array buffer
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    console.log('Image generated successfully, size:', imageBuffer.byteLength, 'bytes');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        image: `data:image/png;base64,${base64Image}`
      })
    };

  } catch (error) {
    console.error('Function error:', error);
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