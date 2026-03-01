import type { Language } from '@/i18n/config'

interface Translation {
  title: string
  subtitle: string
  description: string
  posts: string
  tags: string
  about: string
  toc: string
}

export const ui: Record<Language, Translation> = {
  'de': {
    title: 'Reisetagebuch',
    subtitle: 'Notiere einfach, was du gelernt, gesehen und gefühlt hast',
    description: 'Der Titel stammt aus einem früheren Projekt: Durch Check-ins auf Reisen dokumentieren Reisende ihre Erlebnisse und hinterlassen Rätsel für den nächsten Reisenden',
    posts: 'Beiträge',
    tags: 'Schlagwörter',
    about: 'Über',
    toc: 'Inhaltsverzeichnis',
  },
  'en': {
    title: 'Wandering Journal',
    subtitle: 'Casually recording what I learned, saw, and felt',
    description: 'The title originates from a previous project: through travel check-ins, travelers record what they see along the way while leaving puzzles for the next traveler',
    posts: 'Posts',
    tags: 'Tags',
    about: 'About',
    toc: 'Table of Contents',
  },
  'es': {
    title: 'Diario de Viaje',
    subtitle: 'Anota espontáneamente lo aprendido, visto y sentido',
    description: 'El título proviene de un proyecto anterior: mediante check-ins de viaje, los viajeros registran lo que ven en el camino y dejan acertijos para el siguiente viajero',
    posts: 'Artículos',
    tags: 'Etiquetas',
    about: 'Sobre',
    toc: 'Índice',
  },
  'fr': {
    title: 'Carnet de Voyage',
    subtitle: 'Noter au fil de l\'eau ce que l\'on apprend, voit et ressent',
    description: 'Le titre vient d\'un projet précédent : lors des check-ins de voyage, les voyageurs consignent leurs découvertes et laissent des énigmes au prochain voyageur',
    posts: 'Articles',
    tags: 'Étiquettes',
    about: 'À propos',
    toc: 'Table des matières',
  },
  'ja': {
    title: '漫遊手帳',
    subtitle: '学んだこと、見たこと、感じたことを気ままに記録',
    description: 'タイトルは以前のプロジェクトに由来します：旅行チェックインを通じて、旅人は道中の見聞を記録し、次の旅人へ謎を残していくのです',
    posts: '記事',
    tags: 'タグ',
    about: '概要',
    toc: '目次',
  },
  'ko': {
    title: '방랑 수첩',
    subtitle: '배운 것, 본 것, 느낀 것을 자유롭게 기록',
    description: '제목은 이전 프로젝트에서 유래했습니다: 여행 체크인을 통해 여행자는 여정에서 본 것들을 기록하고 다음 여행자를 위해 수수께끼를 남깁니다',
    posts: '게시물',
    tags: '태그',
    about: '소개',
    toc: '목차',
  },
  'pl': {
    title: 'Dziennik Wędrówek',
    subtitle: 'Zapisuj to, czego się nauczyłeś, co zobaczyłeś i co poczułeś',
    description: 'Tytuł pochodzi z wcześniejszego projektu: podróżnicy odhaczają odwiedzone miejsca, zapisują to, co widzieli po drodze, i zostawiają zagadki dla następnego podróżnika',
    posts: 'Artykuły',
    tags: 'Tagi',
    about: 'O stronie',
    toc: 'Spis treści',
  },
  'pt': {
    title: 'Diário de Viagem',
    subtitle: 'Registre o que aprendeu, viu e sentiu',
    description: 'O título é inspirado num projeto anterior: através de check-ins de viagem, viajantes registram o que viram pelo caminho e deixam enigmas para o próximo viajante',
    posts: 'Artigos',
    tags: 'Tags',
    about: 'Sobre',
    toc: 'Sumário',
  },
  'ru': {
    title: 'Дневник странствий',
    subtitle: 'Записывай чему научился, что увидел и что почувствовал',
    description: 'Название взято из предыдущего проекта: путешественники отмечаются в точках маршрута, записывают то, что видели по пути, и оставляют загадки для следующего путешественника',
    posts: 'Посты',
    tags: 'Теги',
    about: 'О себе',
    toc: 'Оглавление',
  },
  'zh': {
    title: '漫游手账',
    subtitle: '随手记录下所学，所看，所感',
    description: '题目源自于之前所做的一个项目：通过旅行打卡，旅行者记录沿途所见所得，同时留下谜题给下一位旅行者',
    posts: '文章',
    tags: '标签',
    about: '关于',
    toc: '目录',
  },
  'zh-tw': {
    title: '漫遊手帳',
    subtitle: '隨手記錄下所學、所看、所感',
    description: '題目源自於之前所做的一個專案：透過旅行打卡，旅行者記錄沿途所見所得，同時留下謎題給下一位旅行者',
    posts: '文章',
    tags: '標籤',
    about: '關於',
    toc: '目錄',
  },
}
