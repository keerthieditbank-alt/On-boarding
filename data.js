/* All training content is editable here. No build tooling is required. */
window.SOP_DATA = (() => {
  const formats = {
    short: {
      name: 'Short Format', shortName: 'Shorts / Reels', icon: '▣', tag: 'VERTICAL',
      summary: 'High-retention vertical editing for Reels, Shorts and TikTok.',
      defaults: { resolution:'1080 × 1920', ratio:'9:16', fps:'25', duration:'30–60 sec', hook:'0–3 sec', visual:'Every 5–10 sec', subtitles:'On', bitrate:'20 Mbps', maxBitrate:'20 Mbps', exportFormat:'H.264 / MP4', bitrateEncoding:'VBR, 2 pass', fieldOrder:'Progressive', pixelAspect:'Square Pixels (1.0)', colorSpace:'Rec.709', audioCodec:'AAC', audioSampleRate:'48000 Hz', audioBitrate:'384 kbps', renderQuality:'Maximum Render Quality: On', renderDepth:'Render at Maximum Depth: On', performance:'Software Encoding', timeInterpolation:'Frame Sampling', safeZone:'Keep key text clear of top/bottom UI', platform:'Instagram Reels / YouTube Shorts' },
      heroNote:'Every second counts. Deliver one clear idea with a hook, tight pacing, purposeful graphics and an unmistakable payoff.'
    },
    long: {
      name: 'Long Format', shortName: 'YouTube / Documentary', icon: '▤', tag: 'HORIZONTAL',
      summary: 'Story-first editing for YouTube essays, interviews and documentaries.',
      defaults: { resolution:'3840 × 2160', ratio:'16:9', fps:'23.976', duration:'8–20 min', hook:'0–30 sec', visual:'Every 5–10 sec', subtitles:'Selective', bitrate:'30 Mbps', maxBitrate:'30 Mbps', exportFormat:'H.264 / MP4', bitrateEncoding:'VBR, 2 pass', fieldOrder:'Progressive', pixelAspect:'Square Pixels (1.0)', colorSpace:'Rec.709', audioCodec:'AAC', audioSampleRate:'48000 Hz', audioBitrate:'384 kbps', renderQuality:'Maximum Render Quality: On', renderDepth:'Render at Maximum Depth: On', performance:'Software Encoding', timeInterpolation:'Frame Sampling', safeZone:'Keep titles within action-safe margins', platform:'YouTube' },
      heroNote:'The story leads. Let real moments breathe, build emotional rhythm and make the editing feel invisible.'
    }
  };

  const common = [
    {
      id:'setup', number:'01', title:'Welcome & Setup', icon:'◫', subtitle:'Know the brief before opening the timeline.', theme:'cyan',
      lessons:[
        { title:'Start with the intention', body:'Define the content direction, audience feeling and goal before you start cutting. The edit should support a clear message rather than showcasing effects.', points:['Read the brief, script or rough cut from start to finish.', 'Confirm the delivery platform, audience, language, target duration and deadline.', 'Choose the outcome: views, engagement, branding, sales or emotional impact.'] },
        { title:'Build a predictable project', body:'Begin with the supplied Premiere Pro template, not a blank project. Keep naming and assets consistent across team members.', points:['Root folder: Video Topic / Raw Files / B-Roll / Script / Project File.', 'Premiere bins: Raw Files, B-Roll, Sequences, Music, SFX.', 'Short Format exports: SF_<video name>_1st draft.mp4 or SF_<video name>_Final.mp4. Long Format exports: LF_<video name>_1st draft.mp4 or LF_<video name>_Final.mp4. Premiere sequences use the same descriptive names without .mp4.', 'Save versions; never destructively alter the originals.'] }
      ],
      dos:['Open the edit brief and template first.', 'Store source footage separately from the Premiere / After Effects project.'],
      donts:['Name projects Video1 or Untitled.', 'Add visuals before understanding the story.'],
      tasks:['Brief and audience confirmed', 'Folder structure and sequence created', 'Original footage backed up'],
      quiz:{q:'What should be decided before the first edit?', a:['Which transition preset looks coolest','The video goal, audience and content direction','The export filename'], correct:1, why:'Every creative decision should support the video’s purpose.'}
    },
    {
      id:'pacing', number:'02', title:'Story & Pacing', icon:'◷', subtitle:'Give the video an intentional rhythm.', theme:'apricot',
      lessons:[
        { title:'Review twice; cut once', body:'Pass one is for the overall story. Pass two is for marking the most useful moments.', points:['First watch: understand what the video is about and what it should make people feel.', 'Second watch: mark the best takes, powerful lines, key facts and B-roll opportunities.', 'Use Premiere labels: green = best, yellow = usable, red = reject, purple = potential B-roll.'] },
        { title:'The seven-stage workflow', body:'Move sequentially through the production flow to avoid expensive rework.', points:['Plan → select shots → rough cut → lock structure.', 'Then visual layering → sound design → polish & export.', 'Keep the rough cut clean of unnecessary effects until the narrative works.'] }
      ],
      dos:['Move between fast and quiet moments intentionally.', 'Get story approval before polishing animations.'],
      donts:['Over-cut emotional pauses.', 'Use a repeated cut pattern without checking the story.'],
      tasks:['Best takes and key moments marked', 'Rough cut arranged in story order', 'Structure checked and locked'],
      quiz:{q:'When should the major story structure be locked?', a:['After all sound effects are added','After reviewing the rough cut, before heavy visual layering','Only after final export'],correct:1,why:'Locking the structure before graphics prevents unnecessary rework.'}
    },
    {
      id:'hook', number:'03', title:'Hook & Introduction', icon:'ϟ', subtitle:'Create a reason to keep watching.', theme:'lilac',
      lessons:[
        { title:'Open with the strongest moment', body:'The first impression should create curiosity, emotion or a clear promise.', points:['Use a compelling reveal, question, conflict or important statement.', 'Start visually from frame one, not with a black screen or a long logo.', 'Deliver on the curiosity created by the hook.'] },
        { title:'Think in beats', body:'A hook should progress, not feel like one loud moment repeated.', points:['Strong start → quick context → new information → reason to continue.', 'Sync meaningful motion to narration or music where it improves rhythm.', 'Avoid graphics that interrupt the speaker’s message.'] }
      ],
      dos:['Make the topic clear quickly.', 'Give the viewer a specific reason to continue.'],
      donts:['Start with a long channel intro.', 'Add fast edits only for the sake of speed.'],
      tasks:['Hook uses a strong story moment', 'First frame is intentional', 'Intro transitions naturally into main story'],
      quiz:{q:'Which opening best follows the SOP?',a:['A lengthy logo animation','A compelling story moment with immediate visual context','Twenty seconds of unrelated stock footage'],correct:1,why:'The strongest opening makes a clear promise and immediately connects to the story.'}
    },
    {
      id:'assets', number:'04', title:'Footage & B-Roll', icon:'▧', subtitle:'Make every cutaway earn its place.', theme:'lime',
      lessons:[
        { title:'Only use story-driven assets', body:'B-roll should illustrate the exact point or feeling in the A-roll, not simply fill an empty section.', points:['Prefer real relevant footage over generic animation when it provides evidence.', 'For history: favor original photos, dated articles and credited sources.', 'Avoid repeating the exact same B-roll clip within one video.', 'MANDATORY: change the on-screen visual every 5–10 seconds; use relevant video, an image, super text, B-roll, or a meaningful graphic.'] },
        { title:'Keep the visual language consistent', body:'Subject position and eye lines matter. Match screen direction and visual focus when moving between A-roll and B-roll. Every 5–10 seconds, make a purposeful visual change (video, image, super text or graphic) without breaking the story.', points:['Use B-cam cutaways when available.', 'Cover distracting jump cuts with relevant footage.', 'Build an organized shared library of visual, audio and graphic assets.'] }
      ],
      dos:['Check visual relevance and source rights.', 'Maintain subject and eyeline continuity.'],
      donts:['Insert random skyline or walking footage.', 'Reuse identical B-roll repeatedly in one video.'],
      tasks:['Relevant B-roll mapped to key lines', 'Visual changes reviewed every 5–10 seconds (video / image / super text / graphic)', 'Repetition and continuity checked', 'Source / usage rights documented'],
      quiz:{q:'What is the strongest reason to add B-roll?',a:['The timeline looks empty','It directly reinforces what the viewer is hearing','An unrelated clip is available in the asset folder'],correct:1,why:'Visuals should add meaning, not simply fill time.'}
    },
    {
      id:'visuals', number:'05', title:'Visuals & Animation', icon:'✳', subtitle:'Add clarity without visual noise.', theme:'blue',
      lessons:[
        { title:'Choose restraint over effects', body:'Use small movement, intentional emphasis and reusable presets. Save complex animation for moments that genuinely require it.', points:['Use Premiere for straightforward zooms, slide effects and text.', 'Use After Effects for routes, complex motion design and sophisticated titles.', 'Keep the same animation style to roughly two uses per video, following the team SOP.'] },
        { title:'One visual, one purpose', body:'Every graphic should establish context, reveal a fact, guide attention or add emotion. Design historical photographs with context and subtle movement.', points:['Use subtle zooms only on meaningful statements.', 'Maintain consistent fonts and color treatment.', 'Preview graphics on phone-size screens as well as desktop.'] }
      ],
      dos:['Use restrained motion for emphasis.', 'Save successful effects as presets.'],
      donts:['Put an animation on every line.', 'Use After Effects for routine Premiere operations.'],
      tasks:['Graphics support story moments', 'Animation repetition checked', 'Visual style and brand consistent'],
      quiz:{q:'When is After Effects most justified?',a:['For each basic jump cut','For complex maps or motion graphics','For every color correction'],correct:1,why:'Reserve After Effects for work that benefits from its specialized tools.'}
    },
    {
      id:'type', number:'06', title:'Typography & Subtitles', icon:'T', subtitle:'Readable words, precisely timed.', theme:'pink',
      lessons:[
        { title:'Highlight meaning, not everything', body:'Text should clarify a statement, establish a place, reinforce a statistic or make dialogue accessible.', points:['Mark key phrases in the script for highlights.', 'Use a consistent branded text system: typeface, scale, spacing and color.', 'Check every subtitle for spelling, punctuation, timing and speaker accuracy.'] },
        { title:'Test real-world readability', body:'Text must remain easy to read on the device where the video will be watched.', points:['Keep strong contrast over moving footage.', 'Avoid overlapping platform controls or placing text on faces.', 'Do not leave complex text on screen too briefly.'] }
      ],
      dos:['Proofread every caption.', 'Use a consistent position and type system.'],
      donts:['Use low-contrast text over detailed footage.', 'Blindly accept AI-generated captions without review.'],
      tasks:['Text styles aligned with brand', 'Captions proofread and synchronized', 'Mobile legibility / safe margins checked'],
      quiz:{q:'What should happen to automatically generated captions?',a:['Publish them unchanged','Proofread and time them against the audio','Hide all captions automatically'],correct:1,why:'Automatic captions frequently need manual corrections.'}
    },
    {
      id:'audio', number:'07', title:'Sound & Color', icon:'◉', subtitle:'Make the sound feel as polished as the picture.', theme:'mint',
      lessons:[
        { title:'Sound should support immersion', body:'Do detailed sound design after visual structure is stable. The audience should feel SFX, not be distracted by it.', points:['Use location ambience for documentaries and natural room tone for interviews.', 'Use restrained transition effects; avoid repeating the same sound excessively.', 'Check dialogue clarity on headphones and laptop/phone speakers.'] },
        { title:'Enhance, do not transform', body:'Preserve believable skin tones and natural color, with controlled contrast.', points:['Correct white balance, exposure and clipping before applying a look.', 'Use non-destructive color adjustment layers or Lumetri presets.', 'Keep A-roll and B-roll consistent across adjacent shots.'] }
      ],
      dos:['Keep the voice clearly above music.', 'Listen once without watching the picture.'],
      donts:['Use aggressive, distracting whooshes.', 'Over-saturate skin tones.'],
      tasks:['Voice, music, ambience and SFX balanced', 'Sound repetition and pops checked', 'Color and exposure matched'],
      quiz:{q:'When should detailed transition sound design happen?',a:['Before selecting takes','After the visual edit / structure is stable','Before watching the raw footage'],correct:1,why:'Doing the detailed mix after picture lock reduces wasted work.'}
    },
    {
      id:'delivery', number:'08', title:'Quality Check & Export', icon:'✓', subtitle:'Deliver a reliable, reviewable final edit.', theme:'yellow',
      lessons:[
        { title:'Watch the entire piece once', body:'A full uninterrupted viewing is the best way to catch pacing issues, glitches and inconsistent audio.', points:['Review story flow, awkward pauses, jump cuts and missing visuals.', 'Check captions, sound pops, source credits and color consistency.', 'Check that the exact export matches the chosen format settings.'] },
        { title:'Mandatory pre-export: copy the reference Audio Track Mixer', body:'After editing and before export, transfer the approved Audio Track Mixer effects from a previous project to the project you are delivering. Do not export before verifying the destination sequence.', points:['In the current Premiere project, import the approved reference .prproj and its reference sequence if it is not already accessible (File → Import → choose selected sequences).', 'Open the reference sequence. Window → Audio Track Mixer → Show/Hide Effects and Sends. Locate the correct dialogue, music, SFX, submix and Mix/Master racks.', 'Right-click the top of each required source effects rack → Copy Track Effects. Switch to the new delivery sequence; right-click the equivalent destination rack → Paste Track Effects.', 'Confirm all plugin values, effect order and enable states on the destination. Copying a rack replaces that rack’s existing effects: save a project version and inspect before overwriting.', 'Check fader levels, sends, routing and panning against the reference separately; these may not be copied with the effects rack. Play back and meter the final sequence; check for clipping and missing plugins.'] },
        { title:'Name and submit carefully', body:'Use a consistent final filename and provide a reviewable link with concise notes.', points:['Short Format: SF_<video name>_1st draft.mp4 and SF_<video name>_Final.mp4. Long Format: LF_<video name>_1st draft.mp4 and LF_<video name>_Final.mp4.', 'Choose H.264 / MP4 and AAC audio for the default online delivery.', 'After completing all modules, finish the separate final checklist and generate a review report.'] }
      ],
      dos:['Watch the actual rendered export.', 'Provide a working link and revision notes.'],
      donts:['Export an unreviewed timeline.', 'Claim upload succeeded without a confirmed destination.'],
      tasks:['Reference Audio Track Mixer effects transferred and verified before export', 'Full video reviewed from start to finish', 'Export settings match delivery brief', 'Review link and notes ready'],
      quiz:{q:'What must happen after editing but before export?',a:['Export without checking the audio bus','Copy approved Audio Track Mixer effects from an old reference sequence to the delivery sequence and verify them','Add effects only to the source clips'],correct:1,why:'Approved track-level processing must be transferred, checked and listened to before rendering.'}
    }
  ];

  const additionalQuestions = {
    hook: [
      {q:"What is a strong first-frame choice?",a:["A blank frame to build suspense", "A clear, compelling image tied to the story", "An unrelated logo for ten seconds"],correct:1,why:"The first frame should immediately establish a reason to watch."},
    ],
    assets: [
      {q:"How often should the video have a purposeful visual change?",a:["Every 5–10 seconds", "Only once per minute", "Only when a new chapter starts"],correct:0,why:"A video, image, super text, B-roll or relevant graphic counts as a visual change."},
      {q:"Which cutaway is best for historical claims?",a:["Random stock footage", "Original photos or dated, credited source images", "A generated visual without verification"],correct:1,why:"Verified photos and dated sources strengthen accuracy."},
    ],
    visuals: [
      {q:"How should you use a punch-in zoom?",a:["On each sentence", "Only where emphasis is needed", "To replace every B-roll"],correct:1,why:"Use punch-ins sparingly for statements that matter."},
      {q:"Which element can count as a 5–10 second visual change?",a:["An on-topic super text or graphic", "A meaningless repeated effect", "An off-topic visual for variety"],correct:0,why:"A meaningful super text or graphic creates visual variety without filler."},
      {q:"What should you do with an effective animation?",a:["Recreate it manually every edit", "Save it as a reusable template", "Apply it to every line without thinking"],correct:1,why:"Reusable templates protect style consistency and turnaround speed."},
    ],
    type: [
      {q:"Where should subtitles be placed for vertical video?",a:["Across platform control overlays", "Inside readable safe areas", "Over the speaker’s face"],correct:1,why:"Avoid mobile platform UI and important faces."},
      {q:"How should super text be used?",a:["To emphasize key ideas and aid understanding", "To cover the entire frame constantly", "Instead of checking facts"],correct:0,why:"Super text is for purposeful emphasis."},
      {q:"What should be checked on a phone preview?",a:["Readable size and contrast", "Only whether the music plays", "Only the video length"],correct:0,why:"Small-screen readability and safe margins matter."},
      {q:"What do you do with a misspelled person or place name?",a:["Leave it if auto-captioned", "Verify spelling and correct it", "Hide the full caption track"],correct:1,why:"Names and places should be verified before delivery."},
    ],
    audio: [
      {q:"Where is the approved audio preset available?",a:["The team-provided Audio Preset Drive link", "Only in a random online preset pack", "Only from the exported MP4"],correct:0,why:"Use the team-approved shared preset link."},
      {q:"How should dialogue sit against the music?",a:["Dialogue should stay clear and intelligible", "Music should bury the speaker", "Always mute all ambient audio"],correct:0,why:"Voice clarity comes first."},
      {q:"What should you do with identical sound effects?",a:["Repeat each one every cut", "Avoid obvious or excessive repetition", "Always make them louder"],correct:1,why:"Repetitive sound effects pull attention away from the story."},
      {q:"What is the preferred color approach for documentary footage?",a:["Strong saturation regardless of scene", "Natural-looking skin tones and controlled contrast", "Uncorrected color differences between clips"],correct:1,why:"Color should enhance reality rather than distort it."},
      {q:"How should the final sound mix be verified?",a:["Listen on headphones and speakers", "Check only the waveform color", "Trust the default audio mix"],correct:0,why:"Multiple listening systems reveal different audio problems."},
    ],
    delivery: [
      {q:"What filename prefix identifies a Short Format export?",a:["LF_", "SF_", "v01_"],correct:1,why:"Short Format exports start with SF_. Long Format exports start with LF_."},
      {q:"What filename prefix identifies a Long Format export?",a:["SF_", "LF_", "v02_"],correct:1,why:"Long Format exports start with LF_."},
      {q:"What must happen after pasting Audio Track Mixer effects?",a:["Confirm effect order, plugins, faders and routing by listening", "Immediately export without checking", "Delete every destination track"],correct:0,why:"Copying effects does not guarantee that all levels and routing match."},
      {q:"Which file must be reviewed before delivery?",a:["Only the timeline preview", "The actual rendered MP4 from start to finish", "Only the first 10 seconds"],correct:1,why:"Quality checks must be done on the actual export."},
      {q:"Which short video export setting matches the reference?",a:["1080 × 1920 at 25 fps", "3840 × 2160 at 23.976 fps", "1280 × 720 at 60 fps"],correct:0,why:"The provided short-format sequence reference is vertical 1080 × 1920, 25 fps."},
      {q:"Which long video export setting matches the reference?",a:["1080 × 1920 at 25 fps", "3840 × 2160 at 23.976 fps", "1920 × 1080 at 60 fps"],correct:1,why:"The provided long-format sequence reference is 4K horizontal 3840 × 2160, 23.976 fps."},
    ],
  };
  common.forEach((module, index) => {
    module.quizzes = [module.quiz, ...(additionalQuestions[module.id] || [])];
    const expected = Math.max(1, index); // 1,1,2,3,4,5,6,7
    if(module.quizzes.length !== expected) throw new Error(`Invalid quiz count for ${module.id}`);
  });
  const shortOverlays = {
    setup:{focus:'Set a vertical 9:16 sequence. Confirm whether the deliverable is a Reel, Short or another mobile-first post.',tips:['Use 1080 × 1920 as the default delivery size.','Inspect how titles interact with platform UI overlays.']},
    pacing:{focus:'The short edit should communicate one strong idea. Remove repetition and unnecessary context, but protect emotional clarity.',tips:['Treat each cut as a deliberate beat, not a random attention grab.','Test whether the story still works with sound off and subtitles on.']},
    hook:{focus:'Try to establish the reason to watch in the first 1–3 seconds; start with your most compelling image or statement.',tips:['Let the first frame do immediate narrative work.','Make the payoff visible before the end instead of promising it indefinitely.']},
    assets:{focus:'Use tightly cropped vertical B-roll and keep the main action within the central viewing area. Change the visual every 5–10 seconds using a relevant video, image, super text or graphic.',tips:['Avoid cropping meaningful faces or context just to fill 9:16.','Replace low-resolution landscape clips rather than stretching them.']},
    visuals:{focus:'Use visual changes when they reinforce pace. Avoid a constant stream of unrelated zooms, memes or transitions.',tips:['Check vertical framing after every punch-in.','Use a reusable short-form graphics preset to reduce iteration time.']},
    type:{focus:'Vertical captions typically carry more of the story, especially for sound-off viewing.',tips:['Keep subtitle lines short and avoid the bottom UI area.','Review line breaks on an actual phone viewport.']},
    audio:{focus:'Prioritize instantly clear speech. Keep music supportive and use effects only where they enhance the hook or payoff.',tips:['Check first-second audio impact without clipping.','Keep the emotional change audible across edits.']},
    delivery:{focus:'Export 1080 × 1920, H.264 and AAC by default; inspect the upload preview for unwanted cropping.',tips:['Watch the whole export vertically on your phone.','Recheck subtitles and cover frame on the target platform.']}
  };
  const longOverlays = {
    setup:{focus:'Begin with a 16:9 timeline. Confirm whether the piece is talking head, history essay or on-location documentary.',tips:['1080p is the default; select 4K only when the source and brief support it.','Document the frame rate before starting a multi-camera edit.']},
    pacing:{focus:'Structure interviews and documentaries around a real emotional or intellectual journey.',tips:['Use five acts when appropriate: Hook → Setup → Exploration → Insight → Ending.','Create a meaningful visual change every 5–10 seconds; preserve natural atmosphere and use images, super text or cutaways when appropriate.']},
    hook:{focus:'Use the first 15–30 seconds to build curiosity, context and stakes without exhausting the main revelation.',tips:['Begin with a meaningful visual or powerful statement, not a cold logo.','Move from the hook into a coherent setup of the people and place.']},
    assets:{focus:'Use authentic wide establishing shots, context-rich B-roll and purposeful interview cutaways; ensure a meaningful visual change every 5–10 seconds.',tips:['Preserve geographical and eye-line continuity.','Historical claims benefit from dated documents or original images.']},
    visuals:{focus:'The editor should remain almost invisible. Let motion reinforce clarity and avoid the overproduced feel.',tips:['Use maps and diagrams when they explain something not visible in footage.','Let strong documentary moments play without decorative movement.']},
    type:{focus:'Use selective titles, lower thirds, citations and captions to help viewers orient themselves.',tips:['Leave titles visible long enough to read and understand.','Maintain name and place spelling, especially in documentary interviews.']},
    audio:{focus:'Preserve room tone, ambient location sound and a smooth emotional arc between music sections.',tips:['Dialogue intelligibility comes first in interviews.','Use natural color grading; maintain skin tones and location authenticity.']},
    delivery:{focus:'Use 16:9 H.264/AAC default delivery, verify all acts and run a complete end-to-end export watch.',tips:['Compare music, ambience and interview level across chapters.','Check credits, references and any privacy masking before delivery.']}
  };

  const finalChecks = {
    short: [
      'Export aspect ratio and resolution match 9:16 settings',
      'Hook makes sense within first few seconds',
      'Captions and key graphics stay clear of app UI areas',
      'No stray frames, cuts, pops or black opening frames',
      'Visual changes occur every 5–10 seconds using relevant video, images, super text or graphics', 'Every B-roll insert is relevant and not repeated',
      'Final export has the approved Audio Track Mixer processing; no clipping or missing audio',
      'Voice clear, music balanced and no clipping',
      'Text spelling and safe margins checked on phone',
      'Actual exported MP4 reviewed end-to-end',
      'Link opens and has permission for reviewer'
    ],
    long: [
      'Export aspect ratio and resolution match 16:9 settings',
      'Hook, setup, exploration, insight and conclusion flow logically',
      'Sensitive identities or private details masked where required',
      'Visual changes occur every 5–10 seconds using relevant video, images, super text or graphics', 'A-roll/B-roll continuity and source credibility checked',
      'No repeated B-roll or distracting animation loops',
      'Approved Audio Track Mixer processing is present in the final exported audio',
      'Voice, ambient audio and music balanced across sections',
      'Titles, citations and subtitles proofread',
      'Color continuity and natural skin tones verified',
      'Actual exported MP4 reviewed end-to-end',
      'Long-format render matches export settings (H.264, target/max bitrate, progressive)',
      'AAC audio and sample rate checked; soundtrack has no clipping',
      'Link opens and has permission for reviewer'
    ]
  };
  const mixerChecks = [
    'Open / import the approved previous project and identify its reference sequence',
    'Copy Track Effects from the matching reference Audio Track Mixer racks',
    'Paste Track Effects into the correct tracks / Mix bus in the new delivery sequence',
    'Verify effect chain, settings, routing/faders, enabled plugins and clipping by listening'
  ];
  return { formats, common, overlays:{short:shortOverlays,long:longOverlays}, finalChecks, mixerChecks };
})();
