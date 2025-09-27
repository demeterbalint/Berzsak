import {Injectable} from '@angular/core';
import {ProjectDetails} from '../models/project-details';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectList: ProjectDetails[] = [
    {
      name: 'qt tea set system',
      slug: 'qt-tea-set-system',
      shortDescription: 'The tea set reimagines herbal tea for the modern, health-conscious generation, transforming a traditional ritual into a refined, intuitive, and contemporary experience.',
      longDescription: ['Herbal tea doesn’t have to feel old-fashioned. Regular consumption of herbs is one of the simplest ways to support the harmony of body and mind — so why not make it exciting, fresh, and easy to enjoy every day? This project set out to reimagine herbal tea for a younger, health-conscious generation. The QT tea set is a contemporary system that brings new life to the ritual of tea drinking. It respects the cultural roots of herbs while turning them into a modern, intuitive experience that fits seamlessly into today’s fast-paced lifestyle.',
      'Beyond home use, the design also aims to elevate the way tea is served and enjoyed in hotels, restaurants, and other hospitality spaces, making the act of drinking tea more engaging and memorable. With its clean, minimal form, QT transforms tea preparation into a small ritual of pleasure and presence — turning herbal tea from a rare indulgence into a mindful moment, an inspiring part of everyday life.'],
      projectData: 'Year: 2025'
                + '<br>'
                + 'Photo: Anna Hardy, Balázs Harmathy',
      mainImgUrl: ['/qt-tea-set-system/5846/main_qt_5846.webp', '/qt-tea-set-system/2400/main_qt_2400.webp', '/qt-tea-set-system/1800/main_qt_1800.webp', '/qt-tea-set-system/1200/main_qt_1200.webp', "/qt-tea-set-system/600/main_qt_600.webp", '/qt-tea-set-system/300/main_qt_300.webp'],
      imageUrls: [['/qt-tea-set-system/5846/main_qt_5846.webp', '/qt-tea-set-system/2400/main_qt_2400.webp', '/qt-tea-set-system/1800/main_qt_1800.webp', '/qt-tea-set-system/1200/main_qt_1200.webp', "/qt-tea-set-system/600/main_qt_600.webp", '/qt-tea-set-system/300/main_qt_300.webp'],
        ['/qt-tea-set-system/5846/1_qt_5846.webp', '/qt-tea-set-system/2400/1_qt_2400.webp', '/qt-tea-set-system/1800/1_qt_1800.webp', '/qt-tea-set-system/1200/1_qt_1200.webp', "/qt-tea-set-system/600/1_qt_600.webp", '/qt-tea-set-system/300/1_qt_300.webp'],
        ['/qt-tea-set-system/5846/2_qt_5846.webp', '/qt-tea-set-system/2400/2_qt_2400.webp', '/qt-tea-set-system/1800/2_qt_1800.webp', '/qt-tea-set-system/1200/2_qt_1200.webp', "/qt-tea-set-system/600/2_qt_600.webp", '/qt-tea-set-system/300/2_qt_300.webp'],
        ['/qt-tea-set-system/5846/3_qt_5846.webp', '/qt-tea-set-system/2400/3_qt_2400.webp', '/qt-tea-set-system/1800/3_qt_1800.webp', '/qt-tea-set-system/1200/3_qt_1200.webp', "/qt-tea-set-system/600/3_qt_600.webp", '/qt-tea-set-system/300/3_qt_300.webp'],
        ['/qt-tea-set-system/5846/4_qt_5846.webp', '/qt-tea-set-system/2400/4_qt_2400.webp', '/qt-tea-set-system/1800/4_qt_1800.webp', '/qt-tea-set-system/1200/4_qt_1200.webp', "/qt-tea-set-system/600/4_qt_600.webp", '/qt-tea-set-system/300/4_qt_300.webp'],
        ['/qt-tea-set-system/5846/5_qt_5846.webp', '/qt-tea-set-system/2400/5_qt_2400.webp', '/qt-tea-set-system/1800/5_qt_1800.webp', '/qt-tea-set-system/1200/5_qt_1200.webp', "/qt-tea-set-system/600/5_qt_600.webp", '/qt-tea-set-system/300/5_qt_300.webp']]
    },
    {
      name: 'demeter mixer grinder',
      slug: 'demeter-mixer-grinder',
      shortDescription: 'Meet Demeter 2310 — the all-in-one blender and scale that brings style, simplicity, and precision to your kitchen. No more confusing buttons, messy counters, or oversized jars — just effortless smoothies and meals, tailored to you.',
      longDescription: ['Let us paint you a picture. It’s Friday afternoon, and you want to make a smoothie, but you are fed up with not knowing which button on your blender does what. You are tired of the mess you keep making in the kitchen with all the dishes, scales, and ingredients. Your blender jar is too big for one serving, so you decide sadly in the end not to make a smoothie at all.',
        'That does sound pretty bad, right? All your struggles come to an end with our revolutionary product. Introducing Demeter 2310, the solution to your problems, your companion in the kitchen, now no more confusing knobs, the scale and the blender are two in one. Choose the jar size that fits the purpose. Style, elegance, convenience, Demeter.'],
      projectData: 'Year: 2024'
        + '<br>'
        + 'Co-designer: Máté Guthy',
      mainImgUrl: ['/demeter-mixer-grinder/5846/demeter_5846.webp', '/demeter-mixer-grinder/2400/demeter_2400.webp', '/demeter-mixer-grinder/1800/demeter_1800.webp', '/demeter-mixer-grinder/1200/demeter_1200.webp', '/demeter-mixer-grinder/600/demeter_600.webp', '/demeter-mixer-grinder/300/demeter_300.webp'],
      imageUrls: [['/demeter-mixer-grinder/5846/demeter_5846.webp', '/demeter-mixer-grinder/2400/demeter_2400.webp', '/demeter-mixer-grinder/1800/demeter_1800.webp', '/demeter-mixer-grinder/1200/demeter_1200.webp', '/demeter-mixer-grinder/600/demeter_600.webp', '/demeter-mixer-grinder/300/demeter_300.webp'],
        ['/demeter-mixer-grinder/5846/1_5846.webp', '/demeter-mixer-grinder/2400/1_2400.webp', '/demeter-mixer-grinder/1800/1_1800.webp', '/demeter-mixer-grinder/1200/1_1200.webp', "/demeter-mixer-grinder/600/1_600.webp", '/demeter-mixer-grinder/300/1_300.webp'],
        ['/demeter-mixer-grinder/5846/2_5846.webp', '/demeter-mixer-grinder/2400/2_2400.webp', '/demeter-mixer-grinder/1800/2_1800.webp', '/demeter-mixer-grinder/1200/2_1200.webp', "/demeter-mixer-grinder/600/2_600.webp", '/demeter-mixer-grinder/300/2_300.webp'],
        ['/demeter-mixer-grinder/5846/3_5846.webp', '/demeter-mixer-grinder/2400/3_2400.webp', '/demeter-mixer-grinder/1800/3_1800.webp', '/demeter-mixer-grinder/1200/3_1200.webp', "/demeter-mixer-grinder/600/3_600.webp", '/demeter-mixer-grinder/300/3_300.webp'],
        ['/demeter-mixer-grinder/5846/4_5846.webp', '/demeter-mixer-grinder/2400/4_2400.webp', '/demeter-mixer-grinder/1800/4_1800.webp', '/demeter-mixer-grinder/1200/4_1200.webp', "/demeter-mixer-grinder/600/4_600.webp", '/demeter-mixer-grinder/300/4_300.webp'],
        ['/demeter-mixer-grinder/5846/5_5846.webp', '/demeter-mixer-grinder/2400/5_2400.webp', '/demeter-mixer-grinder/1800/5_1800.webp', '/demeter-mixer-grinder/1200/5_1200.webp', "/demeter-mixer-grinder/600/5_600.webp", '/demeter-mixer-grinder/300/5_300.webp']]
    },
    {
      name: 'archproject shoe insole system',
      slug: 'archproject-shoe-insole-system',
      shortDescription: 'The Archproject insole kit brings innovation to every step — combining smart sensors and adaptive design to evolve with your feet, turning orthopedic care into a sleek, empowering path to comfort, posture, and long-term well-being.',
      longDescription: ['Foot health is often overlooked — until pain starts getting in the way of everyday life. Sedentary lifestyles, hard urban surfaces, and unsupportive shoes have made flat feet and posture problems more common than ever, and when left untreated they can lead to serious complications. Archproject reimagines orthopedic care as something smart, sleek, and stigma-free.',
      'This adaptive insole kit uses pressure sensors, IoT technology, and a shape-shifting design to keep up with the natural changes in your feet — ensuring lasting comfort and proper support over time. With its refined, modular design, Archproject turns foot health into a simple, empowering, and even engaging part of daily life — promoting better posture, comfort, and long-term well-being.'],
      projectData: 'Year: 2023\n',
      mainImgUrl: ['/archproject-shoe-insole-system/5846/archproject_5846.webp', '/archproject-shoe-insole-system/2400/archproject_2400.webp', '/archproject-shoe-insole-system/1800/archproject_1800.webp', '/archproject-shoe-insole-system/1200/archproject_1200.webp', '/archproject-shoe-insole-system/600/archproject_600.webp', '/archproject-shoe-insole-system/300/archproject_300.webp'],
      imageUrls: [['/archproject-shoe-insole-system/5846/archproject_5846.webp', '/archproject-shoe-insole-system/2400/archproject_2400.webp', '/archproject-shoe-insole-system/1800/archproject_1800.webp', '/archproject-shoe-insole-system/1200/archproject_1200.webp', '/archproject-shoe-insole-system/600/archproject_600.webp', '/archproject-shoe-insole-system/300/archproject_300.webp'],
        ['/archproject-shoe-insole-system/5846/1_5846.webp', '/archproject-shoe-insole-system/2400/1_2400.webp', '/archproject-shoe-insole-system/1800/1_1800.webp', '/archproject-shoe-insole-system/1200/1_1200.webp', "/archproject-shoe-insole-system/600/1_600.webp", '/archproject-shoe-insole-system/300/1_300.webp'],
        ['/archproject-shoe-insole-system/5846/2_5846.webp', '/archproject-shoe-insole-system/2400/2_2400.webp', '/archproject-shoe-insole-system/1800/2_1800.webp', '/archproject-shoe-insole-system/1200/2_1200.webp', "/archproject-shoe-insole-system/600/2_600.webp", '/archproject-shoe-insole-system/300/2_300.webp'],
        ['/archproject-shoe-insole-system/5846/3_5846.webp', '/archproject-shoe-insole-system/2400/3_2400.webp', '/archproject-shoe-insole-system/1800/3_1800.webp', '/archproject-shoe-insole-system/1200/3_1200.webp', "/archproject-shoe-insole-system/600/3_600.webp", '/archproject-shoe-insole-system/300/3_300.webp']]
    },
    {
      name: 'depresszó coffee glass set',
      slug: 'depresszó-coffee-glass-set',
      shortDescription: 'The dePresszó coffee set transforms Hungarian sarcasm and pessimism into design — a playful blend of tradition, humor and function where the glasses, like the outlook, are always half empty — or half full…',
      longDescription: ['Coffee is more than just a drink — it’s a cultural statement. Many nations have their own coffee specialties, from Café Cubano to Irish Coffee, each reflecting tradition and even national stereotypes. In Hungary, coffee arrived during the Turkish occupation, first tied to the ominous phrase “feketeleves” (“the black soup”). Over time, it became a symbol of cultural and intellectual life, with legendary cafés like the New York Café shaping history.',
        'This project reimagines that story through a fictional Hungarian coffee: the dePresszó — a darkly humorous mix of espresso and Unicum that playfully embraces Hungarian pessimism. Its name nods to the classic question: “Half full or half empty?” — which, for Hungarians, is naturally half empty. The resulting 12-piece glass coffee set embodies this idea: one glass in each pair always stands upside down, so the set can never be completely full. Minimal yet expressive, it blends humor, functionality, and cultural commentary in a single design.'],
      projectData: 'Year: 2024'
        + '<br>'
        + 'Photo: Barna Berzsák, Milán Rácmolnár',
      mainImgUrl: ['/depresszó-coffee-glass-set/5846/depresszo_5846.webp', '/depresszó-coffee-glass-set/2400/depresszo_2400.webp', '/depresszó-coffee-glass-set/1800/depresszo_1800.webp', '/depresszó-coffee-glass-set/1200/depresszo_1200.webp', '/depresszó-coffee-glass-set/600/depresszo_600.webp', '/depresszó-coffee-glass-set/300/depresszo_300.webp'],
      imageUrls: [['/depresszó-coffee-glass-set/5846/depresszo_5846.webp', '/depresszó-coffee-glass-set/2400/depresszo_2400.webp', '/depresszó-coffee-glass-set/1800/depresszo_1800.webp', '/depresszó-coffee-glass-set/1200/depresszo_1200.webp', '/depresszó-coffee-glass-set/600/depresszo_600.webp', '/depresszó-coffee-glass-set/300/depresszo_300.webp'],
        ['/depresszó-coffee-glass-set/5846/1_5846.webp', '/depresszó-coffee-glass-set/2400/1_2400.webp', '/depresszó-coffee-glass-set/1800/1_1800.webp', '/depresszó-coffee-glass-set/1200/1_1200.webp', "/depresszó-coffee-glass-set/600/1_600.webp", '/depresszó-coffee-glass-set/300/1_300.webp'],
        ['/depresszó-coffee-glass-set/5846/2_5846.webp', '/depresszó-coffee-glass-set/2400/2_2400.webp', '/depresszó-coffee-glass-set/1800/2_1800.webp', '/depresszó-coffee-glass-set/1200/2_1200.webp', "/depresszó-coffee-glass-set/600/2_600.webp", '/depresszó-coffee-glass-set/300/2_300.webp'],
        ['/depresszó-coffee-glass-set/5846/3_5846.webp', '/depresszó-coffee-glass-set/2400/3_2400.webp', '/depresszó-coffee-glass-set/1800/3_1800.webp', '/depresszó-coffee-glass-set/1200/3_1200.webp', "/depresszó-coffee-glass-set/600/3_600.webp", '/depresszó-coffee-glass-set/300/3_300.webp'],
        ['/depresszó-coffee-glass-set/5846/4_5846.webp', '/depresszó-coffee-glass-set/2400/4_2400.webp', '/depresszó-coffee-glass-set/1800/4_1800.webp', '/depresszó-coffee-glass-set/1200/4_1200.webp', "/depresszó-coffee-glass-set/600/4_600.webp", '/depresszó-coffee-glass-set/300/4_300.webp'],
        ['/depresszó-coffee-glass-set/5846/5_5846.webp', '/depresszó-coffee-glass-set/2400/5_2400.webp', '/depresszó-coffee-glass-set/1800/5_1800.webp', '/depresszó-coffee-glass-set/1200/5_1200.webp', "/depresszó-coffee-glass-set/600/5_600.webp", '/depresszó-coffee-glass-set/300/5_300.webp']]
    },
    {
      name: 'resq avalanche transmitter',
      slug: 'resq-avalanche-transmitter',
      shortDescription: 'ResQ makes avalanche rescue fast, intuitive, and optimal — turning chaos into confident action when every second counts.',
      longDescription: ['Avalanches happen fast — and survival depends on quick, calm action. For freeriders, the best chance of rescue is not waiting for professionals but acting within their own group — yet panic, poor visibility, and confusing equipment can cost precious minutes. ResQ was designed to change that. This smart avalanche transmitter turns life-saving gear into something intuitive, stylish, and rider-friendly.',
        'Its compass-like form and 360° LED ring guide rescuers toward victims with clear visual feedback, while GPS alerts, fall detection, and built-in tutorials keep users prepared and informed in every situation. With its sleek iris-lock strap system, ResQ stays secure but always within reach, making it easy to grab and use when every second counts. By combining technology, ergonomics, and freerider style, ResQ transforms avalanche rescue from panic into confident, coordinated action.'],
      projectData: 'Year: 2024\n',
      mainImgUrl: ['/resq-avalanche-transmitter/5846/resq_5846.webp', '/resq-avalanche-transmitter/2400/resq_2400.webp', '/resq-avalanche-transmitter/1800/resq_1800.webp', '/resq-avalanche-transmitter/1200/resq_1200.webp', '/resq-avalanche-transmitter/600/resq_600.webp', '/resq-avalanche-transmitter/300/resq_300.webp'],
      imageUrls: [['/resq-avalanche-transmitter/5846/resq_5846.webp', '/resq-avalanche-transmitter/2400/resq_2400.webp', '/resq-avalanche-transmitter/1800/resq_1800.webp', '/resq-avalanche-transmitter/1200/resq_1200.webp', '/resq-avalanche-transmitter/600/resq_600.webp', '/resq-avalanche-transmitter/300/resq_300.webp'],
        ['/resq-avalanche-transmitter/5846/1_5846.webp', '/resq-avalanche-transmitter/2400/1_2400.webp', '/5gyogytea/1800/1_1800.webp', '/resq-avalanche-transmitter/1200/1_1200.webp', "/resq-avalanche-transmitter/600/1_600.webp", '/resq-avalanche-transmitter/300/1_300.webp'],
        ['/resq-avalanche-transmitter/5846/2_5846.webp', '/resq-avalanche-transmitter/2400/2_2400.webp', '/resq-avalanche-transmitter/1800/2_1800.webp', '/resq-avalanche-transmitter/1200/2_1200.webp', "/resq-avalanche-transmitter/600/2_600.webp", '/resq-avalanche-transmitter/300/2_300.webp'],
        ['/resq-avalanche-transmitter/5846/3_5846.webp', '/resq-avalanche-transmitter/2400/3_2400.webp', '/resq-avalanche-transmitter/1800/3_1800.webp', '/resq-avalanche-transmitter/1200/3_1200.webp', "/resq-avalanche-transmitter/600/3_600.webp", '/resq-avalanche-transmitter/300/3_300.webp'],
        ['/resq-avalanche-transmitter/5846/4_5846.webp', '/resq-avalanche-transmitter/2400/4_2400.webp', '/resq-avalanche-transmitter/1800/4_1800.webp', '/resq-avalanche-transmitter/1200/4_1200.webp', "/resq-avalanche-transmitter/600/4_600.webp", '/resq-avalanche-transmitter/300/4_300.webp'],
        ['/resq-avalanche-transmitter/5846/5_5846.webp', '/resq-avalanche-transmitter/2400/5_2400.webp', '/resq-avalanche-transmitter/1800/5_1800.webp', '/resq-avalanche-transmitter/1200/5_1200.webp', "/resq-avalanche-transmitter/600/5_600.webp", '/resq-avalanche-transmitter/300/5_300.webp']]
    },
    {
      name: 'chess',
      slug: 'chess',
      shortDescription: 'This experimental chess set explores how form can influence play. Inspired by Victor Vasarely and op-art, the chessboard alters perception — subtly shaping players’ decisions and the game’s dynamics.',
      longDescription: ['For over a thousand years, chess has fascinated the world — a simple set of rules giving rise to endless complexity. From royal courts to digital platforms, it has carried the symbolism of war, intellect, and strategy, while captivating both players and spectators across generations.',
      'Promontor reimagines this timeless duel through the lens of design. Inspired by Op Art and Victor Vasarely, its board distorts the familiar grid into an optical illusion of depth, transforming each match into both a contest of intellect and a visual spectacle. The result is a chess set that honors tradition while offering a fresh, dynamic experience for today’s players.'],
      projectData: 'Year: 2021'
        + '<br>'
        + 'Photo: Réka Nyikos',
      mainImgUrl: ['/chess/5846/chess_5846.webp', '/chess/2400/chess_2400.webp', '/chess/1800/chess_1800.webp', '/chess/1200/chess_1200.webp', '/chess/600/chess_600.webp', '/chess/300/chess_300.webp'],
      imageUrls: [['/chess/5846/chess_5846.webp', '/chess/2400/chess_2400.webp', '/chess/1800/chess_1800.webp', '/chess/1200/chess_1200.webp', '/chess/600/chess_600.webp', '/chess/300/chess_300.webp'],
        ['/chess/5846/1_5846.webp', '/chess/2400/1_2400.webp', '/chess/1800/1_1800.webp', '/chess/1200/1_1200.webp', '/chess/600/1_600.webp', '/chess/300/1_300.webp'],
        ['/chess/5846/2_5846.webp', '/chess/2400/2_2400.webp', '/chess/1800/2_1800.webp', '/chess/1200/2_1200.webp', '/chess/600/2_600.webp', '/chess/300/2_300.webp']]
    },
    {
      name: 'flying shark',
      slug: 'flying-shark',
      shortDescription: 'Red Bull Flugtag challenges teams to design, build, and launch flying machines over water. Inspired by the hit series Arcane, our creation soared — carrying the pilot an impressive 15 meters through the air.',
      longDescription: ['Red Bull Flugtag — German for “flight day” — is a global competition where engineering genius collides with absolute nonsense. Teams design and build human-powered flying machines, launching them off a platform into the water below. While the real spirit of the event lies in creativity, performance, and spectacle: teams are judged not only on distance but also on originality and showmanship — turning serious engineering into a comedy of wings.',
        'After centuries of careful research, design and development we unveiled our masterpiece: a flying shark. Inspired by Jinx’s shark gun from Arcane, it was equal parts aesthetic marvel and questionable aerodynamics. Against all odds — and to everyone’s amazement — it actually did not fly.'],
      projectData: 'Year: 2022'
        + '<br>'
        + 'Co-designers: Virág Oszkai, Róbert Kristóffy, Mátyás Galavits'
        + '<br>'
        + 'Photo: Péter Oszkai',
      mainImgUrl: ['/flying-shark/5846/3_5846.webp', '/flying-shark/2400/3_2400.webp', '/flying-shark/1800/3_1800.webp', '/flying-shark/1200/3_1200.webp', '/flying-shark/600/3_600.webp', '/flying-shark/300/3_300.webp'],
      imageUrls: [['/flying-shark/5846/3_5846.webp', '/flying-shark/2400/3_2400.webp', '/flying-shark/1800/3_1800.webp', '/flying-shark/1200/3_1200.webp', '/flying-shark/600/3_600.webp', '/flying-shark/300/3_300.webp'],
        ['/flying-shark/5846/sharky_5846.webp', '/flying-shark/2400/sharky_2400.webp', '/flying-shark/1800/sharky_1800.webp', '/flying-shark/1200/sharky_1200.webp', '/flying-shark/600/sharky_600.webp', '/flying-shark/300/sharky_300.webp'],
        ['/flying-shark/5846/1_5846.webp', '/flying-shark/2400/1_2400.webp', '/flying-shark/1800/1_1800.webp', '/flying-shark/1200/1_1200.webp', '/flying-shark/600/1_600.webp', '/flying-shark/300/1_300.webp'],
        ['/flying-shark/5846/2_5846.webp', '/flying-shark/2400/2_2400.webp', '/flying-shark/1800/2_1800.webp', '/flying-shark/1200/2_1200.webp', '/flying-shark/600/2_600.webp', '/flying-shark/300/2_300.webp'],
        ['/flying-shark/5846/4_5846.webp', '/flying-shark/2400/4_2400.webp', '/flying-shark/1800/4_1800.webp', '/flying-shark/1200/4_1200.webp', '/flying-shark/600/4_600.webp', '/flying-shark/300/4_300.webp'],
        ['/flying-shark/5846/5_5846.webp', '/flying-shark/2400/5_2400.webp', '/flying-shark/1800/5_1800.webp', '/flying-shark/1200/5_1200.webp', '/flying-shark/600/5_600.webp', '/flying-shark/300/5_300.webp']]
    },
    {
      name: 'clock',
      slug: 'clock',
      shortDescription: 'A wall clock that goes beyond function, serving as a decorative piece that marks not just the hour, but the essence of quality time itself — a reflection of Finnish culture and the serene beauty of its natural landscapes.',
      longDescription: ['The wall clock has shifted from a tool of necessity to a symbol of presence. Once the heartbeat of the household, it set the rhythm of daily life. Today, when time glows from every screen, its practical role has faded — yet its meaning remains. A wall clock now carries memory, atmosphere, and identity: it reminds us of tradition, reflects on the passing of time, and enriches interiors as a quiet statement of taste.',
      'Kuutamo was designed to carry this story forward. Inspired by Finnish nature and the midnight sun, it embraces the stillness of everyday life while celebrating the value of quality time, measured only by the slow movement of the hour hand. With its refined form and natural materials, it honors Finnish traditions and craftsmanship, transforming a familiar object into a poetic companion for modern living.'],
      projectData: 'Year: 2020',
      mainImgUrl: ['/clock/5846/2_5846.webp', '/clock/2400/2_2400.webp', '/clock/1800/2_1800.webp', '/clock/1200/2_1200.webp', '/clock/600/2_600.webp', '/clock/300/2_300.webp'],
      imageUrls: [['/clock/5846/2_5846.webp', '/clock/2400/2_2400.webp', '/clock/1800/2_1800.webp', '/clock/1200/2_1200.webp', '/clock/600/2_600.webp', '/clock/300/2_300.webp'],
        ['/clock/5846/1_5846.webp', '/clock/2400/1_2400.webp', '/clock/1800/1_1800.webp', '/clock/1200/1_1200.webp', '/clock/600/1_600.webp', '/clock/300/1_300.webp'],
        ['/clock/5846/3_5846.webp', '/clock/2400/3_2400.webp', '/clock/1800/3_1800.webp', '/clock/1200/3_1200.webp', '/clock/600/3_600.webp', '/clock/300/3_300.webp'],
        ['/clock/5846/4_5846.webp', '/clock/2400/4_2400.webp', '/clock/1800/4_1800.webp', '/clock/1200/4_1200.webp', '/clock/600/4_600.webp', '/clock/300/4_300.webp'],
        ['/clock/5846/5_5846.webp', '/clock/2400/5_2400.webp', '/clock/1800/5_1800.webp', '/clock/1200/5_1200.webp', '/clock/600/5_600.webp', '/clock/300/5_300.webp'],
        ['/clock/5846/6_5846.webp', '/clock/2400/6_2400.webp', '/clock/1800/6_1800.webp', '/clock/1200/6_1200.webp', '/clock/600/6_600.webp', '/clock/300/6_300.webp']]
    },
    {
      name: 'lumen',
      slug: 'lumen',
      shortDescription: 'How can we access clean energy anytime, anywhere? While solar panels can generate it, current systems are bulky and complex. Our solution: a modular, all-in-one system that’s easy to transport, simple to maintain, and ready to power life on the move.',
      longDescription: ['Solar energy holds enormous promise, yet it can still feel out of reach. Panels are often seen as costly, complicated technicalities that demand professional expertise. This uncertainty breeds hesitation: what if the system never pays off, or locks you into technology you can’t manage? To make matters worse, most available information is filled with jargon, written for experts rather than everyday users, leaving people doubtful and reluctant to take the first step.',
      'Lumen was created to change this. As a modular all-in-one system, it makes solar power simple and approachable. Each panel contains everything needed, so installation is quick, maintenance is effortless, and expansion feels like a natural step rather than a risky leap. With Lumen, solar energy is no longer a daunting investment, but a flexible companion — one that grows with you and brings clean power seamlessly into everyday life.'],
      projectData: 'Year: 2020'
        + '<br>'
        + 'Co-founder: Felícián Nagy',
      mainImgUrl: ['/lumen/5846/lumen_5846.webp', '/lumen/2400/lumen_2400.webp', '/lumen/1800/lumen_1800.webp', '/lumen/1200/lumen_1200.webp', '/lumen/600/lumen_600.webp', '/lumen/300/lumen_300.webp'],
      imageUrls: [['/lumen/5846/lumen_5846.webp', '/lumen/2400/lumen_2400.webp', '/lumen/1800/lumen_1800.webp', '/lumen/1200/lumen_1200.webp', '/lumen/600/lumen_600.webp', '/lumen/300/lumen_300.webp'],
        ['/lumen/5846/1_5846.webp', '/lumen/2400/1_2400.webp', '/lumen/1800/1_1800.webp', '/lumen/1200/1_1200.webp', '/lumen/600/1_600.webp', '/lumen/300/1_300.webp']]
    },
    {
      name: 'mini-market',
      slug: 'mini-market',
      shortDescription: 'Street vendors have long brought color and character to city life — Mini Market reimagines this tradition with a multifunctional vehicle that transforms from transport to stall, offering mobility, flexibility, and modern practicality.',
      longDescription: ['Street vendors have always added color and character to European cities — from medieval marketplaces to today’s Christmas stalls. They bring affordability, culture, and community into public life. Yet modern challenges such as strict regulations, unstable income, and the constant need to move and adapt make their work increasingly difficult.',
      'Mini Market was created as a flexible response to these realities. This multifunctional vehicle functions as both transport and vending platform, unfolding in simple steps to become a stall. Designed for personalization, it gives vendors a modern, practical tool to sustain their traditions while staying mobile and adaptable in today’s urban landscape.'],
      projectData: 'Year: 2021'
        + '<br>'
        + 'Co-designer: Nóra Szilágyi',
      mainImgUrl: ['/mini-market/5846/1_5846.webp', '/mini-market/2400/1_2400.webp', '/mini-market/1800/1_1800.webp', '/mini-market/1200/1_1200.webp', '/mini-market/600/1_600.webp', '/mini-market/300/1_300.webp'],
      imageUrls: [['/mini-market/5846/1_5846.webp', '/mini-market/2400/1_2400.webp', '/mini-market/1800/1_1800.webp', '/mini-market/1200/1_1200.webp', '/mini-market/600/1_600.webp', '/mini-market/300/1_300.webp'],
        ['/mini-market/5846/2_5846.webp', '/mini-market/2400/2_2400.webp', '/mini-market/1800/2_1800.webp', '/mini-market/1200/2_1200.webp', '/mini-market/600/2_600.webp', '/mini-market/300/2_300.webp'],
        ['/mini-market/5846/3_5846.webp', '/mini-market/2400/3_2400.webp', '/mini-market/1800/3_1800.webp', '/mini-market/1200/3_1200.webp', '/mini-market/600/3_600.webp', '/mini-market/300/3_300.webp'],
        ['/mini-market/5846/4_5846.webp', '/mini-market/2400/4_2400.webp', '/mini-market/1800/4_1800.webp', '/mini-market/1200/4_1200.webp', '/mini-market/600/4_600.webp', '/mini-market/300/4_300.webp'],
        ['/mini-market/5846/5_5846.webp', '/mini-market/2400/5_2400.webp', '/mini-market/1800/5_1800.webp', '/mini-market/1200/5_1200.webp', '/mini-market/600/5_600.webp', '/mini-market/300/5_300.webp'],
        ['/mini-market/5846/6_5846.webp', '/mini-market/2400/6_2400.webp', '/mini-market/1800/6_1800.webp', '/mini-market/1200/6_1200.webp', '/mini-market/600/6_600.webp', '/mini-market/300/6_300.webp']]
    },
    {
      name: 'tartáska',
      slug: 'tartáska',
      shortDescription: 'Poor posture is one of today’s quiet health challenges — Tartáska turns correction into a natural part of daily routine providing discreet support that feels effortless and natural.',
      longDescription: ['Poor posture has quietly become one of the defining side effects of modern life. Hours spent hunched over screens and phones strain the body’s natural support, leading to stiff shoulders, slouched backs, and long-term discomfort. What seems like a small habit can, over time, grow into chronic pain, reduced breathing capacity, and even a loss of confidence.',
      'Tartáska was designed as a response to this challenge. By merging a medical posture corrector with the familiar everyday object of a backpack, it transforms a stigmatized aid into something natural, wearable, and discreet. Comfortable and approachable, Tartáska integrates health support seamlessly into daily routines — helping good posture feel less like treatment and more like lifestyle.'],
      projectData: 'Year: 2018'
        + '<br>'
        + 'Photo: Barna Berzsák',
      mainImgUrl: ['/tartáska/5846/tartáska_5846.webp', '/tartáska/2400/tartáska_2400.webp', '/tartáska/1800/tartáska_1800.webp', '/tartáska/1200/tartáska_1200.webp', '/tartáska/600/tartáska_600.webp', '/tartáska/300/tartáska_300.webp'],
      imageUrls: [['/tartáska/5846/tartáska_5846.webp', '/tartáska/2400/tartáska_2400.webp', '/tartáska/1800/tartáska_1800.webp', '/tartáska/1200/tartáska_1200.webp', '/tartáska/600/tartáska_600.webp', '/tartáska/300/tartáska_300.webp'],
        ['/tartáska/5846/1_5846.webp', '/tartáska/2400/1_2400.webp', '/tartáska/1800/1_1800.webp', '/tartáska/1200/1_1200.webp', '/tartáska/600/1_600.webp', '/tartáska/300/1_300.webp']]
    }
  ];

  getAllProjects(): ProjectDetails[] {
    return this.projectList;
  }

  getProject(slug: string): ProjectDetails {
    return <ProjectDetails>this.projectList.find((p) => p.slug === slug);
  }

  constructor() {
  }
}
