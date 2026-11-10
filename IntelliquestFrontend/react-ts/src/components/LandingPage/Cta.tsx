import { Button } from "../ui/button";

export const Cta = () => {
  return (
    <section
      id="cta"
      className="bg-muted/50 py-10 sm:py-16 my-8 sm:my-14 md:my-20"
    >
      <div className="container flex flex-col lg:flex-row items-center justify-between gap-6 px-4 sm:px-6">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Become an
            <span className="bg-gradient-to-b from-[oklch(0.488_0.243_264.376)]/60 to-[oklch(0.488_0.243_264.376)] text-transparent bg-clip-text">
              {" "}
              Instructor{" "}
            </span>
            at IntelliQuest
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl mt-3 mb-6 lg:mb-0">
            Do you have a passion for teaching and a wealth of knowledge to share? Join our community of expert educators and shape the future of learners. Share your expertise, create impactful courses, and make a difference in education. Apply now to become an instructor at IntelliQuest!
          </p>
        </div>
        <div className="lg:w-1/3 flex justify-center w-full sm:w-auto">
          <a
            href="/apply-instructor"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto px-8 bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.488_0.243_264.376)]/90 transition duration-300 ease-in-out cursor-pointer text-primary">
              Apply Now
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
