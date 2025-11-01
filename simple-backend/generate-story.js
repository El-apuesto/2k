exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { prompt } = JSON.parse(event.body);
    if (!prompt) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Prompt is required' }) };

    const storyData = {
      title: `Story: ${prompt}`,
      scenes: [
        { description: `Once upon a time, there was a story about ${prompt}.`, imagePrompt: `${prompt}, simple illustration` },
        { description: `The story continued with exciting developments about ${prompt}.`, imagePrompt: `${prompt}, action scene` },
        { description: `And they all lived happily ever after in the world of ${prompt}.`, imagePrompt: `${prompt}, happy ending` }
      ],
      generatedWith: 'simple'
    };

    return { statusCode: 200, headers, body: JSON.stringify(storyData) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
