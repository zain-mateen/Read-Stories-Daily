import type { Metadata } from "next";
import {
  Clock,
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  MapPinLine,
  Phone,
  TwitterLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/ssr";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Read Stories Daily team.",
};

const infoCards = [
  {
    icon: EnvelopeSimple,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: site.phone,
    href: `tel:${site.phone.replace(/[^+\d]/g, "")}`,
  },
  {
    icon: MapPinLine,
    label: "Studio",
    value: site.address,
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Fri, 9am – 5pm PT",
  },
];

const socialLinks = [
  { label: "Instagram", href: site.social.instagram, icon: InstagramLogo },
  { label: "Twitter", href: site.social.twitter, icon: TwitterLogo },
  { label: "Facebook", href: site.social.facebook, icon: FacebookLogo },
  { label: "YouTube", href: site.social.youtube, icon: YoutubeLogo },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-charcoal-700/10 bg-beige-100/50 py-14 sm:py-16">
        <Container>
          <span className="text-xs font-semibold uppercase tracking-widest text-rust-600">
            Get in Touch
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-charcoal-800 sm:text-4xl">
            We&apos;d love to hear from you.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-charcoal-400">
            Story ideas, partnership inquiries, or just want to say hello —
            drop us a line and we&apos;ll get back to you shortly.
          </p>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 gap-10 py-14 sm:py-16 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {infoCards.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-3.5 rounded-2xl border border-charcoal-700/10 bg-beige-100/60 p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-700 text-beige-50">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-300">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-medium text-charcoal-700 transition-colors hover:text-rust-600"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-charcoal-700">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-charcoal-300">
                Follow along
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-700/15 text-charcoal-600 transition-colors hover:border-rust-400 hover:text-rust-600"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-charcoal-700/10 bg-beige-100/40 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-charcoal-800">
              Send a message
            </h2>
            <p className="mt-1 mb-6 text-sm text-charcoal-400">
              Fill out the form and our team will get back to you shortly.
            </p>
            <ContactForm />
          </div>
        </div>
      </Container>
    </>
  );
}
