import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, ChevronDownIcon } from "./AppIcons";

const localitiesData = {
  "Main Localities": [
    "Hosur City",
    "Jeemangalam",
    "Mathigiri",
    "Anthivadi",
    "Belagondapalli",
    "Nagondapalli",
    "Agondapalli",
    "Uddanapalli",
    "Bathalapalli",
    "Perandapalli",
    "Barandhur",
  ],
  "Nearby Areas": [
    "Kamandoddi",
    "Shoolagiri",
    "Bagalur",
    "Berigai",
    "Denkanikottai",
    "Kelamangalam",
    "Thally",
    "Anchetty",
    "Rayakottai",
  ],
};

const LocalityDropdown = ({ value, onChange, onSelect, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Filter localities based on search query
  const filteredLocalities = Object.entries(localitiesData).reduce(
    (acc, [category, items]) => {
      const filtered = items.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {}
  );

  const totalResults = Object.values(filteredLocalities).reduce(
    (sum, items) => sum + items.length,
    0
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !triggerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const handleSelectLocality = (locality) => {
    onChange(locality);
    onSelect?.(locality);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${isOpen ? "z-30" : "z-10"}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border-2 bg-white px-4 py-3 transition duration-200 ${
          isOpen
            ? "border-orange bg-orange/5 ring-2 ring-orange/20"
            : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="flex items-center gap-3 min-w-0 flex-1">
          <svg
            className={`h-5 w-5 flex-shrink-0 transition ${
              isOpen ? "text-orange" : "text-slate-400"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <span className={`truncate text-sm font-medium ${
            value ? "text-navy" : "text-slate-500"
          }`}>
            {value || "Search or select locality..."}
          </span>
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-orange" : "text-slate-400"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full mt-3 w-full rounded-xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Search Input */}
            <div className="border-b border-slate-100 p-4 sticky top-0 bg-white rounded-t-xl backdrop-blur-sm bg-white/95">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search localities..."
                  className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm font-medium text-navy outline-none transition duration-200 placeholder:text-slate-400 focus:border-orange focus:bg-white focus:ring-2 focus:ring-orange/20"
                  autoFocus
                />
              </div>
            </div>

            {/* Dropdown Content */}
            <div className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {totalResults > 0 ? (
                <div className="py-2">
                  {Object.entries(filteredLocalities).map(
                    ([category, localities], categoryIndex) => (
                      <div key={category}>
                        {categoryIndex > 0 && (
                          <div className="my-1 border-t border-slate-100" />
                        )}
                        <div className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {category}
                        </div>
                        <div className="space-y-0.5 px-2">
                          {localities.map((locality, index) => (
                            <motion.button
                              key={locality}
                              type="button"
                              onClick={() => handleSelectLocality(locality)}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02 }}
                              className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 transition duration-150 hover:bg-gradient-to-r hover:from-orange/10 hover:to-transparent hover:text-orange active:scale-95 group"
                            >
                              <span className="flex items-center gap-3 min-w-0 flex-1">
                                <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange flex-shrink-0 transition duration-200 group-hover:scale-150 group-hover:bg-orange" />
                                <span className="truncate text-sm">{locality}</span>
                              </span>
                              {value === locality && (
                                <div className="flex-shrink-0 ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange/10">
                                  <CheckIcon className="h-3.5 w-3.5 text-orange" />
                                </div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-lg">🔍</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    No localities found
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocalityDropdown;
