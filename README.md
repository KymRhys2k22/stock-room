# Stock Room 202

A modern inventory management interface for browsing and managing stock items. Built with React, Vite, and Tailwind CSS.

## Features

- **Product Listing**: Browse products with a clean, responsive UI.
- **Search Functionality**: Real-time filtering by Product Name, SKU, UPC, or Fixture location.
- **Product Details**: View detailed information including price, quantity, department, and stock status in a modal.
- **Smart Image Handling**:
  - Automatic fallback system: Original Image → Cloudinary → Placeholder.
  - Prevents broken image icons and flickering.
- **Image Upload**: Directly upload product images to Cloudinary from the product details modal.
- **Live Data**: Fetches real-time inventory data from Google Sheets.

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Backend/Data**: Google Sheets (via [opensheet.elk.sh](https://opensheet.elk.sh))
- **Image Hosting**: Cloudinary

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd stock-room
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   To expose the server to your local network:

   ```bash
   npm run host
   ```

## Configuration

### Cloudinary Setup

The application uses Cloudinary for image hosting. The configuration is currently located in `src/components/ProductModal.jsx`.

- **Cloud Name**: `dqtldfxeh`
- **Upload Preset**: `daisoimage` (Unsigned)

### Data Source

Product data is fetched from a public Google Sheet:
`https://opensheet.elk.sh/1sZuuC4o44rh-yRYaeeRFRo4HeOhMj6x6y4ux96D5nok/Master`

## Project Structure

```
src/
├── components/
│   ├── CloudinaryImageUploader.jsx  # Standalone uploader component
│   ├── FAB.jsx                      # Floating Action Button
│   ├── Header.jsx                   # App Header
│   ├── ProductCard.jsx              # Individual product display card
│   ├── ProductModal.jsx             # Product details & image upload modal
│   ├── SearchBar.jsx                # Search input component
│   └── SkeletonLoader.jsx           # Loading state placeholder
├── utils/
│   └── helpers.js                   # Utility functions (e.g., status colors)
├── App.jsx                          # Main application component
├── main.jsx                         # Entry point
└── index.css                        # Global styles & Tailwind directives
```

## Usage

1. **Browsing**: Scroll through the list to view all products.
2. **Searching**: Use the search bar at the top to find specific items.
3. **Viewing Details**: Click on any product card to open the details modal.
4. **Uploading Images**:
   - If a product has no image, a placeholder will be shown.
   - Click the "Upload Image" button overlay on the placeholder.
   - Select an image to upload it directly to Cloudinary (linked via UPC).

## License

[MIT](LICENSE)
