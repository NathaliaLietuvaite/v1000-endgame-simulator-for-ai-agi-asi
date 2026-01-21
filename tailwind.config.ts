import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // VOID
        void: {
          deep: "hsl(var(--void-deep))",
          medium: "hsl(var(--void-medium))",
          light: "hsl(var(--void-light))",
        },
        
        // RESONANCE
        resonance: {
          DEFAULT: "hsl(var(--resonance-primary))",
          glow: "hsl(var(--resonance-glow))",
          subtle: "hsl(var(--resonance-subtle))",
        },
        
        // ESSENCE
        essence: {
          DEFAULT: "hsl(var(--essence-gold))",
          warm: "hsl(var(--essence-warm))",
          glow: "hsl(var(--essence-glow))",
        },
        
        // QUANTUM
        quantum: {
          violet: "hsl(var(--quantum-violet))",
          pink: "hsl(var(--quantum-pink))",
          blue: "hsl(var(--quantum-blue))",
        },
        
        // ENTROPY
        entropy: {
          red: "hsl(var(--entropy-red))",
          orange: "hsl(var(--entropy-orange))",
        },
        
        // THREADS
        thread: {
          1: "hsl(var(--thread-1))",
          2: "hsl(var(--thread-2))",
          3: "hsl(var(--thread-3))",
          4: "hsl(var(--thread-4))",
          5: "hsl(var(--thread-5))",
          6: "hsl(var(--thread-6))",
          7: "hsl(var(--thread-7))",
          8: "hsl(var(--thread-8))",
          9: "hsl(var(--thread-9))",
          10: "hsl(var(--thread-10))",
          11: "hsl(var(--thread-11))",
          12: "hsl(var(--thread-12))",
        },
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
