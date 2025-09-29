import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/utils/supabase/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '');
  console.log('Received Authorization:', authHeader);

  try {
    const body = await request.json();
    console.log('Received body:', JSON.stringify(body));

    const { sizeChart, sizeChartImage, explain, size, fitPreference, fitSummary, productName, sizeChartMeasurements } = body;

    // If productName is provided, check if it's scannable using GPT
    if (productName) {
      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) {
        return NextResponse.json({ error: 'OpenAI API key not set' }, { status: 500 });
      }

      // Create a prompt for GPT to classify the product
      const classificationPrompt = `
Classify if this product is scannable for size recommendations.

Product: "${productName}"

SCANNABLE = Clothing items with body measurements (shirts, pants, dresses, jackets, underwear, activewear)
NON-SCANNABLE = Accessories, shoes, bags, jewelry, electronics, furniture, beauty products

For non-English names: translate first, then classify.
Chinese examples: 衬衫=shirt, 裤子=pants, 连衣裙=dress, 夹克=jacket, 毛衣=sweater

JSON response only:
{
  "isProductScanable": true/false,
}
`;

      try {
        const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-5-nano',
            messages: [
              { role: 'system', content: 'You are a helpful assistant that classifies products. Always respond with valid JSON only.' },
              { role: 'user', content: classificationPrompt }
            ],
            // max_tokens: 150,
            // temperature: 0.1
          }),
        });

        const gptData = await gptRes.json();

        if (!gptRes.ok) {
          return NextResponse.json({ error: 'OpenAI error', details: gptData }, { status: 500 });
        }

        let result = { isProductScanable: false, reason: "Could not determine product type", translatedName: "" };

        try {
          const content = gptData.choices?.[0]?.message?.content || '';
          // Try to extract JSON from the response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedResult = JSON.parse(jsonMatch[0]);
            result = {
              isProductScanable: !!parsedResult.isProductScanable, // Convert to boolean
              reason: parsedResult.reason || "No reason provided",
              translatedName: parsedResult.translatedName || ""
            };
          }
        } catch (e) {
          console.error('Error parsing GPT response:', e);
        }

        return NextResponse.json(result, { status: 200 });
      } catch (error) {
        console.error('Error classifying product:', error);
        return NextResponse.json(
          { error: 'Failed to classify product', details: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500 }
        );
      }
    }

    const supabase = await createClient(accessToken);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication failed', details: userError?.message || 'No user' },
        { status: 401 }
      );
    }

    const { data: measurements, error: measurementsError } = await supabase
      .from('user_measurements')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (measurementsError || !measurements) {
      return NextResponse.json(
        { error: 'No measurements found for user' },
        { status: 404 }
      );
    }

    // For explain mode, use fit from body
    if (explain) {
      const prompt = `Explain why size "${size}" is recommended for this user in 2-3 sentences.

User measurements: ${JSON.stringify(measurements)}
Recommended size fit: ${JSON.stringify(body.fit)}
Fit preference: ${fitPreference || "regular"}

Focus on how garment dimensions align with body measurements.`;

      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) {
        return NextResponse.json({ error: 'OpenAI API key not set' }, { status: 500 });
      }

      const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          // max_tokens: 300,
        }),
      });

      const gptData = await gptRes.json();

      if (!gptRes.ok) {
        return NextResponse.json({ error: 'OpenAI error', details: gptData }, { status: 500 });
      }

      const explanation = gptData.choices?.[0]?.message?.content || '';
      return NextResponse.json({ explanation }, { status: 200 });
    }

    if (!sizeChart && !sizeChartImage && !sizeChartMeasurements) {
      return NextResponse.json(
        { error: 'Missing sizeChart, sizeChartImage, or sizeChartMeasurements in request body' },
        { status: 400 }
      );
    }

    // Extract available user measurement keys (excluding metadata)
    const availableUserMeasurements = Object.keys(measurements).filter(key =>
      key.endsWith('_value') && measurements[key] !== null && measurements[key] > 0
    ).map(key => key.replace('_value', ''));

    console.log('Available user measurements:', availableUserMeasurements);

    // Create mapping of user measurement keys to standard attribute names
    const userMeasurementMap: Record<string, string[]> = {
      chest: ['chest'],
      waist: ['waist'],
      hip: ['hip'],
      shoulders: ['shoulder'],
      inseam: ['leg_inseam'],
      thigh: ['thigh'],
      length: ['height'],
    };

    // Find which standard attributes have corresponding user measurements
    const availableAttributes = Object.entries(userMeasurementMap)
      .filter(([_, userKeys]) => userKeys.some(userKey => availableUserMeasurements.includes(userKey)))
      .map(([standardKey, _]) => standardKey);

    console.log('Available attributes to match:', availableAttributes);
