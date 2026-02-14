"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FaDiscord,
  FaYoutube,
  FaGlobe,
  FaGithub,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Playfair_Display } from "next/font/google";
import { Outfit } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

type LanyardData = {
  discord_status: "online" | "idle" | "dnd" | "offline";
  listening_to_spotify: boolean;
  spotify?: {
    song: string;
    artist: string;
  };
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    avatar_decoration_data?: {
      asset: string;
    };
  };
};

export default function Home() {
  const { data: session } = useSession();
  const [entered, setEntered] = useState(false);
  const [presence, setPresence] = useState<LanyardData | null>(null);
  const [muted, setMuted] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const displayName = "Hmam";

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setParticlesReady(true);
    });
  }, []);

  // Public view: do not force sign-in on page load. Users may still sign in
  // using the Connect Discord button if they wish.

  // If the visitor isn't signed in, fall back to a public Discord user ID so
  // the profile (avatar/presence) can still be displayed. Set
  // NEXT_PUBLIC_DISCORD_USER_ID in your environment (and on Vercel).
  const userId = session?.user?.id ?? process.env.NEXT_PUBLIC_DISCORD_USER_ID;

  useEffect(() => {
    if (!userId) return;

    // Debug: log the userId being requested so we can verify the env var or
    // session value is present in the client. Check browser console/network.
    console.log("Lanyard: fetching presence for userId=", userId);

    fetch(`https://api.lanyard.rest/v1/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Lanyard response:", data);
        if (data?.success) {
          setPresence(data.data);
        } else {
          // If API responded but success=false, clear presence and log.
          setPresence(null);
          console.warn("Lanyard returned success=false for", userId, data);
        }
      })
      .catch((err) => {
        console.error("Lanyard fetch failed for", userId, err);
        setPresence(null);
      });
  }, [userId]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = muted;
    videoRef.current.volume = muted ? 0 : 0.5;
  }, [muted]);

  const handleEnter = async () => {
    setEntered(true);

    setTimeout(async () => {
      if (!videoRef.current) return;
      try {
        videoRef.current.muted = false;
        videoRef.current.volume = 0.5;
        await videoRef.current.play();
      } catch {}
    }, 200);
  };

  const statusColor = {
    online: "bg-green-500",
    idle: "bg-yellow-400",
    dnd: "bg-red-500",
    offline: "bg-gray-500",
  };

  const avatarUrl =
    presence?.discord_user?.avatar
      ? `https://cdn.discordapp.com/avatars/${presence.discord_user.id}/${presence.discord_user.avatar}.png?size=256`
      : null;

  const decorationUrl =
    presence?.discord_user?.avatar_decoration_data?.asset
      ? `https://cdn.discordapp.com/avatar-decoration-presets/${presence.discord_user.avatar_decoration_data.asset}.png?size=512`
      : null;

  if (!entered) {
    return (
      <div
        onClick={handleEnter}
        className="flex min-h-screen items-center justify-center bg-black text-white cursor-pointer"
      >
        <h1 className="text-3xl tracking-widest animate-pulse">
          CLICK TO ENTER...
        </h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <video
        ref={videoRef}
        src="/media/background.mp4"
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover -z-20"
      />

      <div className="absolute inset-0 bg-black/70 -z-10" />

      <button
        onClick={() => setMuted(!muted)}
        className="absolute top-5 right-5 z-30 bg-black/50 backdrop-blur-md p-3 rounded-full border border-white/20 hover:scale-110 transition"
      >
        {muted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
      </button>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-white/30 shadow-xl z-10"
            />
          )}

          {decorationUrl && (
            <img
              src={decorationUrl}
              alt="decoration"
              className="absolute w-40 h-40 object-contain pointer-events-none z-20"
            />
          )}

          {presence && (
            <span
              className={`absolute bottom-3 right-3 w-5 h-5 rounded-full border-2 border-black z-30 ${
                statusColor[presence.discord_status]
              }`}
            />
          )}
        </div>

        {/* 🔥 NAME WITH SMALLER PARTICLES */}
        <div className="relative mt-6 w-64 h-24 flex items-center justify-center">
          {particlesReady && (
            <Particles
              id="nameParticles"
              className="absolute inset-0 w-full h-full"
              options={{
                fullScreen: false,
                background: { color: "transparent" },
                particles: {
                  number: { value: 40 }, // lebih sedikit
                  size: { value: { min: 0.3, max: 0.8 } }, // 🔥 lebih kecil
                  move: {
                    enable: true,
                    speed: 0.6,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: "bounce",
                  },
                  opacity: {
                    value: { min: 0.4, max: 0.8 },
                    animation: {
                      enable: true,
                      speed: 0.8,
                      sync: false,
                    },
                  },
                  color: {
                    value: "#ffffff",
                  },
                },
              }}
            />
          )}

          <h1
            className={`${playfair.className} text-5xl font-bold tracking-wider relative z-10`}
            style={{
              textShadow:
                "0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)",
            }}
          >
            {displayName}
          </h1>
        </div>

        <p className={`${outfit.className} text-lg font-light tracking-widest text-white/80 mt-3 uppercase`} style={{
          letterSpacing: "0.15em",
          textShadow: "0 0 10px rgba(255,255,255,0.3)"
        }}>
          Fullstack Development
        </p>

        {presence && (
          <div className="mt-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl">
            {avatarUrl && (
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-14 h-14 rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black ${
                    statusColor[presence.discord_status]
                  }`}
                />
              </div>
            )}

            <div className="text-left">
              <h2 className="text-lg font-semibold">
                {presence.discord_user.username}
              </h2>

              <p className="text-sm text-white/60 capitalize">
                {presence.discord_status === "offline"
                  ? "last seen recently"
                  : presence.discord_status}
              </p>
            </div>
          </div>
        )}

        {presence?.listening_to_spotify && presence.spotify && (
          <div className="mt-4 bg-green-500/20 px-6 py-3 rounded-xl border border-green-500/40">
            🎵 {presence.spotify.song} - {presence.spotify.artist}
          </div>
        )}

        <div className="flex gap-6 text-2xl mt-6 text-white/80">
          <a 
            href="YOUR_DISCORD_URL" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaDiscord />
          </a>
          <a 
            href="https://www.youtube.com/@HmamNuqi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaYoutube />
          </a>
          <a 
            href="https://www.linkedin.com/in/muhammad-humam-nuqi-117612383/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaGlobe />
          </a>
          <a 
            href="https://github.com/HmamSr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </div>
  );
}
