import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects your information.`,
};

export default function PrivacyPage() {
  return (
    <>
      <section className="border-b border-charcoal-700/10 bg-beige-100/50 py-14 sm:py-16">
        <Container>
          <span className="text-xs font-semibold uppercase tracking-widest text-rust-600">
            Legal
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-charcoal-800 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-charcoal-400">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </Container>
      </section>

      <Container>
        <div className="mx-auto max-w-3xl py-12 sm:py-14">
          <div className="flex flex-col gap-8 text-base leading-relaxed text-charcoal-500">
            <p>
              This policy explains what information {site.name} collects when
              you visit, and how it&apos;s used. It&apos;s a starting template —
              replace the specifics below with what&apos;s actually true for
              your setup once analytics, ads, and any other services are in
              place.
            </p>

            <div>
              <h2 className="mb-2 font-display text-xl font-semibold text-charcoal-800">
                Information we collect
              </h2>
              <p>
                Basic, non-identifying analytics (pages visited, general
                location, device type) may be collected automatically to
                understand how the site is used. If you subscribe to the
                newsletter, we collect the email address you provide.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-xl font-semibold text-charcoal-800">
                Advertising
              </h2>
              <p>
                This site displays ads served by third-party advertising
                partners, including Monetag. These partners may use cookies
                and similar technologies to serve ads based on your prior
                visits to this or other websites. You can opt out of
                personalized advertising through your browser settings or
                the advertising partner&apos;s own opt-out tools.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-xl font-semibold text-charcoal-800">
                Cookies
              </h2>
              <p>
                Cookies are used to keep the site functioning smoothly and,
                where applicable, to support the advertising described
                above. You can disable cookies in your browser, though some
                parts of the site may not work as intended if you do.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-xl font-semibold text-charcoal-800">
                Contact
              </h2>
              <p>
                Questions about this policy can be sent to{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="font-medium text-charcoal-700 underline decoration-charcoal-300 underline-offset-2 hover:text-rust-600"
                >
                  {site.email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
