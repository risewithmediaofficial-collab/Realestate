import { Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import PageLoader from "./components/PageLoader";
import { PrivateRouteSeo } from "./components/SeoHead";
import ProtectedRoute from "./components/ProtectedRoute";
import useLowMotionDevice from "./hooks/useLowMotionDevice";
import { lazyRoute, preloadLazyRoutes } from "./utils/lazyRoute";

const HomePage = lazyRoute(() => import("./pages/HomePage"));
const AboutPage = lazyRoute(() => import("./pages/AboutPage"));
const ContactPage = lazyRoute(() => import("./pages/ContactPage"));
const ServicesPage = lazyRoute(() => import("./pages/ServicesPage"));
const ListingPage = lazyRoute(() => import("./pages/ListingPage"));
const PropertyDetailPage = lazyRoute(
  () => import("./pages/PropertyDetailPage"),
);
const AuthPage = lazyRoute(() => import("./pages/AuthPage"));
const AdminLoginPage = lazyRoute(() => import("./pages/AdminLoginPage"));
const DashboardRouterPage = lazyRoute(
  () => import("./pages/DashboardRouterPage"),
);
const AdminDashboardPage = lazyRoute(
  () => import("./pages/AdminDashboardPage"),
);
const PostPropertyPage = lazyRoute(() => import("./pages/PostPropertyPage"));
const EditPropertyPage = lazyRoute(() => import("./pages/EditPropertyPage"));
const PlansPage = lazyRoute(() => import("./pages/PlansPage"));
const ServiceRequestPage = lazyRoute(
  () => import("./pages/ServiceRequestPage"),
);
const BankLoansPage = lazyRoute(() => import("./pages/BankLoansPage"));
const NotFoundPage = lazyRoute(() => import("./pages/NotFoundPage"));

// Pages that manage their own full-height layout (sidebars etc.)
const FULL_HEIGHT_PATHS = [
  "/listings",
  "/dashboard",
  "/admin/dashboard",
  "/auth",
  "/admin/login",
];
const PRIVATE_PATHS = [
  "/auth",
  "/dashboard",
  "/admin",
  "/post-property",
  "/edit-property",
  "/plans",
  "/request-service",
];

const RouteFallback = () => <Loader text="Loading page..." size={44} />;

const pageTransition = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

// Disable browser scroll restoration so refreshing always starts at the top
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const idleCallback = (callback, timeout = 1200) => {
  if (typeof window === "undefined") return () => {};
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(callback, timeout);
  return () => window.clearTimeout(id);
};

const AppShell = () => {
  const location = useLocation();
  const lowMotionDevice = useLowMotionDevice();
  const isFullHeight = FULL_HEIGHT_PATHS.some((p) =>
    location.pathname.startsWith(p),
  );
  const isPrivatePath = PRIVATE_PATHS.some((p) =>
    location.pathname.startsWith(p),
  );
  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin/dashboard");
  const isListingsRoute = location.pathname.startsWith("/listings");
  const isHomeRoute = location.pathname === "/";

  useEffect(() => {
    return idleCallback(() => {
      import("./services/emailService")
        .then(({ initEmailJs }) => initEmailJs())
        .catch(() => {});
    }, 600);
  }, []);

  useEffect(
    () =>
      idleCallback(() => {
        preloadLazyRoutes([
          AboutPage.preload,
          ContactPage.preload,
          ServicesPage.preload,
          ListingPage.preload,
          AuthPage.preload,
          PlansPage.preload,
        ]);
      }, 1600),
    [],
  );

  useEffect(() => {
    document.documentElement.classList.toggle("low-motion-ui", lowMotionDevice);
    return () => document.documentElement.classList.remove("low-motion-ui");
  }, [lowMotionDevice]);

  // Listings uses an internal scroll panel; lock document scroll so mobile can pan results
  useEffect(() => {
    if (!isListingsRoute) return undefined;

    const { documentElement, body } = document;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      documentElement.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [isListingsRoute]);

  // Scroll to top on initial load/refresh AND on every route change
  // (skip listings — it scrolls inside its own results panel)
  useEffect(() => {
    if (isListingsRoute) return;

    const htmlElement = document.documentElement;
    const originalScroll = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = "auto";

    // Scroll immediately (handles most cases)
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Also fire on the next animation frame in case the browser tries to
    // restore scroll position asynchronously after initial paint
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    setTimeout(() => {
      htmlElement.style.scrollBehavior = originalScroll;
    }, 50);

    return () => cancelAnimationFrame(raf);
  }, [location.pathname, isListingsRoute]);

  const hideNavbar = ["/admin/login"].some((p) =>
    location.pathname.startsWith(p),
  );
  const hideFooter =
    ["/auth", "/admin/login"].some((p) => location.pathname.startsWith(p)) ||
    isDashboardRoute ||
    isListingsRoute;

  return (
    <MotionConfig reducedMotion={lowMotionDevice ? "always" : "never"}>
      <div
        className={`site-app-shell flex min-h-screen flex-col ${isDashboardRoute ? "site-dashboard-app md:h-screen md:overflow-hidden" : ""} ${isListingsRoute ? "site-listings-active h-dvh max-h-dvh overflow-hidden" : ""}`}
      >
        <PageLoader />
        <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
        {isPrivatePath ? <PrivateRouteSeo title="Account" /> : null}
        {!hideNavbar && <Navbar />}
        <main
          className={`flex-1 ${isFullHeight || hideNavbar ? "" : isHomeRoute ? "pb-0" : isListingsRoute ? "" : location.pathname.startsWith("/auth") ? "pb-0" : "pt-4 pb-12 md:pt-6"} ${isListingsRoute ? "flex min-h-0 flex-col overflow-hidden" : ""} ${isDashboardRoute ? "flex min-h-0 flex-col overflow-hidden" : ""}`}
        >
          <Suspense fallback={<RouteFallback />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={lowMotionDevice ? undefined : pageTransition}
                initial={lowMotionDevice ? false : "initial"}
                animate={lowMotionDevice ? false : "animate"}
                exit={lowMotionDevice ? undefined : "exit"}
                className={
                  isListingsRoute || isDashboardRoute
                    ? "flex h-full min-h-0 flex-1 flex-col"
                    : ""
                }
              >
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/bank-loans" element={<BankLoansPage />} />
                  <Route path="/listings" element={<ListingPage />} />
                  <Route
                    path="/property/:id/:slug?"
                    element={<PropertyDetailPage />}
                  />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route
                    path="/adminlogin"
                    element={<Navigate to="/admin/login" replace />}
                  />
                  <Route
                    path="/admin"
                    element={<Navigate to="/admin/login" replace />}
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardRouterPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute roles={["admin"]}>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/plans"
                    element={
                      <ProtectedRoute>
                        <PlansPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/request-service"
                    element={
                      <ProtectedRoute>
                        <ServiceRequestPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/post-property"
                    element={
                      <ProtectedRoute>
                        <PostPropertyPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-property/:id"
                    element={
                      <ProtectedRoute>
                        <EditPropertyPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
        {!hideFooter && <Footer />}
      </div>
    </MotionConfig>
  );
};

const App = () => (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

export default App;
