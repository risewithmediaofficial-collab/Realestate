import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import { primaryNavLinks } from "../constants/navigation";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BuildingOffice2Icon,
  BriefcaseIcon,
  EnvelopeIcon,
  HomeIcon,
  InformationCircleIcon,
  PhoneIcon,
  PlusCircleIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Squares2X2Icon as Squares2X2SolidIcon } from "@heroicons/react/24/solid";

const navIconMap = {
  "Our Services": BriefcaseIcon,
  "About Us": InformationCircleIcon,
  Contact: PhoneIcon,
  "List My Property": PlusCircleIcon,
};

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

  useBodyScrollLock(mobileMenuOpen);

  const closeMenu = () => setMobileMenuOpen(false);

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

  const onLogout = () => {
    logout();
    closeMenu();
    scrollToTop();
    navigate("/");
  };

  const navLinks = useMemo(() => primaryNavLinks, []);

  const renderDesktopLink = (item) => (
    <NavLink
      key={item.to}
      to={item.to}
      onClick={scrollToTop}
      className={({ isActive }) =>
        `relative inline-flex items-center px-3 py-2 text-sm font-semibold transition ${
          isActive ? "text-orange" : "text-navy hover:text-orange"
        }`
      }
    >
      {item.label}
    </NavLink>
  );

  const renderMobileLink = (item) => {
    const Icon = navIconMap[item.label] || HomeIcon;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={() => {
          scrollToTop();
          closeMenu();
        }}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
            isActive ? "bg-orange/10 text-orange" : "text-navy hover:bg-surface"
          }`
        }
      >
        <Icon className="h-5 w-5" />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-navy text-white sm:block">
        <div className="mx-auto flex max-w-[1440px] items-center px-5 py-2.5 text-xs sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <a href="tel:+919876543210" className="inline-flex items-center gap-2 transition hover:text-orange">
              <PhoneIcon className="h-3.5 w-3.5 flex-shrink-0 text-orange" />
              +91 98765 43210
            </a>
            <a href="mailto:support@myhosurproperty.com" className="inline-flex items-center gap-2 transition hover:text-orange">
              <EnvelopeIcon className="h-3.5 w-3.5 flex-shrink-0 text-orange" />
              support@myhosurproperty.com
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-3 sm:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4">
            <NavLink
              to="/"
              onClick={() => {
                scrollToTop();
                closeMenu();
              }}
              className="inline-flex min-w-0 items-center gap-3"
            >
              <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy text-white">
                <BuildingOffice2Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-extrabold tracking-tight">
                  <span className="text-navy">MyHosur</span>
                  <span className="text-orange">Property</span>
                </p>
                <p className="hidden truncate text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:block">
                  Real Estate
                </p>
              </div>
            </NavLink>

            <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">{navLinks.map(renderDesktopLink)}</nav>

            <div className="hidden items-center gap-2 lg:flex">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-navy transition hover:text-orange"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/auth"
                    onClick={scrollToTop}
                    className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-navy transition hover:text-orange"
                  >
                    Login
                  </NavLink>
                  <span className="text-slate-300" aria-hidden="true">
                    |
                  </span>
                  <NavLink
                    to="/auth"
                    onClick={scrollToTop}
                    className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-navy transition hover:text-orange"
                  >
                    Register
                  </NavLink>
                </>
              )}

              <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden="true" />

              <NavLink
                to={dashboardPath}
                onClick={scrollToTop}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "text-orange" : "text-navy hover:text-orange"
                  }`
                }
              >
                {({ isActive }) => {
                  const DashboardIcon = isActive ? Squares2X2SolidIcon : Squares2X2Icon;
                  return (
                    <>
                      <DashboardIcon className="h-4 w-4" />
                      Dashboard
                    </>
                  );
                }}
              </NavLink>

              <NavLink
                to="/listings"
                onClick={scrollToTop}
                className="inline-flex items-center rounded-lg bg-orange px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-hover"
              >
                Browse Listings
              </NavLink>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              {!isAuthenticated ? (
                <NavLink
                  to="/auth"
                  onClick={scrollToTop}
                  className="hidden items-center rounded-lg px-3 py-2 text-xs font-semibold text-navy transition hover:text-orange xs:inline-flex sm:text-sm"
                >
                  Login
                </NavLink>
              ) : null}
              <button
                type="button"
                className="inline-flex rounded-lg border border-slate-200 p-2 text-navy transition hover:bg-surface"
                onClick={() => setMobileMenuOpen((value) => !value)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="border-b border-slate-200 bg-white px-4 pb-4 lg:hidden">
          <div className="mx-auto max-h-[calc(100dvh-5rem)] max-w-[1440px] overflow-y-auto py-3">
            <nav className="flex flex-col gap-1">{navLinks.map(renderMobileLink)}</nav>
            <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
              <NavLink
                to={dashboardPath}
                onClick={() => {
                  scrollToTop();
                  closeMenu();
                }}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-navy"
              >
                <Squares2X2Icon className="h-5 w-5" />
                Dashboard
              </NavLink>
              <NavLink
                to="/listings"
                onClick={() => {
                  scrollToTop();
                  closeMenu();
                }}
                className="flex items-center justify-center rounded-lg bg-orange px-4 py-3 text-sm font-bold text-white"
              >
                Browse Listings
              </NavLink>
              {!isAuthenticated ? (
                <NavLink
                  to="/auth"
                  onClick={() => {
                    scrollToTop();
                    closeMenu();
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Sign in / Create account
                </NavLink>
              ) : (
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-navy"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
