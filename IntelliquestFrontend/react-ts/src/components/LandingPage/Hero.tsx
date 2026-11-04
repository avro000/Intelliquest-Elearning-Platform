import { Button } from "../ui/button";
import { HeroCards } from "./HeroCards";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#4f72f7] via-[#1447e6] to-[#0f36b3] text-transparent bg-clip-text">
              IntelliQuest
            </span>{" "}
            e-learning platform
          </h1>{" "}
          for{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF]  text-transparent bg-clip-text">
              curious minds
            </span>
          </h2>

        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Master skills from basics to advanced with expert-led paths designed to keep you ahead in a fast-moving world.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button onClick={() => navigate("/signup")} className="w-full md:w-1/3 bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.488_0.243_264.376)]/90 transition duration-300 ease-in-out cursor-pointer text-primary">Get Started</Button>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};