import { GraduationCapIcon } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-8 sm:py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-6 sm:gap-x-12 gap-y-6 sm:gap-y-8 px-4 sm:px-6">
        <div className="col-span-full xl:col-span-2">
          <a
            rel="noreferrer noopener"
            href="/"
            className="flex items-center"
          >
            <div className="bg-[oklch(0.488_0.243_264.376)] text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GraduationCapIcon className="size-4" />
            </div>

            <div>
              <span className="text-primary pl-2 truncate font-medium text-lg">IntelliQuest.</span>
            </div>
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-base sm:text-lg">Follow US</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-sm sm:text-base opacity-60 hover:opacity-100"
            >
              Github
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-sm sm:text-base opacity-60 hover:opacity-100"
            >
              Twitter
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-sm sm:text-base opacity-60 hover:opacity-100"
            >
              Dribbble
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-base sm:text-lg">Platforms</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-sm sm:text-base opacity-60 hover:opacity-100"
            >
              Web
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-sm sm:text-base opacity-60 hover:opacity-100"
            >
              Mobile
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-sm sm:text-base opacity-60 hover:opacity-100"
            >
              Desktop
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-base sm:text-lg">About</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-sm sm:text-base opacity-60 hover:opacity-100"
            >
              Features
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-sm sm:text-base opacity-60 hover:opacity-100"
            >
              Pricing
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-sm sm:text-base opacity-60 hover:opacity-100"
            >
              FAQ
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-base sm:text-lg">Community</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-sm sm:text-base opacity-60 hover:opacity-100"
            >
              Youtube
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-sm sm:text-base opacity-60 hover:opacity-100"
            >
              Discord
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#"
              className="text-sm sm:text-base opacity-60 hover:opacity-100"
            >
              Twitch
            </a>
          </div>
        </div>
      </section>

      <section className="container pb-8 sm:pb-12 text-center text-xs sm:text-sm text-muted-foreground px-4">
        <h3>
          &copy; {new Date().getFullYear()}{" "}
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="#"
            className="text-[oklch(0.488_0.243_264.376)] transition-all border-[oklch(0.488_0.243_264.376)] hover:border-b-2"
          >
            IntelliQuest Inc.{" "}
          </a>
          All rights reserved.
        </h3>
      </section>
    </footer>
  );
};
