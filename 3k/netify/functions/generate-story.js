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
    const { prompt, style, characters, numScenes = 3 } = JSON.parse(event.body);
    
    if (!prompt) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Prompt is required' }) };
    }

    // FIXED: Removed VITE_ prefix for Netlify Functions (backend)
    const GROK_API_KEY = process.env.GROK_API_KEY;

    if (!GROK_API_KEY) {
      console.error('GROK_API_KEY is not configured in environment variables');
      return { 
        statusCode: 500, 
        headers, 
        body: JSON.stringify({ error: 'Grok API key not configured' }) 
      };
    }

    console.log('Calling Grok API with prompt:', prompt);

    // Call Grok API using native fetch (Node.js 18+)
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'user',
            content: `Create a ${numScenes}-scene story about: ${prompt}. Style: ${style}. Characters: ${characters}. Return as valid JSON with "title" and "scenes" array where each scene has "description" and "imagePrompt".`
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error:', response.status, errorText);
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    const storyContent = data.choices[0].message.content;

    // Try to parse the response as JSON, fallback if it fails
    let storyData;
    try {
      storyData = JSON.parse(storyContent);
    } catch (e) {
      console.log('Failed to parse Grok response as JSON, using fallback');
      storyData = generateFallbackStory(prompt, style, characters, numScenes);
    }

    console.log('Story generated successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(storyData)
    };

  } catch (error) {
    console.error('Function error:', error);
    
    // Fallback on any error
    const { prompt, style, characters, numScenes = 3 } = JSON.parse(event.body);
    const fallbackStory = generateFallbackStory(prompt, style, characters, numScenes);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(fallbackStory)
    };
  }
};

function generateFallbackStory(prompt, style, characters, numScenes) {
  const scenes = [];
  for (let i = 0; i < numScenes; i++) {
    scenes.push({
      description: `Scene ${i + 1}: An exciting moment in the story about ${prompt}, featuring ${characters} in ${style} style.`,
      imagePrompt: `${prompt}, ${style} style, ${characters}, dynamic scene ${i + 1}, detailed, cinematic`
    });
  }

  return {
    title: `Adventure: ${prompt}`,
    scenes: scenes,
    generatedWith: 'fallback'
  };
}