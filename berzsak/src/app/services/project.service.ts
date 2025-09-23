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
      longDescription: 'Herbal tea doesn’t have to feel old-fashioned. Regular consumption of herbs is one of the simplest ways to support the harmony of body and mind — so why not make it exciting, fresh, and easy to enjoy every day? This project set out to reimagine herbal tea for a younger, health-conscious generation.\n' +
        '\n' +
        'The QT tea set is a contemporary system that brings new life to the ritual of tea drinking. It respects the cultural roots of herbs while turning them into a modern, intuitive experience that fits seamlessly into today’s fast-paced lifestyle. Beyond home use, the design also aims to elevate the way tea is served and enjoyed in hotels, restaurants, and other hospitality spaces, making the act of drinking tea more engaging and memorable. \n' +
        '\n' +
        'With its clean, minimal form, QT transforms tea preparation into a small ritual of pleasure and presence — turning herbal tea from a rare indulgence into a mindful moment, an inspiring part of everyday life.',
      projectData: 'Year: 2025\n'
                  + 'Photo: Anna Hardy, Balázs Harmathy',
      mainImgUrl: ['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
      imageUrls: [['/1-gyogytea/5846/main_qt_5846.webp', '/1-gyogytea/2400/main_qt_2400.webp', '/1-gyogytea/1800/main_qt_1800.webp', '/1-gyogytea/1200/main_qt_1200.webp', "/1-gyogytea/600/main_qt_600.webp", '/1-gyogytea/300/main_qt_300.webp'],
        ['/1-gyogytea/5846/1_qt_5846.webp', '/1-gyogytea/2400/1_qt_2400.webp', '/1-gyogytea/1800/1_qt_1800.webp', '/1-gyogytea/1200/1_qt_1200.webp', "/1-gyogytea/600/1_qt_600.webp", '/1-gyogytea/300/1_qt_300.webp'],
        ['/1-gyogytea/5846/2_qt_5846.webp', '/1-gyogytea/2400/2_qt_2400.webp', '/1-gyogytea/1800/2_qt_1800.webp', '/1-gyogytea/1200/2_qt_1200.webp', "/1-gyogytea/600/2_qt_600.webp", '/1-gyogytea/300/2_qt_300.webp'],
        ['/1-gyogytea/5846/3_qt_5846.webp', '/1-gyogytea/2400/3_qt_2400.webp', '/1-gyogytea/1800/3_qt_1800.webp', '/1-gyogytea/1200/3_qt_1200.webp', "/1-gyogytea/600/3_qt_600.webp", '/1-gyogytea/300/3_qt_300.webp'],
        ['/1-gyogytea/5846/4_qt_5846.webp', '/1-gyogytea/2400/4_qt_2400.webp', '/1-gyogytea/1800/4_qt_1800.webp', '/1-gyogytea/1200/4_qt_1200.webp', "/1-gyogytea/600/4_qt_600.webp", '/1-gyogytea/300/4_qt_300.webp'],
        ['/1-gyogytea/5846/5_qt_5846.webp', '/1-gyogytea/2400/5_qt_2400.webp', '/1-gyogytea/1800/5_qt_1800.webp', '/1-gyogytea/1200/5_qt_1200.webp', "/1-gyogytea/600/5_qt_600.webp", '/1-gyogytea/300/5_qt_300.webp']]
    },
    {
      name: 'demeter mixer grinder',
      slug: 'demeter-mixer-grinder',
      shortDescription: 'Meet Demeter 2310 — the all-in-one blender and scale that brings style, simplicity, and precision to your kitchen. No more confusing buttons, messy counters, or oversized jars — just effortless smoothies and meals, tailored to you.',
      longDescription: 'Let us paint you a picture. It’s Friday afternoon, and you want to make a smoothie, but you are fed up with not knowing which button on your blender does what. You are tired of the mess you keep making in the kitchen with all the dishes, scales, and ingredients. Your blender jar is too big for one serving, so you decide sadly in the end not to make a smoothie at all. That does sound pretty bad, right? All your struggles come to an end with our revolutionary product. Introducing Demeter 2310, the solution to your problems, your companion in the kitchen, now no more confusing knobs, the scale and the blender are two in one. Choose the jar size that fits the purpose. Style, elegance, convenience, Demeter.',
      projectData: 'Year: 2024\n'
        + 'Co-designer: Máté Guthy',
      mainImgUrl: ['/2-gyogytea/5846/demeter.jpg', '/2-gyogytea/5846/demeter.jpg', '/2-gyogytea/5846/demeter.jpg', '/2-gyogytea/5846/demeter.jpg', '/2-gyogytea/5846/demeter.jpg', '/2-gyogytea/5846/demeter.jpg'],
      imageUrls: [['/2-gyogytea/5846/demeter.jpg', '/2-gyogytea/5846/demeter.jpg', '/2-gyogytea/5846/demeter.jpg', '/2-gyogytea/5846/demeter.jpg', '/2-gyogytea/5846/demeter.jpg', '/2-gyogytea/5846/demeter.jpg'],
        ['/2-gyogytea/5846/1_qt_5846.webp', '/2-gyogytea/2400/1_qt_2400.webp', '/2-gyogytea/1800/1_qt_1800.webp', '/2-gyogytea/1200/1_qt_1200.webp', "/2-gyogytea/600/1_qt_600.webp", '/2-gyogytea/300/1_qt_300.webp'],
        ['/2-gyogytea/5846/2_qt_5846.webp', '/2-gyogytea/2400/2_qt_2400.webp', '/2-gyogytea/1800/2_qt_1800.webp', '/2-gyogytea/1200/2_qt_1200.webp', "/2-gyogytea/600/2_qt_600.webp", '/2-gyogytea/300/2_qt_300.webp'],
        ['/2-gyogytea/5846/3_qt_5846.webp', '/2-gyogytea/2400/3_qt_2400.webp', '/2-gyogytea/1800/3_qt_1800.webp', '/2-gyogytea/1200/3_qt_1200.webp', "/2-gyogytea/600/3_qt_600.webp", '/2-gyogytea/300/3_qt_300.webp'],
        ['/2-gyogytea/5846/4_qt_5846.webp', '/2-gyogytea/2400/4_qt_2400.webp', '/2-gyogytea/1800/4_qt_1800.webp', '/2-gyogytea/1200/4_qt_1200.webp', "/2-gyogytea/600/4_qt_600.webp", '/2-gyogytea/300/4_qt_300.webp']]
    },
    {
      name: 'archproject shoe insole system',
      slug: 'archproject-shoe-insole-system',
      shortDescription: 'The Archproject insole kit brings innovation to every step — combining smart sensors and adaptive design to evolve with your feet, turning orthopedic care into a sleek, empowering path to comfort, posture, and long-term well-being.',
      longDescription: 'Foot health is often overlooked — until pain starts getting in the way of everyday life. Sedentary lifestyles, hard urban surfaces, and unsupportive shoes have made flat feet and posture problems more common than ever, and when left untreated they can lead to serious complications.\n' +
        '\n' +
        'Archproject reimagines orthopedic care as something smart, sleek, and stigma-free. This adaptive insole kit uses pressure sensors, IoT technology, and a shape-shifting design to keep up with the natural changes in your feet — ensuring lasting comfort and proper support over time.\n' +
        '\n' +
        'With its refined, modular design, Archproject turns foot health into a simple, empowering, and even engaging part of daily life — promoting better posture, comfort, and long-term well-being.',
      projectData: 'Year: 2023\n',
      mainImgUrl: ['/3-gyogytea/5846/archproject.jpg', '/3-gyogytea/5846/archproject.jpg', '/3-gyogytea/5846/archproject.jpg', '/3-gyogytea/5846/archproject.jpg', '/3-gyogytea/5846/archproject.jpg', '/3-gyogytea/5846/archproject.jpg'],
      imageUrls: [['/3-gyogytea/5846/archproject.jpg', '/3-gyogytea/5846/archproject.jpg', '/3-gyogytea/5846/archproject.jpg', '/3-gyogytea/5846/archproject.jpg', '/3-gyogytea/5846/archproject.jpg', '/3-gyogytea/5846/archproject.jpg'],
        ['/3-gyogytea/5846/1_qt_5846.webp', '/3-gyogytea/2400/1_qt_2400.webp', '/3-gyogytea/1800/1_qt_1800.webp', '/3-gyogytea/1200/1_qt_1200.webp', "/3-gyogytea/600/1_qt_600.webp", '/3-gyogytea/300/1_qt_300.webp'],
        ['/3-gyogytea/5846/2_qt_5846.webp', '/3-gyogytea/2400/2_qt_2400.webp', '/3-gyogytea/1800/2_qt_1800.webp', '/3-gyogytea/1200/2_qt_1200.webp', "/3-gyogytea/600/2_qt_600.webp", '/3-gyogytea/300/2_qt_300.webp'],
        ['/3-gyogytea/5846/3_qt_5846.webp', '/3-gyogytea/2400/3_qt_2400.webp', '/3-gyogytea/1800/3_qt_1800.webp', '/3-gyogytea/1200/3_qt_1200.webp', "/3-gyogytea/600/3_qt_600.webp", '/3-gyogytea/300/3_qt_300.webp']]
    },
    {
      name: 'depresszó coffee glass set',
      slug: 'depresszó-coffee-glass-set',
      shortDescription: 'The dePresszó coffee set transforms Hungarian sarcasm and pessimism into design — a playful blend of tradition, humor and function where the glasses, like the outlook, are always half empty — or half full…',
      longDescription: 'Coffee is more than just a drink — it’s a cultural statement. Many nations have their own coffee specialties, from Café Cubano to Irish Coffee, each reflecting tradition and even national stereotypes. In Hungary, coffee arrived during the Turkish occupation, first tied to the ominous phrase “feketeleves” (“the black soup”). Over time, it became a symbol of cultural and intellectual life, with legendary cafés like the New York Café shaping history.\n' +
        '\n' +
        'This project reimagines that story through a fictional Hungarian coffee: the dePresszó — a darkly humorous mix of espresso and Unicum that playfully embraces Hungarian pessimism. Its name nods to the classic question: “Half full or half empty?” — which, for Hungarians, is naturally half empty.\n' +
        '\n' +
        'The resulting 12-piece glass coffee set embodies this idea: one glass in each pair always stands upside down, so the set can never be completely full. Minimal yet expressive, it blends humor, functionality, and cultural commentary in a single design.',
      projectData: 'Year: 2024\n'
        + 'Photo: Barna Berzsák, Milán Rácmolnár',
      mainImgUrl: ['/4-gyogytea/5846/depresszo.jpg', '/4-gyogytea/5846/depresszo.jpg', '/4-gyogytea/5846/depresszo.jpg', '/4-gyogytea/5846/depresszo.jpg', '/4-gyogytea/5846/depresszo.jpg', '/4-gyogytea/5846/depresszo.jpg'],
      imageUrls: [['/4-gyogytea/5846/depresszo.jpg', '/4-gyogytea/5846/depresszo.jpg', '/4-gyogytea/5846/depresszo.jpg', '/4-gyogytea/5846/depresszo.jpg', '/4-gyogytea/5846/depresszo.jpg', '/4-gyogytea/5846/depresszo.jpg'],
        ['/4-gyogytea/5846/1_qt_5846.webp', '/4-gyogytea/2400/1_qt_2400.webp', '/4-gyogytea/1800/1_qt_1800.webp', '/4-gyogytea/1200/1_qt_1200.webp', "/4-gyogytea/600/1_qt_600.webp", '/4-gyogytea/300/1_qt_300.webp'],
        ['/4-gyogytea/5846/2_qt_5846.webp', '/4-gyogytea/2400/2_qt_2400.webp', '/4-gyogytea/1800/2_qt_1800.webp', '/4-gyogytea/1200/2_qt_1200.webp', "/4-gyogytea/600/2_qt_600.webp", '/4-gyogytea/300/2_qt_300.webp']]
    },
    {
      name: 'resq avalanche transmitter',
      slug: 'resq-avalanche-transmitter',
      shortDescription: 'ResQ makes avalanche rescue fast, intuitive, and optimal — turning chaos into confident action when every second counts.',
      longDescription: 'Avalanches happen fast — and survival depends on quick, calm action. For freeriders, the best chance of rescue is not waiting for professionals but acting within their own group — yet panic, poor visibility, and confusing equipment can cost precious minutes.\n' +
        '\n' +
        'ResQ was designed to change that. This smart avalanche transmitter turns life-saving gear into something intuitive, stylish, and rider-friendly. Its compass-like form and 360° LED ring guide rescuers toward victims with clear visual feedback, while GPS alerts, fall detection, and built-in tutorials keep users prepared and informed in every situation.\n' +
        '\n' +
        'With its sleek iris-lock strap system, ResQ stays secure but always within reach, making it easy to grab and use when every second counts. By combining technology, ergonomics, and freerider style, ResQ transforms avalanche rescue from panic into confident, coordinated action.',
      projectData: 'Year: 2024\n',
      mainImgUrl: ['/5-gyogytea/5846/resq.jpg', '/5-gyogytea/5846/resq.jpg', '/5-gyogytea/5846/resq.jpg', '/5-gyogytea/5846/resq.jpg', '/5-gyogytea/5846/resq.jpg', '/5-gyogytea/5846/resq.jpg'],
      imageUrls: [['/5-gyogytea/5846/resq.jpg', '/5-gyogytea/5846/resq.jpg', '/5-gyogytea/5846/resq.jpg', '/5-gyogytea/5846/resq.jpg', '/5-gyogytea/5846/resq.jpg', '/5-gyogytea/5846/resq.jpg'],
        ['/5-gyogytea/5846/1_qt_5846.webp', '/5-gyogytea/2400/1_qt_2400.webp', '/5gyogytea/1800/1_qt_1800.webp', '/5-gyogytea/1200/1_qt_1200.webp', "/5-gyogytea/600/1_qt_600.webp", '/5-gyogytea/300/1_qt_300.webp'],
        ['/5-gyogytea/5846/2_qt_5846.webp', '/5-gyogytea/2400/2_qt_2400.webp', '/5-gyogytea/1800/2_qt_1800.webp', '/5-gyogytea/1200/2_qt_1200.webp', "/5-gyogytea/600/2_qt_600.webp", '/5-gyogytea/300/2_qt_300.webp'],
        ['/5-gyogytea/5846/3_qt_5846.webp', '/5-gyogytea/2400/3_qt_2400.webp', '/5-gyogytea/1800/3_qt_1800.webp', '/5-gyogytea/1200/3_qt_1200.webp', "/5-gyogytea/600/3_qt_600.webp", '/5-gyogytea/300/3_qt_300.webp'],
        ['/5-gyogytea/5846/4_qt_5846.webp', '/5-gyogytea/2400/4_qt_2400.webp', '/5-gyogytea/1800/4_qt_1800.webp', '/5-gyogytea/1200/4_qt_1200.webp', "/5-gyogytea/600/4_qt_600.webp", '/5-gyogytea/300/4_qt_300.webp'],
        ['/5-gyogytea/5846/5_qt_5846.webp', '/5-gyogytea/2400/5_qt_2400.webp', '/5-gyogytea/1800/5_qt_1800.webp', '/5-gyogytea/1200/5_qt_1200.webp', "/5-gyogytea/600/5_qt_600.webp", '/5-gyogytea/300/5_qt_300.webp']]
    },
    {
      name: 'chess',
      slug: 'chess',
      shortDescription: 'This experimental chess set explores how form can influence play. Inspired by Victor Vasarely and op-art, the chessboard alters perception — subtly shaping players’ decisions and the game’s dynamics.',
      longDescription: 'his experimental chess set explores how form can influence play. Inspired by Victor Vasarely and op-art, the chessboard alters perception — subtly shaping players’ decisions and the game’s dynamics.',
      projectData: 'Year: 2021\n'
        + 'Photo: Réka Nyikos',
      mainImgUrl: ['/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg'],
      imageUrls: [['/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg'],
        ['/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg']]
    },
    {
      name: 'flying shark',
      slug: 'flying-shark',
      shortDescription: 'Red Bull Flugtag challenges teams to design, build, and launch flying machines over water. Inspired by the hit series Arcane, our creation soared — carrying the pilot an impressive 15 meters through the air.',
      longDescription: 'Red Bull Flugtag challenges teams to design, build, and launch flying machines over water. Inspired by the hit series Arcane, our creation soared — carrying the pilot an impressive 15 meters through the air.',
      projectData: 'Year: 2022\n'
        + 'Co-designers: Virág Oszkai, Róbert Kristóffy, Mátyás Galavits\n'
        + 'Photo: Péter Oszkai',
      mainImgUrl: ['/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg'],
      imageUrls: [['/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg'],
        ['/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg', '/chess/chess.jpg']]
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
