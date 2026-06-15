"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Calendar, Users, TrendingUp } from "lucide-react";

// Dynamically import Lottie player to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import animation1 from "../public/animation1.json";
import animation2 from "../public/animation2.json";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-40 pb-16 overflow-hidden bg-white">

        {/* Soft, professional gradient flares */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-70 translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] opacity-60 -translate-x-1/3 translate-y-1/4 pointer-events-none" />

        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Events Reimagined
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-900">
                Host Events<br />
                <span className="text-blue-600 relative">
                  That Matter
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" strokeLinecap="round" />
                  </svg>
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 mb-10 max-w-[500px] leading-relaxed">
                The easiest way to organize, promote, and manage your gatherings.
                From intimate meetups to massive festivals, we've got you covered.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-14 w-full lg:w-auto">
                <Link href="/create-event" className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-lg shadow-blue-500/25">
                  Create your Events
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/your-events" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 hover:-translate-y-1 transition-all shadow-sm">
                  Explore Events
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="flex gap-12 pt-8 border-t border-slate-200 w-full lg:w-auto">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-extrabold text-slate-900">50k+</span>
                  <span className="text-sm text-slate-500 font-medium">Active Events</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-extrabold text-slate-900">1M+</span>
                  <span className="text-sm text-slate-500 font-medium">Attendees</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] lg:h-[600px] w-full flex justify-center items-center"
            >
              {/* Clean backdrop for animation */}
              <div className="absolute w-[80%] h-[80%] bg-slate-100 rounded-[3rem] rotate-3 shadow-inner" />
              <div className="absolute w-[80%] h-[80%] bg-white rounded-[3rem] -rotate-3 border border-slate-200 shadow-xl" />

              <div className="relative w-full max-w-[500px] h-full z-10 pointer-events-none flex items-center justify-center">
                <Lottie
                  animationData={animation1}
                  loop={true}
                  style={{ width: '120%', height: '120%' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Timeline Section */}
      <section className="py-32 px-6 relative bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900">Simple steps to success</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Launch your event in minutes, not days.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-6xl mx-auto">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-slate-200 z-0"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="w-[80px] h-[80px] rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl font-extrabold text-blue-600 shadow-lg shadow-slate-200/50 mb-8 rotate-3 transition-transform hover:rotate-0">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Create an Account</h3>
              <p className="text-slate-500 text-lg leading-relaxed px-4">Sign up in seconds and build your personalized organizer profile.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="w-[80px] h-[80px] rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl font-extrabold text-blue-600 shadow-lg shadow-slate-200/50 mb-8 -rotate-3 transition-transform hover:rotate-0">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Publish Your Event</h3>
              <p className="text-slate-500 text-lg leading-relaxed px-4">Add details, set ticket prices, and customize your event page.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="w-[80px] h-[80px] rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl font-extrabold text-blue-600 shadow-lg shadow-slate-200/50 mb-8 rotate-3 transition-transform hover:rotate-0">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Watch It Grow</h3>
              <p className="text-slate-500 text-lg leading-relaxed px-4">Track sales, manage attendees, and get real-time insights.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
