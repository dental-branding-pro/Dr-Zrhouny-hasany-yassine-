import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import { execSync } from 'child_process';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

const segments = [
  {
    name: 'part1',
    dialogue: [
      { text: 'سارة: دعونا نبدأ هذا التحليل الشامل اليوم بتخيل بسيط. نحن في عالم طب الأسنان نبحث دائماً عن الدقة المتناهية. المريض يأتي بألم، نلتقط صورة أشعة، نشير إلى الشاشة ونقول: المشكلة هنا تماماً.', speaker: 'سارة' },
      { text: 'كريم: بالضبط، دقة هندسية إن صح التعبير.', speaker: 'كريم' },
      { text: 'سارة: صحيح، لكن بمجرد أن نخرج من غرفة العلاج وننظر إلى الجانب الإداري والتسويقي للعيادة، المشهد يختلف جذرياً. نحن غالباً أمام فوضى إدارية عارمة.', speaker: 'سارة' },
      { text: 'كريم: للأسف، هذا واقع مرير في الكثير من العيادات.', speaker: 'كريم' },
      { text: 'سارة: ولهذا السبب، نحن نغوص اليوم في تحليل مستندات تخص منظومة تدعى Dental Branding Pro. الفرضية التي تطرحها هذه المصادر مثيرة جداً.', speaker: 'سارة' },
      { text: 'كريم: الفرضية التي تقول إن العيادات تنزف أموالاً وتفقد مرضى ليس بسبب الكفاءة الطبية، بل بسبب الباب الرقمي المكسور.', speaker: 'كريم' },
      { text: 'سارة: 100%! 53% من المرضى يغادرون الموقع الإلكتروني إذا استغرق تحميله أكثر من 3 ثوانٍ.', speaker: 'سارة' },
      { text: 'كريم: ثلاث ثوانٍ فقط! مريض الأسنان المتألم يفتقر للصبر تماماً، والتأخير يترجم لانطباع بأن العيادة غير احترافية.', speaker: 'كريم' }
    ]
  },
  {
    name: 'part2',
    dialogue: [
      { text: 'سارة: المواقع التقليدية تستغرق أكثر من خمس ثوانٍ، بينما بنية Dental Branding Pro تفتح في أقل من 0.8 ثانية!', speaker: 'سارة' },
      { text: 'كريم: أقل من ثانية واحدة! البنية خفيفة وسريعة حتى مع أضعف اتصال إنترنت في الشارع.', speaker: 'كريم' },
      { text: 'سارة: والسرعة تشتري انتباه المريض، وهنا يأتي دور أداة التشخيص التفاعلي الذاتي في ثلاث خطوات.', speaker: 'سارة' },
      { text: 'كريم: نظام فرز وتوجيه يسأل: هل تعاني من ألم حاد؟ تجميل؟ زراعة؟ ويوجه المريض فوراً لثلاث طرق حجز: الهاتف، أو النموذج، أو الواتساب المباشر.', speaker: 'كريم' }
    ]
  },
  {
    name: 'part3',
    dialogue: [
      { text: 'سارة: وماذا عن تصدر العيادة لمحركات البحث والذكاء الاصطناعي؟', speaker: 'سارة' },
      { text: 'كريم: المنظومة تزرع 20 سؤالاً وجواباً و20 مقالاً طبياً مهيئاً للظهور في المراتب الثلاث الأولى على خرائط جوجل، مع خطة محتوى جاهزة لـ 52 أسبوعاً!', speaker: 'كريم' },
      { text: 'سارة: ممتاز! وماذا عن تخفيف عبء السكرتارية وتوفير الوقت؟', speaker: 'سارة' },
      { text: 'كريم: استرجاع 15 ساعة عمل أسبوعياً! بفضل بنك ردود واتساب جاهز يضم 20 نموذجاً لتعليمات ما بعد العلاج وإدارة تقييمات جوجل 5 نجوم.', speaker: 'كريم' }
    ]
  },
  {
    name: 'part4',
    dialogue: [
      { text: 'سارة: وأيضاً بطاقة DentaLink الذكية برمز كيو آر وتقنية إن إف سي لحفظ جهة الاتصال في هاتف المريض بنقرة واحدة.', speaker: 'سارة' },
      { text: 'كريم: والآن إلى النقطة الأهم: كسر فخ الاشتراكات الشهرية. الدفع لمرة واحدة فقط بقيمة 2000 درهم بعد التسليم والمعاينة، مع استضافة ونطاق مجاناً مدى الحياة.', speaker: 'كريم' },
      { text: 'سارة: عيادتك تصبح منظومة متكاملة تستقبل المرضى وتحجز المواعيد على مدار الساعة. نتمنى لعياداتكم دوام التميز والنجاح!', speaker: 'سارة' }
    ]
  }
];

async function generateAll() {
  const wavFiles = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    console.log('Generating ' + seg.name + '...');
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: seg.dialogue.map(d => ({
            text: d.text,
            speechMetadata: { speaker: d.speaker }
          }))
        }
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              { speaker: 'سارة', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
              { speaker: 'كريم', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
            ]
          }
        }
      }
    });

    const b64 = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (b64) {
      const filename = '/tmp/' + seg.name + '.wav';
      fs.writeFileSync(filename, Buffer.from(b64, 'base64'));
      wavFiles.push(filename);
      console.log('Saved ' + filename + ' (' + fs.statSync(filename).size + ' bytes)');
    }
  }

  // Concatenate with ffmpeg
  const concatList = '/tmp/concat.txt';
  fs.writeFileSync(concatList, wavFiles.map(f => "file '" + f + "'").join('\n'));
  
  execSync('ffmpeg -y -f concat -safe 0 -i /tmp/concat.txt -c:a pcm_s16le public/audio/podcast-dental-mastery.wav');
  execSync('ffmpeg -y -i public/audio/podcast-dental-mastery.wav -c:a libmp3lame -b:a 128k public/audio/podcast-dental-mastery.mp3');
  execSync('cp -f public/audio/podcast-dental-mastery.wav dist/audio/podcast-dental-mastery.wav');
  execSync('cp -f public/audio/podcast-dental-mastery.mp3 dist/audio/podcast-dental-mastery.mp3');
  
  console.log('Podcast files successfully generated and saved to public/audio and dist/audio!');
}

generateAll().catch(err => {
  console.error('Error generating audio:', err);
  process.exit(1);
});
