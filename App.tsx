import React, { useState, useEffect, useRef } from 'react';
import { Language, ModalContent } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { TimeSavings } from './components/TimeSavings';
import { DentalPodcastSection } from './components/DentalPodcastSection';
import { CarDrivingModeModal } from './components/CarDrivingModeModal';
import { AudioSourceModal } from './components/AudioSourceModal';
import { ProductCard } from './components/ProductCard';
import { IPhonePreview } from './components/IPhonePreview';
import { ThreeSteps } from './components/ThreeSteps';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { StickyBottomBar } from './components/StickyBottomBar';
import { FloatingDesktopWhatsApp } from './components/FloatingDesktopWhatsApp';
import { Modals } from './components/Modals';
import { QuickModeDrawer } from './components/QuickModeDrawer';
import { BookingModal } from './components/BookingModal';
import { DoctorSuccessStories } from './components/DoctorSuccessStories';
import { DENTAL_PODCAST_DATA } from './data/podcastData';
import { WifiOff, Wifi } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('fr');
  const [activeModal, setActiveModal] = useState<ModalContent | null>(null);
  const [isQuickModeOpen, setIsQuickModeOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showNetworkToast, setShowNetworkToast] = useState(false);

  // Podcast Global Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSource, setAudioSource] = useState<string>(DENTAL_PODCAST_DATA.src);
  const [audioSourceName, setAudioSourceName] = useState<string>(
    lang === 'ar' ? 'صوت الاستوديو الرسمي المُدمج' : 'Master Studio HD Intégré'
  );
  const [isCustomFile, setIsCustomFile] = useState(false);
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false);
  const [audioBlockedNotice, setAudioBlockedNotice] = useState(false);

  const [isPodcastPlaying, setIsPodcastPlaying] = useState(false);
  const [podcastTime, setPodcastTime] = useState(0);
  const [podcastDuration, setPodcastDuration] = useState(DENTAL_PODCAST_DATA.durationSeconds);
  const [isPodcastMuted, setIsPodcastMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isCarModeOpen, setIsCarModeOpen] = useState(false);

  // Ensure clean medical light appearance and clear any saved dark mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    try {
      localStorage.removeItem('theme');
    } catch {
      // ignore
    }
  }, []);

  // Sync html dir and lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (lang === 'ar') {
      document.body.style.fontFamily = "'Tajawal', 'Plus Jakarta Sans', sans-serif";
      if (!isCustomFile) {
        setAudioSourceName('صوت الاستوديو الرسمي المُدمج');
      }
    } else {
      document.body.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
      if (!isCustomFile) {
        setAudioSourceName('Master Studio HD Intégré');
      }
    }
  }, [lang, isCustomFile]);

  // Monitor network connectivity for reliability
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNetworkToast(true);
      const timer = setTimeout(() => setShowNetworkToast(false), 4000);
      return () => clearTimeout(timer);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowNetworkToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync playbackRate & mute to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.muted = isPodcastMuted;
    }
  }, [playbackRate, isPodcastMuted]);

  // Check URL fragment for #podcast navigation
  useEffect(() => {
    if (window.location.hash === '#podcast') {
      setTimeout(() => {
        const el = document.getElementById('podcast');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 350);
    }
  }, []);

  // Play / Pause Master Controller for Embedded Audio File Only
  const togglePodcastPlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPodcastPlaying) {
      audio.pause();
      setIsPodcastPlaying(false);
      return;
    }

    // Direct playback of the official embedded audio clip
    audio.muted = isPodcastMuted;
    audio.volume = 1.0;
    audio.playbackRate = playbackRate;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPodcastPlaying(true);
          setAudioBlockedNotice(false);
        })
        .catch((err) => {
          console.warn('Playback deferred or error, reloading audio element:', err);
          audio.load();
          audio
            .play()
            .then(() => {
              setIsPodcastPlaying(true);
              setAudioBlockedNotice(false);
            })
            .catch((e) => {
              console.warn('Audio play retry in preview:', e);
              setAudioBlockedNotice(true);
            });
        });
    }
  };

  // Automatic Audio Playback on Mount (with gesture unlock for preview iframe restrictions)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let hasStarted = false;

    const startPlayback = () => {
      if (hasStarted || isPodcastPlaying) return;
      audio
        .play()
        .then(() => {
          hasStarted = true;
          setIsPodcastPlaying(true);
          setAudioBlockedNotice(false);
        })
        .catch(() => {
          // Expected when browser requires direct user interaction
          setAudioBlockedNotice(true);
        });
    };

    // Attempt playback on mount
    startPlayback();
  }, []);

  const handleSeek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setPodcastTime(seconds);
    }
  };

  const handleToggleMute = () => {
    setIsPodcastMuted((prev) => !prev);
  };

  const handleChangePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
  };

  // Upload Local File
  const handleUploadAudioFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setAudioSource(url);
    setAudioSourceName(file.name);
    setIsCustomFile(true);

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsPodcastPlaying(true);
          setAudioBlockedNotice(false);
        })
        .catch((e) => {
          console.warn('Play after upload failed:', e);
        });
    }
  };

  // Set Direct URL
  const handleSetAudioUrl = (url: string) => {
    setAudioSource(url);
    setAudioSourceName(url);
    setIsCustomFile(true);

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsPodcastPlaying(true);
          setAudioBlockedNotice(false);
        })
        .catch((e) => {
          console.warn('Play direct URL failed:', e);
        });
    }
  };

  // Reset to default embedded audio
  const handleResetToDefault = () => {
    setAudioSource(DENTAL_PODCAST_DATA.src);
    setAudioSourceName(
      lang === 'ar' ? 'صوت الاستوديو الرسمي المُدمج' : 'Master Studio HD Intégré'
    );
    setIsCustomFile(false);

    if (audioRef.current) {
      audioRef.current.src = DENTAL_PODCAST_DATA.src;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsPodcastPlaying(true);
          setAudioBlockedNotice(false);
        })
        .catch((e) => {
          console.warn('Play default failed:', e);
        });
    }
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'fr' ? 'ar' : 'fr'));
  };

  const scrollToDemo = () => {
    const el = document.getElementById('demo-3d');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen w-full overflow-x-clip overflow-x-hidden bg-[#F8FAFC] text-slate-900 ${
        lang === 'ar' ? 'font-arabic' : ''
      }`}
    >
      {/* Accessibility: Skip to main content for screen readers and keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00D4B2] focus:text-[#0A192F] focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-hidden"
      >
        {lang === 'ar' ? 'الانتقال السريع إلى المحتوى الرئيسي' : 'Passer directement au contenu principal'}
      </a>

      {/* Network Connectivity Status Toast */}
      {showNetworkToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 start-1/2 -translate-x-1/2 z-50 transition-all animate-bounce"
        >
          {isOnline ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-xl">
              <Wifi className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تمت استعادة الاتصال بالإنترنت' : 'Connexion Internet rétablie'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold shadow-xl">
              <WifiOff className="w-4 h-4" />
              <span>{lang === 'ar' ? 'لا يوجد اتصال بالإنترنت حالياً' : 'Connexion Internet interrompue'}</span>
            </div>
          )}
        </div>
      )}

      {/* Explicit DOM Audio Element with playsInline for rock-solid mobile & iframe support */}
      <audio
        ref={audioRef}
        src={audioSource}
        preload="auto"
        playsInline
        crossOrigin="anonymous"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (d && !isNaN(d) && isFinite(d) && d > 0) {
            setPodcastDuration(d);
          }
        }}
        onTimeUpdate={(e) => {
          setPodcastTime(e.currentTarget.currentTime);
        }}
        onEnded={() => {
          setIsPodcastPlaying(false);
          setPodcastTime(0);
        }}
        onPlay={() => {
          setIsPodcastPlaying(true);
          setAudioBlockedNotice(false);
        }}
        onPause={() => {
          setIsPodcastPlaying(false);
        }}
        onError={(e) => {
          console.warn('Audio tag encountered an issue loading resource', e);
          if (audioSource.endsWith('.mp3')) {
            setAudioSource('/audio/podcast-dental-mastery.m4a');
          } else if (audioSource.endsWith('.m4a')) {
            setAudioSource('/audio/podcast-dental-mastery.wav');
          }
        }}
      />

      {/* Floating Instant Audio Playback Prompt if browser requires user click */}
      {audioBlockedNotice && !isPodcastPlaying && (
        <div
          onClick={togglePodcastPlay}
          className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 cursor-pointer animate-bounce"
        >
          <div className="bg-[#0F2C59] text-white px-4 py-2.5 rounded-full shadow-2xl border-2 border-[#00D4B2] flex items-center gap-2.5 text-xs sm:text-sm font-bold hover:bg-[#163a73] transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D4B2] animate-ping" />
            <span>
              {lang === 'ar'
                ? '🎙️ انقر للاستماع إلى البودكاست الطبي المدمج'
                : '🎙️ Cliquez pour écouter le podcast médical'}
            </span>
            <span className="w-6 h-6 rounded-full bg-[#00D4B2] text-[#0A192F] flex items-center justify-center font-black text-xs">
              ▶
            </span>
          </div>
        </div>
      )}

      {/* Navigation Header with Live Podcast Toggle Button & Driving Mode Shortcut */}
      <Header
        lang={lang}
        onToggleLang={toggleLang}
        onOpenQuickMode={() => setIsQuickModeOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
        isPodcastPlaying={isPodcastPlaying}
        onTogglePodcastPlay={togglePodcastPlay}
        onOpenCarMode={() => setIsCarModeOpen(true)}
      />

      {/* Semantic Main Content Landmark (WCAG 2.2 / SEO) */}
      <main id="main-content" role="main">
        {/* Hero Section */}
        <Hero
          lang={lang}
          onOpenBooking={() => setIsBookingOpen(true)}
          onExploreDemo={scrollToDemo}
        />

        {/* Interactive Before / After Comparison */}
        <BeforeAfterSlider lang={lang} />

        {/* Doctor Time Savings Section */}
        <TimeSavings lang={lang} />

        {/* Dedicated Podcast Section (NotebookLM Dental Deep Dive) */}
        <DentalPodcastSection
          lang={lang}
          isPlaying={isPodcastPlaying}
          currentTime={podcastTime}
          duration={podcastDuration}
          onTogglePlay={togglePodcastPlay}
          onSeek={handleSeek}
          isMuted={isPodcastMuted}
          onToggleMute={handleToggleMute}
          playbackRate={playbackRate}
          onChangePlaybackRate={handleChangePlaybackRate}
          onOpenCarMode={() => setIsCarModeOpen(true)}
          onOpenBooking={() => setIsBookingOpen(true)}
          audioSourceName={audioSourceName}
          isCustomFile={isCustomFile}
          onOpenAudioSettings={() => setIsAudioSettingsOpen(true)}
          onUploadFile={handleUploadAudioFile}
        />

        {/* 4 Interactive Products with Micro-Modals */}
        <ProductCard
          lang={lang}
          onOpenModal={(modal) => setActiveModal(modal)}
        />

        {/* 3D Android Phone Frame Preview */}
        <IPhonePreview lang={lang} />

        {/* Process in 3 Simple Steps */}
        <ThreeSteps
          lang={lang}
          onOpenBooking={() => setIsBookingOpen(true)}
        />

        {/* Moroccan Doctors Success Stories & Social Proof */}
        <DoctorSuccessStories
          lang={lang}
          onOpenBooking={() => setIsBookingOpen(true)}
        />

        {/* Official FAQ & Guarantees Accordion */}
        <FAQSection
          lang={lang}
          onOpenBooking={() => setIsBookingOpen(true)}
        />
      </main>

      {/* Official Footer */}
      <Footer lang={lang} />

      {/* Mobile Sticky Bottom CTA Bar */}
      <StickyBottomBar
        lang={lang}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Desktop Floating WhatsApp Assistant Button */}
      <FloatingDesktopWhatsApp lang={lang} />

      {/* Car Driving Mode Interface */}
      <CarDrivingModeModal
        isOpen={isCarModeOpen}
        onClose={() => setIsCarModeOpen(false)}
        isPlaying={isPodcastPlaying}
        currentTime={podcastTime}
        duration={podcastDuration}
        onTogglePlay={togglePodcastPlay}
        onSeek={handleSeek}
        isMuted={isPodcastMuted}
        onToggleMute={handleToggleMute}
        lang={lang}
        onOpenBooking={() => {
          setIsCarModeOpen(false);
          setIsBookingOpen(true);
        }}
        audioSourceName={audioSourceName}
        onOpenAudioSettings={() => setIsAudioSettingsOpen(true)}
        onUploadFile={handleUploadAudioFile}
        playbackRate={playbackRate}
        onChangePlaybackRate={handleChangePlaybackRate}
      />

      {/* Audio Source Configuration Modal */}
      <AudioSourceModal
        isOpen={isAudioSettingsOpen}
        onClose={() => setIsAudioSettingsOpen(false)}
        lang={lang}
        currentSourceName={audioSourceName}
        isCustomFile={isCustomFile}
        onUploadFile={handleUploadAudioFile}
        onSetUrl={handleSetAudioUrl}
        onResetToDefault={handleResetToDefault}
      />

      {/* Interactive Micro-Modals */}
      <Modals
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        lang={lang}
      />

      {/* 60s Fast Mode Executive Drawer */}
      <QuickModeDrawer
        isOpen={isQuickModeOpen}
        onClose={() => setIsQuickModeOpen(false)}
        lang={lang}
        onOpenBooking={() => {
          setIsQuickModeOpen(false);
          setIsBookingOpen(true);
        }}
      />

      {/* WhatsApp Connected Booking Form Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        lang={lang}
      />
    </div>
  );
}
