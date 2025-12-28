/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
        "!./node_modules/**"
    ],
    theme: {
    	extend: {
    		colors: {
    			wic: {
    				primary: '#3F632F',
    				secondary: '#5C8D44',
    				accent: '#86EFAC',
    				bg: '#F8FAFC',
    				surface: '#FFFFFF',
    				text: '#1E293B'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		fontFamily: {
    			sans: [
    				'Inter',
    				'system-ui',
    				'sans-serif'
    			],
    			calligraphy: [
    				'草檀斋毛泽东字体',
    				'MaoZedong',
    				'STKaiti',
    				'KaiTi',
    				'serif'
    			]
    		},
    		animation: {
    			float: 'float 6s ease-in-out infinite',
    			'pulse-ring': 'pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		},
    		keyframes: {
    			float: {
    				'0%, 100%': {
    					transform: 'translateY(0)'
    				},
    				'50%': {
    					transform: 'translateY(-10px)'
    				}
    			},
    			'pulse-ring': {
    				'0%': {
    					transform: 'scale(0.33)',
    					opacity: '1'
    				},
    				'80%, 100%': {
    					transform: 'scale(1)',
    					opacity: '0'
    				}
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
}