const promptBase = `
Analyze the size chart and recommend the best fitting size.

User data: ${JSON.stringify(measurements)}
Available user measurements: ${availableUserMeasurements.join(', ')}
Fit preference: ${fitPreference || 'Regular'}

STRICT RULES:
1. Use ONLY the measurements listed in "Available user measurements".
   - Do NOT include any other measurement fields.
   - If the size chart has a synonym (e.g., bust = chest), map it to the user's measurement key.
   - Example: if user has "chest" and chart has "bust", return "chest".
2. Convert ALL values to centimeters (1 inch = 2.54 cm).
3. Ignore measurements from the size chart that the user does not have.
4. Always return JSON only in the following format:

{
  "size": "recommended_size",
  "fit": {
    "attribute-1": integer_value,
    "attribute-2": integer_value,
    "attribute-3": integer_value,
    "attribute-4": integer_value
  }
}

NOTES:
- The "fit" object must contain ONLY attributes present in both the user data and size chart.
- Do NOT add or infer attributes not explicitly available.
- Normalize synonyms: bust→chest, shoulder→shoulders, leg_inseam→inseam, etc.
- CRITICAL: If size chart ONLY has height and weight (no other measurements), return { "size": "X", "fit": {} } with empty fit object
- Final result must strictly follow the format.
- Don't include height or weight in the response but use them for context if available.
- If only height and weight are available in the sizechart, use them to analyse and recommend size but return an EMPTY fit object: { "size": "M", "fit": {} }

IMPORTANT: 
- Strictly analyze the size chart and user measurements and only include attributes that exist in both size chart and user measurements
- Always prefer attributes that best match user measurements when multiple synonyms exist
`;
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json({ error: 'OpenAI API key not set' }, { status: 500 });
    }

    let gptRes;
    if (sizeChartMeasurements) {
      // Use the structured size chart measurements
      const prompt = `${promptBase}\n\nSize chart: ${JSON.stringify(sizeChartMeasurements)}`;
      gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Fashion sizing expert. Always respond in JSON format. Convert all measurements to centimeters. Only include attributes that exist in both size chart and user measurements.'
            },
            { role: 'user', content: prompt }
          ],
          // max_tokens: 400,
        }),
      });
    } else if (sizeChartImage) {
      gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Fashion sizing expert. Always respond in JSON format. Convert all measurements to centimeters. Only include attributes that exist in both size chart and user measurements.'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: promptBase },
                { type: 'image_url', image_url: { url: sizeChartImage, detail: 'high' } }
              ]
            }
          ],
        }),
      });
    } else {
      const prompt = `${promptBase}\n\nSize chart: ${JSON.stringify(sizeChart)}`;
      gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Fashion sizing expert. Always respond in JSON format. Convert all measurements to centimeters. Only include attributes that exist in both size chart and user measurements.'
            },
            { role: 'user', content: prompt }
          ],
          // max_tokens: 400,
        }),
      });
    }

    const gptData = await gptRes.json();
    if (!gptRes.ok) {
      return NextResponse.json({ error: 'OpenAI error', details: gptData }, { status: 500 });
    }

    let recommendation = "Unknown";
    let fit: Record<string, number> = {};

    try {
      let gptContent = gptData.choices?.[0]?.message?.content || '{}';
      gptContent = gptContent.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(gptContent);
      recommendation = parsed.size || "Unknown";

      // Normalize attribute names for frontend display
      const renameMap: Record<string, string> = {
        // English
        'shoulder width': 'shoulders',
        'shoulder_width': 'shoulders',
        'shoulder': 'shoulders',
        'shoulders': 'shoulders',
        'leg_inseam': 'inseam',
        'leg inseam': 'inseam',
        'chest': 'chest',        
        'waist': 'waist',
        'hip': 'hip',
        'thigh': 'thigh',
        'inseamseam': 'inseam',
        'inseam': 'inseam',
        'length': 'length',
        // 'arm': 'arm',
        // 'height': 'height',
        // 'weight': 'weight',
        // Chinese
        '肩宽': 'shoulders',
        '肩': 'shoulders',
        '胸围': 'chest',
        '腰围': 'waist',
        '臀围': 'hip',
        '大腿围': 'thigh',
        '裤长': 'length',
        // '袖长': 'arm',
        // '身高': 'height',
        // '体重': 'weight',
        '内长': 'inseam',
        '内侧裤长': 'inseam',
        '衣长': 'length',
        '长度': 'length',
      };

      const rawFit = parsed.fit || {};
      for (const [attribute, value] of Object.entries(rawFit)) {
        const key = renameMap[attribute.toLowerCase()] || renameMap[attribute] || attribute;
        const numericValue = typeof value === 'number' ? value : Number(value);
        fit[key] = numericValue;
      }
    } catch (e) {
      recommendation = gptData.choices?.[0]?.message?.content || "Unknown";
    }

    console.log('Final recommendation:', recommendation);
    console.log('Final fit data (should be in cm):', fit);

    return NextResponse.json({ recommendation, fit }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}