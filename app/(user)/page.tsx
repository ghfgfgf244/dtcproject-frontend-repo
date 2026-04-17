import Hero from "@/components/ui/Hero";
import Features from "@/components/ui/Features";
import Instructors from "@/components/ui/Instructors";
import CourseAdvisorWidget from "@/components/ai/CourseAdvisorWidget";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CourseAdvisorWidget />
      </section>
      <Features />
      <Instructors />
    </>
  );
}
