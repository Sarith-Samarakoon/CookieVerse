import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white shadow-lg mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="../assets/logo2.png"
              alt="CookieVerse Logo"
              className="h-12 w-12"
            />
            <h1 className="text-xl font-bold text-orange-500 tracking-tight">
              Cookie<span className="text-gray-800">Verse</span>
              <span role="img" aria-label="plate with cutlery" className="ml-1">
                🍽️
              </span>
            </h1>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <a href="/" className="text-sm text-gray-600 hover:text-orange-500">
              Home
            </a>
            <a
              href="/explore"
              className="text-sm text-gray-600 hover:text-orange-500"
            >
              Explore
            </a>
            <a
              href="/profile"
              className="text-sm text-gray-600 hover:text-orange-500"
            >
              Profile
            </a>
            <a
              href="/learning"
              className="text-sm text-gray-600 hover:text-orange-500"
            >
              Learning Plans
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com"
              className="text-gray-600 hover:text-orange-500"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path d="M22 12.5c0-5.2-4.2-9.5-9.5-9.5S3 7.3 3 12.5c0 4.6 3.3 8.5 7.8 9.2V16h-2.3v-3h2.3v-2.3c0-2.2 1.3-3.5 3.4-3.5 1.6 0 3.2.2 3.2.2v3h-2c-1.4 0-1.8.9-1.8 1.8v2.2h3.2l-.5 3H16v5.7c4.5-.7 7.8-4.6 7.8-9.2z" />
              </svg>
            </a>
            <a
              href="https://www.twitter.com"
              className="text-gray-600 hover:text-orange-500"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path d="M23 3a10.7 10.7 0 01-3.1.9c1.1-.7 1.9-1.7 2.3-2.9-1 .6-2.2 1-3.4 1.2a5.6 5.6 0 00-9.6 5.1A16 16 0 012.3 3a5.6 5.6 0 001.7 7.5A5.6 5.6 0 01.9 9.8v.1a5.6 5.6 0 004.5 5.4 5.6 5.6 0 01-2.5.1 5.6 5.6 0 005.3 4a11.3 11.3 0 01-7 2.4A11.6 11.6 0 003 19.1a15.8 15.8 0 008.6 2.5c10.4 0 16.1-8.6 16.1-16.1 0-.2 0-.4-.1-.6A11.2 11.2 0 0023 3z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com"
              className="text-gray-600 hover:text-orange-500"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path d="M12 2.2c3.1 0 3.4 0 4.6.1 1.1 0 1.9.1 2.4.2.6.2 1.1.5 1.5.9.4.4.7.9.9 1.5.2.5.3 1.3.3 2.4V15c0 1.1-.1 1.9-.3 2.4-.2.6-.5 1.1-.9 1.5-.4.4-.9.7-1.5.9-.5.1-1.3.2-2.4.2-1.2 0-1.5 0-2.4-.2-.6-.2-1.1-.5-1.5-.9-.4-.4-.7-.9-.9-1.5-.2-.5-.3-1.3-.3-2.4V8.8c0-1.1.1-1.9.3-2.4.2-.6.5-1.1.9-1.5.4-.4.9-.7 1.5-.9.5-.1 1.3-.2 2.4-.2zm0 1.5c-1.2 0-1.5 0-2.1.1-.5.1-.9.2-1.2.5-.4.4-.5.8-.6 1.2-.1.6-.1.9-.1 2.1v4.8c0 1.2 0 1.5.1 2.1.1.5.2.9.6 1.2.3.3.7.4 1.2.5.6.1.9.1 2.1.1 1.2 0 1.5 0 2.1-.1.5-.1.9-.2 1.2-.5.4-.4.5-.8.6-1.2.1-.6.1-.9.1-2.1V8.8c0-1.2 0-1.5-.1-2.1-.1-.5-.2-.9-.6-1.2-.3-.3-.7-.4-1.2-.5-.5-.1-.8-.1-2.1-.1zm0 3.3c-1.6 0-2.9 1.3-2.9 2.9 0 1.6 1.3 2.9 2.9 2.9 1.6 0 2.9-1.3 2.9-2.9 0-1.6-1.3-2.9-2.9-2.9zm0 4.3c-.8 0-1.5-.7-1.5-1.5 0-.8.7-1.5 1.5-1.5 0 .8-.7 1.5-1.5 1.5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} CookieVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
