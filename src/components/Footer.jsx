import { NavLink } from "react-router-dom";
import { primaryNavLinks } from "../constants/navigation";
import { BuildingOffice2Icon, EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";

const serviceLinks = [
  { label: "Our Services", to: "/services" },
  { label: "Contact", to: "/contact" },
  { label: "Buy Property in Hosur", to: "/listings?intent=buy" },
  { label: "Rent Property in Hosur", to: "/listings?intent=rent" },
  { label: "New Projects in Hosur", to: "/listings?intent=new-project" },
  { label: "Post Property Listing", to: "/post-property" },
  { label: "About MyHosurProperty", to: "/about" },
];

const scrollToTop = () => {
  const htmlElement = document.documentElement;
  const originalScroll = htmlElement.style.scrollBehavior;
  htmlElement.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  setTimeout(() => {
    htmlElement.style.scrollBehavior = originalScroll;
  }, 50);
};

const Footer = () => (
  <footer className="bg-navy text-white">
    <div className="px-5 py-12 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.8fr_0.9fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange text-white">
                <BuildingOffice2Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-extrabold tracking-tight">
                  MyHosur<span className="text-orange">Property</span>
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">Professional platform</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/70">
              A refined property platform for verified listings, clearer property discovery, and reliable buyer-owner communication in Hosur.
            </p>
            <p className="text-sm font-semibold text-orange">My Hosur Property - Trusted Real Estate Partner</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-orange">Navigation</h4>
            <nav className="flex flex-col gap-3">
              {primaryNavLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={scrollToTop} className="text-sm text-white/70 transition hover:text-orange">
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-orange">Services</h4>
            <nav className="flex flex-col gap-3" aria-label="Footer services">
              {serviceLinks.map((service) => (
                <NavLink key={service.to} to={service.to} onClick={scrollToTop} className="text-sm text-white/70 transition hover:text-orange">
                  {service.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-orange">Contact</h4>
            <div className="space-y-4 text-sm text-white/70">
              <a href="mailto:support@myhosurproperty.com" className="flex items-start gap-3 transition hover:text-orange">
                <EnvelopeIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange" />
                <span>support@myhosurproperty.com</span>
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 transition hover:text-orange">
                <PhoneIcon className="h-4 w-4 flex-shrink-0 text-orange" />
                <span>+91 98765 43210</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange" />
                <span>Hosur, Krishnagiri District, Tamil Nadu 635109, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 MyHosurProperty. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <NavLink to="/about" onClick={scrollToTop} className="transition hover:text-orange">
              About Us
            </NavLink>
            <NavLink to="/contact" onClick={scrollToTop} className="transition hover:text-orange">
              Contact
            </NavLink>
            <NavLink to="/listings" onClick={scrollToTop} className="transition hover:text-orange">
              Browse Listings
            </NavLink>
            <NavLink to="/auth" onClick={scrollToTop} className="transition hover:text-orange">
              Sign In
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
