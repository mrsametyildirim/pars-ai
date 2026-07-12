const FJ_I18N = (function () {

  const TOOL_DATA = {
    'tools/pdf-birlestir.html': 'pdfMerge',
    'tools/pdf-sikistir.html':  'pdfCompress',
    'tools/word-pdf.html':      'wordToPdf',
    'tools/gorsel-sikistir.html': 'imgCompress',
    'tools/video-sikistir.html':  'videoCompress',
    'tools/arkaplan-kaldir.html': 'removeBg',
    'tools/pdf-bol.html':       'pdfSplit',
    'tools/heic-jpg.html':      'heicToJpg',
    'tools/video-mp3.html':     'videoToMp3',
    'tools/pdf-word.html':      'pdfToWord',
    'tools/ocr.html':           'ocr',
    'tools/gorsel-pdf.html':    'imgToPdf',
    'tools/ses-kesici.html':    'audioCut',
    'tools/excel-pdf.html':     'excelToPdf',
    'tools/webp-jpg.html':      'webpToJpg',
  };

  const LANGS = {
    tr: {
      langName: 'Türkçe', langCode: 'TR', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': 'Belge', 'nav-gorsel': 'Görsel',
        'nav-video': 'Video', 'nav-ses': 'Ses', 'nav-all-tools': 'Tüm Araçlar',
        'btn-support': 'Destek Ol', 'btn-about': 'Bizi Tanı', 'btn-login': 'Giriş Yap',
        'hero-title': 'Dosyan hazır.', 'hero-title-accent': 'Formatını değiştirelim.',
        'hero-sub': 'PDF, belge, görsel, video ve ses dosyalarını hızlı, güvenli ve kolayca dönüştür.',
        'search-placeholder': 'Ne yapmak istiyorsun?', 'popular-label': 'Popüler Araçlar',
        'footer-tagline': 'Dosyalarını hızlı, güvenli ve kolayca dönüştür.',
        'footer-trust': 'Dosyalar işlemden sonra otomatik silinir.',
        'footer-copy': '© 2026 FormatJet. Tüm hakları saklıdır.',
        'more-langs': 'Diğer diller →',
      },
      tools: {
        pdfMerge: 'PDF Birleştir', pdfCompress: 'PDF Sıkıştır', wordToPdf: 'Word\'den PDF',
        imgCompress: 'Görsel Sıkıştır', videoCompress: 'Video Sıkıştır', removeBg: 'Arka Plan Kaldır',
        pdfSplit: 'PDF Böl', heicToJpg: 'HEIC\'den JPG', videoToMp3: 'Video\'dan MP3',
        pdfToWord: 'PDF\'den Word', ocr: 'OCR ile Metin Çıkar', imgToPdf: 'JPG\'den PDF',
        audioCut: 'Ses Kesici', excelToPdf: 'Excel\'den PDF', webpToJpg: 'WebP\'den JPG',
      },
      toolOrder: ['tools/pdf-birlestir.html','tools/pdf-sikistir.html','tools/word-pdf.html','tools/gorsel-sikistir.html','tools/video-sikistir.html','tools/arkaplan-kaldir.html','tools/pdf-bol.html','tools/heic-jpg.html','tools/video-mp3.html','tools/pdf-word.html','tools/ocr.html','tools/gorsel-pdf.html','tools/ses-kesici.html','tools/excel-pdf.html','tools/webp-jpg.html'],
      paymentMethods: ['Kredi Kartı', 'Banka Havalesi', 'PayPal', 'Papara'],
    },
    en: {
      langName: 'English', langCode: 'EN', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': 'Documents', 'nav-gorsel': 'Images',
        'nav-video': 'Video', 'nav-ses': 'Audio', 'nav-all-tools': 'All Tools',
        'btn-support': 'Support Us', 'btn-about': 'About', 'btn-login': 'Sign In',
        'hero-title': 'Your file is ready.', 'hero-title-accent': 'Let\'s change the format.',
        'hero-sub': 'Convert PDF, documents, images, videos and audio files quickly, safely and easily.',
        'search-placeholder': 'What do you want to do?', 'popular-label': 'Popular Tools',
        'footer-tagline': 'Convert your files quickly, safely and easily.',
        'footer-trust': 'Files are automatically deleted after processing.',
        'footer-copy': '© 2026 FormatJet. All rights reserved.',
        'more-langs': 'More languages →',
      },
      tools: {
        pdfMerge: 'Merge PDF', pdfCompress: 'Compress PDF', wordToPdf: 'Word to PDF',
        imgCompress: 'Compress Image', videoCompress: 'Compress Video', removeBg: 'Remove Background',
        pdfSplit: 'Split PDF', heicToJpg: 'HEIC to JPG', videoToMp3: 'Video to MP3',
        pdfToWord: 'PDF to Word', ocr: 'OCR Text Extract', imgToPdf: 'JPG to PDF',
        audioCut: 'Audio Cutter', excelToPdf: 'Excel to PDF', webpToJpg: 'WebP to JPG',
      },
      toolOrder: ['tools/pdf-birlestir.html','tools/arkaplan-kaldir.html','tools/gorsel-sikistir.html','tools/pdf-sikistir.html','tools/heic-jpg.html','tools/word-pdf.html','tools/video-mp3.html','tools/pdf-bol.html','tools/video-sikistir.html','tools/webp-jpg.html','tools/pdf-word.html','tools/gorsel-pdf.html','tools/ocr.html','tools/excel-pdf.html','tools/ses-kesici.html'],
      paymentMethods: ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'],
    },
    de: {
      langName: 'Deutsch', langCode: 'DE', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': 'Dokumente', 'nav-gorsel': 'Bilder',
        'nav-video': 'Video', 'nav-ses': 'Audio', 'nav-all-tools': 'Alle Tools',
        'btn-support': 'Unterstützen', 'btn-about': 'Über uns', 'btn-login': 'Anmelden',
        'hero-title': 'Ihre Datei ist bereit.', 'hero-title-accent': 'Format ändern leicht gemacht.',
        'hero-sub': 'PDF, Dokumente, Bilder, Videos und Audiodateien schnell, sicher und einfach konvertieren.',
        'search-placeholder': 'Was möchten Sie tun?', 'popular-label': 'Beliebte Tools',
        'footer-tagline': 'Dateien schnell, sicher und einfach konvertieren.',
        'footer-trust': 'Dateien werden nach der Verarbeitung automatisch gelöscht.',
        'footer-copy': '© 2026 FormatJet. Alle Rechte vorbehalten.',
        'more-langs': 'Weitere Sprachen →',
      },
      tools: {
        pdfMerge: 'PDF zusammenführen', pdfCompress: 'PDF komprimieren', wordToPdf: 'Word zu PDF',
        imgCompress: 'Bild komprimieren', videoCompress: 'Video komprimieren', removeBg: 'Hintergrund entfernen',
        pdfSplit: 'PDF aufteilen', heicToJpg: 'HEIC zu JPG', videoToMp3: 'Video zu MP3',
        pdfToWord: 'PDF zu Word', ocr: 'OCR Textextraktion', imgToPdf: 'JPG zu PDF',
        audioCut: 'Audio schneiden', excelToPdf: 'Excel zu PDF', webpToJpg: 'WebP zu JPG',
      },
      toolOrder: ['tools/pdf-birlestir.html','tools/pdf-sikistir.html','tools/pdf-bol.html','tools/word-pdf.html','tools/excel-pdf.html','tools/pdf-word.html','tools/ocr.html','tools/gorsel-sikistir.html','tools/video-sikistir.html','tools/arkaplan-kaldir.html','tools/heic-jpg.html','tools/video-mp3.html','tools/gorsel-pdf.html','tools/webp-jpg.html','tools/ses-kesici.html'],
      paymentMethods: ['Kreditkarte', 'PayPal', 'SOFORT', 'Klarna'],
    },
    fr: {
      langName: 'Français', langCode: 'FR', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': 'Documents', 'nav-gorsel': 'Images',
        'nav-video': 'Vidéo', 'nav-ses': 'Audio', 'nav-all-tools': 'Tous les outils',
        'btn-support': 'Soutenir', 'btn-about': 'À propos', 'btn-login': 'Se connecter',
        'hero-title': 'Votre fichier est prêt.', 'hero-title-accent': 'Changeons le format.',
        'hero-sub': 'Convertissez PDF, documents, images, vidéos et fichiers audio rapidement et facilement.',
        'search-placeholder': 'Que voulez-vous faire?', 'popular-label': 'Outils populaires',
        'footer-tagline': 'Convertissez vos fichiers rapidement et en toute sécurité.',
        'footer-trust': 'Les fichiers sont automatiquement supprimés après traitement.',
        'footer-copy': '© 2026 FormatJet. Tous droits réservés.',
        'more-langs': 'Plus de langues →',
      },
      tools: {
        pdfMerge: 'Fusionner PDF', pdfCompress: 'Compresser PDF', wordToPdf: 'Word en PDF',
        imgCompress: 'Compresser image', videoCompress: 'Compresser vidéo', removeBg: 'Supprimer l\'arrière-plan',
        pdfSplit: 'Diviser PDF', heicToJpg: 'HEIC en JPG', videoToMp3: 'Vidéo en MP3',
        pdfToWord: 'PDF en Word', ocr: 'Extraire texte OCR', imgToPdf: 'JPG en PDF',
        audioCut: 'Couper audio', excelToPdf: 'Excel en PDF', webpToJpg: 'WebP en JPG',
      },
      toolOrder: ['tools/pdf-birlestir.html','tools/pdf-sikistir.html','tools/arkaplan-kaldir.html','tools/gorsel-sikistir.html','tools/word-pdf.html','tools/pdf-bol.html','tools/heic-jpg.html','tools/video-mp3.html','tools/pdf-word.html','tools/video-sikistir.html','tools/gorsel-pdf.html','tools/excel-pdf.html','tools/webp-jpg.html','tools/ocr.html','tools/ses-kesici.html'],
      paymentMethods: ['Carte bancaire', 'PayPal', 'Stripe', 'Apple Pay'],
    },
    es: {
      langName: 'Español', langCode: 'ES', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': 'Documentos', 'nav-gorsel': 'Imágenes',
        'nav-video': 'Video', 'nav-ses': 'Audio', 'nav-all-tools': 'Todas las herramientas',
        'btn-support': 'Apoyar', 'btn-about': 'Sobre nosotros', 'btn-login': 'Iniciar sesión',
        'hero-title': 'Tu archivo está listo.', 'hero-title-accent': 'Cambiemos el formato.',
        'hero-sub': 'Convierte PDF, documentos, imágenes, videos y archivos de audio de forma rápida y segura.',
        'search-placeholder': '¿Qué quieres hacer?', 'popular-label': 'Herramientas populares',
        'footer-tagline': 'Convierte tus archivos de forma rápida y segura.',
        'footer-trust': 'Los archivos se eliminan automáticamente tras el procesamiento.',
        'footer-copy': '© 2026 FormatJet. Todos los derechos reservados.',
        'more-langs': 'Más idiomas →',
      },
      tools: {
        pdfMerge: 'Combinar PDF', pdfCompress: 'Comprimir PDF', wordToPdf: 'Word a PDF',
        imgCompress: 'Comprimir imagen', videoCompress: 'Comprimir video', removeBg: 'Eliminar fondo',
        pdfSplit: 'Dividir PDF', heicToJpg: 'HEIC a JPG', videoToMp3: 'Video a MP3',
        pdfToWord: 'PDF a Word', ocr: 'Extraer texto OCR', imgToPdf: 'JPG a PDF',
        audioCut: 'Cortar audio', excelToPdf: 'Excel a PDF', webpToJpg: 'WebP a JPG',
      },
      toolOrder: ['tools/pdf-birlestir.html','tools/gorsel-sikistir.html','tools/pdf-sikistir.html','tools/arkaplan-kaldir.html','tools/video-sikistir.html','tools/word-pdf.html','tools/heic-jpg.html','tools/video-mp3.html','tools/pdf-bol.html','tools/gorsel-pdf.html','tools/pdf-word.html','tools/webp-jpg.html','tools/excel-pdf.html','tools/ses-kesici.html','tools/ocr.html'],
      paymentMethods: ['Tarjeta de crédito', 'PayPal', 'Bizum', 'Apple Pay'],
    },
    pt: {
      langName: 'Português', langCode: 'PT', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': 'Documentos', 'nav-gorsel': 'Imagens',
        'nav-video': 'Vídeo', 'nav-ses': 'Áudio', 'nav-all-tools': 'Todas as ferramentas',
        'btn-support': 'Apoiar', 'btn-about': 'Sobre nós', 'btn-login': 'Entrar',
        'hero-title': 'Seu arquivo está pronto.', 'hero-title-accent': 'Vamos mudar o formato.',
        'hero-sub': 'Converta PDF, documentos, imagens, vídeos e arquivos de áudio de forma rápida e segura.',
        'search-placeholder': 'O que você quer fazer?', 'popular-label': 'Ferramentas populares',
        'footer-tagline': 'Converta seus arquivos de forma rápida e segura.',
        'footer-trust': 'Os arquivos são excluídos automaticamente após o processamento.',
        'footer-copy': '© 2026 FormatJet. Todos os direitos reservados.',
        'more-langs': 'Mais idiomas →',
      },
      tools: {
        pdfMerge: 'Unir PDF', pdfCompress: 'Comprimir PDF', wordToPdf: 'Word para PDF',
        imgCompress: 'Comprimir imagem', videoCompress: 'Comprimir vídeo', removeBg: 'Remover fundo',
        pdfSplit: 'Dividir PDF', heicToJpg: 'HEIC para JPG', videoToMp3: 'Vídeo para MP3',
        pdfToWord: 'PDF para Word', ocr: 'Extrair texto OCR', imgToPdf: 'JPG para PDF',
        audioCut: 'Cortar áudio', excelToPdf: 'Excel para PDF', webpToJpg: 'WebP para JPG',
      },
      toolOrder: ['tools/pdf-birlestir.html','tools/pdf-sikistir.html','tools/gorsel-sikistir.html','tools/arkaplan-kaldir.html','tools/word-pdf.html','tools/heic-jpg.html','tools/video-mp3.html','tools/pdf-bol.html','tools/video-sikistir.html','tools/gorsel-pdf.html','tools/pdf-word.html','tools/webp-jpg.html','tools/excel-pdf.html','tools/ocr.html','tools/ses-kesici.html'],
      paymentMethods: ['Cartão de crédito', 'PayPal', 'MB Way', 'PIX'],
    },
    it: {
      langName: 'Italiano', langCode: 'IT', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': 'Documenti', 'nav-gorsel': 'Immagini',
        'nav-video': 'Video', 'nav-ses': 'Audio', 'nav-all-tools': 'Tutti gli strumenti',
        'btn-support': 'Supporta', 'btn-about': 'Chi siamo', 'btn-login': 'Accedi',
        'hero-title': 'Il tuo file è pronto.', 'hero-title-accent': 'Cambiamo il formato.',
        'hero-sub': 'Converti PDF, documenti, immagini, video e file audio in modo rapido e sicuro.',
        'search-placeholder': 'Cosa vuoi fare?', 'popular-label': 'Strumenti popolari',
        'footer-tagline': 'Converti i tuoi file in modo rapido e sicuro.',
        'footer-trust': 'I file vengono eliminati automaticamente dopo l\'elaborazione.',
        'footer-copy': '© 2026 FormatJet. Tutti i diritti riservati.',
        'more-langs': 'Altre lingue →',
      },
      tools: {
        pdfMerge: 'Unisci PDF', pdfCompress: 'Comprimi PDF', wordToPdf: 'Word in PDF',
        imgCompress: 'Comprimi immagine', videoCompress: 'Comprimi video', removeBg: 'Rimuovi sfondo',
        pdfSplit: 'Dividi PDF', heicToJpg: 'HEIC in JPG', videoToMp3: 'Video in MP3',
        pdfToWord: 'PDF in Word', ocr: 'Estrai testo OCR', imgToPdf: 'JPG in PDF',
        audioCut: 'Taglia audio', excelToPdf: 'Excel in PDF', webpToJpg: 'WebP in JPG',
      },
      toolOrder: ['tools/pdf-birlestir.html','tools/pdf-sikistir.html','tools/word-pdf.html','tools/excel-pdf.html','tools/gorsel-sikistir.html','tools/arkaplan-kaldir.html','tools/pdf-bol.html','tools/heic-jpg.html','tools/pdf-word.html','tools/video-mp3.html','tools/gorsel-pdf.html','tools/video-sikistir.html','tools/webp-jpg.html','tools/ocr.html','tools/ses-kesici.html'],
      paymentMethods: ['Carta di credito', 'PayPal', 'Satispay', 'Apple Pay'],
    },
    ru: {
      langName: 'Русский', langCode: 'RU', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': 'Документы', 'nav-gorsel': 'Изображения',
        'nav-video': 'Видео', 'nav-ses': 'Аудио', 'nav-all-tools': 'Все инструменты',
        'btn-support': 'Поддержать', 'btn-about': 'О нас', 'btn-login': 'Войти',
        'hero-title': 'Ваш файл готов.', 'hero-title-accent': 'Изменим формат.',
        'hero-sub': 'Конвертируйте PDF, документы, изображения, видео и аудио быстро и безопасно.',
        'search-placeholder': 'Что вы хотите сделать?', 'popular-label': 'Популярные инструменты',
        'footer-tagline': 'Конвертируйте файлы быстро и безопасно.',
        'footer-trust': 'Файлы автоматически удаляются после обработки.',
        'footer-copy': '© 2026 FormatJet. Все права защищены.',
        'more-langs': 'Другие языки →',
      },
      tools: {
        pdfMerge: 'Объединить PDF', pdfCompress: 'Сжать PDF', wordToPdf: 'Word в PDF',
        imgCompress: 'Сжать изображение', videoCompress: 'Сжать видео', removeBg: 'Удалить фон',
        pdfSplit: 'Разделить PDF', heicToJpg: 'HEIC в JPG', videoToMp3: 'Видео в MP3',
        pdfToWord: 'PDF в Word', ocr: 'Извлечь текст OCR', imgToPdf: 'JPG в PDF',
        audioCut: 'Обрезать аудио', excelToPdf: 'Excel в PDF', webpToJpg: 'WebP в JPG',
      },
      toolOrder: ['tools/gorsel-sikistir.html','tools/arkaplan-kaldir.html','tools/pdf-birlestir.html','tools/pdf-sikistir.html','tools/heic-jpg.html','tools/video-mp3.html','tools/word-pdf.html','tools/video-sikistir.html','tools/gorsel-pdf.html','tools/pdf-bol.html','tools/webp-jpg.html','tools/pdf-word.html','tools/excel-pdf.html','tools/ses-kesici.html','tools/ocr.html'],
      paymentMethods: ['Банковская карта', 'ЮMoney', 'QIWI', 'PayPal'],
    },
    ja: {
      langName: '日本語', langCode: 'JA', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': 'ドキュメント', 'nav-gorsel': '画像',
        'nav-video': '動画', 'nav-ses': '音声', 'nav-all-tools': '全ツール',
        'btn-support': 'サポート', 'btn-about': '概要', 'btn-login': 'ログイン',
        'hero-title': 'ファイルは準備完了。', 'hero-title-accent': 'フォーマットを変換しよう。',
        'hero-sub': 'PDF、文書、画像、動画、音声ファイルを素早く安全に変換。',
        'search-placeholder': '何をしたいですか？', 'popular-label': '人気のツール',
        'footer-tagline': 'ファイルを素早く安全に変換。',
        'footer-trust': 'ファイルは処理後に自動的に削除されます。',
        'footer-copy': '© 2026 FormatJet. All rights reserved.',
        'more-langs': '他の言語 →',
      },
      tools: {
        pdfMerge: 'PDF結合', pdfCompress: 'PDF圧縮', wordToPdf: 'WordをPDFに',
        imgCompress: '画像圧縮', videoCompress: '動画圧縮', removeBg: '背景除去',
        pdfSplit: 'PDF分割', heicToJpg: 'HEICをJPGに', videoToMp3: '動画をMP3に',
        pdfToWord: 'PDFをWordに', ocr: 'OCRテキスト抽出', imgToPdf: 'JPGをPDFに',
        audioCut: '音声カット', excelToPdf: 'ExcelをPDFに', webpToJpg: 'WebPをJPGに',
      },
      toolOrder: ['tools/heic-jpg.html','tools/gorsel-sikistir.html','tools/arkaplan-kaldir.html','tools/webp-jpg.html','tools/pdf-birlestir.html','tools/video-mp3.html','tools/pdf-sikistir.html','tools/gorsel-pdf.html','tools/video-sikistir.html','tools/pdf-bol.html','tools/word-pdf.html','tools/pdf-word.html','tools/ses-kesici.html','tools/excel-pdf.html','tools/ocr.html'],
      paymentMethods: ['クレジットカード', 'PayPay', 'Apple Pay', 'コンビニ払い'],
    },
    ko: {
      langName: '한국어', langCode: 'KO', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': '문서', 'nav-gorsel': '이미지',
        'nav-video': '동영상', 'nav-ses': '오디오', 'nav-all-tools': '모든 도구',
        'btn-support': '지원하기', 'btn-about': '소개', 'btn-login': '로그인',
        'hero-title': '파일이 준비됐어요.', 'hero-title-accent': '형식을 바꿔볼까요?',
        'hero-sub': 'PDF, 문서, 이미지, 동영상, 오디오 파일을 빠르고 안전하게 변환하세요.',
        'search-placeholder': '무엇을 하고 싶으신가요?', 'popular-label': '인기 도구',
        'footer-tagline': '파일을 빠르고 안전하게 변환하세요.',
        'footer-trust': '파일은 처리 후 자동으로 삭제됩니다.',
        'footer-copy': '© 2026 FormatJet. All rights reserved.',
        'more-langs': '다른 언어 →',
      },
      tools: {
        pdfMerge: 'PDF 합치기', pdfCompress: 'PDF 압축', wordToPdf: 'Word를 PDF로',
        imgCompress: '이미지 압축', videoCompress: '동영상 압축', removeBg: '배경 제거',
        pdfSplit: 'PDF 분할', heicToJpg: 'HEIC를 JPG로', videoToMp3: '동영상을 MP3로',
        pdfToWord: 'PDF를 Word로', ocr: 'OCR 텍스트 추출', imgToPdf: 'JPG를 PDF로',
        audioCut: '오디오 자르기', excelToPdf: 'Excel을 PDF로', webpToJpg: 'WebP를 JPG로',
      },
      toolOrder: ['tools/gorsel-sikistir.html','tools/arkaplan-kaldir.html','tools/heic-jpg.html','tools/video-mp3.html','tools/pdf-birlestir.html','tools/webp-jpg.html','tools/video-sikistir.html','tools/gorsel-pdf.html','tools/pdf-sikistir.html','tools/word-pdf.html','tools/pdf-bol.html','tools/ses-kesici.html','tools/pdf-word.html','tools/excel-pdf.html','tools/ocr.html'],
      paymentMethods: ['신용카드', 'KakaoPay', 'NaverPay', 'PayPal'],
    },
    zh: {
      langName: '中文', langCode: 'ZH', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': '文档', 'nav-gorsel': '图片',
        'nav-video': '视频', 'nav-ses': '音频', 'nav-all-tools': '所有工具',
        'btn-support': '支持我们', 'btn-about': '关于我们', 'btn-login': '登录',
        'hero-title': '文件已准备好。', 'hero-title-accent': '让我们转换格式。',
        'hero-sub': '快速、安全、轻松转换PDF、文档、图片、视频和音频文件。',
        'search-placeholder': '您想做什么？', 'popular-label': '热门工具',
        'footer-tagline': '快速安全地转换您的文件。',
        'footer-trust': '文件处理后自动删除。',
        'footer-copy': '© 2026 FormatJet. 保留所有权利。',
        'more-langs': '更多语言 →',
      },
      tools: {
        pdfMerge: '合并PDF', pdfCompress: '压缩PDF', wordToPdf: 'Word转PDF',
        imgCompress: '图片压缩', videoCompress: '视频压缩', removeBg: '去除背景',
        pdfSplit: '拆分PDF', heicToJpg: 'HEIC转JPG', videoToMp3: '视频转MP3',
        pdfToWord: 'PDF转Word', ocr: 'OCR文字提取', imgToPdf: 'JPG转PDF',
        audioCut: '音频剪切', excelToPdf: 'Excel转PDF', webpToJpg: 'WebP转JPG',
      },
      toolOrder: ['tools/gorsel-sikistir.html','tools/arkaplan-kaldir.html','tools/heic-jpg.html','tools/webp-jpg.html','tools/gorsel-pdf.html','tools/pdf-birlestir.html','tools/video-mp3.html','tools/pdf-sikistir.html','tools/video-sikistir.html','tools/word-pdf.html','tools/pdf-bol.html','tools/ses-kesici.html','tools/pdf-word.html','tools/excel-pdf.html','tools/ocr.html'],
      paymentMethods: ['支付宝', '微信支付', '信用卡', 'PayPal'],
    },
    ar: {
      langName: 'العربية', langCode: 'AR', dir: 'rtl',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': 'مستندات', 'nav-gorsel': 'صور',
        'nav-video': 'فيديو', 'nav-ses': 'صوت', 'nav-all-tools': 'جميع الأدوات',
        'btn-support': 'دعمنا', 'btn-about': 'من نحن', 'btn-login': 'تسجيل الدخول',
        'hero-title': 'ملفك جاهز.', 'hero-title-accent': 'دعنا نغيّر التنسيق.',
        'hero-sub': 'حوّل ملفات PDF والمستندات والصور ومقاطع الفيديو والصوت بسرعة وأمان.',
        'search-placeholder': 'ماذا تريد أن تفعل؟', 'popular-label': 'الأدوات الشائعة',
        'footer-tagline': 'حوّل ملفاتك بسرعة وأمان.',
        'footer-trust': 'يتم حذف الملفات تلقائياً بعد المعالجة.',
        'footer-copy': '© 2026 FormatJet. جميع الحقوق محفوظة.',
        'more-langs': '← مزيد من اللغات',
      },
      tools: {
        pdfMerge: 'دمج PDF', pdfCompress: 'ضغط PDF', wordToPdf: 'Word إلى PDF',
        imgCompress: 'ضغط الصور', videoCompress: 'ضغط الفيديو', removeBg: 'إزالة الخلفية',
        pdfSplit: 'تقسيم PDF', heicToJpg: 'HEIC إلى JPG', videoToMp3: 'فيديو إلى MP3',
        pdfToWord: 'PDF إلى Word', ocr: 'استخراج النص OCR', imgToPdf: 'JPG إلى PDF',
        audioCut: 'قطع الصوت', excelToPdf: 'Excel إلى PDF', webpToJpg: 'WebP إلى JPG',
      },
      toolOrder: ['tools/pdf-birlestir.html','tools/pdf-sikistir.html','tools/gorsel-sikistir.html','tools/arkaplan-kaldir.html','tools/word-pdf.html','tools/pdf-bol.html','tools/heic-jpg.html','tools/video-mp3.html','tools/gorsel-pdf.html','tools/video-sikistir.html','tools/pdf-word.html','tools/webp-jpg.html','tools/ses-kesici.html','tools/excel-pdf.html','tools/ocr.html'],
      paymentMethods: ['بطاقة ائتمان', 'PayPal', 'Apple Pay', 'مدى'],
    },
    pl: {
      langName: 'Polski', langCode: 'PL', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': 'Dokumenty', 'nav-gorsel': 'Obrazy',
        'nav-video': 'Wideo', 'nav-ses': 'Audio', 'nav-all-tools': 'Wszystkie narzędzia',
        'btn-support': 'Wesprzyj', 'btn-about': 'O nas', 'btn-login': 'Zaloguj się',
        'hero-title': 'Twój plik jest gotowy.', 'hero-title-accent': 'Zmieńmy format.',
        'hero-sub': 'Konwertuj PDF, dokumenty, obrazy, filmy i pliki audio szybko i bezpiecznie.',
        'search-placeholder': 'Co chcesz zrobić?', 'popular-label': 'Popularne narzędzia',
        'footer-tagline': 'Konwertuj pliki szybko i bezpiecznie.',
        'footer-trust': 'Pliki są automatycznie usuwane po przetworzeniu.',
        'footer-copy': '© 2026 FormatJet. Wszelkie prawa zastrzeżone.',
        'more-langs': 'Więcej języków →',
      },
      tools: {
        pdfMerge: 'Scal PDF', pdfCompress: 'Kompresuj PDF', wordToPdf: 'Word do PDF',
        imgCompress: 'Kompresuj obraz', videoCompress: 'Kompresuj wideo', removeBg: 'Usuń tło',
        pdfSplit: 'Podziel PDF', heicToJpg: 'HEIC do JPG', videoToMp3: 'Wideo do MP3',
        pdfToWord: 'PDF do Word', ocr: 'Wyodrębnij tekst OCR', imgToPdf: 'JPG do PDF',
        audioCut: 'Przytnij dźwięk', excelToPdf: 'Excel do PDF', webpToJpg: 'WebP do JPG',
      },
      toolOrder: ['tools/pdf-birlestir.html','tools/pdf-sikistir.html','tools/word-pdf.html','tools/pdf-bol.html','tools/excel-pdf.html','tools/gorsel-sikistir.html','tools/arkaplan-kaldir.html','tools/pdf-word.html','tools/heic-jpg.html','tools/video-mp3.html','tools/video-sikistir.html','tools/gorsel-pdf.html','tools/webp-jpg.html','tools/ocr.html','tools/ses-kesici.html'],
      paymentMethods: ['Karta kredytowa', 'BLIK', 'PayPal', 'Przelewy24'],
    },
    nl: {
      langName: 'Nederlands', langCode: 'NL', dir: 'ltr',
      ui: {
        'nav-pdf': 'PDF', 'nav-belge': 'Documenten', 'nav-gorsel': 'Afbeeldingen',
        'nav-video': 'Video', 'nav-ses': 'Audio', 'nav-all-tools': 'Alle tools',
        'btn-support': 'Steun ons', 'btn-about': 'Over ons', 'btn-login': 'Inloggen',
        'hero-title': 'Uw bestand is klaar.', 'hero-title-accent': 'Laten we het formaat wijzigen.',
        'hero-sub': 'Converteer PDF, documenten, afbeeldingen, video\'s en audiobestanden snel en veilig.',
        'search-placeholder': 'Wat wil je doen?', 'popular-label': 'Populaire tools',
        'footer-tagline': 'Converteer uw bestanden snel en veilig.',
        'footer-trust': 'Bestanden worden automatisch verwijderd na verwerking.',
        'footer-copy': '© 2026 FormatJet. Alle rechten voorbehouden.',
        'more-langs': 'Meer talen →',
      },
      tools: {
        pdfMerge: 'PDF samenvoegen', pdfCompress: 'PDF comprimeren', wordToPdf: 'Word naar PDF',
        imgCompress: 'Afbeelding comprimeren', videoCompress: 'Video comprimeren', removeBg: 'Achtergrond verwijderen',
        pdfSplit: 'PDF splitsen', heicToJpg: 'HEIC naar JPG', videoToMp3: 'Video naar MP3',
        pdfToWord: 'PDF naar Word', ocr: 'OCR tekst extraheren', imgToPdf: 'JPG naar PDF',
        audioCut: 'Audio knippen', excelToPdf: 'Excel naar PDF', webpToJpg: 'WebP naar JPG',
      },
      toolOrder: ['tools/pdf-birlestir.html','tools/pdf-sikistir.html','tools/gorsel-sikistir.html','tools/word-pdf.html','tools/arkaplan-kaldir.html','tools/heic-jpg.html','tools/pdf-bol.html','tools/video-mp3.html','tools/pdf-word.html','tools/video-sikistir.html','tools/gorsel-pdf.html','tools/webp-jpg.html','tools/excel-pdf.html','tools/ses-kesici.html','tools/ocr.html'],
      paymentMethods: ['Creditcard', 'PayPal', 'iDEAL', 'Apple Pay'],
    },
  };

  const SUPPORTED = Object.keys(LANGS);

  function getLang() {
    const saved = localStorage.getItem('fj-lang');
    if (saved && SUPPORTED.includes(saved)) return saved;
    const browser = navigator.language.slice(0, 2).toLowerCase();
    return SUPPORTED.includes(browser) ? browser : 'tr';
  }

  function applyLanguage(lang) {
    const data = LANGS[lang] || LANGS.tr;
    document.documentElement.lang = lang;
    document.documentElement.dir = data.dir || 'ltr';
    localStorage.setItem('fj-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = data.ui[el.dataset.i18n];
      if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const val = data.ui[el.dataset.i18nPlaceholder];
      if (val !== undefined) el.placeholder = val;
    });

    document.querySelectorAll('[data-i18n-tool]').forEach(el => {
      const val = data.tools[el.dataset.i18nTool];
      if (val !== undefined) el.textContent = val;
    });

    reorderPopularGrid(data.toolOrder);

    document.querySelectorAll('.btn-lang-text').forEach(el => el.textContent = data.langCode);
    document.querySelectorAll('.btn-lang-footer-text').forEach(el => el.textContent = data.langName);

    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  function reorderPopularGrid(toolOrder) {
    const grid = document.querySelector('.popular-grid');
    if (!grid || !toolOrder) return;
    toolOrder.forEach(href => {
      const card = grid.querySelector('a[href="' + href + '"]');
      if (card) grid.appendChild(card);
    });
  }

  function initPanel() {
    const btnLang = document.getElementById('btnLang');
    const btnLangFooter = document.querySelector('.btn-lang-footer');
    const panel = document.getElementById('langPanel');
    const moreBtn = document.getElementById('langMoreBtn');
    const secondary = document.getElementById('langSecondary');

    if (!panel) return;

    function openPanel() { panel.removeAttribute('hidden'); }
    function closePanel() { panel.setAttribute('hidden', ''); }
    function togglePanel() {
      panel.hasAttribute('hidden') ? openPanel() : closePanel();
    }

    if (btnLang) btnLang.addEventListener('click', e => { e.stopPropagation(); togglePanel(); });
    if (btnLangFooter) btnLangFooter.addEventListener('click', e => { e.stopPropagation(); togglePanel(); });

    document.addEventListener('click', closePanel);
    panel.addEventListener('click', e => e.stopPropagation());

    if (moreBtn && secondary) {
      moreBtn.addEventListener('click', () => {
        secondary.removeAttribute('hidden');
        moreBtn.setAttribute('hidden', '');
      });
    }

    panel.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', () => {
        applyLanguage(btn.dataset.lang);
        closePanel();
      });
    });
  }

  function init() {
    initPanel();
    applyLanguage(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { applyLanguage, getLang, LANGS, TOOL_DATA };

})();
