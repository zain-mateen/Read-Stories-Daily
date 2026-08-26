import Link from "next/link";
import {
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  MapPinLine,
  Phone,
  TwitterLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/ssr";
import Container from "@/components/ui/Container";
import NewsletterForm from "@/components/ui/NewsletterForm";
import Logo from "./Logo";
import { categories } from "@/data/categories";
import { footerPages, site } from "@/data/site";

const socialLinks = [
  { label: "Instagram", href: site.social.instagram, icon: InstagramLogo },
  { label: "Twitter", href: site.social.twitter, icon: TwitterLogo },
  { label: "Facebook", href: site.social.facebook, icon: FacebookLogo },
  { label: "YouTube", href: site.social.youtube, icon: YoutubeLogo },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-700 text-beige-200">
      <div className="border-b border-beige-50/10">
        <Container className="flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-xl font-semibold text-beige-50 sm:text-2xl">
              Never miss a story.
            </h3>
            <p className="mt-1 text-sm text-beige-200/70">
              One email a week — no noise, just the stories worth your time.
            </p>
          </div>
          <NewsletterForm />
        </Container>
      </div>

      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Logo dark />
          <p className="max-w-xs text-sm leading-relaxed text-beige-200/70">
            {site.description}
          </p>
          <div className="flex items-center gap-3 pt-1">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-beige-50/15 text-beige-100 transition-colors hover:border-rust-400 hover:text-rust-400"
              >
                <Icon size={16} weight="regular" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-beige-50">
            Pages
          </h4>
          <ul className="mt-4 flex flex-col gap-3">
            {footerPages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="text-sm text-beige-200/70 transition-colors hover:text-rust-400"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-beige-50">
            Categories
          </h4>
          <ul className="mt-4 flex flex-col gap-3">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-sm text-beige-200/70 transition-colors hover:text-rust-400"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-beige-50">
            Contact Us
          </h4>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-beige-200/70">
            <li className="flex items-start gap-2.5">
              <EnvelopeSimple size={17} className="mt-0.5 shrink-0 text-rust-400" />
              <a
                href={`mailto:${site.email}`}
                className="transition-colors hover:text-rust-400"
              >
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone size={17} className="mt-0.5 shrink-0 text-rust-400" />
              <a
                href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                className="transition-colors hover:text-rust-400"
              >
                {site.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPinLine size={17} className="mt-0.5 shrink-0 text-rust-400" />
              <span>{site.address}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-beige-50/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-beige-200/60 sm:flex-row">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p>Designed for people who still like to read.</p>
        </Container>
      </div>
    </footer>
  );
}
