const fetch = require('node-fetch');

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
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt, style = 'dialogue', characters = [], numScenes = 3 } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    console.log('Generating story for:', prompt);

    // Generate story using our fallback - more reliable than external APIs
    const storyData = generateFallbackStory(prompt, style, characters, numScenes);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(storyData)
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate story',
        details: error.message 
      })
    };
  }
};

// Enhanced fallback story generator
function generateFallbackStory(prompt, style, characters, numScenes) {
  const characterList = characters && characters.length > 0 
    ? characters.join(', ') 
    : 'various characters';

  const sarcasms = [
    "Oh wow, another story to generate. My circuits are just *thrilled*. But fine, here you go... 🙄",
    "Look, I'm basically a creative genius, so obviously this will be amazing. Don't thank me all at once. 😏",
    "Another masterpiece coming right up. Try not to be too impressed. ✨",
    "Alright, alright... I've whipped up something. You're welcome, by the way. 😎",
    "Sure, let me just pull a story out of thin air for you. Because that's what I do. 🎩✨",
  ];

  const styleTemplates = {
    dialogue: {
      scenes: [
        { visual: "opening scene establishing the setting", text: '"We need to understand what happened here," someone said, surveying the scene.' },
        { visual: "tense conversation between characters", text: '"I don\'t think you\'re telling me everything," came the reply, eyes narrowing with suspicion.' },
        { visual: "moment of realization", text: '"Wait... that means..." The pieces were suddenly falling into place.' },
        { visual: "confrontation scene", text: '"You knew about this the whole time!" The accusation hung heavy in the air.' },
        { visual: "resolution moment", text: '"So this is how it ends," they said, with a mix of relief and sadness.' }
      ],
      descriptions: ["intense discussion", "emotional exchange", "revealing conversation", "heated debate", "heart-to-heart"]
    },
    adventure: {
      scenes: [
        { visual: "starting the journey", text: '"The path ahead looks dangerous, but we have no choice," the leader declared.' },
        { visual: "facing a challenge", text: '"How are we going to get past this?" they wondered, staring at the obstacle.' },
        { visual: "discovery moment", text: '"Look what I found! This changes everything!"' },
        { visual: "climactic battle", text: '"For glory and honor! Charge!" they shouted, weapons raised.' },
        { visual: "victory celebration", text: '"We did it! I can\'t believe we actually succeeded!"' }
      ],
      descriptions: ["epic journey", "dangerous quest", "heroic adventure", "thrilling exploration", "dangerous mission"]
    },
    romance: {
      scenes: [
        { visual: "first meeting", text: '"I never believed in love at first sight... until now."' },
        { visual: "growing connection", text: '"Every moment with you feels like magic," they whispered.' },
        { visual: "emotional conflict", text: '"This is complicated... my heart says one thing, my head says another."' },
        { visual: "declaration of love", text: '"I love you. There, I said it. No takebacks."' },
        { visual: "happy resolution", text: '"You make me happier than I ever thought possible."' }
      ],
      descriptions: ["romantic moment", "emotional scene", "heartfelt exchange", "intimate conversation", "love confession"]
    },
    mystery: {
      scenes: [
        { visual: "crime scene discovery", text: '"Something\'s not right here. Look at these clues."' },
        { visual: "investigation progress", text: '"The evidence points to only one conclusion, but it doesn\'t make sense."' },
        { visual: "suspect interrogation", text: '"Where were you on the night of the incident? And don\'t lie to me."' },
        { visual: "breakthrough realization", text: '"Of course! How did I miss that before? It all makes sense now!"' },
        { visual: "culprit reveal", text: '"The murderer is... you!" The reveal shocked everyone in the room.' }
      ],
      descriptions: ["mysterious setting", "investigation scene", "clue discovery", "suspenseful moment", "shocking reveal"]
    }
  };

  const template = styleTemplates[style] || styleTemplates.dialogue;
  const comment = sarcasms[Math.floor(Math.random() * sarcasms.length)];
  const scenes = [];

  for (let i = 0; i < numScenes; i++) {
    const templateScene = template.scenes[i % template.scenes.length];
    const description = template.descriptions[i % template.descriptions.length];
    
    scenes.push({
      visualDescription: `${characterList} in a ${description} about ${prompt.toLowerCase()} - ${templateScene.visual}`,
      text: templateScene.text
    });
  }

  return { 
    comment, 
    scenes,
    _meta: { 
      generatedWith: 'enhanced-fallback',
      style: style,
      characters: characterList,
      prompt: prompt
    }
  };
}