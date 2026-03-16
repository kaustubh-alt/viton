# Virtual Cloth Assistant

A web application that allows users to virtually try on clothes using AI technology.

## Features

- Upload model images
- Upload clothing items
- Generate virtual try-on previews
- User authentication
- Responsive design

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/virtualclothassistant.git
cd virtualclothassistant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Replace placeholder values with your actual API keys
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

## Environment Variables

This project uses environment variables to store sensitive information like API keys. To set up your environment:

1. Create a `.env` file in the project root (use `.env.example` as a template)
2. Add your API keys and other configuration values
3. The `.env` file is ignored by Git to keep your keys secure

Example `.env` file:
```
REACT_APP_API_KEY=your_api_key_here
REACT_APP_API_URL=your_api_url_here
REACT_APP_ENV=development
```

## Usage

1. Register a new account or log in
2. Upload a model image (a full-body photo)
3. Upload a clothing item image
4. Click "Generate Try-On" to see the result
5. Download or share the generated image

## Technologies Used

- React.js
- Material-UI
- React Router
- Context API for state management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors
- Inspired by virtual try-on technologies 