import { useRef, useEffect } from 'react';
import { cube } from '../../constans';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useMouseScroll from '../../utils/useMouseScroll';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Hero() {
  const text = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const { y: scrollY } = useMouseScroll();

  const animatedProgress = useRef(0);
  const targetProgress = useRef(0);
  const rafId = useRef<number>(0);

  useGSAP(() => {
    gsap.registerPlugin(SplitText);

    if (!text.current || !container.current || !hero.current) return;

    const text1 = text.current?.children[0];
    const text2 = text.current?.children[1];
    const text3 = text.current?.children[2];

    const splitText = SplitText.create(text3, { type: 'chars' });

    const masks = gsap.utils.toArray<HTMLElement>('.mask');
    masks.forEach((mask, i) => {
      gsap.set(mask, {
        scale: 1 - i * 0.15,
      });
    });

    gsap.from(text1!, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1,
      ease: 'power4.out',
    });
    gsap.from(text2!, {
      clipPath: 'inset(100% 0 0 0)',
      duration: 1,
      ease: 'power4.out',
    });

    gsap.set(container.current, { scale: 0 });
    const widhtContainer = container.current?.clientWidth || 0;

    const tl = gsap
      .timeline({ paused: true })
      .fromTo(
        text1!,
        {
          xPercent: 100,
        },
        {
          xPercent: -widhtContainer / 2 - 100,
        },
        0
      )
      .fromTo(
        text2!,
        {
          xPercent: -100,
        },
        {
          xPercent: widhtContainer / 2 + 100,
        },
        0
      )
      .to(
        container.current,
        {
          scale: 1,
          onUpdate: () => {
            const progress = targetProgress.current;
            masks.forEach((mask, i) => {
              const initialScale = 0.9 - i * 0.15;
              const currentScale = initialScale + (1.1 - initialScale) * progress;

              gsap.set(mask, {
                scale: currentScale,
              });
            });
          },
        },
        0
      )
      .from(
        splitText.chars,
        {
          stagger: 0.05,
          clipPath: 'inset(100% 0 0 0)',
        },
        '-=0.4'
      );

    function animate() {
      animatedProgress.current += (targetProgress.current - animatedProgress.current) * 0.1;
      tl.progress(animatedProgress.current);
      rafId.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId.current!);
    };
  }, []);

  useEffect(() => {
    const maxScroll = window.innerHeight * 3;
    targetProgress.current = scrollY / maxScroll;
  }, [scrollY]);

  return (
    <>
      <section className='h-screen relative overflow-hidden' ref={hero}>
        <div className='h-full w-full relative overflow-hidden will-change-transform' ref={container}>
          <img src={cube} alt='cube' />
          <img src={cube} alt='cube' className='mask' />
          <img src={cube} alt='cube' className='mask' />
          <img src={cube} alt='cube' className='mask' />
          <img src={cube} alt='cube' className='mask' />
          <img src={cube} alt='cube' className='mask' />
        </div>

        <div className='absolute inset-0 flex items-center justify-center uppercase' ref={text}>
          <span className='text-5xl font-bold text-accent'>Echo</span>
          <span className='text-5xl font-bold text-accent'>Zoom</span>
          <span className='text-8xl absolute inset-0 uppercase flex items-center justify-center font-bold text-primary'>cube.</span>
        </div>
      </section>
    </>
  );
}
