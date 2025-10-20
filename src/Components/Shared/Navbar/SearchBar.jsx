import { useState, useRef, useEffect } from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { toast } from "react-toastify";
import useProductSearch from "@/hooks/useProductSearch";
import SearchResultsDropdown from "./SearchResultsDropdown";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { parseCategoryCommand, getCategoryDisplayName, getClarificationMessage, getNoProductsInCategoryMessage } from "@/utils/categoryMapping";

export default function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  className = "",
  isMobile = false,
  autoFocus = false,
  enableLiveSearch = true // New prop to control live search
}) {
  const [isListening, setIsListening] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  // Use live search hook (with debouncing)
  const { results, loading, total } = useProductSearch(
    enableLiveSearch ? searchQuery : "",
    300 // 300ms debounce
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show dropdown when there are results or loading
  useEffect(() => {
    if (enableLiveSearch && searchQuery.trim().length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchQuery, enableLiveSearch]);

  // Parse voice commands for navigation (English and Bengali)
  const parseVoiceCommand = async (transcript) => {
    const lowerTranscript = transcript.toLowerCase().trim();

    // FIRST: Check if it's a category-based command (supports English & Bengali)
    const categoryResult = parseCategoryCommand(transcript);
    
    if (categoryResult.category) {
      // User mentioned a category (e.g., "show me electronics", "দেখাও ল্যাপটপ")
      const language = categoryResult.language || 'english';
      const displayName = getCategoryDisplayName(categoryResult.category, language);
      
      // Check if category has products
      try {
        const response = await axiosPublic.get('/products/search', {
          params: { category: categoryResult.category, limit: 1 }
        });
        
        if (response.data.total === 0) {
          // No products in this category
          const noProductsMsg = getNoProductsInCategoryMessage(categoryResult.category, language);
          toast.warning(noProductsMsg);
          setSearchQuery("");
          setShowDropdown(false);
          return true;
        }
      } catch (error) {
        console.error('Category validation error:', error);
      }
      
      // Navigate to category search
      navigate(`/search?category=${encodeURIComponent(categoryResult.category)}`);
      setSearchQuery("");
      setShowDropdown(false);
      
      // Show success message in appropriate language
      const successMsg = language === 'bengali' 
        ? `${displayName} দেখাচ্ছি`
        : `Showing ${displayName}`;
      toast.success(successMsg);
      return true;
    }

    // SECOND: Check standard command patterns
    const commandPatterns = [
      // "Go to [product name]" or "Open [product name]"
      { 
        pattern: /^(?:go\s+to|open)\s+(.+)/i, 
        handler: async (match) => await handleProductOrRouteNavigation(match[1].trim())
      },

      // "Show me [anything]" - now handles both categories and products
      { 
        pattern: /show\s+me\s+(.+)/i, 
        handler: async (match) => {
          const searchTerm = match[1].trim();
          // Already checked category above, so this is a product search
          return await handleProductOrRouteNavigation(searchTerm);
        }
      },
      
      // "Find [anything]" or "Search for [anything]"
      { 
        pattern: /^(?:find|search|search\s+for)\s+(.+)/i, 
        handler: async (match) => {
          const searchTerm = match[1].trim();
          return await handleProductOrRouteNavigation(searchTerm);
        }
      },
    ];

    // Helper function to handle product or route navigation
    async function handleProductOrRouteNavigation(searchTerm) {
      // Check if it's a route first (English only)
      const routeMap = {
        'home': '/',
        'homepage': '/',
        'electronics': '/products/electronics',
        'product': '/allproduct',
        'products': '/allproduct',
        'all products': '/allproduct',
        'cart': '/addToCart',
        'shopping cart': '/addToCart',
        'wishlist': '/wishlist',
        'dashboard': '/dashboard',
        'profile': '/dashboard/my-profile',
        'my profile': '/dashboard/my-profile',
        'my orders': '/dashboard/my-orders',
        'offers': '/offers',
        'settings': '/dashboard/my-settings',
        'admin dashboard': '/dashboard/advanced/home',
      };
      
      // Check for exact route match
      const lowerSearchTerm = searchTerm.toLowerCase();
      if (routeMap[lowerSearchTerm]) {
        navigate(routeMap[lowerSearchTerm]);
        setSearchQuery("");  // Clear search after navigation
        setShowDropdown(false);  // Close dropdown
        toast.success(`Navigating to ${searchTerm}`);
        return true;
      }
      
      // Try partial route match
      for (const [key, route] of Object.entries(routeMap)) {
        if (lowerSearchTerm.includes(key) || key.includes(lowerSearchTerm)) {
          navigate(route);
          setSearchQuery("");  // Clear search after navigation
          setShowDropdown(false);  // Close dropdown
          toast.success(`Navigating to ${key}`);
          return true;
        }
      }
      
      // If not a route, search for product
      try {
        const response = await axiosPublic.get('/products/search', {
          params: { q: searchTerm, limit: 1 }
        });
        
        if (response.data.data && response.data.data.length > 0) {
          const product = response.data.data[0];
          navigate(`/allProduct/${product._id}`);
          setSearchQuery("");  // Clear search after navigation
          setShowDropdown(false);  // Close dropdown
          toast.success(`Opening ${product.name}`);
          return true;
        } else {
          navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
          setSearchQuery("");  // Clear search after navigation
          setShowDropdown(false);  // Close dropdown
          toast.info(`Showing search results for "${searchTerm}"`);
          return true;
        }
      } catch (error) {
        console.error('Voice command product search error:', error);
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        setSearchQuery("");  // Clear search after navigation
        setShowDropdown(false);  // Close dropdown
        return true;
      }
    }

    // Try to match command patterns
    for (const { pattern, handler } of commandPatterns) {
      const match = lowerTranscript.match(pattern);
      if (match) {
        return await handler(match);
      }
    }

    return false; // No command matched
  };

  // Voice input using Web Speech API (English and Bengali)
  const startVoiceInput = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast?.info?.("Voice input not supported in this browser.");
        return;
      }
      const recognition = new SpeechRecognition();
      
      // Support both English and Bengali
      recognition.lang = "en-US"; // Primary language
      recognition.interimResults = false;
      recognition.maxAlternatives = 3; // Get multiple alternatives for better Bengali recognition

      setIsListening(true);

      recognition.onresult = async (event) => {
        // Try all alternatives (helps with Bengali recognition)
        for (let i = 0; i < event.results[0].length; i++) {
          const transcript = event.results[0][i]?.transcript || "";
          if (transcript) {
            setSearchQuery(transcript);
            
            // Try to parse as voice command first
            const isCommand = await parseVoiceCommand(transcript);
            
            if (isCommand) {
              break; // Command processed successfully
            }
          }
        }
        
        // If no command matched from any alternative
        const firstTranscript = event.results?.[0]?.[0]?.transcript || "";
        if (firstTranscript && !await parseVoiceCommand(firstTranscript)) {
          const isBengali = /[\u0980-\u09FF]/.test(firstTranscript);
          const msg = isBengali 
            ? `সার্চ সেভ হয়েছে: "${firstTranscript}". এন্টার চাপুন সার্চ করতে।`
            : `Search saved: "${firstTranscript}". Press Enter to search.`;
          toast.info(msg);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        toast?.error?.("Voice recognition error. Please try again.");
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  // Handle search submission
  const handleSearch = (query = searchQuery) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setShowDropdown(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div ref={searchRef} className={`relative w-full group ${className}`}>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none"
        size={isMobile ? 18 : 20}
      />
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => {
          if (enableLiveSearch && searchQuery.trim()) {
            setShowDropdown(true);
          }
        }}
        placeholder="Search products, brands, categories..."
        className={`w-full ${
          isMobile 
            ? "pl-11 pr-24 h-11 rounded-xl" 
            : "pl-12 pr-24 h-12 rounded-2xl"
        } bg-background border border-border focus-visible:ring-2 focus-visible:ring-primary/30 shadow-sm`}
        autoFocus={autoFocus}
      />
      
      {/* Clear button */}
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSearchQuery("");
            setShowDropdown(false);
          }}
          className="absolute right-12 top-1/2 -translate-y-1/2 h-8 w-8"
          aria-label="Clear search"
        >
          <X size={16} />
        </Button>
      )}

      {/* Mic button with listening indicator */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={startVoiceInput}
          className={`h-9 w-9 ${isListening ? "text-primary animate-pulse" : ""}`}
          aria-label="Voice search"
          disabled={isListening}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-5 h-5"
          >
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 1 1-10 0H5a7 7 0 0 0 6 6.92V20H8v2h8v-2h-3v-2.08A7 7 0 0 0 19 11h-2z" />
          </svg>
        </Button>
      </div>

      {/* Listening indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-5 right-20 flex items-center gap-2 text-xs text-primary font-medium"
          >
            <span className="animate-pulse">🎙️</span>
            <span>Listening...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Search Results Dropdown */}
      {enableLiveSearch && (
        <SearchResultsDropdown
          results={results}
          loading={loading}
          query={searchQuery}
          isOpen={showDropdown}
          onClose={() => setShowDropdown(false)}
          total={total}
        />
      )}
    </div>
  );
}
