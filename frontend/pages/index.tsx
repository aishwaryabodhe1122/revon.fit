import { useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Import TestimonialCard with SSR disabled to prevent window is not defined error
const TestimonialCard = dynamic(
  () => import('../components/TestimonialCard'),
  { ssr: false }
);

// Sample testimonials data
const testimonials = [
  {
    name: 'Rahul Sharma',
    review: 'Sushil transformed my fitness journey completely. His personalized training and diet plan helped me lose 12kg in 3 months!',
    rating: 5
  },
  {
    name: 'Priya Patel',
    review: 'The best trainer I\'ve ever worked with. His knowledge about nutrition is exceptional and the workouts are always challenging.',
    rating: 5
  },
  {
    name: 'Amit Singh',
    review: 'I was skeptical at first, but the results speak for themselves. Gained 5kg of muscle in just 4 months!',
    rating: 4
  },
  {
    name: 'Neha Gupta',
    review: 'Sushil is very professional and attentive. He adapts the training based on my progress and limitations.',
    rating: 5
  },
  {
    name: 'Vikram Mehta',
    review: 'The online coaching is just as effective as in-person. The app makes it super easy to track progress and stay accountable.',
    rating: 4
  }
];

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
  
    // Avoid fighting with native scrolling
    el.style.overflow = "hidden";
    el.style.scrollBehavior = "auto";
  
    // Build (or reuse) a track that holds items
    let track = el.querySelector(":scope > .infinite-track") as HTMLElement | null;
    let createdTrack = false;
    if (!track) {
      track = document.createElement("div");
      track.className = "infinite-track";
      track.style.display = "flex";
      track.style.gap = "16px";              // adjust if you use a different gap
      track.style.willChange = "transform";
  
      // Move current children into the track
      const originals = Array.from(el.children);
      originals.forEach((child) => track!.appendChild(child));
      el.appendChild(track);
      createdTrack = true;
  
      // Ensure we have enough width to cover large viewports (duplicate once or more if needed)
      const minFill = el.clientWidth * 2;    // aim for >= 2x viewport width
      const seed = Array.from(track.children);
      while (track.scrollWidth < minFill && seed.length) {
        for (const node of seed) {
          track.appendChild(node.cloneNode(true));
          if (track.scrollWidth >= minFill) break;
        }
      }
    }
  
    // Motion state
    let raf = 0;
    let last = performance.now();
    let paused = false;
    let offset = 0;
    let gapPx = 16;                          // keep in sync with track.style.gap
    let pxPerMs = el.clientWidth / 15000;     // 2s per viewport width
  
    const readGap = () => {
      const cs = getComputedStyle(track!);
      const g = parseFloat(cs.gap || "16");
      gapPx = isNaN(g) ? 16 : g;
    };
  
    const measure = () => {
      pxPerMs = el.clientWidth / 15000;       // keep speed consistent on resize
      readGap();
    };
  
    // Keep measurements in sync
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        measure();
        // If viewport grows and we don't have enough content, add more clones once
        const minFill = el.clientWidth * 2;
        if (track!.scrollWidth < minFill) {
          const kids = Array.from(track!.children);
          for (const k of kids) {
            track!.appendChild(k.cloneNode(true));
            if (track!.scrollWidth >= minFill) break;
          }
        }
      });
      ro.observe(el);
      ro.observe(track!);
    }
    measure();
  
    const step = (t: number) => {
      const dt = t - last;
      last = t;
  
      if (!paused) {
        offset += pxPerMs * dt;
  
        // Recycle children: when first item is fully out, move it to the end and subtract its width
        let first = track!.firstElementChild as HTMLElement | null;
        while (first) {
          const w = first.getBoundingClientRect().width + gapPx;
          if (offset >= w) {
            offset -= w;
            track!.appendChild(first);
            first = track!.firstElementChild as HTMLElement | null;
          } else {
            break;
          }
        }
  
        track!.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
  
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
  
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
  
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      ro?.disconnect();
  
      // (Optional) restore DOM on unmount/HMR
      if (createdTrack && track) {
        track.style.transform = "";
        while (track.firstChild) el.appendChild(track.firstChild);
        track.remove();
      }
    };
  }, []);
  
  
  
  return (
    <Layout title="Home">
      <section className="hero section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="badge-gold mb-3">Premium Coaching</span>
              <h1 className="display-3 fw-bold mb-3">Transform Your Body & Mind with <span style={{color:'var(--accent)'}}>Revon.Fit</span></h1>
              <p className="lead text-secondary mb-4">Personal training and nutrition coaching tailored to your goals — online or in-person. Science-based plans, elite accountability.</p>
              <div className="d-flex gap-3"><Link href="/services" className="btn btn-gold btn-lg">Explore Services</Link><a href="#about" className="btn btn-outline-light btn-lg">About Me</a></div>
            </div>
            <div className="col-lg-6">
              <div className="card-luxe shadow-soft p-0 overflow-hidden">
                <img src="/assets/hero.jpg" className="img-fluid" alt="hero"/>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="about" className="section">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-5">
              <div className="card-luxe overflow-hidden">
                <img src="/assets/trainer.jpg" className="img-fluid" alt="Trainer"/>
              </div>
            </div>
            <div className="col-md-7">
              <h2 className="fw-bold mb-3">Hi, I'm <span style={{color:'var(--accent)'}}>Sushil</span></h2>
              <p className="text-secondary">I am your trainer & nutritionist with 8+ years of industry experience helping 600+ clients achieve sustainable transformations.</p>
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 card-luxe h-100">
                    <div className="h4 mb-0">600+</div>
                    <small className="text-secondary">Clients Transformed</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 card-luxe h-100">
                    <div className="h4 mb-0">8 Years</div>
                    <small className="text-secondary">Experience</small>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <a id="book" href="/contact" className="btn btn-gold btn-lg">Book a Consultation</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">What Our <span style={{color: 'var(--accent)'}}>Clients Say</span></h2>
            <p className="text-secondary">Don't just take our word for it. Here's what our clients have to say about their experience.</p>
          </div>
          <div 
            ref={scrollContainerRef}
            className="d-flex gap-4 py-4 overflow-hidden scroll-container"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-shrink-0" style={{ width: '320px' }}>
                <TestimonialCard {...testimonial} />
              </div>
            ))}
            {/* Duplicate items for infinite scroll effect */}
            {testimonials.map((testimonial, index) => (
              <div key={`duplicate-${index}`} className="flex-shrink-0" style={{ width: '320px' }}>
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <style jsx global>{`
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
        
        .scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .card-luxe {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card-luxe:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </Layout>
  );
}
