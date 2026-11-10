import { Button } from "../ui/button";
import { HeroCards } from "./HeroCards";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="container grid lg:grid-cols-2 place-items-center gap-6 lg:gap-10 lg:pt-6 lg:pb-14 xl:pt-15 xl:pb-16">
      <div className="text-center lg:text-start space-y-7 sm:space-y-8">
        {/* Main Headline */}
        <main className="text-[2.5rem] leading-[1.15] sm:text-5xl md:text-6xl font-extrabold tracking-tight sm:leading-tight">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#4f72f7] via-[#1447e6] to-[#0f36b3] text-transparent bg-clip-text">
              IntelliQuest\n
            </span>{" "}
            e-learning platform
          </h1>{" "}
          for{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
              curious minds
            </span>
          </h2>
        </main>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground md:w-11/12 mx-auto lg:mx-0 leading-relaxed">
          Master skills from basics to advanced with expert-led paths designed to keep you ahead in a fast-moving world.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
          <Button
            onClick={() => navigate("/signup")}
            className="w-full sm:w-auto px-8 h-13 text-[17px] font-semibold bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.488_0.243_264.376)]/90 text-primary shadow-lg shadow-blue-600/25 cursor-pointer flex items-center justify-center gap-2 transition duration-300 ease-in-out"
          >
            Get Started
            <ArrowRight className="size-4" />
          </Button>
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="w-full sm:w-auto px-8 h-13 text-[17px] font-medium border-border hover:bg-accent/40 cursor-pointer"
          >
            Sign In
          </Button>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center lg:justify-start gap-3.5">
          <div className="flex -space-x-2.5">
            <img className="inline-block size-9 rounded-full ring-2 ring-background object-cover" src="https://i.pravatar.cc/100?img=32" alt="Learner" />
            <img className="inline-block size-9 rounded-full ring-2 ring-background object-cover" src="https://i.pravatar.cc/100?img=58" alt="Learner" />
            <img className="inline-block size-9 rounded-full ring-2 ring-background object-cover" src="https://i.pravatar.cc/100?img=47" alt="Learner" />
            <img className="inline-block size-9 rounded-full ring-2 ring-background object-cover" src="https://i.pravatar.cc/100?img=12" alt="Learner" />
          </div>
          <div className="text-sm text-muted-foreground text-left">
            <div className="flex items-center text-amber-400 font-medium text-sm">
              {"★".repeat(5)}
              <span className="ml-1.5 text-foreground font-semibold">4.9/5</span>
            </div>
            <span>Over 2,700+ active learners</span>
          </div>
        </div>
      </div>

      {/* Hero cards sections for desktop */}
      <div className="z-10 hidden lg:block">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
