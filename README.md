# Terraform State File Generator

A modern web application that enables users to generate Terraform state files for cloud infrastructure across AWS, GCP, and Azure.

## Project Overview

This application helps users generate Terraform state files for their cloud infrastructure by selecting:
- Cloud provider (AWS, GCP, Azure)
- Regions
- Resource types
- Number of resources to generate
- Whether to include connections between resources

The generated state file can be viewed in the browser and downloaded as a `terraform.tfstate` file.

## Features

- Interactive cloud provider selection
- Region selection for each provider
- Resource type filtering and selection
- Configurable resource generation count
- Option to include resource connections
- Instant preview of generated state file
- Download functionality for state files

## Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework with app router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Headless UI](https://headlessui.com/) & [Radix UI](https://www.radix-ui.com/) - UI components

## Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/statefile-generator.git
   cd statefile-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

## Development

Run the development server with:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The application uses Turbopack for faster development builds. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

Start the production server:

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

## Linting

Run linting:

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
# or
bun lint
```

## Project Structure

```
statefile-generator/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── data/           # Static data files
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Core application logic
│   │   ├── providers/  # Cloud provider implementations
│   │   ├── resource-handlers/ # Resource type handlers
│   │   └── utils/      # Utility functions
│   ├── styles/         # Global styles
│   └── types/          # TypeScript type definitions
└── ...
```

## Usage Guide

1. Select a cloud provider (AWS, GCP, or Azure)
2. Choose one or more regions
3. Specify whether to include connections between resources
4. Select the resource types you want to generate
5. Set the total number of resources to generate
6. Click "Generate State File" to create the Terraform state
7. Preview the generated state file in the application
8. Click "Download" to save the state file to your computer

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
