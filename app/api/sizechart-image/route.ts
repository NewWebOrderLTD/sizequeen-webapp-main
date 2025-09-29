import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/utils/supabase/server';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '');

  console.log('Received Authorization:', authHeader);

  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not set' },
        { status: 500 }
      );
    }

    console.log(`Analyzing image: ${image}`);

   const prompt = `
You are an expert at analyzing clothing size charts in ALL languages and formats, with special focus on Chinese and English.

**CRITICAL MISSION**: Extract ONLY the measurements that actually exist in the size chart.

**SIZE CHART DETECTION**:
Look for ANY organized size-to-measurement mapping in these formats:
• Traditional tables/grids
• Vertical size lists
• Horizontal measurement progressions
• Infographic-style charts
• Mobile-optimized layouts
• Any format showing size → measurement relationships

**LANGUAGE SUPPORT**:
English & Chinese (Primary Focus):
• Sizes: XS,S,M,L,XL,XXL ↔ 小号,中号,大号,特大号,均码
• Measurements: chest/胸围, waist/腰围, hip/臀围, shoulder/肩宽, length/衣长, sleeve/袖长, inseam/裤长
• Also support: Japanese, Korean, and numeric sizes (28,30,32,34,36...)

**MEASUREMENT EXTRACTION RULES**:
1. **ONLY EXTRACT EXISTING MEASUREMENTS** - Never add null/missing values
2. **STANDARDIZE KEYS**: Use chest, waist, hip, shoulders, length, sleeve, inseam, weight, height
3. **UNIT CONVERSION**: Convert to centimeters (inches × 2.54, mm ÷ 10)
4. **EXACT SIZE MATCHING**: Use exact size labels from chart ("M", "32", "XL/2XL", "中号")
5. **COMPREHENSIVE EXTRACTION**: Include weight/height if present
6. **NO NULL VALUES**: If chest doesn't exist, don't include it at all

**TRANSLATION MAPPING**:
• 胸围/胸部 → chest
• 腰围/腰部 → waist  
• 臀围/臀部 → hip
• 肩宽/肩膀 → shoulders
• 衣长/长度 → length
• 袖长/袖子 → sleeve
• 裤长/内长 → inseam
• 体重 → weight
• 身高 → height

**JSON RESPONSE FORMAT**:

If size chart found:
{
  "isSizeChart": true,
  "sizes": [
    {
      "size": "S",
      "measurements": {
        "chest": 88,
        "waist": 72
      }
    },
    {
      "size": "M",
      "measurements": {
        "chest": 92,
        "waist": 76,
        "hip": 96,
        "shoulders": 40
      }
    }
  ]
}

If NO size chart:
{
  "isSizeChart": false,
  "sizes": []
}

**CRITICAL REMINDERS**:
• NEVER include measurements with null values
• ONLY include measurements that have actual numeric values in the chart
• If a size has only chest and waist, only include those two
• Extract ALL available sizes, even if they have different measurement sets
• Be thorough - even weight/height only charts count as size charts
• Support all global size chart formats, especially Chinese e-commerce styles
`;

    try {
      const messages = [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: image,
                detail: 'high' // High detail for reading small text
              }
            }
          ]
        }
      ];

      const gptRes = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
          })
        }
      );

      const gptData = await gptRes.json();

      if (!gptRes.ok) {
        console.error('OpenAI error:', gptData);
        return NextResponse.json(
          {
            error: 'OpenAI API error',
            details: gptData.error?.message || 'Unknown OpenAI error'
          },
          { status: 500 }
        );
      }

      const responseContent = gptData.choices?.[0]?.message?.content?.trim() || '';
      console.log('GPT response:', responseContent);

      try {
        // Try to parse JSON response
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          
          if (parsedResponse.isSizeChart && parsedResponse.sizes && parsedResponse.sizes.length > 0) {
            console.log(`✓ Size chart detected with ${parsedResponse.sizes.length} sizes`);
            return NextResponse.json(
              {
                url: image,
                sizeData: parsedResponse.sizes
              },
              { status: 200 }
            );
          } else {
            console.log('✗ No size chart detected');
            return NextResponse.json(
              {
                url: null,
                sizeData: []
              },
              { status: 200 }
            );
          }
        } else {
          // Fallback to old YES/NO detection
          const response = responseContent.toUpperCase();
          if (response.includes('YES') || response === 'YES') {
            console.log('✓ Size chart detected (fallback)');
            return NextResponse.json(
              {
                url: image,
                sizeData: []
              },
              { status: 200 }
            );
          } else {
            console.log('✗ No size chart detected');
            return NextResponse.json(
              {
                url: null,
                sizeData: []
              },
              { status: 200 }
            );
          }
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        // Fallback to simple YES/NO detection
        const response = responseContent.toUpperCase();
        if (response.includes('YES') || response === 'YES') {
          console.log('✓ Size chart detected (fallback)');
          return NextResponse.json(
            {
              url: image,
              sizeData: []
            },
            { status: 200 }
          );
        } else {
          console.log('✗ No size chart detected');
          return NextResponse.json(
            {
              url: null,
              sizeData: []
            },
            { status: 200 }
          );
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
      return NextResponse.json(
        {
          error: 'Error processing image',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    );
  }
}
