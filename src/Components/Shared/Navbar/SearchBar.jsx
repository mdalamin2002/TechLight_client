import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { toast } from "react-toastify";

export default function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  className = "",
  isMobile = false,
  autoFocus = false 
}) {
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  // Parse voice commands for navigation
  const parseVoiceCommand = (transcript) => {
    const lowerTranscript = transcript.toLowerCase().trim();

    // Voice command patterns
    const commandPatterns = [
      // "Go to [page]" commands
      { pattern: /go\s+to\s+(.+)/i, handler: (match) => {
        const destination = match[1].trim();
        
        // Map common destinations to routes
        const routeMap = {
          'home': '/',
          'homepage': '/',
          'electronics': '/products/electronics',
          'product': '/products',
          'products': '/products',
          'laptops': '/products/category/laptops',
          'laptop': '/products/category/laptops',
          'smartphones': '/smartphones',
          'smartphone': '/smartphones',
          'tablets': '/tablets',
          'tablet': '/tablets',
          'cart': '/addToCart',
          'shopping cart': '/addToCart',
          'wishlist': '/wishlist',
          'dashboard': '/dashboard',
          'profile': '/dashboard/my-profile',
          'my profile': '/dashboard/my-profile',
          'offers': '/offers',
          'headphones': '/headphones',
          'earbuds': '/earbuds',
          'speakers': '/speakers',
        };

        // Check for exact match first
        if (routeMap[destination]) {
          navigate(routeMap[destination]);
          toast.success(`Navigating to ${destination}`);
          return true;
        }

        // Try partial match for flexibility
        for (const [key, route] of Object.entries(routeMap)) {
          if (destination.includes(key) || key.includes(destination)) {
            navigate(route);
            toast.success(`Navigating to ${key}`);
            return true;
          }
        }

        // No match found
        toast.info(`No route found for "${destination}". Try saying "Go to products" or "Go to cart"`);
        return false;
      }},

      // "Show me [category]" commands
      { pattern: /show\s+me\s+(.+)/i, handler: (match) => {
        const category = match[1].trim();
        navigate(`/products/${category.replace(/\s+/g, '-')}`);
        toast.success(`Showing ${category}`);
        return true;
      }},

      // "Open [page]" commands
      { pattern: /open\s+(.+)/i, handler: (match) => {
        const destination = match[1].trim();
        if (destination.includes('cart')) {
          navigate('/addToCart');
          toast.success('Opening cart');
          return true;
        }
        if (destination.includes('wishlist')) {
          navigate('/wishlist');
          toast.success('Opening wishlist');
          return true;
        }
        return false;
      }},
    ];

    // Try to match command patterns
    for (const { pattern, handler } of commandPatterns) {
      const match = lowerTranscript.match(pattern);
      if (match) {
        return handler(match);
      }
    }

    return false; // No command matched
  };

  // Voice input using Web Speech API
  const startVoiceInput = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast?.info?.("Voice input not supported in this browser.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || "";
        if (transcript) {
          setSearchQuery(transcript);
          
          // Try to parse as voice command first
          const isCommand = parseVoiceCommand(transcript);
          
          // If not a command, just store the search query
          // (Auto-search disabled until /search page is implemented)
          if (!isCommand) {
            toast.info(`Search saved: "${transcript}". Press Enter to search when ready.`);
            // TODO: Uncomment when /search page is ready
            // handleSearch(transcript);
          }
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
  // TODO: Re-enable when /search page is implemented
  const handleSearch = (query = searchQuery) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      // TEMPORARILY DISABLED - Search page not yet implemented
      // navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      
      toast.info(`Search feature coming soon! Query: "${trimmedQuery}"`);
      console.log('Search query:', trimmedQuery);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // Temporarily disabled until search page is ready
      handleSearch();
    }
  };

  return (
    <div className={`relative w-full group ${className}`}>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none"
        size={isMobile ? 18 : 20}
      />
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
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
          onClick={() => setSearchQuery("")}
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
            className="absolute -bottom-8 left-0 flex items-center gap-2 text-xs text-primary font-medium"
          >
            <span className="animate-pulse">🎙️</span>
            <span>Listening...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
