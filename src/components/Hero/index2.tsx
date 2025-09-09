import { useRef } from 'react';
import { cube } from '../../constans';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Hero2() {
  const text = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(SplitText, ScrollTrigger);

    if (!text.current || !container.current || !hero.current) return;

    const text1 = text.current?.children[0];
    const text2 = text.current?.children[1];
    const text3 = text.current?.children[2];

    const splitText = SplitText.create(text3, { type: 'chars' });

    const masks = gsap.utils.toArray<HTMLElement>('.mask');
    masks.forEach((mask, i) => {
      gsap.set(mask, {
        scale: 1 - i * 0.25,
      });
    });

    gsap.set(text1!, { xPercent: 100 });
    gsap.set(text2!, { xPercent: -100 });

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
    const widthContainer = container.current?.clientWidth || 0;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: hero.current,
          start: 'top top',
          end: `${window.innerHeight * 4}px `,
          pin: true,
          scrub: true,
          markers: false,
          onUpdate: (self) => {
            const progress = self.progress;

            gsap.set(container.current, { scale: self.progress });
            masks.forEach((mask, i) => {
              const initialScale = 0.9 - i * 0.25;
              const currentScale = initialScale + (1 - initialScale) * progress;

              gsap.set(mask, {
                scale: currentScale,
              });

              gsap.set(text1!, { xPercent: (widthContainer / 2 + 200) * progress });
              gsap.set(text2!, { xPercent: -(widthContainer / 2 + 200) * progress });
            });
          },
        },
      })
      .from(splitText.chars, {
        delay: 0.3,
        stagger: 0.05,
        clipPath: 'inset(100% 0 0 0)',
      });
  }, []);

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
