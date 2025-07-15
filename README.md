# Gemini Chat Application

A modern, responsive chat application built with React, TypeScript, and Tailwind CSS. This application simulates a Gemini-style conversational AI interface with comprehensive authentication, chatroom management, and real-time messaging features.

## 🚀 Features

### Authentication
- **OTP-based Login/Signup**: Secure authentication using country codes and phone numbers
- **Country Selection**: Dynamic country picker with flags and dial codes from REST Countries API
- **Form Validation**: Comprehensive validation using React Hook Form and Zod
- **Simulated OTP**: Realistic OTP verification flow with loading states

### Dashboard
- **Chatroom Management**: Create, delete, and manage multiple chatrooms
- **Search Functionality**: Debounced search to filter chatrooms by title
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Updates**: Live chatroom statistics and last message preview

### Chat Interface
- **AI Simulation**: Realistic AI responses with typing indicators
- **Message Features**: 
  - Timestamps on all messages
  - Copy-to-clipboard functionality
  - Image upload support (base64 preview)
  - Message pagination (20 messages per page)
- **Reverse Infinite Scroll**: Load older messages seamlessly
- **Auto-scroll**: Automatic scroll to latest messages

### User Experience
- **Dark Mode**: Full dark theme support with system preference detection
- **Toast Notifications**: Contextual feedback for all user actions
- **Loading States**: Skeleton screens and loading indicators
- **Keyboard Navigation**: Full keyboard accessibility support
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API with custom hooks
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Storage**: localStorage for data persistence

## 📱 Component Architecture

### Authentication Components
- `LoginForm`: Phone number input with country selection
- `OTPVerification`: 6-digit OTP input with validation
- `CountrySelector`: Searchable country picker with flags

### Dashboard Components
- `Dashboard`: Main layout with responsive sidebar
- `ChatroomList`: Scrollable list of user chatrooms
- `SearchBar`: Debounced search with clear functionality
- `CreateChatroomModal`: Form modal for creating new chatrooms

### Chat Components
- `ChatInterface`: Main chat view with header
- `MessageList`: Scrollable message container with pagination
- `MessageInput`: Rich text input with image upload
- `TypingIndicator`: Animated typing indicator
- `ImageUpload`: Drag-and-drop image upload component

### Global Components
- `Header`: Navigation bar with user info and theme toggle
- `LoadingSkeleton`: Reusable skeleton screens
- `Toast`: Notification system

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Main actions and highlights
- **Secondary**: Purple (#8B5CF6) - Gradients and accents
- **Accent**: Teal (#14B8A6) - Success states and confirmations
- **Semantic Colors**: Success, warning, and error states

### Typography
- **Font**: Inter with multiple weights (300-900)
- **Hierarchy**: Consistent text sizes and spacing
- **Accessibility**: High contrast ratios and readable fonts

### Animations
- **Micro-interactions**: Hover states and button animations
- **Transitions**: Smooth theme switching and state changes
- **Loading**: Pulse animations and skeleton screens

## 🔧 Context Providers

### AuthContext
- User authentication state
- OTP verification flow
- Login/logout functionality
- Session persistence

### ChatContext
- Chatroom management
- Message handling
- AI response simulation
- Search and pagination

### ThemeContext
- Dark/light mode toggle
- System preference detection
- Theme persistence

### ToastContext
- Notification system
- Auto-dismiss functionality
- Multiple notification types

## 📊 State Management

### Local Storage
- User authentication data
- Chatroom information
- Message history
- Theme preferences

### Context API
- Global state management
- Prop drilling prevention
- Centralized business logic

## 🔒 Security Features

- **Input Validation**: Comprehensive form validation with Zod
- **XSS Prevention**: Sanitized user inputs
- **CSRF Protection**: Secure form handling
- **Data Persistence**: Safe localStorage usage

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading components
- **Memoization**: React.memo and useMemo usage
- **Debouncing**: Search input optimization
- **Virtual Scrolling**: Efficient message rendering
- **Image Optimization**: Base64 preview with compression

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Adaptive Layout**: Collapsible sidebar on mobile
  
**#Technical Architecture**
Project Structure
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── chat/            # Chat interface components
│   ├── dashboard/       # Dashboard components
│   ├── home/            # Home page components
│   └── layout/          # Layout components
├── context/             # React Context providers
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── index.css           # Global styles
└── App.tsx             # Main application component

**#Component Hierarchy**
App
├── ThemeProvider
├── ToastProvider
├── AuthProvider
│   ├── HomePage (unauthenticated)
│   ├── LoginForm
│   ├── OTPVerification
│   └── ChatProvider (authenticated)
│       ├── Header
│       └── Dashboard
│           ├── SearchBar
│           ├── ChatroomList
│           └── ChatInterface
│               ├── MessageList
│               └── MessageInput

## 🔧 Configuration

### Environment Variables
- No external API keys required
- Uses public REST Countries API
- All configuration in code

### Customization
- Modify `tailwind.config.js` for design system changes
- Update `src/types/index.ts` for type definitions
- Customize `src/utils/validation.ts` for form validation

## 🙏 Acknowledgments

- REST Countries API for country data
- Lucide React for beautiful icons
- Tailwind CSS for styling framework
- React Hook Form for form handling
- Zod for schema validation
