'use strict';

/* ══════════════════════════════════════════════════════════
   FormatJet i18n v2 — 5 dil: TR · EN · ES · DE · FR
   layout.js'in ürettiği [data-i18n] öğelerini çevirir.
══════════════════════════════════════════════════════════ */

(function () {
  const T = {
    tr: {
      'nav-pdf': 'PDF', 'nav-belge': 'Belge', 'nav-gorsel': 'Görsel', 'nav-video': 'Video', 'nav-ses': 'Ses',
      'nav-all-tools': 'Tüm Araçlar',
      'btn-support': 'Destek Ol', 'btn-about': 'Bizi Tanı', 'btn-login': 'Giriş Yap',
      'more-langs': 'Diğer diller — yakında',
      'hero-title': 'Dosyan hazır.', 'hero-title-accent': 'Formatını değiştirelim.',
      'hero-sub': 'PDF, belge, görsel, video ve ses dosyalarını hızlı, güvenli ve kolayca dönüştür.',
      'search-placeholder': 'Ne yapmak istiyorsun?',
      'popular-label': 'Popüler Araçlar',
      'feature-fast': 'Hızlı Dönüşüm', 'feature-fast-desc': 'Dosyalarını en hızlı şekilde dönüştürürüz.',
      'feature-safe': 'Güvenli ve Gizli', 'feature-safe-desc': 'Dosyaların güvende. Kimse erişemez, sadece sen görürsün.',
      'feature-cloud': 'Bulut Tabanlı', 'feature-cloud-desc': 'Yükleme yap, dönüştür ve hemen indir.',
      'feature-device': 'Tüm Cihazlarda', 'feature-device-desc': 'İstediğin cihazdan, istediğin zaman kullan.',
      'cta-request-title': 'İhtiyacın olan araç burada yok mu?',
      'cta-request-sub': 'Önerini gönder, geliştirme listemize ekleyelim.',
      'btn-request-tool': 'Yeni Araç Talep Et',
      'cta-support-title': 'Ücretsiz araçları birlikte büyütelim',
      'cta-support-sub': 'Desteğin, ücretsiz limitleri herkes için yükseltir.',
      'footer-tagline': 'Dosyalarını hızlı, güvenli ve kolayca dönüştür.',
      'footer-trust': 'Dosyalar işlemden sonra otomatik silinir.',
      'footer-tools': 'Araçlar', 'footer-about': 'Hakkımızda', 'footer-contact': 'İletişim',
      'footer-legal': 'Yasal', 'footer-privacy': 'Gizlilik Politikası', 'footer-terms': 'Kullanım Koşulları',
      'footer-cookies': 'Çerez Politikası', 'footer-rights': 'Tüm hakları saklıdır.', 'footer-theme': 'Görünüm',
      'search-empty': 'Araç bulunamadı.',
      'cat-search-placeholder': 'Araç ara...',
      _tools: {
        pdfMerge: 'PDF Birleştir', pdfCompress: 'PDF Sıkıştır', wordToPdf: "Word'den PDF",
        imgCompress: 'Görsel Sıkıştır', videoCompress: 'Video Sıkıştır', removeBg: 'Arka Plan Kaldır',
        pdfSplit: 'PDF Böl', heicToJpg: "HEIC'den JPG", videoToMp3: "Video'dan MP3",
        pdfToWord: "PDF'den Word", ocr: 'OCR ile Metin Çıkar', imgToPdf: "JPG'den PDF",
        audioCut: 'Ses Kesici', excelToPdf: "Excel'den PDF", webpToJpg: "WebP'den JPG",
      },
    },
    en: {
      'nav-pdf': 'PDF', 'nav-belge': 'Document', 'nav-gorsel': 'Image', 'nav-video': 'Video', 'nav-ses': 'Audio',
      'nav-all-tools': 'All Tools',
      'btn-support': 'Support Us', 'btn-about': 'About Us', 'btn-login': 'Sign In',
      'more-langs': 'More languages — coming soon',
      'hero-title': 'Your file is ready.', 'hero-title-accent': "Let's change its format.",
      'hero-sub': 'Convert PDF, document, image, video and audio files quickly, securely and easily.',
      'search-placeholder': 'What do you want to do?',
      'popular-label': 'Popular Tools',
      'feature-fast': 'Fast Conversion', 'feature-fast-desc': 'We convert your files as fast as possible.',
      'feature-safe': 'Secure & Private', 'feature-safe-desc': 'Your files are safe. No one can access them but you.',
      'feature-cloud': 'Cloud Based', 'feature-cloud-desc': 'Upload, convert and download instantly.',
      'feature-device': 'On Every Device', 'feature-device-desc': 'Use it anytime, from any device.',
      'cta-request-title': "Can't find the tool you need?",
      'cta-request-sub': 'Send your suggestion and we will add it to our roadmap.',
      'btn-request-tool': 'Request New Tool',
      'cta-support-title': "Let's grow free tools together",
      'cta-support-sub': 'Your support raises free limits for everyone.',
      'footer-tagline': 'Convert your files quickly, securely and easily.',
      'footer-trust': 'Files are deleted automatically after processing.',
      'footer-tools': 'Tools', 'footer-about': 'About Us', 'footer-contact': 'Contact',
      'footer-legal': 'Legal', 'footer-privacy': 'Privacy Policy', 'footer-terms': 'Terms of Service',
      'footer-cookies': 'Cookie Policy', 'footer-rights': 'All rights reserved.', 'footer-theme': 'Theme',
      'search-empty': 'No tools found.',
      'cat-search-placeholder': 'Search tools...',
      _tools: {
        pdfMerge: 'Merge PDF', pdfCompress: 'Compress PDF', wordToPdf: 'Word to PDF',
        imgCompress: 'Compress Image', videoCompress: 'Compress Video', removeBg: 'Remove Background',
        pdfSplit: 'Split PDF', heicToJpg: 'HEIC to JPG', videoToMp3: 'Video to MP3',
        pdfToWord: 'PDF to Word', ocr: 'OCR Text Extract', imgToPdf: 'JPG to PDF',
        audioCut: 'Audio Cutter', excelToPdf: 'Excel to PDF', webpToJpg: 'WebP to JPG',
      },
    },
    es: {
      'nav-pdf': 'PDF', 'nav-belge': 'Documento', 'nav-gorsel': 'Imagen', 'nav-video': 'Vídeo', 'nav-ses': 'Audio',
      'nav-all-tools': 'Herramientas',
      'btn-support': 'Apóyanos', 'btn-about': 'Nosotros', 'btn-login': 'Iniciar Sesión',
      'more-langs': 'Más idiomas — próximamente',
      'hero-title': 'Tu archivo está listo.', 'hero-title-accent': 'Cambiemos su formato.',
      'hero-sub': 'Convierte archivos PDF, documentos, imágenes, vídeo y audio de forma rápida y segura.',
      'search-placeholder': '¿Qué quieres hacer?',
      'popular-label': 'Herramientas Populares',
      'feature-fast': 'Conversión Rápida', 'feature-fast-desc': 'Convertimos tus archivos lo más rápido posible.',
      'feature-safe': 'Seguro y Privado', 'feature-safe-desc': 'Tus archivos están seguros. Solo tú puedes verlos.',
      'feature-cloud': 'En la Nube', 'feature-cloud-desc': 'Sube, convierte y descarga al instante.',
      'feature-device': 'En Todos los Dispositivos', 'feature-device-desc': 'Úsalo cuando quieras, desde cualquier dispositivo.',
      'cta-request-title': '¿No encuentras la herramienta que necesitas?',
      'cta-request-sub': 'Envía tu sugerencia y la añadiremos a nuestra lista.',
      'btn-request-tool': 'Solicitar Herramienta',
      'cta-support-title': 'Hagamos crecer las herramientas gratuitas',
      'cta-support-sub': 'Tu apoyo aumenta los límites gratuitos para todos.',
      'footer-tagline': 'Convierte tus archivos de forma rápida y segura.',
      'footer-trust': 'Los archivos se eliminan automáticamente tras el procesamiento.',
      'footer-tools': 'Herramientas', 'footer-about': 'Nosotros', 'footer-contact': 'Contacto',
      'footer-legal': 'Legal', 'footer-privacy': 'Política de Privacidad', 'footer-terms': 'Términos de Uso',
      'footer-cookies': 'Política de Cookies', 'footer-rights': 'Todos los derechos reservados.', 'footer-theme': 'Tema',
      'search-empty': 'No se encontraron herramientas.',
      'cat-search-placeholder': 'Buscar herramientas...',
      _tools: {
        pdfMerge: 'Unir PDF', pdfCompress: 'Comprimir PDF', wordToPdf: 'Word a PDF',
        imgCompress: 'Comprimir Imagen', videoCompress: 'Comprimir Vídeo', removeBg: 'Quitar Fondo',
        pdfSplit: 'Dividir PDF', heicToJpg: 'HEIC a JPG', videoToMp3: 'Vídeo a MP3',
        pdfToWord: 'PDF a Word', ocr: 'OCR Extraer Texto', imgToPdf: 'JPG a PDF',
        audioCut: 'Cortar Audio', excelToPdf: 'Excel a PDF', webpToJpg: 'WebP a JPG',
      },
    },
    de: {
      'nav-pdf': 'PDF', 'nav-belge': 'Dokument', 'nav-gorsel': 'Bild', 'nav-video': 'Video', 'nav-ses': 'Audio',
      'nav-all-tools': 'Alle Tools',
      'btn-support': 'Unterstützen', 'btn-about': 'Über Uns', 'btn-login': 'Anmelden',
      'more-langs': 'Weitere Sprachen — bald verfügbar',
      'hero-title': 'Deine Datei ist bereit.', 'hero-title-accent': 'Ändern wir ihr Format.',
      'hero-sub': 'Konvertiere PDF-, Dokument-, Bild-, Video- und Audiodateien schnell und sicher.',
      'search-placeholder': 'Was möchtest du tun?',
      'popular-label': 'Beliebte Tools',
      'feature-fast': 'Schnelle Konvertierung', 'feature-fast-desc': 'Wir konvertieren deine Dateien so schnell wie möglich.',
      'feature-safe': 'Sicher & Privat', 'feature-safe-desc': 'Deine Dateien sind sicher. Nur du kannst sie sehen.',
      'feature-cloud': 'Cloud-Basiert', 'feature-cloud-desc': 'Hochladen, konvertieren und sofort herunterladen.',
      'feature-device': 'Auf Allen Geräten', 'feature-device-desc': 'Nutze es jederzeit, von jedem Gerät.',
      'cta-request-title': 'Fehlt dir ein Tool?',
      'cta-request-sub': 'Sende deinen Vorschlag und wir nehmen ihn in unsere Liste auf.',
      'btn-request-tool': 'Neues Tool Anfragen',
      'cta-support-title': 'Lass uns kostenlose Tools gemeinsam ausbauen',
      'cta-support-sub': 'Deine Unterstützung erhöht die kostenlosen Limits für alle.',
      'footer-tagline': 'Konvertiere deine Dateien schnell und sicher.',
      'footer-trust': 'Dateien werden nach der Verarbeitung automatisch gelöscht.',
      'footer-tools': 'Tools', 'footer-about': 'Über Uns', 'footer-contact': 'Kontakt',
      'footer-legal': 'Rechtliches', 'footer-privacy': 'Datenschutz', 'footer-terms': 'Nutzungsbedingungen',
      'footer-cookies': 'Cookie-Richtlinie', 'footer-rights': 'Alle Rechte vorbehalten.', 'footer-theme': 'Design',
      'search-empty': 'Keine Tools gefunden.',
      'cat-search-placeholder': 'Tools suchen...',
      _tools: {
        pdfMerge: 'PDF Zusammenfügen', pdfCompress: 'PDF Komprimieren', wordToPdf: 'Word zu PDF',
        imgCompress: 'Bild Komprimieren', videoCompress: 'Video Komprimieren', removeBg: 'Hintergrund Entfernen',
        pdfSplit: 'PDF Teilen', heicToJpg: 'HEIC zu JPG', videoToMp3: 'Video zu MP3',
        pdfToWord: 'PDF zu Word', ocr: 'OCR Texterkennung', imgToPdf: 'JPG zu PDF',
        audioCut: 'Audio Schneiden', excelToPdf: 'Excel zu PDF', webpToJpg: 'WebP zu JPG',
      },
    },
    fr: {
      'nav-pdf': 'PDF', 'nav-belge': 'Document', 'nav-gorsel': 'Image', 'nav-video': 'Vidéo', 'nav-ses': 'Audio',
      'nav-all-tools': 'Tous les Outils',
      'btn-support': 'Soutenez-nous', 'btn-about': 'À Propos', 'btn-login': 'Connexion',
      'more-langs': 'Plus de langues — bientôt',
      'hero-title': 'Votre fichier est prêt.', 'hero-title-accent': 'Changeons son format.',
      'hero-sub': 'Convertissez vos fichiers PDF, documents, images, vidéo et audio rapidement et en toute sécurité.',
      'search-placeholder': 'Que voulez-vous faire ?',
      'popular-label': 'Outils Populaires',
      'feature-fast': 'Conversion Rapide', 'feature-fast-desc': 'Nous convertissons vos fichiers le plus vite possible.',
      'feature-safe': 'Sûr et Privé', 'feature-safe-desc': 'Vos fichiers sont en sécurité. Vous seul pouvez les voir.',
      'feature-cloud': 'Basé sur le Cloud', 'feature-cloud-desc': 'Téléversez, convertissez et téléchargez instantanément.',
      'feature-device': 'Sur Tous les Appareils', 'feature-device-desc': "Utilisez-le à tout moment, depuis n'importe quel appareil.",
      'cta-request-title': "L'outil dont vous avez besoin n'est pas là ?",
      'cta-request-sub': "Envoyez votre suggestion et nous l'ajouterons à notre liste.",
      'btn-request-tool': 'Demander un Outil',
      'cta-support-title': 'Développons ensemble les outils gratuits',
      'cta-support-sub': 'Votre soutien augmente les limites gratuites pour tous.',
      'footer-tagline': 'Convertissez vos fichiers rapidement et en toute sécurité.',
      'footer-trust': 'Les fichiers sont supprimés automatiquement après traitement.',
      'footer-tools': 'Outils', 'footer-about': 'À Propos', 'footer-contact': 'Contact',
      'footer-legal': 'Mentions Légales', 'footer-privacy': 'Politique de Confidentialité', 'footer-terms': "Conditions d'Utilisation",
      'footer-cookies': 'Politique de Cookies', 'footer-rights': 'Tous droits réservés.', 'footer-theme': 'Thème',
      'search-empty': 'Aucun outil trouvé.',
      'cat-search-placeholder': 'Rechercher des outils...',
      _tools: {
        pdfMerge: 'Fusionner PDF', pdfCompress: 'Compresser PDF', wordToPdf: 'Word en PDF',
        imgCompress: 'Compresser Image', videoCompress: 'Compresser Vidéo', removeBg: 'Supprimer le Fond',
        pdfSplit: 'Diviser PDF', heicToJpg: 'HEIC en JPG', videoToMp3: 'Vidéo en MP3',
        pdfToWord: 'PDF en Word', ocr: 'OCR Extraire Texte', imgToPdf: 'JPG en PDF',
        audioCut: 'Couper Audio', excelToPdf: 'Excel en PDF', webpToJpg: 'WebP en JPG',
      },
    },
  };

  /* ── Sayfa içi ek anahtarlar (kategori + araç sayfası UI) ── */
  const EXTRA = {
    tr: {
      'cat-pdf-title': 'PDF Araçları', 'cat-belge-title': 'Belge Araçları', 'cat-gorsel-title': 'Görsel Araçları',
      'cat-video-title': 'Video Araçları', 'cat-ses-title': 'Ses Araçları', 'tools-title': 'Tüm Araçlar',
      'tools-sub': '70+ ücretsiz dosya aracı. Kayıt gerekmez.',
      'tool-drop-title': 'Dosyaları buraya sürükle veya tıkla',
      'tool-btn-process': 'Dönüştür', 'tool-btn-reset': 'Yeni Dosya',
      'tool-how': 'Nasıl çalışır?',
      'tool-s1': 'Dosyanı Seç', 'tool-s1d': 'Sürükle-bırak veya tıklayarak dosyanı yükle.',
      'tool-s2': 'Tarayıcıda İşlenir', 'tool-s2d': 'Dosyan sunucuya gitmez; işlem cihazında, tarayıcı içinde yapılır.',
      'tool-s3': 'Anında İndir', 'tool-s3d': 'Sonuç dosyan hazır olur olmaz otomatik indirilir.',
      'tool-pro': "Pro'ya geç →",
    },
    en: {
      'cat-pdf-title': 'PDF Tools', 'cat-belge-title': 'Document Tools', 'cat-gorsel-title': 'Image Tools',
      'cat-video-title': 'Video Tools', 'cat-ses-title': 'Audio Tools', 'tools-title': 'All Tools',
      'tools-sub': '70+ free file tools. No sign-up required.',
      'tool-drop-title': 'Drag files here or click',
      'tool-btn-process': 'Convert', 'tool-btn-reset': 'New File',
      'tool-how': 'How it works',
      'tool-s1': 'Pick Your File', 'tool-s1d': 'Drag & drop or click to upload your file.',
      'tool-s2': 'Processed in Browser', 'tool-s2d': 'Your file never leaves your device; everything runs in the browser.',
      'tool-s3': 'Instant Download', 'tool-s3d': 'The result downloads automatically as soon as it is ready.',
      'tool-pro': 'Go Pro →',
    },
    es: {
      'cat-pdf-title': 'Herramientas PDF', 'cat-belge-title': 'Herramientas de Documentos', 'cat-gorsel-title': 'Herramientas de Imagen',
      'cat-video-title': 'Herramientas de Vídeo', 'cat-ses-title': 'Herramientas de Audio', 'tools-title': 'Todas las Herramientas',
      'tools-sub': 'Más de 70 herramientas gratuitas. Sin registro.',
      'tool-drop-title': 'Arrastra archivos aquí o haz clic',
      'tool-btn-process': 'Convertir', 'tool-btn-reset': 'Nuevo Archivo',
      'tool-how': '¿Cómo funciona?',
      'tool-s1': 'Elige tu Archivo', 'tool-s1d': 'Arrastra y suelta o haz clic para subir tu archivo.',
      'tool-s2': 'Procesado en el Navegador', 'tool-s2d': 'Tu archivo no sale de tu dispositivo; todo ocurre en el navegador.',
      'tool-s3': 'Descarga Instantánea', 'tool-s3d': 'El resultado se descarga automáticamente en cuanto está listo.',
      'tool-pro': 'Hazte Pro →',
    },
    de: {
      'cat-pdf-title': 'PDF-Tools', 'cat-belge-title': 'Dokument-Tools', 'cat-gorsel-title': 'Bild-Tools',
      'cat-video-title': 'Video-Tools', 'cat-ses-title': 'Audio-Tools', 'tools-title': 'Alle Tools',
      'tools-sub': 'Über 70 kostenlose Datei-Tools. Keine Anmeldung nötig.',
      'tool-drop-title': 'Dateien hierher ziehen oder klicken',
      'tool-btn-process': 'Konvertieren', 'tool-btn-reset': 'Neue Datei',
      'tool-how': 'So funktioniert es',
      'tool-s1': 'Datei Auswählen', 'tool-s1d': 'Ziehe deine Datei hierher oder klicke zum Hochladen.',
      'tool-s2': 'Im Browser Verarbeitet', 'tool-s2d': 'Deine Datei verlässt dein Gerät nicht; alles läuft im Browser.',
      'tool-s3': 'Sofort-Download', 'tool-s3d': 'Das Ergebnis wird automatisch heruntergeladen, sobald es fertig ist.',
      'tool-pro': 'Pro Werden →',
    },
    fr: {
      'cat-pdf-title': 'Outils PDF', 'cat-belge-title': 'Outils Documents', 'cat-gorsel-title': "Outils d'Image",
      'cat-video-title': 'Outils Vidéo', 'cat-ses-title': 'Outils Audio', 'tools-title': 'Tous les Outils',
      'tools-sub': 'Plus de 70 outils gratuits. Sans inscription.',
      'tool-drop-title': 'Glissez vos fichiers ici ou cliquez',
      'tool-btn-process': 'Convertir', 'tool-btn-reset': 'Nouveau Fichier',
      'tool-how': 'Comment ça marche ?',
      'tool-s1': 'Choisissez le Fichier', 'tool-s1d': 'Glissez-déposez ou cliquez pour téléverser votre fichier.',
      'tool-s2': 'Traité dans le Navigateur', 'tool-s2d': 'Votre fichier ne quitte pas votre appareil ; tout se passe dans le navigateur.',
      'tool-s3': 'Téléchargement Immédiat', 'tool-s3d': 'Le résultat se télécharge automatiquement dès qu\'il est prêt.',
      'tool-pro': 'Passer Pro →',
    },
  };
  Object.entries(EXTRA).forEach(([l, d]) => Object.assign(T[l], d));

  /* ── Araç adı çevirici (kelime + kalıp tabanlı) ──
     TR araç adlarını EN/ES/DE/FR'ye çevirir. data-tool-name işaretli
     öğelerde kullanılır; eşleşme yoksa TR ad korunur. */
  const W = { /* kelime: [en, es, de, fr] */
    'PDF': ['PDF','PDF','PDF','PDF'], 'Görsel': ['Image','Imagen','Bild','Image'],
    'Video': ['Video','Vídeo','Video','Vidéo'], 'Ses': ['Audio','Audio','Audio','Audio'],
    'Belge': ['Document','Documento','Dokument','Document'], 'Word': ['Word','Word','Word','Word'],
    'Excel': ['Excel','Excel','Excel','Excel'],
  };
  const V = { /* eylem: [en, es, de, fr] — fiil önce (DE: sonda) */
    'Birleştir': ['Merge','Unir','Zusammenfügen','Fusionner'],
    'Sıkıştır': ['Compress','Comprimir','Komprimieren','Compresser'],
    'Böl': ['Split','Dividir','Teilen','Diviser'],
    'Döndür': ['Rotate','Rotar','Drehen','Pivoter'],
    'Kes': ['Trim','Recortar','Schneiden','Couper'],
    'Kırp': ['Crop','Recortar','Zuschneiden','Rogner'],
    'Boyutlandır': ['Resize','Redimensionar','Skalieren','Redimensionner'],
    'Kilitle': ['Protect','Proteger','Schützen','Protéger'],
    'Filigran': ['Watermark','Marca de Agua','Wasserzeichen','Filigrane'],
    'Dönüştür': ['Convert','Convertir','Konvertieren','Convertir'],
    'Keskinleştir': ['Sharpen','Enfocar','Schärfen','Accentuer'],
    'Güçlendir': ['Boost','Amplificar','Verstärken','Amplifier'],
    'Normalize': ['Normalize','Normalizar','Normalisieren','Normaliser'],
    'Kesici': ['Cutter','Cortador','Schneider','Découpeur'],
  };
  const PHRASES = { /* düzensiz tam adlar */
    'Sayfaları Düzenle': ['Organize Pages','Organizar Páginas','Seiten Ordnen','Organiser les Pages'],
    'PDF Koruma Kaldır': ['Unlock PDF','Desbloquear PDF','PDF Entsperren','Déverrouiller PDF'],
    'OCR ile Metin Çıkar': ['OCR Text Extract','OCR Extraer Texto','OCR Texterkennung','OCR Extraire Texte'],
    'Arka Plan Kaldır': ['Remove Background','Quitar Fondo','Hintergrund Entfernen','Supprimer le Fond'],
    'Renk Ayarla': ['Adjust Colors','Ajustar Colores','Farben Anpassen','Régler les Couleurs'],
    'Görselden PDF': ['Image to PDF','Imagen a PDF','Bild zu PDF','Image en PDF'],
    'Hızlandır / Yavaşlat': ['Speed Up / Slow Down','Acelerar / Ralentizar','Beschleunigen / Verlangsamen','Accélérer / Ralentir'],
    'Karelere Böl': ['Extract Frames','Extraer Fotogramas','Frames Extrahieren','Extraire les Images'],
    'Videodan Sesi Kaldır': ['Remove Audio from Video','Quitar Audio del Vídeo','Ton aus Video Entfernen','Supprimer l\'Audio'],
    'Altyazı Ekle': ['Add Subtitles','Añadir Subtítulos','Untertitel Hinzufügen','Ajouter des Sous-titres'],
    'Gürültü Kaldır': ['Remove Noise','Quitar Ruido','Rauschen Entfernen','Supprimer le Bruit'],
    'Ses Hızı Değiştir': ['Change Audio Speed','Cambiar Velocidad','Audio-Tempo Ändern','Changer la Vitesse'],
    'Metinden Sese (TTS)': ['Text to Speech (TTS)','Texto a Voz (TTS)','Text zu Sprache (TTS)','Texte en Parole (TTS)'],
    'Sesten Metne (STT)': ['Speech to Text (STT)','Voz a Texto (STT)','Sprache zu Text (STT)','Parole en Texte (STT)'],
    'Filigran Ekle': ['Add Watermark','Añadir Marca de Agua','Wasserzeichen Hinzufügen','Ajouter un Filigrane'],
  };
  const LI = { en: 0, es: 1, de: 2, fr: 3 };
  const CONV = { /* "A'dan B'ye" kalıbı */
    en: (a, b) => a + ' to ' + b, es: (a, b) => a + ' a ' + b,
    de: (a, b) => a + ' zu ' + b, fr: (a, b) => a + ' en ' + b,
  };

  function fjToolName(tr, lang) {
    if (lang === 'tr' || LI[lang] === undefined) return tr;
    const i = LI[lang];
    if (PHRASES[tr]) return PHRASES[tr][i];
    /* Dönüşüm kalıbı: X'den Y / X'ten Y'ye / X'dan Y */
    const m = tr.match(/^(.+?)'[dt][ae]n\s+(.+?)(?:'[yn]?[ae])?$/);
    if (m) return CONV[lang](m[1], m[2]);
    /* [nesne] [eylem] kalıbı */
    const parts = tr.split(' ');
    if (parts.length === 2 && V[parts[1]]) {
      const noun = W[parts[0]] ? W[parts[0]][i] : parts[0];
      const verb = V[parts[1]][i];
      return lang === 'de' ? noun + ' ' + verb : verb + ' ' + noun;
    }
    return tr;
  }
  window.fjToolName = fjToolName;

  const LANG_NAMES = { tr: 'Türkçe', en: 'English', es: 'Español', de: 'Deutsch', fr: 'Français' };

  function applyLanguage(lang) {
    if (!T[lang]) lang = 'tr';
    const dict = T[lang];
    document.documentElement.lang = lang;
    localStorage.setItem('fj-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = dict[el.dataset.i18n];
      if (v) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const v = dict[el.dataset.i18nPlaceholder];
      if (v) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-i18n-tool]').forEach(el => {
      const v = dict._tools && dict._tools[el.dataset.i18nTool];
      if (v) el.textContent = v;
    });

    /* Araç adları: orijinal TR adı data-tr'de sakla, oradan çevir */
    document.querySelectorAll('[data-tool-name]').forEach(el => {
      if (!el.dataset.tr) el.dataset.tr = el.textContent.trim();
      el.textContent = fjToolName(el.dataset.tr, lang);
    });

    document.querySelectorAll('.btn-lang-text').forEach(el => { el.textContent = lang.toUpperCase(); });
    document.querySelectorAll('.btn-lang-footer-text').forEach(el => { el.textContent = LANG_NAMES[lang]; });
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  window.fjApplyLanguage = applyLanguage;
  window.fjT = function (key) {
    const lang = localStorage.getItem('fj-lang') || 'tr';
    return (T[lang] && T[lang][key]) || T.tr[key] || key;
  };

  document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('langPanel');
    const btnLang = document.getElementById('btnLang');
    const btnLangFooter = document.getElementById('btnLangFooter');

    function togglePanel(e) {
      if (!panel) return;
      e.stopPropagation();
      panel.hidden = !panel.hidden;
      if (!panel.hidden && e.currentTarget === btnLangFooter) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    if (btnLang) btnLang.addEventListener('click', togglePanel);
    if (btnLangFooter) btnLangFooter.addEventListener('click', togglePanel);
    document.addEventListener('click', (e) => {
      if (panel && !panel.hidden && !e.target.closest('.lang-wrapper')) panel.hidden = true;
    });

    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', () => {
        applyLanguage(btn.dataset.lang);
        if (panel) panel.hidden = true;
      });
    });

    applyLanguage(localStorage.getItem('fj-lang') || 'tr');
  });
})();
