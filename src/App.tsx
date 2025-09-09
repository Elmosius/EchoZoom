import gsap from 'gsap';
import { ReactLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';
import { useEffect, useRef } from 'react';
import Hero2 from './components/Hero/index2';

export default function App() {
  const lenisRef = useRef<LenisRef | null>(null);

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <main className='min-h-screen bg-primary'>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <p className='absolute inset-0 p-4 text-accent/50 font-bold text-5xl'>Scroll down</p>
      <Hero2 />
    </main>
  );
}
