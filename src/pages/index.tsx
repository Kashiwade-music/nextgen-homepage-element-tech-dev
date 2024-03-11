import * as React from "react";
import { useRef } from "react";
import { PageProps, HeadFC } from "gatsby";
import * as vanilla from "../styles/index.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { Observer } from "gsap/Observer";
import { log } from "console";

gsap.registerPlugin(useGSAP, Observer);

const SectionTemplate = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; sectionName: string }
>(({ children, sectionName }, ref) => {
  let className = "";
  if (sectionName === "top") {
    className = vanilla.SectionStyleTop;
  } else if (sectionName === "profile") {
    className = vanilla.SectionStyleProfile;
  } else if (sectionName === "works") {
    className = vanilla.SectionStyleWorks;
  } else if (sectionName === "special") {
    className = vanilla.SectionStyleSpecial;
  } else if (sectionName === "links") {
    className = vanilla.SectionStyleLinks;
  } else if (sectionName === "contact") {
    className = vanilla.SectionStyleContact;
  }

  return (
    <section className={className} ref={ref}>
      <div className="outer">
        <div className="inner">
          <div className="bg">{children}</div>
        </div>
      </div>
    </section>
  );
});

const IndexPage: React.FC<PageProps> = () => {
  const sectionNames = [
    "top",
    "profile",
    "works",
    "special",
    "links",
    "contact",
  ];
  let sectionRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    let animating = false;
    let currentIndex = 0;

    sectionRefs.current.forEach((sectionRef, index) => {
      if (index !== 0) {
        gsap.set(sectionRef, { autoAlpha: 0, yPercent: 100 });
      }
    });

    const gotoSection = (index: number, direction: number) => {
      if (
        (index < 0 && direction === -1) ||
        (index >= sectionRefs.current.length && direction === 1)
      ) {
        return;
      }
      console.log(
        `Running. currentIndex=${currentIndex}, from: ${index} to: ${direction})`
      );
      console.log(`Wrapped index: ${index}`);

      animating = true;

      let tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power2.inOut" },
        onComplete: () => {
          animating = false;
        },
      });

      if (direction === 1) {
        tl.to(sectionRefs.current[currentIndex], {
          autoAlpha: 0,
          yPercent: -100,
          zIndex: 0,
        });
        tl.to(
          sectionRefs.current[index],
          { autoAlpha: 1, yPercent: 0, zIndex: 1 },
          "<"
        );
      } else {
        tl.to(sectionRefs.current[currentIndex], {
          autoAlpha: 0,
          yPercent: 100,
          zIndex: 0,
        });
        tl.to(
          sectionRefs.current[index],
          { autoAlpha: 1, yPercent: 0, zIndex: 1 },
          "<"
        );
      }

      currentIndex = index;
    };

    Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => !animating && gotoSection(currentIndex - 1, -1),
      onUp: () => !animating && gotoSection(currentIndex + 1, 1),
      tolerance: 10,
      preventDefault: true,
    });
  }, [sectionRefs]);

  return (
    <main>
      {sectionNames.map((sectionName, index) => {
        return (
          <SectionTemplate
            key={sectionName}
            sectionName={sectionName}
            ref={(el) => {
              sectionRefs.current[index] = el as HTMLDivElement;
            }}
          >
            {sectionName}
          </SectionTemplate>
        );
      })}
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
