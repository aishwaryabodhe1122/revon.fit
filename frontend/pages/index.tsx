import { useEffect, useRef, useState } from 'react';
import { motion, Variants, easeInOut } from 'framer-motion';
import Layout from '../components/Layout';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Import TestimonialCard with SSR disabled to prevent window is not defined error
const TestimonialCard = dynamic(
  () => import('../components/TestimonialCard'),
  { ssr: false }
);

// Animation variants
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeInOut
    }
  }
};

const floatingContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const floatingItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: (i: number) => ({
    y: [0, -15, 0],
    opacity: 1,
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
      delay: i * 0.3
    }
  })
};

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

const FitnessAnimation = () => {
  // Interactive state for hover effects
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      className="position-relative h-100 w-100"
      initial="hidden"
      animate="show"
      variants={floatingContainer}
      style={{
        background: 'linear-gradient(145deg, rgba(12,15,19,0.1) 0%, rgba(12,15,19,0.05) 100%)',
        borderRadius: '24px',
        padding: '2rem',
        minHeight: '500px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      {/* Main 3D Model Container */}
      <motion.div
        className="position-relative d-flex justify-content-center align-items-center"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, var(--dark) 0%, var(--dark) 100%)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}
        variants={floatingItem}
        custom={0}
      >
        {/* 3D Model Placeholder - Center aligned */}
        <div className="position-relative z-2 text-center">
          <i
            className="fas fa-dumbbell text-white"
            style={{
              fontSize: '6rem',
              opacity: 0.9,
              filter: 'drop-shadow(0 5px 15px rgba(255,255,255,0.1))'
            }}
          />
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h5 className="text-white mb-0">Your Fitness Journey</h5>
            <p className="text-muted mb-0">Starts Here</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      {[
        {
          icon: 'fa-apple-alt',
          label: 'Nutrition',
          color: '#FF6B6B',
          size: '1.8rem',
          top: '15%',
          left: '10%',
          bg: 'rgba(255, 107, 107, 0.1)'
        },
        {
          icon: 'fa-drumstick-bite',
          label: 'Diet',
          color: '#4ECDC4',
          size: '1.6rem',
          top: '80%',
          left: '15%',
          bg: 'rgba(78, 205, 196, 0.1)'
        },
        {
          icon: 'fa-running',
          label: 'Exercise',
          color: '#FFD166',
          size: '2rem',
          top: '75%',
          right: '15%',
          bg: 'rgba(255, 209, 102, 0.1)'
        },
        {
          icon: 'fa-heartbeat',
          label: 'Health',
          color: '#EF476F',
          size: '2.2rem',
          top: '20%',
          right: '10%',
          bg: 'rgba(239, 71, 111, 0.1)'
        },
        {
          icon: 'fa-water',
          label: 'Hydration',
          color: '#118AB2',
          size: '1.5rem',
          top: '50%',
          left: '8%',
          bg: 'rgba(17, 138, 178, 0.1)'
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          className="position-absolute d-flex align-items-center"
          style={{
            color: item.color,
            fontSize: item.size,
            top: item.top,
            left: item.left,
            right: item.right,
            zIndex: 10,
            padding: '0.5rem 1rem',
            background: hovered === index ? item.bg : 'transparent',
            borderRadius: '50px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          variants={floatingItem}
          custom={index + 1}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          whileHover={{ scale: 1.1 }}
        >
          <i className={`fas ${item.icon} me-2`} />
          {hovered === index && (
            <motion.span
              className="text-white"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{ fontSize: '0.8rem' }}
            >
              {item.label}
            </motion.span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

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
      <section 
        className="hero section d-flex align-items-center position-relative" 
        style={{ 
          minHeight: '100vh',
          background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden'
        }}
      >
        {/* Background Image */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/assets/gym-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 0.25,
            zIndex: -1
          }}
        />
        
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row justify-content-center text-center">
            <motion.div
              className="col-lg-8 mx-auto"
              initial="hidden"
              animate="show"
              variants={container}
            >
              <motion.span
                className="badge-gold mb-3 d-inline-block"
                variants={item}
              >
                Premium Coaching
              </motion.span>
              <motion.h1
                className="display-3 fw-bold mb-3"
                variants={item}
              >
                Transform Your Body & Mind with <span style={{ color: 'var(--accent)' }}>Revvon.Fit</span>
              </motion.h1>
              <motion.p
                className="lead text-secondary mb-4"
                variants={item}
              >
                Personal training and nutrition coaching tailored to your goals — online or in-person. Science-based plans, elite accountability.
              </motion.p>
              <motion.div
                className="d-flex gap-3 justify-content-center"
                variants={item}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/services" className="btn btn-gold btn-lg">
                    Explore Services
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a href="#about" className="btn btn-outline-light btn-lg">About Me</a>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

      </section>
      <section id="about" className="section">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-5">
              <div className="card-luxe overflow-hidden">
                <img src="/assets/trainer.png" className="img-fluid" alt="Trainer" />
              </div>
            </div>
            <div className="col-md-7">
              <h2 className="fw-bold mb-3">Hi, I'm <span style={{ color: 'var(--accent)' }}>Sushil</span></h2>
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
      <section className="py-5" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-white">What Our <span style={{ color: 'var(--accent)' }}>Clients Say</span></h2>
            <p className="text-muted">Don't just take our word for it. Here's what our clients have to say about their experience.</p>
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
