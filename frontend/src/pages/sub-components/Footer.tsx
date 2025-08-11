import { Mail, Phone, Facebook, Instagram, Linkedin, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 dark:bg-neutral-900 w-full">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Personal Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Himansu</h2>
            <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-2">
              <Mail size={18} /> patrahimansuranjan@example.com
            </p>
            <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Phone size={18} /> +91 6372942863
            </p>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Links</h2>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href="https://res.cloudinary.com/dg8u1dvhu/image/upload/v1738009727/MY_RESUME/dehhhaou3ggwnzjw8jxh.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Resume
                </a>
              </li>
              <li>
                <a
                  href="https://himansu-ranjan-profile.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Portfolio
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Social</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="https://www.facebook.com/himansuranjanpatra.sonu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                title="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/ranjan_himansu_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/himansu-ranjan-patra-6540b8202/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-500"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com/HimansuRanjan17"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-sky-500 dark:text-gray-400 dark:hover:text-sky-400"
                title="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://github.com/HimansuRanjan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                title="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-500 text-sm border-t border-gray-300 dark:border-gray-700 pt-4">
          © {new Date().getFullYear()} Himansu. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
