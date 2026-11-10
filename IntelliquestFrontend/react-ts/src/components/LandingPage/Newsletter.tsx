import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const Newsletter = () => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Subscribed!");
  };

  return (
    <section id="newsletter">
      <hr className="w-11/12 mx-auto" />

      <div className="container py-8 sm:py-12 md:py-20 px-4 sm:px-6">
        <h3 className="text-center text-2xl sm:text-3xl md:text-5xl font-bold">
          Join Our Daily{" "}
          <span className="bg-gradient-to-b from-[oklch(0.488_0.243_264.376)]/60 to-[oklch(0.488_0.243_264.376)] text-transparent bg-clip-text">
            Newsletter
          </span>
        </h3>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center mt-2 sm:mt-4 mb-6 sm:mb-8">
          Get the latest course releases, learning tips, and technology news straight to your inbox.
        </p>

        <form
          className="flex flex-col w-full sm:flex-row md:w-8/12 lg:w-5/12 mx-auto gap-3"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="your-email@example.com"
            className="bg-muted/50 dark:bg-muted/80 h-10"
            aria-label="email"
          />
          <Button className="bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.488_0.243_264.376)]/90 transition duration-300 ease-in-out cursor-pointer text-primary h-10 shrink-0">Subscribe</Button>
        </form>
      </div>

      <hr className="w-11/12 mx-auto" />
    </section>
  );
};
