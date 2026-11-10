import { Statistics } from "./Statistics";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-8 sm:py-12 md:py-20 relative"
    >
      <div className="shadow-price"></div>
      <div className="bg-muted/50 border rounded-lg py-8 sm:py-12">
        <div className="px-4 sm:px-6 flex flex-col-reverse md:flex-row gap-6 md:gap-12 items-center">
          <img
            src="/pilot.png"
            alt="About IntelliQuest"
            className="w-[200px] sm:w-[260px] md:w-[300px] object-contain rounded-lg mx-auto"
          />
          <div className="flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-[oklch(0.488_0.243_264.376)]/60 to-[oklch(0.488_0.243_264.376)] text-transparent bg-clip-text">
                  About{" "}
                </span>
                IntelliQuest
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-3 sm:mt-4">
                At IntelliQuest, we believe learning should be engaging, accessible, and tailored to the modern learner. Our platform offers expertly designed courses that blend foundational concepts with real-world applications—empowering individuals to grow their skills and stay ahead in a rapidly evolving world. Whether you're just starting out or aiming for mastery, IntelliQuest is your trusted companion on the journey to lifelong learning.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
